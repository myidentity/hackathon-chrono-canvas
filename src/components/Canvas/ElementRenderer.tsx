/**
 * ElementRenderer component for ChronoCanvas
 * 
 * This component renders individual elements on the canvas with appropriate
 * styling, animations, and interaction handlers.
 */

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedElement from '../Animation/AnimatedElement';

// Type definitions
export interface ElementRendererProps {
  element: any; // Canvas element object
  isSelected: boolean;
  viewMode: 'editor' | 'timeline' | 'zine' | 'presentation';
  currentPosition: number;
  scrollPosition: number;
  onSelect: () => void;
}

/**
 * ElementRenderer component for rendering canvas elements
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  viewMode,
  scrollPosition,
  onSelect,
}) => {
  // Generate element style based on properties
  const getElementStyle = () => {
    return {
      position: 'absolute' as const,
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      zIndex: element.position.z,
      opacity: element.opacity,
      transform: `rotate(${element.rotation}deg)`,
    };
  };
  
  // Render element content based on type
  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              color: element.properties.color || '#000000',
              fontFamily: element.properties.fontFamily || 'Arial',
              fontSize: `${element.properties.fontSize || 16}px`,
              fontWeight: element.properties.fontWeight || 'normal',
              textAlign: element.properties.textAlign || 'center',
            }}
          >
            {element.properties.text || 'Text Element'}
          </div>
        );
      
      case 'image':
        return (
          <img
            src={element.properties.src || 'https://via.placeholder.com/150'}
            alt={element.properties.alt || 'Image Element'}
            className="w-full h-full"
            style={{
              objectFit: element.properties.objectFit || 'cover',
            }}
          />
        );
      
      case 'shape':
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: element.properties.fillColor || '#3b82f6',
              border: element.properties.strokeWidth 
                ? `${element.properties.strokeWidth}px solid ${element.properties.strokeColor || '#000000'}`
                : 'none',
              borderRadius: element.properties.shapeType === 'circle' ? '50%' : '0',
            }}
          />
        );
      
      case 'sticker':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={`/stickers/${element.properties.stickerType}/${element.properties.stickerName}.svg`}
              alt={element.properties.stickerName || 'Sticker'}
              className="w-full h-full"
            />
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            Unknown Element Type
          </div>
        );
    }
  };
  
  return (
    <AnimatedElement
      id={element.id}
      entryPoint={element.timelineData.entryPoint}
      exitPoint={element.timelineData.exitPoint}
      persist={element.timelineData.persist}
      viewMode={viewMode}
      scrollPosition={scrollPosition}
      parallaxFactor={element.parallaxFactor || 0}
    >
      <motion.div
        className={`absolute ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
        style={getElementStyle()}
        whileHover={viewMode === 'editor' ? { scale: 1.02 } : {}}
        onClick={(e) => {
          if (viewMode === 'editor') {
            e.stopPropagation();
            onSelect();
          }
        }}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {renderElementContent()}
        
        {/* Resize handles (only in editor mode and when selected) */}
        {viewMode === 'editor' && isSelected && (
          <>
            {/* Corner resize handles */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nesw-resize" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-indigo-500 rounded-full cursor-nwse-resize" />
            
            {/* Edge resize handles */}
            <div className="absolute top-1/2 -left-1 w-3 h-3 -mt-1.5 bg-white border border-indigo-500 rounded-full cursor-ew-resize" />
            <div className="absolute top-1/2 -right-1 w-3 h-3 -mt-1.5 bg-white border border-indigo-500 rounded-full cursor-ew-resize" />
            <div className="absolute -top-1 left-1/2 w-3 h-3 -ml-1.5 bg-white border border-indigo-500 rounded-full cursor-ns-resize" />
            <div className="absolute -bottom-1 left-1/2 w-3 h-3 -ml-1.5 bg-white border border-indigo-500 rounded-full cursor-ns-resize" />
            
            {/* Rotation handle */}
            <div className="absolute -top-8 left-1/2 w-3 h-3 -ml-1.5 bg-white border border-indigo-500 rounded-full cursor-move">
              <div className="absolute top-full left-1/2 w-0.5 h-5 -ml-0.25 bg-indigo-500" />
            </div>
          </>
        )}
      </motion.div>
    </AnimatedElement>
  );
};

export default ElementRenderer;
