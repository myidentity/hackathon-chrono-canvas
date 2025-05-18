/**
 * Unit tests for React components
 */

import { render, screen } from '@testing-library/react';
import { Button, Card, Tooltip, Toast } from '../../src/components/UI/MicroInteractions';

describe('MicroInteractions components', () => {
  test('Button renders without crashing', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('Card renders without crashing', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('Tooltip renders without crashing', () => {
    render(<Tooltip content="Tooltip Text">Hover Me</Tooltip>);
    expect(screen.getByText('Hover Me')).toBeInTheDocument();
  });

  test('Toast renders without crashing', () => {
    render(<Toast message="Test Toast" type="success" />);
    expect(screen.getByText('Test Toast')).toBeInTheDocument();
  });
});
