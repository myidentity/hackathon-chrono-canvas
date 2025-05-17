/**
 * Component tests for Canvas
 * 
 * This file contains tests for the Canvas component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '../../src/components/Canvas/Canvas';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

// Mock the useCanvas hook
jest.mock('../../src/context/CanvasContext', () => {
  const originalModule = jest.requireActual('../../src/context/CanvasContext');
  
  return {
    ...originalModule,
    useCanvas: () => ({
      canvas: {
        width: 1920,
        height: 1080,
        background: { type: 'color', value: '#ffffff' },
        elements: [
          {
            id: 'test-element-1',
            type: 'text',
            position: { x: 100, y: 100, z: 1 },
            size: { width: 200, height: 100 },
            rotation: 0,
            opacity: 1,
            properties: { text: 'Test Element 1' },
          },
          {
            id: 'test-element-2',
            type: 'image',
            position: { x: 400, y: 200, z: 2 },
            size: { width: 300, height: 200 },
            rotation: 45,
            opacity: 0.8,
            properties: { src: 'test-image.jpg', alt: 'Test Image' },
          },
        ],
      },
      selectedElements: ['test-element-1'],
      selectElement: jest.fn(),
      clearSelection: jest.fn(),
      moveElement: jest.fn(),
      resizeElement: jest.fn(),
      rotateElement: jest.fn(),
    }),
  };
});

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      currentPosition: 0,
      duration: 60,
    }),
  };
});

describe('Canvas', () => {
  test('should render canvas with correct dimensions', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    const canvas = screen.getByTestId('canvas-container');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle('width: 1920px');
    expect(canvas).toHaveStyle('height: 1080px');
  });

  test('should render canvas elements', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    expect(screen.getByText('Test Element 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
  });

  test('should highlight selected elements', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    const selectedElement = screen.getByText('Test Element 1').closest('[data-element-id="test-element-1"]');
    expect(selectedElement).toHaveClass('selected');
  });

  test('should call selectElement when clicking on an element', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const selectElementMock = useCanvas().selectElement;
    
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    fireEvent.click(screen.getByText('Test Element 1'));
    expect(selectElementMock).toHaveBeenCalledWith('test-element-1', expect.anything());
  });

  test('should call clearSelection when clicking on canvas background', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const clearSelectionMock = useCanvas().clearSelection;
    
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    fireEvent.click(screen.getByTestId('canvas-container'));
    expect(clearSelectionMock).toHaveBeenCalled();
  });

  test('should handle element dragging', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const moveElementMock = useCanvas().moveElement;
    
    render(
      <CanvasProvider>
        <TimelineProvider>
          <Canvas />
        </TimelineProvider>
      </CanvasProvider>
    );

    const element = screen.getByText('Test Element 1');
    
    // Start drag
    fireEvent.mouseDown(element);
    
    // Move
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    
    // End drag
    fireEvent.mouseUp(document);
    
    expect(moveElementMock).toHaveBeenCalled();
  });
});
