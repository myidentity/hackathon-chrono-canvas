/**
 * ToolsPalette component for ChronoCanvas
 * 
 * This component provides a palette of tools for adding shapes and other elements
 * to the canvas.
 */

import React, { useMemo } from 'react';
import { useCanvas, CanvasElement } from '../../context/CanvasContext';
import { v4 as uuidv4 } from 'uuid';

interface ToolsPaletteProps {
  className?: string;
  searchQuery?: string;
}

interface ShapeDefinition {
  id: string;
  name: string;
  shape: string;
  color: string;
}

/**
 * ToolsPalette component
 * Provides a palette of shapes and tools
 * 
 * @param {ToolsPaletteProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ToolsPalette: React.FC<ToolsPaletteProps> = ({ className = '', searchQuery = '' }) => {
  const { addElement } = useCanvas();
  
  // Shape definitions - expanded with more shapes
  const shapes: ShapeDefinition[] = [
    { id: 'rectangle', name: 'Rectangle', shape: 'rectangle', color: '#6366F1' },
    { id: 'square', name: 'Square', shape: 'square', color: '#8B5CF6' },
    { id: 'circle', name: 'Circle', shape: 'circle', color: '#EC4899' },
    { id: 'oval', name: 'Oval', shape: 'oval', color: '#F472B6' },
    { id: 'triangle', name: 'Triangle', shape: 'triangle', color: '#10B981' },
    { id: 'right-triangle', name: 'Right Triangle', shape: 'right-triangle', color: '#34D399' },
    { id: 'star', name: 'Star', shape: 'star', color: '#F59E0B' },
    { id: 'star-4', name: '4-Point Star', shape: 'star-4', color: '#FBBF24' },
    { id: 'hexagon', name: 'Hexagon', shape: 'hexagon', color: '#8B5CF6' },
    { id: 'pentagon', name: 'Pentagon', shape: 'pentagon', color: '#EF4444' },
    { id: 'octagon', name: 'Octagon', shape: 'octagon', color: '#A78BFA' },
    { id: 'diamond', name: 'Diamond', shape: 'diamond', color: '#3B82F6' },
    { id: 'parallelogram', name: 'Parallelogram', shape: 'parallelogram', color: '#60A5FA' },
    { id: 'trapezoid', name: 'Trapezoid', shape: 'trapezoid', color: '#93C5FD' },
    { id: 'arrow', name: 'Arrow', shape: 'arrow', color: '#14B8A6' },
    { id: 'arrow-double', name: 'Double Arrow', shape: 'arrow-double', color: '#2DD4BF' },
    { id: 'heart', name: 'Heart', shape: 'heart', color: '#FB7185' },
    { id: 'cloud', name: 'Cloud', shape: 'cloud', color: '#38BDF8' },
    { id: 'speech-bubble', name: 'Speech Bubble', shape: 'speech-bubble', color: '#818CF8' },
    { id: 'lightning', name: 'Lightning', shape: 'lightning', color: '#FBBF24' },
  ];
  
  // Filter shapes based on search query
  const filteredShapes = useMemo(() => {
    if (!searchQuery) return shapes;
    return shapes.filter(shape => 
      shape.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shapes, searchQuery]);
  
  /**
   * Handle adding a shape to the canvas
   * 
   * @param {string} shape - Shape type
   * @param {string} color - Shape color
   */
  const handleAddShape = async (shape: string, color: string): Promise<void> => {
    try {
      // Import both shape modules concurrently
      const [md3Module, additionalModule] = await Promise.all([
        import('../../utils/MD3Shapes'),
        import('../../utils/AdditionalShapes')
      ]);
      
      const MD3Shapes = md3Module.default;
      const AdditionalShapes = additionalModule.default;
      
      // Get shape functions from modules
      const md3ShapeFunctions = Object.entries(MD3Shapes)
        .filter(([key]) => key !== 'generateId')
        .map(([key, value]) => ({ id: key, func: value }));
      
      const additionalShapeFunctions = Object.entries(AdditionalShapes)
        .filter(([key]) => key !== 'generateId')
        .map(([key, value]) => ({ id: key, func: value }));
      
      // Try to find matching shape in MD3Shapes
      const md3Shape = md3ShapeFunctions.find(s => 
        s.id.includes(shape) || s.id.toLowerCase().includes(shape.toLowerCase())
      );
      
      // Try to find matching shape in AdditionalShapes
      const additionalShape = additionalShapeFunctions.find(s => 
        s.id.includes(shape) || s.id.toLowerCase().includes(shape.toLowerCase())
      );
      
      // Use the found shape or a default
      const foundShape = md3Shape || additionalShape;
      
      // Get SVG content from the found shape or use default
      const svgContent = foundShape && typeof foundShape.func === 'function' 
        ? foundShape.func(100) 
        : `<svg viewBox="0 0 24 24" width="100%" height="100%">
            <rect x="2" y="2" width="20" height="20" fill="currentColor" />
          </svg>`;
      
      // Create a new shape element with the SVG content
      const newElement: Partial<CanvasElement> = {
        id: `shape-${uuidv4().substring(0, 8)}`,
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
        rotation: 0,
        backgroundColor: color,
        color: color,
        shape: shape,
        opacity: 1,
        zIndex: 1,
        svg: svgContent, // SVG content is now available before element is added
        timelineData: {
          entryPoint: 0,
          exitPoint: undefined, // Changed from null to undefined to match CanvasElement interface
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
    } catch (error) {
      console.error('Error adding shape:', error);
      // Fallback to add a basic shape if imports fail
      const fallbackElement: Partial<CanvasElement> = {
        id: `shape-${uuidv4().substring(0, 8)}`,
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 100, height: 100 },
        rotation: 0,
        backgroundColor: color,
        color: color,
        shape: shape,
        opacity: 1,
        zIndex: 1,
        svg: `<svg viewBox="0 0 24 24" width="100%" height="100%">
          <rect x="2" y="2" width="20" height="20" fill="currentColor" />
        </svg>`,
        timelineData: {
          entryPoint: 0,
          exitPoint: undefined, // Changed from null to undefined to match CanvasElement interface
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
      addElement(fallbackElement);
    }
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
            {shape.shape === 'square' && (
              <div className="w-10 h-10 rounded" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === 'circle' && (
              <div className="w-10 h-10 rounded-full" style={{ backgroundColor: shape.color }} />
            )}
            {shape.shape === 'oval' && (
              <div className="w-12 h-8 rounded-full" style={{ backgroundColor: shape.color }} />
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
            {shape.shape === 'right-triangle' && (
              <div
                className="relative"
                style={{
                  width: '30px',
                  height: '30px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    borderBottom: `30px solid ${shape.color}`,
                    borderRight: '30px solid transparent',
                  }}
                />
              </div>
            )}
            {shape.shape === 'star' && (
              <span className="material-icons text-3xl">star</span>
            )}
            {shape.shape === 'star-4' && (
              <span className="material-icons text-3xl">auto_awesome</span>
            )}
            {shape.shape === 'hexagon' && (
              <span className="material-icons text-3xl">hexagon</span>
            )}
            {shape.shape === 'pentagon' && (
              <span className="material-icons text-3xl">pentagon</span>
            )}
            {shape.shape === 'octagon' && (
              <span className="material-icons text-3xl">stop</span>
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
            {shape.shape === 'parallelogram' && (
              <div
                style={{
                  width: '30px',
                  height: '20px',
                  backgroundColor: shape.color,
                  transform: 'skew(-20deg)',
                }}
              />
            )}
            {shape.shape === 'trapezoid' && (
              <div
                style={{
                  width: '30px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  borderBottom: `20px solid ${shape.color}`,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                }}
              />
            )}
            {shape.shape === 'arrow' && (
              <span className="material-icons text-3xl">arrow_forward</span>
            )}
            {shape.shape === 'arrow-double' && (
              <span className="material-icons text-3xl">compare_arrows</span>
            )}
            {shape.shape === 'heart' && (
              <span className="material-icons text-3xl">favorite</span>
            )}
            {shape.shape === 'cloud' && (
              <span className="material-icons text-3xl">cloud</span>
            )}
            {shape.shape === 'speech-bubble' && (
              <span className="material-icons text-3xl">chat_bubble</span>
            )}
            {shape.shape === 'lightning' && (
              <span className="material-icons text-3xl">bolt</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsPalette;
