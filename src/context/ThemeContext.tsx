/**
 * Theme context provider for ChronoCanvas
 * 
 * This context manages the application theme state, including dark mode,
 * light mode, and system preference detection.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme options
export type ThemeMode = 'light' | 'dark' | 'system';

// Context interface
interface ThemeContextValue {
  theme: ThemeMode;
  currentTheme: 'light' | 'dark'; // The actual applied theme (resolved from system if needed)
  setTheme: (theme: ThemeMode) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  currentTheme: 'light',
  setTheme: () => {},
});

/**
 * Theme context provider component
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeMode) || 'system';
  });
  
  // Current applied theme (resolved from system if needed)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Update theme in localStorage and apply it
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Effect to apply theme changes
  useEffect(() => {
    const applyTheme = () => {
      let resolvedTheme: 'light' | 'dark' = 'light';
      
      if (theme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = prefersDark ? 'dark' : 'light';
      } else {
        resolvedTheme = theme as 'light' | 'dark';
      }
      
      // Apply theme to document
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setCurrentTheme(resolvedTheme);
    };
    
    applyTheme();
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    // Add listener for system preference changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);
  
  // Context value
  const contextValue: ThemeContextValue = {
    theme,
    currentTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = () => useContext(ThemeContext);
