import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentOverlayLoader from '../src/components/ContentOverlayLoader/ContentOverlayLoader';

describe('ContentOverlayLoader', () => {
  it('renders with default config when no pathname is provided', () => {
    render(<ContentOverlayLoader />);
    expect(screen.getByTestId('school-loader-overlay')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait a moment…')).toBeInTheDocument();
  });

  it('renders dashboard loader when pathname is /dashboard', () => {
    render(<ContentOverlayLoader pathname="/dashboard" />);
    expect(screen.getByText('Loading Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Crunching your numbers…')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });

  it('renders bus-tracking loader when pathname is /bus-tracking', () => {
    render(<ContentOverlayLoader pathname="/bus-tracking" />);
    expect(screen.getByText('Finding Your Bus')).toBeInTheDocument();
    expect(screen.getByText('Tracking live location…')).toBeInTheDocument();
    // The bus emoji appears twice (icon and bar), so check that at least one exists
    expect(screen.getAllByText('🚌').length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct bar type for known page', () => {
    render(<ContentOverlayLoader pathname="/performance-analytics" />);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    // Should render a bar with columns (class check)
    expect(document.querySelector('.sch-col__bar--columns')).toBeInTheDocument();
  });

  it('renders default config for unknown page', () => {
    render(<ContentOverlayLoader pathname="/unknown-page" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait a moment…')).toBeInTheDocument();
  });
});
