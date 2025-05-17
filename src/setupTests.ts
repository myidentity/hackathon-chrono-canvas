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
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.mockEntries = [];
  }

  observe(element) {
    this.elements.add(element);
    this.mockEntries.push({
      isIntersecting: false,
      target: element,
      intersectionRatio: 0,
    });
  }

  unobserve(element) {
    this.elements.delete(element);
    this.mockEntries = this.mockEntries.filter(entry => entry.target !== element);
  }

  disconnect() {
    this.elements.clear();
    this.mockEntries = [];
  }

  // Helper to trigger intersection
  triggerIntersection(entries) {
    this.callback(entries, this);
  }
}

// Set up global mocks
global.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
};

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
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);
