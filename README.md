node server/scripts/testPhase2.js
--- STARTING PHASE 2 AUTOMATED INTEGRATION TESTS ---
[Database] MongoDB Connected Successfully: 127.0.0.1/contentflow

[Test 1] Testing Health Endpoint...
[Test Server] Running on http://127.0.0.1:5001
Status: 200, Message: ContentFlow API Gateway is operational

[Test 2] Testing Invalid Admin Login...
Status: 401, Error Message: Invalid email or password.

[Test 3] Testing Valid Admin Login...
Status: 200, Message: Admin authenticated successfully

[Test 4] Testing GET /api/auth/me...
Status: 200, Admin Name: ContentFlow Administrator

[Test 5] Testing GET /api/admin/categories...
Status: 200, Categories Found: 5

[Test 6] Testing POST /api/admin/content (Multipart image upload)...
Status: 201, Message: Content created successfully
Created Article Slug: mastering-full-stack-mern-architecture-in-2026-2, Status: draft

[Test 7] Verifying Draft Article is NOT visible to public readers...
Public Articles Count: 2, Draft Visible: false

[Test 8] Testing PATCH /api/admin/content/:id/status (Publishing Article)...
Status: 200, New Article Status: published

[Test 9] Verifying Published Article is now accessible to public readers...
Public Articles Count: 3, Article Visible: true

[Test 10] Testing GET /api/public/content/mastering-full-stack-mern-architecture-in-2026-2...
Status: 200, Article Title: "Mastering Full-Stack MERN Architecture in 2026"

[Test 11] Testing POST /api/auth/logout...
Status: 200, Message: Logged out successfully

=======================================================
  ALL 11 INTEGRATION TESTS PASSED WITH 100% SUCCESS!
=======================================================
[Database] MongoDB connection disconnected.
[Database] MongoDB connection closed.
PS C:\Users\sudha\OneDrive\Desktop\content flow\content_flow> # ContentFlow — Enterprise MERN Content Management System

<div align="center">

