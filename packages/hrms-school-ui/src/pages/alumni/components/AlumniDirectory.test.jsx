import React from 'react';
import { render, screen } from '@testing-library/react';
import AlumniDirectory from './AlumniDirectory';

const alumniList = [
  { id: 1, initials: 'SJ', name: 'Sarah Johnson', year: 2018, title: 'Software Engineer', company: 'Google', location: 'San Francisco, CA', tags: [] },
  { id: 2, initials: 'MC', name: 'Michael Chen', year: 2016, title: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', tags: [] }
];

describe('AlumniDirectory', () => {
  it('renders all alumni cards', () => {
    render(<AlumniDirectory alumniList={alumniList} onConnect={() => {}} onMessage={() => {}} onCall={() => {}} />);
    expect(screen.getAllByTestId('alumni-card')).toHaveLength(2);
  });
});
