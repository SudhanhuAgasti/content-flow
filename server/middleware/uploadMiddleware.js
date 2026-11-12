import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

// Memory storage keeps file buffer in RAM for direct streaming to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type (${file.mimetype}). Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.`
      ),
      false
    );
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
}).single('image');

