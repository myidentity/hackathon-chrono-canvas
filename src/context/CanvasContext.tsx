/**
 * Canvas context provider for ChronoCanvas
 * 
 * This context manages the canvas state, including elements, selection,
 * and element manipulation.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
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
  addElement: (element: Partial<CanvasElement>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  updateElementPosition: (id: string, dx: number, dy: number) => void;
  updateElementSize: (id: string, width: number, height: number) => void;
  updateElementRotation: (id: string, rotation: number) => void;
  updateElementVisibility: (id: string, isVisible: boolean, properties?: Partial<CanvasElement>) => void;
  clearCanvas: () => void;
}

// Create context with default values
const CanvasContext = createContext<CanvasContextValue>({
  canvas: { elements: [], viewBox: { x: 0, y: 0, width: 1000, height: 1000 } },
  selectedElement: null,
  addElement: () => '',
  updateElement: () => {},
  removeElement: () => {},
  selectElement: () => {},
  updateElementPosition: () => {},
  updateElementSize: () => {},
  updateElementRotation: () => {},
  updateElementVisibility: () => {},
  clearCanvas: () => {},
});

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
  
  /**
   * Add a new element to the canvas
   */
  const addElement = useCallback((element: Partial<CanvasElement>) => {
    const id = `element-${uuidv4()}`;
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
    
    return id;
  }, []);
  
  /**
   * Update an existing element
   */
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setCanvas(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.id === id) {
          // Create a deep copy of the element
          const updatedElement = { ...element } as CanvasElement;
          
          // Process each update key
          Object.keys(updates).forEach(key => {
            if (key.includes('.')) {
              // Handle nested properties (e.g., 'position.x')
              const [parent, child] = key.split('.');
              if (parent && child) {
                if (!updatedElement[parent]) {
                  updatedElement[parent] = {};
                }
                updatedElement[parent] = {
                  ...updatedElement[parent],
                  [child]: updates[key]
                };
              }
            } else if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
              // Handle object updates (deep merge)
              updatedElement[key] = {
                ...updatedElement[key],
                ...updates[key]
              };
            } else {
              // Handle primitive value updates
              updatedElement[key] = updates[key];
            }
          });
          
          // Remove console log for production
          // console.log('Updating element with:', updatedElement);
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
    // Remove console logs for production
    // console.log('CanvasContext selectElement called with id:', id);
    setSelectedElement(id);
    // console.log('CanvasContext selectedElement state updated to:', id);
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
            return {
              ...element,
              ...properties,
              // Special handling for position if it's in the properties
              position: properties.position ? properties.position : element.position,
            };
          }
          
          // Otherwise just update visibility via opacity
          return {
            ...element,
            opacity: isVisible ? 1 : 0,
          };
        }
        return element;
      }),
    }));
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
    addElement,
    updateElement,
    removeElement,
    selectElement,
    updateElementPosition,
    updateElementSize,
    updateElementRotation,
    updateElementVisibility,
    clearCanvas,
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
