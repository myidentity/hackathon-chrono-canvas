import React from 'react';
import { useCanvas } from '../../context/CanvasContext';
import ImageElement from './ImageElement';
import TextElement from './TextElement';
import ShapeElement from './ShapeElement';
import StickerElement from './StickerElement';
import AudioElement from './AudioElement';

interface ElementRendererProps {
  element: any;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  viewMode?: 'editor' | 'timeline' | 'zine' | 'presentation';
  currentPosition?: number;
  scrollPosition?: number;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  onSelect,
  viewMode = 'editor',
  currentPosition = 0,
  scrollPosition = 0
}) => {
  const { canvas } = useCanvas();
  const isEditor = viewMode === 'editor';

  // Revert to simpler handler without stopPropagation
  const handleSelect = (e: React.MouseEvent) => {
    console.log('ElementRenderer handleSelect called for element:', element.id, element.type);
    console.log('Current isSelected state:', isSelected);
    onSelect(e);
  };

  switch (element.type) {
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} onClick={handleSelect} />;
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
          onClick={(e) => {
            console.log('Map element clicked:', element.id);
            handleSelect(e);
          }}
        >
          {element.component}
        </div>
      );
    default:
      return null;
  }
};

export default ElementRenderer;
