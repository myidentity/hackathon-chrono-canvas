/**
 * ZineView component for ChronoCanvas
 * 
 * This component implements the interactive zine viewer with scroll-triggered animations.
 * It transforms timeline-based content into a vertical scrolling experience.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import ElementRenderer from '../Canvas/ElementRenderer';

interface ZineViewProps {
  className?: string;
}

/**
 * ZineView component
 * Provides an interactive scroll-triggered animation experience
 */
const ZineView: React.FC<ZineViewProps> = ({ className = '' }) => {
  // Get canvas and timeline context
  const { canvas } = useCanvas();
  const { duration, setCurrentPosition } = useTimeline();
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mappedTimePosition, setMappedTimePosition] = useState(0);
  const [visibleElements, setVisibleElements] = useState<string[]>([]);
  
  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the total height based on duration (1 second = 100px)
  const totalHeight = Math.max(duration * 100, 2000);
  
  // Handle scroll events
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    setScrollPosition(scrollTop);
    
    // Map scroll position to timeline position
    // 1 second = 100px of scrolling
    const timePosition = scrollTop / 100;
    setMappedTimePosition(timePosition);
    
    // Update timeline context to sync with scroll position
    setCurrentPosition(timePosition);
    
    // Update visible elements based on mapped time position
    updateVisibleElements(timePosition);
  };
  
  // Update visible elements based on time position
  const updateVisibleElements = (timePosition: number) => {
    const visible: string[] = [];
    
    canvas.elements.forEach(element => {
      if (!element.timelineData) {
        // If no timeline data, always show in zine view
        visible.push(element.id);
        return;
      }
      
      const { entryPoint, exitPoint, persist } = element.timelineData;
      
      // Check if element should be visible at this time position
      const isVisible = 
        (entryPoint === undefined || timePosition >= entryPoint) && 
        (exitPoint === undefined || exitPoint === null || timePosition <= exitPoint || persist);
      
      if (isVisible) {
        visible.push(element.id);
      }
    });
    
    setVisibleElements(visible);
    
    // Debug log
    console.log('Visible elements at time', timePosition, ':', visible);
    console.log('Total elements:', canvas.elements.length);
  };
  
  // Initialize scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    
    // Initial scroll event to set up visible elements
    handleScroll();
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Update visible elements when canvas changes
  useEffect(() => {
    updateVisibleElements(mappedTimePosition);
    
    // Debug log
    console.log('Canvas elements:', canvas.elements);
  }, [canvas.elements]);
  
  // Force initial render of all elements for debugging
  const forceShowAll = true;
  
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full overflow-auto relative ${className}`}
      style={{ perspective: '1000px' }}
      data-testid="zine-view-container"
    >
      {/* Scrollable content */}
      <div 
        className="w-full relative"
        style={{ height: `${totalHeight}px` }}
        data-testid="zine-scrollable-content"
      >
        {/* Render elements */}
        {canvas.elements.map(element => {
          // For debugging, show all elements
          const isVisible = forceShowAll || visibleElements.includes(element.id);
          
          // Calculate animation progress for the element
          let animationProgress = 0;
          
          if (element.timelineData) {
            const { entryPoint, exitPoint, keyframes } = element.timelineData;
            
            if (keyframes && keyframes.length > 0) {
              // Find the keyframes that surround the current time
              const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
              
              // Find the previous and next keyframes
              const prevKeyframe = sortedKeyframes.filter(kf => kf.time <= mappedTimePosition).pop();
              const nextKeyframe = sortedKeyframes.filter(kf => kf.time > mappedTimePosition)[0];
              
              if (prevKeyframe && nextKeyframe) {
                // Interpolate between keyframes
                animationProgress = (mappedTimePosition - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
              } else if (prevKeyframe) {
                // At or after last keyframe
                animationProgress = 1;
              } else if (nextKeyframe) {
                // Before first keyframe
                animationProgress = 0;
              }
            } else if (entryPoint !== undefined) {
              // Simple entry animation (over 1 second)
              const entryDuration = 1; // 1 second entry animation
              if (mappedTimePosition >= entryPoint && mappedTimePosition <= entryPoint + entryDuration) {
                animationProgress = (mappedTimePosition - entryPoint) / entryDuration;
              } else if (mappedTimePosition > entryPoint + entryDuration) {
                animationProgress = 1;
              }
            }
          }
          
          // Position elements at different scroll positions
          const verticalOffset = element.timelineData?.entryPoint 
            ? element.timelineData.entryPoint * 100 
            : 0;
          
          const style = {
            position: 'absolute' as const,
            top: `${verticalOffset}px`,
            left: element.position?.x || '50%',
            transform: element.position?.x ? 'none' : 'translateX(-50%)',
            zIndex: element.zIndex || 0,
          };
          
          return (
            <div 
              key={element.id} 
              style={style}
              className={isVisible ? '' : 'opacity-0'}
              data-element-id={element.id}
            >
              <ElementRenderer
                element={element}
                isSelected={false}
                viewMode="zine"
                currentPosition={mappedTimePosition}
                scrollPosition={scrollPosition}
              />
            </div>
          );
        })}
        
        {/* Visual scroll markers */}
        <div className="absolute left-0 w-full border-t border-blue-500" style={{ top: '1000px' }}>
          <div className="bg-blue-500 text-white px-2 py-1 inline-block">10s</div>
        </div>
        <div className="absolute left-0 w-full border-t border-green-500" style={{ top: '2000px' }}>
          <div className="bg-green-500 text-white px-2 py-1 inline-block">20s</div>
        </div>
        <div className="absolute left-0 w-full border-t border-red-500" style={{ top: '3000px' }}>
          <div className="bg-red-500 text-white px-2 py-1 inline-block">30s</div>
        </div>
      </div>
      
      {/* Scroll position indicator */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-2 text-sm flex justify-between">
        <div>Scroll: {Math.round(scrollPosition)}px</div>
        <div>Time: {mappedTimePosition.toFixed(1)}s</div>
        <div>Elements: {visibleElements.length}/{canvas.elements.length}</div>
      </div>
    </div>
  );
};

export default ZineView;
