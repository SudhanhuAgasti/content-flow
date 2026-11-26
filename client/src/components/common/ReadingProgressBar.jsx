import React, { useState, useEffect } from 'react';

/**
 * ReadingProgressBar
 * Fixed at the very top of the browser window (above navbar).
 * - Tracks article reading scroll progress smoothly (0% to 100%).
 * - Vibrant dual-color gradient (Lime Green #10B981 to Emperor Yellow #F5B800) matching 3D CF branding.
 * - Shows a subtle floating percentage pill on the right side while scrolling.
 * - Auto-hides when at the very top (0%).
 */
export const ReadingProgressBar = ({ targetRef }) => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const percent = Number((currentProgress / scrollHeight).toFixed(3)) * 100;
        setCompletion(Math.min(100, Math.max(0, percent)));
      }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <>
      {/* 1. Slim Top Progress Track */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-jade-500 via-emperor-500 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,184,0,0.6)]"
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* 2. Floating Minimal Pill on bottom-right when reader is actively scrolling */}
      {completion > 2 && (
        <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-900/90 border border-obsidian-750 backdrop-blur-xl shadow-surface-card text-xs font-mono select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-2 h-2 rounded-full bg-emperor-500 animate-pulse" />
          <span className="text-obsidian-300 font-semibold">{Math.round(completion)}% read</span>
        </div>
      )}
    </>
  );
};
