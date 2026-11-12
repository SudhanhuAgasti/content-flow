import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../middleware/authMiddleware.js';

/**
 * @desc   Authenticate Admin and issue JWT session cookie
 * @route  POST /api/auth/login
 * @access Public (Protected by Rate Limiter)
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve admin along with password hash
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Verify password hash
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    // Generate JWT and set secure HTTP-only cookie
    const token = generateToken(admin._id);
    setAuthCookie(res, token);

    // Prepare safe sanitized admin data
    const adminData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return sendResponse(res, 200, 'Admin authenticated successfully', {
      admin: adminData,
      token, // Also returned for API clients/Postman testing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Clear Admin session cookie
 * @route  POST /api/auth/logout
 * @access Private
 */
export const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);
    return sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current authenticated admin profile
 * @route  GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res, next) => {
  try {
    const adminData = {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      createdAt: req.admin.createdAt,
    };

    return sendResponse(res, 200, 'Current admin session retrieved', {
      admin: adminData,
    });
  } catch (error) {
    next(error);
  }
};

