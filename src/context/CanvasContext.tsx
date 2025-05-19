/**
 * Canvas context provider for ChronoCanvas
 * 
 * This context manages the canvas state, including elements, selection,
 * and element manipulation.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface KeyframeProperty {
  opacity?: number;
  scale?: number;
  rotation?: number;
  position?: { x: number; y: number };
  [key: string]: any;
}

export interface TimelineKeyframe {
  time: number;
  properties: KeyframeProperty;
}

export interface TimelineData {
  entryPoint?: number;
  exitPoint?: number;
  persist?: boolean;
  keyframes?: TimelineKeyframe[];
}

export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker' | 'media' | 'audio' | 'map';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  src?: string;
  alt?: string;
  content?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: string;
  shape?: string;
  borderRadius?: string;
  emoji?: string;
  timelineData?: TimelineData;
  [key: string]: any;
}

export interface CanvasState {
  elements: CanvasElement[];
  viewBox: { x: number; y: number; width: number; height: number };
}

export interface CanvasContextValue {
  canvas: CanvasState;
  selectedElement: string | null;
  isDraggingAny: boolean; // Global drag state
  addElement: (element: Partial<CanvasElement>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  updateElementPosition: (id: string, dx: number, dy: number) => void;
  updateElementSize: (id: string, width: number, height: number) => void;
  updateElementRotation: (id: string, rotation: number) => void;
  updateElementVisibility: (id: string, isVisible: boolean, properties?: Partial<CanvasElement>) => void;
  setDraggingState: (isDragging: boolean) => void; // Method to update drag state
  clearCanvas: () => void;
  initializeEventSystem: () => void; // New method to initialize event system
}

// Create context with default values
const CanvasContext = createContext<CanvasContextValue>({
  canvas: { elements: [], viewBox: { x: 0, y: 0, width: 1000, height: 1000 } },
  selectedElement: null,
  isDraggingAny: false,
  addElement: () => '',
  updateElement: () => {},
  removeElement: () => {},
  selectElement: () => {},
  updateElementPosition: () => {},
  updateElementSize: () => {},
  updateElementRotation: () => {},
  updateElementVisibility: () => {},
  setDraggingState: () => {},
  clearCanvas: () => {},
  initializeEventSystem: () => {}, // Default implementation
});

// Utility function to create and dispatch synthetic events
const dispatchSyntheticEvents = (target: EventTarget) => {
  const events = ['mousemove', 'mousedown', 'mouseup', 'click', 'mouseover', 'mouseout'];
  events.forEach(eventType => {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window
    });
    target.dispatchEvent(event);
  });
};

/**
 * Deep merge utility function for nested objects
 * 
 * @param target - Target object to merge into
 * @param source - Source object to merge from
 * @returns Merged object
 */
const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

/**
 * Check if value is an object
 * 
 * @param item - Value to check
 * @returns True if object
 */
const isObject = (item: any): boolean => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * Canvas context provider component
 */
