import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { sendResponse } from './utils/apiResponse.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminContentRoutes from './routes/adminContentRoutes.js';
import publicContentRoutes from './routes/publicContentRoutes.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing (CORS) with Credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        env.CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Root Health Check Route
app.get('/api/health', (req, res) => {
  return sendResponse(res, 200, 'ContentFlow API Gateway is operational', {
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/content', adminContentRoutes);
app.use('/api/public', publicContentRoutes);

// Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
