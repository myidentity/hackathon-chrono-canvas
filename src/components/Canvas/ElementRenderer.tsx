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
  viewMode: 'editor' | 'timeline' | 'zine' | 'presentation';
  currentPosition: number;
  scrollPosition?: number;
  onSelect?: () => void;
}

/**
 * ElementRenderer component
 * Renders a single element with appropriate styling and animations
 */
const ElementRenderer: React.FC<ElementRendererProps> = ({ 
  element, 
  isSelected, 
  viewMode,
  currentPosition,
  scrollPosition = 0,
  onSelect
}) => {
  const { selectElement } = useCanvas();
  const { isPlaying } = useTimeline();
  const [isVisible, setIsVisible] = useState(true);
  const [animatedProps, setAnimatedProps] = useState({});
  
  // Determine element visibility and properties based on timeline data
  useEffect(() => {
    // Always visible in editor mode
    if (viewMode === 'editor') {
      setIsVisible(true);
      return;
    }
    
    // Check timeline data for visibility in other modes
    if (element.timelineData) {
      const { entryPoint, exitPoint, persist, keyframes } = element.timelineData;
      
      // Determine visibility based on entry/exit points
      let visible = true;
      
      // Check if current time is before entry point
      if (entryPoint !== undefined && entryPoint !== null && currentPosition < entryPoint) {
        visible = false;
      }
      
      // Check if current time is after exit point and element doesn't persist
      if (exitPoint !== undefined && exitPoint !== null && !persist && currentPosition > exitPoint) {
        visible = false;
      }
      
      // Apply keyframe interpolation if element has keyframes
      if (keyframes && keyframes.length > 0 && visible) {
        // Find the keyframes that surround the current time
        const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
        
        // Find the previous and next keyframes
        const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= currentPosition).pop();
        const nextKeyframe = sortedKeyframes.filter(kf => kf.time > currentPosition)[0];
        
        // Debug log for keyframe calculation
        console.log(`Element ${element.id} at time ${currentPosition}:`, { 
          prevKeyframe, 
          nextKeyframe,
          visible
        });
        
        if (prevKeyframe && nextKeyframe) {
          // Interpolate between keyframes
          const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
          
          // Apply interpolated properties
          const interpolatedProps = interpolateProperties(prevKeyframe.properties, nextKeyframe.properties, progress);
          setAnimatedProps(interpolatedProps);
          
          // Debug log for interpolation
          console.log(`Interpolating element ${element.id}:`, {
            progress,
            interpolatedProps
          });
        } else if (prevKeyframe) {
          // Use properties from the last keyframe
          setAnimatedProps(prevKeyframe.properties);
          console.log(`Using last keyframe for element ${element.id}:`, prevKeyframe.properties);
        } else if (nextKeyframe) {
          // Use properties from the first keyframe
          setAnimatedProps(nextKeyframe.properties);
          console.log(`Using first keyframe for element ${element.id}:`, nextKeyframe.properties);
        }
      } else if (visible) {
        // No keyframes or not visible, reset animated props
        console.log(`Element ${element.id} visible but no keyframes applied`);
        setAnimatedProps({});
      }
      
      setIsVisible(visible);
    } else {
      // No timeline data, always visible
      setIsVisible(true);
      setAnimatedProps({});
    }
  }, [element, currentPosition, viewMode, isPlaying]);
  
  /**
   * Interpolate between two sets of properties
   */
  const interpolateProperties = (prevProps: any, nextProps: any, progress: number) => {
    const result: any = { ...prevProps };
    
    // Interpolate numeric properties
    Object.keys(nextProps).forEach(key => {
      if (typeof prevProps[key] === 'number' && typeof nextProps[key] === 'number') {
        result[key] = prevProps[key] + (nextProps[key] - prevProps[key]) * progress;
      } else if (nextProps[key] !== undefined && prevProps[key] === undefined) {
        // Handle case where property exists in next but not in prev
        if (typeof nextProps[key] === 'number') {
          result[key] = nextProps[key] * progress;
        } else {
          result[key] = nextProps[key];
        }
      }
    });
    
    return result;
  };
  
  // Handle element selection
  const handleClick = (e: React.MouseEvent) => {
    if (viewMode === 'editor') {
      e.stopPropagation();
      if (onSelect) {
        onSelect();
      } else {
        selectElement(element.id);
      }
    }
  };
  
  // Skip rendering if element is not visible in current mode
  if (!isVisible && viewMode !== 'editor') {
    return null;
  }
  
  // Apply element type-specific rendering
  const renderElement = () => {
    switch (element.type) {
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={element.src || `/images/sample_image_${element.id.includes('1') ? '1' : '2'}.jpg`} 
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
    if (viewMode === 'editor' || viewMode === 'timeline') {
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
  
  // Generate CSS transform string from transform properties
  const generateTransform = (props: any) => {
    const transformParts: string[] = [];
    
    // Handle translation (movement)
    if (props.translateX !== undefined) {
      transformParts.push(`translateX(${props.translateX}px)`);
    }
    
    if (props.translateY !== undefined) {
      transformParts.push(`translateY(${props.translateY}px)`);
    }
    
    // Handle scaling
    if (props.scale !== undefined) {
      transformParts.push(`scale(${props.scale})`);
    } else if (props.scaleX !== undefined || props.scaleY !== undefined) {
      const scaleX = props.scaleX !== undefined ? props.scaleX : 1;
      const scaleY = props.scaleY !== undefined ? props.scaleY : 1;
      transformParts.push(`scale(${scaleX}, ${scaleY})`);
    }
    
    // Handle rotation (in degrees)
    if (props.rotate !== undefined) {
      transformParts.push(`rotate(${props.rotate}deg)`);
    } else if (props.rotation !== undefined) {
      transformParts.push(`rotate(${props.rotation}deg)`);
    }
    
    // Handle 3D rotations if needed
    if (props.rotateX !== undefined) {
      transformParts.push(`rotateX(${props.rotateX}deg)`);
    }
    
    if (props.rotateY !== undefined) {
      transformParts.push(`rotateY(${props.rotateY}deg)`);
    }
    
    if (props.rotateZ !== undefined) {
      transformParts.push(`rotateZ(${props.rotateZ}deg)`);
    }
    
    return transformParts.join(' ');
  };
  
  // Calculate animation styles based on viewMode and animated properties
  const getAnimationStyles = () => {
    // Base styles from element
    const baseStyles: React.CSSProperties = {
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      opacity: element.opacity !== undefined ? element.opacity : 1,
      zIndex: element.zIndex || 0,
    };
    
    // Base transform from element properties
    let baseTransform = `rotate(${element.rotation || 0}deg)`;
    
    // Apply animated properties for timeline, zine, and presentation modes
    if ((viewMode === 'timeline' || viewMode === 'zine' || viewMode === 'presentation') && Object.keys(animatedProps).length > 0) {
      // Debug log to verify animation props are being applied
      console.log('Applying animated props for element:', element.id, animatedProps);
      
      // Extract transform-related properties
      const transformProps: any = {};
      const otherProps: any = {};
      
      // Separate transform properties from other properties
      Object.keys(animatedProps).forEach(key => {
        if (['translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotation', 'rotateX', 'rotateY', 'rotateZ'].includes(key)) {
          transformProps[key] = animatedProps[key];
        } else {
          otherProps[key] = animatedProps[key];
        }
      });
      
      // Generate transform string
      const animatedTransform = generateTransform(transformProps);
      
      // Combine base transform with animated transform
      const combinedTransform = animatedTransform ? animatedTransform : baseTransform;
      
      return {
        ...baseStyles,
        ...otherProps,
        transform: combinedTransform,
        transition: isPlaying ? 'all 0.1s linear' : 'none',
      };
    }
    
    // Add animation for zine view mode
    if (viewMode === 'zine') {
      return {
        ...baseStyles,
        transform: baseTransform,
        transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
      };
    }
    
    // Default styles for editor mode
    return {
      ...baseStyles,
      transform: baseTransform,
    };
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
