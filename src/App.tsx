import React, { useState, useEffect } from 'react';
import { CanvasProvider } from './context/CanvasContext';
import { TimelineProvider } from './context/TimelineContext';
import Canvas from './components/Canvas/Canvas';
import EnhancedCanvas from './components/Canvas/EnhancedCanvas';
import EnhancedTimeline from './components/Timeline/EnhancedTimeline';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import ElementLibrary from './components/ElementLibrary/ElementLibrary';
import PopulateCanvas from './components/Canvas/PopulateCanvas';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'timeline' | 'zine' | 'presentation'>('editor');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Apply theme class to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <CanvasProvider>
      <TimelineProvider>
        <div className={`app ${theme} bg-background text-primary`}>
          <header className="app-header bg-surface-50 border-b border-surface-200 shadow-md-1 dark:bg-surface-800 dark:border-surface-700 dark:text-white">
            <div className="logo">
              <span className="material-icons text-primary-600 dark:text-primary-400">dashboard</span>
              <h1>ChronoCanvas</h1>
            </div>
            
            <div className="tabs">
              <button 
                className={`${activeTab === 'editor' ? 'active bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('editor')}
              >
                <span className="material-icons">edit</span>
                Editor
              </button>
              <button 
                className={`${activeTab === 'timeline' ? 'active bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('timeline')}
              >
                <span className="material-icons">timeline</span>
                Timeline
              </button>
              <button 
                className={`${activeTab === 'zine' ? 'active bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('zine')}
              >
                <span className="material-icons">view_carousel</span>
                Zine View
              </button>
              <button 
                className={`${activeTab === 'presentation' ? 'active bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                onClick={() => setActiveTab('presentation')}
              >
                <span className="material-icons">slideshow</span>
                Presentation
              </button>
            </div>
            
            <div className="controls">
              <button 
                onClick={toggleTheme} 
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="material-icons text-primary-600 dark:text-primary-400">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
              <button 
                title="Settings"
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="material-icons text-secondary-600 dark:text-secondary-400">settings_suggest</span>
              </button>
              <button 
                title="Save Project"
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="material-icons text-secondary-600 dark:text-secondary-400">save</span>
              </button>
              <button 
                title="Share Project"
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="material-icons text-secondary-600 dark:text-secondary-400">share</span>
              </button>
              <button 
                title="More Options"
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <span className="material-icons text-secondary-600 dark:text-secondary-400">more_vert</span>
              </button>
            </div>
          </header>
          
          <main className="app-content bg-surface-50 dark:bg-surface-900">
            <div className="sidebar bg-surface-50 dark:bg-surface-800 dark:border-surface-700">
              <ElementLibrary />
            </div>
            
            <div className="canvas-container bg-white dark:bg-surface-800">
              {/* Use EnhancedCanvas instead of Canvas for better selection handling */}
              <EnhancedCanvas mode={activeTab} />
              {/* Add PopulateCanvas component as a button instead of auto-populating */}
              <div className="absolute top-4 left-4">
                <PopulateCanvas autoPopulate={false} />
              </div>
            </div>
            
            <div className="properties-panel bg-white dark:bg-surface-800 dark:border-surface-700">
              <PropertyPanel />
            </div>
          </main>
          
          <footer className="app-footer bg-surface-100 dark:bg-surface-800 dark:border-surface-700">
            <EnhancedTimeline mode={activeTab} />
          </footer>
        </div>
      </TimelineProvider>
    </CanvasProvider>
  );
}

export default App;
