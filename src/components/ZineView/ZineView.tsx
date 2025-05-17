/**
 * ZineView component for ChronoCanvas.
 * 
 * This component provides a scroll-triggered zine-like viewing experience
 * for the canvas content, with parallax effects and animations.
 * 
 * @module ZineView
 */

import { useState, useEffect, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { useTimeline } from '../../context/TimelineContext';
import AnimatedElement from '../Animation/AnimatedElement';
import { calculateParallax } from '../Animation/AnimationUtils';

/**
 * Props for the ZineView component
 */
interface ZineViewProps {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * ZineView component that renders a scroll-triggered view of the canvas
 * 
 * @param {ZineViewProps} props - The component props
 * @returns {JSX.Element} The rendered ZineView component
 */
function ZineView({ className }: ZineViewProps): JSX.Element {
  // Get canvas and timeline context
  const { canvas } = useCanvas();
  const { duration, setCurrentPosition } = useTimeline();
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  
  // Reference to the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the total scroll height based on timeline duration
  // This creates a relationship between scroll position and timeline position
  const totalScrollHeight = duration * 100; // 100px per second of timeline
  
  /**
   * Handle scroll events
   */
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      setScrollPosition(scrollTop);
      
      // Map scroll position to timeline position
      const timelinePosition = (scrollTop / totalScrollHeight) * duration;
      setCurrentPosition(Math.min(timelinePosition, duration));
    }
  };
  
  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [duration]);
  
  // Sort elements by z-index for proper layering
  const sortedElements = [...canvas.elements].sort((a, b) => a.position.z - b.position.z);
  
  return (
    <div 
      ref={containerRef}
      className={`w-full h-full overflow-y-auto ${className || ''}`}
      style={{ perspective: '1000px' }}
    >
      {/* Scrollable content container */}
      <div 
        style={{ 
          height: `${totalScrollHeight}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div 
          className="fixed inset-0 w-full h-full"
          style={{ 
            backgroundColor: canvas.background.type === 'color' ? canvas.background.value : 'transparent',
            backgroundImage: canvas.background.type === 'gradient' ? canvas.background.value : 'none',
          }}
        />
        
        {/* Canvas elements */}
        {sortedElements.map(element => {
          // Calculate parallax factor based on z position
          // Elements with higher z values move slower (less parallax)
          const parallaxFactor = 1 - (element.position.z / 10);
          
          // Render the element with animation
          return (
            <AnimatedElement
              key={element.id}
              id={element.id}
              entryPoint={element.timelineData.entryPoint}
              exitPoint={element.timelineData.exitPoint}
              persist={element.timelineData.persist}
              viewMode="zine"
              scrollPosition={scrollPosition}
              parallaxFactor={parallaxFactor}
              style={{
                position: 'absolute',
                left: `${element.position.x}px`,
                top: `${element.position.y + calculateParallax(scrollPosition, parallaxFactor, totalScrollHeight)}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                opacity: element.opacity,
                zIndex: element.position.z,
              }}
            >
              {/* Placeholder for element content - will be replaced with actual element renderer */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                {element.type}
              </div>
            </AnimatedElement>
          );
        })}
        
        {/* Section markers for visual guidance */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {Array.from({ length: Math.ceil(duration / 10) }).map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                scrollPosition > index * 1000 ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              title={`Section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ZineView;
