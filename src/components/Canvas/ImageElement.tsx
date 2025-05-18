import React, { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';

interface ImageElement {
  id: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  size?: { width: number; height: number };
  width?: number;
  height?: number;
  zIndex?: number;
  src: string;
  alt?: string;
  rotation?: number;
  opacity?: number;
}

interface ImageElementProps {
  element: ImageElement;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({ element, isSelected, onClick }) => {
  const { updateElementPosition } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Force event optimization on mount
  useEffect(() => {
    // This empty effect ensures React properly initializes event handlers
    // for this component, regardless of element addition sequence
    const node = elementRef.current;
    if (node) {
      // Trigger a synthetic event to ensure event system is initialized
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      node.dispatchEvent(event);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to canvas
    onClick(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // Add a class to the body to indicate dragging is active
      document.body.classList.add('element-dragging');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      e.preventDefault(); // Prevent default browser behavior
      
      // Calculate position delta since last update
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Only update if there's actual movement
      if (deltaX !== 0 || deltaY !== 0) {
        // Update element position through context
        updateElementPosition(element.id, deltaX, deltaY);
        
        // Reset drag start position to current mouse position
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      setIsDragging(false);
      
      // Remove the dragging class from body
      document.body.classList.remove('element-dragging');
    }
  };

  // Get position from element, ensuring we have valid coordinates
  const positionX = element.position?.x ?? element.x ?? 0;
  const positionY = element.position?.y ?? element.y ?? 0;
  
  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: positionX,
        top: positionY,
        width: element.size?.width || element.width || 200,
        height: element.size?.height || element.height || 200,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: isSelected ? 'move' : 'pointer',
        zIndex: element.zIndex || 1,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.opacity !== undefined ? element.opacity : 1,
        willChange: isDragging ? 'left, top' : 'auto', // Optimize rendering during drag
        touchAction: 'none' // Prevent browser handling of touch events
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-element-type="image"
    >
      <img
        src={element.src}
        alt={element.alt || "Image"}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none', // Prevent img from capturing events
          userSelect: 'none' // Prevent selection during drag
        }}
        draggable={false} // Prevent browser's native drag behavior
      />
    </div>
  );
};

export default ImageElement;
