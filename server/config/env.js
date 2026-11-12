import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contentflow',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'fallback_cookie_secret',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  ADMIN_NAME: process.env.ADMIN_NAME || 'ContentFlow Administrator',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@contentflow.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@SecurePass2026!',
  isProduction: process.env.NODE_ENV === 'production',
};

