// server/routes/user/transactions.js
const express = require('express')
const { body, param, query } = require('express-validator')
const { authenticateToken } = require('../../middleware/auth')
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionOverview
} = require('../../controllers/user/transactionController')

const router = express.Router()

// Validation middleware
const validateTransaction = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .notEmpty()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description is required and must be less than 255 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('date')
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)')
]

const validateTransactionUpdate = [
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description must be less than 255 characters'),
  body('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)')
]

const validateTransactionId = [
  param('id')
    .isUUID()
    .withMessage('Invalid transaction ID')
]

const validateGetTransactions = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in valid ISO format (YYYY-MM-DD)'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in valid ISO format (YYYY-MM-DD)'),
  query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  query('category')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be less than 50 characters'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be 0 or greater')
]

const validateOverviewQuery = [
  query('period')
    .optional()
    .isIn(['week', 'month', 'year'])
    .withMessage('Period must be week, month, or year')
]

// Routes
// All routes require authentication
router.use(authenticateToken)

// GET /api/transactions - Get all transactions for user
router.get('/', 
  validateGetTransactions, 
  getTransactions
)

// POST /api/transactions - Create new transaction
router.post('/', 
  validateTransaction, 
  createTransaction
)

// PUT /api/transactions/:id - Update transaction
router.put('/:id', 
  validateTransactionId,
  validateTransactionUpdate, 
  updateTransaction
)

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', 
  validateTransactionId,
  deleteTransaction
)

module.exports = router