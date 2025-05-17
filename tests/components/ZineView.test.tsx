/**
 * Component tests for ZineView
 * 
 * This file contains tests for the ZineView component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ZineView from '../../src/components/ZineView/ZineView';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

// Mock the useCanvas hook
jest.mock('../../src/context/CanvasContext', () => {
  const originalModule = jest.requireActual('../../src/context/CanvasContext');
  
  return {
    ...originalModule,
    useCanvas: () => ({
      canvas: {
        elements: [
          {
            id: 'test-element-1',
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 100 },
            content: 'Test Element 1',
            timelineData: {
              entryPoint: 0,
              exitPoint: 30,
              persist: true,
              keyframes: [
                {
                  time: 0,
                  properties: {
                    opacity: 0,
                    position: { x: 100, y: 100 }
                  }
                },
                {
                  time: 15,
                  properties: {
                    opacity: 1,
                    position: { x: 150, y: 150 }
                  }
                }
              ]
            }
          },
          {
            id: 'test-element-2',
            type: 'image',
            position: { x: 300, y: 200 },
            size: { width: 300, height: 200 },
            src: 'test-image.jpg',
            alt: 'Test Image',
            timelineData: {
              entryPoint: 10,
              exitPoint: 40,
              persist: false
            }
          },
          {
            id: 'test-element-3',
            type: 'shape',
            position: { x: 500, y: 300 },
            size: { width: 100, height: 100 },
            backgroundColor: '#FF0000',
            shape: 'circle',
            zIndex: 5,
            timelineData: {
              entryPoint: 5,
              exitPoint: 20,
              persist: false
            }
          }
        ]
      }
    }),
  };
});

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      currentPosition: 5,
      setPosition: jest.fn(),
    }),
  };
});

describe('ZineView', () => {
  test('should render the zine view container', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    expect(screen.getByTestId('zine-view-container')).toBeInTheDocument();
    expect(screen.getByTestId('zine-view-content')).toBeInTheDocument();
  });

  test('should render visible elements based on timeline position', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    // At timeline position 5, elements 1 and 3 should be visible
    // Element 2 should not be visible yet (entry point is 10)
    expect(screen.getByText('Test Element 1')).toBeInTheDocument();
    expect(screen.getByTestId('zine-element-test-element-3')).toBeInTheDocument();
    
    // Element 2 should not be in the document
    const element2 = screen.queryByAltText('Test Image');
    expect(element2).not.toBeInTheDocument();
  });

  test('should render different element types correctly', () => {
    // Override the mock to set timeline position to 15 where all elements are visible
    jest.spyOn(require('../../src/context/TimelineContext'), 'useTimeline').mockImplementation(() => ({
      currentPosition: 15,
      setPosition: jest.fn(),
    }));

    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    // Text element
    expect(screen.getByText('Test Element 1')).toBeInTheDocument();
    
    // Image element
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    
    // Shape element (circle)
    const shapeElement = screen.getByTestId('zine-element-test-element-3');
    expect(shapeElement).toBeInTheDocument();
    
    // Check if the shape has the correct background color
    const shapeDiv = shapeElement.firstChild;
    expect(shapeDiv).toHaveStyle('background-color: #FF0000');
    expect(shapeDiv).toHaveStyle('border-radius: 50%');
  });

  test('should handle scroll events', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const setPositionMock = useTimeline().setPosition;

    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    const container = screen.getByTestId('zine-view-container');
    
    // Simulate scroll event
    fireEvent.scroll(container, { target: { scrollTop: 300 } });
    
    // setPosition should be called
    expect(setPositionMock).toHaveBeenCalled();
  });

  test('should apply parallax effect based on z-index', () => {
    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    // Element 3 has z-index of 5, which should affect its transform
    const element3 = screen.getByTestId('zine-element-test-element-3');
    expect(element3.style.transform).toContain('translateY');
  });

  test('should handle unknown element types', () => {
    // Override the mock to include an unknown element type
    jest.spyOn(require('../../src/context/CanvasContext'), 'useCanvas').mockImplementation(() => ({
      canvas: {
        elements: [
          {
            id: 'unknown-element',
            type: 'unknown',
            position: { x: 100, y: 100 },
            size: { width: 200, height: 100 },
            timelineData: {
              entryPoint: 0,
              exitPoint: null,
              persist: true
            }
          }
        ]
      }
    }));

    render(
      <CanvasProvider>
        <TimelineProvider>
          <ZineView />
        </TimelineProvider>
      </CanvasProvider>
    );

    expect(screen.getByText('Unknown Element')).toBeInTheDocument();
  });
});
