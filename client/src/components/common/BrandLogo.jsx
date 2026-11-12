import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Custom ContentFlow Brand Emblem
 * Features an interlocking geometric dual-flow monogram (C + F)
 * Styled with Emperor Yellow (#F5B800), Emerald Jade (#10B981), and Obsidian Black.
 */
export const BrandLogo = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 select-none group transition-transform active:scale-95 ${className}`}
    >
      {/* Bespoke Geometric Flow Vector Emblem */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-obsidian-900 border border-obsidian-750 p-1.5 shadow-sm shadow-obsidian-950 flex items-center justify-center shrink-0 group-hover:border-emperor-500/50 transition-colors`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background diamond glow */}
          <rect
            x="4"
            y="4"
            width="28"
            height="28"
            rx="8"
            fill="#0C0E12"
            stroke="#2A303F"
            strokeWidth="1.5"
          />
          {/* C-Flow: Imperial Emperor Yellow curved energy arc */}
          <path
            d="M24 11C20.5 8.5 13.5 9 10.5 13.5C7.5 18 8.5 24 13.5 26.5C18.5 29 23 26 25 23"
            stroke="#F5B800"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* F-Flow: Vibrant Emerald Light Green horizontal dynamic stream */}
          <path
            d="M14 18H26"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Accent Focal Node */}
          <circle cx="25" cy="11" r="2.5" fill="#F5B800" />
          <circle cx="14" cy="24" r="2" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight text-white ${
              textSizes[size] || textSizes.md
            }`}
          >
            Content<span className="text-emperor-500">Flow</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-obsidian-400 mt-0.5">
            Editorial CMS
          </span>
        </div>
      )}
    </Link>
  );
};
