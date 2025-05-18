import React from 'react';

interface ShapeElementProps {
  element: any;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ShapeElement: React.FC<ShapeElementProps> = ({ element, isSelected, onClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width || 100,
        height: element.height || 100,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: 'move',
        zIndex: element.zIndex || 1,
        color: element.color || '#333',
        backgroundColor: element.backgroundColor || 'transparent'
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ 
        __html: element.svg ? element.svg.replace('currentColor', element.color || '#333') : '' 
      }}
    />
  );
};

export default ShapeElement;
