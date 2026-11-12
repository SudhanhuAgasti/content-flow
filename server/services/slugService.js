import slugify from 'slugify';
import mongoose from 'slugify';

/**
 * Generate a unique URL slug for any Mongoose model.
 * If slug exists (e.g., 'mastering-mern'), it appends a counter (e.g., 'mastering-mern-1').
 * 
 * @param {import('mongoose').Model} Model - The Mongoose model to query
 * @param {string} text - The input title/text to slugify
 * @param {string|null} currentDocId - ID of document being updated (to ignore itself)
 * @returns {Promise<string>} The unique slug
 */
export const generateUniqueSlug = async (Model, text, currentDocId = null) => {
  const baseSlug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  }) || 'untitled';

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug: uniqueSlug };
    if (currentDocId) {
      query._id = { $ne: currentDocId };
    }

    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return uniqueSlug;
    }

    uniqueSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

