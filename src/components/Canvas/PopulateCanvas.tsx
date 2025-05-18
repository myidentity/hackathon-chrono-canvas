/**
 * PopulateCanvas component for ChronoCanvas
 * 
 * This component provides a button to populate the canvas with a variety of shapes,
 * polygons, and symbols for demonstration purposes.
 */

import React, { useState } from 'react';
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
  const { addElement, canvas, clearCanvas } = useCanvas();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
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
  
  // Handle clearing the canvas with confirmation
  const handleClearCanvas = () => {
    setShowConfirmClear(true);
  };
  
  // Confirm and clear the canvas
  const confirmClear = () => {
    if (clearCanvas) {
      clearCanvas();
    }
    setShowConfirmClear(false);
  };
  
  // Cancel clearing the canvas
  const cancelClear = () => {
    setShowConfirmClear(false);
  };
  
  return (
    <div className={`${className} flex flex-col space-y-2`}>
      <button
        onClick={handlePopulate}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
        title="Populate Canvas with Shapes and Symbols"
      >
        <span className="material-icons mr-2">auto_awesome</span>
        Populate Canvas
      </button>
      
      {/* Clear Canvas button - positioned below the Populate button */}
      <button
        onClick={handleClearCanvas}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        title="Clear Canvas"
      >
        <span className="material-icons mr-2">delete_sweep</span>
        Clear Canvas
      </button>
      
      {/* Confirmation dialog for clearing canvas */}
      {showConfirmClear && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-medium mb-4">Clear Canvas?</h3>
            <p className="mb-6">Are you sure you want to clear all elements from the canvas? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelClear}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopulateCanvas;
