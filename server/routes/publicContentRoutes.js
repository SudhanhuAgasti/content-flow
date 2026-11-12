import { Router } from 'express';
import {
  getPublishedContent,
  getContentBySlug,
  getCategoryContentBySlug,
} from '../controllers/publicContentController.js';
import { getPublicCategories } from '../controllers/categoryController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply general rate limiter on public reading APIs
router.use(apiLimiter);

// Public categories
router.get('/categories', getPublicCategories);
router.get('/categories/:slug/content', getCategoryContentBySlug);

// Public content
router.get('/content', getPublishedContent);
router.get('/content/:slug', getContentBySlug);

export default router;

