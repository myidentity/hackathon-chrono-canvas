/**
 * Component tests for Header
 * 
 * This file contains tests for the Header component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../src/components/UI/Header';

describe('Header', () => {
  const mockViewModeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with correct title', () => {
    render(
      <Header 
        viewMode="editor" 
        onViewModeChange={mockViewModeChange} 
        data-testid="header"
      />
    );

    expect(screen.getByText('ChronoCanvas')).toBeInTheDocument();
  });

  test('should highlight active view mode tab', () => {
    render(
      <Header 
        viewMode="timeline" 
        onViewModeChange={mockViewModeChange}
      />
    );

    // Timeline button should have the active class
    const timelineButton = screen.getByText('Timeline');
    expect(timelineButton).toHaveClass('bg-indigo-100');
    
    // Editor button should not have the active class
    const editorButton = screen.getByText('Editor');
    expect(editorButton).not.toHaveClass('bg-indigo-100');
  });

  test('should call onViewModeChange when a tab is clicked', () => {
    render(
      <Header 
        viewMode="editor" 
        onViewModeChange={mockViewModeChange}
      />
    );

    // Click on Timeline tab
    fireEvent.click(screen.getByText('Timeline'));
    
    // onViewModeChange should be called with 'timeline'
    expect(mockViewModeChange).toHaveBeenCalledWith('timeline');
    
    // Click on Zine View tab
    fireEvent.click(screen.getByText('Zine View'));
    
    // onViewModeChange should be called with 'zine'
    expect(mockViewModeChange).toHaveBeenCalledWith('zine');
    
    // Click on Presentation tab
    fireEvent.click(screen.getByText('Presentation'));
    
    // onViewModeChange should be called with 'presentation'
    expect(mockViewModeChange).toHaveBeenCalledWith('presentation');
    
    // Click on Editor tab
    fireEvent.click(screen.getByText('Editor'));
    
    // onViewModeChange should be called with 'editor'
    expect(mockViewModeChange).toHaveBeenCalledWith('editor');
  });

  test('should render action buttons', () => {
    render(
      <Header 
        viewMode="editor" 
        onViewModeChange={mockViewModeChange}
      />
    );

    // Check if action buttons are rendered
    expect(screen.getByTitle('Save Project')).toBeInTheDocument();
    expect(screen.getByTitle('Share Project')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
  });

  test('should apply data-testid attribute when provided', () => {
    render(
      <Header 
        viewMode="editor" 
        onViewModeChange={mockViewModeChange} 
        data-testid="custom-header"
      />
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });
});
