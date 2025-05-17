/**
 * Enhanced Canvas component for ChronoCanvas
 * 
 * This component provides a rich canvas interface with zoom, pan, and grid functionality.
 * It renders elements based on the current view mode and timeline position.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import ElementRenderer from './ElementRenderer';
import { motion } from 'framer-motion';

// Type definitions
interface EnhancedCanvasProps {
  viewMode: 'editor' | 'timeline' | 'zine' | 'presentation';
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Enhanced Canvas component with zoom, pan, and grid functionality
 */
const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({ viewMode }) => {
  const { canvas, selectedElement, selectElement } = useCanvas();
  const { currentPosition } = useTimeline();
  
  // Create a clearSelection function since it doesn't exist in the context
  const clearSelection = () => selectElement(null);
  
  // Create an array for compatibility with the existing code
  const selectedElements = selectedElement ? [selectedElement] : [];
  
  // State for canvas transform (zoom and pan)
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  
  // State for grid visibility
  const [showGrid, setShowGrid] = useState(true);
  
  // State for scroll position (for zine mode)
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Refs for canvas container and content
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for tracking mouse position and drag
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && viewMode === 'editor') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewMode === 'editor') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setTransform(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse up to end panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5),
    }));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1),
    }));
  };
  
  // Handle zoom reset
  const handleZoomReset = () => {
    setTransform({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  };
  
  // Handle scroll for zine mode
  useEffect(() => {
    if (viewMode === 'zine') {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode]);
  
  // Handle canvas click for selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (viewMode === 'editor' && e.target === contentRef.current) {
      clearSelection();
    }
  };
  
  // Generate grid pattern
  const gridPattern = () => {
    const gridSize = 20;
    const majorGridSize = 100;
    
    return (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
        <defs>
          <pattern id="smallGrid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="rgba(100, 100, 100, 0.1)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width={majorGridSize} height={majorGridSize} patternUnits="userSpaceOnUse">
            <rect width={majorGridSize} height={majorGridSize} fill="url(#smallGrid)" />
            <path d={`M ${majorGridSize} 0 L 0 0 0 ${majorGridSize}`} fill="none" stroke="rgba(100, 100, 100, 0.3)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      data-testid="canvas-container"
    >
      {/* Canvas background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Grid (only in editor mode) */}
      {viewMode === 'editor' && showGrid && gridPattern()}
      
      {/* Canvas content */}
      <motion.div
        ref={contentRef}
        className="absolute inset-0 origin-center"
        style={{
          transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
        }}
        data-testid="canvas-content"
      >
        {/* Render elements */}
        {canvas.elements.map(element => (
          <ElementRenderer
            key={element.id}
            element={element}
            isSelected={selectedElements.includes(element.id)}
            onSelect={() => selectElement(element.id)}
            viewMode={viewMode}
            currentPosition={currentPosition}
            scrollPosition={scrollPosition}
          />
        ))}
      </motion.div>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        {/* Zoom controls */}
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Zoom In"
          data-testid="zoom-in-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleZoomReset}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Reset Zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Grid toggle (only in editor mode) */}
        {viewMode === 'editor' && (
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title={showGrid ? 'Hide Grid' : 'Show Grid'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h4v4H5V5zm0 6h4v4H5v-4zm6-6h4v4h-4V5zm0 6h4v4h-4v-4z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Zoom percentage indicator */}
        <div className="text-center text-sm font-medium">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>
      
      {/* View mode indicator */}
      <div 
        className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm font-medium"
        data-testid="view-mode-indicator"
      >
        {viewMode === 'editor' && 'Editor Mode'}
        {viewMode === 'timeline' && 'Timeline Mode'}
        {viewMode === 'zine' && 'Zine Mode'}
        {viewMode === 'presentation' && 'Presentation Mode'}
      </div>
    </div>
  );
};

export default EnhancedCanvas;
