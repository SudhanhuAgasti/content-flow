import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createContentSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters'),
  content: z
    .string({ required_error: 'Content body is required' })
    .min(10, 'Content body must be at least 10 characters long'),
  category: z
    .string({ required_error: 'Category ID is required' })
    .regex(objectIdRegex, 'Invalid Category ID format'),
  status: z
    .enum(['draft', 'published'])
    .optional()
    .default('draft'),
});

export const updateContentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  content: z
    .string()
    .min(10, 'Content body must be at least 10 characters long')
    .optional(),
  category: z
    .string()
    .regex(objectIdRegex, 'Invalid Category ID format')
    .optional(),
  status: z
    .enum(['draft', 'published'])
    .optional(),
});

export const toggleStatusSchema = z.object({
  status: z.enum(['draft', 'published'], {
    required_error: 'Status must be either draft or published',
  }),
});

