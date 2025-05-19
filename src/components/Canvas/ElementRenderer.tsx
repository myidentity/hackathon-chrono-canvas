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
  
  // Refs to track previous values to avoid infinite loops
  const prevPropertiesRef = useRef(element.properties);
  const prevPositionRef = useRef(currentPosition);
  
  // Ensure element.properties exists to prevent errors
  const properties = element.properties || {};
  
  // Direct DOM manipulation for animation, similar to the test page approach
  useEffect(() => {
    if (elementRef.current) {
      const el = elementRef.current;
      
      // Apply position directly to the DOM element
      if (properties.position) {
        el.style.left = `${properties.position.x}px`;
        el.style.top = `${properties.position.y}px`;
      }
      
      // Apply size directly to the DOM element
      if (properties.size) {
        el.style.width = `${properties.size.width}px`;
        el.style.height = `${properties.size.height}px`;
      }
      
      // Apply rotation directly to the DOM element
      if (properties.rotation !== undefined) {
        el.style.transform = `rotate(${properties.rotation}deg)`;
      }
      
      // Apply opacity directly to the DOM element
      if (properties.opacity !== undefined) {
        el.style.opacity = properties.opacity.toString();
      }
      
      // Only update animation frame if properties or position actually changed
      // This prevents infinite update loops
      const propertiesChanged = JSON.stringify(properties) !== JSON.stringify(prevPropertiesRef.current);
      const positionChanged = currentPosition !== prevPositionRef.current;
      
      if (propertiesChanged || positionChanged) {
        // Update refs with current values
        prevPropertiesRef.current = properties;
        prevPositionRef.current = currentPosition;
        
        // Force a re-render by incrementing animation frame
        setAnimationFrame(prev => prev + 1);
      }
    }
  }, [properties, currentPosition]);
  
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
  
  // Default values for properties to prevent undefined errors
  const position = properties.position || { x: 0, y: 0 };
  const size = properties.size || { width: 100, height: 100 };
  const rotation = properties.rotation !== undefined ? properties.rotation : 0;
  const opacity = properties.opacity !== undefined ? properties.opacity : 1;
  const zIndex = properties.zIndex || 0;
  
  return (
    <div 
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ 
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg)`,
        opacity: opacity,
        zIndex: zIndex,
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
