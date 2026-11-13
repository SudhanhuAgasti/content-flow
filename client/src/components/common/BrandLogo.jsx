import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Bespoke ContentFlow Brand Emblem & Monogram
 * Designed specifically for ContentFlow:
 * - Interlocking geometric dual-flow (C + F)
 * - Rich Emperor Yellow (#F5B800) + Light Emerald Green (#10B981) + Obsidian Black
 * - No generic AI or Gemini stars
 */
export const BrandLogo = ({
  size = 'md',
  showText = true,
  to = '/',
  subtitle = 'Editorial CMS',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 select-none group transition-transform active:scale-95 ${className}`}
    >
      {/* Handcrafted Vector Monogram */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-2xl bg-obsidian-900 border border-obsidian-750 p-2 shadow-sm shadow-obsidian-950 flex items-center justify-center shrink-0 group-hover:border-emperor-500/50 transition-colors relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Inner dark frame */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="8"
            fill="#0C0E12"
            stroke="#262B38"
            strokeWidth="1.2"
          />
          {/* C-Flow Arc in Emperor Yellow */}
          <path
            d="M25 11C21.5 8 13.5 8.5 10 13.5C6.5 18.5 7.5 24.5 12.5 27C17.5 29.5 22.5 27 25 24"
            stroke="#F5B800"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* F-Flow Stream in Emerald Light Green */}
          <path
            d="M13 18H27"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Precise Editorial Anchor Nodes */}
          <circle cx="25.5" cy="11" r="2.2" fill="#F5B800" />
          <circle cx="13" cy="25.5" r="2" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-black tracking-tight text-white font-sans ${
              textSizes[size] || textSizes.md
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
          >
            Content<span className="text-emperor-500">Flow</span>
          </span>
          {subtitle && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
