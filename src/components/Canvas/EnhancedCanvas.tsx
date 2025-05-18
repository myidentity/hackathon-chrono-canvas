/**
 * Update EnhancedCanvas to integrate with ImageLibraryContext
 * 
 * This update ensures that when images are uploaded or dropped onto the canvas,
 * they are also added to the ImageLibraryContext for persistence in the image panel.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import { useImageLibrary } from '../../context/ImageLibraryContext';
import ElementRenderer from './ElementRenderer';
import ImageUploader from '../UI/ImageUploader';
import PopulateCanvas from './PopulateCanvas';
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
  const { addImage } = useImageLibrary();
  
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
  const zineContainerRef = useRef<HTMLDivElement>(null);
  
  // State for tracking mouse position and drag
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Handle mouse down for panning - only when clicking directly on the canvas background
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only initiate canvas dragging if clicking directly on the canvas background (not on elements)
    if (e.button === 0 && viewMode === 'editor' && e.target === contentRef.current) {
      console.log('Canvas background clicked, initiating canvas panning');
      setIsCanvasDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse move for panning - only affects canvas, not elements
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCanvasDragging && viewMode === 'editor') {
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
    setIsCanvasDragging(false);
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
    // Add the image to the ImageLibraryContext for persistence
    const fileName = imageUrl.split('/').pop() || 'Uploaded Image';
    const imageName = `User Image ${new Date().toLocaleTimeString()}`;
    
    addImage({
      name: imageName,
      src: imageUrl,
      alt: imageName,
      thumbnail: imageUrl,
      isUserUploaded: true,
    });
    
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
    if (viewMode === 'zine' && zineContainerRef.current) {
      const handleScroll = () => {
        setScrollPosition(zineContainerRef.current?.scrollTop || 0);
      };
      
      const zineContainer = zineContainerRef.current;
      zineContainer.addEventListener('scroll', handleScroll);
      return () => zineContainer.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode]);
  
  // Handle canvas click for selection
  const handleCanvasClick = (e: React.MouseEvent) => {
    console.log('EnhancedCanvas handleCanvasClick called, target:', e.target);
    console.log('contentRef.current:', contentRef.current);
    if (viewMode === 'editor' && e.target === contentRef.current) {
      console.log('EnhancedCanvas clearing selection');
      clearSelection();
    }
  };
  
  // Handle drag over for image drop
  const handleDragOver = (e: React.DragEvent) => {
    if (viewMode === 'editor') {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
    }
  };
  
  // Handle drop for image files
  const handleDrop = (e: React.DragEvent) => {
    if (viewMode === 'editor') {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the files from the drop event
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      
      // Process only the first file
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Please drop an image file');
        return;
      }
      
      // Create a URL for the dropped file
      const imageUrl = URL.createObjectURL(file);
      
      // Add the image to the ImageLibraryContext for persistence
      const fileName = file.name || 'Dropped Image';
      const imageName = `${fileName} (${new Date().toLocaleTimeString()})`;
      
      addImage({
        name: imageName,
        src: imageUrl,
        alt: imageName,
        thumbnail: imageUrl,
        isUserUploaded: true,
      });
      
      // Calculate drop position relative to the canvas and accounting for zoom/pan
      const rect = contentRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Adjust coordinates based on current transform
      const x = (e.clientX - rect.left) / transform.scale - transform.translateX;
      const y = (e.clientY - rect.top) / transform.scale - transform.translateY;
      
      // Create a new image element
      const newElement = {
        id: `image-${Date.now()}`,
        type: 'image',
        src: imageUrl,
        alt: 'Dropped image',
        position: {
          x,
          y,
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
  
  // Render different container based on view mode
  if (viewMode === 'zine') {
    return (
      <div 
        ref={zineContainerRef}
        className="relative w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-900"
        data-testid="zine-container"
      >
        <div className="min-h-[200vh] p-8">
          {/* Zine content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Zine View</h1>
            
            {/* Canvas elements arranged vertically */}
            <div className="space-y-12">
              {canvas.elements.map(element => (
                <div key={element.id} className="relative">
                  <ElementRenderer
                    element={element}
                    isSelected={false}
                    onSelect={() => {}}
                    viewMode={viewMode}
                    currentPosition={currentPosition}
                    scrollPosition={scrollPosition}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
            onSelect={() => {
              console.log('EnhancedCanvas onSelect called for element:', element.id);
              selectElement(element.id);
            }}
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
      
      {/* Populate Canvas button (only in editor mode) */}
      {viewMode === 'editor' && (
        <div className="absolute top-4 left-4">
          <PopulateCanvas />
        </div>
      )}
      
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
