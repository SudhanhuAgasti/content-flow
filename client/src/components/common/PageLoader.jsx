import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Minimalist Editorial Page Transition Loader
 * Used as a Suspense fallback during route code-splitting
 */
export const PageLoader = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-obsidian-900 border border-obsidian-750 flex items-center justify-center shadow-emperor-sm">
        <Loader2 className="w-6 h-6 text-emperor-500 animate-spin" />
      </div>
      <span className="text-[11px] font-mono uppercase tracking-widest text-obsidian-400">
        Loading View...
      </span>
    </div>
  );
};

