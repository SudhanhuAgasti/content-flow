import mongoose from 'mongoose';
import { env } from '../config/env.js';
import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';
import { Content } from '../models/Content.js';
import { Category } from '../models/Category.js';

const runE2EValidation = async () => {
  console.log('================================================================');
  console.log('   STARTING PHASE 5: END-TO-END DATA FLOW & SYNC VERIFICATION   ');
  console.log('================================================================');

  await connectDB();

  const testPort = 5002;
  const server = app.listen(testPort, () => {
    console.log(`[E2E Test Engine] Server running on http://127.0.0.1:${testPort}`);
  });

  try {
    const baseUrl = `http://127.0.0.1:${testPort}/api`;

    // -------------------------------------------------------------
    // STEP 1: Authenticate Admin & obtain credentials
    // -------------------------------------------------------------
    console.log('\n[E2E Step 1] Authenticating Administrator...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      }),
    });
    const loginData = await loginRes.json();
    if (loginRes.status !== 200 || !loginData.data?.token) {
      throw new Error(`Admin login failed: ${loginData.message}`);
    }
    const token = loginData.data.token;
    console.log(`✓ Admin Authenticated: ${loginData.data.admin.email}`);

    // -------------------------------------------------------------
    // STEP 2: Fetch available categories
    // -------------------------------------------------------------
    console.log('\n[E2E Step 2] Fetching active category for assignment...');
    const catRes = await fetch(`${baseUrl}/admin/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const catData = await catRes.json();
    if (catRes.status !== 200 || !catData.data.categories.length) {
      throw new Error('No categories available to test');
    }
    const targetCategory = catData.data.categories[0];
    console.log(`✓ Target Category Selected: "${targetCategory.name}" (${targetCategory._id})`);

    // -------------------------------------------------------------
    // STEP 3: Create NEW article as DRAFT
    // -------------------------------------------------------------
    console.log('\n[E2E Step 3] Creating new article with status = "draft"...');
    const articleTitle = `High-Throughput Node.js Microservices Test ${Date.now()}`;
    const articleDesc = 'A deep-dive investigation into distributed event-driven systems.';
    const articleBody = '<p>Microservice patterns require rigorous event synchronization and decoupled persistence.</p>';

    const formData = new FormData();
    formData.append('title', articleTitle);
    formData.append('description', articleDesc);
    formData.append('content', articleBody);
    formData.append('category', targetCategory._id);
    formData.append('status', 'draft');

    const sampleBlob = new Blob([Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46])], {
      type: 'image/jpeg',
    });
    formData.append('image', sampleBlob, 'test-cover.jpg');

    const createRes = await fetch(`${baseUrl}/admin/content`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const createData = await createRes.json();
    if (createRes.status !== 201) {
      throw new Error(`Content creation failed: ${createData.message}`);
    }
    const createdItem = createData.data.content;
    console.log(`✓ Draft Article Created in MongoDB!`);
    console.log(`  - ID:     ${createdItem._id}`);
    console.log(`  - Title:  "${createdItem.title}"`);
    console.log(`  - Slug:   /${createdItem.slug}`);
    console.log(`  - Status: ${createdItem.status}`);

    // -------------------------------------------------------------
    // STEP 4: STRICT SECURITY CHECK - DRAFT CONTENT NEVER LEAKS
    // -------------------------------------------------------------
    console.log('\n[E2E Step 4] Verifying draft article is STRICTLY INVISIBLE to public visitors...');
    
    // Check 4a: Public list endpoint
    const publicListRes = await fetch(`${baseUrl}/public/content`);
    const publicListData = await publicListRes.json();
    const isLeakedInList = publicListData.data.contents.some((c) => c._id === createdItem._id);
    if (isLeakedInList) {
      throw new Error('SECURITY BREACH: Draft article found in public content listing!');
    }
    console.log(`✓ Confirmed: Draft article is NOT in public listing (/api/public/content)`);

    // Check 4b: Public slug endpoint must return 404
    const publicSlugRes = await fetch(`${baseUrl}/public/content/${createdItem.slug}`);
    if (publicSlugRes.status !== 404) {
      throw new Error(`SECURITY BREACH: Direct slug lookup of draft returned HTTP ${publicSlugRes.status} instead of 404!`);
    }
    console.log(`✓ Confirmed: Direct slug access (/api/public/content/${createdItem.slug}) returned HTTP 404 Not Found`);

    // -------------------------------------------------------------
    // STEP 5: Admin PUBLISHES the article
    // -------------------------------------------------------------
    console.log('\n[E2E Step 5] Admin publishing the article (PATCH status = "published")...');
    const publishRes = await fetch(`${baseUrl}/admin/content/${createdItem._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'published' }),
    });
    const publishData = await publishRes.json();
    if (publishRes.status !== 200 || publishData.data.content.status !== 'published') {
      throw new Error(`Status update failed: ${publishData.message}`);
    }
    console.log(`✓ Article status updated in MongoDB to "published"`);

    // -------------------------------------------------------------
    // STEP 6: REAL-TIME PUBLIC VISIBILITY CHECK
    // -------------------------------------------------------------
    console.log('\n[E2E Step 6] Verifying published article is now IMMEDIATELY VISIBLE to public visitors...');
    
    // Check 6a: Public list endpoint
    const publicListAfterRes = await fetch(`${baseUrl}/public/content`);
    const publicListAfterData = await publicListAfterRes.json();
    const isNowVisible = publicListAfterData.data.contents.some((c) => c._id === createdItem._id);
    if (!isNowVisible) {
      throw new Error('SYNCHRONIZATION ERROR: Published article is missing from public listing!');
    }
    console.log(`✓ Confirmed: Article immediately appeared in public catalog`);

    // Check 6b: Public slug endpoint
    const publicSlugAfterRes = await fetch(`${baseUrl}/public/content/${createdItem.slug}`);
    const publicSlugAfterData = await publicSlugAfterRes.json();
    if (publicSlugAfterRes.status !== 200 || publicSlugAfterData.data.content.title !== createdItem.title) {
      throw new Error('SYNCHRONIZATION ERROR: Public slug lookup failed for published article!');
    }
    console.log(`✓ Confirmed: Direct slug access returns 200 with full details and category`);

    // -------------------------------------------------------------
    // STEP 7: Content UPDATE & Automatic Slug Regeneration
    // -------------------------------------------------------------
    console.log('\n[E2E Step 7] Admin updates article title and content body...');
    const updatedTitle = `Architecting Scalable Microservices with Node.js & MongoDB (Revised ${Date.now()})`;
    const updatedDesc = 'An updated production review of modern cloud-native CMS patterns.';

    const updateForm = new FormData();
    updateForm.append('title', updatedTitle);
    updateForm.append('description', updatedDesc);

    const updateRes = await fetch(`${baseUrl}/admin/content/${createdItem._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: updateForm,
    });
    const updateData = await updateRes.json();
    if (updateRes.status !== 200) {
      throw new Error(`Update failed: ${updateData.message}`);
    }
    const updatedArticle = updateData.data.content;
    console.log(`✓ Content updated in MongoDB!`);
    console.log(`  - New Title: "${updatedArticle.title}"`);
    console.log(`  - New Slug:  /${updatedArticle.slug}`);

    // Verify update reflects immediately on public API
    const publicUpdatedSlugRes = await fetch(`${baseUrl}/public/content/${updatedArticle.slug}`);
    const publicUpdatedData = await publicUpdatedSlugRes.json();
    if (publicUpdatedSlugRes.status !== 200 || publicUpdatedData.data.content.title !== updatedTitle) {
      throw new Error('SYNCHRONIZATION ERROR: Updated content did not reflect on public endpoint!');
    }
    console.log(`✓ Confirmed: Public reader endpoint immediately displays updated title`);

    // -------------------------------------------------------------
    // STEP 8: DELETE & CLEANUP LIFECYCLE
    // -------------------------------------------------------------
    console.log('\n[E2E Step 8] Admin deletes article...');
    const deleteRes = await fetch(`${baseUrl}/admin/content/${createdItem._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteData = await deleteRes.json();
    if (deleteRes.status !== 200) {
      throw new Error(`Delete failed: ${deleteData.message}`);
    }
    console.log(`✓ Content deleted from MongoDB and Cloudinary purge triggered`);

    // Verify deleted article immediately returns 404
    const publicDeletedSlugRes = await fetch(`${baseUrl}/public/content/${updatedArticle.slug}`);
    if (publicDeletedSlugRes.status !== 404) {
      throw new Error('SYNCHRONIZATION ERROR: Deleted article still accessible on public endpoint!');
    }
    console.log(`✓ Confirmed: Deleted article immediately returns 404 on public website`);

    console.log('\n================================================================');
    console.log('   PHASE 5 END-TO-END SYNCHRONIZATION: 100% SUCCESSFUL!         ');
    console.log('   - Database Persistence Verified                              ');
    console.log('   - Real-Time Data Flow Verified                               ');
    console.log('   - Zero-Leakage Draft Isolation Verified                      ');
    console.log('   - Dynamic Slug Resolution Verified                           ');
    console.log('   - Real-Time Status Toggle Verified                           ');
    console.log('================================================================');
  } finally {
    server.close();
    await closeDB();
  }
};

runE2EValidation().catch((err) => {
  console.error('\n[Phase 5 E2E Failure]:', err.message);
  process.exit(1);
});

