import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowUpRight, Music2, Sparkles } from 'lucide-react';

/**
 * Animated 404 Mascot: Left Dancing Robot Character
 * Continuous dance movement, rhythmic arms, body tilt, bouncing feet.
 */
const LeftDancingMascot = () => (
  <div className="relative w-28 sm:w-36 md:w-44 select-none animate-dance-left pointer-events-none">
    <svg viewBox="0 0 160 220" className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
      {/* Contact Glow Floor */}
      <ellipse cx="80" cy="205" rx="45" ry="12" fill="rgba(163,238,56,0.25)" filter="blur(4px)" />

      {/* Legs & Shoes */}
      <g className="animate-[pulse_1.4s_ease-in-out_infinite]">
        {/* Left Leg */}
        <path d="M60 145 L50 185" stroke="#14181F" strokeWidth="14" strokeLinecap="round" />
        <path d="M40 185 Q50 185 62 188 Q65 198 48 198 Q35 198 40 185 Z" fill="#F4F4F4" />
        <rect x="42" y="188" width="16" height="3" fill="#A3EE38" rx="1.5" />

        {/* Right Leg (Raised Dancing Stance) */}
        <path d="M95 145 L115 175" stroke="#14181F" strokeWidth="14" strokeLinecap="round" />
        <path d="M105 172 Q120 168 128 178 Q125 188 112 185 Q102 182 105 172 Z" fill="#F4F4F4" />
        <rect x="110" y="176" width="14" height="3" fill="#A3EE38" rx="1.5" />
      </g>

      {/* Body Hoodie */}
      <path d="M50 110 C50 95, 110 95, 110 110 L105 152 C105 156, 55 156, 55 152 Z" fill="#14181F" stroke="#252C38" strokeWidth="2" />
      {/* Neon Green Hoodie Strings & Accents */}
      <line x1="72" y1="112" x2="72" y2="135" stroke="#A3EE38" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="112" x2="88" y2="132" stroke="#A3EE38" strokeWidth="3" strokeLinecap="round" />

      {/* Left Dancing Arm (Pointing Up with Neon Glove) */}
      <g className="origin-[50px_105px] animate-[bounce_1.4s_ease-in-out_infinite]">
        <path d="M52 105 Q30 85 36 60" stroke="#14181F" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="56" r="10" fill="#FFFFFF" />
        {/* Pointing Finger */}
        <path d="M36 50 L36 38" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Right Arm (Waving to the side) */}
      <g className="origin-[108px_105px] animate-[pulse_1.4s_ease-in-out_infinite]">
        <path d="M108 105 Q130 115 135 135" stroke="#14181F" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="137" cy="138" r="10" fill="#FFFFFF" />
      </g>

      {/* Head Helmet / Visor */}
      <rect x="42" y="38" width="76" height="66" rx="33" fill="#14181F" stroke="#252C38" strokeWidth="3" />
      {/* Glass Face Display */}
      <rect x="50" y="46" width="60" height="50" rx="25" fill="#06080A" />

      {/* Glowing Smiling Face Screen */}
      <path d="M62 66 Q67 60 72 66" stroke="#F4C542" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M88 66 Q93 60 98 66" stroke="#F4C542" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M72 78 Q80 86 88 78" stroke="#A3EE38" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* DJ Headphone Band */}
      <path d="M38 52 C38 20, 122 20, 122 52" stroke="#F4C542" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Ear Cups */}
      <rect x="34" y="52" width="12" height="26" rx="6" fill="#A3EE38" />
      <rect x="114" y="52" width="12" height="26" rx="6" fill="#A3EE38" />
    </svg>
  </div>
);

/**
 * Animated 404 Mascot: Center Headphone Smiley Emoji
 * Sits in the center 0 of '404', bounces rhythmically, wears DJ headphones.
 */
