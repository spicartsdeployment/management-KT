import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../src/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies variant and padding classes', () => {
    render(<Card variant="glass" padding="lg">Glass Card</Card>);
    const card = screen.getByTestId('common-card');
    expect(card.className).toMatch(/common-card-glass/);
    expect(card.className).toMatch(/common-card-padding-lg/);
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom</Card>);
    const card = screen.getByTestId('common-card');
    expect(card.className).toMatch(/custom-class/);
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    fireEvent.click(screen.getByTestId('common-card'));
    expect(handleClick).toHaveBeenCalled();
  });
});