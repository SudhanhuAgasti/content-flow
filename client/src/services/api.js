import axios from 'axios';

/**
 * Centralized Axios HTTP Client
 * - Sets base API route
 * - Enables cross-origin credentials (HTTP-only cookies)
 * - Standardizes error handling and response unwrapping
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for unwrapping standard { success, message, data, meta } payloads
api.interceptors.response.use(
  (response) => {
    // Return standard response data directly
    return response.data;
  },
  (error) => {
    // Extract server message or fallback to client error
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    const customError = new Error(message);
    customError.statusCode = error.response?.status || 500;
    customError.errors = error.response?.data?.errors || [];
    customError.raw = error;

    return Promise.reject(customError);
  }
);

