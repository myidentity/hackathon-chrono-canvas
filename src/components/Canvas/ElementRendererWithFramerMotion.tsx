import React, { useEffect } from 'react';
import { motion, useAnimation, AnimationControls } from 'framer-motion';
import { CanvasElement } from '../../types/CanvasElement';
import ShapeElement from './ShapeElement';
import TextElement from './TextElement';
import StickerElement from './StickerElement';
import ImageElement from './ImageElement';
import { ViewMode } from '../../types/ViewMode';
import { useTimeline } from '../../context/TimelineContext';

interface ElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  viewMode: ViewMode;
}

/**
 * ElementRenderer component using Framer Motion
 * Renders different types of canvas elements with animation support
 * 
 * @param {ElementRendererProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  viewMode
}) => {
  // Get timeline context
  const { currentPosition, keyframes } = useTimeline();
  
  // Animation controls from Framer Motion
  const controls = useAnimation();
  
  // Ensure element.properties exists to prevent errors
  const properties = element.properties || {};
  
  // Find keyframes for this element
  const elementKeyframes = keyframes.filter(kf => kf.elementId === element.id);
  
  // Update animation based on current timeline position
  useEffect(() => {
    if (elementKeyframes.length === 0) return;
    
    // Sort keyframes by time
    const sortedKeyframes = [...elementKeyframes].sort((a, b) => a.time - b.time);
    
    // Find keyframes surrounding current time
    const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= currentPosition).pop();
    const nextKeyframe = sortedKeyframes.filter(kf => kf.time > currentPosition)[0];
    
    let animationProps = {};
    
    // Handle different cases
    if (prevKeyframe && nextKeyframe) {
      // Between two keyframes - interpolate
      const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
      
      // Prepare animation properties
      animationProps = {
        x: prevKeyframe.properties.position?.x || 0,
        y: prevKeyframe.properties.position?.y || 0,
        rotate: prevKeyframe.properties.rotation || 0,
        opacity: prevKeyframe.properties.opacity !== undefined ? prevKeyframe.properties.opacity : 1,
        scale: 1, // Default scale
        transition: { duration: 0 } // Immediate for scrubbing
      };
      
      // Interpolate position if present in both keyframes
      if (prevKeyframe.properties.position && nextKeyframe.properties.position) {
        animationProps['x'] = prevKeyframe.properties.position.x + 
          (nextKeyframe.properties.position.x - prevKeyframe.properties.position.x) * progress;
        animationProps['y'] = prevKeyframe.properties.position.y + 
          (nextKeyframe.properties.position.y - prevKeyframe.properties.position.y) * progress;
      }
      
      // Interpolate size if present in both keyframes
      if (prevKeyframe.properties.size && nextKeyframe.properties.size) {
        const scaleX = (prevKeyframe.properties.size.width + 
          (nextKeyframe.properties.size.width - prevKeyframe.properties.size.width) * progress) / 
          (properties.size?.width || 100);
        const scaleY = (prevKeyframe.properties.size.height + 
          (nextKeyframe.properties.size.height - prevKeyframe.properties.size.height) * progress) / 
          (properties.size?.height || 100);
        animationProps['scaleX'] = scaleX;
        animationProps['scaleY'] = scaleY;
      }
      
      // Interpolate rotation if present in both keyframes
      if (prevKeyframe.properties.rotation !== undefined && nextKeyframe.properties.rotation !== undefined) {
        animationProps['rotate'] = prevKeyframe.properties.rotation + 
          (nextKeyframe.properties.rotation - prevKeyframe.properties.rotation) * progress;
      }
      
      // Interpolate opacity if present in both keyframes
      if (prevKeyframe.properties.opacity !== undefined && nextKeyframe.properties.opacity !== undefined) {
        animationProps['opacity'] = prevKeyframe.properties.opacity + 
          (nextKeyframe.properties.opacity - prevKeyframe.properties.opacity) * progress;
      }
    } else if (prevKeyframe) {
      // After last keyframe - use last keyframe properties
      animationProps = {
        x: prevKeyframe.properties.position?.x || 0,
        y: prevKeyframe.properties.position?.y || 0,
        rotate: prevKeyframe.properties.rotation || 0,
        opacity: prevKeyframe.properties.opacity !== undefined ? prevKeyframe.properties.opacity : 1,
        scaleX: prevKeyframe.properties.size ? 
          prevKeyframe.properties.size.width / (properties.size?.width || 100) : 1,
        scaleY: prevKeyframe.properties.size ? 
          prevKeyframe.properties.size.height / (properties.size?.height || 100) : 1,
        transition: { duration: 0 }
      };
    } else if (nextKeyframe) {
      // Before first keyframe - use first keyframe properties
      animationProps = {
        x: nextKeyframe.properties.position?.x || 0,
        y: nextKeyframe.properties.position?.y || 0,
        rotate: nextKeyframe.properties.rotation || 0,
        opacity: nextKeyframe.properties.opacity !== undefined ? nextKeyframe.properties.opacity : 1,
        scaleX: nextKeyframe.properties.size ? 
          nextKeyframe.properties.size.width / (properties.size?.width || 100) : 1,
        scaleY: nextKeyframe.properties.size ? 
          nextKeyframe.properties.size.height / (properties.size?.height || 100) : 1,
        transition: { duration: 0 }
      };
    }
    
    // Apply animation
    controls.start(animationProps);
    
  }, [element.id, elementKeyframes, currentPosition, controls, properties.size]);
  
  // Render the appropriate element type
  const renderElement = () => {
    switch (element.type) {
      case 'shape':
        return (
          <ShapeElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'text':
        return (
          <TextElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'sticker':
        return (
          <StickerElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      case 'image':
        return (
          <ImageElement 
            element={element} 
            isSelected={isSelected} 
            viewMode={viewMode}
          />
        );
      default:
        return null;
    }
  };
  
  // Default values for properties to prevent undefined errors
  const position = properties.position || { x: 0, y: 0 };
  const size = properties.size || { width: 100, height: 100 };
  const zIndex = properties.zIndex || 0;
  
  return (
    <motion.div
      animate={controls}
      initial={{
        x: position.x,
        y: position.y,
        rotate: properties.rotation || 0,
        opacity: properties.opacity !== undefined ? properties.opacity : 1
      }}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ 
        width: size.width,
        height: size.height,
        zIndex: zIndex,
        cursor: viewMode === 'editor' ? 'move' : 'default'
      }}
      data-element-id={element.id}
    >
      {renderElement()}
    </motion.div>
  );
};

export default ElementRenderer;