const CenterHeadphoneSmiley = () => (
  <div className="relative w-28 sm:w-40 md:w-52 aspect-square flex items-center justify-center select-none animate-bounce-center">
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible filter drop-shadow-[0_20px_45px_rgba(244,197,66,0.35)]">
      {/* Ambient Floor Glow */}
      <ellipse cx="100" cy="185" rx="55" ry="14" fill="rgba(244,197,66,0.35)" filter="blur(6px)" />

      {/* Headphone Top Arc */}
      <path d="M40 90 C40 22, 160 22, 160 90" stroke="#1E232F" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M42 90 C42 26, 158 26, 158 90" stroke="#A3EE38" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Headphone Spark Lines */}
      <line x1="100" y1="12" x2="100" y2="2" stroke="#F4C542" strokeWidth="4" strokeLinecap="round" />
      <line x1="84" y1="16" x2="78" y2="8" stroke="#F4C542" strokeWidth="4" strokeLinecap="round" />
      <line x1="116" y1="16" x2="122" y2="8" stroke="#F4C542" strokeWidth="4" strokeLinecap="round" />

      {/* Main Round 3D Yellow Emoji Face */}
      <circle cx="100" cy="100" r="62" fill="url(#yellowSphereGrad)" stroke="#B38600" strokeWidth="3" />

      {/* Facial Features (Chill Happy Expression) */}
      {/* Left Closed Smiling Eye */}
      <path d="M72 94 C76 86, 86 86, 90 94" stroke="#080909" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Right Closed Smiling Eye */}
      <path d="M110 94 C114 86, 124 86, 128 94" stroke="#080909" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Cute Smile */}
      <path d="M92 108 Q100 116 108 108" stroke="#080909" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* Blush Cheeks */}
      <circle cx="68" cy="102" r="5" fill="#FF8A00" opacity="0.6" />
      <circle cx="132" cy="102" r="5" fill="#FF8A00" opacity="0.6" />

      {/* Headphone Big Ear Cups */}
      {/* Left Ear Cushion */}
      <rect x="24" y="70" width="22" height="50" rx="11" fill="#14181F" stroke="#A3EE38" strokeWidth="4" />
      <rect x="30" y="78" width="10" height="34" rx="5" fill="#A3EE38" />

      {/* Right Ear Cushion */}
      <rect x="154" y="70" width="22" height="50" rx="11" fill="#14181F" stroke="#A3EE38" strokeWidth="4" />
      <rect x="160" y="78" width="10" height="34" rx="5" fill="#A3EE38" />

      <defs>
        <radialGradient id="yellowSphereGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="45%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#D49B00" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

/**
 * Animated 404 Mascot: Right Dancing Black Cat with Sunglasses
 * Dancing paws, continuous tail wag, sunglasses, gold collar bell.
 */
