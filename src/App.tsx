/**
 * Main App component for ChronoCanvas
 * 
 * This component serves as the entry point for the application and
 * provides the overall layout and context providers.
 */

import { useState } from 'react';
import { CanvasProvider } from './context/CanvasContext';
import { TimelineProvider } from './context/TimelineContext';
import { ThemeProvider } from './context/ThemeContext';
import { ImageLibraryProvider } from './context/ImageLibraryContext';
import Header from './components/UI/Header';
import ElementLibrary from './components/ElementLibrary/ElementLibrary';
import EnhancedCanvas from './components/Canvas/EnhancedCanvas';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import EnhancedTimeline from './components/Timeline/EnhancedTimeline';

/**
 * View mode type
 */
type ViewMode = 'editor' | 'timeline' | 'zine' | 'presentation';

/**
 * Main App component
 */
function App() {
  // State for view mode
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  
  return (
    <ThemeProvider>
      <TimelineProvider>
        <CanvasProvider>
          <ImageLibraryProvider>
            <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              {/* Header */}
              <Header viewMode={viewMode} onViewModeChange={setViewMode} />
              
              {/* Main content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar - Element library */}
                <div className={`w-64 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col ${viewMode !== 'editor' ? 'hidden' : ''}`}>
                  <ElementLibrary />
                </div>
                
                {/* Main canvas area */}
                <div className="flex-1 overflow-hidden">
                  <EnhancedCanvas viewMode={viewMode} />
                </div>
                
                {/* Right sidebar - Property panel */}
                <div className={`w-64 border-l border-gray-200 dark:border-gray-700 overflow-hidden ${viewMode !== 'editor' ? 'hidden' : ''}`}>
                  <PropertyPanel />
                </div>
              </div>
              
              {/* Timeline panel */}
              <div className="h-64 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
                <EnhancedTimeline mode={viewMode} />
              </div>
            </div>
          </ImageLibraryProvider>
        </CanvasProvider>
      </TimelineProvider>
    </ThemeProvider>
  );
}

export default App;
