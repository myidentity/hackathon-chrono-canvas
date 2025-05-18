/**
 * Unit tests for React components
 */

// Remove unused React import
import { render, screen } from '@testing-library/react';
import ZineView from '../../src/components/ZineView/ZineView';
import { CanvasProvider } from '../../src/context/CanvasContext';
import { TimelineProvider } from '../../src/context/TimelineContext';

describe('ZineView component', () => {
  test('renders without crashing', () => {
    render(
      <TimelineProvider>
        <CanvasProvider>
          <ZineView />
        </CanvasProvider>
      </TimelineProvider>
    );
    
    // Basic assertion that component renders
    expect(screen.getByTestId('zine-view')).toBeInTheDocument();
  });
});
