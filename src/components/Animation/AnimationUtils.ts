/**
 * Animation utilities for ChronoCanvas
 * 
 * This file contains utility functions and constants for animations
 * throughout the application.
 */

// Easing functions for animations
export const Easing = {
  // Linear easing (no acceleration or deceleration)
  linear: (t: number): number => t,
  
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

// Animation presets for common animations
export const AnimationPresets = {
  fadeIn: {
    type: 'fade',
    duration: 0.5,
    easing: 'easeInOutCubic',
    properties: {
      opacity: { from: 0, to: 1 }
    }
  },
  fadeOut: {
    type: 'fade',
    duration: 0.5,
    easing: 'easeInOutCubic',
    properties: {
      opacity: { from: 1, to: 0 }
    }
  },
  slideUp: {
    type: 'transform',
    duration: 0.6,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 20, to: 0 }
    }
  },
  slideDown: {
    type: 'transform',
    duration: 0.6,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: -20, to: 0 }
    }
  },
  slideLeft: {
    type: 'transform',
    duration: 0.6,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      translateX: { from: 20, to: 0 }
    }
  },
  slideRight: {
    type: 'transform',
    duration: 0.6,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      translateX: { from: -20, to: 0 }
    }
  },
  zoomIn: {
    type: 'transform',
    duration: 0.5,
    easing: 'easeOutQuad',
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 }
    }
  },
  zoomOut: {
    type: 'transform',
    duration: 0.5,
    easing: 'easeOutQuad',
    properties: {
      opacity: { from: 1, to: 0 },
      scale: { from: 1, to: 0.8 }
    }
  },
  bounce: {
    type: 'transform',
    duration: 0.8,
    easing: 'easeOutBounce',
    properties: {
      translateY: { from: -20, to: 0 }
    }
  },
  pulse: {
    type: 'transform',
    duration: 0.4,
    easing: 'easeOutElastic',
    properties: {
      scale: { from: 1, to: 1.05 }
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
  easingName: EasingType | string = 'linear'
): number => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  
  // Get easing function (default to linear if not found)
  const easingFn = Easing[easingName as EasingType] || Easing.linear;
  
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
