/**
 * AnimatedElement component for ChronoCanvas.
 * 
 * This component wraps canvas elements with animation capabilities,
 * handling both timeline-based and scroll-triggered animations.
 * Updated with Material Design 3.0 motion patterns.
 * 
 * @module AnimatedElement
 */

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeline } from '../../context/TimelineContext';
import { interpolate, generateTransform, Easing, AnimationDurations, generateTransition } from './AnimationUtils';
import { ViewMode } from '../../types/ViewMode';

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
  viewMode: ViewMode;
  
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
 * Enhanced with Material Design 3.0 motion patterns and Framer Motion
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
  entryDuration = AnimationDurations.medium4,
  exitDuration = AnimationDurations.medium3,
  entryEasing = 'emphasized',
  exitEasing = 'standard',
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
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
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
          setIsAnimating(true);
        } else if (exitPoint !== null && mappedPosition >= exitPoint - exitDuration && mappedPosition <= exitPoint) {
          // Exit animation
          const progress = 1 - (exitPoint - mappedPosition) / exitDuration;
          setAnimationProgress(progress);
          setIsAnimating(true);
        } else {
          // Fully visible
          setAnimationProgress(1);
          setIsAnimating(false);
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
        setIsAnimating(true);
      } else if (exitPoint !== null && currentPosition >= exitPoint - exitDuration && currentPosition <= exitPoint) {
        // Exit animation
        const progress = 1 - (exitPoint - currentPosition) / exitDuration;
        setAnimationProgress(progress);
        setIsAnimating(true);
      } else {
        // Fully visible
        setAnimationProgress(1);
        setIsAnimating(false);
      }
    }
  }, [currentPosition, entryPoint, exitPoint, persist, entryDuration, exitDuration, viewMode, scrollPosition]);
  
  // If not visible, don't render
  if (!isVisible && viewMode !== 'editor') {
    return null;
  }
  
  // Get Framer Motion variants based on animation type
  const getMotionVariants = () => {
    // In editor mode, no animations
    if (viewMode === 'editor') {
      return {
        initial: {},
        animate: {},
        exit: {}
      };
    }
    
    // Determine if we're in entry or exit animation
    const isEntry = currentPosition <= entryPoint + entryDuration;
    const isExit = exitPoint !== null && currentPosition >= exitPoint - exitDuration;
    
    // Get the appropriate animation type
    const animationType = isEntry ? entryAnimation : exitAnimation;
    
    // Define variants based on animation type
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { 
            opacity: 1,
            transition: { 
              duration: entryDuration,
              ease: [0.2, 0, 0, 1] // Material standard easing
            }
          },
          exit: { 
            opacity: 0,
            transition: { 
              duration: exitDuration,
              ease: [0.2, 0, 0, 1] // Material standard easing
            }
          }
        };
      
      case 'slide':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: entryDuration,
              ease: [0, 0, 0, 1], // Material emphasized decelerate
              opacity: { duration: entryDuration * 0.75 }
            }
          },
          exit: { 
            opacity: 0, 
            y: -20,
            transition: { 
              duration: exitDuration,
              ease: [0.3, 0, 1, 1], // Material emphasized accelerate
              opacity: { duration: exitDuration * 0.75 }
            }
          }
        };
      
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.92 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration: entryDuration,
              ease: [0.2, 0, 0, 1.2], // Material emphasized easing
              opacity: { duration: entryDuration * 0.75 }
            }
          },
          exit: { 
            opacity: 0, 
            scale: 0.92,
            transition: { 
              duration: exitDuration,
              ease: [0.3, 0, 1, 1], // Material emphasized accelerate
              opacity: { duration: exitDuration * 0.75 }
            }
          }
        };
      
      case 'bounce':
        return {
          initial: { opacity: 0, y: -50 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: entryDuration,
              type: "spring",
              bounce: 0.4,
              opacity: { duration: entryDuration * 0.5 }
            }
          },
          exit: { 
            opacity: 0, 
            y: 50,
            transition: { 
              duration: exitDuration,
              ease: [0.3, 0, 1, 1], // Material emphasized accelerate
              opacity: { duration: exitDuration * 0.75 }
            }
          }
        };
      
      case 'flip':
        return {
          initial: { opacity: 0, rotateY: 90 },
          animate: { 
            opacity: 1, 
            rotateY: 0,
            transition: { 
              duration: entryDuration,
              ease: [0.2, 0, 0, 1.2], // Material emphasized easing
              opacity: { duration: entryDuration * 0.75 }
            }
          },
          exit: { 
            opacity: 0, 
            rotateY: -90,
            transition: { 
              duration: exitDuration,
              ease: [0.3, 0, 1, 1], // Material emphasized accelerate
              opacity: { duration: exitDuration * 0.75 }
            }
          }
        };
      
      case 'none':
      default:
        return {
          initial: {},
          animate: {},
          exit: {}
        };
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
  
  // Get motion variants
  const variants = getMotionVariants();
  
  // Combine all styles
  const combinedStyles: React.CSSProperties = {
    ...style,
    ...getParallaxStyles(),
  };
  
  // Use Framer Motion for animations in timeline and presentation modes
  if (viewMode !== 'editor' && (viewMode === 'timeline' || viewMode === 'presentation')) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={elementRef}
            className={className}
            style={combinedStyles}
            onClick={onClick}
            data-element-id={id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            layoutId={`element-${id}`}
            whileHover={{ 
              scale: viewMode === 'editor' ? 1.02 : 1,
              boxShadow: viewMode === 'editor' ? "0 5px 15px rgba(0,0,0,0.1)" : "none",
              transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
            }}
            whileTap={{ 
              scale: viewMode === 'editor' ? 0.98 : 1,
              transition: { duration: 0.1, ease: [0.3, 0, 1, 1] }
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  // For editor mode or zine mode, use CSS transitions
  return (
    <div
      ref={elementRef}
      className={`${className} ${isAnimating ? 'animating' : ''}`}
      style={{
        ...combinedStyles,
        transition: viewMode === 'editor' ? 'none' : generateTransition(
          ['opacity', 'transform'],
          isAnimating ? (currentPosition <= entryPoint + entryDuration ? entryDuration : exitDuration) : 0.2,
          isAnimating ? (currentPosition <= entryPoint + entryDuration ? entryEasing : exitEasing) : 'standard'
        ),
      }}
      onClick={onClick}
      data-element-id={id}
    >
      {children}
    </div>
  );
}

export default AnimatedElement;
