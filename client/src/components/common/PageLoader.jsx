import React from 'react';

/**
 * Top Slim Golden Progress Bar (YouTube / GitHub Production Style)
 * Provides visual feedback during route changes without jarring screen blanks
 */
export const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] overflow-hidden bg-transparent pointer-events-none">
      <div className="w-full h-full bg-gradient-to-r from-emperor-500 via-amber-300 to-emperor-400 shadow-[0_0_12px_#F5B800] animate-[shimmer_1.2s_infinite]" />
    </div>
  );
};

