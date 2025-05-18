/**
 * ElementRenderer component for ChronoCanvas
 * 
 * This component renders individual elements on the canvas with appropriate
 * animations and interactions based on the current mode and timeline position.
 */

import React, { useEffect, useState, useRef } from 'react';
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
  const { selectElement, removeElement, updateElementPosition } = useCanvas();
  const { isPlaying } = useTimeline();
  const [isVisible, setIsVisible] = useState(true);
  const [animatedProps, setAnimatedProps] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  
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
      
      // In presentation mode, make elements visible for demonstration
      if (viewMode === 'presentation') {
        // For demonstration, make all elements visible after a certain time
        if (currentPosition > 0) {
          visible = true;
        }
      }
      
      // Apply keyframe interpolation if element has keyframes
      if (keyframes && keyframes.length > 0 && visible) {
        // Find the keyframes that surround the current time
        const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
        
        // Find the previous and next keyframes
        const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= currentPosition).pop();
        const nextKeyframe = sortedKeyframes.filter(kf => kf.time > currentPosition)[0];
        
        if (prevKeyframe && nextKeyframe) {
          // Interpolate between keyframes
          const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
          
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
      } else if (visible) {
        // No keyframes or not visible, reset animated props
        
        // For presentation mode, add default animation properties if none exist
        if (viewMode === 'presentation' && !keyframes) {
          // Add some default animation based on element type
          const defaultProps = getDefaultAnimationProps(element, currentPosition);
          setAnimatedProps(defaultProps);
        } else {
          setAnimatedProps({});
        }
      }
      
      setIsVisible(visible);
    } else {
      // No timeline data, always visible
      setIsVisible(true);
      
      // For presentation mode, add default animation properties
      if (viewMode === 'presentation') {
        const defaultProps = getDefaultAnimationProps(element, currentPosition);
        setAnimatedProps(defaultProps);
      } else {
        setAnimatedProps({});
      }
    }
  }, [element, currentPosition, viewMode, isPlaying]);
  
  /**
   * Get default animation properties based on element type and current time
   */
  const getDefaultAnimationProps = (element: any, currentTime: number) => {
    // Default animation properties
    const defaultProps: any = {};
    
    // Different animation based on element type
    if (element.type === 'image') {
      // For images, scale and rotate based on time
      const scale = 0.8 + (Math.sin(currentTime * 0.5) * 0.2);
      const rotate = Math.sin(currentTime * 0.3) * 15; // -15 to 15 degrees
      
      defaultProps.scale = scale;
      defaultProps.rotate = rotate;
      defaultProps.opacity = 0.7 + (Math.sin(currentTime * 0.7) * 0.3);
    } else if (element.type === 'shape') {
      // For shapes, rotate and translate
      const translateX = Math.sin(currentTime * 0.4) * 50; // -50 to 50px
      const translateY = Math.cos(currentTime * 0.3) * 30; // -30 to 30px
      const rotate = currentTime * 30; // Continuous rotation
      
      defaultProps.translateX = translateX;
      defaultProps.translateY = translateY;
      defaultProps.rotate = rotate;
    } else if (element.type === 'text') {
      // For text, subtle scale and opacity changes
      const scale = 1 + (Math.sin(currentTime * 0.2) * 0.1);
      
      defaultProps.scale = scale;
      defaultProps.opacity = 0.8 + (Math.sin(currentTime * 0.5) * 0.2);
    }
    
    return defaultProps;
  };
  
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

  // Handle element removal
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMode === 'editor') {
      removeElement(element.id);
    }
  };
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode === 'editor') {
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      
      // Select the element when starting to drag
      if (onSelect) {
        onSelect();
      } else {
        selectElement(element.id);
      }
      
      // Add event listeners to document for mouse move and up
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && viewMode === 'editor') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Update element position
      updateElementPosition(element.id, deltaX, deltaY);
      
      // Update drag start position
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
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
        return renderShape(element);
      case 'symbol':
        return renderSymbol(element);
      case 'sticker':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="text-4xl"
              style={{
                fontSize: Math.min(element.size.width, element.size.height) * 0.6 + 'px'
              }}
            >
              {element.emoji || '🌟'}
            </div>
          </div>
        );
      default:
        // Default rendering for unknown element types
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-200">Unknown Element: {element.type}</p>
          </div>
        );
    }
  };

  // Render shape based on shape type
  const renderShape = (element: any) => {
    const shapeType = element.shape || 'rectangle';
    
    switch (shapeType) {
      case 'circle':
        return (
          <div 
            className="w-full h-full rounded-full" 
            style={{ backgroundColor: element.backgroundColor || '#6366F1' }}
          />
        );
      case 'triangle':
        return (
          <div className="w-full h-full relative">
            <div 
              style={{ 
                width: '0',
                height: '0',
                borderLeft: `${element.size.width / 2}px solid transparent`,
                borderRight: `${element.size.width / 2}px solid transparent`,
                borderBottom: `${element.size.height}px solid ${element.backgroundColor || '#6366F1'}`,
                position: 'absolute',
                top: '0',
                left: '0'
              }}
            />
          </div>
        );
      case 'star':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons" style={{ 
              fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
              color: element.backgroundColor || '#6366F1'
            }}>
              star
            </span>
          </div>
        );
      case 'hexagon':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons" style={{ 
              fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
              color: element.backgroundColor || '#6366F1'
            }}>
              hexagon
            </span>
          </div>
        );
      case 'pentagon':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons" style={{ 
              fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
              color: element.backgroundColor || '#6366F1'
            }}>
              pentagon
            </span>
          </div>
        );
      case 'diamond':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              style={{ 
                width: '70%',
                height: '70%',
                backgroundColor: element.backgroundColor || '#6366F1',
                transform: 'rotate(45deg)'
              }}
            />
          </div>
        );
      case 'arrow':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-icons" style={{ 
              fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
              color: element.backgroundColor || '#6366F1'
            }}>
              arrow_forward
            </span>
          </div>
        );
      case 'rectangle':
      default:
        return (
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundColor: element.backgroundColor || '#6366F1',
              borderRadius: element.borderRadius || '0',
            }}
          />
        );
    }
  };

  // Render symbol based on symbol type
  const renderSymbol = (element: any) => {
    const symbolType = element.shape || 'heart';
    let iconName = 'favorite'; // default heart icon
    
    switch (symbolType) {
      case 'heart':
        iconName = 'favorite';
        break;
      case 'cloud':
        iconName = 'cloud';
        break;
      case 'lightning':
        iconName = 'bolt';
        break;
      case 'music':
        iconName = 'music_note';
        break;
      case 'check':
        iconName = 'check_circle';
        break;
      case 'cross':
        iconName = 'cancel';
        break;
      case 'plus':
        iconName = 'add_circle';
        break;
      case 'minus':
        iconName = 'remove_circle';
        break;
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="material-icons" style={{ 
          fontSize: `${Math.min(element.size.width, element.size.height) * 0.8}px`,
          color: element.backgroundColor || '#6366F1'
        }}>
          {iconName}
        </span>
      </div>
    );
  };
  
  // For debugging: show element ID and timeline data
  const debugInfo = () => {
    if (viewMode === 'editor' || viewMode === 'timeline') {
      return (
        <div className="absolute -top-6 left-0 text-xs bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 px-1 rounded text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
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
      cursor: viewMode === 'editor' ? 'move' : 'default',
    };
    
    // Base transform from element properties
    let baseTransform = `rotate(${element.rotation || 0}deg)`;
    
    // Apply animated properties for timeline, zine, and presentation modes
    if ((viewMode === 'timeline' || viewMode === 'zine' || viewMode === 'presentation') && Object.keys(animatedProps).length > 0) {
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
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={getAnimationStyles()}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => viewMode === 'editor' && setIsHovered(true)}
      onMouseLeave={() => viewMode === 'editor' && setIsHovered(false)}
      data-element-id={element.id}
    >
      {renderElement()}
      {debugInfo()}
      
      {/* X button for removing elements - only visible on hover in editor mode */}
      {viewMode === 'editor' && isHovered && (
        <button
          className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md z-50"
          onClick={handleRemove}
          title="Remove element"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      )}
    </div>
  );
};

export default ElementRenderer;
