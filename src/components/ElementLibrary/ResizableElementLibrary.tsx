/**
 * ResizableElementLibrary component for ChronoCanvas.
 * 
 * This component wraps the ElementLibrary component with resizable functionality,
 * allowing users to adjust the width of the left panel.
 * 
 * @module ResizableElementLibrary
 */

import React, { useState, useRef, useEffect } from 'react';
import ElementLibrary from './ElementLibrary';

interface ResizableElementLibraryProps {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * ResizableElementLibrary component that provides a resizable wrapper for ElementLibrary
 * 
 * @param {ResizableElementLibraryProps} props - Component properties
 * @returns {JSX.Element} The rendered ResizableElementLibrary component
 */
const ResizableElementLibrary: React.FC<ResizableElementLibraryProps> = ({
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 500
}) => {
  // State for panel width
  const [width, setWidth] = useState<number>(defaultWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  
  // Refs for DOM elements
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(defaultWidth);
  
  /**
   * Handle mouse down on the resizer
   * 
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  /**
   * Handle mouse move during resize
   * 
   * @param {MouseEvent} e - Mouse event
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
    
    setWidth(newWidth);
  };
  
  /**
   * Handle mouse up to end resize
   */
  const handleMouseUp = () => {
    setIsResizing(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);
  
  return (
    <div 
      ref={panelRef}
      className="h-full flex flex-col relative"
      style={{ width: `${width}px` }}
    >
      {/* Element Library */}
      <ElementLibrary />
      
      {/* Resizer handle with improved visual cues */}
      <div
        className={`absolute top-0 right-0 h-full flex items-center justify-center ${
          isResizing ? 'z-50' : 'z-10'
        }`}
        style={{ 
          width: '8px',
          cursor: 'col-resize',
        }}
        onMouseDown={handleMouseDown}
        title="Drag to resize panel"
      >
        {/* Visual divider with grip dots */}
        <div 
          className={`h-full w-1 ${
            isResizing ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
        
        {/* Grip dots for better visual indication */}
        <div className="absolute inset-y-0 flex flex-col justify-center items-center pointer-events-none">
          <div className="flex flex-col space-y-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${
                  isResizing 
                    ? 'bg-blue-600' 
                    : 'bg-gray-400 dark:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableElementLibrary;
