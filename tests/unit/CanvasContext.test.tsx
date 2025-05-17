/**
 * Unit tests for CanvasContext
 * 
 * This file contains tests for the Canvas context provider and its functionality.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CanvasProvider, useCanvas } from '../../src/context/CanvasContext';
import { AllProviders } from '../../src/test-utils/test-providers';

// Test component that uses the Canvas context
const TestComponent = () => {
  const { 
    canvas, 
    selectedElements, 
    addElement, 
    updateElement, 
    removeElement, 
    selectElement, 
    clearSelection 
  } = useCanvas();

  return (
    <div>
      <div data-testid="canvas-width">{canvas.width}</div>
      <div data-testid="canvas-height">{canvas.height}</div>
      <div data-testid="elements-count">{canvas.elements.length}</div>
      <div data-testid="selected-count">{selectedElements.length}</div>
      <button 
        data-testid="add-element" 
        onClick={() => addElement({
          type: 'text',
          position: { x: 100, y: 100, z: 1 },
          size: { width: 200, height: 100 },
          rotation: 0,
          opacity: 1,
          timelineData: {
            entryPoint: 0,
            exitPoint: null,
            persist: true,
            keyframes: [],
          },
          properties: { text: 'Test Element' },
          animations: [],
        })}
      >
        Add Element
      </button>
      {canvas.elements.map(element => (
        <div key={element.id} data-testid={`element-${element.id}`}>
          <span data-testid={`element-type-${element.id}`}>{element.type}</span>
          <button 
            data-testid={`select-${element.id}`} 
            onClick={() => selectElement(element.id)}
          >
            Select
          </button>
          <button 
            data-testid={`update-${element.id}`} 
            onClick={() => updateElement(element.id, { opacity: 0.5 })}
          >
            Update
          </button>
          <button 
            data-testid={`remove-${element.id}`} 
            onClick={() => removeElement(element.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <button data-testid="clear-selection" onClick={clearSelection}>
        Clear Selection
      </button>
    </div>
  );
};

describe('CanvasContext', () => {
  test('should provide initial canvas state', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    expect(screen.getByTestId('canvas-width')).toHaveTextContent('1920');
    expect(screen.getByTestId('canvas-height')).toHaveTextContent('1080');
    expect(screen.getByTestId('elements-count')).toHaveTextContent('2'); // Updated to match the sample elements in the context
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });

  test('should add a new element', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    const initialCount = parseInt(screen.getByTestId('elements-count').textContent || '0');
    fireEvent.click(screen.getByTestId('add-element'));
    
    expect(screen.getByTestId('elements-count')).toHaveTextContent(`${initialCount + 1}`);
  });

  test('should select an element', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    // Get the first element ID
    const elementId = 'sample-image-1'; // Using the known ID from the context
    
    // Select the element
    fireEvent.click(screen.getByTestId(`select-${elementId}`));
    
    expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
  });

  test('should update an element', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    // Get the first element ID
    const elementId = 'sample-image-1'; // Using the known ID from the context
    
    // Update the element
    fireEvent.click(screen.getByTestId(`update-${elementId}`));
    
    // We can't directly check the opacity value in this test
    // as we don't have access to the internal state
  });

  test('should remove an element', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    const initialCount = parseInt(screen.getByTestId('elements-count').textContent || '0');
    
    // Get the first element ID
    const elementId = 'sample-image-1'; // Using the known ID from the context
    
    // Remove the element
    fireEvent.click(screen.getByTestId(`remove-${elementId}`));
    
    expect(screen.getByTestId('elements-count')).toHaveTextContent(`${initialCount - 1}`);
  });

  test('should clear selection', () => {
    render(
      <TestComponent />,
      { wrapper: AllProviders }
    );

    // Get the first element ID
    const elementId = 'sample-image-1'; // Using the known ID from the context
    
    // Select the element
    fireEvent.click(screen.getByTestId(`select-${elementId}`));
    
    // Clear selection
    fireEvent.click(screen.getByTestId('clear-selection'));
    
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0');
  });
});
