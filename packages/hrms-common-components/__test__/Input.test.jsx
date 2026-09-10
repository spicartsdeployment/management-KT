import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../src/Input';

describe('Input', () => {
  it('renders with label and value', () => {
    render(<Input label="Username" name="username" value="john" onChange={() => {}} />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Input label="Email" helperText="We never share your email." />);
    expect(screen.getByText('We never share your email.')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(<Input leftIcon={<span data-testid="left-icon">L</span>} rightIcon={<span data-testid="right-icon">R</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('calls onChange handler', () => {
    const handleChange = jest.fn();
    render(<Input label="Test" name="test" onChange={handleChange} />);
    fireEvent.change(screen.getByTestId('common-field-test'), { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalled();
  });
});