import { Router } from 'express';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categoryValidators.js';

const router = Router();

// Protect all admin category routes
router.use(protectAdmin);

router.route('/')
  .get(getAdminCategories)
  .post(validate(createCategorySchema), createCategory);

router.route('/:id')
  .put(validate(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;

