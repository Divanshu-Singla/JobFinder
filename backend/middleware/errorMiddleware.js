// backend/middleware/errorMiddleware.js
// Centralized error handling middleware

const logger = require('../config/logger');

/**
 * Custom API Error class for structured error responses
 */
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware - must be placed AFTER all routes
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error details
  logger.error(`Error: ${error.message}`, {
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File size too large';
      error.statusCode = 400;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Unexpected file field';
      error.statusCode = 400;
    }
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    msg: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new APIError(`Route not found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  APIError,
  errorHandler,
  notFound,
  asyncHandler
};
