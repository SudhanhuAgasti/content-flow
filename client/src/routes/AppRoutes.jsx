import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage.jsx';
import { DashboardOverview } from '../pages/admin/DashboardOverview.jsx';
import { ContentManager } from '../pages/admin/ContentManager.jsx';
import { ContentCreate } from '../pages/admin/ContentCreate.jsx';
import { ContentEdit } from '../pages/admin/ContentEdit.jsx';
import { CategoryManager } from '../pages/admin/CategoryManager.jsx';

// Temporary Public Landing View for Phase 3 (Phase 4 will build full public editorial portal)
const PublicLandingPlaceholder = () => (
  <div className="min-h-screen bg-obsidian-950 text-white flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emperor-500 to-emperor-600 text-obsidian-950 font-black text-2xl flex items-center justify-center mb-6 shadow-emperor-glow font-mono">
      CF
    </div>
    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
      Content<span className="text-emperor-500">Flow</span> Platform
    </h1>
    <p className="mt-3 text-obsidian-400 max-w-md text-sm leading-relaxed">
      Phase 3 Admin Control Panel is fully operational. Log in to manage content or proceed to Phase 4 for public portal.
    </p>
    <div className="mt-8 flex items-center gap-4">
      <a
        href="/admin/login"
        className="px-6 py-3 rounded-xl bg-emperor-500 hover:bg-emperor-400 text-obsidian-950 font-bold shadow-emperor-sm transition-all"
      >
        Open Admin CMS Dashboard &rarr;
      </a>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLandingPlaceholder />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};
