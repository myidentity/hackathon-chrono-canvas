import React, { useState, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import MD3Shapes from '../../utils/MD3Shapes';
import AdditionalShapes from '../../utils/AdditionalShapes';
import './ShapePanel.css';

interface Shape {
  id: string;
  type: string;
  name: string;
  svg: string;
  [key: string]: any;
}

interface ShapePanelProps {
  onSelectShape: (shape: Shape) => void;
  searchQuery?: string;
}

/**
 * ShapePanel component
 * Displays a grid of shapes that can be added to the canvas
 * 
 * @param {ShapePanelProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ShapePanel: React.FC<ShapePanelProps> = ({ onSelectShape, searchQuery = '' }) => {
  // Remove the shapes property which doesn't exist in CanvasContextValue
  const { } = useCanvas();
  const [selectedCategory, setSelectedCategory] = useState<string>('md3');
  const [allShapes, setAllShapes] = useState<Record<string, Shape[]>>({
    original: [], // Initialize as empty array since shapes doesn't exist in context
    md3: Object.entries(MD3Shapes).filter(([key]) => key !== 'generateId').map(([key, value]) => ({
      id: MD3Shapes.generateId(),
      type: 'shape',
      name: key,
      svg: typeof value === 'function' ? value(100) : '',
    })),
    travel: Object.entries(AdditionalShapes).filter(([key]) => key !== 'generateId').map(([key, value]) => ({
      id: AdditionalShapes.generateId(),
      type: 'shape',
      name: key,
      svg: typeof value === 'function' ? value(100) : '',
    }))
  });
  
  // Remove dependency on shapes since it doesn't exist
  useEffect(() => {
    // Initialize with empty array for original shapes
    setAllShapes(prev => ({
      ...prev,
      original: []
    }));
  }, []);
  
  // Filter shapes based on search query
  const filteredShapes = searchQuery 
    ? allShapes[selectedCategory]?.filter(shape => 
        shape.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allShapes[selectedCategory];
  
  /**
   * Handle shape selection
   * 
   * @param {Shape} shape - The selected shape
   */
  const handleShapeClick = (shape: Shape): void => {
    onSelectShape(shape);
  };
  
  return (
    <div className="shape-panel">
      <div className="shape-categories">
        <button 
          className={selectedCategory === 'md3' ? 'active' : ''} 
          onClick={() => setSelectedCategory('md3')}
        >
          Material Design
        </button>
        <button 
          className={selectedCategory === 'travel' ? 'active' : ''} 
          onClick={() => setSelectedCategory('travel')}
        >
          Travel Themed
        </button>
        <button 
          className={selectedCategory === 'original' ? 'active' : ''} 
          onClick={() => setSelectedCategory('original')}
        >
          Original
        </button>
      </div>
      
      <div className="shape-grid">
        {filteredShapes?.map((shape: Shape) => (
          <div 
            key={shape.id} 
            className="shape-item"
            onClick={() => handleShapeClick(shape)}
          >
            <div 
              className="shape-preview" 
              dangerouslySetInnerHTML={{ 
                __html: shape.svg.replace('currentColor', '#333333') 
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShapePanel;
