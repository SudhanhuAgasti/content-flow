import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .trim()
    .min(2, 'Category name must be at least 2 characters long')
    .max(60, 'Category name cannot exceed 60 characters'),
  description: z
    .string()
    .max(300, 'Description cannot exceed 300 characters')
    .optional()
    .default(''),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters long')
    .max(60, 'Category name cannot exceed 60 characters')
    .optional(),
  description: z
    .string()
    .max(300, 'Description cannot exceed 300 characters')
    .optional(),
});

