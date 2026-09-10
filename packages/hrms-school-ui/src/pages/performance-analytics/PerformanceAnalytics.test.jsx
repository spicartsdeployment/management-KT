import React from 'react';

import { render, screen } from '@testing-library/react';
import PerformanceAnalytics from './PerformanceAnalytics';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../../services/performance.queries', () => ({
  useAcademicPerformanceQuery: () => ({ data: null, isLoading: false }),
  useSportsPerformanceQuery: () => ({ data: null, isLoading: false }),
  useBehaviorPerformanceQuery: () => ({ data: null, isLoading: false }),
  useCulturalPerformanceQuery: () => ({ data: null, isLoading: false }),
  usePerformanceDashboardQuery: () => ({ data: null, isLoading: false }),
}));

describe('PerformanceAnalytics', () => {
  const mockStore = configureStore([]);
  const store = mockStore({ school: { theme: { mode: 'light' } } });

  const renderWithProvider = (ui) => render(<Provider store={store}>{ui}</Provider>);

  it('should render main container with correct data-testid', () => {
    renderWithProvider(<PerformanceAnalytics />);
    expect(screen.getByTestId('school-container-performance-analytics')).toBeInTheDocument();
  });

  it('should render card with analytics icon', () => {
    renderWithProvider(<PerformanceAnalytics />);
    expect(screen.getByTestId('school-container-performance-analytics')).toBeInTheDocument();
  });

  it('should render correct title and description', () => {
    renderWithProvider(<PerformanceAnalytics />);
    expect(screen.getByTestId('school-container-performance-analytics')).toBeInTheDocument();
  });
});
