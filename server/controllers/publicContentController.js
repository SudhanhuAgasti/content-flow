import { Content } from '../models/Content.js';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/apiError.js';
import { sendResponse } from '../utils/apiResponse.js';

/**
 * @desc   Get published content list with search, category filtering & pagination (Public)
 * @route  GET /api/public/content
 * @access Public
 */
export const getPublishedContent = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const { category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Strict security rule: Only query published content
    const filter = { status: 'published' };

    // Filter by Category slug or ID
    if (category && category !== 'all') {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
      let categoryDoc = null;

      if (isObjectId) {
        categoryDoc = await Category.findById(category).select('_id');
      } else {
        categoryDoc = await Category.findOne({ slug: category.toLowerCase() }).select('_id');
      }

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // If specified category doesn't exist, return empty list
        return sendResponse(
          res,
          200,
          'No articles found for the given category',
          { contents: [] },
          {
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalCount: 0,
              limit,
              hasNextPage: false,
              hasPrevPage: false,
            },
          }
        );
      }
    }

    // Search query across title and description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Query published articles and total count
    const [contents, totalCount] = await Promise.all([
      Content.find(filter)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      200,
      'Published articles retrieved successfully',
      { contents },
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
 * @desc   Get single published article by unique slug (Public)
 * @route  GET /api/public/content/:slug
 * @access Public
 */
export const getContentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Strictly ensure status is published
    const content = await Content.findOne({
      slug: slug.toLowerCase(),
      status: 'published',
    }).populate('category', 'name slug description');

    if (!content) {
      throw ApiError.notFound('The requested article was not found or has been unpublished.');
    }

    // Fetch related published articles from the same category
    const relatedContent = await Content.find({
      category: content.category._id,
      _id: { $ne: content._id },
      status: 'published',
    })
      .select('title slug description image publishedAt createdAt')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return sendResponse(res, 200, 'Article details retrieved', {
      content,
      relatedContent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get category info and its published articles by category slug (Public)
 * @route  GET /api/public/categories/:slug/content
 * @access Public
 */
export const getCategoryContentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug: slug.toLowerCase() }).lean();
    if (!category) {
      throw ApiError.notFound(`Category "${slug}" not found.`);
    }

    const filter = {
      category: category._id,
      status: 'published',
    };

    const [contents, totalCount] = await Promise.all([
      Content.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return sendResponse(
      res,
      200,
      `Articles for category ${category.name} retrieved`,
      {
        category,
        contents,
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

