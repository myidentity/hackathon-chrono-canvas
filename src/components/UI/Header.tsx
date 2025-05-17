/**
 * Header component for ChronoCanvas.
 * 
 * This component renders the application header with navigation, view mode controls,
 * and panel toggles.
 * 
 * @module Header
 */

import { useState } from 'react';

/**
 * Props for the Header component
 */
interface HeaderProps {
  /**
   * The current view mode of the application
   */
  viewMode: 'editor' | 'timeline' | 'presentation' | 'zine';
  
  /**
   * Callback function for changing the view mode
   */
  onChangeViewMode: (mode: 'editor' | 'timeline' | 'presentation' | 'zine') => void;
  
  /**
   * Callback function for toggling the element library panel
   */
  onToggleLibrary: () => void;
  
  /**
   * Callback function for toggling the property panel
   */
  onTogglePropertyPanel: () => void;
}

/**
 * Header component that renders the application header
 * 
 * @param {HeaderProps} props - The component props
 * @returns {JSX.Element} The rendered Header component
 */
function Header({ 
  viewMode, 
  onChangeViewMode, 
  onToggleLibrary, 
  onTogglePropertyPanel 
}: HeaderProps): JSX.Element {
  // State for project name editing
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("Untitled Canvas");

  /**
   * Handle project name change
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  /**
   * Start editing project name
   */
  const startEditing = () => {
    setIsEditingName(true);
  };

  /**
   * Stop editing project name
   */
  const stopEditing = () => {
    setIsEditingName(false);
  };

  /**
   * Handle key down event for project name input
   * 
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      stopEditing();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Logo and project name */}
        <div className="flex items-center space-x-4">
          <div className="text-xl font-display font-bold text-primary-600">
            ChronoCanvas
          </div>
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          {isEditingName ? (
            <input
              type="text"
              className="border-b border-gray-300 focus:border-primary-500 focus:outline-none px-1 py-0.5"
              value={projectName}
              onChange={handleNameChange}
              onBlur={stopEditing}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <div 
              className="text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={startEditing}
            >
              {projectName}
            </div>
          )}
        </div>
        
        {/* View mode controls */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 p-1 rounded-md flex">
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'editor' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => onChangeViewMode('editor')}
            >
              Editor
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'timeline' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => onChangeViewMode('timeline')}
            >
              Timeline
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'presentation' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => onChangeViewMode('presentation')}
            >
              Present
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'zine' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => onChangeViewMode('zine')}
            >
              Zine
            </button>
          </div>
        </div>
        
        {/* Panel toggles and actions */}
        <div className="flex items-center space-x-3">
          {viewMode === 'editor' && (
            <>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                onClick={onToggleLibrary}
                title="Toggle Element Library"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </button>
              
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                onClick={onTogglePropertyPanel}
                title="Toggle Property Panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          
          <div className="h-6 w-px bg-gray-300"></div>
          
          <button
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
