import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { Admin } from '../models/Admin.js';

export const COOKIE_NAME = 'cf_token';

/**
 * Generate signed JWT token
 * @param {string} adminId
 * @returns {string}
 */
export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Set HTTP-Only Cookie with cross-origin & security attributes
 */
export const setAuthCookie = (res, token) => {
  const isProduction = env.isProduction;

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction, // HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Lax for local dev across ports
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  });
};

/**
 * Clear Authentication Cookie on Logout
 */
export const clearAuthCookie = (res) => {
  const isProduction = env.isProduction;

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};

/**
 * Authentication Middleware: Protects private Admin API routes
 */
export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first
    if (req.cookies && req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }
    // 2. Check Authorization Bearer header as secondary fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. No session token found.');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Verify admin still exists in database
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      throw ApiError.unauthorized('Admin account associated with this session no longer exists.');
    }

    // Attach verified admin to request context
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid authentication token signature.'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Authentication session expired. Please log in again.'));
    }
    next(error);
  }
};

