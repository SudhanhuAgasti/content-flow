/**
 * Standardized API Response Helper
 * Ensures every endpoint conforms strictly to:
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": { ... }
 * }
 */
export const sendResponse = (res, statusCode = 200, message = 'Success', data = null, meta = undefined) => {
  const payload = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data: data !== undefined ? data : {},
  };

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

