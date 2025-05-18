import React from 'react';
// Remove unused imports to fix TypeScript errors
// import { useCanvas } from '../../context/CanvasContext';
// import { useTimeline } from '../../context/TimelineContext';

interface AudioElementProps {
  element: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    name?: string;
    position?: { x: number; y: number };
  };
  isEditor: boolean;
}

const AudioElement: React.FC<AudioElementProps> = ({ element, isEditor }) => {
  // Only show audio elements in editor mode
  if (!isEditor) {
    return null;
  }

  // Handle both x/y and position.x/position.y formats
  const xPos = element.position ? element.position.x : (element.x || 0);
  const yPos = element.position ? element.position.y : (element.y || 0);

  return (
    <div
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: element.width || 200,
        height: element.height || 50,
        border: '1px solid #1976d2',
        borderRadius: '4px',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        pointerEvents: 'all',
        cursor: 'move',
        zIndex: element.zIndex || 1
      }}
    >
      <span className="material-icons" style={{ marginRight: '8px', color: '#1976d2' }}>
        music_note
      </span>
      <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {element.name || 'Audio Clip'}
      </div>
    </div>
  );
};

export default AudioElement;
