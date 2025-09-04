// server/routes/user/analytics.js
const express = require('express')
const { query } = require('express-validator')
const { authenticateToken } = require('../../middleware/auth')
const { getTransactionOverview } = require('../../controllers/user/transactionController')

const router = express.Router()

// Validation
const validateOverviewQuery = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be week, month, or year')
]

// All routes require authentication
router.use(authenticateToken)

// GET /api/analytics/overview - Get transaction overview/stats
router.get('/overview', 
  validateOverviewQuery,
  getTransactionOverview
)

module.exports = router