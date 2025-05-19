/**
 * Animation utilities for ChronoCanvas
 * 
 * This file contains utility functions and constants for animations
 * throughout the application.
 * Updated with Material Design 3.0 motion patterns.
 */

// Material Design 3.0 Easing functions for animations
export const Easing = {
  // Linear easing (no acceleration or deceleration)
  linear: (t: number): number => t,
  
  // Standard Material Design 3.0 easing - acceleration and deceleration
  standard: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  // Material Design 3.0 emphasized easing - stronger overshoot
  emphasized: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  // Material Design 3.0 emphasized decelerate - for elements entering the screen
  emphasizedDecelerate: (t: number): number => {
    return 1 - Math.pow(1 - t, 2);
  },
  
  // Material Design 3.0 emphasized accelerate - for elements leaving the screen
  emphasizedAccelerate: (t: number): number => {
    return t * t;
  },
  
  // Cubic easing in/out - acceleration until halfway, then deceleration
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  // Quadratic easing out - deceleration until stop
  easeOutQuad: (t: number): number => 1 - (1 - t) * (1 - t),
  
  // Back easing out - slight overshoot
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  // Elastic easing out - exponentially decaying sine wave
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  // Bounce easing out - exponentially decaying parabolic bounce
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

// Material Design 3.0 Animation durations (in seconds)
export const AnimationDurations = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.15,
  short4: 0.2,
  medium1: 0.25,
  medium2: 0.3,
  medium3: 0.35,
  medium4: 0.4,
  long1: 0.45,
  long2: 0.5,
  long3: 0.55,
  long4: 0.6,
  extraLong1: 0.7,
  extraLong2: 0.8,
  extraLong3: 0.9,
  extraLong4: 1.0
};

// Animation presets for common animations based on Material Design 3.0
export const AnimationPresets = {
  fadeIn: {
    type: 'fade',
    duration: AnimationDurations.medium2,
    easing: 'standard',
    properties: {
      opacity: { from: 0, to: 1 }
    }
  },
  fadeOut: {
    type: 'fade',
    duration: AnimationDurations.medium2,
    easing: 'standard',
    properties: {
      opacity: { from: 1, to: 0 }
    }
  },
  slideUp: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'emphasizedDecelerate',
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 20, to: 0 }
    }
  },
  slideDown: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'emphasizedDecelerate',
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: -20, to: 0 }
    }
  },
  slideLeft: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'emphasizedDecelerate',
    properties: {
      opacity: { from: 0, to: 1 },
      translateX: { from: 20, to: 0 }
    }
  },
  slideRight: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'emphasizedDecelerate',
    properties: {
      opacity: { from: 0, to: 1 },
      translateX: { from: -20, to: 0 }
    }
  },
  zoomIn: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'emphasized',
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.92, to: 1 }
    }
  },
  zoomOut: {
    type: 'transform',
    duration: AnimationDurations.medium3,
    easing: 'emphasizedAccelerate',
    properties: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 0.92 }
    }
  },
  bounce: {
    type: 'transform',
    duration: AnimationDurations.long4,
    easing: 'easeOutBounce',
    properties: {
      translateY: { from: -20, to: 0 }
    }
  },
  pulse: {
    type: 'transform',
    duration: AnimationDurations.medium2,
    easing: 'emphasized',
    properties: {
      scale: { from: 1, to: 1.03 }
    }
  },
  // Material Design 3.0 specific animations
  container: {
    type: 'transform',
    duration: AnimationDurations.long2,
    easing: 'standard',
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 }
    }
  },
  ripple: {
    type: 'transform',
    duration: AnimationDurations.medium4,
    easing: 'standard',
    properties: {
      scale: { from: 0, to: 1 },
      opacity: { from: 0.5, to: 0 }
    }
  },
  stateChange: {
    type: 'transform',
    duration: AnimationDurations.short4,
    easing: 'standard',
    properties: {
      opacity: { from: 0.8, to: 1 }
    }
  }
};

// Type definitions for animation properties
export type EasingType = keyof typeof Easing;
export type AnimationProperty = { from: number; to: number };
export type AnimationProperties = Record<string, AnimationProperty>;

/**
 * Interpolate between two values based on progress and easing function
 * 
 * @param from - Starting value
 * @param to - Ending value
 * @param progress - Progress value between 0 and 1
 * @param easingName - Name of easing function to use
 * @returns Interpolated value
 */
export const interpolate = (
  from: number,
  to: number,
  progress: number,
  easingName: EasingType | string = 'standard'
): number => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Get easing function (default to standard if not found)
  const easingFn = Easing[easingName as EasingType] || Easing.standard;
  
  // Apply easing to progress
  const easedProgress = easingFn(clampedProgress);
  
  // Interpolate between values
  return from + (to - from) * easedProgress;
};

/**
 * Generate CSS transform string from transform properties
 * 
 * @param transforms - Object containing transform properties
 * @returns CSS transform string
 */
export const generateTransform = (transforms: Record<string, number>): string => {
  const transformParts: string[] = [];
  
  if (transforms.translateX !== undefined) {
    transformParts.push(`translateX(${transforms.translateX}px)`);
  }
  
  if (transforms.translateY !== undefined) {
    transformParts.push(`translateY(${transforms.translateY}px)`);
  }
  
  if (transforms.scale !== undefined) {
    transformParts.push(`scale(${transforms.scale})`);
  }
  
  if (transforms.rotate !== undefined) {
    transformParts.push(`rotate(${transforms.rotate}deg)`);
  }
  
  if (transforms.rotateX !== undefined) {
    transformParts.push(`rotateX(${transforms.rotateX}deg)`);
  }
  
  if (transforms.rotateY !== undefined) {
    transformParts.push(`rotateY(${transforms.rotateY}deg)`);
  }
  
  return transformParts.join(' ');
};

/**
 * Calculate parallax offset based on scroll position and speed factor
 * 
 * @param scrollPosition - Current scroll position in pixels
 * @param speedFactor - Speed factor (0-1, where 0 is no movement, 1 is full movement)
 * @returns Parallax offset in pixels
 */
export const calculateParallax = (
  scrollPosition: number,
  speedFactor: number
): number => {
  // Limit speed factor to reasonable range
  const clampedSpeedFactor = Math.max(0, Math.min(1, speedFactor));
  
  // Calculate parallax offset
  return -scrollPosition * clampedSpeedFactor * 0.5;
};

/**
 * Generate CSS transition string based on Material Design 3.0 guidelines
 * 
 * @param properties - Array of CSS properties to transition
 * @param duration - Duration in seconds
 * @param easing - Easing function name
 * @param delay - Delay in seconds
 * @returns CSS transition string
 */
export const generateTransition = (
  properties: string[] = ['all'],
  duration: number = AnimationDurations.medium2,
  easing: string = 'standard',
  delay: number = 0
): string => {
  // Map easing name to CSS cubic-bezier
  const easingMap: Record<string, string> = {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
    emphasizedDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    linear: 'linear'
  };
  
  const easingValue = easingMap[easing] || easingMap.standard;
  
  return properties
    .map(prop => `${prop} ${duration}s ${easingValue} ${delay}s`)
    .join(', ');
};
