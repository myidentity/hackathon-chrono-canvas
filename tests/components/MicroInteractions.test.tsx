/**
 * Component tests for MicroInteractions
 * 
 * This file contains tests for the MicroInteractions components.
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Button, Card, Tooltip, Toast, ToastProvider, useToast } from '../../src/components/UI/MicroInteractions';

// Mock timer functions
jest.useFakeTimers();

describe('MicroInteractions', () => {
  describe('Button Component', () => {
    test('should render button with children', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    test('should apply variant classes correctly', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByText('Primary')).toHaveClass('bg-indigo-600');
      
      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-indigo-100');
      
      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByText('Outline')).toHaveClass('border-gray-300');
      
      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByText('Ghost')).toHaveClass('text-gray-700');
    });

    test('should apply size classes correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByText('Small')).toHaveClass('text-xs');
      
      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByText('Medium')).toHaveClass('text-sm');
      
      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByText('Large')).toHaveClass('text-base');
    });

    test('should handle disabled state', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should handle loading state', () => {
      render(<Button loading>Loading</Button>);
      
      // Should show loading spinner
      const loadingText = screen.getByText('Loading');
      expect(loadingText.previousSibling).toBeInTheDocument();
    });

    test('should render with icon', () => {
      const icon = <span data-testid="test-icon">🔍</span>;
      
      // Icon on the left
      render(<Button icon={icon}>Left Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon').nextSibling).toHaveTextContent('Left Icon');
      
      // Icon on the right
      render(<Button icon={icon} iconPosition="right">Right Icon</Button>);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon').previousSibling).toHaveTextContent('Right Icon');
    });
  });

  describe('Card Component', () => {
    test('should render card with children', () => {
      render(
        <Card>
          <div>Card Content</div>
        </Card>
      );
      
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    test('should apply elevation classes correctly', () => {
      const { rerender } = render(<Card elevation="none" data-testid="card">None</Card>);
      expect(screen.getByTestId('card')).not.toHaveClass('shadow');
      
      rerender(<Card elevation="sm" data-testid="card">Small</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-sm');
      
      rerender(<Card elevation="md" data-testid="card">Medium</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow');
      
      rerender(<Card elevation="lg" data-testid="card">Large</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-lg');
    });

    test('should handle hover state', () => {
      const { rerender } = render(<Card hover={true} data-testid="card">Hover</Card>);
      expect(screen.getByTestId('card')).toHaveClass('hover:shadow-lg');
      
      rerender(<Card hover={false} data-testid="card">No Hover</Card>);
      expect(screen.getByTestId('card')).not.toHaveClass('hover:shadow-lg');
    });

    test('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick}>Click Me</Card>);
      
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tooltip Component', () => {
    test('should render tooltip on hover', () => {
      render(
        <Tooltip content="Tooltip Content">
          <button>Hover Me</button>
        </Tooltip>
      );
      
      // Initially tooltip should not be visible
      expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
      
      // Hover over the button
      fireEvent.mouseEnter(screen.getByText('Hover Me'));
      
      // Advance timers to trigger tooltip display
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Tooltip should now be visible
      expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
      
      // Mouse leave should hide tooltip
      fireEvent.mouseLeave(screen.getByText('Hover Me'));
      
      // Tooltip should no longer be visible
      expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
    });

    test('should respect delay prop', () => {
      render(
        <Tooltip content="Delayed Tooltip" delay={1000}>
          <button>Hover Me</button>
        </Tooltip>
      );
      
      // Hover over the button
      fireEvent.mouseEnter(screen.getByText('Hover Me'));
      
      // Advance timers but not enough to show tooltip
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Tooltip should not be visible yet
      expect(screen.queryByText('Delayed Tooltip')).not.toBeInTheDocument();
      
      // Advance timers more to trigger tooltip display
      act(() => {
        jest.advanceTimersByTime(500);
      });
      
      // Tooltip should now be visible
      expect(screen.getByText('Delayed Tooltip')).toBeInTheDocument();
    });
  });

  describe('Toast Component', () => {
    test('should render toast with message', () => {
      render(<Toast message="Test Toast" onClose={() => {}} />);
      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    test('should call onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(<Toast message="Close Me" onClose={handleClose} />);
      
      // Click the close button
      fireEvent.click(screen.getByRole('button'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('should auto-close after duration', () => {
      const handleClose = jest.fn();
      render(<Toast message="Auto Close" duration={2000} onClose={handleClose} />);
      
      // Advance timers to trigger auto-close
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
