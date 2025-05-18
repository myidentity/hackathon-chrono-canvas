/**
 * ElementRenderer component for ChronoCanvas
 * 
 * This component renders different types of elements based on their type
 * and handles element selection and interaction.
 */

import React from 'react';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import ShapeElement from './ShapeElement';
import StickerElement from './StickerElement';
import AudioElement from './AudioElement';
import { ViewMode } from '../../types/ViewMode';

// Define image element interface specifically for type checking
interface ImageElementType {
  id: string;
  type: 'image';
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex?: number;
  src: string; // Required for image elements
  alt?: string;
  [key: string]: any;
}

// Define base element interface
interface BaseElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker' | 'audio' | 'map' | 'media';
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex?: number;
  src?: string;
  [key: string]: any; // Allow for additional properties
}

interface ElementRendererProps {
  element: BaseElement;
  isSelected: boolean;
  onSelect?: (e: React.MouseEvent) => void; // Make optional
  viewMode?: ViewMode;
  currentPosition?: number;
  scrollPosition?: number;
}

/**
 * ElementRenderer component
 * Renders different types of elements based on their type
 * 
 * @param {ElementRendererProps} props - Component properties
 * @returns {JSX.Element | null} Rendered element or null if type is not supported
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  onSelect,
  viewMode = 'editor'
}) => {
  const isEditor = viewMode === 'editor';

  // Debug log for element rendering
  console.log('Rendering element:', element.id, element.type);

  /**
   * Handle element selection
   * 
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleSelect = (e: React.MouseEvent): void => {
    console.log('Element selected:', element.id);
    if (onSelect) {
      onSelect(e);
    }
  };

  // Add data-element-id attribute for element selection
  const elementProps = {
    'data-element-id': element.id,
    onClick: handleSelect
  };

  switch (element.type) {
    case 'image':
      // Ensure src is defined for image elements
      if (!element.src) {
        console.warn('Image element missing src property:', element.id);
        return null;
      }
      // Type assertion to ensure element has required properties for ImageElement
      const imageElement = element as ImageElementType;
      return <ImageElement element={imageElement} isSelected={isSelected} onClick={handleSelect} />;
    case 'text':
      return <TextElement element={element} isSelected={isSelected} onClick={handleSelect} />;
    case 'shape':
      return <ShapeElement element={element} isSelected={isSelected} onClick={handleSelect} />;
    case 'sticker':
      return <StickerElement element={element} isSelected={isSelected} onClick={handleSelect} />;
    case 'audio':
      return <AudioElement element={element} isEditor={isEditor} />;
    case 'map':
      // Handle map elements similar to images but with the component rendering
      return (
        <div
          {...elementProps}
          style={{
            position: 'absolute',
            left: element.position?.x || 0,
            top: element.position?.y || 0,
            width: element.size?.width || 400,
            height: element.size?.height || 600,
            border: isSelected ? '2px dashed #1976d2' : 'none',
            pointerEvents: 'all',
            cursor: 'move',
            zIndex: element.zIndex || 1
          }}
        >
          {element.component}
        </div>
      );
    default:
      console.warn('Unknown element type:', element.type);
      return null;
  }
};

export default ElementRenderer;
