const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'CALCULATION_STARTED',
      'CALCULATION_COMPLETED',
      'CALCULATION_ERROR',
      'CALCULATION_VIEWED',
      'CALCULATION_EXPORTED',
      'USER_LOGIN',
      'USER_LOGOUT',
      'COMPONENT_SELECTED',
      'VISUALIZATION_INTERACTION'
    ]
  },
  metadata: {
    calculationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calculation'
    },
    componentType: String,
    componentSize: String,
    exportFormat: String,
    errorMessage: String,
    interactionType: String,
    duration: Number,
    browser: String,
    platform: String,
    screenSize: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    required: true
  },
  ipAddress: String,
  userAgent: String
});

// Add indexes for better query performance
analyticsSchema.index({ user: 1, timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
