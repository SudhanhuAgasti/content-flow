import app from './app.js';
import { env } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Listen on configured port
  const server = app.listen(env.PORT, () => {
    console.log(`=======================================================`);
    console.log(`  CONTENTFLOW CMS BACKEND ENGINE RUNNING               `);
    console.log(`  Mode:        ${env.NODE_ENV}                         `);
    console.log(`  Port:        ${env.PORT}                             `);
    console.log(`  API Health:  http://localhost:${env.PORT}/api/health   `);
    console.log(`  Client URL:  ${env.CLIENT_URL}                       `);
    console.log(`=======================================================`);
  });

  // Graceful shutdown handlers
  const shutdown = async (signal) => {
    console.log(`\n[Process] ${signal} signal received. Closing HTTP server and database...`);
    server.close(async () => {
      console.log('[Process] HTTP server closed.');
      await closeDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[Process Error] Failed to bootstrap server:', err);
  process.exit(1);
});

