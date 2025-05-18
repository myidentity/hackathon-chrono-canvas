/**
 * ToolsPalette component for ChronoCanvas
 * 
 * This component provides a palette of tools for adding shapes and other elements
 * to the canvas.
 */

import React, { useMemo } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { v4 as uuidv4 } from 'uuid';

interface ToolsPaletteProps {
  className?: string;
  searchQuery?: string;
}

/**
 * ToolsPalette component
 * Provides a palette of shapes and tools
 */
const ToolsPalette: React.FC<ToolsPaletteProps> = ({ className = '', searchQuery = '' }) => {
  const { addElement } = useCanvas();
  
  // Shape definitions
  const shapes = [
    { id: 'rectangle', name: 'Rectangle', shape: 'rectangle', color: '#6366F1' },
    { id: 'circle', name: 'Circle', shape: 'circle', color: '#EC4899' },
    { id: 'triangle', name: 'Triangle', shape: 'triangle', color: '#10B981' },
    { id: 'star', name: 'Star', shape: 'star', color: '#F59E0B' },
    { id: 'hexagon', name: 'Hexagon', shape: 'hexagon', color: '#8B5CF6' },
    { id: 'pentagon', name: 'Pentagon', shape: 'pentagon', color: '#EF4444' },
    { id: 'diamond', name: 'Diamond', shape: 'diamond', color: '#3B82F6' },
    { id: 'arrow', name: 'Arrow', shape: 'arrow', color: '#14B8A6' },
  ];
  
  // Filter shapes based on search query
  const filteredShapes = useMemo(() => {
    if (!searchQuery) return shapes;
    return shapes.filter(shape => 
      shape.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shapes, searchQuery]);
  
  // Handle adding a shape to the canvas
  const handleAddShape = (shape: string, color: string) => {
    // Create a new shape element
    const newElement = {
      id: `shape-${uuidv4().substring(0, 8)}`,
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      rotation: 0,
      backgroundColor: color,
      shape: shape,
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
    
    // Add the shape to the canvas
    addElement(newElement);
  };
  
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {filteredShapes.map((shape) => (
        <div
          key={shape.id}
          className="aspect-square flex items-center justify-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
          onClick={() => handleAddShape(shape.shape, shape.color)}
          title={shape.name}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: shape.color }}
          >
            {shape.shape === 'rectangle' && (
              <div className="w-10 h-8 rounded" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === 'circle' && (
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === 'triangle' && (
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '20px solid transparent',
                  borderRight: '20px solid transparent',
                  borderBottom: `35px solid ${shape.color}`,
                }}
              />
            )}
            {shape.shape === 'star' && (
              <span className="material-icons text-3xl">star</span>
            )}
            {shape.shape === 'hexagon' && (
              <span className="material-icons text-3xl">hexagon</span>
            )}
            {shape.shape === 'pentagon' && (
              <span className="material-icons text-3xl">pentagon</span>
            )}
            {shape.shape === 'diamond' && (
              <div
                className="w-10 h-10"
                style={{
                  backgroundColor: shape.color,
                  transform: 'rotate(45deg)',
                }}
              />
            )}
            {shape.shape === 'arrow' && (
              <span className="material-icons text-3xl">arrow_forward</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsPalette;
