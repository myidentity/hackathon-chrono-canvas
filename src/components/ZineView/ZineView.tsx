/**
 * ZineView component for ChronoCanvas
 * 
 * This component provides a scroll-triggered viewing experience for the canvas content,
 * with parallax effects and animations.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { motion } from 'framer-motion';
import { calculateParallax } from '../Animation/AnimationUtils';

// Type definitions
interface ZineViewProps {
  className?: string;
}

/**
 * ZineView component for scroll-triggered viewing
 */
const ZineView: React.FC<ZineViewProps> = ({ className = '' }) => {
  const { canvas } = useCanvas();
  
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Ref for container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total scroll height based on content
  const totalScrollHeight = Math.max(
    2000,
    canvas.elements.reduce((max, element) => {
      return Math.max(max, element.position.y + element.size.height + 500);
    }, 0)
  );
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Render element with parallax effect
  const renderElement = (element: any) => {
    // Skip elements that don't have timeline data
    if (!element.timelineData) return null;
    
    // Calculate parallax factor (default to 0 if not specified)
    const parallaxFactor = element.parallaxFactor || 0;
    
    // Calculate visibility based on scroll position
    const isVisible = scrollPosition >= element.timelineData.entryPoint &&
      (element.timelineData.exitPoint === undefined || 
       element.timelineData.exitPoint === null || 
       scrollPosition <= element.timelineData.exitPoint || 
       element.timelineData.persist);
    
    if (!isVisible) return null;
    
    // Calculate opacity based on entry/exit points
    let opacity = 1;
    const entryTransitionRange = 200;
    const exitTransitionRange = 200;
    
    // Fade in near entry point
    if (scrollPosition < element.timelineData.entryPoint + entryTransitionRange) {
      const progress = (scrollPosition - element.timelineData.entryPoint) / entryTransitionRange;
      opacity = Math.max(0, Math.min(1, progress));
    }
    
    // Fade out near exit point (if not persistent)
    if (element.timelineData.exitPoint !== undefined && 
        element.timelineData.exitPoint !== null && 
        !element.timelineData.persist && 
        scrollPosition > element.timelineData.exitPoint - exitTransitionRange) {
      const progress = 1 - (scrollPosition - (element.timelineData.exitPoint - exitTransitionRange)) / exitTransitionRange;
      opacity = Math.max(0, Math.min(opacity, progress));
    }
    
    // Element style with parallax effect
    const style = {
      position: 'absolute' as const,
      left: `${element.position.x}px`,
      top: `${element.position.y + calculateParallax(scrollPosition, parallaxFactor)}px`,
      width: `${element.size.width}px`,
      height: `${element.size.height}px`,
      opacity,
      zIndex: element.position.z,
      transform: `rotate(${element.rotation}deg)`,
      transition: 'opacity 0.3s ease-out',
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
      <motion.div
        key={element.id}
        className="absolute"
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity, y: 0 }}
        transition={{ duration: 0.5 }}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {renderElementContent()}
      </motion.div>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: `${totalScrollHeight}px` }}
      data-testid="zine-view"
    >
      {/* Canvas background */}
      <div 
        className="fixed inset-0 w-full h-screen"
        style={{
          backgroundColor: canvas.background.type === 'color' 
            ? canvas.background.value 
            : 'transparent',
          backgroundImage: canvas.background.type === 'image'
            ? `url(${canvas.background.value})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      />
      
      {/* Render elements */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden">
        {canvas.elements.map(renderElement)}
      </div>
      
      {/* Scroll indicator (only visible at the top) */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollPosition > 100 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
      
      {/* Progress indicator */}
      <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
        <div className="h-1 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 dark:bg-indigo-500"
            style={{ width: `${(scrollPosition / totalScrollHeight) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ZineView;
