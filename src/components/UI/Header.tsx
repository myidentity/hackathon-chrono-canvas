import React from 'react';
import { ViewMode } from '../../types/ViewMode';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  'data-testid'?: string;
}

const Header: React.FC<HeaderProps> = ({ viewMode, onViewModeChange, 'data-testid': testId }) => {
  return (
    <header 
      className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center"
      data-testid={testId}
    >
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">ChronoCanvas</h1>
      </div>
      
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md ${
            viewMode === 'editor'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => onViewModeChange('editor')}
        >
          Editor
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            viewMode === 'timeline'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => onViewModeChange('timeline')}
        >
          Timeline
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            viewMode === 'zine'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => onViewModeChange('zine')}
        >
          Zine
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            viewMode === 'presentation'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => onViewModeChange('presentation')}
        >
          Present
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Settings"
        >
          <span className="material-icons">settings</span>
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Help"
        >
          <span className="material-icons">help_outline</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
