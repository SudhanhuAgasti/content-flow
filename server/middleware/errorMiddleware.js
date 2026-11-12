import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

/**
 * Handle requests to non-existent API endpoints (404)
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Endpoint not found: [${req.method}] ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized Application Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // Handle JWT malformed or signature error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  // Handle Multer upload limits
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Image upload exceeds maximum allowed file size (5MB).';
  }

  // Log non-operational (server crash) errors
  if (!err.isOperational && statusCode === 500) {
    console.error('[Unhandled Internal Error]:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};

