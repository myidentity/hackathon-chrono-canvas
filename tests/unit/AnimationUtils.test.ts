/**
 * Unit tests for AnimationUtils
 * 
 * This file contains tests for the animation utility functions and constants.
 */

import { Easing, AnimationPresets, interpolate, generateTransform, calculateParallax } from '../../src/components/Animation/AnimationUtils';

describe('AnimationUtils', () => {
  describe('Easing functions', () => {
    test('linear easing should return the same value', () => {
      expect(Easing.linear(0)).toBe(0);
      expect(Easing.linear(0.5)).toBe(0.5);
      expect(Easing.linear(1)).toBe(1);
    });

    test('easeInOutCubic should have proper acceleration and deceleration', () => {
      expect(Easing.easeInOutCubic(0)).toBe(0);
      expect(Easing.easeInOutCubic(0.25)).toBeCloseTo(0.0625);
      expect(Easing.easeInOutCubic(0.5)).toBe(0.5);
      expect(Easing.easeInOutCubic(0.75)).toBeCloseTo(0.9375);
      expect(Easing.easeInOutCubic(1)).toBe(1);
    });

    test('easeOutBack should have slight overshoot', () => {
      expect(Easing.easeOutBack(0)).toBe(0);
      expect(Easing.easeOutBack(0.5)).toBeGreaterThan(0.5);
      expect(Easing.easeOutBack(0.8)).toBeGreaterThan(1);
      expect(Easing.easeOutBack(1)).toBe(1);
    });

    test('easeOutElastic should oscillate before settling', () => {
      expect(Easing.easeOutElastic(0)).toBe(0);
      expect(Easing.easeOutElastic(0.2)).toBeGreaterThan(0);
      expect(Easing.easeOutElastic(0.5)).toBeLessThan(1.5);
      expect(Easing.easeOutElastic(1)).toBe(1);
    });

    test('easeOutBounce should simulate bouncing effect', () => {
      expect(Easing.easeOutBounce(0)).toBe(0);
      expect(Easing.easeOutBounce(0.2)).toBeGreaterThan(0);
      expect(Easing.easeOutBounce(0.5)).toBeLessThan(1);
      expect(Easing.easeOutBounce(0.8)).toBeLessThan(1);
      expect(Easing.easeOutBounce(1)).toBe(1);
    });
  });

  describe('AnimationPresets', () => {
    test('fadeIn preset should have correct properties', () => {
      expect(AnimationPresets.fadeIn.type).toBe('fade');
      expect(AnimationPresets.fadeIn.duration).toBe(0.5);
      expect(AnimationPresets.fadeIn.easing).toBe('easeInOutCubic');
      expect(AnimationPresets.fadeIn.properties.opacity.from).toBe(0);
      expect(AnimationPresets.fadeIn.properties.opacity.to).toBe(1);
    });

    test('slideUp preset should have correct properties', () => {
      expect(AnimationPresets.slideUp.type).toBe('transform');
      expect(AnimationPresets.slideUp.duration).toBe(0.6);
      expect(AnimationPresets.slideUp.easing).toBe('easeOutBack');
      expect(AnimationPresets.slideUp.properties.opacity.from).toBe(0);
      expect(AnimationPresets.slideUp.properties.opacity.to).toBe(1);
      expect(AnimationPresets.slideUp.properties.translateY.from).toBe(20);
      expect(AnimationPresets.slideUp.properties.translateY.to).toBe(0);
    });
  });

  describe('interpolate function', () => {
    test('should interpolate values correctly with linear easing', () => {
      expect(interpolate(0, 100, 0, 'linear')).toBe(0);
      expect(interpolate(0, 100, 0.5, 'linear')).toBe(50);
      expect(interpolate(0, 100, 1, 'linear')).toBe(100);
    });

    test('should interpolate values correctly with easeInOutCubic easing', () => {
      expect(interpolate(0, 100, 0, 'easeInOutCubic')).toBe(0);
      expect(interpolate(0, 100, 0.5, 'easeInOutCubic')).toBe(50);
      expect(interpolate(0, 100, 1, 'easeInOutCubic')).toBe(100);
    });

    test('should clamp progress values outside 0-1 range', () => {
      expect(interpolate(0, 100, -0.5, 'linear')).toBe(0);
      expect(interpolate(0, 100, 1.5, 'linear')).toBe(100);
    });

    test('should use linear easing if invalid easing name is provided', () => {
      expect(interpolate(0, 100, 0.5, 'invalidEasing')).toBe(50);
    });
  });

  describe('generateTransform function', () => {
    test('should generate correct transform string for translateX', () => {
      expect(generateTransform({ translateX: 100 })).toBe('translateX(100px)');
    });

    test('should generate correct transform string for multiple transforms', () => {
      expect(generateTransform({ translateX: 100, translateY: 50, scale: 1.5 }))
        .toBe('translateX(100px) translateY(50px) scale(1.5)');
    });

    test('should generate correct transform string for rotation', () => {
      expect(generateTransform({ rotate: 45 })).toBe('rotate(45deg)');
    });

    test('should return empty string for empty transforms object', () => {
      expect(generateTransform({})).toBe('');
    });
  });

  describe('calculateParallax function', () => {
    test('should calculate correct parallax offset', () => {
      expect(calculateParallax(100, 0.5, 1000)).toBe(-25);
    });

    test('should limit speed to reasonable range', () => {
      expect(calculateParallax(100, 1.5, 1000)).toBe(-50);
      expect(calculateParallax(100, -0.5, 1000)).toBe(0);
    });

    test('should return zero for zero scroll position', () => {
      expect(calculateParallax(0, 0.5, 1000)).toBe(0);
    });
  });
});
