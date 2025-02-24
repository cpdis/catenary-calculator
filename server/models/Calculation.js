const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    trim: true,
    default: 'Untitled Calculation'
  },
  inputs: {
    componentType: {
      type: String,
      required: [true, 'Component type is required']
    },
    componentSize: {
      type: String,
      required: [true, 'Component size is required']
    },
    componentLength: {
      type: Number,
      required: [true, 'Component length is required']
    },
    waterDepth: {
      type: Number,
      required: [true, 'Water depth is required']
    },
    componentWeight: {
      type: Number,
      required: [true, 'Component weight is required']
    },
    componentStiffness: {
      type: Number,
      required: [true, 'Component stiffness is required']
    },
    componentMBL: {
      type: Number,
      required: [true, 'Component MBL is required']
    },
    fairleadTension: {
      type: Number,
      required: [true, 'Fairlead tension is required']
    }
  },
  results: {
    fairleadAngle: {
      type: Number,
      required: true
    },
    groundedLength: {
      type: Number,
      required: true
    },
    anchorDistance: {
      type: Number,
      required: true
    },
    anchorAngle: {
      type: Number,
      required: true
    },
    anchorTension: {
      type: Number,
      required: true
    },
    safetyFactor: {
      type: Number,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
});

// Add indexes for better query performance
calculationSchema.index({ user: 1, createdAt: -1 });
calculationSchema.index({ tags: 1 });

module.exports = mongoose.model('Calculation', calculationSchema);
