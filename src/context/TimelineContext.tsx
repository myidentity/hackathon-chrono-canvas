/**
 * Timeline context provider for ChronoCanvas with keyframe animation support
 * 
 * This context manages the timeline state, including current position,
 * playback status, keyframes, and animation interpolation.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useCanvas, CanvasElement } from './CanvasContext';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface KeyframeProperty {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  color?: string;
  backgroundColor?: string;
  [key: string]: any;
}

export type InterpolationType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'custom';

export interface Keyframe {
  id: string;
  elementId: string;
  time: number;
  properties: KeyframeProperty;
  interpolationType?: {
    [key: string]: InterpolationType;
  };
  customCurve?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface ElementTimelineData {
  elementId: string;
  keyframes: Keyframe[];
  visible: boolean;
  color: string;
}

export interface TimelineMarker {
  id: string;
  position: number;
  name: string;
  color?: string;
}

interface TimelineContextType {
  // Timeline state
  currentPosition: number;
  isPlaying: boolean;
  playbackSpeed: number;
  duration: number;
  markers: TimelineMarker[];
  
  // Keyframe state
  keyframes: Keyframe[];
  elementTimelineData: Record<string, ElementTimelineData>;
  selectedKeyframe: string | null;
  showAllKeyframes: boolean;
  
  // Timeline controls
  togglePlayback: () => void;
  setPosition: (position: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  play: () => void;
  pause: () => void;
  setCurrentPosition: (position: number) => void;
  
  // Marker operations
  addMarker: (marker: TimelineMarker) => void;
  removeMarker: (id: string) => void;
  seekToMarker: (markerId: string) => void;
  
  // Keyframe operations
  addKeyframe: (elementId: string, time: number, properties: KeyframeProperty) => string;
  updateKeyframe: (keyframeId: string, updates: Partial<Keyframe>) => void;
  deleteKeyframe: (keyframeId: string) => void;
  selectKeyframe: (keyframeId: string | null) => void;
  
  // Keyframe navigation
  nextKeyframe: (elementId: string) => void;
  previousKeyframe: (elementId: string) => void;
  
  // Interpolation
  setInterpolationType: (keyframeId: string, property: string, type: InterpolationType) => void;
  setCustomCurve: (keyframeId: string, x1: number, y1: number, x2: number, y2: number) => void;
  
  // Element timeline visibility
  toggleElementTimelineVisibility: (elementId: string) => void;
  toggleShowAllKeyframes: () => void;
  
  // Element updates
  updateElementAtCurrentTime: () => void;
}

// Create context with default values
const TimelineContext = createContext<TimelineContextType>({
  currentPosition: 0,
  isPlaying: false,
  playbackSpeed: 1,
  duration: 60,
  markers: [],
  
  keyframes: [],
  elementTimelineData: {},
  selectedKeyframe: null,
  showAllKeyframes: false,
  
  togglePlayback: () => {},
  setPosition: () => {},
  setPlaybackSpeed: () => {},
  play: () => {},
  pause: () => {},
  setCurrentPosition: () => {},
  
  addMarker: () => {},
  removeMarker: () => {},
  seekToMarker: () => {},
  
  addKeyframe: () => '',
  updateKeyframe: () => {},
  deleteKeyframe: () => {},
  selectKeyframe: () => {},
  
  nextKeyframe: () => {},
  previousKeyframe: () => {},
  
  setInterpolationType: () => {},
  setCustomCurve: () => {},
  
  toggleElementTimelineVisibility: () => {},
  toggleShowAllKeyframes: () => {},
  
  updateElementAtCurrentTime: () => {},
});

// Interpolation utility functions
const linearInterpolation = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

const easeInInterpolation = (start: number, end: number, progress: number, power: number = 2): number => {
  const easedProgress = Math.pow(progress, power);
  return start + (end - start) * easedProgress;
};

const easeOutInterpolation = (start: number, end: number, progress: number, power: number = 2): number => {
  const easedProgress = 1 - Math.pow(1 - progress, power);
  return start + (end - start) * easedProgress;
};

const easeInOutInterpolation = (start: number, end: number, progress: number, power: number = 2): number => {
  let easedProgress;
  if (progress < 0.5) {
    easedProgress = Math.pow(2 * progress, power) / 2;
  } else {
    easedProgress = 1 - Math.pow(2 * (1 - progress), power) / 2;
  }
  return start + (end - start) * easedProgress;
};

const bounceInterpolation = (start: number, end: number, progress: number): number => {
  const bounce = (x: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  };
  
  const easedProgress = bounce(progress);
  return start + (end - start) * easedProgress;
};

const bezierInterpolation = (
  start: number, 
  end: number, 
  progress: number, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number => {
  // Simplified bezier calculation
  const easedProgress = progress * progress * (3.0 - 2.0 * progress);
  return start + (end - start) * easedProgress;
};

/**
 * Timeline context provider component
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canvas, updateElement, updateElementVisibility } = useCanvas();
  
  // Timeline state
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [duration, setDuration] = useState<number>(60);
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  
  // Keyframe state
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [elementTimelineData, setElementTimelineData] = useState<Record<string, ElementTimelineData>>({});
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [showAllKeyframes, setShowAllKeyframes] = useState<boolean>(false);
  
  // Refs to prevent dependency cycles
  const keyframesRef = useRef<Keyframe[]>([]);
  const elementsRef = useRef<CanvasElement[]>([]);
  const currentPositionRef = useRef<number>(0);
  
  // Update refs when state changes
  useEffect(() => {
    keyframesRef.current = keyframes;
  }, [keyframes]);
  
  useEffect(() => {
    elementsRef.current = canvas.elements;
  }, [canvas.elements]);
  
  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);
  
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
   * Add keyframe for an element
   * 
   * @param {string} elementId - Element ID
   * @param {number} time - Timeline position in seconds
   * @param {KeyframeProperty} properties - Element properties at this keyframe
   * @returns {string} Keyframe ID
   */
  const addKeyframe = useCallback((
    elementId: string, 
    time: number, 
    properties: KeyframeProperty
  ): string => {
    const keyframeId = `keyframe-${uuidv4().substring(0, 8)}`;
    
    const newKeyframe: Keyframe = {
      id: keyframeId,
      elementId,
      time,
      properties,
      interpolationType: {
        position: 'easeInOut', // Default to easeInOut for all properties
        size: 'easeInOut',
        rotation: 'easeInOut',
        opacity: 'easeInOut'
      }
    };
    
    setKeyframes(prev => [...prev, newKeyframe]);
    
    // Update element timeline data
    setElementTimelineData(prev => {
      const existingData = prev[elementId];
      
      if (existingData) {
        return {
          ...prev,
          [elementId]: {
            ...existingData,
            keyframes: [...existingData.keyframes, newKeyframe]
          }
        };
      } else {
        // Create new element timeline data
        return {
          ...prev,
          [elementId]: {
            elementId,
            keyframes: [newKeyframe],
            visible: true,
            color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}` // Random color
          }
        };
      }
    });
    
    return keyframeId;
  }, []);
  
  /**
   * Update keyframe
   * 
   * @param {string} keyframeId - Keyframe ID
   * @param {Partial<Keyframe>} updates - Updates to apply
   */
  const updateKeyframe = useCallback((
    keyframeId: string, 
    updates: Partial<Keyframe>
  ): void => {
    // Use the ref to avoid dependency on keyframes state
    const currentKeyframes = keyframesRef.current;
    const keyframe = currentKeyframes.find(k => k.id === keyframeId);
    
    if (!keyframe) return;
    
    setKeyframes(prev => {
      const updatedKeyframes = prev.map(keyframe => {
        if (keyframe.id === keyframeId) {
          return {
            ...keyframe,
            ...updates,
            properties: updates.properties 
              ? { ...keyframe.properties, ...updates.properties }
              : keyframe.properties,
            interpolationType: updates.interpolationType
              ? { ...keyframe.interpolationType, ...updates.interpolationType }
              : keyframe.interpolationType
          };
        }
        return keyframe;
      });
      
      return updatedKeyframes;
    });
    
    // Update element timeline data
    const elementId = keyframe.elementId;
    
    setElementTimelineData(prev => {
      const elementData = prev[elementId];
      
      if (elementData) {
        return {
          ...prev,
          [elementId]: {
            ...elementData,
            keyframes: elementData.keyframes.map(k => {
              if (k.id === keyframeId) {
                return {
                  ...k,
                  ...updates,
                  properties: updates.properties 
                    ? { ...k.properties, ...updates.properties }
                    : k.properties,
                  interpolationType: updates.interpolationType
                    ? { ...k.interpolationType, ...updates.interpolationType }
                    : k.interpolationType
                };
              }
              return k;
            })
          }
        };
      }
      
      return prev;
    });
  }, []);
  
  /**
   * Delete keyframe
   * 
   * @param {string} keyframeId - Keyframe ID
   */
  const deleteKeyframe = useCallback((keyframeId: string): void => {
    // Use the ref to avoid dependency on keyframes state
    const currentKeyframes = keyframesRef.current;
    const keyframe = currentKeyframes.find(k => k.id === keyframeId);
    
    if (!keyframe) return;
    
    const elementId = keyframe.elementId;
    
    setKeyframes(prev => prev.filter(k => k.id !== keyframeId));
    
    // Update element timeline data
    setElementTimelineData(prev => {
      const elementData = prev[elementId];
      
      if (elementData) {
        const updatedKeyframes = elementData.keyframes.filter(k => k.id !== keyframeId);
        
        if (updatedKeyframes.length === 0) {
          // Remove element timeline data if no keyframes left
          const { [elementId]: _, ...rest } = prev;
          return rest;
        }
        
        return {
          ...prev,
          [elementId]: {
            ...elementData,
            keyframes: updatedKeyframes
          }
        };
      }
      
      return prev;
    });
    
    // Clear selection if deleted keyframe was selected
    if (selectedKeyframe === keyframeId) {
      setSelectedKeyframe(null);
    }
  }, [selectedKeyframe]);
  
  /**
   * Select keyframe
   * 
   * @param {string | null} keyframeId - Keyframe ID or null to deselect
   */
  const selectKeyframe = useCallback((keyframeId: string | null): void => {
    setSelectedKeyframe(keyframeId);
    
    // If selecting a keyframe, move timeline to that position
    if (keyframeId) {
      // Use the ref to avoid dependency on keyframes state
      const currentKeyframes = keyframesRef.current;
      const keyframe = currentKeyframes.find(k => k.id === keyframeId);
      
      if (keyframe) {
        setCurrentPosition(keyframe.time);
      }
    }
  }, []);
  
  /**
   * Navigate to next keyframe for an element
   * 
   * @param {string} elementId - Element ID
   */
  const nextKeyframe = useCallback((elementId: string): void => {
    // Use refs to avoid dependencies
    const currentKeyframes = keyframesRef.current;
    const position = currentPositionRef.current;
    
    const elementKeyframes = currentKeyframes
      .filter(k => k.elementId === elementId)
      .sort((a, b) => a.time - b.time);
    
    if (elementKeyframes.length === 0) return;
    
    const nextKeyframe = elementKeyframes.find(k => k.time > position);
    
    if (nextKeyframe) {
      setCurrentPosition(nextKeyframe.time);
      setSelectedKeyframe(nextKeyframe.id);
    } else {
      // Wrap around to first keyframe
      setCurrentPosition(elementKeyframes[0].time);
      setSelectedKeyframe(elementKeyframes[0].id);
    }
  }, []);
  
  /**
   * Navigate to previous keyframe for an element
   * 
   * @param {string} elementId - Element ID
   */
  const previousKeyframe = useCallback((elementId: string): void => {
    // Use refs to avoid dependencies
    const currentKeyframes = keyframesRef.current;
    const position = currentPositionRef.current;
    
    const elementKeyframes = currentKeyframes
      .filter(k => k.elementId === elementId)
      .sort((a, b) => a.time - b.time);
    
    if (elementKeyframes.length === 0) return;
    
    const prevKeyframes = elementKeyframes.filter(k => k.time < position);
    
    if (prevKeyframes.length > 0) {
      const prevKeyframe = prevKeyframes[prevKeyframes.length - 1];
      setCurrentPosition(prevKeyframe.time);
      setSelectedKeyframe(prevKeyframe.id);
    } else {
      // Wrap around to last keyframe
      const lastKeyframe = elementKeyframes[elementKeyframes.length - 1];
      setCurrentPosition(lastKeyframe.time);
      setSelectedKeyframe(lastKeyframe.id);
    }
  }, []);
  
  /**
   * Set interpolation type for a property
   * 
   * @param {string} keyframeId - Keyframe ID
   * @param {string} property - Property name
   * @param {InterpolationType} type - Interpolation type
   */
  const setInterpolationType = useCallback((
    keyframeId: string, 
    property: string, 
    type: InterpolationType
  ): void => {
    updateKeyframe(keyframeId, {
      interpolationType: {
        [property]: type
      }
    });
  }, [updateKeyframe]);
  
  /**
   * Set custom bezier curve for a keyframe
   * 
   * @param {string} keyframeId - Keyframe ID
   * @param {number} x1 - First control point X
   * @param {number} y1 - First control point Y
   * @param {number} x2 - Second control point X
   * @param {number} y2 - Second control point Y
   */
  const setCustomCurve = useCallback((
    keyframeId: string, 
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number
  ): void => {
    updateKeyframe(keyframeId, {
      customCurve: { x1, y1, x2, y2 }
    });
  }, [updateKeyframe]);
  
  /**
   * Toggle element timeline visibility
   * 
   * @param {string} elementId - Element ID
   */
  const toggleElementTimelineVisibility = useCallback((elementId: string): void => {
    setElementTimelineData(prev => {
      const elementData = prev[elementId];
      
      if (elementData) {
        return {
          ...prev,
          [elementId]: {
            ...elementData,
            visible: !elementData.visible
          }
        };
      }
      
      return prev;
    });
  }, []);
  
  /**
   * Toggle show all keyframes
   */
  const toggleShowAllKeyframes = useCallback((): void => {
    setShowAllKeyframes(prev => !prev);
  }, []);
  
  /**
   * Interpolate numeric property
   * 
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} progress - Progress (0-1)
   * @param {InterpolationType} type - Interpolation type
   * @param {Keyframe} keyframe - Keyframe for custom curve
   * @returns {number} Interpolated value
   */
  const interpolateNumeric = useCallback((
    start: number, 
    end: number, 
    progress: number, 
    type: InterpolationType = 'easeInOut',
    keyframe?: Keyframe
  ): number => {
    switch (type) {
      case 'easeIn':
        return easeInInterpolation(start, end, progress);
      case 'easeOut':
        return easeOutInterpolation(start, end, progress);
      case 'easeInOut':
        return easeInOutInterpolation(start, end, progress);
      case 'bounce':
        return bounceInterpolation(start, end, progress);
      case 'custom':
        if (keyframe?.customCurve) {
          const { x1, y1, x2, y2 } = keyframe.customCurve;
          return bezierInterpolation(start, end, progress, x1, y1, x2, y2);
        }
        return linearInterpolation(start, end, progress);
      case 'linear':
      default:
        return linearInterpolation(start, end, progress);
    }
  }, []);
  
  /**
   * Interpolate position property
   * 
   * @param {Keyframe} prevKeyframe - Previous keyframe
   * @param {Keyframe} nextKeyframe - Next keyframe
   * @param {number} progress - Progress (0-1)
   * @returns {Object} Interpolated position
   */
  const interpolatePosition = useCallback((
    prevKeyframe: Keyframe,
    nextKeyframe: Keyframe,
    progress: number
  ): { x: number, y: number } => {
    const startX = prevKeyframe.properties.position?.x ?? 0;
    const startY = prevKeyframe.properties.position?.y ?? 0;
    const endX = nextKeyframe.properties.position?.x ?? 0;
    const endY = nextKeyframe.properties.position?.y ?? 0;
    
    const type = nextKeyframe.interpolationType?.position ?? 'easeInOut';
    
    const x = interpolateNumeric(startX, endX, progress, type, nextKeyframe);
    const y = interpolateNumeric(startY, endY, progress, type, nextKeyframe);
    
    return { x, y };
  }, [interpolateNumeric]);
  
  /**
   * Interpolate size property
   * 
   * @param {Keyframe} prevKeyframe - Previous keyframe
   * @param {Keyframe} nextKeyframe - Next keyframe
   * @param {number} progress - Progress (0-1)
   * @returns {Object} Interpolated size
   */
  const interpolateSize = useCallback((
    prevKeyframe: Keyframe,
    nextKeyframe: Keyframe,
    progress: number
  ): { width: number, height: number } => {
    const startWidth = prevKeyframe.properties.size?.width ?? 0;
    const startHeight = prevKeyframe.properties.size?.height ?? 0;
    const endWidth = nextKeyframe.properties.size?.width ?? 0;
    const endHeight = nextKeyframe.properties.size?.height ?? 0;
    
    const type = nextKeyframe.interpolationType?.size ?? 'easeInOut';
    
    const width = interpolateNumeric(startWidth, endWidth, progress, type, nextKeyframe);
    const height = interpolateNumeric(startHeight, endHeight, progress, type, nextKeyframe);
    
    return { width, height };
  }, [interpolateNumeric]);
  
  /**
   * Interpolate color property
   * 
   * @param {string} startColor - Start color
   * @param {string} endColor - End color
   * @param {number} progress - Progress (0-1)
   * @param {InterpolationType} type - Interpolation type
   * @param {Keyframe} keyframe - Keyframe for custom curve
   * @returns {string} Interpolated color
   */
  const interpolateColor = useCallback((
    startColor: string,
    endColor: string,
    progress: number,
    type: InterpolationType = 'easeInOut',
    keyframe?: Keyframe
  ): string => {
    // Parse colors to RGB
    const parseColor = (color: string): { r: number, g: number, b: number } => {
      // Handle hex colors
      if (color.startsWith('#')) {
        const hex = color.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
      }
      
      // Handle rgb colors
      if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
          const r = parseInt(match[0], 10);
          const g = parseInt(match[1], 10);
          const b = parseInt(match[2], 10);
          return { r, g, b };
        }
      }
      
      // Default to black
      return { r: 0, g: 0, b: 0 };
    };
    
    // Parse start and end colors
    const startRGB = parseColor(startColor);
    const endRGB = parseColor(endColor);
    
    // Interpolate RGB components
    const r = Math.round(interpolateNumeric(startRGB.r, endRGB.r, progress, type, keyframe));
    const g = Math.round(interpolateNumeric(startRGB.g, endRGB.g, progress, type, keyframe));
    const b = Math.round(interpolateNumeric(startRGB.b, endRGB.b, progress, type, keyframe));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, [interpolateNumeric]);
  
  /**
   * Interpolate keyframes
   * 
   * @param {Keyframe} prevKeyframe - Previous keyframe
   * @param {Keyframe} nextKeyframe - Next keyframe
   * @param {number} currentTime - Current time
   * @returns {KeyframeProperty} Interpolated properties
   */
  const interpolateKeyframes = useCallback((
    prevKeyframe: Keyframe,
    nextKeyframe: Keyframe,
    currentTime: number
  ): KeyframeProperty => {
    // Calculate progress between keyframes
    const progress = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
    
    // Clamp progress to 0-1 range
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Initialize result with previous keyframe properties
    const result: KeyframeProperty = { ...prevKeyframe.properties };
    
    // Interpolate position if present in both keyframes
    if (prevKeyframe.properties.position && nextKeyframe.properties.position) {
      result.position = interpolatePosition(prevKeyframe, nextKeyframe, clampedProgress);
    }
    
    // Interpolate size if present in both keyframes
    if (prevKeyframe.properties.size && nextKeyframe.properties.size) {
      result.size = interpolateSize(prevKeyframe, nextKeyframe, clampedProgress);
    }
    
    // Interpolate numeric properties
    const numericProperties = ['opacity', 'rotation'];
    numericProperties.forEach(prop => {
      if (
        prevKeyframe.properties[prop] !== undefined && 
        nextKeyframe.properties[prop] !== undefined
      ) {
        const type = nextKeyframe.interpolationType?.[prop] ?? 'easeInOut';
        result[prop] = interpolateNumeric(
          prevKeyframe.properties[prop] as number,
          nextKeyframe.properties[prop] as number,
          clampedProgress,
          type,
          nextKeyframe
        );
      }
    });
    
    // Interpolate color properties
    const colorProperties = ['color', 'backgroundColor', 'borderColor'];
    colorProperties.forEach(prop => {
      if (
        prevKeyframe.properties[prop] !== undefined && 
        nextKeyframe.properties[prop] !== undefined
      ) {
        const type = nextKeyframe.interpolationType?.[prop] ?? 'easeInOut';
        result[prop] = interpolateColor(
          prevKeyframe.properties[prop] as string,
          nextKeyframe.properties[prop] as string,
          clampedProgress,
          type,
          nextKeyframe
        );
      }
    });
    
    return result;
  }, [interpolatePosition, interpolateSize, interpolateNumeric, interpolateColor]);
  
  /**
   * Update element visibility and properties based on current timeline position
   */
  const updateElementAtCurrentTime = useCallback((): void => {
    // Use refs to avoid dependencies
    const currentKeyframes = keyframesRef.current;
    const elements = elementsRef.current;
    const position = currentPositionRef.current;
    
    // Group keyframes by element ID
    const keyframesByElement: Record<string, Keyframe[]> = {};
    
    currentKeyframes.forEach(keyframe => {
      if (!keyframesByElement[keyframe.elementId]) {
        keyframesByElement[keyframe.elementId] = [];
      }
      keyframesByElement[keyframe.elementId].push(keyframe);
    });
    
    // Process each element
    elements.forEach(element => {
      const elementKeyframes = keyframesByElement[element.id];
      
      // Skip if element has no keyframes
      if (!elementKeyframes || elementKeyframes.length === 0) {
        return;
      }
      
      // Sort keyframes by time
      const sortedKeyframes = [...elementKeyframes].sort((a, b) => a.time - b.time);
      
      // Find keyframes surrounding current time
      const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= position).pop();
      const nextKeyframe = sortedKeyframes.filter(kf => kf.time > position)[0];
      
      // Handle different cases
      if (prevKeyframe && nextKeyframe) {
        // Between two keyframes - interpolate
        const interpolatedProps = interpolateKeyframes(prevKeyframe, nextKeyframe, position);
        updateElement(element.id, interpolatedProps);
      } else if (prevKeyframe) {
        // After last keyframe - use last keyframe properties
        updateElement(element.id, prevKeyframe.properties);
      } else if (nextKeyframe) {
        // Before first keyframe - element should be invisible
        updateElementVisibility(element.id, false);
      }
    });
  }, [interpolateKeyframes, updateElement, updateElementVisibility]);
  
  // Use a ref to track animation frame ID
  const animationFrameRef = useRef<number | null>(null);
  
  // Update timeline position during playback
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
      const newPosition = currentPositionRef.current + (elapsed * playbackSpeed);
      
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
  }, [isPlaying, playbackSpeed, duration]);
  
  // Update elements when position changes manually
  useEffect(() => {
    if (!isPlaying) {
      updateElementAtCurrentTime();
    }
  }, [currentPosition, isPlaying, updateElementAtCurrentTime]);
  
  // Calculate duration based on keyframes
  useEffect(() => {
    let maxDuration = 60; // Default minimum duration
    
    keyframes.forEach(keyframe => {
      if (keyframe.time > maxDuration) {
        maxDuration = keyframe.time + 10; // Add buffer
      }
    });
    
    setDuration(maxDuration);
  }, [keyframes]);
  
  // Initialize keyframes for new elements - using a separate effect with stable dependencies
  const processedElementsRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const processedElements = processedElementsRef.current;
    const newElements = canvas.elements.filter(element => !processedElements.has(element.id));
    
    // Process only new elements
    newElements.forEach(element => {
      // Check if element already has keyframes
      const hasKeyframes = keyframes.some(k => k.elementId === element.id);
      
      // If not, create initial keyframe at current position
      if (!hasKeyframes) {
        const properties: KeyframeProperty = {
          position: element.position,
          size: element.size,
          rotation: element.rotation,
          opacity: element.opacity
        };
        
        // Add color properties if present
        if (element.color) properties.color = element.color;
        if (element.backgroundColor) properties.backgroundColor = element.backgroundColor;
        
        // Add initial keyframe
        addKeyframe(element.id, currentPosition, properties);
        
        // Mark as processed
        processedElements.add(element.id);
      }
    });
    
    // Clean up processed elements that no longer exist
    canvas.elements.forEach(element => {
      processedElements.add(element.id);
    });
    
    // Remove processed elements that no longer exist
    const existingElementIds = new Set(canvas.elements.map(element => element.id));
    Array.from(processedElements).forEach(id => {
      if (!existingElementIds.has(id)) {
        processedElements.delete(id);
      }
    });
  }, [canvas.elements, addKeyframe, currentPosition, keyframes]);
  
  // Context value
  const contextValue: TimelineContextType = {
    currentPosition,
    isPlaying,
    playbackSpeed,
    duration,
    markers,
    
    keyframes,
    elementTimelineData,
    selectedKeyframe,
    showAllKeyframes,
    
    togglePlayback,
    setPosition,
    setPlaybackSpeed: setPlaybackSpeedValue,
    play,
    pause,
    setCurrentPosition,
    
    addMarker,
    removeMarker,
    seekToMarker,
    
    addKeyframe,
    updateKeyframe,
    deleteKeyframe,
    selectKeyframe,
    
    nextKeyframe,
    previousKeyframe,
    
    setInterpolationType,
    setCustomCurve,
    
    toggleElementTimelineVisibility,
    toggleShowAllKeyframes,
    
    updateElementAtCurrentTime,
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
