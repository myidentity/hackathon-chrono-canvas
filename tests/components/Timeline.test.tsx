/**
 * Component tests for Timeline
 * 
 * This file contains tests for the Timeline component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Timeline from '../../src/components/Timeline/Timeline';
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

describe('Timeline', () => {
  test('should render timeline with correct duration', () => {
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    const timeline = screen.getByTestId('timeline-container');
    expect(timeline).toBeInTheDocument();
  });

  test('should display current time and total duration', () => {
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    expect(screen.getByText('10:00 / 60:00')).toBeInTheDocument();
  });

  test('should render timeline markers', () => {
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    expect(screen.getByText('Intro')).toBeInTheDocument();
    expect(screen.getByText('Middle')).toBeInTheDocument();
  });

  test('should handle play/pause button click', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const playMock = useTimeline().play;
    const pauseMock = useTimeline().pause;
    
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    // Click play button
    fireEvent.click(screen.getByLabelText('Play'));
    
    // Play function should be called
    expect(playMock).toHaveBeenCalled();
    
    // Mock isPlaying to be true
    jest.spyOn(require('../../src/context/TimelineContext'), 'useTimeline').mockImplementation(() => ({
      ...useTimeline(),
      isPlaying: true,
    }));
    
    // Re-render with isPlaying=true
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );
    
    // Click pause button
    fireEvent.click(screen.getByLabelText('Pause'));
    
    // Pause function should be called
    expect(pauseMock).toHaveBeenCalled();
  });

  test('should handle timeline scrubbing', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const setCurrentPositionMock = useTimeline().setCurrentPosition;
    
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    const timelineTrack = screen.getByTestId('timeline-track');
    
    // Click on timeline track to seek
    fireEvent.click(timelineTrack);
    
    // setCurrentPosition should be called
    expect(setCurrentPositionMock).toHaveBeenCalled();
  });

  test('should handle marker click', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const seekToMarkerMock = useTimeline().seekToMarker;
    
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    // Click on a marker
    fireEvent.click(screen.getByText('Intro'));
    
    // seekToMarker should be called with marker id
    expect(seekToMarkerMock).toHaveBeenCalledWith('marker-1');
  });

  test('should handle speed change', () => {
    const { useTimeline } = jest.requireMock('../../src/context/TimelineContext');
    const setPlaybackSpeedMock = useTimeline().setPlaybackSpeed;
    
    render(
      <TimelineProvider>
        <Timeline />
      </TimelineProvider>
    );

    // Click 2x speed button
    fireEvent.click(screen.getByText('2x'));
    
    // setPlaybackSpeed should be called with 2
    expect(setPlaybackSpeedMock).toHaveBeenCalledWith(2);
  });
});
