import React, { useEffect, useState, useRef } from 'react';
import { CanvasElement } from '../../types/CanvasElement';
import ShapeElement from './ShapeElement';
import TextElement from './TextElement';
import StickerElement from './StickerElement';
import ImageElement from './ImageElement';
import { ViewMode } from '../../types/ViewMode';

interface ElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  viewMode: ViewMode;
  currentPosition: number;
}

/**
 * ElementRenderer component
 * Renders different types of canvas elements
 * 
 * @param {ElementRendererProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  viewMode,
  currentPosition
}) => {
  // Create a ref to directly access and update the DOM element
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Local state to track animation frame for forced re-renders
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Direct DOM manipulation for animation, similar to the test page approach
  useEffect(() => {
    if (elementRef.current) {
      const el = elementRef.current;
      
      // Apply position directly to the DOM element
      if (element.properties.position) {
        el.style.left = `${element.properties.position.x}px`;
        el.style.top = `${element.properties.position.y}px`;
      }
      
      // Apply size directly to the DOM element
      if (element.properties.size) {
        el.style.width = `${element.properties.size.width}px`;
        el.style.height = `${element.properties.size.height}px`;
      }
      
      // Apply rotation directly to the DOM element
      if (element.properties.rotation !== undefined) {
        el.style.transform = `rotate(${element.properties.rotation}deg)`;
      }
      
      // Apply opacity directly to the DOM element
      if (element.properties.opacity !== undefined) {
        el.style.opacity = element.properties.opacity.toString();
      }
      
      // Force a re-render by incrementing animation frame
      setAnimationFrame(prev => prev + 1);
    }
  }, [element.properties, currentPosition]);
  
  // Render the appropriate element type
  const renderElement = () => {
    switch (element.type) {
      case 'shape':
        return (
          <ShapeElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'text':
        return (
          <TextElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'sticker':
        return (
          <StickerElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'image':
        return (
          <ImageElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ 
        left: element.properties.position?.x,
        top: element.properties.position?.y,
        width: element.properties.size?.width,
        height: element.properties.size?.height,
        transform: element.properties.rotation !== undefined ? `rotate(${element.properties.rotation}deg)` : undefined,
        opacity: element.properties.opacity,
        zIndex: element.properties.zIndex || 0,
        transition: 'none', // Disable CSS transitions to prevent interference with our animation
        cursor: viewMode === 'editor' ? 'move' : 'default'
      }}
      data-element-id={element.id}
      data-animation-frame={animationFrame} // Add animation frame to force re-renders
    >
      {renderElement()}
    </div>
  );
};

export default ElementRenderer;
