/**
 * Unit tests for React components
 */

// Remove unused React import
import { render, screen } from '@testing-library/react';
import ElementLibrary from '../../src/components/ElementLibrary/ElementLibrary';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

describe('ElementLibrary component', () => {
  test('renders without crashing', () => {
    render(
      <TimelineProvider>
        <CanvasProvider>
          <ElementLibrary />
        </CanvasProvider>
      </TimelineProvider>
    );
    
    // Basic assertion that component renders
    expect(screen.getByTestId('element-library')).toBeInTheDocument();
  });
});
