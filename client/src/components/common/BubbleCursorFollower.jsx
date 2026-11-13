import React, { useEffect, useRef } from 'react';

/**
 * Interactive 3D Yellow Transparent Bubble Cursor Follower
 * Features:
 * - Desktop: Follows mouse cursor smoothly with lerp (linear interpolation) physics.
 * - Mobile/Touch: Scales slightly smaller, tracks finger drag/touch movements smoothly.
 * - 3D Bubble Aesthetic: Semi-transparent golden-yellow body, glass specular highlights, soft radial glow aura.
 * - Performance: Uses requestAnimationFrame, transform3d GPU acceleration, and pointer-events: none.
 */
export const BubbleCursorFollower = () => {
  const bubbleRef = useRef(null);

  useEffect(() => {
    // Disable if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const bubble = bubbleRef.current;
    if (!bubble) return;

    // Target coordinates (mouse / finger)
    let targetX = -100;
    let targetY = -100;

    // Current interpolated coordinates for liquid inertia feel
    let currentX = -100;
    let currentY = -100;

    let isVisible = false;
    let isInteracting = false;
    let animationFrameId;

    // Lerp factor (smooth lag effect)
    const LERP_FACTOR = 0.18;

    const render = () => {
      // Linear interpolation (Lerp)
      currentX += (targetX - currentX) * LERP_FACTOR;
      currentY += (targetY - currentY) * LERP_FACTOR;

      if (bubble) {
        bubble.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${
          isInteracting ? 1.25 : 1
        })`;
        bubble.style.opacity = isVisible ? '1' : '0';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // 1. Desktop Mouse Events
    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) isVisible = true;
    };

    const handleMouseDown = () => {
      isInteracting = true;
    };

    const handleMouseUp = () => {
      isInteracting = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    // 2. Mobile Touch Events
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        currentX = targetX;
        currentY = targetY;
        isVisible = true;
        isInteracting = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        isVisible = true;
      }
    };

    const handleTouchEnd = () => {
      isInteracting = false;
      // Fade out smoothly shortly after finger lifts
      setTimeout(() => {
        isVisible = false;
      }, 150);
    };

    // Attach listeners with passive flag for high 60fps performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={bubbleRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[99999] opacity-0 transition-opacity duration-300 will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
      }}
    >
      {/* 3D Transparent Yellow Bubble Element (Desktop: 32px, Mobile: 22px) */}
      <div className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full">
        {/* Outer Soft Yellow Glow Halo */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#F5B800]/30 via-[#FACC15]/40 to-[#F5B800]/30 blur-md pointer-events-none" />

        {/* 3D Glass Body (Semi-transparent Golden Yellow with Multi-Layer Inner Specular Shadows) */}
        <div
          className="relative w-full h-full rounded-full border border-[#FACC15]/50 backdrop-blur-[2px]"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(254, 240, 138, 0.45) 0%, rgba(245, 184, 0, 0.22) 55%, rgba(180, 123, 0, 0.35) 100%)',
            boxShadow:
              'inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -3px 6px rgba(0, 0, 0, 0.45), 0 4px 14px rgba(245, 184, 0, 0.35)',
          }}
        >
          {/* Top-Left Glossy Specular Light Reflection (Creates real 3D soap/glass sphere depth) */}
          <div
            className="absolute top-1 left-1.5 w-2 h-1.5 sm:w-2.5 sm:h-2 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.1))',
              transform: 'rotate(-25deg)',
            }}
          />

          {/* Bottom Subtle Reflected Light Accent */}
          <div
            className="absolute bottom-1 right-2 w-1.5 h-1 sm:w-2 sm:h-1 rounded-full pointer-events-none opacity-60"
            style={{
              background: 'rgba(254, 240, 138, 0.6)',
              filter: 'blur(0.5px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

