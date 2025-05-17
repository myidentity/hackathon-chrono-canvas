/**
 * Canvas context provider for managing canvas state across the application.
 * 
 * This context provides access to canvas data, elements, and operations
 * for manipulating the canvas content.
 * 
 * @module CanvasContext
 */

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

/**
 * Interface for canvas element position
 */
interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * Interface for canvas element size
 */
interface Size {
  width: number;
  height: number;
}

/**
 * Interface for element timeline data
 */
interface ElementTimelineData {
  entryPoint: number;
  exitPoint: number | null;
  persist: boolean;
  keyframes: Keyframe[];
}

/**
 * Interface for animation keyframe
 */
interface Keyframe {
  time: number;
  properties: Record<string, any>;
}

/**
 * Interface for canvas element animation
 */
interface Animation {
  type: string;
  duration: number;
  easing: string;
  delay: number;
  trigger: 'timeline' | 'scroll' | 'interaction';
  properties: Record<string, any>;
}

/**
 * Interface for canvas element
 */
export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker' | 'color' | 'media';
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  timelineData: ElementTimelineData;
  properties: Record<string, any>;
  animations: Animation[];
}

/**
 * Interface for canvas data
 */
export interface Canvas {
  id: string;
  name: string;
  width: number;
  height: number;
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  elements: CanvasElement[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for canvas context value
 */
interface CanvasContextValue {
  canvas: Canvas;
  selectedElements: string[];
  addElement: (element: Omit<CanvasElement, 'id'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string) => void;
  deselectElement: (id: string) => void;
  clearSelection: () => void;
  updateCanvas: (updates: Partial<Canvas>) => void;
}

/**
 * Default canvas state
 */
const defaultCanvas: Canvas = {
  id: 'default',
  name: 'Untitled Canvas',
  width: 1920,
  height: 1080,
  background: {
    type: 'color',
    value: '#ffffff',
  },
  elements: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Create the canvas context with default value
 */
const CanvasContext = createContext<CanvasContextValue | undefined>(undefined);

/**
 * Props for the CanvasProvider component
 */
interface CanvasProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the Canvas context
 * 
 * @param {CanvasProviderProps} props - The component props
 * @returns {JSX.Element} The provider component
 */
export function CanvasProvider({ children }: CanvasProviderProps): JSX.Element {
  const [canvas, setCanvas] = useState<Canvas>(defaultCanvas);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  /**
   * Add a new element to the canvas
   * 
   * @param {Omit<CanvasElement, 'id'>} element - The element to add (without ID)
   * @returns {string} The ID of the newly added element
   */
  const addElement = useCallback((element: Omit<CanvasElement, 'id'>): string => {
    const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement = { ...element, id } as CanvasElement;
    
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      elements: [...prevCanvas.elements, newElement],
      updatedAt: new Date(),
    }));
    
    return id;
  }, []);

  /**
   * Update an existing element on the canvas
   * 
   * @param {string} id - The ID of the element to update
   * @param {Partial<CanvasElement>} updates - The properties to update
   */
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>): void => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      elements: prevCanvas.elements.map(element => 
        element.id === id ? { ...element, ...updates } : element
      ),
      updatedAt: new Date(),
    }));
  }, []);

  /**
   * Remove an element from the canvas
   * 
   * @param {string} id - The ID of the element to remove
   */
  const removeElement = useCallback((id: string): void => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      elements: prevCanvas.elements.filter(element => element.id !== id),
      updatedAt: new Date(),
    }));
    
    // Also remove from selection if selected
    setSelectedElements(prev => prev.filter(elementId => elementId !== id));
  }, []);

  /**
   * Select an element on the canvas
   * 
   * @param {string} id - The ID of the element to select
   */
  const selectElement = useCallback((id: string): void => {
    setSelectedElements(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  /**
   * Deselect an element on the canvas
   * 
   * @param {string} id - The ID of the element to deselect
   */
  const deselectElement = useCallback((id: string): void => {
    setSelectedElements(prev => prev.filter(elementId => elementId !== id));
  }, []);

  /**
   * Clear all element selections
   */
  const clearSelection = useCallback((): void => {
    setSelectedElements([]);
  }, []);

  /**
   * Update canvas properties
   * 
   * @param {Partial<Canvas>} updates - The canvas properties to update
   */
  const updateCanvas = useCallback((updates: Partial<Canvas>): void => {
    setCanvas(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  }, []);

  // Create the context value object
  const value: CanvasContextValue = {
    canvas,
    selectedElements,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    deselectElement,
    clearSelection,
    updateCanvas,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

/**
 * Custom hook for accessing the canvas context
 * 
 * @returns {CanvasContextValue} The canvas context value
 * @throws {Error} If used outside of a CanvasProvider
 */
export function useCanvas(): CanvasContextValue {
  const context = useContext(CanvasContext);
  
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  
  return context;
}
