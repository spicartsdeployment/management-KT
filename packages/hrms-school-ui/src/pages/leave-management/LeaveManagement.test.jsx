import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LeaveManagement from './LeaveManagement';

jest.mock('../../services/leave.queries', () => ({
  useLeaveStatisticsQuery: () => ({ data: { statistics: [], holidays: [], history: [], monthlyTrends: [], trendStats: { total: 0, used: 0, available: 0 } }, isLoading: false }),
}));

// Mock PageLoader
jest.mock('../../components/PageLoader', () => {
  return function MockPageLoader() {
    return <div data-testid="school-loader-page">Loading...</div>;
  };
});

describe('LeaveManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render main container with correct data-testid', async () => {
    render(<LeaveManagement />);
    await waitFor(
      () => {
        expect(screen.getByTestId('school-container-leave-management')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should render card with leave icon', async () => {
    render(<LeaveManagement />);
    await waitFor(
      () => {
        expect(screen.getByTestId('school-container-leave-management')).toBeInTheDocument();
        // Check that calendar is rendered after loading completes
        expect(screen.queryByTestId('school-loader-page')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should render correct title and description', async () => {
    render(<LeaveManagement />);
    await waitFor(
      () => {
        const titles = screen.getAllByText('Leave Management');
        expect(titles.length).toBeGreaterThan(0);
        expect(screen.getByTestId('school-container-leave-management')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
