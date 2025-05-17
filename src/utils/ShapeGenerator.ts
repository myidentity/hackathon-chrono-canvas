/**
 * ShapeGenerator utility for ChronoCanvas
 * 
 * This utility provides functions to generate various shapes, polygons, and symbols
 * for populating the canvas with diverse visual elements.
 */

import { v4 as uuidv4 } from 'uuid';

// Shape types
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon' | 'pentagon' | 'diamond' | 'arrow';

// Symbol types
export type SymbolType = 'heart' | 'cloud' | 'lightning' | 'music' | 'check' | 'cross' | 'plus' | 'minus';

// Element interface
export interface CanvasElement {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation?: number;
  backgroundColor?: string;
  borderRadius?: string;
  shape?: string;
  opacity?: number;
  zIndex?: number;
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

/**
 * Generate a random color
 */
export const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD166', // Yellow
    '#6B5CA5', // Purple
    '#72B01D', // Green
    '#3A86FF', // Blue
    '#FF9F1C', // Orange
    '#F72585', // Pink
    '#7209B7', // Violet
    '#4CC9F0', // Light Blue
    '#2EC4B6', // Turquoise
    '#E71D36', // Bright Red
    '#FF9F1C', // Amber
    '#8338EC', // Indigo
    '#06D6A0', // Mint
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Generate a random position within canvas bounds
 */
export const getRandomPosition = (canvasWidth: number, canvasHeight: number): { x: number; y: number } => {
  // Keep elements within 80% of canvas to avoid edge clipping
  const margin = 0.1;
  const x = Math.floor(canvasWidth * margin + Math.random() * canvasWidth * (1 - 2 * margin));
  const y = Math.floor(canvasHeight * margin + Math.random() * canvasHeight * (1 - 2 * margin));
  
  return { x, y };
};

/**
 * Generate a random size appropriate for the element type
 */
export const getRandomSize = (elementType: string): { width: number; height: number } => {
  let minSize = 50;
  let maxSize = 150;
  
  if (elementType === 'shape') {
    minSize = 30;
    maxSize = 120;
  } else if (elementType === 'symbol') {
    minSize = 40;
    maxSize = 100;
  }
  
  const width = Math.floor(minSize + Math.random() * (maxSize - minSize));
  
  // For some shapes, maintain aspect ratio
  let height = width;
  if (Math.random() > 0.7) {
    height = Math.floor(minSize + Math.random() * (maxSize - minSize));
  }
  
  return { width, height };
};

/**
 * Generate random timeline data with keyframes
 */
export const getRandomTimelineData = (duration: number = 60): any => {
  // Random entry and exit points
  const entryPoint = Math.floor(Math.random() * (duration / 2));
  const exitPoint = Math.floor(duration / 2 + Math.random() * (duration / 2));
  const persist = Math.random() > 0.3; // 70% chance to persist
  
  // Generate 2-4 keyframes
  const keyframeCount = 2 + Math.floor(Math.random() * 3);
  const keyframes = [];
  
  for (let i = 0; i < keyframeCount; i++) {
    // Distribute keyframes evenly across the timeline
    const time = entryPoint + (i * (exitPoint - entryPoint)) / (keyframeCount - 1);
    
    // Generate random properties for this keyframe
    const properties: any = {};
    
    // Movement (translation)
    if (Math.random() > 0.5) {
      properties.translateX = Math.floor(Math.random() * 200 - 100);
    }
    
    if (Math.random() > 0.5) {
      properties.translateY = Math.floor(Math.random() * 200 - 100);
    }
    
    // Rotation
    if (Math.random() > 0.5) {
      properties.rotate = Math.floor(Math.random() * 360);
    }
    
    // Scaling
    if (Math.random() > 0.5) {
      properties.scale = 0.5 + Math.random() * 1.5;
    }
    
    // Opacity
    if (Math.random() > 0.5) {
      properties.opacity = 0.3 + Math.random() * 0.7;
    }
    
    keyframes.push({
      time,
      properties,
    });
  }
  
  return {
    entryPoint,
    exitPoint,
    persist,
    keyframes,
  };
};

/**
 * Create a basic shape element
 */
export const createShapeElement = (
  shapeType: ShapeType,
  canvasWidth: number,
  canvasHeight: number
): CanvasElement => {
  const id = `shape_${shapeType}_${uuidv4().substring(0, 8)}`;
  const position = getRandomPosition(canvasWidth, canvasHeight);
  const size = getRandomSize('shape');
  const backgroundColor = getRandomColor();
  const rotation = Math.floor(Math.random() * 360);
  const opacity = 0.7 + Math.random() * 0.3;
  const zIndex = Math.floor(Math.random() * 10);
  
  let borderRadius = '0';
  if (shapeType === 'rectangle' && Math.random() > 0.5) {
    // Rounded rectangle
    borderRadius = `${Math.floor(5 + Math.random() * 15)}px`;
  }
  
  return {
    id,
    type: 'shape',
    position,
    size,
    rotation,
    backgroundColor,
    borderRadius,
    shape: shapeType,
    opacity,
    zIndex,
    timelineData: getRandomTimelineData(),
  };
};

/**
 * Create a symbol element
 */
export const createSymbolElement = (
  symbolType: SymbolType,
  canvasWidth: number,
  canvasHeight: number
): CanvasElement => {
  const id = `symbol_${symbolType}_${uuidv4().substring(0, 8)}`;
  const position = getRandomPosition(canvasWidth, canvasHeight);
  const size = getRandomSize('symbol');
  const backgroundColor = getRandomColor();
  const rotation = Math.floor(Math.random() * 360);
  const opacity = 0.7 + Math.random() * 0.3;
  const zIndex = Math.floor(Math.random() * 10);
  
  return {
    id,
    type: 'symbol',
    position,
    size,
    rotation,
    backgroundColor,
    shape: symbolType,
    opacity,
    zIndex,
    timelineData: getRandomTimelineData(),
  };
};

/**
 * Generate a collection of random shapes and symbols
 */
export const generateRandomElements = (
  count: number,
  canvasWidth: number,
  canvasHeight: number
): CanvasElement[] => {
  const elements: CanvasElement[] = [];
  
  // Available shape types
  const shapeTypes: ShapeType[] = [
    'rectangle',
    'circle',
    'triangle',
    'star',
    'hexagon',
    'pentagon',
    'diamond',
    'arrow',
  ];
  
  // Available symbol types
  const symbolTypes: SymbolType[] = [
    'heart',
    'cloud',
    'lightning',
    'music',
    'check',
    'cross',
    'plus',
    'minus',
  ];
  
  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.5) {
      // Create a shape
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      elements.push(createShapeElement(shapeType, canvasWidth, canvasHeight));
    } else {
      // Create a symbol
      const symbolType = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
      elements.push(createSymbolElement(symbolType, canvasWidth, canvasHeight));
    }
  }
  
  return elements;
};

export default {
  getRandomColor,
  getRandomPosition,
  getRandomSize,
  getRandomTimelineData,
  createShapeElement,
  createSymbolElement,
  generateRandomElements,
};