const RightDancingCat = () => (
  <div className="relative w-28 sm:w-36 md:w-44 select-none animate-dance-right pointer-events-none">
    <svg viewBox="0 0 160 220" className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
      {/* Contact Floor Shadow */}
      <ellipse cx="80" cy="205" rx="42" ry="12" fill="rgba(163,238,56,0.22)" filter="blur(4px)" />

      {/* Animated Wagging Tail */}
      <g className="origin-[105px_150px] animate-tail-wag">
        <path d="M105 150 Q145 160 140 120 Q135 90 148 75" stroke="#11141A" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>

      {/* Cat Legs & Dancing Paws */}
      <path d="M55 170 L52 196" stroke="#11141A" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="52" cy="198" rx="8" ry="5" fill="#252C38" />

      <path d="M95 170 L102 194" stroke="#11141A" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="104" cy="196" rx="8" ry="5" fill="#252C38" />

      {/* Cat Body */}
      <ellipse cx="78" cy="140" rx="30" ry="38" fill="#14181F" stroke="#252C38" strokeWidth="2" />

      {/* Gold Collar with Bell */}
      <path d="M56 112 Q78 122 100 112" stroke="#F4C542" strokeWidth="4" fill="none" />
      <circle cx="78" cy="120" r="5" fill="#A3EE38" stroke="#F4C542" strokeWidth="2" />

      {/* Left Dancing Paw (Up) */}
      <g className="origin-[50px_125px] animate-[bounce_1.5s_ease-in-out_infinite]">
        <path d="M54 125 Q32 105 28 85" stroke="#14181F" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="82" r="7" fill="#252C38" />
      </g>

      {/* Right Dancing Paw (Side wave) */}
      <g className="origin-[105px_125px] animate-[pulse_1.5s_ease-in-out_infinite]">
        <path d="M102 125 Q125 118 135 100" stroke="#14181F" strokeWidth="10" strokeLinecap="round" fill="none" />
        <circle cx="137" cy="98" r="7" fill="#252C38" />
      </g>

      {/* Cat Head */}
      <ellipse cx="78" cy="78" rx="36" ry="30" fill="#14181F" stroke="#252C38" strokeWidth="2" />
      {/* Cat Ears */}
      <polygon points="46,56 36,24 64,48" fill="#14181F" stroke="#252C38" strokeWidth="2" />
      <polygon points="50,52 42,32 60,46" fill="#F4C542" opacity="0.3" />

      <polygon points="110,56 120,24 92,48" fill="#14181F" stroke="#252C38" strokeWidth="2" />
      <polygon points="106,52 114,32 96,46" fill="#F4C542" opacity="0.3" />

      {/* Cool Golden Sunglasses */}
      <polygon points="48,74 74,74 70,88 52,88" fill="#F4C542" stroke="#FFF" strokeWidth="1.5" />
      <polygon points="82,74 108,74 104,88 86,88" fill="#F4C542" stroke="#FFF" strokeWidth="1.5" />
      <line x1="74" y1="78" x2="82" y2="78" stroke="#F4C542" strokeWidth="2" />

      {/* Cat Nose & Mouth */}
      <polygon points="76,95 80,95 78,98" fill="#FF8A00" />
      <path d="M74 100 Q78 103 82 100" stroke="#8B95AC" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

/**
 * Animated 404 Page – Content Flow
 * Exact reference match with dancing mascots, orbital neon rings, and 3D 404 typography.
 */
export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#080909] text-[#F1F4F9] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none">
      {/* Top Header Status Ribbon */}
      <header className="w-full flex items-center justify-between text-xs font-mono tracking-widest text-[#8B95AC] relative z-20">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-[#A3EE38]">CONTENTFLOW</span>
          <span className="text-obsidian-600">/</span>
          <span className="text-obsidian-300">ERROR</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A3EE38] shadow-[0_0_10px_#A3EE38] animate-pulse" />
          <span className="text-[#A3EE38] font-bold text-[11px]">SYSTEM ACTIVE</span>
        </div>
      </header>

      {/* Floating Musical Notes Decor (Matches reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <span className="absolute top-[28%] left-[22%] text-[#A3EE38] animate-note-float text-lg opacity-80" style={{ animationDelay: '0.2s' }}>
          ♪
        </span>
        <span className="absolute top-[38%] left-[16%] text-[#F4C542] animate-note-float text-base opacity-75" style={{ animationDelay: '0.9s' }}>
          ♫
        </span>
        <span className="absolute top-[25%] right-[22%] text-[#A3EE38] animate-note-float text-xl opacity-80" style={{ animationDelay: '0.5s' }}>
          ♫
        </span>
        <span className="absolute top-[38%] right-[16%] text-[#F4C542] animate-note-float text-base opacity-75" style={{ animationDelay: '1.2s' }}>
          ♪
        </span>
      </div>

      {/* Main 404 Centerpiece Stage */}
      <main className="relative flex flex-col items-center justify-center my-auto z-20 py-8">
        {/* Futuristic Glowing Orbital Rings (Reference match) */}
        <div className="absolute w-[340px] sm:w-[580px] md:w-[740px] h-[180px] sm:h-[260px] pointer-events-none flex items-center justify-center">
          {/* Outer Neon Green Orbit */}
          <div className="absolute inset-0 rounded-full border-2 border-[#A3EE38]/40 shadow-[0_0_35px_rgba(163,238,56,0.35)] animate-orbit-spin" />
          {/* Inner Golden Orbit */}
          <div className="absolute inset-4 sm:inset-8 rounded-full border border-[#F4C542]/50 shadow-[0_0_25px_rgba(244,197,66,0.25)] animate-orbit-spin" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />
          {/* Floor Radial Glow Horizon */}
          <div className="absolute bottom-4 w-3/4 h-20 bg-gradient-to-t from-[#A3EE38]/15 via-[#F4C542]/10 to-transparent blur-2xl rounded-full" />
        </div>

        {/* 3D "4 0 4" Mascot Composition */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-8 my-6">
          {/* Left Dancing Character */}
          <div className="hidden sm:block">
            <LeftDancingMascot />
          </div>

          {/* Bold 3D Left "4" */}
          <span
            className="text-7xl sm:text-9xl md:text-[160px] lg:text-[190px] font-black tracking-tight leading-none text-[#F4C542] select-none"
            style={{
              textShadow:
                '0 4px 0 #D49B00, 0 8px 0 #B37D00, 0 12px 0 #8A5C00, 0 16px 0 #5E3D00, 0 20px 30px rgba(0,0,0,0.9), 0 0 40px rgba(244,197,66,0.4)',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            4
          </span>

          {/* Center Mascot: DJ Headphone Smiley (Replaces '0') */}
          <div className="relative mx-1 sm:mx-2 z-10">
            <CenterHeadphoneSmiley />
          </div>

          {/* Bold 3D Right "4" */}
          <span
            className="text-7xl sm:text-9xl md:text-[160px] lg:text-[190px] font-black tracking-tight leading-none text-[#F4C542] select-none"
            style={{
              textShadow:
                '0 4px 0 #D49B00, 0 8px 0 #B37D00, 0 12px 0 #8A5C00, 0 16px 0 #5E3D00, 0 20px 30px rgba(0,0,0,0.9), 0 0 40px rgba(244,197,66,0.4)',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            4
          </span>

          {/* Right Dancing Cat */}
          <div className="hidden sm:block">
            <RightDancingCat />
          </div>
        </div>

        {/* Mobile Character Row (Only shows on small screens so they don't get squished) */}
        <div className="flex sm:hidden items-center justify-center gap-6 mt-2 mb-4">
          <LeftDancingMascot />
          <RightDancingCat />
        </div>

        {/* Text Section (Exact Reference Strings & Typography) */}
        <div className="text-center space-y-2 mt-4 max-w-xl px-4">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-[#A3EE38] font-bold">
            Oops! Wrong Direction
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
            Lost in the <span className="text-[#F4C542] drop-shadow-[0_0_20px_rgba(244,197,66,0.45)]">Flow?</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#8B95AC] font-normal leading-relaxed max-w-md mx-auto pt-1 font-tech">
            Looks like this page has drifted away. Let's get you back on track.
          </p>
        </div>

        {/* CTA Button: "BACK TO HOME" (Matches reference pill glow) */}
        <div className="mt-8">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#A3EE38]/60 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 text-xs sm:text-sm font-mono uppercase tracking-widest text-white shadow-[0_0_25px_rgba(163,238,56,0.25)] hover:shadow-[0_0_40px_rgba(163,238,56,0.5)] hover:border-[#A3EE38] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-[#A3EE38]/20 flex items-center justify-center text-[#A3EE38] group-hover:bg-[#A3EE38] group-hover:text-obsidian-950 transition-colors">
              <Home className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-[#F1F4F9] group-hover:text-white">Back to Home</span>
            <ArrowUpRight className="w-4 h-4 text-[#A3EE38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Bottom Footer Info Ribbon */}
      <footer className="w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-[#5A647E] pt-4 border-t border-obsidian-900 relative z-20">
        <div>ERROR CODE: 404</div>
        <div>PAGE NOT FOUND</div>
      </footer>
    </div>
  );
};
