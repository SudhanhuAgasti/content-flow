import { Content } from '../models/Content.js';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { generateUniqueSlug } from '../services/slugService.js';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../services/cloudinaryService.js';

/**
 * @desc   Get paginated list of all content with advanced filtering & KPI metrics (Admin)
 * @route  GET /api/admin/content
 * @access Private
 */
export const getAllAdminContent = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { status, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = {};

    // Status filter
    if (status && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter across title and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel for high performance
    const [contents, totalCount, totalAll, totalPublished, totalDrafts, totalCategories] =
      await Promise.all([
        Content.find(filter)
          .populate('category', 'name slug')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Content.countDocuments(filter),
        Content.countDocuments(),
        Content.countDocuments({ status: 'published' }),
        Content.countDocuments({ status: 'draft' }),
        Category.countDocuments(),
      ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      200,
      'Content records retrieved successfully',
      {
        contents,
        metrics: {
          total: totalAll,
          published: totalPublished,
          draft: totalDrafts,
          categories: totalCategories,
        },
      },
      {
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single content record by ID (Admin)
 * @route  GET /api/admin/content/:id
 * @access Private
 */
export const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id).populate('category', 'name slug');
    if (!content) {
      throw ApiError.notFound('Content record not found');
    }

    return sendResponse(res, 200, 'Content record retrieved', { content });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new content with image upload
 * @route  POST /api/admin/content
 * @access Private
 */
export const createContent = async (req, res, next) => {
  try {
    const { title, description, content, category, status } = req.body;

    // Verify category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      throw ApiError.badRequest('Selected category does not exist');
    }

    // Require an image file
    if (!req.file) {
      throw ApiError.badRequest('A featured image is required to publish or create content.');
    }

    // Upload image to Cloudinary
    const imageData = await uploadImageToCloudinary(req.file.buffer, 'contentflow/articles');

    // Generate unique slug
    const slug = await generateUniqueSlug(Content, title);

    const isPublished = status === 'published';

    const newContent = await Content.create({
      title,
      slug,
      description,
      content,
      category,
      image: {
        url: imageData.url,
        publicId: imageData.publicId,
      },
      status: isPublished ? 'published' : 'draft',
      publishedAt: isPublished ? new Date() : null,
    });

    const populated = await newContent.populate('category', 'name slug');

    return sendResponse(res, 201, 'Content created successfully', {
      content: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing content with optional image replacement
 * @route  PUT /api/admin/content/:id
 * @access Private
 */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content, category, status } = req.body;

    const existingContent = await Content.findById(id);
    if (!existingContent) {
      throw ApiError.notFound('Content record not found');
    }

    // If category is being updated, verify it exists
    if (category && category !== existingContent.category.toString()) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        throw ApiError.badRequest('Selected category does not exist');
      }
      existingContent.category = category;
    }

    // Update title & regenerate slug if title changed
    if (title && title !== existingContent.title) {
      existingContent.title = title;
      existingContent.slug = await generateUniqueSlug(Content, title, id);
    }

    if (description) existingContent.description = description;
    if (content) existingContent.content = content;

    // Status transition handling
    if (status && status !== existingContent.status) {
      existingContent.status = status;
      if (status === 'published' && !existingContent.publishedAt) {
        existingContent.publishedAt = new Date();
      }
    }

    // Image replacement handling: if a new file is uploaded
    if (req.file) {
      const oldPublicId = existingContent.image?.publicId;
      const newImageData = await uploadImageToCloudinary(req.file.buffer, 'contentflow/articles');

      existingContent.image = {
        url: newImageData.url,
        publicId: newImageData.publicId,
      };

      // Safely delete old asset from Cloudinary
      if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
      }
    }

    await existingContent.save();
    const updated = await existingContent.populate('category', 'name slug');

    return sendResponse(res, 200, 'Content updated successfully', {
      content: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete content record and purge its Cloudinary asset
 * @route  DELETE /api/admin/content/:id
 * @access Private
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content) {
      throw ApiError.notFound('Content record not found');
    }

    // Purge image from Cloudinary
    if (content.image?.publicId) {
      await deleteImageFromCloudinary(content.image.publicId);
    }

    await Content.findByIdAndDelete(id);

    return sendResponse(res, 200, 'Content deleted successfully', { id });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Toggle content publication status ('draft' <-> 'published')
 * @route  PATCH /api/admin/content/:id/status
 * @access Private
 */
export const toggleContentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const content = await Content.findById(id);
    if (!content) {
      throw ApiError.notFound('Content record not found');
    }

    content.status = status;
    if (status === 'published' && !content.publishedAt) {
      content.publishedAt = new Date();
    }

    await content.save();
    const populated = await content.populate('category', 'name slug');

    return sendResponse(res, 200, `Content status updated to ${status}`, {
      content: populated,
    });
  } catch (error) {
    next(error);
  }
};

