import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../src/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders default spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('common-spinner')).toBeInTheDocument();
  });

  it('renders fullScreen spinner', () => {
    render(<LoadingSpinner fullScreen />);
    expect(screen.getByTestId('common-spinner-fullscreen')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    render(<LoadingSpinner size="xl" />);
    const spinner = screen.getByTestId('common-spinner').firstChild;
    expect(spinner.className).toMatch(/w-16/);
  });
});