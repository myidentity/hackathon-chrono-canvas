import React, { useEffect, useState } from 'react';
import { useCanvasContext } from '../../context/CanvasContext';

interface ShapeTestingProps {
  onTestComplete: (results: any) => void;
}

const ShapeTesting: React.FC<ShapeTestingProps> = ({ onTestComplete }) => {
  const { shapes } = useCanvasContext();
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testShapes = async () => {
      setIsLoading(true);
      const results: Record<string, { rendered: boolean, isSquare: boolean }> = {};
      
      // Test each shape for rendering issues
      if (shapes && shapes.length > 0) {
        shapes.forEach(shape => {
          // Create a temporary div to render the shape
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          tempDiv.style.top = '-9999px';
          document.body.appendChild(tempDiv);
          
          // Render the shape
          const shapeElement = document.createElement('div');
          shapeElement.innerHTML = shape.svg;
          tempDiv.appendChild(shapeElement);
          
          // Check if the shape is rendered
          const rendered = shapeElement.innerHTML !== '';
          
          // Check if the shape is a square (basic heuristic)
          const svgElement = shapeElement.querySelector('svg');
          let isSquare = false;
          
          if (svgElement) {
            const rect = svgElement.getBoundingClientRect();
            // If width and height are very similar and there's only one path/rect element, it might be a square
            const paths = svgElement.querySelectorAll('path, rect');
            if (paths.length === 1 && Math.abs(rect.width - rect.height) < 5) {
              isSquare = true;
            }
          }
          
          results[shape.id] = { rendered, isSquare };
          
          // Clean up
          document.body.removeChild(tempDiv);
        });
      }
      
      setTestResults(results);
      setIsLoading(false);
      onTestComplete(results);
    };
    
    testShapes();
  }, [shapes, onTestComplete]);

  if (isLoading) {
    return <div>Testing shapes...</div>;
  }

  return (
    <div className="shape-testing-results">
      <h3>Shape Testing Results</h3>
      <table>
        <thead>
          <tr>
            <th>Shape ID</th>
            <th>Rendered</th>
            <th>Is Square</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(testResults).map(([id, result]: [string, any]) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{result.rendered ? '✅' : '❌'}</td>
              <td>{result.isSquare ? '⚠️' : '✅'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShapeTesting;
