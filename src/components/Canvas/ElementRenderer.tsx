/**
 * ElementRenderer component for ChronoCanvas
 * 
 * This component renders individual elements on the canvas with appropriate
 * animations and interactions based on the current mode and timeline position.
 */

import React, { useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';

interface ElementRendererProps {
  element: any;
  isSelected: boolean;
  mode: 'editor' | 'timeline' | 'zine' | 'presentation';
  currentTime: number;
}

/**
 * ElementRenderer component
 * Renders a single element with appropriate styling and animations
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  mode,
  currentTime 
}) => {
  const { selectElement } = useCanvas();
  const { isPlaying } = useTimeline();
  const [isVisible, setIsVisible] = useState(true);
  const [animatedProps, setAnimatedProps] = useState({});
  
  // Determine element visibility and properties based on timeline data
  useEffect(() => {
    // Always visible in editor mode
    if (mode === 'editor') {
      setIsVisible(true);
      return;
    }
    
    // Check timeline data for visibility in other modes
    if (element.timelineData) {
      const { entryPoint, exitPoint, persist, keyframes } = element.timelineData;
      
      // Determine visibility based on entry/exit points
      let visible = true;
      
      // Check if current time is before entry point
      if (entryPoint !== undefined && entryPoint !== null && currentTime < entryPoint) {
        visible = false;
      }
      
      // Check if current time is after exit point and element doesn't persist
      if (exitPoint !== undefined && exitPoint !== null && !persist && currentTime > exitPoint) {
        visible = false;
      }
      
      // Apply keyframe interpolation if element has keyframes
      if (keyframes && keyframes.length > 0 && visible) {
        // Find the keyframes that surround the current time
        const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
        
        // Find the previous and next keyframes
        const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= currentTime).pop();
        const nextKeyframe = sortedKeyframes.filter(kf => kf.time > currentTime)[0];
        
        if (prevKeyframe && nextKeyframe) {
          // Interpolate between keyframes
          const progress = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
          
          // Apply interpolated properties
          const interpolatedProps = interpolateProperties(prevKeyframe.properties, nextKeyframe.properties, progress);
          setAnimatedProps(interpolatedProps);
        } else if (prevKeyframe) {
          // Use properties from the last keyframe
          setAnimatedProps(prevKeyframe.properties);
        } else if (nextKeyframe) {
          // Use properties from the first keyframe
          setAnimatedProps(nextKeyframe.properties);
        }
      }
      
      setIsVisible(visible);
    } else {
      // No timeline data, always visible
      setIsVisible(true);
    }
  }, [element, currentTime, mode, isPlaying]);
  
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
  
  // Handle element selection
  const handleClick = (e: React.MouseEvent) => {
    if (mode === 'editor') {
      e.stopPropagation();
      selectElement(element.id);
    }
  };
  
  // Skip rendering if element is not visible in current mode
  if (!isVisible && mode !== 'editor') {
    return null;
  }
  
  // Apply element type-specific rendering
  const renderElement = () => {
    switch (element.type) {
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src || 'https://via.placeholder.com/150'} 
              alt={element.alt || 'Image'} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <p style={{ 
              fontSize: element.fontSize || '16px',
              fontWeight: element.fontWeight || 'normal',
              color: element.color || '#000',
              textAlign: element.textAlign || 'center',
            }}>
              {element.content || 'Text Element'}
            </p>
          </div>
        );
      case 'shape':
        return (
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundColor: element.backgroundColor || '#6366F1',
              borderRadius: element.shape === 'circle' ? '50%' : (element.borderRadius || '0'),
            }}
          />
        );
      default:
        // Default rendering for unknown element types
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>Unknown Element</p>
          </div>
        );
    }
  };
  
  // For debugging: show element ID and timeline data
  const debugInfo = () => {
    if (mode === 'editor' || mode === 'timeline') {
      return (
        <div className="absolute -top-6 left-0 text-xs bg-white bg-opacity-80 px-1 rounded">
          ID: {element.id.substring(0, 4)}
          {element.timelineData && (
            <>
              {element.timelineData.entryPoint !== undefined && 
                ` | In: ${element.timelineData.entryPoint}s`}
              {element.timelineData.exitPoint !== undefined && 
                ` | Out: ${element.timelineData.exitPoint}s`}
            </>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Calculate animation styles based on mode and animated properties
  const getAnimationStyles = () => {
    // Base styles from element
    const baseStyles = {
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
      opacity: element.opacity !== undefined ? element.opacity : 1,
      zIndex: element.zIndex || 0,
    };
    
    // Apply animated properties for timeline and zine modes
    if ((mode === 'timeline' || mode === 'zine' || mode === 'presentation') && Object.keys(animatedProps).length > 0) {
      return {
        ...baseStyles,
        ...animatedProps,
        transition: isPlaying ? 'all 0.1s linear' : 'none',
      };
    }
    
    // Add animation for zine view mode
    if (mode === 'zine') {
      return {
        ...baseStyles,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
      };
    }
    
    return baseStyles;
  };
  
  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={getAnimationStyles()}
      onClick={handleClick}
      data-element-id={element.id}
    >
      {renderElement()}
      {debugInfo()}
    </div>
  );
};

export default ElementRenderer;
