import React, { useState, useEffect } from 'react';
import { useCanvasContext } from '../../context/CanvasContext';
import MD3Shapes from '../../utils/MD3Shapes';
import AdditionalShapes from '../../utils/AdditionalShapes';
import './ShapePanel.css';

interface ShapePanelProps {
  onSelectShape: (shape: any) => void;
}

const ShapePanel: React.FC<ShapePanelProps> = ({ onSelectShape }) => {
  const { shapes } = useCanvasContext();
  const [selectedCategory, setSelectedCategory] = useState('md3');
  const [allShapes, setAllShapes] = useState<Record<string, any[]>>({
    original: shapes || [],
    md3: MD3Shapes,
    travel: AdditionalShapes
  });
  
  useEffect(() => {
    // Update original shapes when context shapes change
    setAllShapes(prev => ({
      ...prev,
      original: shapes || []
    }));
  }, [shapes]);
  
  const handleShapeClick = (shape: any) => {
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
        {allShapes[selectedCategory]?.map((shape: any) => (
          <div 
            key={shape.id} 
            className="shape-item"
            onClick={() => handleShapeClick(shape)}
          >
            <div 
              className="shape-preview" 
              dangerouslySetInnerHTML={{ 
                __html: shape.svg.replace('currentColor', '#333') 
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShapePanel;
