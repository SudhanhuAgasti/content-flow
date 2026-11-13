import React from 'react';

/**
 * 3D Cartoon Doll Character
 * Exactly 2 dolls used: One on LEFT, one on RIGHT.
 * Both dolls:
 * - Face inwards (3/4 perspective) towards the central heading text & rolling ball.
 * - Gentle, subtle continuous arm movements (idle hand sway / breathing).
 * - Small foot-kick animation when the ball reaches the doll, returning naturally to standing.
 * - Scaled responsively across mobile, tablet, and desktop without layout breaks.
 */
export const CartoonDoll = ({ isLeft = true, isKicking = false }) => {
  return (
    <div
      className={`relative w-20 min-[400px]:w-24 sm:w-32 md:w-40 lg:w-44 select-none pointer-events-none transition-transform duration-300 ${
        isLeft ? '' : '-scale-x-100'
      }`}
    >
      <svg
        viewBox="0 0 160 260"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Ambient Ground Shadow */}
          <radialGradient id={`groundShadow-${isLeft ? 'l' : 'r'}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Skin Gradient (Warm 3D anime tone) */}
          <linearGradient id={`skinGrad-${isLeft ? 'l' : 'r'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4D0" />
            <stop offset="60%" stopColor="#F8D3B7" />
            <stop offset="100%" stopColor="#EAB391" />
          </linearGradient>

          {/* Hoodie Black Gradient (Obsidian with 3D rim highlight) */}
          <linearGradient id={`hoodieGrad-${isLeft ? 'l' : 'r'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#252C3A" />
            <stop offset="50%" stopColor="#151922" />
            <stop offset="100%" stopColor="#0B0E14" />
          </linearGradient>

          {/* Hair Gradient (Silky 3D black) */}
          <linearGradient id={`hairGrad-${isLeft ? 'l' : 'r'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D3442" />
            <stop offset="45%" stopColor="#13171F" />
            <stop offset="100%" stopColor="#080A0E" />
          </linearGradient>

          {/* Yellow Sneaker / Brand Accent */}
          <linearGradient id={`yellowAccent-${isLeft ? 'l' : 'r'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#F5B800" />
          </linearGradient>
        </defs>

        {/* 1. Ground Contact Shadow */}
        <ellipse cx="80" cy="248" rx="46" ry="10" fill={`url(#groundShadow-${isLeft ? 'l' : 'r'})`} />

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
          <path d="M42 226 L58 227 L60 232 L40 231 Z" fill={`url(#yellowAccent-${isLeft ? 'l' : 'r'})`} />
          <circle cx="50" cy="235" r="2.5" fill="#F5B800" />
        </g>

        {/* Front Leg (Performs foot-kick when ball reaches doll) */}
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
            <path
              d="M84 226 Q92 220 112 222 Q122 232 118 242 Q96 244 82 236 Q78 228 84 226 Z"
              fill="#FFFFFF"
              stroke="#12151B"
              strokeWidth="1.5"
            />
            <path d="M88 225 L108 227 L114 233 L86 232 Z" fill={`url(#yellowAccent-${isLeft ? 'l' : 'r'})`} />
            <path d="M106 228 Q118 232 116 238 L108 238 Z" fill="#F5B800" />
            <line x1="94" y1="225" x2="98" y2="229" stroke="#333" strokeWidth="1.5" />
            <line x1="99" y1="225" x2="103" y2="229" stroke="#333" strokeWidth="1.5" />
          </g>
        </g>

        {/* 3. BODY & ARMS (Facing inward / 3/4 turn towards center with continuous gentle hand sway) */}
        <g id="body">
          {/* Back Arm (Continuous gentle sway) */}
          <g className="origin-[52px_122px] animate-[pulse_2.8s_ease-in-out_infinite]">
            <path
              d="M52 122 Q42 142 46 160"
              stroke={`url(#hoodieGrad-${isLeft ? 'l' : 'r'})`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="46" cy="162" r="5" fill={`url(#skinGrad-${isLeft ? 'l' : 'r'})`} />
          </g>

          {/* Main Torso (Slight 3/4 angle towards the center) */}
          <path
            d="M48 118 C50 102, 112 104, 114 120 L108 175 C108 180, 52 180, 52 175 Z"
            fill={`url(#hoodieGrad-${isLeft ? 'l' : 'r'})`}
            stroke="#262D3B"
            strokeWidth="1.5"
          />

          {/* Yellow Logo on Chest */}
          <path
            d="M76 138 Q83 132 89 138 Q85 145 76 138 Z"
            fill={`url(#yellowAccent-${isLeft ? 'l' : 'r'})`}
          />
          <circle cx="86" cy="138" r="2" fill="#FFE4D0" />

          {/* Yellow Hoodie Cords */}
          <line x1="74" y1="120" x2="75" y2="147" stroke="#F5B800" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="75" cy="148" r="2" fill="#F5B800" />
          <line x1="90" y1="121" x2="91" y2="144" stroke="#F5B800" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="91" cy="145" r="2" fill="#F5B800" />

          {/* Hoodie Kangaroo Pocket */}
          <path
            d="M60 154 Q82 152 100 156 L97 172 Q80 174 63 172 Z"
            fill="#0E1117"
            stroke="#262D3B"
            strokeWidth="1"
          />

          {/* Front Arm (Continuous subtle hand movement pointing slightly toward center) */}
          <g className="origin-[106px_122px] animate-[bounce_2.4s_ease-in-out_infinite]">
            <path
              d="M106 122 Q116 142 110 160"
              stroke={`url(#hoodieGrad-${isLeft ? 'l' : 'r'})`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hand gently gesturing / moving towards center */}
            <circle cx="110" cy="162" r="5.5" fill={`url(#skinGrad-${isLeft ? 'l' : 'r'})`} />
            <path
              d="M112 163 Q117 165 116 168"
              stroke={`url(#skinGrad-${isLeft ? 'l' : 'r'})`}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* 4. HEAD & 3/4 PROFILE FACE (Facing inward towards heading text & incoming ball) */}
        <g id="head" className="origin-[82px_90px]">
          {/* Neck */}
          <rect x="75" y="105" width="13" height="15" fill={`url(#skinGrad-${isLeft ? 'l' : 'r'})`} rx="3" />

          {/* Chubby 3D Face shifted slightly rightward (+X) to turn face towards center */}
          <ellipse cx="83" cy="80" rx="35" ry="32" fill={`url(#skinGrad-${isLeft ? 'l' : 'r'})`} />

          {/* Rosy Cheeks shifted in 3/4 perspective */}
          <ellipse cx="62" cy="88" rx="5" ry="3.5" fill="#FF8A7A" opacity="0.45" />
          <ellipse cx="104" cy="87" rx="6.5" ry="4" fill="#FF8A7A" opacity="0.5" />

          {/* Big Cartoon Eyes - looking directly towards the heading & rolling ball */}
          {/* Far Eye (Perspective smaller) */}
          <ellipse cx="68" cy="78" rx="5.5" ry="8" fill="#11141A" />
          <circle cx="70" cy="75" r="2.4" fill="#FFFFFF" />
          <circle cx="67" cy="81" r="1.1" fill="#FFFFFF" />

          {/* Near Eye (Turned towards ball & center) */}
          <ellipse cx="96" cy="77" rx="7" ry="8.8" fill="#11141A" />
          <circle cx="98.5" cy="74.5" r="3" fill="#FFFFFF" />
          <circle cx="94" cy="81" r="1.3" fill="#FFFFFF" />

          {/* Expressive Eyebrows */}
          <path d="M62 67 Q68 64 74 67" stroke="#1C212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M90 66 Q97 63 103 66" stroke="#1C212B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Cheerful Smile facing inward */}
          <path
            d="M77 90 Q84 97 91 90"
            stroke="#B34747"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M79 91 Q84 95 89 91" fill="#FF6B6B" opacity="0.85" />

          {/* Cute Little Nose shifted towards 3/4 direction */}
          <circle cx="84" cy="83" r="1.6" fill="#DE9773" />

          {/* Ears */}
          <ellipse cx="45" cy="81" rx="4" ry="7" fill={`url(#skinGrad-${isLeft ? 'l' : 'r'})`} />

          {/* Fluffy Black 3D Anime Hair styled towards the center view */}
          <path
            d="M45 76 C41 45, 62 28, 83 28 C105 28, 122 44, 118 76 C114 62, 110 55, 98 52 C90 50, 84 54, 78 52 C70 50, 60 56, 45 76 Z"
            fill={`url(#hairGrad-${isLeft ? 'l' : 'r'})`}
          />
          {/* Front Bangs (Side-swept locks) */}
          <path d="M52 56 Q67 62 74 70 Q64 60 52 56 Z" fill={`url(#hairGrad-${isLeft ? 'l' : 'r'})`} />
          <path d="M72 52 Q84 60 92 68 Q82 58 72 52 Z" fill={`url(#hairGrad-${isLeft ? 'l' : 'r'})`} />
          <path d="M90 52 Q102 58 110 65 Q100 56 90 52 Z" fill={`url(#hairGrad-${isLeft ? 'l' : 'r'})`} />
          {/* Glossy Hair Highlight */}
          <path
            d="M62 38 Q83 34 103 38"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
