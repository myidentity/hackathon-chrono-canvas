/**
 * Component tests for PropertyPanel
 * 
 * This file contains tests for the PropertyPanel component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyPanel from '../../src/components/PropertyPanel/PropertyPanel';
import { CanvasProvider } from '../../src/context/CanvasContext';

// Mock the useCanvas hook
jest.mock('../../src/context/CanvasContext', () => {
  const originalModule = jest.requireActual('../../src/context/CanvasContext');
  
  return {
    ...originalModule,
    useCanvas: () => ({
      selectedElements: ['element-1'],
      getElement: jest.fn().mockImplementation((id) => {
        if (id === 'element-1') {
          return {
            id: 'element-1',
            type: 'text',
            position: { x: 100, y: 100, z: 1 },
            size: { width: 200, height: 100 },
            rotation: 0,
            opacity: 1,
            properties: { 
              text: 'Test Element',
              fontSize: '16px',
              fontWeight: 'normal',
              color: '#000000',
              textAlign: 'left'
            }
          };
        }
        return null;
      }),
      updateElement: jest.fn(),
      deleteElement: jest.fn(),
    }),
  };
});

describe('PropertyPanel', () => {
  test('should render with correct title', () => {
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  test('should display element properties when an element is selected', () => {
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    // Should show position properties
    expect(screen.getByLabelText('X')).toHaveValue('100');
    expect(screen.getByLabelText('Y')).toHaveValue('100');
    
    // Should show size properties
    expect(screen.getByLabelText('Width')).toHaveValue('200');
    expect(screen.getByLabelText('Height')).toHaveValue('100');
    
    // Should show rotation property
    expect(screen.getByLabelText('Rotation')).toHaveValue('0');
    
    // Should show opacity property
    expect(screen.getByLabelText('Opacity')).toHaveValue('100');
  });

  test('should display type-specific properties for text elements', () => {
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    // Should show text properties
    expect(screen.getByLabelText('Text')).toHaveValue('Test Element');
    expect(screen.getByLabelText('Font Size')).toHaveValue('16px');
    expect(screen.getByLabelText('Color')).toHaveValue('#000000');
  });

  test('should update element when properties are changed', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const updateElementMock = useCanvas().updateElement;
    
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    // Change position property
    fireEvent.change(screen.getByLabelText('X'), { target: { value: '150' } });
    fireEvent.blur(screen.getByLabelText('X'));
    
    // updateElement should be called with correct values
    expect(updateElementMock).toHaveBeenCalledWith('element-1', expect.objectContaining({
      position: expect.objectContaining({ x: 150 })
    }));
    
    // Change size property
    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '250' } });
    fireEvent.blur(screen.getByLabelText('Width'));
    
    // updateElement should be called with correct values
    expect(updateElementMock).toHaveBeenCalledWith('element-1', expect.objectContaining({
      size: expect.objectContaining({ width: 250 })
    }));
    
    // Change text property
    fireEvent.change(screen.getByLabelText('Text'), { target: { value: 'Updated Text' } });
    fireEvent.blur(screen.getByLabelText('Text'));
    
    // updateElement should be called with correct values
    expect(updateElementMock).toHaveBeenCalledWith('element-1', expect.objectContaining({
      properties: expect.objectContaining({ text: 'Updated Text' })
    }));
  });

  test('should handle delete button click', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const deleteElementMock = useCanvas().deleteElement;
    
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    // Click delete button
    fireEvent.click(screen.getByText('Delete Element'));
    
    // deleteElement should be called with correct element id
    expect(deleteElementMock).toHaveBeenCalledWith('element-1');
  });

  test('should display empty state when no element is selected', () => {
    // Override the mock to return empty selected elements
    jest.spyOn(require('../../src/context/CanvasContext'), 'useCanvas').mockImplementation(() => ({
      selectedElements: [],
      getElement: jest.fn(),
      updateElement: jest.fn(),
      deleteElement: jest.fn(),
    }));
    
    render(
      <CanvasProvider>
        <PropertyPanel />
      </CanvasProvider>
    );

    expect(screen.getByText('No element selected')).toBeInTheDocument();
    expect(screen.getByText('Select an element to edit its properties')).toBeInTheDocument();
  });
});
