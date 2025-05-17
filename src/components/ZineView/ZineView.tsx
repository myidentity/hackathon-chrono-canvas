/**
 * ZineView component for ChronoCanvas
 * 
 * This component provides an interactive zine-like viewing experience with
 * scroll-triggered animations and parallax effects for elements.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';

interface ZineViewProps {
  mode?: 'editor' | 'timeline' | 'zine' | 'presentation';
}

/**
 * ZineView component
 * Provides a scroll-based interactive viewing experience for canvas elements
 * 
 * @param {ZineViewProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
const ZineView: React.FC<ZineViewProps> = ({ mode = 'zine' }) => {
  // Get canvas and timeline context
  const { canvas } = useCanvas();
  const { currentPosition, setPosition } = useTimeline();
  
  // State for scroll position and animation
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollHeight, setMaxScrollHeight] = useState(5000); // Default height
  const [visibleElements, setVisibleElements] = useState<string[]>([]);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  
  /**
   * Handle scroll events to update timeline position
   */
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const newScrollPosition = scrollTop;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    // Update scroll position state
    setScrollPosition(newScrollPosition);
    
    // Map scroll percentage to timeline position
    const timelinePosition = scrollPercentage * 60; // Assuming 60 seconds duration
    setPosition(timelinePosition);
    
    // Debug info
    console.log(`Scroll: ${scrollPercentage.toFixed(2)}, Timeline: ${timelinePosition.toFixed(2)}s`);
  };
  
  /**
   * Calculate element visibility based on timeline position
   */
  const calculateVisibleElements = () => {
    const visible: string[] = [];
    
    canvas.elements.forEach(element => {
      if (!element.timelineData) {
        // Elements without timeline data are always visible
        visible.push(element.id);
        return;
      }
      
      const { entryPoint, exitPoint, persist } = element.timelineData;
      
      // Check if element should be visible at current position
      let isVisible = true;
      
      // Check entry point
      if (entryPoint !== undefined && entryPoint !== null && currentPosition < entryPoint) {
        isVisible = false;
      }
      
      // Check exit point
      if (exitPoint !== undefined && exitPoint !== null && !persist && currentPosition > exitPoint) {
        isVisible = false;
      }
      
      if (isVisible) {
        visible.push(element.id);
      }
    });
    
    setVisibleElements(visible);
    console.log('Visible elements:', visible.length);
  };
  
  /**
   * Calculate element styles based on timeline position and scroll
   * 
   * @param {any} element - Canvas element
   * @returns {React.CSSProperties} CSS properties for the element
   */
  const getElementStyles = (element: any): React.CSSProperties => {
    // Base styles
    const styles: React.CSSProperties = {
      position: 'absolute',
      left: `${element.position.x}px`,
      top: `${element.position.y}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
      opacity: element.opacity !== undefined ? element.opacity : 1,
      zIndex: element.zIndex || 0,
      transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
    };
    
    // Apply keyframe interpolation if element has keyframes
    if (element.timelineData?.keyframes && element.timelineData.keyframes.length > 0) {
      const keyframes = [...element.timelineData.keyframes].sort((a, b) => a.time - b.time);
      
      // Find the keyframes that surround the current position
      const prevKeyframe = keyframes.filter(kf => kf.time <= currentPosition).pop();
      const nextKeyframe = keyframes.filter(kf => kf.time > currentPosition)[0];
      
      if (prevKeyframe && nextKeyframe) {
        // Interpolate between keyframes
        const progress = (currentPosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
        
        // Apply interpolated properties
        if (prevKeyframe.properties && nextKeyframe.properties) {
          // Handle position
          if (prevKeyframe.properties.position && nextKeyframe.properties.position) {
            const x = prevKeyframe.properties.position.x + (nextKeyframe.properties.position.x - prevKeyframe.properties.position.x) * progress;
            const y = prevKeyframe.properties.position.y + (nextKeyframe.properties.position.y - prevKeyframe.properties.position.y) * progress;
            styles.left = `${x}px`;
            styles.top = `${y}px`;
          }
          
          // Handle opacity
          if (typeof prevKeyframe.properties.opacity === 'number' && typeof nextKeyframe.properties.opacity === 'number') {
            styles.opacity = prevKeyframe.properties.opacity + (nextKeyframe.properties.opacity - prevKeyframe.properties.opacity) * progress;
          }
          
          // Handle rotation
          if (typeof prevKeyframe.properties.rotation === 'number' && typeof nextKeyframe.properties.rotation === 'number') {
            const rotation = prevKeyframe.properties.rotation + (nextKeyframe.properties.rotation - prevKeyframe.properties.rotation) * progress;
            styles.transform = `rotate(${rotation}deg)`;
          }
        }
      } else if (prevKeyframe && prevKeyframe.properties) {
        // Use properties from the last keyframe
        if (prevKeyframe.properties.position) {
          styles.left = `${prevKeyframe.properties.position.x}px`;
          styles.top = `${prevKeyframe.properties.position.y}px`;
        }
        
        if (typeof prevKeyframe.properties.opacity === 'number') {
          styles.opacity = prevKeyframe.properties.opacity;
        }
        
        if (typeof prevKeyframe.properties.rotation === 'number') {
          styles.transform = `rotate(${prevKeyframe.properties.rotation}deg)`;
        }
      }
    }
    
    // Add parallax effect based on element's z-index
    const parallaxFactor = ((element.zIndex || 0) + 10) / 20; // Range: 0.5 to 1.5
    const parallaxOffset = scrollPosition * parallaxFactor * 0.1;
    
    // Combine parallax with existing transform
    const existingTransform = styles.transform || '';
    styles.transform = `${existingTransform} translateY(${parallaxOffset}px)`;
    
    return styles;
  };
  
  /**
   * Render element based on its type
   * 
   * @param {any} element - Canvas element
   * @returns {JSX.Element} Rendered element
   */
  const renderElement = (element: any) => {
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
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>Unknown Element</p>
          </div>
        );
    }
  };
  
  // Update visible elements when timeline position changes
  useEffect(() => {
    calculateVisibleElements();
  }, [currentPosition, canvas.elements]);
  
  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate max scroll height based on timeline duration
  useEffect(() => {
    // Find the latest exit point in timeline data
    let maxTime = 60; // Default 60 seconds
    
    canvas.elements.forEach(element => {
      if (element.timelineData?.exitPoint && element.timelineData.exitPoint > maxTime) {
        maxTime = element.timelineData.exitPoint;
      }
    });
    
    // Set scroll height based on duration (100px per second)
    setMaxScrollHeight(maxTime * 100);
  }, [canvas.elements]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-y-auto"
      style={{ 
        backgroundColor: '#f8f9fa', // Default background
        scrollBehavior: 'smooth',
      }}
      data-testid="zine-view-container"
    >
      {/* Scrollable content */}
      <div 
        style={{ 
          height: `${maxScrollHeight}px`,
          position: 'relative',
        }}
        data-testid="zine-view-content"
      >
        {/* Render visible elements */}
        {canvas.elements
          .filter(element => visibleElements.includes(element.id))
          .map(element => (
            <div
              key={element.id}
              style={getElementStyles(element)}
              data-element-id={element.id}
              data-testid={`zine-element-${element.id}`}
            >
              {renderElement(element)}
            </div>
          ))
        }
        
        {/* Debug info */}
        <div className="fixed bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded text-sm">
          Scroll: {scrollPosition.toFixed(0)}px<br />
          Time: {currentPosition.toFixed(2)}s<br />
          Elements: {visibleElements.length}
        </div>
      </div>
    </div>
  );
};

export default ZineView;
