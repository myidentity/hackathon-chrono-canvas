/**
 * ToolsPalette component for ChronoCanvas
 * 
 * This component provides a palette of shapes, polygons, and symbols
 * that users can select and add to the canvas.
 */

import React from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { v4 as uuidv4 } from 'uuid';

interface ToolsPaletteProps {
  className?: string;
}

/**
 * ToolsPalette component
 * Provides a selection of shapes, polygons, and symbols for the editor
 */
const ToolsPalette: React.FC<ToolsPaletteProps> = ({ className = '' }) => {
  const { addElement } = useCanvas();
  
  // Define shape categories
  const shapeCategories = [
    {
      name: 'Basic Shapes',
      items: [
        { id: 'rectangle', name: 'Rectangle', icon: '⬛', color: '#4ECDC4' },
        { id: 'circle', name: 'Circle', icon: '⚫', color: '#FF6B6B' },
        { id: 'triangle', name: 'Triangle', icon: '▲', color: '#FFD166' },
        { id: 'diamond', name: 'Diamond', icon: '◆', color: '#6B5CA5' }
      ]
    },
    {
      name: 'Polygons',
      items: [
        { id: 'pentagon', name: 'Pentagon', icon: '⬠', color: '#72B01D' },
        { id: 'hexagon', name: 'Hexagon', icon: '⬡', color: '#3A86FF' },
        { id: 'star', name: 'Star', icon: '★', color: '#FF9F1C' },
        { id: 'octagon', name: 'Octagon', icon: '⯃', color: '#F72585' }
      ]
    },
    {
      name: 'Symbols',
      items: [
        { id: 'heart', name: 'Heart', icon: '❤', color: '#E71D36' },
        { id: 'arrow', name: 'Arrow', icon: '➡', color: '#2EC4B6' },
        { id: 'check', name: 'Check', icon: '✓', color: '#06D6A0' },
        { id: 'cross', name: 'Cross', icon: '✗', color: '#E71D36' },
        { id: 'plus', name: 'Plus', icon: '➕', color: '#8338EC' },
        { id: 'minus', name: 'Minus', icon: '➖', color: '#4CC9F0' },
        { id: 'music', name: 'Music', icon: '♪', color: '#7209B7' },
        { id: 'lightning', name: 'Lightning', icon: '⚡', color: '#FFD166' }
      ]
    }
  ];
  
  // Handle adding a shape to the canvas
  const handleAddShape = (shapeType: string, color: string) => {
    // Create a new shape element
    const newElement = {
      id: `${shapeType}-${uuidv4().substring(0, 8)}`,
      type: 'shape',
      shape: shapeType,
      position: {
        x: 100,
        y: 100,
      },
      size: {
        width: 100,
        height: 100,
      },
      rotation: 0,
      backgroundColor: color,
      opacity: 1,
      zIndex: 1,
      timelineData: {
        entryPoint: 0,
        exitPoint: null,
        persist: true,
        keyframes: [
          {
            time: 0,
            properties: {
              opacity: 0,
              scale: 0.8,
            },
          },
          {
            time: 1,
            properties: {
              opacity: 1,
              scale: 1,
            },
          },
        ],
      },
    };
    
    // Add the new element to the canvas
    if (addElement) {
      addElement(newElement);
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Tools Palette</h3>
      
      {shapeCategories.map((category) => (
        <div key={category.name} className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">{category.name}</h4>
          <div className="grid grid-cols-4 gap-2">
            {category.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddShape(item.id, item.color)}
                className="flex flex-col items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={`Add ${item.name}`}
              >
                <span className="text-2xl mb-1" style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsPalette;
