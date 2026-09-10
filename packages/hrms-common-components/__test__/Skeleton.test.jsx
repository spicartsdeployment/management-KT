import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton, { SkeletonCard, SkeletonTable, SkeletonWidget } from '../src/Skeleton';

describe('Skeleton', () => {
  it('renders rectangular skeleton by default', () => {
    render(<Skeleton />);
    expect(screen.getByTestId('common-skeleton-rectangular')).toBeInTheDocument();
  });

  it('renders text skeleton with lines', () => {
    render(<Skeleton variant="text" lines={3} />);
    expect(screen.getByTestId('common-skeleton-text')).toBeInTheDocument();
  });

  it('renders circular skeleton', () => {
    render(<Skeleton variant="circular" />);
    expect(screen.getByTestId('common-skeleton-circular')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('renders SkeletonCard preset', () => {
    render(<SkeletonCard />);
    expect(screen.getByTestId('common-skeleton-card')).toBeInTheDocument();
  });
});

describe('SkeletonTable', () => {
  it('renders SkeletonTable preset', () => {
    render(<SkeletonTable rows={2} columns={3} />);
    expect(screen.getByTestId('common-skeleton-table')).toBeInTheDocument();
  });
});

describe('SkeletonWidget', () => {
  it('renders SkeletonWidget preset', () => {
    render(<SkeletonWidget />);
    expect(screen.getByTestId('common-skeleton-widget')).toBeInTheDocument();
  });
});