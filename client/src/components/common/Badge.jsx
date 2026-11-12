import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    published:
      'bg-jade-950/70 text-jade-300 border border-jade-500/30 shadow-sm shadow-jade-950',
    draft:
      'bg-amber-950/70 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-950',
    category:
      'bg-obsidian-800 text-obsidian-200 border border-obsidian-700/80',
    emperor:
      'bg-emperor-950/70 text-emperor-300 border border-emperor-500/30',
    neutral:
      'bg-obsidian-850 text-obsidian-300 border border-obsidian-750',
  };

  const dotColors = {
    published: 'bg-jade-400 animate-pulse',
    draft: 'bg-amber-400',
    category: 'bg-obsidian-400',
    emperor: 'bg-emperor-400',
    neutral: 'bg-obsidian-500',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide capitalize ${
        variants[variant] || variants.neutral
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || dotColors.neutral
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
