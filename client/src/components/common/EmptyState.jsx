import React from 'react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-obsidian-900/50 border border-obsidian-800/80 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-obsidian-850 border border-obsidian-750 flex items-center justify-center text-emperor-500 mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}

      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-obsidian-400 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

