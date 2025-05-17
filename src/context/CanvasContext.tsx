/**
 * Canvas context provider for ChronoCanvas
 * 
 * This context manages the canvas state, including elements, selection,
 * and element manipulation.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// Type definitions
export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker' | 'media';
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
  timelineData?: {
    entryPoint?: number;
    exitPoint?: number;
    persist?: boolean;
    keyframes?: Array<{
      time: number;
      properties: any;
    }>;
  };
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
  updateElementVisibility: (id: string, isVisible: boolean, properties?: any) => void;
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
});

/**
 * Canvas context provider component
 */
export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Canvas state
  const [canvas, setCanvas] = useState<CanvasState>({
    elements: [
      // Sample elements for testing
      {
        id: 'sample-image-1',
        type: 'image',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        src: 'https://via.placeholder.com/200x150/8B5CF6/FFFFFF?text=Sample+Image+1',
        alt: 'Sample Image 1',
        timelineData: {
          entryPoint: 0,
          exitPoint: 30,
          persist: true,
          keyframes: [
            {
              time: 0,
              properties: {
                opacity: 0,
                rotation: 0,
              },
            },
            {
              time: 5,
              properties: {
                opacity: 1,
                rotation: 0,
              },
            },
            {
              time: 15,
              properties: {
                opacity: 1,
                rotation: 180,
              },
            },
            {
              time: 30,
              properties: {
                opacity: 0,
                rotation: 360,
              },
            },
          ],
        },
      },
      {
        id: 'sample-image-2',
        type: 'image',
        position: { x: 350, y: 100 },
        size: { width: 200, height: 150 },
        src: 'https://via.placeholder.com/200x150/F59E0B/FFFFFF?text=Sample+Image+2',
        alt: 'Sample Image 2',
        timelineData: {
          entryPoint: 10,
          exitPoint: 40,
          persist: false,
          keyframes: [
            {
              time: 10,
              properties: {
                opacity: 0,
                position: { x: 350, y: 100 },
              },
            },
            {
              time: 20,
              properties: {
                opacity: 1,
                position: { x: 500, y: 200 },
              },
            },
            {
              time: 40,
              properties: {
                opacity: 0,
                position: { x: 650, y: 300 },
              },
            },
          ],
        },
      },
    ],
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
  });
  
  // Selected element
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  /**
   * Add a new element to the canvas
   */
  const addElement = useCallback((element: Partial<CanvasElement>) => {
    const id = `element-${Date.now()}`;
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
      elements: prev.elements.map(element => 
        element.id === id ? { ...element, ...updates } : element
      ),
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
  const updateElementVisibility = useCallback((id: string, isVisible: boolean, properties?: any) => {
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
