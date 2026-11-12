import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute.jsx';

// Public Pages
import { HomePage } from '../pages/public/HomePage.jsx';
import { ContentListPage } from '../pages/public/ContentListPage.jsx';
import { ContentDetailPage } from '../pages/public/ContentDetailPage.jsx';
import { CategoryPage } from '../pages/public/CategoryPage.jsx';
import { AboutPage } from '../pages/public/AboutPage.jsx';
import { ContactPage } from '../pages/public/ContactPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage.jsx';
import { DashboardOverview } from '../pages/admin/DashboardOverview.jsx';
import { ContentManager } from '../pages/admin/ContentManager.jsx';
import { ContentCreate } from '../pages/admin/ContentCreate.jsx';
import { ContentEdit } from '../pages/admin/ContentEdit.jsx';
import { CategoryManager } from '../pages/admin/CategoryManager.jsx';

export const AppRoutes = () => {
  return (
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
  );
};
