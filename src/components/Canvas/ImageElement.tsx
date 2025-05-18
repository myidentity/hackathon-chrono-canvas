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
  const { updateElementPosition, setDraggingState } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Force event system initialization on mount
  useEffect(() => {
    // This effect ensures React properly initializes event handlers
    // for this component, regardless of element addition sequence
    const node = elementRef.current;
    if (node) {
      // Create and dispatch synthetic events to ensure event system is fully initialized
      const events = ['mousemove', 'mousedown', 'mouseup', 'click'];
      events.forEach(eventType => {
        const event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          view: window
        });
        node.dispatchEvent(event);
      });
      
      // Add a class to help with debugging
      node.classList.add('image-element-initialized');
    }
    
    // Clean up function
    return () => {
      if (isDragging) {
        setIsDragging(false);
        setDraggingState(false);
        document.body.classList.remove('element-dragging');
      }
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to canvas
    onClick(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      e.preventDefault(); // Prevent default browser behavior
      
      setIsDragging(true);
      setDraggingState(true); // Update global dragging state
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // Add a class to the body to indicate dragging is active
      document.body.classList.add('element-dragging');
      
      // Force the browser to acknowledge this element is being interacted with
      if (elementRef.current) {
        elementRef.current.style.zIndex = `${(parseInt(elementRef.current.style.zIndex || '1') + 1)}`;
        setTimeout(() => {
          if (elementRef.current) {
            elementRef.current.style.zIndex = `${element.zIndex || 1}`;
          }
        }, 0);
      }
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
      e.preventDefault(); // Prevent default browser behavior
      
      setIsDragging(false);
      setDraggingState(false); // Update global dragging state
      
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
        willChange: isDragging ? 'left, top, transform' : 'auto', // Optimize rendering during drag
        touchAction: 'none', // Prevent browser handling of touch events
        userSelect: 'none' // Prevent text selection during drag
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
          userSelect: 'none', // Prevent selection during drag
          WebkitUserDrag: 'none' // Prevent Safari from dragging the image
        }}
        draggable={false} // Prevent browser's native drag behavior
      />
    </div>
  );
};

export default ImageElement;
