import { Category } from '../models/Category.js';
import { Content } from '../models/Content.js';
import { ApiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import slugify from 'slugify';

/**
 * @desc   Get all categories with article counts (Admin)
 * @route  GET /api/admin/categories
 * @access Private
 */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Attach content count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const totalContent = await Content.countDocuments({ category: cat._id });
        const publishedContent = await Content.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          ...cat,
          totalContent,
          publishedContent,
        };
      })
    );

    return sendResponse(res, 200, 'Categories retrieved successfully', {
      categories: categoriesWithCount,
      total: categoriesWithCount.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new category
 * @route  POST /api/admin/categories
 * @access Private
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      throw ApiError.conflict(`A category named "${name}" already exists.`);
    }

    const category = await Category.create({ name, description });

    return sendResponse(res, 201, 'Category created successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update category
 * @route  PUT /api/admin/categories/:id
 * @access Private
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    if (name && name !== category.name) {
      const duplicate = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id },
      });
      if (duplicate) {
        throw ApiError.conflict(`Category "${name}" already exists.`);
      }
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true, trim: true });
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    return sendResponse(res, 200, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete category (only if no content references it)
 * @route  DELETE /api/admin/categories/:id
 * @access Private
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    // Check if any content is using this category
    const associatedContentCount = await Content.countDocuments({ category: id });
    if (associatedContentCount > 0) {
      throw ApiError.badRequest(
        `Cannot delete category "${category.name}". It is associated with ${associatedContentCount} article(s). Please reassign or delete the articles first.`
      );
    }

    await Category.findByIdAndDelete(id);

    return sendResponse(res, 200, 'Category deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get public categories with published article counts
 * @route  GET /api/public/categories
 * @access Public
 */
export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();

    // Only count published content for public readers
    const publicList = await Promise.all(
      categories.map(async (cat) => {
        const count = await Content.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          publishedCount: count,
        };
      })
    );

    return sendResponse(res, 200, 'Public categories retrieved', {
      categories: publicList,
    });
  } catch (error) {
    next(error);
  }
};

