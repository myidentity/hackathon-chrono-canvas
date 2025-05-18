import React, { useState, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';

interface TextElementData {
  id: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  size?: { width: number; height: number };
  width?: number;
  height?: number;
  zIndex?: number;
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  content?: string;
}

interface TextElementProps {
  element: TextElementData;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

/**
 * TextElement component
 * Renders a text element on the canvas
 * 
 * @param {TextElementProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const TextElement: React.FC<TextElementProps> = ({ element, isSelected, onClick }) => {
  const { updateElementPosition } = useCanvas();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  /**
   * Handle element click
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation(); // Prevent event from bubbling to canvas
    onClick(e);
  };

  /**
   * Handle mouse down for dragging
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (isSelected) {
      e.stopPropagation(); // Prevent canvas panning when dragging element
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  /**
   * Handle mouse move for dragging
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
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

  /**
   * Handle mouse up to end dragging
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - Mouse event
   */
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>): void => {
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
        color: element.color || '#333333',
        backgroundColor: element.backgroundColor || 'transparent',
        fontSize: element.fontSize || '16px',
        fontWeight: element.fontWeight || 'normal',
        textAlign: element.textAlign as React.CSSProperties['textAlign'] || 'left',
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

export default TextElement;
