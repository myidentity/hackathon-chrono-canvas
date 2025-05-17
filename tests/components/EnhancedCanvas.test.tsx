/**
 * Component tests for EnhancedCanvas
 * 
 * This file contains tests for the EnhancedCanvas component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedCanvas from '../../src/components/Canvas/EnhancedCanvas';
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
            timelineData: {
              entryPoint: 0,
              exitPoint: null,
              persist: true,
              keyframes: [],
            },
            properties: { text: 'Test Element 1' },
            animations: [],
          },
          {
            id: 'test-element-2',
            type: 'image',
            position: { x: 400, y: 200, z: 2 },
            size: { width: 300, height: 200 },
            rotation: 45,
            opacity: 0.8,
            timelineData: {
              entryPoint: 5,
              exitPoint: 10,
              persist: false,
              keyframes: [],
            },
            properties: { src: 'test-image.jpg', alt: 'Test Image' },
            animations: [],
          },
        ],
      },
      selectedElements: ['test-element-1'],
      selectElement: jest.fn(),
      clearSelection: jest.fn(),
    }),
  };
});

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      currentPosition: 2,
      duration: 60,
    }),
  };
});

describe('EnhancedCanvas', () => {
  test('should render canvas with correct dimensions', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="editor" />
        </TimelineProvider>
      </CanvasProvider>
    );

    const canvas = screen.getByText('Editor Mode').parentElement;
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle('width: 100%');
    expect(canvas).toHaveStyle('height: 100%');
  });

  test('should render visible elements', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="editor" />
        </TimelineProvider>
      </CanvasProvider>
    );

    // In editor mode, all elements should be visible
    expect(screen.getByText('Test Element 1')).toBeInTheDocument();
  });

  test('should highlight selected elements', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="editor" />
        </TimelineProvider>
      </CanvasProvider>
    );

    // Selected element should have selection indicators
    const selectedElement = screen.getByText('Test Element 1').closest('[data-element-id="test-element-1"]');
    expect(selectedElement).toHaveClass('ring-2');
  });

  test('should show grid in editor mode', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="editor" />
        </TimelineProvider>
      </CanvasProvider>
    );

    // Grid should be visible in editor mode
    const gridButton = screen.getByTitle('Hide Grid');
    expect(gridButton).toBeInTheDocument();
    
    // Toggle grid visibility
    fireEvent.click(gridButton);
    
    // Grid should now be hidden
    expect(screen.getByTitle('Show Grid')).toBeInTheDocument();
  });

  test('should display correct view mode indicator', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="timeline" />
        </TimelineProvider>
      </CanvasProvider>
    );

    expect(screen.getByText('Timeline Mode')).toBeInTheDocument();
  });

  test('should handle zoom controls', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <EnhancedCanvas viewMode="editor" />
        </TimelineProvider>
      </CanvasProvider>
    );

    // Initial zoom should be 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Click zoom in button
    fireEvent.click(screen.getByTitle('Zoom In'));
    
    // Zoom should increase
    expect(screen.getByText('120%')).toBeInTheDocument();
    
    // Click zoom out button
    fireEvent.click(screen.getByTitle('Zoom Out'));
    
    // Zoom should decrease back to 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
