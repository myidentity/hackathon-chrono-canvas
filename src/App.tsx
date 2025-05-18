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
import ResizableElementLibrary from './components/ElementLibrary/ResizableElementLibrary';
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
                {/* Left sidebar - Element library with resizable functionality */}
                {viewMode === 'editor' && (
                  <ResizableElementLibrary defaultWidth={280} minWidth={200} maxWidth={500} />
                )}
                
                {/* Main canvas area */}
                <div className="flex-1 overflow-hidden">
                  <EnhancedCanvas viewMode={viewMode} />
                </div>
                
                {/* Right sidebar - Property panel */}
                {viewMode === 'editor' && (
                  <div className="w-64 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <PropertyPanel mode={viewMode} />
                  </div>
                )}
              </div>
              
              {/* Timeline panel - Adjusted to match canvas width */}
              <div className="border-t border-gray-200 dark:border-gray-700 overflow-hidden" 
                   style={{ height: viewMode === 'zine' ? '180px' : '200px' }}>
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
