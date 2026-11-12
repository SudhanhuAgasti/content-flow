import { api } from './api.js';

export const categoryService = {
  /**
   * Fetch all categories with article counts (Admin)
   */
  getAdminCategories: async () => {
    return api.get('/admin/categories');
  },

  /**
   * Create a new category
   */
  createCategory: async (data) => {
    return api.post('/admin/categories', data);
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id, data) => {
    return api.put(`/admin/categories/${id}`, data);
  },

  /**
   * Delete category (fails safely if articles are assigned)
   */
  deleteCategory: async (id) => {
    return api.delete(`/admin/categories/${id}`);
  },

  /**
   * Fetch public categories with published counts
   */
  getPublicCategories: async () => {
    return api.get('/public/categories');
  },
};
