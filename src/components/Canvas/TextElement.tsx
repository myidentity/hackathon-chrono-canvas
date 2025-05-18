import React from 'react';

interface TextElementProps {
  element: any;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const TextElement: React.FC<TextElementProps> = ({ element, isSelected, onClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        minWidth: element.width || 100,
        minHeight: element.height || 50,
        padding: '8px',
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: 'move',
        zIndex: element.zIndex || 1,
        color: element.color || '#000',
        fontFamily: element.fontFamily || 'Arial',
        fontSize: element.fontSize || '16px',
        fontWeight: element.fontWeight || 'normal',
        textAlign: element.textAlign || 'left',
        backgroundColor: element.backgroundColor || 'transparent'
      }}
      onClick={onClick}
    >
      {element.text || 'Text Element'}
    </div>
  );
};

export default TextElement;
