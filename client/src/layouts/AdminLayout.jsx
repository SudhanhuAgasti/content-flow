import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Shield,
  Radio,
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch {
      toast.error('Logout encountered an issue');
    }
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/admin/content',
      label: 'Content Manager',
      icon: FileText,
      end: true,
    },
    {
      to: '/admin/content/create',
      label: 'Create Article',
      icon: PlusCircle,
      end: true,
    },
    {
      to: '/admin/categories',
      label: 'Categories',
      icon: FolderTree,
      end: true,
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-obsidian-900 border-b border-obsidian-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emperor-500 text-obsidian-950 font-black text-sm flex items-center justify-center font-mono">
            CF
          </div>
          <span className="font-extrabold text-white text-base">
            Content<span className="text-emperor-500">Flow</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-obsidian-300 hover:text-white hover:bg-obsidian-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-obsidian-900 border-r border-obsidian-800 md:min-h-screen shrink-0 md:sticky md:top-0 z-30`}
      >
        {/* Brand Banner */}
        <div className="p-6 border-b border-obsidian-800/80 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emperor-500 to-emperor-600 text-obsidian-950 font-black text-lg flex items-center justify-center shadow-emperor-sm font-mono">
              CF
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight block">
                Content<span className="text-emperor-500">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-obsidian-400 block -mt-0.5">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="px-6 py-4 border-b border-obsidian-800/60 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-obsidian-300">
            <span className="w-2 h-2 rounded-full bg-jade-400 animate-pulse" />
            <span>MongoDB Connected</span>
          </div>
          <span className="text-[10px] text-jade-400 font-semibold px-2 py-0.5 rounded-full bg-jade-950/80 border border-jade-600/30">
            Live
          </span>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-obsidian-500 font-mono">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emperor-500 text-obsidian-950 font-bold shadow-emperor-sm'
                    : 'text-obsidian-300 hover:text-white hover:bg-obsidian-800'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-obsidian-950' : 'text-obsidian-400 group-hover:text-emperor-400'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-obsidian-500 font-mono">
            Portal Access
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-obsidian-400" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-obsidian-400 font-mono bg-obsidian-800 px-1.5 py-0.5 rounded border border-obsidian-700">
              Open
            </span>
          </a>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-900/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-obsidian-850 border border-obsidian-750">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-obsidian-750 border border-obsidian-600 flex items-center justify-center text-emperor-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-obsidian-400 truncate">
                  {admin?.email || 'admin@contentflow.com'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log Out"
              className="p-2 rounded-lg text-obsidian-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="border-t border-obsidian-800/80 px-8 py-4 text-center text-xs text-obsidian-500 font-mono flex items-center justify-between">
          <span>ContentFlow CMS &bull; Master Admin Console</span>
          <span>Security Level: Administrator Session Verified</span>
        </footer>
      </div>
    </div>
  );
};

