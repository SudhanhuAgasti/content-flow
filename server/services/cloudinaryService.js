import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';

/**
 * Upload an image buffer to Cloudinary using stream upload.
 * If Cloudinary credentials are not configured, invalid, or offline, provides an encoded base64/placeholder fallback.
 * 
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadImageToCloudinary = async (buffer, folder = 'contentflow') => {
  const isCloudinaryConfigured = Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET &&
    env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    env.CLOUDINARY_CLOUD_NAME !== 'contentflow_demo'
  );

  // Helper for generating resilient local fallback
  const getFallback = () => {
    const fallbackId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Data}`;
    return {
      url: dataUrl,
      publicId: fallbackId,
    };
  };

  if (!isCloudinaryConfigured) {
    return getFallback();
  }

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1400, height: 900, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.warn('[Cloudinary Notice] Cloudinary upload did not complete with remote API. Using resilient buffer fallback.');
          return resolve(getFallback());
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

/**
 * Delete an image asset from Cloudinary by its public ID.
 * 
 * @param {string} publicId - Cloudinary public ID
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('local_') || publicId === 'contentflow/default') {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn(`[Cloudinary Warning] Could not remove asset ${publicId}:`, error.message);
  }
};
