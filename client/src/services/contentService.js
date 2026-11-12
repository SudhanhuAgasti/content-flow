import { api } from './api.js';

export const contentService = {
  /**
   * Fetch paginated content for admin table with filters and KPI metrics
   */
  getAdminContent: async (params = {}) => {
    return api.get('/admin/content', { params });
  },

  /**
   * Fetch single content record by ID (for admin editing)
   */
  getContentById: async (id) => {
    return api.get(`/admin/content/${id}`);
  },

  /**
   * Create new content with multipart form data (image file)
   */
  createContent: async (formData) => {
    return api.post('/admin/content', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Update existing content with optional image file replacement
   */
  updateContent: async (id, formData) => {
    return api.put(`/admin/content/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete content record
   */
  deleteContent: async (id) => {
    return api.delete(`/admin/content/${id}`);
  },

  /**
   * Toggle publication status ('draft' | 'published')
   */
  toggleStatus: async (id, status) => {
    return api.patch(`/admin/content/${id}/status`, { status });
  },

  /**
   * Fetch published content for public web visitors
   */
  getPublicContent: async (params = {}) => {
    return api.get('/public/content', { params });
  },

  /**
   * Fetch single published article by unique slug
   */
  getPublicContentBySlug: async (slug) => {
    return api.get(`/public/content/${slug}`);
  },
};
