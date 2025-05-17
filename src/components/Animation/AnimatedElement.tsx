/**
 * AnimatedElement component for ChronoCanvas.
 * 
 * This component wraps canvas elements with animation capabilities,
 * handling both timeline-based and scroll-triggered animations.
 * 
 * @module AnimatedElement
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { useTimeline } from '../../context/TimelineContext';
import { interpolate, generateTransform, Easing } from './AnimationUtils';

/**
 * Props for the AnimatedElement component
 */
interface AnimatedElementProps {
  /**
   * The unique ID of the element
   */
  id: string;
  
  /**
   * The children to render inside the animated element
   */
  children: ReactNode;
  
  /**
   * The timeline entry point in seconds
   */
  entryPoint: number;
  
  /**
   * The timeline exit point in seconds (null for no exit)
   */
  exitPoint: number | null;
  
  /**
   * Whether the element persists after its timeline point
   */
  persist: boolean;
  
  /**
   * The animation type for entry
   */
  entryAnimation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'none';
  
  /**
   * The animation type for exit
   */
  exitAnimation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'flip' | 'none';
  
  /**
   * The duration of the entry animation in seconds
   */
  entryDuration?: number;
  
  /**
   * The duration of the exit animation in seconds
   */
  exitDuration?: number;
  
  /**
   * The easing function for the entry animation
   */
  entryEasing?: keyof typeof Easing;
  
  /**
   * The easing function for the exit animation
   */
  exitEasing?: keyof typeof Easing;
  
  /**
   * The view mode of the application
   */
  viewMode: 'editor' | 'timeline' | 'presentation' | 'zine';
  
  /**
   * The scroll position (for zine mode)
   */
  scrollPosition?: number;
  
  /**
   * The parallax factor (0-1) for scroll-based movement
   */
  parallaxFactor?: number;
  
