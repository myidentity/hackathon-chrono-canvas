import React from 'react';

interface ImageElementProps {
  element: any;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({ element, isSelected, onClick }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width || 200,
        height: element.height || 200,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: 'move',
        zIndex: element.zIndex || 1
      }}
      onClick={onClick}
    >
      <img
        src={element.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default ImageElement;
