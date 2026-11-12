import { Router } from 'express';
import {
  getAllAdminContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  toggleContentStatus,
} from '../controllers/adminContentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createContentSchema,
  updateContentSchema,
  toggleStatusSchema,
} from '../validators/contentValidators.js';

const router = Router();

// Protect all admin content endpoints
router.use(protectAdmin);

router.route('/')
  .get(getAllAdminContent)
  .post(uploadSingleImage, validate(createContentSchema), createContent);

router.route('/:id')
  .get(getContentById)
  .put(uploadSingleImage, validate(updateContentSchema), updateContent)
  .delete(deleteContent);

router.patch('/:id/status', validate(toggleStatusSchema), toggleContentStatus);

export default router;

