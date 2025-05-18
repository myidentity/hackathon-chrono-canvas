/**
 * PopulateCanvas component for ChronoCanvas
 * 
 * This component provides a button to populate the canvas with a variety of shapes,
 * polygons, and symbols for demonstration purposes.
 */

import React from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { generateRandomElements } from '../../utils/ShapeGenerator';

interface PopulateCanvasProps {
  className?: string;
}

/**
 * PopulateCanvas component
 * Adds a button to populate the canvas with random shapes and symbols
 */
const PopulateCanvas: React.FC<PopulateCanvasProps> = ({ className = '' }) => {
  const { addElement, canvas } = useCanvas();
  
  // Handle populating the canvas with random elements
  const handlePopulate = () => {
    // Generate random elements (adjust count as needed)
    const elements = generateRandomElements(20, 800, 600);
    
    // Add each element to the canvas
    elements.forEach(element => {
      addElement(element);
    });
    
    // Show confirmation
    alert(`Added ${elements.length} shapes and symbols to the canvas!`);
  };
  
  return (
    <div className={`${className}`}>
      <button
        onClick={handlePopulate}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
        title="Populate Canvas with Shapes and Symbols"
      >
        <span className="material-icons mr-2">auto_awesome</span>
        Populate Canvas
      </button>
    </div>
  );
};

export default PopulateCanvas;
