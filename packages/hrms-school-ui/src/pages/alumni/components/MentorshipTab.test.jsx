import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MentorshipTab from './MentorshipTab';

describe('MentorshipTab', () => {
  it('renders mentorship buttons and triggers handlers', () => {
    const onBrowseMentors = jest.fn();
    const onJoinMentor = jest.fn();
    render(<MentorshipTab onBrowseMentors={onBrowseMentors} onJoinMentor={onJoinMentor} />);
    fireEvent.click(screen.getByTestId('alumni-button-browse-mentors'));
    expect(onBrowseMentors).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('alumni-button-join-mentor'));
    expect(onJoinMentor).toHaveBeenCalled();
  });
});
