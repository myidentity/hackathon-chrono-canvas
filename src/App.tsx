/**
 * Main application component for ChronoCanvas.
 * 
 * This component serves as the root of the application and manages the overall layout,
 * routing, and global state providers.
 * 
 * @module App
 */

import { useState } from 'react';
import { CanvasProvider } from './context/CanvasContext';
import { TimelineProvider } from './context/TimelineContext';
import Canvas from './components/Canvas/Canvas';
import Timeline from './components/Timeline/Timeline';
import ElementLibrary from './components/ElementLibrary/ElementLibrary';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import Header from './components/UI/Header';

/**
 * App component that serves as the entry point for the ChronoCanvas application.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App(): JSX.Element {
  // State to track the currently selected view mode
  const [viewMode, setViewMode] = useState<'editor' | 'timeline' | 'presentation' | 'zine'>('editor');
  
  // State to track if the element library panel is open
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  
  // State to track if the property panel is open
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(true);

  /**
   * Toggles the element library panel open/closed state
   */
  const toggleLibrary = () => {
    setIsLibraryOpen(prev => !prev);
  };

  /**
   * Toggles the property panel open/closed state
   */
  const togglePropertyPanel = () => {
    setIsPropertyPanelOpen(prev => !prev);
  };

  /**
   * Changes the current view mode
   * 
   * @param {('editor' | 'timeline' | 'presentation' | 'zine')} mode - The view mode to switch to
   */
  const changeViewMode = (mode: 'editor' | 'timeline' | 'presentation' | 'zine') => {
    setViewMode(mode);
  };

  return (
    <CanvasProvider>
      <TimelineProvider>
        <div className="flex flex-col h-screen bg-gray-50">
          <Header 
            viewMode={viewMode} 
            onChangeViewMode={changeViewMode} 
            onToggleLibrary={toggleLibrary}
            onTogglePropertyPanel={togglePropertyPanel}
          />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Element Library Panel - conditionally rendered based on isLibraryOpen */}
            {isLibraryOpen && viewMode === 'editor' && (
              <div className="w-64 element-library">
                <ElementLibrary />
              </div>
            )}
            
            {/* Main Canvas Area */}
            <div className="flex-1 canvas-container">
              <Canvas viewMode={viewMode} />
            </div>
            
            {/* Property Panel - conditionally rendered based on isPropertyPanelOpen */}
            {isPropertyPanelOpen && viewMode === 'editor' && (
              <div className="w-80 property-panel">
                <PropertyPanel />
              </div>
            )}
          </div>
          
          {/* Timeline - shown in editor and timeline modes */}
          {(viewMode === 'editor' || viewMode === 'timeline') && (
            <div className="h-32 timeline-container">
              <Timeline />
            </div>
          )}
        </div>
      </TimelineProvider>
    </CanvasProvider>
  );
}

export default App;
