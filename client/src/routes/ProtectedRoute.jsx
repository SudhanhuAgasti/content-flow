import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070908] select-none">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          <div
            className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
            style={{
              animationDelay: '0s',
              boxShadow: '0 0 24px rgba(166, 238, 56, 0.35), inset 0 0 16px rgba(166, 238, 56, 0.2)',
            }}
          />
          <div
            className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
            style={{
              animationDelay: '0.8s',
              boxShadow: '0 0 20px rgba(166, 238, 56, 0.4), inset 0 0 12px rgba(166, 238, 56, 0.25)',
            }}
          />
          <div
            className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
            style={{
              animationDelay: '1.6s',
              boxShadow: '0 0 18px rgba(166, 238, 56, 0.45), inset 0 0 10px rgba(166, 238, 56, 0.3)',
            }}
          />
          <div className="relative w-4 h-4 rounded-full bg-[#F4C52E] shadow-[0_0_18px_#F4C52E,0_0_35px_rgba(244,197,46,0.6)] animate-core-ping" />
        </div>
        <div className="mt-8 flex flex-col items-center text-center space-y-2 font-mono tracking-[0.3em]">
          <h2 className="text-[#A6EE38] text-xs font-bold uppercase drop-shadow-[0_0_12px_rgba(166,238,56,0.5)]">
            Authenticating Session
          </h2>
          <p className="text-obsidian-400 text-[10px] uppercase">
            Secured Admin Gateway...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