  /**
   * Additional style properties
   */
  style?: React.CSSProperties;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Callback function when clicked
   */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * AnimatedElement component that provides animation capabilities for canvas elements
 * 
 * @param {AnimatedElementProps} props - The component props
 * @returns {JSX.Element | null} The rendered AnimatedElement component or null if not visible
 */
function AnimatedElement({
  id,
  children,
  entryPoint,
  exitPoint,
  persist,
  entryAnimation = 'fade',
  exitAnimation = 'fade',
  entryDuration = 0.5,
  exitDuration = 0.5,
  entryEasing = 'easeOutBack',
  exitEasing = 'easeInOutCubic',
  viewMode,
  scrollPosition = 0,
  parallaxFactor = 0,
  style,
  className,
  onClick,
}: AnimatedElementProps): JSX.Element | null {
  // Get timeline context
  const { currentPosition } = useTimeline();
  
  // State for visibility and animation progress
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  
  // Reference to the element
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Calculate if the element should be visible based on timeline position
  useEffect(() => {
    // In editor mode, show all elements for editing
    if (viewMode === 'editor') {
      setIsVisible(true);
      return;
    }
    
    // In zine mode, visibility is controlled by scroll position
    if (viewMode === 'zine') {
      // Map scroll position to timeline position (simplified)
      const mappedPosition = scrollPosition / 1000 * 60; // Assuming 60s timeline and 1000px scroll height
      
      const shouldBeVisible = 
        mappedPosition >= entryPoint && 
        (exitPoint === null || mappedPosition <= exitPoint || persist);
      
      setIsVisible(shouldBeVisible);
      
      // Calculate animation progress
      if (shouldBeVisible) {
        if (mappedPosition >= entryPoint && mappedPosition <= entryPoint + entryDuration) {
          // Entry animation
          const progress = (mappedPosition - entryPoint) / entryDuration;
          setAnimationProgress(progress);
        } else if (exitPoint !== null && mappedPosition >= exitPoint - exitDuration && mappedPosition <= exitPoint) {
          // Exit animation
          const progress = 1 - (exitPoint - mappedPosition) / exitDuration;
          setAnimationProgress(progress);
        } else {
          // Fully visible
          setAnimationProgress(1);
        }
      }
      
      return;
    }
    
    // In timeline or presentation mode, use the current timeline position
    const shouldBeVisible = 
      currentPosition >= entryPoint && 
      (exitPoint === null || currentPosition <= exitPoint || persist);
    
    setIsVisible(shouldBeVisible);
    
    // Calculate animation progress
    if (shouldBeVisible) {
      if (currentPosition >= entryPoint && currentPosition <= entryPoint + entryDuration) {
        // Entry animation
        const progress = (currentPosition - entryPoint) / entryDuration;
        setAnimationProgress(progress);
      } else if (exitPoint !== null && currentPosition >= exitPoint - exitDuration && currentPosition <= exitPoint) {
        // Exit animation
        const progress = 1 - (exitPoint - currentPosition) / exitDuration;
        setAnimationProgress(progress);
      } else {
        // Fully visible
        setAnimationProgress(1);
      }
    }
  }, [currentPosition, entryPoint, exitPoint, persist, entryDuration, exitDuration, viewMode, scrollPosition]);
  
  // If not visible, don't render
  if (!isVisible && viewMode !== 'editor') {
    return null;
  }
  
  // Calculate animation styles based on animation type and progress
  const getAnimationStyles = (): React.CSSProperties => {
    // In editor mode, no animations
    if (viewMode === 'editor') {
      return {};
    }
    
    // Determine if we're in entry or exit animation
    const isEntry = currentPosition <= entryPoint + entryDuration;
    const isExit = exitPoint !== null && currentPosition >= exitPoint - exitDuration;
    
    // If neither entry nor exit, return normal styles
    if (!isEntry && !isExit) {
      return {};
    }
    
    // Get the appropriate animation type and progress
    const animationType = isEntry ? entryAnimation : exitAnimation;
    const progress = isEntry ? animationProgress : 1 - animationProgress;
    const easingType = isEntry ? entryEasing : exitEasing;
    
    // Calculate styles based on animation type
    switch (animationType) {
      case 'fade':
        return {
          opacity: interpolate(0, 1, progress, easingType),
        };
      
      case 'slide':
        return {
          opacity: interpolate(0, 1, progress, easingType),
          transform: generateTransform({
            translateY: interpolate(50, 0, progress, easingType),
          }),
        };
      
      case 'scale':
        return {
          opacity: interpolate(0, 1, progress, easingType),
          transform: generateTransform({
            scale: interpolate(0.5, 1, progress, easingType),
          }),
        };
      
      case 'bounce':
        return {
          opacity: interpolate(0, 1, progress, 'linear'),
          transform: generateTransform({
            translateY: interpolate(100, 0, progress, 'easeOutBounce'),
          }),
        };
      
      case 'flip':
        return {
          opacity: interpolate(0, 1, progress, 'linear'),
          transform: generateTransform({
            rotateY: interpolate(90, 0, progress, 'easeOutBack'),
          }),
        };
      
      case 'none':
      default:
        return {};
    }
  };
  
  // Calculate parallax offset for zine mode
  const getParallaxStyles = (): React.CSSProperties => {
    if (viewMode !== 'zine' || parallaxFactor === 0) {
      return {};
    }
    
    const parallaxOffset = scrollPosition * parallaxFactor * -0.2;
    
    return {
      transform: generateTransform({
        translateY: parallaxOffset,
      }),
    };
  };
  
  // Combine all styles
  const combinedStyles: React.CSSProperties = {
    ...style,
    ...getAnimationStyles(),
    ...getParallaxStyles(),
    transition: viewMode === 'editor' ? 'none' : 'all 0.2s',
  };
  
  return (
    <div
      ref={elementRef}
      className={className}
      style={combinedStyles}
      onClick={onClick}
      data-element-id={id}
    >
      {children}
    </div>
  );
}

export default AnimatedElement;
