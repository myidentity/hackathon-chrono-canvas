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
 * 
 * @param {PopulateCanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const PopulateCanvas: React.FC<PopulateCanvasProps> = ({ className = '' }) => {
  const { addElement } = useCanvas();
  
  /**
   * Handle populating the canvas with random elements
   */
  const handlePopulate = (): void => {
    // Generate random elements (adjust count as needed)
    const elements = generateRandomElements(20, 800, 600);
    
    // Add each element to the canvas
    elements.forEach(element => {
      // Ensure the element type is properly typed as a const to match the expected union
      const typedElement = {
        ...element,
        type: element.type as 'image' | 'text' | 'shape' | 'sticker' | 'media' | 'audio' | 'map'
      };
      addElement(typedElement);
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
