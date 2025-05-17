/**
 * Canvas component for ChronoCanvas
 * 
 * This component renders the main canvas area where elements are displayed
 * and can be interacted with. It supports panning, zooming, and element
 * manipulation.
 */

import React, { useRef, useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import ElementRenderer from './ElementRenderer';

interface CanvasProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

/**
 * Canvas component
 * Renders the main canvas area with all elements
 */
const Canvas: React.FC<CanvasProps> = ({ mode = 'editor' }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { canvas, updateElementPosition, selectedElement, selectElement } = useCanvas();
  const { currentPosition, isPlaying } = useTimeline();
  
  // State for canvas interaction
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  
  // Handle mouse down for panning or element selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'editor') return;
    
    // Check if clicking on an element
    const target = e.target as HTMLElement;
    const elementId = target.closest('[data-element-id]')?.getAttribute('data-element-id');
    
    if (elementId) {
      // Select the element
      selectElement(elementId);
    } else {
      // Start panning
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse move for panning or element dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'editor') return;
    
    if (isPanning && canvasRef.current) {
      // Pan the canvas
      const dx = e.clientX - startPanPosition.x;
      const dy = e.clientY - startPanPosition.y;
      
      canvasRef.current.scrollLeft -= dx;
      canvasRef.current.scrollTop -= dy;
      
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    } else if (selectedElement) {
      // Move the selected element
      const dx = e.movementX / zoom;
      const dy = e.movementY / zoom;
      
      updateElementPosition(selectedElement, dx, dy);
    }
  };
  
  // Handle mouse up to end panning or element dragging
  const handleMouseUp = () => {
    if (mode !== 'editor') return;
    
    setIsPanning(false);
  };
  
  // Handle zoom in/out
  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.25, Math.min(4, prev * factor)));
  };
  
  // Toggle grid visibility
  const toggleGrid = () => {
    setShowGrid(prev => !prev);
  };
  
  // Log current timeline position for debugging
  useEffect(() => {
    console.log(`Canvas: Timeline position ${currentPosition}, Playing: ${isPlaying}`);
  }, [currentPosition, isPlaying]);
  
  return (
    <div className="relative flex-1 overflow-hidden">
      <div 
        ref={canvasRef}
        className={`w-full h-full overflow-auto ${showGrid ? 'bg-grid' : 'bg-white'}`}
        style={{ 
          cursor: isPanning ? 'grabbing' : 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="relative"
          style={{ 
            width: '3000px', 
            height: '3000px',
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Render all elements */}
          {canvas.elements.map(element => (
            <ElementRenderer 
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              mode={mode}
              currentTime={currentPosition}
            />
          ))}
          
          {/* Debug info */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded text-sm">
            {mode === 'editor' && 'Editor Mode'}
            {mode === 'timeline' && 'Timeline Mode'}
            {mode === 'zine' && 'Zine View'}
            {mode === 'presentation' && 'Presentation Mode'}
            <br />
            Time: {currentPosition.toFixed(2)} / {isPlaying ? 'Playing' : 'Paused'}
            <br />
            Elements: {canvas.elements.length}
          </div>
        </div>
      </div>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={() => handleZoom(1.2)}
          title="Zoom In"
        >
          <span className="text-xl">+</span>
        </button>
        <button 
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={() => handleZoom(0.8)}
          title="Zoom Out"
        >
          <span className="text-xl">-</span>
        </button>
        <button 
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={() => setZoom(1)}
          title="Reset Zoom"
        >
          <span className="text-sm">100%</span>
        </button>
        <button 
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={toggleGrid}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <span className="text-sm">#</span>
        </button>
      </div>
    </div>
  );
};

export default Canvas;
