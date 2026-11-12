import { ApiError } from '../utils/apiError.js';

/**
 * Deep sanitization function to strip MongoDB operator injection keys ($where, $gt, etc.)
 */
const sanitizeInput = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    // Drop keys starting with $ or containing dots (MongoDB injection prevention)
    if (!key.startsWith('$') && !key.includes('.')) {
      clean[key] = sanitizeInput(value);
    }
  }
  return clean;
};

/**
 * Higher-order middleware to sanitize and validate incoming request data using Zod schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} source
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      // 1. Sanitize input to remove dangerous query operator keys
      if (req[source]) {
        req[source] = sanitizeInput(req[source]);
      }

      // 2. Validate against strict Zod schema
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(new ApiError(400, 'Validation Error', formattedErrors));
      }
      next(error);
    }
  };
};
