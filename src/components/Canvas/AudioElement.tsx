import React, { useEffect, useRef } from 'react';
import { useCanvasContext } from '../../context/CanvasContext';
import { useTimelineContext } from '../../context/TimelineContext';

interface AudioElementProps {
  element: any;
  isEditor: boolean;
}

const AudioElement: React.FC<AudioElementProps> = ({ element, isEditor }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentFrame } = useTimelineContext();
  const { mode } = useCanvasContext();
  
  // Check if we're in editor mode
  const isEditorMode = mode === 'editor' || isEditor;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Get the start and end frames from the element
    const startFrame = element.startFrame || 0;
    const endFrame = element.endFrame || 100;

    // Play audio when currentFrame matches startFrame
    if (currentFrame === startFrame) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Audio play error:", err));
    }
    
    // Pause audio when currentFrame is outside the range
    if (currentFrame < startFrame || currentFrame > endFrame) {
      audio.pause();
    }
  }, [currentFrame, element]);

  // Only render the visual component in editor mode
  if (isEditorMode) {
    return (
      <div 
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width || 100,
          height: element.height || 100,
          backgroundColor: 'rgba(100, 149, 237, 0.3)',
          border: '2px solid cornflowerblue',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
          cursor: 'move',
          zIndex: element.zIndex || 1
        }}
      >
        <audio ref={audioRef} src={element.src} style={{ display: 'none' }} />
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" width="40" height="40" style={{ fill: 'cornflowerblue' }}>
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,7L15,12L10,17V7Z" />
          </svg>
          <div style={{ fontSize: '12px', color: '#333' }}>
            Audio: {element.name || 'Sound Clip'}
          </div>
        </div>
      </div>
    );
  } else {
    // In non-editor mode, only render the audio element without visual representation
    return <audio ref={audioRef} src={element.src} style={{ display: 'none' }} />;
  }
};

export default AudioElement;
