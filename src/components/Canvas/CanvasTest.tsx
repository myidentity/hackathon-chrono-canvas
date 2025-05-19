import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTimeline } from '../../context/TimelineContext';
import { useCanvas } from '../../context/CanvasContext';
import FramerMotionTest from './FramerMotionTest';

/**
 * Canvas component for ChronoCanvas
 * 
 * @returns {JSX.Element} Rendered component
 */
const Canvas: React.FC = () => {
  const { currentPosition, duration } = useTimeline();
  const { elements, selectedElements } = useCanvas();
  
  return (
    <div className="canvas-container relative w-full h-full bg-white overflow-hidden">
      {/* Test component for Framer Motion integration */}
      <FramerMotionTest 
        currentPosition={currentPosition} 
        duration={duration} 
      />
      
      {/* Display current timeline position for debugging */}
      <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 text-xs rounded">
        Timeline: {currentPosition.toFixed(2)}s / {duration}s
      </div>
    </div>
  );
};

export default Canvas;
