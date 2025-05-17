/**
 * Canvas component for ChronoCanvas.
 * 
 * This component renders the main canvas area where users can place and manipulate elements.
 * It handles different view modes and element interactions.
 * 
 * @module Canvas
 */

import { useRef, useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';

/**
 * Props for the Canvas component
 */
interface CanvasProps {
  /**
   * The current view mode of the application
   */
  viewMode: 'editor' | 'timeline' | 'presentation' | 'zine';
}

/**
 * Canvas component that renders the main workspace
 * 
 * @param {CanvasProps} props - The component props
 * @returns {JSX.Element} The rendered Canvas component
 */
function Canvas({ viewMode }: CanvasProps): JSX.Element {
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
      
      // Calculate new scale with limits
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.1), 5);
      
      setScale(newScale);
    }
  };

  /**
   * Filter visible elements based on timeline position
   * 
   * @returns {Array} Array of visible elements at the current timeline position
   */
  const getVisibleElements = () => {
    return canvas.elements.filter(element => {
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

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full relative overflow-hidden bg-white shadow-lg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      {/* Canvas background */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: canvas.background.type === 'color' ? canvas.background.value : 'transparent',
          backgroundImage: canvas.background.type === 'gradient' ? canvas.background.value : 'none',
        }}
      />
      
      {/* Canvas content container with transform for pan and zoom */}
      <div 
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: `${canvas.width}px`,
          height: `${canvas.height}px`,
        }}
      >
        {/* Render visible elements */}
        {visibleElements.map(element => (
          <div
            key={element.id}
            className={`absolute ${selectedElements.includes(element.id) ? 'ring-2 ring-primary-500' : ''}`}
            style={{
              left: `${element.position.x}px`,
              top: `${element.position.y}px`,
              width: `${element.size.width}px`,
              height: `${element.size.height}px`,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.opacity,
              zIndex: element.position.z,
            }}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
          >
            {/* Placeholder for element content - will be replaced with actual element renderer */}
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
              {element.type}
            </div>
          </div>
        ))}
      </div>
      
      {/* View mode indicator */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
        {viewMode === 'editor' && 'Editor Mode'}
        {viewMode === 'timeline' && 'Timeline Mode'}
        {viewMode === 'presentation' && 'Presentation Mode'}
        {viewMode === 'zine' && 'Zine Mode'}
      </div>
      
      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}

export default Canvas;
