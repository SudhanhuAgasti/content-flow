import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { connectDB, closeDB } from '../config/db.js';

const defaultCategories = [
  {
    name: 'Engineering & Architecture',
    description: 'Deep dives into full-stack architecture, clean code practices, and system scalability.',
  },
  {
    name: 'Product Design & UX',
    description: 'Interface design patterns, user ergonomics, accessibility, and SaaS design systems.',
  },
  {
    name: 'Cloud & Infrastructure',
    description: 'DevOps pipelines, serverless deployments, containerization, and database optimization.',
  },
  {
    name: 'Artificial Intelligence',
    description: 'Applied machine learning, generative workflows, agentic architectures, and modern AI.',
  },
  {
    name: 'Security & Compliance',
    description: 'Authentication protocols, web security defense, OWASP guidelines, and data protection.',
  },
];

const seedDatabase = async () => {
  console.log('--- Starting ContentFlow Database Seed ---');

  const conn = await connectDB();
  if (!conn) {
    console.error('[Seed Error] Could not establish MongoDB connection.');
    process.exit(1);
  }

  try {
    // 1. Seed or Verify Administrator Account
    console.log(`[Seed] Checking for administrator account: ${env.ADMIN_EMAIL}...`);
    let admin = await Admin.findOne({ email: env.ADMIN_EMAIL });

    if (!admin) {
      admin = await Admin.create({
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log(`[Seed Success] Created default administrator: ${admin.email}`);
    } else {
      console.log(`[Seed Info] Administrator already exists: ${admin.email}`);
    }

    // 2. Seed Default Categories
    console.log('[Seed] Seeding default categories...');
    let createdCategoryCount = 0;

    for (const catData of defaultCategories) {
      const exists = await Category.findOne({ name: catData.name });
      if (!exists) {
        await Category.create(catData);
        createdCategoryCount += 1;
      }
    }

    const totalCategories = await Category.countDocuments();
    console.log(`[Seed Success] Added ${createdCategoryCount} new categories. Total in database: ${totalCategories}`);

    console.log('=======================================================');
    console.log('  CONTENTFLOW DATABASE SEED COMPLETED                  ');
    console.log(`  Admin Email:     ${env.ADMIN_EMAIL}                  `);
    console.log(`  Admin Password:  ${env.ADMIN_PASSWORD}               `);
    console.log(`  Categories:      ${totalCategories} active categories`);
    console.log('=======================================================');
  } catch (error) {
    console.error('[Seed Error] Database seeding encountered an error:', error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

seedDatabase();

