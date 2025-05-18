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
 */
export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canvas } = useCanvas();
  
  // Timeline state
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(60); // Default duration in seconds
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
  /**
   * Toggle playback state
   */
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
    setLastUpdateTime(Date.now());
  }, []);
  
  /**
   * Start playback
   */
  const play = useCallback(() => {
    setIsPlaying(true);
    setLastUpdateTime(Date.now());
  }, []);
  
  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  /**
   * Set timeline position
   */
  const setPosition = useCallback((position: number) => {
    setCurrentPosition(Math.max(0, Math.min(position, duration)));
  }, [duration]);
  
  /**
   * Set playback speed
   */
  const setPlaybackSpeedValue = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
  }, []);
  
  /**
   * Add marker to timeline
   */
  const addMarker = useCallback((marker: TimelineMarker) => {
    setMarkers(prev => [...prev, marker]);
  }, []);
  
  /**
   * Remove marker from timeline
   */
  const removeMarker = useCallback((id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);
  
  /**
   * Seek to a specific marker
   */
  const seekToMarker = useCallback((markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setCurrentPosition(marker.position);
    }
  }, [markers]);
  
  /**
   * Update element visibility and properties based on current timeline position
   */
  const updateElementAtCurrentTime = useCallback(() => {
    // Log for debugging
    console.log('Updating elements at time:', currentPosition);
    
    // Update each element based on its timeline data
    canvas.elements.forEach(element => {
      // Skip if element has no timeline data
      if (!element.timelineData) {
        console.log('Element has no timeline data:', element.id);
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
          const interpolatedProps = interpolateProperties(prevKeyframe.properties, nextKeyframe.properties, progress);
          
          // Update element with interpolated properties
          console.log('Applying interpolated properties to element:', element.id, interpolatedProps);
        } else if (prevKeyframe) {
          // Use properties from the last keyframe
          console.log('Applying last keyframe properties to element:', element.id, prevKeyframe.properties);
        } else if (nextKeyframe) {
          // Use properties from the first keyframe
          console.log('Applying first keyframe properties to element:', element.id, nextKeyframe.properties);
        } else {
          // No applicable keyframes, just update visibility
          console.log('Updating element visibility only:', element.id, isVisible);
        }
      } else {
        // No keyframes, just update visibility
        console.log('Updating element visibility only:', element.id, isVisible);
      }
    });
  }, [canvas.elements, currentPosition]);
  
  /**
   * Interpolate between two sets of properties
   */
  const interpolateProperties = (prevProps: any, nextProps: any, progress: number) => {
    const result: any = { ...prevProps };
    
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
  const positionRef = useRef(currentPosition);
  
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
 */
export const useTimeline = () => useContext(TimelineContext);
