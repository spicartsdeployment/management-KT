import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';

describe('Filters', () => {
  it('renders the industry dropdown button', () => {
    const onIndustryChange = jest.fn();
    render(<Filters industry="All Industries" onIndustryChange={onIndustryChange} />);
    expect(screen.getByTestId('alumni-dropdown-industry')).toBeInTheDocument();
    expect(screen.getByTestId('alumni-dropdown-industry')).toHaveTextContent('All Industries');
  });

  it('opens the dropdown and selects an option', () => {
    const onIndustryChange = jest.fn();
    render(<Filters industry="All Industries" onIndustryChange={onIndustryChange} />);
    // Open the custom dropdown
    fireEvent.click(screen.getByTestId('alumni-dropdown-industry'));
    // Click the 'Technology' option in the list
    fireEvent.click(screen.getByText('Technology'));
    expect(onIndustryChange).toHaveBeenCalledWith('Technology');
  });
});
