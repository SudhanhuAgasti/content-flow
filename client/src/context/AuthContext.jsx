import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify persistent authentication on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res.success && res.data?.admin) {
        setAdmin(res.data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      // User is not authenticated; reset admin state cleanly
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Log in administrator
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data?.admin) {
      setAdmin(res.data.admin);
      return res.data.admin;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Log out administrator
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    loading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
    refreshAdmin: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
