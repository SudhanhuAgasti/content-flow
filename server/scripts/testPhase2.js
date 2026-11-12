import mongoose from 'mongoose';
import { env } from '../config/env.js';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';

const runTests = async () => {
  console.log('--- STARTING PHASE 2 AUTOMATED INTEGRATION TESTS ---');
  await connectDB();

  const server = app.listen(5001, () => {
    console.log('[Test Server] Running on http://127.0.0.1:5001');
  });

  try {
    const baseUrl = 'http://127.0.0.1:5001/api';

    // TEST 1: Health check
    console.log('\n[Test 1] Testing Health Endpoint...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}, Message: ${healthData.message}`);
    if (healthRes.status !== 200) throw new Error('Health check failed');

    // TEST 2: Invalid Admin Login
    console.log('\n[Test 2] Testing Invalid Admin Login...');
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: 'WrongPassword123!' }),
    });
    const badLoginData = await badLoginRes.json();
    console.log(`Status: ${badLoginRes.status}, Error Message: ${badLoginData.message}`);
    if (badLoginRes.status !== 401) throw new Error('Invalid login did not return 401');

    // TEST 3: Valid Admin Login
    console.log('\n[Test 3] Testing Valid Admin Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
    });
    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}, Message: ${loginData.message}`);
    if (loginRes.status !== 200 || !loginData.data.token) throw new Error('Admin login failed');
    const token = loginData.data.token;

    // TEST 4: Get Admin Profile (Auth Verification)
    console.log('\n[Test 4] Testing GET /api/auth/me...');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}, Admin Name: ${meData.data.admin.name}`);
    if (meRes.status !== 200) throw new Error('/api/auth/me failed');

    // TEST 5: Get Admin Categories
    console.log('\n[Test 5] Testing GET /api/admin/categories...');
    const catRes = await fetch(`${baseUrl}/admin/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const catData = await catRes.json();
    console.log(`Status: ${catRes.status}, Categories Found: ${catData.data.total}`);
    if (catRes.status !== 200 || catData.data.categories.length === 0) {
      throw new Error('Failed to retrieve categories');
    }
    const sampleCategory = catData.data.categories[0];

    // TEST 6: Create Content via Admin API (Multipart form simulation)
    console.log('\n[Test 6] Testing POST /api/admin/content (Multipart image upload)...');
    const formData = new FormData();
    formData.append('title', 'Mastering Full-Stack MERN Architecture in 2026');
    formData.append(
      'description',
      'An in-depth architectural guide for professional software engineers scaling MERN applications.'
    );
    formData.append(
      'content',
      '<h2>Modern MERN CMS Architecture</h2><p>Building high-performance, decoupled applications requires clean boundary separation between editorial interfaces and authenticated control panels.</p>'
    );
    formData.append('category', sampleCategory._id);
    formData.append('status', 'draft');

    // Attach sample 1x1 image buffer
    const dummyImageFile = new File(
      [Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46])],
      'featured.jpg',
      { type: 'image/jpeg' }
    );
    formData.append('image', dummyImageFile);

    const createContentRes = await fetch(`${baseUrl}/admin/content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const createContentData = await createContentRes.json();
    console.log(`Status: ${createContentRes.status}, Message: ${createContentData.message}`);
    if (createContentRes.status !== 201) {
      console.error(createContentData);
      throw new Error('Create content failed');
    }
    const createdArticle = createContentData.data.content;
    console.log(`Created Article Slug: ${createdArticle.slug}, Status: ${createdArticle.status}`);

    // TEST 7: Verify Draft IS NOT Visible Publicly
    console.log('\n[Test 7] Verifying Draft Article is NOT visible to public readers...');
    const publicContentRes = await fetch(`${baseUrl}/public/content`);
    const publicContentData = await publicContentRes.json();
    const isDraftVisible = publicContentData.data.contents.some((c) => c._id === createdArticle._id);
    console.log(`Public Articles Count: ${publicContentData.data.contents.length}, Draft Visible: ${isDraftVisible}`);
    if (isDraftVisible) throw new Error('SECURITY VIOLATION: Draft content exposed to public API!');

    // TEST 8: Publish Content via Admin API
    console.log('\n[Test 8] Testing PATCH /api/admin/content/:id/status (Publishing Article)...');
    const publishRes = await fetch(`${baseUrl}/admin/content/${createdArticle._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'published' }),
    });
    const publishData = await publishRes.json();
    console.log(`Status: ${publishRes.status}, New Article Status: ${publishData.data.content.status}`);
    if (publishRes.status !== 200 || publishData.data.content.status !== 'published') {
      throw new Error('Publishing failed');
    }

    // TEST 9: Verify Published Article IS Visible Publicly
    console.log('\n[Test 9] Verifying Published Article is now accessible to public readers...');
    const publicAfterPublishRes = await fetch(`${baseUrl}/public/content`);
    const publicAfterPublishData = await publicAfterPublishRes.json();
    const isNowVisible = publicAfterPublishData.data.contents.some((c) => c._id === createdArticle._id);
    console.log(`Public Articles Count: ${publicAfterPublishData.data.contents.length}, Article Visible: ${isNowVisible}`);
    if (!isNowVisible) throw new Error('Published article did not appear in public feed');

    // TEST 10: Fetch Single Article by Slug
    console.log(`\n[Test 10] Testing GET /api/public/content/${createdArticle.slug}...`);
    const slugRes = await fetch(`${baseUrl}/public/content/${createdArticle.slug}`);
    const slugData = await slugRes.json();
    console.log(`Status: ${slugRes.status}, Article Title: "${slugData.data.content.title}"`);
    if (slugRes.status !== 200 || slugData.data.content.slug !== createdArticle.slug) {
      throw new Error('Slug lookup failed');
    }

    // TEST 11: Admin Logout
    console.log('\n[Test 11] Testing POST /api/auth/logout...');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const logoutData = await logoutRes.json();
    console.log(`Status: ${logoutRes.status}, Message: ${logoutData.message}`);
    if (logoutRes.status !== 200) throw new Error('Logout failed');

    console.log('\n=======================================================');
    console.log('  ALL 11 INTEGRATION TESTS PASSED WITH 100% SUCCESS!  ');
    console.log('=======================================================');
  } finally {
    server.close();
    await closeDB();
  }
};

runTests().catch((err) => {
  console.error('\n[Test Failure]:', err.message);
  process.exit(1);
});

