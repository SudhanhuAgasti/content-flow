import { ApiError } from '../utils/apiError.js';

/**
 * Higher-order middleware to validate incoming request data using Zod schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} source
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
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

