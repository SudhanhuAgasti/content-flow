import React from 'react';

/**
 * Production-Grade Shimmer Skeleton for Smooth Perceived Performance
 * Shows modern moving light reflections while content loads
 */
export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden bg-obsidian-850/80 rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent ${className}`}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 rounded-xl bg-obsidian-900 border border-obsidian-800"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className={`h-4 ${
                j === 0 ? 'w-1/4' : j === 1 ? 'w-1/3' : 'w-1/6'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

