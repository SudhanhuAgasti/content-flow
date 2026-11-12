import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-center shadow-emperor-sm">
          <Loader2 className="w-6 h-6 text-emperor-500 animate-spin" />
        </div>
        <p className="text-xs uppercase tracking-widest text-obsidian-400 font-mono">
          Authenticating Admin Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

