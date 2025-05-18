import React, { useState, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';

interface TextElementProps {
  element: any;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const TextElement: React.FC<TextElementProps> = ({ element, isSelected, onClick }) => {
  const { updateElementPosition } = useCanvas();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    console.log('TextElement clicked:', element.id);
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
        height: element.size?.height || element.height || 'auto',
        padding: '8px',
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: isSelected ? 'move' : 'pointer',
        zIndex: element.zIndex || 1,
        color: element.color || '#333',
        backgroundColor: element.backgroundColor || 'transparent',
        fontSize: element.fontSize || '16px',
        fontWeight: element.fontWeight || 'normal',
        textAlign: element.textAlign || 'left',
        overflow: 'hidden'
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {element.content || 'Text Element'}
    </div>
  );
};

export default TextElement;t default TextElement;
