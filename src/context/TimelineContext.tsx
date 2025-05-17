/**
 * Timeline context provider for managing timeline state across the application.
 * 
 * This context provides access to timeline data, markers, and operations
 * for manipulating the timeline and playback.
 * 
 * @module TimelineContext
 */

import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';

/**
 * Interface for timeline marker
 */
interface TimelineMarker {
  id: string;
  name: string;
  position: number;
  color: string;
}

/**
 * Interface for timeline context value
 */
interface TimelineContextValue {
  duration: number;
  currentPosition: number;
  markers: TimelineMarker[];
  isPlaying: boolean;
  playbackSpeed: number;
  setDuration: (duration: number) => void;
  setCurrentPosition: (position: number) => void;
  addMarker: (name: string, position: number, color?: string) => string;
  updateMarker: (id: string, updates: Partial<Omit<TimelineMarker, 'id'>>) => void;
  removeMarker: (id: string) => void;
  play: () => void;
  pause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  seekToMarker: (markerId: string) => void;
}

/**
 * Create the timeline context with default value
 */
const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

/**
 * Props for the TimelineProvider component
 */
interface TimelineProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the Timeline context
 * 
 * @param {TimelineProviderProps} props - The component props
 * @returns {JSX.Element} The provider component
 */
export function TimelineProvider({ children }: TimelineProviderProps): JSX.Element {
  // Timeline state
  const [duration, setDuration] = useState<number>(60); // Default 60 seconds
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  
  // Reference for animation frame
  const animationFrameRef = useRef<number | null>(null);
  // Reference for last update time
  const lastUpdateTimeRef = useRef<number | null>(null);

  /**
   * Add a new marker to the timeline
   * 
   * @param {string} name - The name of the marker
   * @param {number} position - The position of the marker in seconds
   * @param {string} [color] - The color of the marker (optional)
   * @returns {string} The ID of the newly added marker
   */
  const addMarker = useCallback((name: string, position: number, color: string = '#3b82f6'): string => {
    const id = `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMarker: TimelineMarker = { id, name, position, color };
    
    setMarkers(prev => [...prev, newMarker]);
    
    return id;
  }, []);

  /**
   * Update an existing marker on the timeline
   * 
   * @param {string} id - The ID of the marker to update
   * @param {Partial<Omit<TimelineMarker, 'id'>>} updates - The properties to update
   */
  const updateMarker = useCallback((id: string, updates: Partial<Omit<TimelineMarker, 'id'>>): void => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === id ? { ...marker, ...updates } : marker
      )
    );
  }, []);

  /**
   * Remove a marker from the timeline
   * 
   * @param {string} id - The ID of the marker to remove
   */
  const removeMarker = useCallback((id: string): void => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);

  /**
   * Start timeline playback
   */
  const play = useCallback((): void => {
    setIsPlaying(true);
  }, []);

  /**
   * Pause timeline playback
   */
  const pause = useCallback((): void => {
    setIsPlaying(false);
  }, []);

  /**
   * Seek to a specific marker position
   * 
   * @param {string} markerId - The ID of the marker to seek to
   */
  const seekToMarker = useCallback((markerId: string): void => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setCurrentPosition(marker.position);
    }
  }, [markers]);

  /**
   * Animation loop for timeline playback
   * 
   * @param {number} timestamp - The current timestamp from requestAnimationFrame
   */
  const animationLoop = useCallback((timestamp: number): void => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const deltaTime = (timestamp - lastUpdateTimeRef.current) / 1000; // Convert to seconds
    lastUpdateTimeRef.current = timestamp;
    
    setCurrentPosition(prev => {
      const newPosition = prev + (deltaTime * playbackSpeed);
      // Loop back to start if we reach the end
      return newPosition >= duration ? 0 : newPosition;
    });
    
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  }, [duration, playbackSpeed]);

  // Effect to handle playback state changes
  useEffect(() => {
    if (isPlaying) {
      lastUpdateTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animationLoop]);

  // Create the context value object
  const value: TimelineContextValue = {
    duration,
    currentPosition,
    markers,
    isPlaying,
    playbackSpeed,
    setDuration,
    setCurrentPosition,
    addMarker,
    updateMarker,
    removeMarker,
    play,
    pause,
    setPlaybackSpeed,
    seekToMarker,
  };

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

/**
 * Custom hook for accessing the timeline context
 * 
 * @returns {TimelineContextValue} The timeline context value
 * @throws {Error} If used outside of a TimelineProvider
 */
export function useTimeline(): TimelineContextValue {
  const context = useContext(TimelineContext);
  
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  
  return context;
}
