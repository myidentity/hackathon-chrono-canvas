/**
 * Update EnhancedCanvas to fix TypeScript errors
 * 
 * This component provides an enhanced canvas with additional features
 * like grid, snap-to-grid, and view mode indicators.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import Canvas from './Canvas';
import { ViewMode } from '../../types/ViewMode';

// Type definitions
interface EnhancedCanvasProps {
  viewMode: ViewMode;
}

/**
 * EnhancedCanvas component
 * Provides a canvas with additional features like grid and snap-to-grid
 */
const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({ viewMode }) => {
  // Get context from hooks
  // Note: We're no longer using these values directly since we simplified the component
  const { } = useCanvas();
  const { } = useTimeline();
  
  // State for canvas features
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(viewMode);
  
  // Refs for canvas elements
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Update current view mode when prop changes
  useEffect(() => {
    setCurrentViewMode(viewMode);
  }, [viewMode]);
  
  // Handle grid toggle
  const handleGridToggle = () => {
    setShowGrid(!showGrid);
  };
  
  // Handle snap-to-grid toggle
  const handleSnapToggle = () => {
    setSnapToGrid(!snapToGrid);
  };
  
  // Handle grid size change
  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
  };
  
  // Calculate grid lines
  const calculateGridLines = useCallback(() => {
    if (!canvasRef.current || !gridRef.current) return;
    
    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;
    
    // Clear previous grid
    const gridElement = gridRef.current;
    gridElement.innerHTML = '';
    
    // Create horizontal lines
    for (let y = 0; y < canvasHeight; y += gridSize) {
      const line = document.createElement('div');
      line.className = 'absolute border-t border-gray-300 dark:border-gray-700';
      line.style.top = `${y}px`;
      line.style.left = '0';
      line.style.right = '0';
      line.style.height = '1px';
      gridElement.appendChild(line);
    }
    
    // Create vertical lines
    for (let x = 0; x < canvasWidth; x += gridSize) {
      const line = document.createElement('div');
      line.className = 'absolute border-l border-gray-300 dark:border-gray-700';
      line.style.left = `${x}px`;
      line.style.top = '0';
      line.style.bottom = '0';
      line.style.width = '1px';
      gridElement.appendChild(line);
    }
  }, [gridSize]);
  
  // Update grid when canvas size or grid size changes
  useEffect(() => {
    calculateGridLines();
    
    // Add resize listener
    const handleResize = () => {
      calculateGridLines();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateGridLines]);
  
  // Note: Element handling functions have been removed as they are no longer needed
  // after updating the Canvas component props to use the shared ViewMode type.
  
  // Debug log for viewMode type
  console.log('EnhancedCanvas viewMode:', viewMode, typeof viewMode);
  console.log('EnhancedCanvas currentViewMode:', currentViewMode, typeof currentViewMode);
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-white dark:bg-gray-900"
      ref={canvasRef}
    >
      {/* Grid */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          ref={gridRef}
        />
      )}
      
      {/* Canvas */}
      <Canvas 
        mode={currentViewMode}
      />
      
      {/* Controls (only in editor mode) */}
      {currentViewMode === 'editor' && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            className={`p-2 rounded-lg ${showGrid ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={handleGridToggle}
            title="Toggle Grid"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h4v4H5V5zm0 6h4v4H5v-4zm6-6h4v4h-4V5zm0 6h4v4h-4v-4z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className={`p-2 rounded-lg ${snapToGrid ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            onClick={handleSnapToggle}
            title="Toggle Snap to Grid"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
          <select
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            value={gridSize}
            onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}
            title="Grid Size"
          >
            <option value="10">10px</option>
            <option value="20">20px</option>
            <option value="50">50px</option>
            <option value="100">100px</option>
          </select>
        </div>
      )}
      
      {/* View mode indicator */}
      <div 
        className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm font-medium"
        data-testid="view-mode-indicator"
      >
        {currentViewMode === 'editor' && 'Editor Mode'}
        {currentViewMode === 'timeline' && 'Timeline Mode'}
        {currentViewMode === 'zine' && 'Zine Mode'}
        {currentViewMode === 'presentation' && 'Presentation Mode'}
      </div>
    </div>
  );
};

export default EnhancedCanvas;
