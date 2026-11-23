import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * Modern High-Energy ContentFlow Brand Logo
 * Features:
 * - Bespoke 3D Curved 'CF' Aerodynamic Wings Emblem (uploaded by user)
 * - Matching crisp typography: "ContentFlow" with dynamic light/dark contrast
 * - Subtitle: "EDITORIAL CMS"
 * - Used seamlessly in Navbar, Footer, Browser Tab (favicon) and Admin Portal
 */
export const BrandLogo = ({
  size = 'md',
  showText = true,
  to = '/',
  subtitle = 'EDITORIAL CMS',
  className = '',
}) => {
  const { isDark } = useTheme();

  // Emblem dimensions
  const emblemSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-11 h-11 sm:w-13 sm:h-13',
    xl: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  // Text sizes
  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Subtle drop-shadow for 3D depth
  const emblemFilter = isDark
    ? 'drop-shadow-[0_2px_12px_rgba(163,238,56,0.35)] group-hover:brightness-110'
    : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)] contrast-125 saturate-125';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group transition-transform active:scale-95 ${className}`}
    >
      {/* 3D CF Wings Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={isDark ? '/contentflow-emblem.png' : '/contentflow-emblem-light.png'}
          alt="ContentFlow"
          className={`${emblemSizes[size] || emblemSizes.md} object-contain ${emblemFilter} group-hover:scale-105 transition-all duration-300`}
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-black tracking-tight group-hover:text-emperor-500 transition-colors font-sans ${
              textSizes[size] || textSizes.md
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
          >
            <span style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>Content</span>
            <span className="text-emperor-500">Flow</span>
          </span>
          {subtitle && (
            <span
              className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest"
              style={{ color: isDark ? '#8B95AC' : '#64748B' }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
