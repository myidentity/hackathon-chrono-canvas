/**
 * Unit tests for React components
 */

// Remove unused React import
import { render, screen } from '@testing-library/react';
import PropertyPanel from '../../src/components/PropertyPanel/PropertyPanel';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

describe('PropertyPanel component', () => {
  test('renders without crashing', () => {
    render(
      <TimelineProvider>
        <CanvasProvider>
          <PropertyPanel />
        </CanvasProvider>
      </TimelineProvider>
    );
    
    // Basic assertion that component renders
    expect(screen.getByTestId('property-panel')).toBeInTheDocument();
  });
});
