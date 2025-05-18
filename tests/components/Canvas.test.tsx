/**
 * Unit tests for React components
 */

// Remove unused React import
import { render, screen } from '@testing-library/react';
import Canvas from '../../src/components/Canvas/Canvas';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

describe('Canvas component', () => {
  test('renders without crashing', () => {
    render(
      <TimelineProvider>
        <CanvasProvider>
          <Canvas />
        </CanvasProvider>
      </TimelineProvider>
    );
    
    // Basic assertion that component renders
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });
});
