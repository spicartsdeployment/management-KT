import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from '../src/Avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="/avatar.png" alt="User" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatar.png');
    expect(img).toHaveAttribute('alt', 'User');
  });

  it('renders fallback when no src', () => {
    render(<Avatar alt="Alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders fallback as ? if no alt or fallback', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('renders custom fallback text', () => {
    render(<Avatar fallback="ZZ" />);
    expect(screen.getByText('ZZ')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    render(<Avatar size="xl" alt="XL" />);
    const avatar = screen.getByTestId('common-avatar');
    expect(avatar.firstChild.className).toMatch(/w-16/);
  });

  it('renders status indicator', () => {
    render(<Avatar status="online" />);
    expect(screen.getByTestId('common-avatar-status-online')).toBeInTheDocument();
  });
});