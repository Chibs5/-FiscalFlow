// routes/user/auth.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const authConfig = require('../../config/auth');
const { authenticateToken } = require('../../middleware/auth');
const {
  register,
  login,
  getProfile,
  verifyToken
} = require('../../controllers/user/authController');

const router = express.Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit(authConfig.rateLimit);
const loginLimiter = rateLimit(authConfig.loginRateLimit);

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Routes
router.post('/register', 
  authLimiter, 
  validateRegistration, 
  checkValidation, 
  register
);

router.post('/login', 
  loginLimiter, 
  validateLogin, 
  checkValidation, 
  login
);

router.get('/profile', 
  authenticateToken, 
  getProfile
);

router.get('/verify', 
  authenticateToken, 
  verifyToken
);

module.exports = router;