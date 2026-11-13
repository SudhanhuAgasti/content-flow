import React, { useState, useEffect } from 'react';

/**
 * Concept 03 – Minimal Futuristic Network Pulse Overlay
 * 
 * - Detects genuine network interruptions and high-latency/slow connection.
 * - Minimalist aesthetic:
 *   - Pure near-black background (#070908)
 *   - Glowing neon-yellow circular center pulse (#F4C52E)
 *   - Three expanding neon-green circular waves (#A6EE38)
 *   - Pure typography: SLOW CONNECTION / WAITING FOR NETWORK... / RECONNECTING
 * - Zero flickering: Uses debounced stabilization timers.
 * - Zero re-renders during normal stable connectivity.
 */
export const NetworkPulseOverlay = () => {
  const [isSlowOrOffline, setIsSlowOrOffline] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let debounceTimer = null;
    let fadeOutTimer = null;

    const checkNetworkCondition = () => {
      // 1. Check standard online state
      if (!navigator.onLine) {
        return true;
      }

      // 2. Check Network Information API where supported (Chrome, Edge, Android WebView, Opera)
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (connection) {
        // Effective connection types: 'slow-2g' or '2g'
        const isSlowTier = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        // RTT (Round Trip Time) > 2000ms represents an unstable, degraded connection
        const isHighLatency = connection.rtt && connection.rtt >= 2200;
        
        if (isSlowTier || isHighLatency) {
          return true;
        }
      }

      return false;
    };

    const handleNetworkChange = () => {
      const isProblematic = checkNetworkCondition();

      if (isProblematic) {
        // Clear any pending recovery timers
        if (fadeOutTimer) clearTimeout(fadeOutTimer);

        // Require problem to persist for at least 1500ms before interrupting the user (Anti-flicker)
        if (!debounceTimer) {
          debounceTimer = setTimeout(() => {
            if (checkNetworkCondition()) {
              setIsSlowOrOffline(true);
              setIsVisible(true);
            }
          }, 1500);
        }
      } else {
        // Network has recovered
        if (debounceTimer) {
          clearTimeout(debounceTimer);
          debounceTimer = null;
        }

        // Smooth fade out before unmounting overlay
        setIsVisible(false);
        fadeOutTimer = setTimeout(() => {
          setIsSlowOrOffline(false);
        }, 600); // Matches CSS transition duration
      }
    };

    // Attach event listeners
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      connection.addEventListener('change', handleNetworkChange);
    }

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (fadeOutTimer) clearTimeout(fadeOutTimer);
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
      if (connection) {
        connection.removeEventListener('change', handleNetworkChange);
      }
    };
  }, []);

  if (!isSlowOrOffline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070908] select-none transition-opacity duration-600 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Centered Pulse Animation Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Wave 1: Outermost Neon Green Ring */}
        <div
          className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
          style={{
            animationDelay: '0s',
            boxShadow: '0 0 24px rgba(166, 238, 56, 0.35), inset 0 0 16px rgba(166, 238, 56, 0.2)',
          }}
        />

        {/* Wave 2: Middle Neon Green Ring */}
        <div
          className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
          style={{
            animationDelay: '0.8s',
            boxShadow: '0 0 20px rgba(166, 238, 56, 0.4), inset 0 0 12px rgba(166, 238, 56, 0.25)',
          }}
        />

        {/* Wave 3: Inner Neon Green Ring */}
        <div
          className="absolute inset-0 m-auto rounded-full border border-[#A6EE38] opacity-0 animate-pulse-wave"
          style={{
            animationDelay: '1.6s',
            boxShadow: '0 0 18px rgba(166, 238, 56, 0.45), inset 0 0 10px rgba(166, 238, 56, 0.3)',
          }}
        />

        {/* Ambient Center Glow */}
        <div className="absolute w-14 h-14 rounded-full bg-[#F4C52E]/15 blur-xl pointer-events-none" />

        {/* Exact Center Glowing Neon Yellow Pulse Core */}
        <div
          className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#F4C52E] shadow-[0_0_18px_#F4C52E,0_0_35px_rgba(244,197,46,0.6)] animate-core-ping"
        />
      </div>

      {/* Minimal Futuristic Network Status Typography */}
      <div className="mt-10 sm:mt-12 flex flex-col items-center text-center space-y-3 font-mono tracking-[0.28em] sm:tracking-[0.35em]">
        <h2 className="text-[#A6EE38] text-xs sm:text-sm font-bold uppercase drop-shadow-[0_0_12px_rgba(166,238,56,0.5)]">
          Slow Connection
        </h2>

        <p className="text-obsidian-400 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em]">
          Waiting for network...
        </p>

        <div className="pt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F4C52E] animate-ping" />
          <span className="text-[#F4C52E] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(244,197,46,0.4)]">
            Reconnecting
          </span>
        </div>
      </div>
    </div>
  );
};
