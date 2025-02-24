const express = require('express');
const router = express.Router();
const {
  getCalculations,
  getCalculation,
  createCalculation,
  updateCalculation,
  deleteCalculation,
  getCalculationStats
} = require('../controllers/calculations');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes
router.route('/')
  .get(getCalculations)
  .post(createCalculation);

router.route('/stats')
  .get(getCalculationStats);

router.route('/:id')
  .get(getCalculation)
  .put(updateCalculation)
  .delete(deleteCalculation);

module.exports = router;
