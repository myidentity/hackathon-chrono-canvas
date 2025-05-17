/**
 * Component tests for ElementLibrary
 * 
 * This file contains tests for the ElementLibrary component.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ElementLibrary from '../../src/components/ElementLibrary/ElementLibrary';
import { CanvasProvider } from '../../src/context/CanvasContext';

// Mock the useCanvas hook
jest.mock('../../src/context/CanvasContext', () => {
  const originalModule = jest.requireActual('../../src/context/CanvasContext');
  
  return {
    ...originalModule,
    useCanvas: () => ({
      addElement: jest.fn(),
    }),
  };
});

describe('ElementLibrary', () => {
  test('should render with correct title', () => {
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    expect(screen.getByText('Element Library')).toBeInTheDocument();
  });

  test('should display element categories', () => {
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Shapes')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  test('should switch between categories', () => {
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    // Default category should be Text
    expect(screen.getByText('Heading')).toBeInTheDocument();
    
    // Click on Shapes category
    fireEvent.click(screen.getByText('Shapes'));
    
    // Should show shape elements
    expect(screen.getByText('Rectangle')).toBeInTheDocument();
    expect(screen.getByText('Circle')).toBeInTheDocument();
    
    // Click on Images category
    fireEvent.click(screen.getByText('Images'));
    
    // Should show image elements
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('Illustration')).toBeInTheDocument();
  });

  test('should call addElement when an element is clicked', () => {
    const { useCanvas } = jest.requireMock('../../src/context/CanvasContext');
    const addElementMock = useCanvas().addElement;
    
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    // Click on a text element
    fireEvent.click(screen.getByText('Paragraph'));
    
    // addElement should be called with correct element type
    expect(addElementMock).toHaveBeenCalledWith(expect.objectContaining({
      type: 'text',
    }));
    
    // Click on Shapes category and then on a shape element
    fireEvent.click(screen.getByText('Shapes'));
    fireEvent.click(screen.getByText('Circle'));
    
    // addElement should be called with correct element type
    expect(addElementMock).toHaveBeenCalledWith(expect.objectContaining({
      type: 'shape',
      properties: expect.objectContaining({
        shape: 'circle',
      }),
    }));
  });

  test('should display search functionality', () => {
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search elements...');
    expect(searchInput).toBeInTheDocument();
    
    // Enter search term
    fireEvent.change(searchInput, { target: { value: 'head' } });
    
    // Should filter elements to show only matching ones
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.queryByText('Paragraph')).not.toBeInTheDocument();
  });

  test('should display recently used elements section', () => {
    render(
      <CanvasProvider>
        <ElementLibrary />
      </CanvasProvider>
    );

    expect(screen.getByText('Recently Used')).toBeInTheDocument();
  });
});
