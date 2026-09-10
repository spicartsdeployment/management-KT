import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCards from './StatsCards';

const mockStats = {
  totalAlumni: 6,
  activeMembers: 2,
  upcomingEvents: 0,
  mentorsAvailable: 2,
};

describe('StatsCards', () => {
  it('renders all 4 stat cards with values from directoryStats prop', () => {
    render(<StatsCards directoryStats={mockStats} />);
    expect(screen.getByTestId('alumni-stat-total')).toHaveTextContent('6');
    expect(screen.getByTestId('alumni-stat-active')).toHaveTextContent('2');
    expect(screen.getByTestId('alumni-stat-events')).toHaveTextContent('0');
    expect(screen.getByTestId('alumni-stat-mentors')).toHaveTextContent('2');
  });

  it('renders hyphen fallback when directoryStats values are missing', () => {
    render(<StatsCards directoryStats={{}} />);
    expect(screen.getAllByText('-').length).toBeGreaterThanOrEqual(4);
  });
});
