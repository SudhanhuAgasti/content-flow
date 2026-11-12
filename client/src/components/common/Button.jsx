import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary:
      'bg-emperor-500 hover:bg-emperor-400 text-obsidian-950 font-bold shadow-emperor-sm hover:shadow-emperor-glow focus:ring-emperor-500',
    secondary:
      'bg-obsidian-800 hover:bg-obsidian-750 text-white border border-obsidian-700/80 hover:border-obsidian-600 focus:ring-obsidian-500',
    jade:
      'bg-jade-500 hover:bg-jade-400 text-obsidian-950 font-bold shadow-jade-glow focus:ring-jade-500',
    outline:
      'border border-emperor-500/40 text-emperor-400 hover:bg-emperor-500/10 hover:border-emperor-500 focus:ring-emperor-500',
    danger:
      'bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 hover:border-rose-600 focus:ring-rose-500',
    ghost:
      'text-obsidian-300 hover:text-white hover:bg-obsidian-800/80 focus:ring-obsidian-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
