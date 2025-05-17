/**
 * Unit tests for TimelineContext
 * 
 * This file contains tests for the Timeline context provider and its functionality.
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { TimelineProvider, useTimeline } from '../../src/context/TimelineContext';

// Mock timer functions
jest.useFakeTimers();

// Test component that uses the Timeline context
const TestComponent = () => {
  const { 
    duration,
    currentPosition,
    isPlaying,
    playbackSpeed,
    markers,
    setDuration,
    setCurrentPosition,
    play,
    pause,
    setPlaybackSpeed,
    addMarker,
    removeMarker,
    seekToMarker
  } = useTimeline();

  return (
    <div>
      <div data-testid="duration">{duration}</div>
      <div data-testid="current-position">{currentPosition}</div>
      <div data-testid="is-playing">{isPlaying ? 'playing' : 'paused'}</div>
      <div data-testid="playback-speed">{playbackSpeed}</div>
      <div data-testid="markers-count">{markers.length}</div>
      
      <button 
        data-testid="set-duration" 
        onClick={() => setDuration(120)}
      >
        Set Duration
      </button>
      
      <button 
        data-testid="set-position" 
        onClick={() => setCurrentPosition(30)}
      >
        Set Position
      </button>
      
      <button 
        data-testid="play-button" 
        onClick={play}
      >
        Play
      </button>
      
      <button 
        data-testid="pause-button" 
        onClick={pause}
      >
        Pause
      </button>
      
      <button 
        data-testid="set-speed" 
        onClick={() => setPlaybackSpeed(2)}
      >
        Set Speed
      </button>
      
      <button 
        data-testid="add-marker" 
        onClick={() => addMarker('Test Marker', 15, '#ff0000')}
      >
        Add Marker
      </button>
      
      {markers.map(marker => (
        <div key={marker.id} data-testid={`marker-${marker.id}`}>
          <span data-testid={`marker-name-${marker.id}`}>{marker.name}</span>
          <span data-testid={`marker-position-${marker.id}`}>{marker.position}</span>
          <button 
            data-testid={`seek-to-${marker.id}`} 
            onClick={() => seekToMarker(marker.id)}
          >
            Seek
          </button>
          <button 
            data-testid={`remove-${marker.id}`} 
            onClick={() => removeMarker(marker.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

describe('TimelineContext', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test('should provide initial timeline state', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    expect(screen.getByTestId('duration')).toHaveTextContent('60');
    expect(screen.getByTestId('current-position')).toHaveTextContent('0');
    expect(screen.getByTestId('is-playing')).toHaveTextContent('paused');
    expect(screen.getByTestId('playback-speed')).toHaveTextContent('1');
    expect(screen.getByTestId('markers-count')).toHaveTextContent('0');
  });

  test('should set duration', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    fireEvent.click(screen.getByTestId('set-duration'));
    
    expect(screen.getByTestId('duration')).toHaveTextContent('120');
  });

  test('should set current position', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    fireEvent.click(screen.getByTestId('set-position'));
    
    expect(screen.getByTestId('current-position')).toHaveTextContent('30');
  });

  test('should play and advance timeline', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    fireEvent.click(screen.getByTestId('play-button'));
    
    expect(screen.getByTestId('is-playing')).toHaveTextContent('playing');
    
    // Advance timers by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Current position should have advanced by 1 second
    expect(parseFloat(screen.getByTestId('current-position').textContent)).toBeGreaterThan(0);
  });

  test('should pause timeline', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    // First play
    fireEvent.click(screen.getByTestId('play-button'));
    
    // Then pause
    fireEvent.click(screen.getByTestId('pause-button'));
    
    expect(screen.getByTestId('is-playing')).toHaveTextContent('paused');
    
    // Get current position
    const position = parseFloat(screen.getByTestId('current-position').textContent);
    
    // Advance timers
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Position should not have changed
    expect(parseFloat(screen.getByTestId('current-position').textContent)).toBe(position);
  });

  test('should set playback speed', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    fireEvent.click(screen.getByTestId('set-speed'));
    
    expect(screen.getByTestId('playback-speed')).toHaveTextContent('2');
    
    // Play with double speed
    fireEvent.click(screen.getByTestId('play-button'));
    
    // Advance timers by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Current position should have advanced by 2 seconds (due to 2x speed)
    expect(parseFloat(screen.getByTestId('current-position').textContent)).toBeGreaterThanOrEqual(1.9);
  });

  test('should add a marker', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    fireEvent.click(screen.getByTestId('add-marker'));
    
    expect(screen.getByTestId('markers-count')).toHaveTextContent('1');
    
    // Get the marker ID
    const markerId = screen.getByTestId('markers-count').textContent === '1' 
      ? markers[0].id 
      : '';
    
    expect(screen.getByTestId(`marker-name-${markerId}`)).toHaveTextContent('Test Marker');
    expect(screen.getByTestId(`marker-position-${markerId}`)).toHaveTextContent('15');
  });

  test('should seek to a marker', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    // Add a marker first
    fireEvent.click(screen.getByTestId('add-marker'));
    
    // Get the marker ID
    const markerId = screen.getByTestId('markers-count').textContent === '1' 
      ? markers[0].id 
      : '';
    
    // Seek to the marker
    fireEvent.click(screen.getByTestId(`seek-to-${markerId}`));
    
    expect(screen.getByTestId('current-position')).toHaveTextContent('15');
  });

  test('should remove a marker', () => {
    render(
      <TimelineProvider>
        <TestComponent />
      </TimelineProvider>
    );

    // Add a marker first
    fireEvent.click(screen.getByTestId('add-marker'));
    
    // Get the marker ID
    const markerId = screen.getByTestId('markers-count').textContent === '1' 
      ? markers[0].id 
      : '';
    
    // Remove the marker
    fireEvent.click(screen.getByTestId(`remove-${markerId}`));
    
    expect(screen.getByTestId('markers-count')).toHaveTextContent('0');
  });
});
