import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage.jsx';
import { PageLoader } from '../components/common/PageLoader.jsx';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Code-Split Secondary Routes
const ContentListPage = lazy(() =>
  import('../pages/public/ContentListPage.jsx').then((m) => ({
    default: m.ContentListPage,
  }))
);
const ContentDetailPage = lazy(() =>
  import('../pages/public/ContentDetailPage.jsx').then((m) => ({
    default: m.ContentDetailPage,
  }))
);
const CategoryPage = lazy(() =>
  import('../pages/public/CategoryPage.jsx').then((m) => ({
    default: m.CategoryPage,
  }))
);
const AboutPage = lazy(() =>
  import('../pages/public/AboutPage.jsx').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('../pages/public/ContactPage.jsx').then((m) => ({
    default: m.ContactPage,
  }))
);
const NotFoundPage = lazy(() =>
  import('../pages/public/NotFoundPage.jsx').then((m) => ({
    default: m.NotFoundPage,
  }))
);

// Code-Split Admin Routes
const AdminLoginPage = lazy(() =>
  import('../pages/admin/AdminLoginPage.jsx').then((m) => ({
    default: m.AdminLoginPage,
  }))
);
const DashboardOverview = lazy(() =>
  import('../pages/admin/DashboardOverview.jsx').then((m) => ({
    default: m.DashboardOverview,
  }))
);
const ContentManager = lazy(() =>
  import('../pages/admin/ContentManager.jsx').then((m) => ({
    default: m.ContentManager,
  }))
);
const ContentCreate = lazy(() =>
  import('../pages/admin/ContentCreate.jsx').then((m) => ({
    default: m.ContentCreate,
  }))
);
const ContentEdit = lazy(() =>
  import('../pages/admin/ContentEdit.jsx').then((m) => ({
    default: m.ContentEdit,
  }))
);
const CategoryManager = lazy(() =>
  import('../pages/admin/CategoryManager.jsx').then((m) => ({
    default: m.CategoryManager,
  }))
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Editorial Web Portal */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/content" element={<ContentListPage />} />
          <Route path="/content/:slug" element={<ContentDetailPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin CMS Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<DashboardOverview />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/content/create" element={<ContentCreate />} />
            <Route path="/admin/content/edit/:id" element={<ContentEdit />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
