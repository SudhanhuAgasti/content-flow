import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-obsidian-800/80 rounded-xl ${className}`}
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

