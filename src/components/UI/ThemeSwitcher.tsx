/**
 * ThemeSwitcher component for ChronoCanvas
 * 
 * This component provides a UI for switching between light, dark, and system themes.
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
}

/**
 * ThemeSwitcher component
 * Provides UI controls for switching between light, dark, and system themes
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, setTheme, currentTheme } = useTheme();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md ${
          theme === 'light'
            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Light Theme"
        aria-label="Switch to light theme"
        aria-pressed={theme === 'light'}
      >
        <span className="material-icons">light_mode</span>
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Dark Theme"
        aria-label="Switch to dark theme"
        aria-pressed={theme === 'dark'}
      >
        <span className="material-icons">dark_mode</span>
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md ${
          theme === 'system'
            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="System Theme"
        aria-label="Use system theme preference"
        aria-pressed={theme === 'system'}
      >
        <span className="material-icons">settings_suggest</span>
      </button>
      
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {theme === 'system' 
          ? `System (${currentTheme})` 
          : theme.charAt(0).toUpperCase() + theme.slice(1)}
      </span>
    </div>
  );
};

export default ThemeSwitcher;
