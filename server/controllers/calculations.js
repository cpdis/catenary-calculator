const Calculation = require('../models/Calculation');

// @desc    Get all calculations for a user
// @route   GET /api/calculations
// @access  Private
exports.getCalculations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };

    // Add tag filter if provided
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Execute query with pagination
    const calculations = await Calculation.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count for pagination
    const total = await Calculation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: calculations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving calculations'
    });
  }
};

// @desc    Get single calculation
// @route   GET /api/calculations/:id
// @access  Private
exports.getCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving calculation'
    });
  }
};

// @desc    Create new calculation
// @route   POST /api/calculations
// @access  Private
exports.createCalculation = async (req, res) => {
  try {
    // Add user to calculation data
    req.body.user = req.user.id;

    const calculation = await Calculation.create(req.body);

    res.status(201).json({
      success: true,
      data: calculation
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating calculation'
    });
  }
};

// @desc    Update calculation
// @route   PUT /api/calculations/:id
// @access  Private
exports.updateCalculation = async (req, res) => {
  try {
    let calculation = await Calculation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    // Update only allowed fields
    const allowedUpdates = ['name', 'notes', 'tags'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    calculation = await Calculation.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating calculation'
    });
  }
};

// @desc    Delete calculation
// @route   DELETE /api/calculations/:id
// @access  Private
exports.deleteCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found'
      });
    }

    await calculation.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting calculation'
    });
  }
};

// @desc    Get calculation statistics
// @route   GET /api/calculations/stats
// @access  Private
exports.getCalculationStats = async (req, res) => {
  try {
    const stats = await Calculation.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalCalculations: { $sum: 1 },
          avgSafetyFactor: { $avg: '$results.safetyFactor' },
          maxAnchorTension: { $max: '$results.anchorTension' },
          minAnchorTension: { $min: '$results.anchorTension' }
        }
      }
    ]);

    // Get most used component types
    const componentTypes = await Calculation.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$inputs.componentType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalCalculations: 0,
          avgSafetyFactor: 0,
          maxAnchorTension: 0,
          minAnchorTension: 0
        },
        componentTypes
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving calculation statistics'
    });
  }
};
