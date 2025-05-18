import React, { useState } from 'react';
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
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <CanvasProvider>
      <TimelineProvider>
        <div className={`app ${theme}`}>
          <header className="app-header">
            <div className="logo">
              <span className="material-icons text-indigo-600">dashboard</span>
              <h1>ChronoCanvas <span className="version-number">0.1.2</span></h1>
            </div>
            
            <div className="tabs">
              <button 
                className={activeTab === 'editor' ? 'active' : ''}
                onClick={() => setActiveTab('editor')}
              >
                <span className="material-icons">edit</span>
                Editor
              </button>
              <button 
                className={activeTab === 'timeline' ? 'active' : ''}
                onClick={() => setActiveTab('timeline')}
              >
                <span className="material-icons">timeline</span>
                Timeline
              </button>
              <button 
                className={activeTab === 'zine' ? 'active' : ''}
                onClick={() => setActiveTab('zine')}
              >
                <span className="material-icons">view_carousel</span>
                Zine View
              </button>
              <button 
                className={activeTab === 'presentation' ? 'active' : ''}
                onClick={() => setActiveTab('presentation')}
              >
                <span className="material-icons">slideshow</span>
                Presentation
              </button>
            </div>
            
            <div className="controls">
              <button onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                <span className="material-icons">
                  {theme === 'light' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
              <button title="Settings">
                <span className="material-icons">settings_suggest</span>
              </button>
              <button title="Save Project">
                <span className="material-icons">save</span>
              </button>
              <button title="Share Project">
                <span className="material-icons">share</span>
              </button>
              <button title="Settings">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </header>
          
          <main className="app-content">
            <div className="sidebar">
              <ElementLibrary />
            </div>
            
            <div className="canvas-container">
              {/* Use EnhancedCanvas instead of Canvas for better selection handling */}
              <EnhancedCanvas mode={activeTab} />
              {/* Add PopulateCanvas component as a button instead of auto-populating */}
              <div className="absolute top-4 left-4">
                <PopulateCanvas autoPopulate={false} />
              </div>
            </div>
            
            <div className="properties-panel">
              <PropertyPanel />
            </div>
          </main>
          
          <footer className="app-footer">
            <EnhancedTimeline mode={activeTab} />
          </footer>
        </div>
      </TimelineProvider>
    </CanvasProvider>
  );
}

export default App;
