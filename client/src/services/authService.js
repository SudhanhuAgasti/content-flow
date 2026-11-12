import { api } from './api.js';

export const authService = {
  /**
   * Log in administrator with email and password
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Fetch Google Client ID securely from server configuration
   */
  getGoogleClientId: async () => {
    return api.get('/auth/google/client-id');
  },

  /**
   * Log in or register administrator via Google OAuth credential token
   */
  googleAuth: async (credential) => {
    return api.post('/auth/google', { credential });
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

