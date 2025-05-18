import React, { useState, useRef } from 'react';
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

  const handleClick = (e: React.MouseEvent) => {
    // Remove console logs for production
    // console.log('ImageElement clicked:', element.id);
    // console.log('Current isSelected state in ImageElement:', isSelected);
    e.stopPropagation(); // Prevent event from bubbling to canvas
    onClick(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      e.preventDefault(); // Prevent default browser behavior
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Update element position through context
      updateElementPosition(element.id, deltaX, deltaY);
      
      // Reset drag start position
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      setIsDragging(false);
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: element.position?.x || element.x || 0,
        top: element.position?.y || element.y || 0,
        width: element.size?.width || element.width || 200,
        height: element.size?.height || element.height || 200,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: isSelected ? 'move' : 'pointer',
        zIndex: element.zIndex || 1,
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.opacity !== undefined ? element.opacity : 1
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={element.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none' // Prevent img from capturing events
        }}
      />
    </div>
  );
};

export default ImageElement;
