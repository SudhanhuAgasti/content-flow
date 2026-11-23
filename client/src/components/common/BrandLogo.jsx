import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * Modern High-Energy ContentFlow Brand Logo
 * - Dark Theme: High-energy glowing lime-green to emperor-yellow gradient.
 * - Light Theme: Rich high-contrast emerald & golden amber with crisp drop-shadow outline for 100% readability against white/light backgrounds.
 */
export const BrandLogo = ({
  size = 'md',
  showText = true,
  to = '/',
  subtitle = 'EDITORIAL CMS',
  className = '',
}) => {
  const { isDark } = useTheme();

  // Height sizing based on context
  const heightStyles = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  // Dynamic filter based on theme
  const logoFilter = isDark
    ? 'drop-shadow-[0_2px_12px_rgba(163,238,56,0.3)] group-hover:brightness-110'
    : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)] contrast-125 saturate-125';

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 select-none group transition-transform active:scale-95 ${className}`}
    >
      <div className="relative flex items-center">
        {showText ? (
          <img
            src={isDark ? '/contentflow-logo.png' : '/contentflow-logo-light.png'}
            alt="ContentFlow"
            className={`${heightStyles[size] || heightStyles.md} w-auto object-contain ${logoFilter} transition-all`}
          />
        ) : (
          <img
            src="/contentflow-emblem.png"
            alt="ContentFlow"
            className={`${emblemSizes[size] || emblemSizes.md} object-contain ${logoFilter} group-hover:scale-105 transition-all`}
          />
        )}
      </div>
    </Link>
  );
};
