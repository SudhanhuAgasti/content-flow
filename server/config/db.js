import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Connect to MongoDB with robust connection management and event logging.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true, // Build indexes in development
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn(`[Database Notice] Please verify that your MongoDB service is running or provide a valid MONGODB_URI in server/.env`);
    return null;
  }
};

// Connection lifecycle event hooks
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] MongoDB runtime connection error: ${err.message}`);
});

/**
 * Gracefully close database connection.
 */
export const closeDB = async () => {
  await mongoose.connection.close();
  console.log('[Database] MongoDB connection closed.');
};

