import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLoader from '../src/components/PageLoader/PageLoader';

describe('PageLoader', () => {
  it('renders with default props', () => {
    render(<PageLoader />);
    expect(screen.getByTestId('school-loader-page')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Please wait a moment...')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('renders with custom title, subtitle, and icon', () => {
    render(
      <PageLoader title="Fetching Data" subtitle="Hang tight!" icon="🚀" />
    );
    expect(screen.getByText('Fetching Data')).toBeInTheDocument();
    expect(screen.getByText('Hang tight!')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('renders spinner and dots', () => {
    render(<PageLoader />);
    expect(document.querySelector('.sch-page-loader__spinner')).toBeInTheDocument();
    expect(document.querySelectorAll('.sch-page-loader__dot').length).toBe(3);
  });
});
