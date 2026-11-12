import { Router } from 'express';
import { login, googleAuth, logout, getMe } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validateMiddleware.js';
import { loginSchema } from '../validators/authValidators.js';

const router = Router();

// Public auth routes (rate-limited)
router.get('/google/client-id', (req, res) => {
  res.json({ success: true, clientId: process.env.GOOGLE_CLIENT_ID || '' });
});
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, googleAuth);

// Protected auth routes
router.post('/logout', protectAdmin, logout);
router.get('/me', protectAdmin, getMe);

export default router;

