/**
 * Enhanced Canvas component for ChronoCanvas.
 * 
 * This component extends the basic Canvas with improved visual design,
 * animations, and interactive features.
 * 
 * @module EnhancedCanvas
 */

import { useRef, useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import AnimatedElement from '../Animation/AnimatedElement';
import ElementRenderer from './ElementRenderer';
import { generateTransform } from '../Animation/AnimationUtils';

/**
 * Props for the EnhancedCanvas component
 */
interface EnhancedCanvasProps {
  /**
   * The current view mode of the application
   */
  viewMode: 'editor' | 'timeline' | 'presentation' | 'zine';
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * EnhancedCanvas component that provides a visually polished canvas experience
 * 
 * @param {EnhancedCanvasProps} props - The component props
 * @returns {JSX.Element} The rendered EnhancedCanvas component
 */
function EnhancedCanvas({ viewMode, className }: EnhancedCanvasProps): JSX.Element {
  // Get canvas and timeline context
  const { canvas, selectedElements, selectElement, clearSelection } = useCanvas();
  const { currentPosition } = useTimeline();
  
  // Reference to the canvas container element
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // State for tracking canvas pan and zoom
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // State for tracking if the canvas is being dragged
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  
  // State for grid visibility
  const [showGrid, setShowGrid] = useState<boolean>(true);
  
  // State for animation when changing view modes
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const prevViewModeRef = useRef<string>(viewMode);
  
  /**
   * Handle mouse down event on the canvas
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable dragging in editor mode and when not clicking on an element
    if (viewMode === 'editor' && e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // Clear selection when clicking on empty canvas area
      clearSelection();
    }
  };

  /**
   * Handle mouse move event on the canvas
   * 
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  /**
   * Handle mouse up event on the canvas
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  /**
   * Handle wheel event for zooming
   * 
   * @param {React.WheelEvent} e - The wheel event
   */
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      // Calculate zoom center point (mouse position)
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate point on content under mouse
      const pointX = (mouseX - pan.x) / scale;
      const pointY = (mouseY - pan.y) / scale;
      
      // Calculate new scale with limits
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 5);
      
      // Calculate new pan position to zoom into mouse position
      const newPanX = mouseX - pointX * newScale;
      const newPanY = mouseY - pointY * newScale;
      
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    }
  };

  /**
   * Filter visible elements based on timeline position
   * 
   * @returns {Array} Array of visible elements at the current timeline position
   */
  const getVisibleElements = () => {
    return canvas.elements.filter(element => {
      // In editor mode, show all elements
      if (viewMode === 'editor') return true;
      
      const { entryPoint, exitPoint, persist } = element.timelineData;
      
      // Element is visible if:
      // 1. Current position is after entry point AND
      // 2. Either:
      //    a. Current position is before exit point, OR
      //    b. Element persists and has been shown (current position > entry point)
      return (
        currentPosition >= entryPoint && 
        (exitPoint === null || currentPosition <= exitPoint || persist)
      );
    });
  };
  
  // Handle view mode transitions
  useEffect(() => {
    if (prevViewModeRef.current !== viewMode) {
      setIsTransitioning(true);
      
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      
      prevViewModeRef.current = viewMode;
      
      return () => clearTimeout(timer);
    }
  }, [viewMode]);
  
  // Effect to add wheel event listener with passive: false
  useEffect(() => {
    const canvasElement = canvasRef.current;
    
    if (canvasElement) {
      const handleWheelEvent = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
        }
      };
      
      canvasElement.addEventListener('wheel', handleWheelEvent, { passive: false });
      
      return () => {
        canvasElement.removeEventListener('wheel', handleWheelEvent);
      };
    }
  }, []);

  // Get visible elements based on current timeline position
  const visibleElements = getVisibleElements();
  
  // Sort elements by z-index for proper layering
  const sortedElements = [...visibleElements].sort((a, b) => a.position.z - b.position.z);

  return (
    <div 
      ref={canvasRef}
      className={`w-full h-full relative overflow-hidden bg-white shadow-lg ${className || ''} ${
        isTransitioning ? 'transition-all duration-500 ease-in-out' : ''
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'default',
        transition: isTransitioning ? 'all 0.5s ease-in-out' : 'none',
      }}
    >
      {/* Canvas background */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{ 
          backgroundColor: canvas.background.type === 'color' ? canvas.background.value : 'transparent',
          backgroundImage: canvas.background.type === 'gradient' ? canvas.background.value : 'none',
        }}
      />
      
      {/* Grid (only in editor mode) */}
      {viewMode === 'editor' && showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${pan.x % (20 * scale)}px ${pan.y % (20 * scale)}px`,
            opacity: scale < 0.5 ? 0 : 1,
            transition: 'opacity 0.3s ease-out',
          }}
        />
      )}
      
      {/* Canvas content container with transform for pan and zoom */}
      <div 
        className={`absolute transition-transform ${isTransitioning ? 'duration-500 ease-in-out' : 'duration-0'}`}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: `${canvas.width}px`,
          height: `${canvas.height}px`,
        }}
      >
        {/* Render canvas elements */}
        {sortedElements.map(element => (
          <AnimatedElement
            key={element.id}
            id={element.id}
            entryPoint={element.timelineData.entryPoint}
            exitPoint={element.timelineData.exitPoint}
            persist={element.timelineData.persist}
            entryAnimation={element.animations[0]?.type === 'fade' ? 'fade' : 
                           element.animations[0]?.type === 'slide' ? 'slide' : 
                           element.animations[0]?.type === 'scale' ? 'scale' : 
                           element.animations[0]?.type === 'bounce' ? 'bounce' : 
                           element.animations[0]?.type === 'flip' ? 'flip' : 'fade'}
            viewMode={viewMode}
            style={{
              position: 'absolute',
              left: `${element.position.x}px`,
              top: `${element.position.y}px`,
              width: `${element.size.width}px`,
              height: `${element.size.height}px`,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.opacity,
              zIndex: element.position.z,
              transition: viewMode === 'editor' ? 'none' : 'all 0.3s ease-out',
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
          >
            <ElementRenderer 
              element={element}
              isSelected={selectedElements.includes(element.id)}
            />
          </AnimatedElement>
        ))}
      </div>
      
      {/* Canvas controls overlay */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        {/* Zoom controls */}
        <div className="bg-white bg-opacity-90 rounded-full shadow-md flex items-center p-1">
          <button
            className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setScale(prev => Math.max(prev * 0.8, 0.1))}
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="px-2 text-xs font-medium text-gray-700">
            {Math.round(scale * 100)}%
          </div>
          
          <button
            className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setScale(prev => Math.min(prev * 1.2, 5))}
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Grid toggle (only in editor mode) */}
        {viewMode === 'editor' && (
          <button
            className={`p-2 rounded-full focus:outline-none ${
              showGrid ? 'bg-primary-100 text-primary-600' : 'bg-white bg-opacity-90 text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setShowGrid(prev => !prev)}
            title={showGrid ? 'Hide Grid' : 'Show Grid'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* View mode indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
        {viewMode === 'editor' && 'Editor Mode'}
        {viewMode === 'timeline' && 'Timeline Mode'}
        {viewMode === 'presentation' && 'Presentation Mode'}
        {viewMode === 'zine' && 'Zine Mode'}
      </div>
    </div>
  );
}

export default EnhancedCanvas;
