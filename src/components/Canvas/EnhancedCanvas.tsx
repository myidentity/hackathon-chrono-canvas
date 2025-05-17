/**
 * Integration of ImageUploader component into the EnhancedCanvas
 * 
 * This update adds the image upload functionality to the canvas controls
 * allowing users to upload their own images.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import ElementRenderer from './ElementRenderer';
import ImageUploader from '../UI/ImageUploader';
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
  const { canvas, selectedElement, selectElement, addElement } = useCanvas();
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
  
  // State for image uploader visibility
  const [showUploader, setShowUploader] = useState(false);
  
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
  
  // Handle image upload
  const handleImageUploaded = (imageUrl: string) => {
    // Create a new image element
    const newElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      src: imageUrl,
      alt: 'User uploaded image',
      position: {
        x: 100,
        y: 100,
      },
      size: {
        width: 200,
        height: 200,
      },
      rotation: 0,
      opacity: 1,
      zIndex: canvas.elements.length + 1,
      timelineData: {
        entryPoint: 0,
        exitPoint: null,
        persist: true,
        keyframes: [
          {
            time: 0,
            properties: {
              opacity: 0,
              scale: 0.8,
            },
          },
          {
            time: 1,
            properties: {
              opacity: 1,
              scale: 1,
            },
          },
        ],
      },
    };
    
    // Add the new element to the canvas
    if (addElement) {
      addElement(newElement);
    }
    
    // Hide the uploader
    setShowUploader(false);
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
      
      {/* Image uploader modal */}
      {showUploader && viewMode === 'editor' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">Upload Image</h3>
            <ImageUploader onImageUploaded={handleImageUploaded} />
            <button 
              onClick={() => setShowUploader(false)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        {/* Image upload button (only in editor mode) */}
        {viewMode === 'editor' && (
          <button
            onClick={() => setShowUploader(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Upload Image"
          >
            <span className="material-icons">image</span>
          </button>
        )}
        
        {/* Zoom controls */}
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Zoom In"
          data-testid="zoom-in-button"
        >
          <span className="material-icons">zoom_in</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Zoom Out"
        >
          <span className="material-icons">zoom_out</span>
        </button>
        <button
          onClick={handleZoomReset}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Reset Zoom"
        >
          <span className="material-icons">restart_alt</span>
        </button>
        
        {/* Grid toggle (only in editor mode) */}
        {viewMode === 'editor' && (
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title={showGrid ? 'Hide Grid' : 'Show Grid'}
          >
            <span className="material-icons">grid_on</span>
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
