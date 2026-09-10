import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomDatePicker from '../src/components/CustomDatePicker/CustomDatePicker';

describe('CustomDatePicker', () => {
  const baseProps = {
    id: 'test-date',
    name: 'date',
    value: '',
    onChange: jest.fn(),
    testId: 'school-field-date',
  };

  it('renders input and placeholder', () => {
    render(<CustomDatePicker {...baseProps} placeholder="Pick a date" />);
    const input = screen.getByTestId('school-field-date');
    expect(input).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pick a date')).toBeInTheDocument();
  });

  it('opens calendar popup on input click', () => {
    render(<CustomDatePicker {...baseProps} />);
    const input = screen.getByTestId('school-field-date');
    fireEvent.click(input);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays selected date in DD/MM/YYYY format', () => {
    render(<CustomDatePicker {...baseProps} value="2024-03-31" />);
    expect(screen.getByDisplayValue('31/03/2024')).toBeInTheDocument();
  });

  it('calls onChange with correct value when a date is selected', () => {
    const handleChange = jest.fn();
    render(<CustomDatePicker {...baseProps} onChange={handleChange} />);
    fireEvent.click(screen.getByTestId('school-field-date'));
    // Find a day button that is not disabled (today is always enabled)
    const today = new Date().getDate();
    const dayBtn = screen.getAllByRole('button', { name: new RegExp(`^${today} `) })[0];
    fireEvent.click(dayBtn);
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0].target.value).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('disables input when disabled prop is true', () => {
    render(<CustomDatePicker {...baseProps} disabled />);
    expect(screen.getByTestId('school-field-date')).toBeDisabled();
  });
});
