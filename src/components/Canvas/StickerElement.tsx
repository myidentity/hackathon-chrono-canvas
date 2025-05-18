import React from 'react';

interface StickerElementProps {
  element: any;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const StickerElement: React.FC<StickerElementProps> = ({ element, isSelected, onClick }) => {
  console.log('Rendering StickerElement with data:', element);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: element.position?.x || element.x || 0,
        top: element.position?.y || element.y || 0,
        width: element.size?.width || element.width || 100,
        height: element.size?.height || element.height || 100,
        border: isSelected ? '2px dashed #1976d2' : 'none',
        pointerEvents: 'all',
        cursor: 'move',
        zIndex: element.zIndex || 1,
        backgroundColor: element.color || 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClick}
    >
      {element.emoji ? (
        <span style={{ fontSize: '3rem' }}>{element.emoji}</span>
      ) : element.src ? (
        <img
          src={element.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      ) : (
        <div style={{ fontSize: '1rem', color: '#666' }}>Sticker</div>
      )}
    </div>
  );
};

export default StickerElement;
