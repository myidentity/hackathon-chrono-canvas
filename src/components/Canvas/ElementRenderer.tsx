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
  const { mode } = useCanvas();
  const isEditor = mode === 'editor' || viewMode === 'editor';

  switch (element.type) {
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} onClick={onSelect} />;
    case 'text':
      return <TextElement element={element} isSelected={isSelected} onClick={onSelect} />;
    case 'shape':
      return <ShapeElement element={element} isSelected={isSelected} onClick={onSelect} />;
    case 'sticker':
      return <StickerElement element={element} isSelected={isSelected} onClick={onSelect} />;
    case 'audio':
      return <AudioElement element={element} isEditor={isEditor} />;
    case 'map':
      // Handle map elements similar to images but with the component rendering
      return (
        <div
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
            width: element.width || 400,
            height: element.height || 600,
            border: isSelected ? '2px dashed #1976d2' : 'none',
            pointerEvents: 'all',
            cursor: 'move',
            zIndex: element.zIndex || 1
          }}
          onClick={onSelect}
        >
          {element.component}
        </div>
      );
    default:
      return null;
  }
};

export default ElementRenderer;
