import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlumniNetwork from './AlumniNetwork';

jest.mock('../../services/alumni.queries', () => ({
  useAlumniDirectoryQuery: () => ({
    data: {
      stats: { totalAlumni: 1, activeMembers: 0, upcomingEvents: 0, mentors: 0 },
      alumni: [{ id: 1, name: 'John Doe', batch: '2020', department: 'CS', avatar: '', currentRole: 'Engineer', company: 'Tech Co' }],
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

describe('AlumniNetwork', () => {
  beforeEach(() => {
    // Reset permission mock before each test
    delete window.__HRMS__;
  });

  it('should render main container with correct data-testid', () => {
    render(<AlumniNetwork />);
    expect(screen.getByTestId('school-container-alumni-network')).toBeInTheDocument();
  });

  it('should render Add Alumni button if permission is granted', () => {
    window.__HRMS__ = { hasPermission: jest.fn(() => true) };
    render(<AlumniNetwork />);
    expect(screen.getByTestId('school-button-add-alumni')).toBeInTheDocument();
  });

  it('should not render Add Alumni button if permission is denied', () => {
    window.__HRMS__ = { hasPermission: jest.fn(() => false) };
    render(<AlumniNetwork />);
    expect(screen.queryByTestId('school-button-add-alumni')).not.toBeInTheDocument();
  });

  it('should render alumni directory section', () => {
    render(<AlumniNetwork />);
    expect(screen.getByTestId('school-card-alumni-directory')).toBeInTheDocument();
  });

  it('should render total alumni stats card', () => {
    render(<AlumniNetwork />);
    expect(screen.getByTestId('school-card-total-alumni')).toBeInTheDocument();
  });
});
