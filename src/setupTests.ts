/**
 * Setup file for Jest tests
 * 
 * This file configures the testing environment and adds custom matchers
 * for React Testing Library.
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
  mockEntries: Array<{isIntersecting: boolean; target: Element; intersectionRatio: number}>;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockEntries = [];
  }

  observe(element: Element): void {
    this.elements.add(element);
    this.mockEntries.push({
      isIntersecting: false,
      target: element,
      intersectionRatio: 0,
    });
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
    this.mockEntries = this.mockEntries.filter(entry => entry.target !== element);
  }

  disconnect(): void {
    this.elements.clear();
    this.mockEntries = [];
  }

  // Helper to trigger intersection
  triggerIntersection(entries: IntersectionObserverEntry[]): void {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}

// Set up global mocks
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;
  elements: Set<Element>;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element: Element): void {
    this.elements.add(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.elements.clear();
  }
} as unknown as typeof ResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => setTimeout(callback, 0) as unknown as number;
global.cancelAnimationFrame = (id: number): void => clearTimeout(id);
