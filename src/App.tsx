/**
 * Main application component for ChronoCanvas
 * 
 * This component serves as the root of the application, managing the overall layout
 * and coordinating between different components.
 */

import React, { useState } from 'react';
import { CanvasProvider } from './context/CanvasContext';
import { TimelineProvider } from './context/TimelineContext';
import Header from './components/UI/Header';
import EnhancedCanvas from './components/Canvas/EnhancedCanvas';
import EnhancedTimeline from './components/Timeline/EnhancedTimeline';
import ElementLibrary from './components/ElementLibrary/ElementLibrary';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import ZineView from './components/ZineView/ZineView';
import MicroInteractions from './components/UI/MicroInteractions';

/**
 * Main App component
 */
const App: React.FC = () => {
  // State for current view mode
  const [viewMode] = useState<'editor' | 'timeline' | 'zine' | 'presentation'>('editor');
  
  return (
    <CanvasProvider>
      <TimelineProvider>
        <MicroInteractions.ToastProvider>
          <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <Header 
              viewMode={viewMode} 
              data-testid="app-header"
            />
            
            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar (only in editor mode) */}
              {viewMode === 'editor' && (
                <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto" data-testid="element-library">
                  <ElementLibrary />
                </div>
              )}
              
              {/* Main canvas area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Canvas */}
                <div className="flex-1 overflow-hidden" data-testid="canvas-container">
                  {viewMode === 'zine' ? (
                    <ZineView />
                  ) : (
                    <EnhancedCanvas viewMode={viewMode} />
                  )}
                </div>
                
                {/* Timeline (not in zine mode) */}
                {viewMode !== 'zine' && (
                  <div className="h-48 border-t border-gray-200 dark:border-gray-700" data-testid="timeline-container">
                    <EnhancedTimeline />
                  </div>
                )}
              </div>
              
              {/* Right sidebar (only in editor mode) */}
              {viewMode === 'editor' && (
                <div className="w-64 border-l border-gray-200 dark:border-gray-700 overflow-y-auto" data-testid="property-panel">
                  <PropertyPanel viewMode={viewMode} />
                </div>
              )}
            </div>
          </div>
        </MicroInteractions.ToastProvider>
      </TimelineProvider>
    </CanvasProvider>
  );
};

export default App;