export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Canvas state - starting with an empty canvas
  const [canvas, setCanvas] = useState<CanvasState>({
    elements: [],
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
  });
  
  // Selected element
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Global dragging state to track if any element is being dragged
  const [isDraggingAny, setIsDraggingAny] = useState<boolean>(false);
  
  // Track initialization status
  const isInitialized = useRef<boolean>(false);
  
  // Reference to the canvas container element
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  
  /**
   * Initialize event system - can be called multiple times safely
   */
  const initializeEventSystem = useCallback(() => {
    // Create and dispatch synthetic events to ensure event system is fully initialized
    dispatchSyntheticEvents(document);
    
    // If we have a canvas container reference, initialize events on it too
    if (canvasContainerRef.current) {
      dispatchSyntheticEvents(canvasContainerRef.current);
    }
    
    // Mark as initialized
    isInitialized.current = true;
  }, []);
  
  // Initialize event system on first render
  useEffect(() => {
    // Add global styles for dragging and element optimization
    const style = document.createElement('style');
    style.innerHTML = `
      .element-dragging {
        cursor: grabbing !important;
      }
      [data-element-type] {
        will-change: transform, left, top;
        touch-action: none;
        user-select: none;
      }
      [data-element-type="image"] img {
        -webkit-user-drag: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
    
    // Initialize event system
    initializeEventSystem();
    
    // Set up a MutationObserver to detect when new elements are added to the DOM
    const observer = new MutationObserver((mutations) => {
      // Re-initialize event system when DOM changes
      initializeEventSystem();
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Clean up
    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, [initializeEventSystem]);
  
  /**
   * Add a new element to the canvas
   */
  const addElement = useCallback((element: Partial<CanvasElement>) => {
    const id = element.id || (element.type === 'shape' ? `shape-${uuidv4().substring(0, 8)}` : 
                             element.type === 'image' ? `image-${uuidv4().substring(0, 8)}` : 
                             `element-${uuidv4().substring(0, 8)}`);
    const newElement: CanvasElement = {
      id,
      type: element.type || 'shape',
      position: element.position || { x: 100, y: 100 },
      size: element.size || { width: 100, height: 100 },
      ...element,
    };
    
    setCanvas(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));
    
    // Re-initialize event system when adding new elements
    // This ensures proper event binding regardless of element type
    setTimeout(() => {
      initializeEventSystem();
    }, 0);
    
    return id;
  }, [initializeEventSystem]);
  
  /**
   * Update an existing element with improved deep merging
   */
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          // Use deep merge for all object properties
          const updatedElement = deepMerge(element, updates);
          
          // Ensure position and size are properly updated
          if (updates.position) {
            updatedElement.position = {
              ...element.position,
              ...updates.position
            };
          }
          
          if (updates.size) {
            updatedElement.size = {
              ...element.size,
              ...updates.size
            };
          }
          
          // Force a re-render by adding a timestamp
          updatedElement._lastUpdated = Date.now();
          
          return updatedElement;
        }
        return element;
      }),
    }));
  }, []);
  
  /**
   * Remove an element from the canvas
   */
  const removeElement = useCallback((id: string) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.filter(element => element.id !== id),
    }));
    
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);
  
  /**
   * Select an element
   */
  const selectElement = useCallback((id: string | null) => {
    setSelectedElement(id);
  }, []);
  
  /**
   * Update element position
   */
  const updateElementPosition = useCallback((id: string, dx: number, dy: number) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            position: {
              x: element.position.x + dx,
              y: element.position.y + dy,
            },
            _lastUpdated: Date.now(), // Force re-render
          };
        }
        return element;
      }),
    }));
  }, []);
  
  /**
   * Update element size
   */
  const updateElementSize = useCallback((id: string, width: number, height: number) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            size: { width, height },
            _lastUpdated: Date.now(), // Force re-render
          };
        }
        return element;
      }),
    }));
  }, []);
  
  /**
   * Update element rotation
   */
  const updateElementRotation = useCallback((id: string, rotation: number) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            rotation,
            _lastUpdated: Date.now(), // Force re-render
          };
        }
        return element;
      }),
    }));
  }, []);
  
  /**
   * Update element visibility and properties for timeline animations
   */
  const updateElementVisibility = useCallback((id: string, isVisible: boolean, properties?: Partial<CanvasElement>) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          // If properties are provided, update them along with visibility
          if (properties) {
            // Use deep merge for all object properties
            const updatedElement = deepMerge(element, properties);
            
            // Ensure position and size are properly updated
            if (properties.position) {
              updatedElement.position = {
                ...element.position,
                ...properties.position
              };
            }
            
            if (properties.size) {
              updatedElement.size = {
                ...element.size,
                ...properties.size
              };
            }
            
            // Set visibility
            updatedElement.opacity = isVisible ? (properties.opacity ?? 1) : 0;
            
            // Force a re-render
            updatedElement._lastUpdated = Date.now();
            
            return updatedElement;
          }
          
          // Otherwise just update visibility via opacity
          return {
            ...element,
            opacity: isVisible ? 1 : 0,
            _lastUpdated: Date.now(), // Force re-render
          };
        }
        return element;
      }),
    }));
  }, []);
  
  /**
   * Set global dragging state
   */
  const setDraggingState = useCallback((isDragging: boolean) => {
    setIsDraggingAny(isDragging);
    
    // Apply global styling when dragging
    if (isDragging) {
      document.body.classList.add('element-dragging');
    } else {
      document.body.classList.remove('element-dragging');
    }
  }, []);
  
  /**
   * Clear all elements from the canvas
   */
  const clearCanvas = useCallback(() => {
    setCanvas(prev => ({
      ...prev,
      elements: [],
    }));
    setSelectedElement(null);
  }, []);
  
  // Context value
  const contextValue: CanvasContextValue = {
    canvas,
    selectedElement,
    isDraggingAny,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    updateElementPosition,
    updateElementSize,
    updateElementRotation,
    updateElementVisibility,
    setDraggingState,
    clearCanvas,
    initializeEventSystem,
  };
  
  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

/**
 * Hook to use canvas context
 */
export const useCanvas = () => useContext(CanvasContext);
