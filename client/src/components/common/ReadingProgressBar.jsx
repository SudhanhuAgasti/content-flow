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
      {/* 1. Top Progress Track - 3.5px height with strong glow for high visibility on all mobile & desktop screens */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] bg-obsidian-900/40 z-[9999] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-jade-400 via-emperor-500 to-amber-300 transition-all duration-150 ease-out shadow-[0_0_14px_rgba(245,184,0,0.85)]"
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* 2. Floating Minimal Pill - Visible on BOTH Mobile & Desktop when reader scrolls */}
      {completion > 2 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998] flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-obsidian-900/95 border border-obsidian-750/90 backdrop-blur-xl shadow-2xl text-[11px] sm:text-xs font-mono select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emperor-500 animate-pulse" />
          <span className="text-obsidian-200 font-semibold">{Math.round(completion)}% read</span>
        </div>
      )}
    </>
  );
};
