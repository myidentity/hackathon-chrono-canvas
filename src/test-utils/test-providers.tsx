/**
 * Test providers wrapper for ChronoCanvas
 * 
 * This file provides a wrapper component that includes all context providers
 * needed for testing components.
 */

import React from 'react';
import { CanvasProvider } from '../context/CanvasContext';
import { TimelineProvider } from '../context/TimelineContext';

interface TestProvidersProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides all necessary context providers for testing
 */
export const AllProviders: React.FC<TestProvidersProps> = ({ children }) => {
  return (
    <CanvasProvider>
      <TimelineProvider>
        {children}
      </TimelineProvider>
    </CanvasProvider>
  );
};

/**
 * Custom render function for testing with all providers
 * Can be used with testing-library's render function
 */
export const renderWithProviders = (ui: React.ReactElement) => {
  return {
    ui,
    wrapper: AllProviders,
  };
};
