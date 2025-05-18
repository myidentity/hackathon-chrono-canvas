import React, { useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import MD3Shapes from '../../utils/MD3Shapes';
import AdditionalShapes from '../../utils/AdditionalShapes';

const ShapeTesting: React.FC = () => {
  const { shapes } = useCanvas();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Test all shapes from different sources
    const allShapes = {
      ...MD3Shapes,
      ...AdditionalShapes,
      ...(shapes || {})
    };
    
    const results: Record<string, boolean> = {};
    
    // Test each shape for proper rendering
    Object.entries(allShapes).forEach(([id, shape]) => {
      // A shape is considered valid if it has an SVG property
      // and the SVG doesn't contain just a rectangle/square
      const isValid = 
        shape.svg && 
        !shape.svg.includes('rect width="100%" height="100%"') &&
        !shape.svg.includes('rect x="0" y="0" width="100" height="100"');
      
      results[id] = isValid;
    });
    
    setTestResults(results);
  }, [shapes]);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Shape Testing Results</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
        {Object.entries(testResults).map(([id, isValid]) => (
          <div 
            key={id}
            style={{ 
              border: `2px solid ${isValid ? 'green' : 'red'}`,
              borderRadius: '4px',
              padding: '10px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '12px', marginBottom: '5px' }}>{id}</div>
            <div style={{ color: isValid ? 'green' : 'red' }}>
              {isValid ? 'Valid' : 'Invalid'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShapeTesting;
