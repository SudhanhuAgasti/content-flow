import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Modern High-Energy ContentFlow Brand Logo
 * Styled with lime-green to emperor-yellow gradient, aerodynamic wave & growth arrow.
 * Custom transparent typography + monogram.
 */
export const BrandLogo = ({
  size = 'md',
  showText = true,
  to = '/',
  subtitle = 'EDITORIAL CMS',
  className = '',
}) => {
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

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 select-none group transition-transform active:scale-95 ${className}`}
    >
      {/* Brand Logo with Aerodynamic Wave & Play Emblem */}
      <div className="relative flex items-center">
        {showText ? (
          <img
            src="/contentflow-logo.png"
            alt="ContentFlow"
            className={`${heightStyles[size] || heightStyles.md} w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(163,238,56,0.25)] group-hover:brightness-110 transition-all`}
          />
        ) : (
          <img
            src="/contentflow-emblem.png"
            alt="ContentFlow"
            className={`${emblemSizes[size] || emblemSizes.md} object-contain filter drop-shadow-[0_2px_8px_rgba(163,238,56,0.3)] group-hover:scale-105 transition-all`}
          />
        )}
      </div>
    </Link>
  );
};
