/**
 * Component tests for EnhancedTimeline
 * 
 * This file contains tests for the EnhancedTimeline component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedTimeline from '../../src/components/Timeline/EnhancedTimeline';
import { TimelineProvider } from '../../src/context/TimelineContext';

// Mock the useTimeline hook
jest.mock('../../src/context/TimelineContext', () => {
  const originalModule = jest.requireActual('../../src/context/TimelineContext');
  
  return {
    ...originalModule,
    useTimeline: () => ({
      duration: 60,
      currentPosition: 10,
      markers: [
        { id: 'marker-1', name: 'Intro', position: 5, color: '#ff0000' },
        { id: 'marker-2', name: 'Middle', position: 30, color: '#00ff00' },
      ],
      isPlaying: false,
      playbackSpeed: 1,
      setCurrentPosition: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      setPlaybackSpeed: jest.fn(),
      seekToMarker: jest.fn(),
      addMarker: jest.fn(),
      removeMarker: jest.fn(),
    }),
  };
});

describe('EnhancedTimeline', () => {
  test('should render timeline with correct duration', () => {
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Should show current time and total duration
    expect(screen.getByText('10:00 / 60:00')).toBeInTheDocument();
  });

  test('should render timeline markers', () => {
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Should show marker names
    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
  });

  test('should handle play/pause button click', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const playMock = useTimeline().play;
    
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Click play button
    fireEvent.click(screen.getByLabelText('Play'));
    
    // Play function should be called
    expect(playMock).toHaveBeenCalled();
  });

  test('should handle speed change', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const setPlaybackSpeedMock = useTimeline().setPlaybackSpeed;
    
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Click 2x speed button
    fireEvent.click(screen.getByText('2x'));
    
    // setPlaybackSpeed function should be called with 2
    expect(setPlaybackSpeedMock).toHaveBeenCalledWith(2);
  });

  test('should handle zoom controls', () => {
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Initial zoom should be 1x
    expect(screen.getByText('1x')).toBeInTheDocument();
    
    // Click zoom in button
    fireEvent.click(screen.getAllByText('+')[0]);
    
    // Zoom should increase to 2x
    expect(screen.getByText('2x')).toBeInTheDocument();
  });

  test('should handle marker creation', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const addMarkerMock = useTimeline().addMarker;
    
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Click add marker button
    fireEvent.click(screen.getByText('Add Marker'));
    
    // Marker creation form should appear
    expect(screen.getByPlaceholderText('Marker name')).toBeInTheDocument();
    
    // Fill in marker name
    fireEvent.change(screen.getByPlaceholderText('Marker name'), {
      target: { value: 'New Marker' },
    });
    
    // Click save marker button
    fireEvent.click(screen.getByText('Save Marker'));
    
    // addMarker function should be called with correct parameters
    expect(addMarkerMock).toHaveBeenCalled();
  });

  test('should handle marker deletion', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const removeMarkerMock = useTimeline().removeMarker;
    
    render(
      <TimelineProvider>
        <EnhancedTimeline />
      </TimelineProvider>
    );

    // Hover over marker to show delete button
    // Use non-null assertion to handle potential null value
    const markerElement = screen.getByText('Intro').parentElement!;
    fireEvent.mouseEnter(markerElement);
    
    // Click delete button (may need to adjust selector based on actual implementation)
    const deleteButtons = document.querySelectorAll('button[title="Delete Marker"]');
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }
    
    // removeMarker function should be called with marker ID
    expect(removeMarkerMock).toHaveBeenCalledWith('marker-1');
  });
});
