import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo.jsx';
import { Button } from '../components/common/Button.jsx';
import { categoryService } from '../services/categoryService.js';
import {
  Menu,
  X,
  Shield,
  ArrowRight,
  BookOpen,
  Search,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch Categories for navigation dropdown & footer
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getPublicCategories();
        if (res.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch public categories', err);
      }
    };
    fetchCategories();
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/content', label: 'All Articles' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col selection:bg-emperor-500 selection:text-obsidian-950">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-obsidian-900/80 backdrop-blur-md border-b border-obsidian-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Custom Brand Logo */}
          <BrandLogo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'text-emperor-400 font-bold'
                      : 'text-obsidian-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Categories Quick Dropdown */}
            {categories.length > 0 && (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-semibold text-obsidian-300 hover:text-white transition-colors cursor-pointer py-2"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-64 p-3 bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-surface-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-jade-400 font-mono bg-jade-950/60 px-1.5 py-0.5 rounded border border-jade-600/30">
                          {cat.publishedCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/content">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 text-obsidian-300 hover:text-white transition-colors"
                title="Search Articles"
              >
                <Search className="w-4 h-4" />
              </button>
            </Link>

            <Link to="/admin/login">
              <Button variant="outline" size="sm" icon={Shield}>
                Admin Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-obsidian-850 border border-obsidian-750 text-obsidian-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-emperor-500" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-obsidian-900 border-b border-obsidian-800 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-emperor-500 text-obsidian-950 font-bold'
                        : 'text-obsidian-200 hover:bg-obsidian-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {categories.length > 0 && (
                <div className="pt-2 border-t border-obsidian-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-obsidian-500 px-3 block mb-2">
                    Browse Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="px-3 py-2 rounded-xl bg-obsidian-850 text-xs font-medium text-obsidian-300 hover:text-white truncate"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-obsidian-800">
                <Link to="/admin/login" className="w-full block">
                  <Button variant="primary" size="md" className="w-full" icon={Shield}>
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Public Content Slot */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Editorial Footer */}
      <footer className="bg-obsidian-900 border-t border-obsidian-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-obsidian-800">
            {/* Col 1: Brand & Editorial Mission */}
            <div className="md:col-span-2 space-y-4">
              <BrandLogo size="md" />
              <p className="text-sm text-obsidian-300 max-w-md leading-relaxed mt-4">
                ContentFlow is an enterprise-grade editorial content management platform. 
                Author, curate, and distribute architectural insights, product design systems, and engineering deep dives.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-obsidian-400">
                <span className="w-2 h-2 rounded-full bg-jade-400" />
                <span>All content dynamically served via MongoDB & Express APIs</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emperor-400 font-mono mb-4">
                Platform Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-obsidian-300">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home Page
                  </Link>
                </li>
                <li>
                  <Link to="/content" className="hover:text-white transition-colors">
                    All Published Articles
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Platform
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact & Editorial Desk
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emperor-400 font-mono mb-4">
                Featured Categories
              </h4>
              <ul className="space-y-2.5 text-sm text-obsidian-300">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] font-mono text-jade-400">
                        {cat.publishedCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-obsidian-500 font-mono">
            <p>
              &copy; {new Date().getFullYear()} ContentFlow CMS &bull; Built with MERN Stack Architecture
            </p>
            <div className="flex items-center gap-6">
              <Link to="/admin/login" className="hover:text-emperor-400 transition-colors">
                Admin Authentication
              </Link>
              <span>&bull;</span>
              <span>Theme: Emperor Yellow & Obsidian</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

