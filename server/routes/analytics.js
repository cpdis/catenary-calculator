const express = require('express');
const router = express.Router();
const {
  logEvent,
  getUserAnalytics,
  getSystemAnalytics
} = require('../controllers/analytics');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.post('/log', logEvent);
router.get('/user', getUserAnalytics);
router.get('/system', getSystemAnalytics);

module.exports = router;
