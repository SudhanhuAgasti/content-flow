import { api } from './api.js';

export const authService = {
  /**
   * Log in administrator with email and password
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Log out currently authenticated administrator
   */
  logout: async () => {
    return api.post('/auth/logout');
  },

  /**
   * Check session status and retrieve logged-in admin data
   */
  getMe: async () => {
    return api.get('/auth/me');
  },
};
