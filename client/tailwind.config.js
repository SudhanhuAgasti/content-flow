/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Imperial / Emperor Yellow Palette
        emperor: {
          50: '#FFFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#F5B800', // Master Emperor Yellow
          600: '#D99B00',
          700: '#B47B00',
          800: '#8A5C00',
          900: '#664300',
          950: '#3D2700',
        },
        // Deep Obsidian / Jet Black Palette
        obsidian: {
          950: '#07080A', // Deepest background
          900: '#0C0E12', // Primary dark surface
          850: '#11141A', // Secondary card surface
          800: '#171B24', // Elevated surface / dropdowns
          750: '#1E232F', // Highlighted table rows / inputs
          700: '#2A303F', // Borders and dividers
          600: '#3E465B',
          500: '#5A647E',
          400: '#8B95AC',
          300: '#BCC3D4',
          200: '#E1E5EE',
          100: '#F1F4F9',
        },
        // Emerald Green Accent Palette (for published states, success, live metrics)
        jade: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Master Green
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        tech: ['Space Grotesk', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'emperor-glow': '0 0 25px -5px rgba(245, 184, 0, 0.25)',
        'emperor-sm': '0 0 15px -3px rgba(245, 184, 0, 0.20)',
        'jade-glow': '0 0 20px -5px rgba(16, 185, 129, 0.30)',
        'surface-card': '0 4px 20px -2px rgba(0, 0, 0, 0.65)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        cardRise: {
          '0%': { opacity: '0', transform: 'translateY(32px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        wordDrop: {
          '0%': { opacity: '0', transform: 'translateY(-45px) rotateX(25deg) scale(0.9)' },
          '70%': { transform: 'translateY(4px) rotateX(-5deg) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0deg) scale(1)' },
        },
        pulseWave: {
          '0%': { transform: 'scale(0.2)', opacity: '0.85' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        corePing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.22)', opacity: '0.85' },
        },
        bubbleFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)', filter: 'drop-shadow(0 10px 25px rgba(245,184,0,0.3))' },
          '50%': { transform: 'translateY(-7px) scale(1.03)', filter: 'drop-shadow(0 18px 35px rgba(245,184,0,0.5))' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        danceLeft: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '25%': { transform: 'translateY(-14px) rotate(4deg)' },
          '50%': { transform: 'translateY(-4px) rotate(-2deg)' },
          '75%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        bounceCenter: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.03)' },
        },
        danceRight: {
          '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
          '25%': { transform: 'translateY(-12px) rotate(-4deg)' },
          '50%': { transform: 'translateY(-2px) rotate(2deg)' },
          '75%': { transform: 'translateY(-16px) rotate(-3deg)' },
        },
        tailWag: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(24deg)' },
        },
        noteFloat: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-28px) scale(1.15)', opacity: '0' },
        },
        orbitSpin: {
          '0%': { transform: 'rotate(0deg) scaleY(0.38)' },
          '100%': { transform: 'rotate(360deg) scaleY(0.38)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'card-rise': 'cardRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'word-drop': 'wordDrop 0.75s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards',
        'pulse-wave': 'pulseWave 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'core-ping': 'corePing 1.2s ease-in-out infinite',
        'bubble-float': 'bubbleFloat 4s ease-in-out infinite',
        'dance-left': 'danceLeft 1.4s ease-in-out infinite',
        'bounce-center': 'bounceCenter 1.2s ease-in-out infinite',
        'dance-right': 'danceRight 1.5s ease-in-out infinite',
        'tail-wag': 'tailWag 0.8s ease-in-out infinite',
        'note-float': 'noteFloat 2s ease-in-out infinite',
        'orbit-spin': 'orbitSpin 12s linear infinite',
      },
    },
  },
  plugins: [],
}

