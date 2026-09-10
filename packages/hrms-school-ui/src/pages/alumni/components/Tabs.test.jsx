import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

describe('Tabs', () => {
  it('renders directory and events tabs; mentorship tab is hidden', () => {
    const onTabChange = jest.fn();
    render(<Tabs activeTab="directory" onTabChange={onTabChange} />);
    expect(screen.getByTestId('alumni-tabs-directory')).toBeInTheDocument();
    expect(screen.getByTestId('alumni-tabs-events')).toBeInTheDocument();
    expect(screen.queryByTestId('alumni-tabs-mentorship')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('alumni-tabs-events'));
    expect(onTabChange).toHaveBeenCalledWith('events');
  });
});