![ContentFlow Brand Emblem](https://img.shields.io/badge/ContentFlow-CMS-F5B800?style=for-the-badge&logoColor=07080A)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-10B981?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-v18-F5B800?style=for-the-badge&logo=react&logoColor=07080A)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-10B981?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-F5B800?style=for-the-badge&logo=tailwindcss&logoColor=07080A)

**Production-grade, full-stack Content Management System architected on MongoDB, Express.js, React.js, and Node.js.**

Designed with a decoupled architecture separating an authenticated **Administrative CMS Dashboard** from a reader-focused **Public Editorial Web Portal**.

[Architecture](#system-architecture) • [Features](#key-features) • [Installation](#quick-start-guide) • [API Reference](#api-documentation) • [Demo Checklist](#internship-demonstration-checklist)

</div>

---

## 1. System Overview

**ContentFlow** is an enterprise-quality publishing platform engineered for developers, technical writers, and digital publications.

### Primary Design Objectives:
- **Strict Separation of Concerns**: Public visitors browse dynamically published content, while authenticated administrators control the editorial pipeline.
- **Zero Mock Data**: 100% of categories, articles, media references, and administrator profiles are permanently persisted in MongoDB.
- **Zero-Leakage Draft Isolation**: Draft articles are filtered at the database query level and are never exposed via public endpoints.
- **Stateless Cookie Security**: JSON Web Tokens delivered through secure, HTTP-only, SameSite cookies with salted bcrypt password hashing and login rate-limiting.
- **Bespoke Human-Crafted Aesthetic**: Tailored with an **Emperor Yellow (`#F5B800`)**, **Obsidian Black (`#07080A`)**, **Emerald Jade Green (`#10B981`)**, and **Crisp White (`#FFFFFF`)** editorial theme.

---

## 2. System Architecture

```
                                 ┌────────────────────────────────────────┐
                                 │              CLIENT TIER               │
                                 └────────────────────────────────────────┘
                                            │                   │
                  ┌─────────────────────────┴────┐         ┌────┴──────────────────────────┐
                  │    Public Web Portal         │         │     Admin CMS Dashboard       │
                  │  (Readers / Public Visitors) │         │  (Authenticated Admin Only)   │
                  │  - Home / Hero / Featured    │         │  - Dashboard KPI Metrics      │
                  │  - Content Catalog & Filter  │         │  - Full Content CRUD + Status │
                  │  - Dynamic Slug View         │         │  - Category Management        │
                  │  - Read-only APIs            │         │  - Media Uploads via Cloudinary│
                  └──────────────────────────────┘         └───────────────────────────────┘
                                  │                                     │
                    GET /api/public/*                       GET, POST, PUT, DELETE /api/admin/*
                    (No Auth Required)                      (JWT HTTP-only Cookie + Rate Limit)
                                  │                                     │
                                  ▼                                     ▼
                    ┌───────────────────────────────────────────────────────────────┐
                    │                      API GATEWAY / SERVER                     │
                    │  Express.js, Helmet, CORS (Credentials), Cookie-Parser, Zod   │
                    └───────────────────────────────────────────────────────────────┘
                                  │                                     │
                   [Public Controller]                    [Auth / Admin Controllers]
                   - status = 'published'                 - Full Access & Operations
                   - Database Pagination                  - Cloudinary SDK Integration
                   - Populated Category                   - Password Hashing (bcryptjs)
                                  │                                     │
                                  ▼                                     ▼
                    ┌───────────────────────────────────────────────────────────────┐
                    │                     PERSISTENCE & STORAGE                     │
                    ├───────────────────────────────┬───────────────────────────────┤
                    │   MongoDB (Mongoose ODM)      │    Cloudinary CDN             │
                    │   - Admins, Categories,       │    - Featured Content Images  │
                    │     Content Documents         │    - Public ID Tracking       │
                    │   - Auto-indexing & Slugs     │    - Asset Deletion on Update │
                    └───────────────────────────────┴───────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend (`client/`)
- **Core**: React 18, Vite, JavaScript (ES6+)
- **Routing**: React Router DOM (v6/v7 future flags enabled)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer (Emperor Yellow & Obsidian palette)
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios with centralized error interception & credentials
- **Forms & Validation**: React Hook Form + Zod + `@hookform/resolvers`
- **Icons**: Lucide React
- **Notifications**: Sonner dark-themed toaster
- **Performance**: Route-level code-splitting (`React.lazy` + `Suspense`), Rollup vendor chunking

### Backend (`server/`)
- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js
- **Database & ODM**: MongoDB, Mongoose 8
- **Authentication**: JSON Web Token (`jsonwebtoken`), `bcryptjs` (Cost factor 12)
- **Cookie Security**: `cookie-parser` with HTTP-only, `SameSite: lax/none`, `Secure` flags
- **Security Middlewares**: `helmet`, `cors` (credentials enabled), `express-rate-limit`
- **Validation & Sanitization**: Zod validation schemas + recursive MongoDB operator injection defense
- **Media Pipeline**: Multer memory storage + Cloudinary SDK v2 stream upload

---

## 4. Key Features

### A. Public Editorial Web Portal
- **Fluid Continuous Scroll Flow**: Step-by-step discovery on homepage:
  - **Step 1: Hero Showcase**: Featured top story dynamically loaded from MongoDB.
  - **Step 2: Interactive Catalog**: Live search bar & category topic filter pills directly on home.
  - **Step 3: Platform Architecture**: Highlights system design, security, and persistence.
  - **Step 4: Editorial Desk**: Direct contact form and newsletter subscription.
- **Article Catalog (`/content`)**: Server-side pagination, debounced live search, category pills, and sort controls.
- **Dynamic Article Reader View (`/content/:slug`)**: Full article with cover image, category badge, publication date, calculated reading time, formatted prose body, native Web Share API, and related articles in the same category.
- **Category Archive (`/category/:categorySlug`)**: Filtered articles belonging to a specific taxonomy.
- **Zero-Leakage Security**: Draft and unpublished content is strictly blocked by the backend API.

### B. Admin CMS Control Center
- **Secure Authentication (`/admin/login`)**: Rate-limited admin login, show/hide password, and seeded credentials autofill button for instant testing.
- **Executive Dashboard (`/admin/dashboard`)**:
  - 4 Live KPI Metric Cards: Total Content, Published Articles, Draft Articles, Active Categories.
  - Recently Created Content table with instant 1-click **Publish / Unpublish** toggle.
- **Content Manager (`/admin/content`)**:
  - Full data table with 400ms debounced search, category filter, publication status filter, and creation date sorting.
  - Server-side pagination.
  - Edit and delete actions with confirmation dialogs.
- **Content Creation & Editing (`/admin/content/create`, `/admin/content/edit/:id`)**:
  - Drag-and-drop image dropzone with instant client preview and 5MB size limit.
  - Live auto-generated URL slug preview.
  - Preserves existing image if no replacement is uploaded during editing.
  - Purges old Cloudinary asset when an image is replaced or when an article is deleted.
- **Category Management (`/admin/categories`)**:
  - Create and edit categories.
  - Displays total articles and published counts per category.
  - Safety check: Prevents deletion of categories currently assigned to articles.

---

## 5. Folder Structure

```
contentflow/
├── client/                               # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── public/                           # Static assets & custom favicon
│   ├── src/
│   │   ├── components/                   # Design System
│   │   │   ├── cards/                    # ContentCard.jsx
│   │   │   └── common/                   # Button, Input, Modal, Badge, Skeleton, BrandLogo, ErrorBoundary
│   │   ├── context/                      # AuthContext.jsx
│   │   ├── layouts/                      # PublicLayout.jsx, AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/                    # AdminLoginPage, DashboardOverview, ContentManager, ContentCreate, ContentEdit, CategoryManager
│   │   │   └── public/                   # HomePage, ContentListPage, ContentDetailPage, CategoryPage, AboutPage, ContactPage, NotFoundPage
│   │   ├── routes/                       # AppRoutes.jsx, ProtectedRoute.jsx
│   │   ├── services/                     # api.js, authService.js, contentService.js, categoryService.js
│   │   ├── utils/                        # formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                               # Backend (Node.js + Express + Mongoose)
│   ├── config/                           # db.js, env.js, cloudinary.js
│   ├── controllers/                      # authController, adminContentController, publicContentController, categoryController
│   ├── middleware/                       # authMiddleware, uploadMiddleware, validateMiddleware, rateLimiter, errorMiddleware
│   ├── models/                           # Admin.js, Category.js, Content.js
│   ├── routes/                           # authRoutes, adminContentRoutes, publicContentRoutes, categoryRoutes
│   ├── scripts/                          # seedAdmin.js, testPhase2.js, testPhase5E2E.js
│   ├── services/                         # cloudinaryService.js, slugService.js
│   ├── utils/                            # apiResponse.js, apiError.js
│   ├── validators/                       # authValidators, contentValidators, categoryValidators
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── IMPLEMENTATION_ROADMAP.md             # Complete 7-Phase master tracking plan
├── README.md                             # Comprehensive technical documentation
└── package.json                          # Monorepo orchestration scripts
```

---

## 6. Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### Step 1: Clone the Repository
```bash
git clone https://github.com/SudhanhuAgasti/content-flow.git
cd content-flow
```

### Step 2: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Configure Environment Variables
Inside `server/`, create a `.env` file (copy from `.env.example`):
```bash
cp server/.env.example server/.env
```

Default configuration for local development:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/contentflow

JWT_SECRET=super_secret_contentflow_jwt_key_development_2026_xyz
JWT_EXPIRES_IN=7d
COOKIE_SECRET=contentflow_secure_cookie_signing_secret_9988

# Cloudinary Configuration (Optional; fallback buffer is used if omitted)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Default Administrator Credentials
ADMIN_NAME=ContentFlow Administrator
ADMIN_EMAIL=admin@contentflow.com
ADMIN_PASSWORD=Admin@SecurePass2026!
```

### Step 4: Seed Initial Admin & Categories
Run the automated database seed script:
```bash
npm --prefix server run seed
```
**Seeded Credentials:**
- **Email**: `admin@contentflow.com`
- **Password**: `Admin@SecurePass2026!`

### Step 5: Start Development Servers
From the root directory:
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run dev:server

# Terminal 2: Start Frontend Application (Port 5173)
npm run dev:client
```
- **Public Website**: [http://localhost:5173](http://localhost:5173)
- **Admin CMS Dashboard**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 7. API Documentation

All responses conform to the standard structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": {},
  "meta": { "pagination": {} }
}
```

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public (Rate-Limited) | Authenticates admin, sets HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Private (Admin) | Clears authentication cookie |
| `GET` | `/api/auth/me` | Private (Admin) | Returns active admin profile |

### Admin Content Endpoints (`/api/admin/content`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/content` | Private (Admin) | Paginated content list, search, filters & dashboard KPIs |
| `GET` | `/api/admin/content/:id` | Private (Admin) | Fetch single content record by ID |
| `POST` | `/api/admin/content` | Private (Admin) | Create article with multipart image upload |
| `PUT` | `/api/admin/content/:id` | Private (Admin) | Update article with optional image replacement |
| `DELETE`| `/api/admin/content/:id` | Private (Admin) | Delete article and purge Cloudinary asset |
| `PATCH`| `/api/admin/content/:id/status`| Private (Admin) | Quick status toggle (`draft` <-> `published`) |

### Category Endpoints (`/api/admin/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/categories` | Private (Admin) | Categories with total & published counts |
| `POST` | `/api/admin/categories` | Private (Admin) | Create category with auto-generated slug |
| `PUT` | `/api/admin/categories/:id` | Private (Admin) | Update category |
| `DELETE`| `/api/admin/categories/:id` | Private (Admin) | Delete category (safely guarded against assigned articles) |

### Public Endpoints (`/api/public`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/public/categories` | Public | Categories with published counts |
| `GET` | `/api/public/categories/:slug/content` | Public | Category archive with articles |
| `GET` | `/api/public/content` | Public | Published content feed (**Drafts strictly blocked**) |
| `GET` | `/api/public/content/:slug` | Public | Article detail + related stories |

---

## 8. Automated Test Suites

ContentFlow includes two comprehensive integration test suites:

```bash
# Run Phase 2 Integration Test (11 Scenarios)
node server/scripts/testPhase2.js

# Run Phase 5 End-to-End Real-Time Synchronization Test (8 Scenarios)
node server/scripts/testPhase5E2E.js
```

---

## 9. Internship Demonstration Checklist

Use this checklist during the submission demonstration video:

- [ ] **1. Admin Login & Authentication**:
  - Show `/admin/login` page with Emperor Yellow & Obsidian Black theme.
  - Demonstrate wrong password rejection (HTTP 401 toast).
  - Use the **"Use Seeded Admin Credentials"** button and log in successfully.
- [ ] **2. Admin Dashboard KPI Overview**:
  - Show 4 KPI metric cards (Total, Published, Drafts, Categories) populated from MongoDB.
  - Show recently created content table.
- [ ] **3. Content Creation with Image Upload**:
  - Navigate to `/admin/content/create`.
  - Enter title (show live auto-generated slug preview).
  - Upload an image in the dropzone.
  - Select Category and set status as **Draft**. Save article.
- [ ] **4. Zero-Leakage Draft Verification**:
  - Open public website in an incognito window or new tab (`http://localhost:5173/`).
  - Demonstrate that the draft article is **NOT visible** anywhere on the public website.
  - Try accessing its direct slug URL (`/content/slug`) — verify it returns **404 Not Found**.
- [ ] **5. Instant Publication Synchronization**:
  - Return to Admin Dashboard and click **"Publish"** on the draft article.
  - Refresh the public website — demonstrate the article is now immediately visible in the Hero section and Content Catalog.
- [ ] **6. Dynamic Article Reader Detail Page**:
  - Click on the article on the public website to open `/content/:slug`.
  - Show title, category badge, publication date, calculated reading time, formatted content, and related articles.
- [ ] **7. Content Editing**:
  - Return to Admin CMS, click **Edit** on the article.
  - Change title or description (preserving existing image). Save changes.
  - Show that the public reader page immediately reflects the updated content.
- [ ] **8. Deletion & Cleanup**:
  - Delete the test article in Admin Content Manager with confirmation modal.
  - Show that the public page immediately removes the article and the slug returns 404.
- [ ] **9. Category Management**:
  - Create a new category in `/admin/categories`.
  - Verify it appears in the public Categories navigation menu.
- [ ] **10. Responsive Design**:
  - Resize the browser to mobile viewport (375px) — demonstrate mobile drawer menu, responsive cards, and clean typography.

---

## 10. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push code to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend production URL (e.g., `https://contentflow-api.onrender.com/api`).

### Backend Deployment (Render / Railway)
1. Connect repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Set **Root Directory** to `server`.
3. Set Build Command: `npm install` and Start Command: `node server.js`.
4. Configure Production Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: Your deployed Vercel frontend URL.
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure 64-character random string.
   - `COOKIE_SECRET`: A secure signing key.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
5. Run database seed once on production:
   ```bash
   node scripts/seedAdmin.js
   ```

---

## 11. Author & License

- **Developer**: Senior Full-Stack Engineering Team
- **Repository**: [https://github.com/SudhanhuAgasti/content-flow.git](https://github.com/SudhanhuAgasti/content-flow.git)
- **License**: MIT

