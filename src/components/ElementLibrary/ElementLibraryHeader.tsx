import React, { useState } from 'react';

interface ElementLibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCanvas: () => void;
}

const ElementLibraryHeader: React.FC<ElementLibraryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearCanvas
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="p-4 bg-surface-50 dark:bg-surface-800 shadow-md-1 flex flex-col gap-3">
      {/* Search bar with Material Design 3.0 styling */}
      <div 
        className={`flex items-center bg-white dark:bg-surface-700 rounded-md-lg px-3 py-2 
                   ${isFocused ? 'ring-2 ring-primary-500 shadow-md-2' : 'border border-surface-200 dark:border-surface-600'} 
                   transition-all duration-200`}
      >
        <span className="material-icons text-surface-500 dark:text-surface-300 mr-2">search</span>
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-surface-900 dark:text-white placeholder-surface-400"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 focus:outline-none"
          >
            <span className="material-icons text-sm">close</span>
          </button>
        )}
      </div>
      
      {/* Clear Canvas button with Material Design 3.0 styling */}
      <button
        onClick={onClearCanvas}
        className="flex items-center justify-center gap-2 bg-error-50 hover:bg-error-100 text-error-700 
                 dark:bg-error-900 dark:hover:bg-error-800 dark:text-error-200
                 py-2 px-4 rounded-md-lg font-medium transition-colors duration-200 
                 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-opacity-50"
      >
        <span className="material-icons text-sm">delete</span>
        <span>Clear Canvas</span>
      </button>
    </div>
  );
};

export default ElementLibraryHeader;
