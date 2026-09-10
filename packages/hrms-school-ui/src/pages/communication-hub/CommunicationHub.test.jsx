import React from 'react';
import { render, screen } from '@testing-library/react';
import CommunicationHub from './CommunicationHub';

describe('CommunicationHub', () => {
  beforeEach(() => {
    window.__HRMS__ = { hasPermission: jest.fn() };
  });

  afterEach(() => {
    delete window.__HRMS__;
  });

  it('should render main container with correct data-testid', () => {
    render(<CommunicationHub />);
    expect(screen.getByTestId('school-container-communication-hub')).toBeInTheDocument();
  });

  it('should render ChatContainer component', () => {
    render(<CommunicationHub />);
    expect(screen.getByTestId('school-chat-header')).toBeInTheDocument();
  });

  it('should render correct title and description', () => {
    render(<CommunicationHub />);
    expect(screen.getByTestId('school-container-communication-hub')).toBeInTheDocument();
  });
});
