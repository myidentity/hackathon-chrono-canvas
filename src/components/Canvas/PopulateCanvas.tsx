/**
 * PopulateCanvas component for ChronoCanvas
 * 
 * This component automatically adds sample elements to the canvas
 * for testing purposes.
 */

import React, { useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';

interface PopulateCanvasProps {
  autoPopulate?: boolean;
}

/**
 * PopulateCanvas component
 * Adds sample elements to the canvas automatically or on button click
 */
const PopulateCanvas: React.FC<PopulateCanvasProps> = ({ autoPopulate = true }) => {
  const { addElement, canvas } = useCanvas();
  
  // Function to add sample elements to the canvas
  const populateCanvas = () => {
    console.log('PopulateCanvas: Adding sample elements to canvas');
    
    // Add a blue square
    addElement({
      type: 'shape',
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },
      backgroundColor: '#4285F4',
      shape: 'square',
    });
    
    // Add a red rectangle
    addElement({
      type: 'shape',
      position: { x: 400, y: 300 },
      size: { width: 150, height: 100 },
      backgroundColor: '#EA4335',
      shape: 'rectangle',
    });
    
    // Add a green circle
    addElement({
      type: 'shape',
      position: { x: 300, y: 400 },
      size: { width: 80, height: 80 },
      backgroundColor: '#34A853',
      shape: 'circle',
    });
    
    // Add a purple diamond
    addElement({
      type: 'shape',
      position: { x: 500, y: 200 },
      size: { width: 100, height: 100 },
      backgroundColor: '#9C27B0',
      shape: 'diamond',
    });
    
    // Add a teal triangle
    addElement({
      type: 'shape',
      position: { x: 150, y: 350 },
      size: { width: 100, height: 100 },
      backgroundColor: '#009688',
      shape: 'triangle',
    });
    
    console.log('PopulateCanvas: Added sample elements to canvas');
  };
  
  // Auto-populate the canvas on component mount if enabled
  useEffect(() => {
    if (autoPopulate && canvas.elements.length === 0) {
      console.log('PopulateCanvas: Auto-populating canvas');
      populateCanvas();
    }
  }, [autoPopulate, canvas.elements.length]);
  
  // If not auto-populating, render a button
  if (!autoPopulate) {
    return (
      <button 
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center"
        onClick={populateCanvas}
      >
        <span className="material-icons mr-2">auto_awesome</span>
        Populate Canvas
      </button>
    );
  }
  
  // If auto-populating, render nothing (just for testing)
  return null;
};

export default PopulateCanvas;
