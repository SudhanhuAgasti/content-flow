import React from 'react';

/**
 * 3D Cartoon Doll Character
 * Exactly 2 dolls used: One on LEFT, one on RIGHT.
 * Matches user's reference image:
 * - Cute 3D anime boy with black hoodie, yellow hoodie strings and yellow trim.
 * - Black pants, yellow and white sneakers.
 * - Smiling expression, big black anime eyes with specular highlights, neatly parted black hair.
 * - Foot kicks gently when ball arrives, then returns to original standing pose.
 * - No hand movements, no cursor icons, no dancing, no jumping.
 */
export const CartoonDoll = ({ isLeft = true, isKicking = false }) => {
  return (
    <div
      className={`relative w-28 sm:w-36 md:w-44 select-none pointer-events-none transition-transform duration-300 ${
        isLeft ? '' : '-scale-x-100'
      }`}
    >
      <svg
        viewBox="0 0 160 260"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Ambient Ground Shadow */}
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Skin Gradient (Warm 3D skin tone) */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE0C8" />
            <stop offset="60%" stopColor="#FAD0B0" />
            <stop offset="100%" stopColor="#EDB895" />
          </linearGradient>

          {/* Hoodie Black Gradient (Obsidian with 3D rim highlight) */}
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#222834" />
            <stop offset="50%" stopColor="#141820" />
            <stop offset="100%" stopColor="#0B0D12" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A303C" />
            <stop offset="45%" stopColor="#12151B" />
            <stop offset="100%" stopColor="#08090C" />
          </linearGradient>

          {/* Yellow Sneaker Accent */}
          <linearGradient id="yellowAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#F5B800" />
          </linearGradient>
        </defs>

        {/* 1. Ground Contact Shadow */}
        <ellipse cx="80" cy="248" rx="46" ry="10" fill="url(#groundShadow)" />

        {/* 2. LEGS & SNEAKERS */}
        {/* Back Leg (Standing steady) */}
        <g id="standing-leg">
          <path d="M58 170 L55 220" stroke="#12151B" strokeWidth="16" strokeLinecap="round" />
          {/* Back Shoe */}
          <path
            d="M40 226 Q46 220 62 222 Q68 234 60 242 Q46 242 38 234 Q34 228 40 226 Z"
            fill="#FFFFFF"
            stroke="#12151B"
            strokeWidth="1.5"
          />
          <path d="M42 226 L58 227 L60 232 L40 231 Z" fill="url(#yellowAccent)" />
          <circle cx="50" cy="235" r="2.5" fill="#F5B800" />
        </g>

        {/* Front Leg (Performs natural foot-kick when ball reaches doll) */}
        <g
          id="kicking-leg"
          className="transition-transform duration-200 ease-out origin-[95px_170px]"
          style={{
            transform: isKicking ? 'rotate(-28deg) translate(8px, -4px)' : 'rotate(0deg)',
          }}
        >
          {/* Pants */}
          <path d="M96 170 L98 220" stroke="#12151B" strokeWidth="16" strokeLinecap="round" />
          {/* Yellow Sneaker Accent Stripe on Pant cuff */}
          <line x1="90" y1="214" x2="106" y2="214" stroke="#F5B800" strokeWidth="2.5" />

          {/* Front Shoe (Sneaker) */}
          <g>
            {/* White Shoe Base */}
            <path
              d="M84 226 Q92 220 112 222 Q122 232 118 242 Q96 244 82 236 Q78 228 84 226 Z"
              fill="#FFFFFF"
              stroke="#12151B"
              strokeWidth="1.5"
            />
            {/* Golden-Yellow Sneaker Top Shield */}
            <path d="M88 225 L108 227 L114 233 L86 232 Z" fill="url(#yellowAccent)" />
            {/* Yellow Shoe Tip Accent */}
            <path d="M106 228 Q118 232 116 238 L108 238 Z" fill="#F5B800" />
            {/* Laces */}
            <line x1="94" y1="225" x2="98" y2="229" stroke="#333" strokeWidth="1.5" />
            <line x1="99" y1="225" x2="103" y2="229" stroke="#333" strokeWidth="1.5" />
          </g>
        </g>

        {/* 3. BODY (Black 3D Hoodie) */}
        <g id="body">
          {/* Main Torso */}
          <path
            d="M50 118 C50 102, 110 102, 110 118 L106 175 C106 180, 54 180, 54 175 Z"
            fill="url(#hoodieGrad)"
            stroke="#262D3B"
            strokeWidth="1.5"
          />

          {/* Golden Yellow Logo on Chest (Matches reference brand mark) */}
          <path
            d="M74 140 Q80 134 86 140 Q82 147 74 140 Z"
            fill="url(#yellowAccent)"
          />
          <circle cx="83" cy="140" r="2" fill="#FFE0C8" />

          {/* Yellow Hoodie Cords */}
          <line x1="72" y1="120" x2="72" y2="148" stroke="#F5B800" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="72" cy="149" r="2" fill="#F5B800" />
          <line x1="88" y1="120" x2="88" y2="144" stroke="#F5B800" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="88" cy="145" r="2" fill="#F5B800" />

          {/* Hoodie Pocket Kangaroo Pouch */}
          <path
            d="M62 155 Q80 152 98 155 L95 172 Q80 174 65 172 Z"
            fill="#0E1117"
            stroke="#262D3B"
            strokeWidth="1"
          />

          {/* Natural Resting Arms (Fixed at sides, NO hand movement) */}
          {/* Left Resting Arm */}
          <path
            d="M54 120 Q44 140 48 162"
            stroke="url(#hoodieGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="48" cy="164" r="5" fill="url(#skinGrad)" />

          {/* Right Resting Arm */}
          <path
            d="M106 120 Q114 140 110 162"
            stroke="url(#hoodieGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="110" cy="164" r="5" fill="url(#skinGrad)" />
        </g>

        {/* 4. HEAD & CUTE CARTOON FACE */}
        <g id="head">
          {/* Neck */}
          <rect x="74" y="105" width="12" height="15" fill="url(#skinGrad)" rx="3" />

          {/* Chubby 3D Face */}
          <ellipse cx="80" cy="80" rx="35" ry="32" fill="url(#skinGrad)" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="58" cy="88" rx="6" ry="3.5" fill="#FF8A7A" opacity="0.45" />
          <ellipse cx="102" cy="88" rx="6" ry="3.5" fill="#FF8A7A" opacity="0.45" />

          {/* Big Cartoon Eyes (Black Anime Style with White Shiny Specular Reflections) */}
          {/* Left Eye */}
          <ellipse cx="66" cy="78" rx="6.5" ry="8.5" fill="#11141A" />
          <circle cx="68" cy="75" r="2.8" fill="#FFFFFF" />
          <circle cx="64" cy="81" r="1.2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="94" cy="78" rx="6.5" ry="8.5" fill="#11141A" />
          <circle cx="96" cy="75" r="2.8" fill="#FFFFFF" />
          <circle cx="92" cy="81" r="1.2" fill="#FFFFFF" />

          {/* Subtle Eyebrows */}
          <path d="M60 68 Q66 65 72 68" stroke="#1C212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M88 68 Q94 65 100 68" stroke="#1C212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Happy Open Smile */}
          <path
            d="M74 90 Q80 97 86 90"
            stroke="#B34747"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M76 91 Q80 95 84 91" fill="#FF6B6B" opacity="0.8" />

          {/* Cute Little Nose */}
          <circle cx="80" cy="83" r="1.5" fill="#DE9773" />

          {/* Cute Little Ears */}
          <ellipse cx="44" cy="80" rx="4" ry="7" fill="url(#skinGrad)" />
          <ellipse cx="116" cy="80" rx="4" ry="7" fill="url(#skinGrad)" />

          {/* Fluffy Black 3D Anime Hair */}
          <path
            d="M44 76 C40 45, 60 30, 80 30 C102 30, 120 45, 116 76 C112 62, 108 55, 96 52 C88 50, 82 54, 76 52 C68 50, 58 56, 44 76 Z"
            fill="url(#hairGrad)"
          />
          {/* Front Bangs (Side-swept locks) */}
          <path d="M50 56 Q65 62 72 70 Q62 60 50 56 Z" fill="url(#hairGrad)" />
          <path d="M70 52 Q82 60 90 68 Q80 58 70 52 Z" fill="url(#hairGrad)" />
          <path d="M88 52 Q100 58 108 65 Q98 56 88 52 Z" fill="url(#hairGrad)" />
          {/* Hair Shine Light Highlight */}
          <path
            d="M60 40 Q80 36 100 40"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
