/**
 * Header component for ChronoCanvas
 * 
 * This component provides navigation and view mode controls for the application.
 */

import React from 'react';
import { motion } from 'framer-motion';

// Type definitions
interface HeaderProps {
  viewMode: 'editor' | 'timeline' | 'zine' | 'presentation';
  'data-testid'?: string;
}

/**
 * Header component with navigation and view mode controls
 */
const Header: React.FC<HeaderProps> = ({ viewMode, 'data-testid': testId }) => {
  // Handle view mode change
  const handleViewModeChange = (mode: 'editor' | 'timeline' | 'zine' | 'presentation') => {
    // This will be implemented with context in the actual component
    console.log(`Changing view mode to ${mode}`);
  };
  
  return (
    <header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center">
          <motion.div
            className="text-indigo-600 dark:text-indigo-400 mr-2"
            whileHover={{ rotate: 10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
          </motion.div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">ChronoCanvas</h1>
        </div>
        
        {/* View mode tabs */}
        <div className="flex space-x-1">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'editor'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewModeChange('editor')}
          >
            Editor
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'timeline'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewModeChange('timeline')}
          >
            Timeline
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'zine'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewModeChange('zine')}
          >
            Zine View
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'presentation'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleViewModeChange('presentation')}
          >
            Presentation
          </button>
        </div>
        
        {/* Right actions */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Save Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Share Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          <button
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
