import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/Button';

describe('Button', () => {
  it('renders with default props and children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant and size classes', () => {
    render(<Button variant="secondary" size="lg">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/bg-gray-100|bg-gray-800/);
    expect(btn.className).toMatch(/px-6/);
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows left and right icons', () => {
    render(<Button leftIcon={<span data-testid="left-icon">L</span>} rightIcon={<span data-testid="right-icon">R</span>}>Icons</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});