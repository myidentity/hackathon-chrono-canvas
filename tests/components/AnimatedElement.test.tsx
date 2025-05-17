/**
 * Component tests for AnimatedElement
 * 
 * This file contains tests for the AnimatedElement component.
 */

import { render, screen } from '@testing-library/react';
import AnimatedElement from '../../src/components/Animation/AnimatedElement';
import { TimelineProvider } from '../../src/context/TimelineContext';

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      currentPosition: 5,
      duration: 60,
    }),
  };
});

describe('AnimatedElement', () => {
  test('should render children when visible', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={0}
          exitPoint={null}
          persist={true}
          viewMode="timeline"
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toHaveTextContent('Test Content');
  });

  test('should not render children when not visible', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={10} // Entry point is after current position (5)
          exitPoint={null}
          persist={true}
          viewMode="timeline"
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  test('should always render in editor mode regardless of timeline position', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={10} // Entry point is after current position (5)
          exitPoint={null}
          persist={true}
          viewMode="editor"
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  test('should apply animation styles based on animation type', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={4.5} // Just before current position (5) to trigger animation
          exitPoint={null}
          persist={true}
          entryAnimation="fade"
          entryDuration={1}
          viewMode="timeline"
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    const element = screen.getByTestId('child-content').parentElement;
    expect(element).toHaveStyle('opacity: 0.5'); // Halfway through fade animation
  });

  test('should handle exit animations', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={0}
          exitPoint={5.5} // Just after current position (5) to trigger exit animation
          exitDuration={1}
          persist={false}
          exitAnimation="fade"
          viewMode="timeline"
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    const element = screen.getByTestId('child-content').parentElement;
    expect(element).toHaveStyle('opacity: 0.5'); // Halfway through fade exit animation
  });

  test('should apply parallax effect in zine mode', () => {
    render(
      <TimelineProvider>
        <AnimatedElement
          id="test-element"
          entryPoint={0}
          exitPoint={null}
          persist={true}
          viewMode="zine"
          scrollPosition={100}
          parallaxFactor={0.5}
        >
          <div data-testid="child-content">Test Content</div>
        </AnimatedElement>
      </TimelineProvider>
    );

    const element = screen.getByTestId('child-content').parentElement;
    expect(element.style.transform).toContain('translateY');
  });
});
