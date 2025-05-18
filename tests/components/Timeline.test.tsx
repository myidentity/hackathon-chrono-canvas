/**
 * Unit tests for React components
 */

// Remove unused React import
import { render, screen } from '@testing-library/react';
import Timeline from '../../src/components/Timeline/Timeline';
import { TimelineProvider } from '../../src/context/TimelineContext';

describe('Timeline component', () => {
  test('renders without crashing', () => {
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );
    
    // Basic assertion that component renders
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});
