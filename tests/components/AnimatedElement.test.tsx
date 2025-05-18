/**
 * Component tests for AnimatedElement
 * 
 * This file contains tests for the AnimatedElement component.
 */

import { render, screen } from '@testing-library/react';
import AnimatedElement from '../../src/components/Animation/AnimatedElement';
import { TimelineProvider } from '../../src/context/TimelineContext';

// Define element type for testing
interface TestElement {
  id: string;
  type: string;
  position: { x: number; y: number; z?: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  properties?: Record<string, any>;
  timelineData?: {
    entryPoint?: number;
    exitPoint?: number | null;
    persist?: boolean;
    keyframes?: Array<{
      time: number;
      properties: {
        opacity?: number;
        position?: { x: number; y: number };
        rotation?: number;
        [key: string]: any;
      };
    }>;
  };
}

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      currentPosition: 5,
    }),
  };
});

describe('AnimatedElement', () => {
  const defaultElement: TestElement = {
    id: 'test-element',
    type: 'text',
    position: { x: 100, y: 100, z: 1 },
    size: { width: 200, height: 100 },
    rotation: 0,
    opacity: 1,
    properties: { text: 'Test Element' },
    timelineData: {
      entryPoint: 0,
      exitPoint: 10,
      persist: false,
      keyframes: [
        {
          time: 0,
          properties: {
            opacity: 0,
            position: { x: 100, y: 100 },
            rotation: 0
          }
        },
        {
          time: 5,
          properties: {
            opacity: 1,
            position: { x: 150, y: 150 },
            rotation: 45
          }
        },
        {
          time: 10,
          properties: {
            opacity: 0,
            position: { x: 200, y: 200 },
            rotation: 90
          }
        }
      ]
    }
  };

  test('should render element with correct content', () => {
    render(
      <TimelineProvider>
        <AnimatedElement element={defaultElement as any}>
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    expect(screen.getByText('Element Content')).toBeInTheDocument();
  });

  test('should apply correct styles based on timeline position', () => {
    render(
      <TimelineProvider>
        <AnimatedElement element={defaultElement as any} data-testid="animated-element">
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    const element = screen.getByTestId('animated-element');
    
    // At timeline position 5, element should have interpolated styles from keyframes
    expect(element).toHaveStyle('opacity: 1');
    expect(element).toHaveStyle('transform: translate(150px, 150px) rotate(45deg)');
  });

  test('should not render element before entry point', () => {
    // Override the mock to set timeline position before entry point
    jest.spyOn(require('../../src/context/TimelineContext'), 'useTimeline').mockImplementation(() => ({
      currentPosition: -1,
    }));
    
    const { container } = render(
      <TimelineProvider>
        <AnimatedElement element={defaultElement as any}>
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    // Element should not be rendered
    expect(container.firstChild).toBeNull();
  });

  test('should not render element after exit point if not persistent', () => {
    // Override the mock to set timeline position after exit point
    jest.spyOn(require('../../src/context/TimelineContext'), 'useTimeline').mockImplementation(() => ({
      currentPosition: 15,
    }));
    
    const { container } = render(
      <TimelineProvider>
        <AnimatedElement element={defaultElement as any}>
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    // Element should not be rendered
    expect(container.firstChild).toBeNull();
  });

  test('should render element after exit point if persistent', () => {
    // Create persistent element
    const persistentElement = {
      ...defaultElement,
      timelineData: {
        ...defaultElement.timelineData,
        persist: true
      }
    };
    
    // Override the mock to set timeline position after exit point
    jest.spyOn(require('../../src/context/TimelineContext'), 'useTimeline').mockImplementation(() => ({
      currentPosition: 15,
    }));
    
    render(
      <TimelineProvider>
        <AnimatedElement element={persistentElement as any}>
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    // Element should be rendered
    expect(screen.getByText('Element Content')).toBeInTheDocument();
  });

  test('should handle element without keyframes', () => {
    // Create element without keyframes
    const elementWithoutKeyframes = {
      ...defaultElement,
      timelineData: {
        entryPoint: 0,
        exitPoint: 10,
        persist: false,
        keyframes: []
      }
    };
    
    render(
      <TimelineProvider>
        <AnimatedElement element={elementWithoutKeyframes as any} data-testid="animated-element">
          <div>Element Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    const element = screen.getByTestId('animated-element');
    
    // Should use base element properties
    expect(element).toHaveStyle('opacity: 1');
    expect(element).toHaveStyle('transform: translate(100px, 100px) rotate(0deg)');
  });
});
