const Analytics = require('../models/Analytics');
const Calculation = require('../models/Calculation');

// @desc    Log analytics event
// @route   POST /api/analytics/log
// @access  Private
exports.logEvent = async (req, res) => {
  try {
    const { eventType, metadata } = req.body;
    
    const analytics = await Analytics.create({
      user: req.user.id,
      eventType,
      metadata,
      sessionId: req.headers['x-session-id'],
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error logging analytics event'
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {
      user: req.user.id
    };

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get event counts by type
    const eventCounts = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get average calculation duration
    const calculationDuration = await Analytics.aggregate([
      {
        $match: {
          user: req.user._id,
          eventType: 'CALCULATION_COMPLETED',
          'metadata.duration': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$metadata.duration' }
        }
      }
    ]);

    // Get most used component types
    const componentTypes = await Analytics.aggregate([
      {
        $match: {
          user: req.user._id,
          eventType: 'COMPONENT_SELECTED',
          'metadata.componentType': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$metadata.componentType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get error frequency
    const errors = await Analytics.aggregate([
      {
        $match: {
          user: req.user._id,
          eventType: 'CALCULATION_ERROR'
        }
      },
      {
        $group: {
          _id: '$metadata.errorMessage',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        eventCounts,
        calculationDuration: calculationDuration[0]?.avgDuration || 0,
        componentTypes,
        errors
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving analytics'
    });
  }
};

// @desc    Get system-wide analytics
// @route   GET /api/analytics/system
// @access  Private (Admin only)
exports.getSystemAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get total users
    const totalUsers = await Analytics.distinct('user').length;

    // Get total calculations
    const totalCalculations = await Calculation.countDocuments();

    // Get active users by day
    const activeUsers = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            user: '$user'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get system performance metrics
    const performance = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgCalculationTime: {
            $avg: {
              $cond: [
                { $eq: ['$eventType', 'CALCULATION_COMPLETED'] },
                '$metadata.duration',
                null
              ]
            }
          },
          totalErrors: {
            $sum: {
              $cond: [
                { $eq: ['$eventType', 'CALCULATION_ERROR'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get browser/platform statistics
    const platforms = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$metadata.platform',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCalculations,
        activeUsers,
        performance: performance[0],
        platforms
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving system analytics'
    });
  }
};
