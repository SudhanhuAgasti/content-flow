import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../middleware/authMiddleware.js';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

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
      avatar: admin.avatar,
      authProvider: admin.authProvider,
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
 * @desc   Authenticate or register admin via Google OAuth ID Token
 * @route  POST /api/auth/google
 * @access Public (Protected by Rate Limiter)
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      throw ApiError.badRequest('Google ID credential token is required.');
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID || undefined,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      throw ApiError.unauthorized('Invalid or expired Google OAuth credential: ' + (verifyErr.message || 'Verification failed'));
    }

    if (!payload || !payload.email) {
      throw ApiError.unauthorized('Google account did not provide an email address.');
    }

    const { email, name, sub: googleId, picture } = payload;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if an admin exists with this email or googleId
    let admin = await Admin.findOne({
      $or: [{ email: normalizedEmail }, { googleId }],
    });

    if (admin) {
      // If admin exists but googleId was not linked yet, securely link it
      let needsSave = false;
      if (!admin.googleId) {
        admin.googleId = googleId;
        needsSave = true;
      }
      if (!admin.avatar && picture) {
        admin.avatar = picture;
        needsSave = true;
      }
      if (needsSave) {
        await admin.save();
      }
    } else {
      // First-time registration through Google OAuth
      admin = await Admin.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId,
        avatar: picture || '',
        authProvider: 'google',
        role: 'admin',
      });
    }

    // Generate JWT and set secure HTTP-only cookie
    const token = generateToken(admin._id);
    setAuthCookie(res, token);

    const adminData = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      authProvider: admin.authProvider,
    };

    return sendResponse(res, 200, 'Authenticated with Google successfully', {
      admin: adminData,
      token,
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
      avatar: req.admin.avatar,
      authProvider: req.admin.authProvider,
      createdAt: req.admin.createdAt,
    };

    return sendResponse(res, 200, 'Current admin session retrieved', {
      admin: adminData,
    });
  } catch (error) {
    next(error);
  }
};

