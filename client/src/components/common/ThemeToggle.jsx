import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component
 * Smooth interactive toggle button with sun/moon icon transition.
 * Designed to fit seamlessly in both Public Navbar & Admin Header/Sidebar.
 */
export const ThemeToggle = ({ className = '', size = 'md', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border transition-all duration-300 cursor-pointer select-none active:scale-95 ${
        isDark
          ? 'bg-obsidian-850 hover:bg-obsidian-800 border-obsidian-750 text-emperor-400 hover:text-emperor-300 hover:border-emperor-500/50 shadow-sm'
          : 'bg-white hover:bg-gray-100 border-gray-200 text-amber-500 hover:text-amber-600 hover:border-amber-300 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 -rotate-12 scale-100 text-obsidian-800" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
