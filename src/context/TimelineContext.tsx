/**
 * Timeline context provider for ChronoCanvas
 * 
 * This context manages the timeline state, including current position,
 * playback status, and speed.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useCanvas } from './CanvasContext';

// Type definitions
interface TimelineContextType {
  currentPosition: number;
  isPlaying: boolean;
  playbackSpeed: number;
  duration: number;
  markers: TimelineMarker[];
  togglePlayback: () => void;
  setPosition: (position: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  addMarker: (marker: TimelineMarker) => void;
  removeMarker: (id: string) => void;
  updateElementAtCurrentTime: () => void;
  // Additional methods needed by components
  play: () => void;
  pause: () => void;
  seekToMarker: (markerId: string) => void;
  setCurrentPosition: (position: number) => void;
}

export interface TimelineMarker {
  id: string;
  position: number;
  name: string;
  color?: string;
}

// Create context with default values
const TimelineContext = createContext<TimelineContextType>({
  currentPosition: 0,
  isPlaying: false,
  playbackSpeed: 1,
  duration: 60, // Default duration in seconds
  markers: [],
  togglePlayback: () => {},
  setPosition: () => {},
  setPlaybackSpeed: () => {},
  addMarker: () => {},
  removeMarker: () => {},
  updateElementAtCurrentTime: () => {},
  play: () => {},
  pause: () => {},
  seekToMarker: () => {},
  setCurrentPosition: () => {},
});

/**
 * Timeline context provider component
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canvas } = useCanvas();
  
  // Timeline state
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [duration, setDuration] = useState<number>(60); // Default duration in seconds
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  
  /**
   * Toggle playback state
   */
  const togglePlayback = useCallback((): void => {
    setIsPlaying(prev => !prev);
  }, []);
  
  /**
   * Start playback
   */
  const play = useCallback((): void => {
    setIsPlaying(true);
  }, []);
  
  /**
   * Pause playback
   */
  const pause = useCallback((): void => {
    setIsPlaying(false);
  }, []);
  
  /**
   * Set timeline position
   * 
   * @param {number} position - New position in seconds
   */
  const setPosition = useCallback((position: number): void => {
    setCurrentPosition(Math.max(0, Math.min(position, duration)));
  }, [duration]);
  
  /**
   * Set playback speed
   * 
   * @param {number} speed - New playback speed
   */
  const setPlaybackSpeedValue = useCallback((speed: number): void => {
    setPlaybackSpeed(speed);
  }, []);
  
  /**
   * Add marker to timeline
   * 
   * @param {TimelineMarker} marker - Marker to add
   */
  const addMarker = useCallback((marker: TimelineMarker): void => {
    setMarkers(prev => [...prev, marker]);
  }, []);
  
  /**
   * Remove marker from timeline
   * 
   * @param {string} id - ID of marker to remove
   */
  const removeMarker = useCallback((id: string): void => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);
  
  /**
   * Seek to a specific marker
   * 
   * @param {string} markerId - ID of marker to seek to
   */
  const seekToMarker = useCallback((markerId: string): void => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setCurrentPosition(marker.position);
    }
  }, [markers]);
  
  /**
   * Update element visibility and properties based on current timeline position
   */
  const updateElementAtCurrentTime = useCallback((): void => {
    // Update each element based on its timeline data
    canvas.elements.forEach(element => {
      // Skip if element has no timeline data
      if (!element.timelineData) {
        return;
      }
      
      const { entryPoint, exitPoint, persist, keyframes } = element.timelineData;
      
      // Determine visibility based on entry/exit points
      let isVisible = true;
      
      // Check if current position is before entry point
      if (entryPoint !== undefined && entryPoint !== null && currentPosition < entryPoint) {
        isVisible = false;
      }
      
      // Check if current position is after exit point and element doesn't persist
      if (exitPoint !== undefined && exitPoint !== null && !persist && currentPosition > exitPoint) {
        isVisible = false;
      }
      
      // Apply keyframe interpolation if element has keyframes
      if (keyframes && keyframes.length > 0 && isVisible) {
        // Find the keyframes that surround the current position
        const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
        
        // Find the previous and next keyframes
        const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= currentPosition).pop();
        const nextKeyframe = sortedKeyframes.filter(kf => kf.time > currentPosition)[0];
        
        if (prevKeyframe && nextKeyframe) {
          // Interpolate between keyframes
          const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
          
          // Apply interpolated properties
          interpolateProperties(prevKeyframe.properties, nextKeyframe.properties, progress);
        }
      }
    });
  }, [canvas.elements, currentPosition]);
  
  /**
   * Interpolate between two sets of properties
   * 
   * @param {Record<string, any>} prevProps - Properties from previous keyframe
   * @param {Record<string, any>} nextProps - Properties from next keyframe
   * @param {number} progress - Interpolation progress (0-1)
   * @returns {Record<string, any>} Interpolated properties
   */
  const interpolateProperties = (
    prevProps: Record<string, any>, 
    nextProps: Record<string, any>, 
    progress: number
  ): Record<string, any> => {
    const result: Record<string, any> = { ...prevProps };
    
    // Interpolate numeric properties
    Object.keys(prevProps).forEach(key => {
      if (typeof prevProps[key] === 'number' && typeof nextProps[key] === 'number') {
        result[key] = prevProps[key] + (nextProps[key] - prevProps[key]) * progress;
      }
    });
    
    return result;
  };
  
  // Use a ref to track animation frame ID
  const animationFrameRef = useRef<number | null>(null);
  
  // Use a ref to track the last position to avoid dependency on currentPosition
  const positionRef = useRef<number>(currentPosition);
  
  // Update the ref when currentPosition changes
  useEffect(() => {
    positionRef.current = currentPosition;
  }, [currentPosition]);
  
  // Update timeline position during playback - completely refactored to avoid infinite loops
  useEffect(() => {
    // Only run animation when playing
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    // Store the last time for calculating elapsed time
    let lastTime = Date.now();
    
    // Animation frame callback
    const animate = () => {
      const now = Date.now();
      const elapsed = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now; // Update for next frame
      
      // Calculate new position based on current ref value
      const newPosition = positionRef.current + (elapsed * playbackSpeed);
      
      // Handle looping
      if (newPosition >= duration) {
        setCurrentPosition(0);
      } else {
        setCurrentPosition(newPosition);
      }
      
      // Schedule next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    lastTime = Date.now(); // Initialize before starting
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed, duration]); // Removed dependencies that cause loops
  
  // Update elements when position changes manually
  useEffect(() => {
    if (!isPlaying) {
      updateElementAtCurrentTime();
    }
  }, [currentPosition, isPlaying, updateElementAtCurrentTime]);
  
  // Calculate duration based on element timeline data
  useEffect(() => {
    let maxDuration = 60; // Default minimum duration
    
    canvas.elements.forEach(element => {
      if (element.timelineData) {
        const { exitPoint } = element.timelineData;
        if (exitPoint && exitPoint > maxDuration) {
          maxDuration = exitPoint + 10; // Add buffer
        }
        
        // Check keyframes
        if (element.timelineData.keyframes) {
          element.timelineData.keyframes.forEach(keyframe => {
            if (keyframe.time > maxDuration) {
              maxDuration = keyframe.time + 10; // Add buffer
            }
          });
        }
      }
    });
    
    setDuration(maxDuration);
  }, [canvas.elements]);
  
  // Context value
  const contextValue: TimelineContextType = {
    currentPosition,
    isPlaying,
    playbackSpeed,
    duration,
    markers,
    togglePlayback,
    setPosition,
    setPlaybackSpeed: setPlaybackSpeedValue,
    addMarker,
    removeMarker,
    updateElementAtCurrentTime,
    play,
    pause,
    seekToMarker,
    setCurrentPosition,
  };
  
  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};

/**
 * Hook to use timeline context
 * 
 * @returns {TimelineContextType} Timeline context
 */
export const useTimeline = (): TimelineContextType => useContext(TimelineContext);
