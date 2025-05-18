import React from 'react';
import { useCanvas } from './context/CanvasContext';
import { useTimeline } from './context/TimelineContext';
import Canvas from './components/Canvas/EnhancedCanvas';
import Timeline from './components/Timeline/EnhancedTimeline';
import PropertyPanel from './components/PropertyPanel/PropertyPanel';
import ElementLibrary from './components/ElementLibrary/ElementLibrary';
import ToolsPalette from './components/UI/ToolsPalette';
import './App.css';

const App: React.FC = () => {
  const { canvasState } = useCanvas();
  const { timelineState } = useTimeline();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="material-symbols-outlined">apps</span>
          <h1>ChronoCanvas <span className="version-number">0.1.2</span></h1>
        </div>
        <ToolsPalette />
      </header>
      <main className="app-main">
        <ElementLibrary />
        <Canvas />
        <PropertyPanel />
      </main>
      <footer className="app-footer">
        <Timeline />
      </footer>
    </div>
  );
};

export default App;
