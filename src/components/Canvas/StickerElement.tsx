import React, { useState, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';

interface StickerElement {
  id: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  size?: { width: number; height: number };
  width?: number;
  height?: number;
  zIndex?: number;
  color?: string;
  emoji?: string;
  src?: string;
}

interface StickerElementProps {
  element: StickerElement;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const StickerElement: React.FC<StickerElementProps> = ({ element, isSelected, onClick }) => {
  // Remove console log for production
  // console.log('Rendering StickerElement with data:', element);
  
  const { updateElementPosition } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    // Remove console log for production
    // console.log('StickerElement clicked:', element.id);
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
        width: element.size?.width || element.width || 100,
        height: element.size?.height || element.height || 100,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: isSelected ? 'move' : 'pointer',
        zIndex: element.zIndex || 1,
        backgroundColor: element.color || 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${element.rotation || 0}deg)`,
        opacity: element.opacity !== undefined ? element.opacity : 1
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {element.emoji ? (
        <span style={{ fontSize: '3rem' }}>{element.emoji}</span>
      ) : element.src ? (
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
      ) : (
        <div style={{ fontSize: '1rem', color: '#666666' }}>Sticker</div>
      )}
    </div>
  );
};

export default StickerElement;
