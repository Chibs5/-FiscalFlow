// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FiscalFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRoutes = require('./routes/user/auth');
const transactionRoutes = require('./routes/user/transactions');
const analyticsRoutes = require('./routes/user/analytics');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to FiscalFlow API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      transactions: '/api/transactions/*',
      analytics: '/api/analytics/*'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'GET /api/transactions',
      'POST /api/transactions',
      'PUT /api/transactions/:id',
      'DELETE /api/transactions/:id',
      'GET /api/analytics/overview'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FiscalFlow API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Available routes:`);
  console.log(`   - POST /api/transactions (create transaction)`);
  console.log(`   - GET /api/transactions (get transactions)`);
  console.log(`   - GET /api/analytics/overview (get stats)`);
});