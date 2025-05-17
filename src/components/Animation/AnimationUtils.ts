/**
 * Animation utilities for ChronoCanvas.
 * 
 * This module provides utility functions and constants for creating
 * smooth, sophisticated animations throughout the application.
 * 
 * @module AnimationUtils
 */

/**
 * Standard easing functions for animations
 */
export const Easing = {
  /**
   * Linear easing (no acceleration or deceleration)
   * 
   * @param {number} t - Current time (0-1)
   * @returns {number} Output value
   */
  linear: (t: number): number => t,
  
  /**
   * Ease-in-out cubic easing
   * 
   * @param {number} t - Current time (0-1)
   * @returns {number} Output value
   */
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  /**
   * Ease-out back easing (slight overshoot)
   * 
   * @param {number} t - Current time (0-1)
   * @returns {number} Output value
   */
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  /**
   * Elastic ease-out
   * 
   * @param {number} t - Current time (0-1)
   * @returns {number} Output value
   */
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  /**
   * Bounce ease-out
   * 
   * @param {number} t - Current time (0-1)
   * @returns {number} Output value
   */
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

/**
 * Animation presets for element transitions
 */
export const AnimationPresets = {
  /**
   * Fade in animation
   */
  fadeIn: {
    type: 'fade',
    duration: 0.5,
    easing: 'easeInOutCubic',
    properties: {
      opacity: { from: 0, to: 1 }
    }
  },
  
  /**
   * Slide up animation
   */
  slideUp: {
    type: 'transform',
    duration: 0.6,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 20, to: 0 }
    }
  },
  
  /**
   * Scale in animation
   */
  scaleIn: {
    type: 'transform',
    duration: 0.5,
    easing: 'easeOutElastic',
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.8, to: 1 }
    }
  },
  
  /**
   * Bounce in animation
   */
  bounceIn: {
    type: 'transform',
    duration: 0.8,
    easing: 'easeOutBounce',
    properties: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.3, to: 1 }
    }
  },
  
  /**
   * Flip in animation
   */
  flipIn: {
    type: 'transform',
    duration: 0.7,
    easing: 'easeOutBack',
    properties: {
      opacity: { from: 0, to: 1 },
      rotateY: { from: 90, to: 0 }
    }
  }
};

/**
 * Calculate the interpolated value between start and end based on progress and easing
 * 
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Current progress (0-1)
 * @param {string} easingName - Name of the easing function to use
 * @returns {number} Interpolated value
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easingName: keyof typeof Easing = 'linear'
): number {
  const easingFunction = Easing[easingName] || Easing.linear;
  const easedProgress = easingFunction(Math.max(0, Math.min(1, progress)));
  return start + (end - start) * easedProgress;
}

/**
 * Generate a CSS transform string from transform properties
 * 
 * @param {object} transforms - Transform properties
 * @returns {string} CSS transform string
 */
export function generateTransform(transforms: {
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}): string {
  const parts: string[] = [];
  
  if (transforms.translateX !== undefined) parts.push(`translateX(${transforms.translateX}px)`);
  if (transforms.translateY !== undefined) parts.push(`translateY(${transforms.translateY}px)`);
  if (transforms.translateZ !== undefined) parts.push(`translateZ(${transforms.translateZ}px)`);
  
  if (transforms.scale !== undefined) parts.push(`scale(${transforms.scale})`);
  if (transforms.scaleX !== undefined) parts.push(`scaleX(${transforms.scaleX})`);
  if (transforms.scaleY !== undefined) parts.push(`scaleY(${transforms.scaleY})`);
  
  if (transforms.rotate !== undefined) parts.push(`rotate(${transforms.rotate}deg)`);
  if (transforms.rotateX !== undefined) parts.push(`rotateX(${transforms.rotateX}deg)`);
  if (transforms.rotateY !== undefined) parts.push(`rotateY(${transforms.rotateY}deg)`);
  if (transforms.rotateZ !== undefined) parts.push(`rotateZ(${transforms.rotateZ}deg)`);
  
  return parts.join(' ');
}

/**
 * Calculate the parallax offset based on scroll position
 * 
 * @param {number} scrollPosition - Current scroll position
 * @param {number} speed - Parallax speed factor (0-1)
 * @param {number} containerHeight - Height of the container
 * @returns {number} Parallax offset
 */
export function calculateParallax(
  scrollPosition: number,
  speed: number,
  containerHeight: number
): number {
  // Limit speed to a reasonable range
  const limitedSpeed = Math.max(0, Math.min(1, speed));
  
  // Calculate the parallax offset
  return scrollPosition * limitedSpeed * -0.5;
}
