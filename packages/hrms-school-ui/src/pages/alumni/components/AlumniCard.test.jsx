import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlumniCard from './AlumniCard';

const alumni = {
  id: 1,
  initials: 'SJ',
  name: 'Sarah Johnson',
  year: 2018,
  title: 'Software Engineer',
  company: 'Google',
  location: 'San Francisco, CA',
  email: 'sarah@example.com',
  phone: '9999999999',
  tags: [
    { label: 'Google Developer Expert', color: 'bg-blue-100 text-blue-700' },
    { label: 'Tech Lead', color: 'bg-green-100 text-green-700' },
    { label: 'Available for Mentoring', color: 'bg-green-200 text-green-800' }
  ]
};

describe('AlumniCard', () => {
  it('renders alumni details correctly', () => {
    render(<AlumniCard alumni={alumni} />);
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Class of 2018')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer at Google')).toBeInTheDocument();
  });

  it('Connect button opens LinkedIn', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    render(<AlumniCard alumni={alumni} />);
    fireEvent.click(screen.getByTestId('alumni-button-connect'));
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('linkedin.com'), '_blank');
    openSpy.mockRestore();
  });

  it('Message button opens mailto', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    render(<AlumniCard alumni={alumni} />);
    fireEvent.click(screen.getByTestId('alumni-button-message'));
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('mailto:'));
    openSpy.mockRestore();
  });

  it('Call button opens WhatsApp', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => {});
    render(<AlumniCard alumni={alumni} />);
    fireEvent.click(screen.getByTestId('alumni-button-call'));
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('wa.me'));
    openSpy.mockRestore();
  });
});
