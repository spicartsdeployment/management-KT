import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventsTab from './EventsTab';

const events = [
  { id: 1, title: 'Alumni Career Fair 2024', dateTime: 'March 15, 2024', location: 'Main Campus', attendees: 156, tag: 'Networking', tagColor: 'bg-orange-100 text-orange-700' }
];

describe('EventsTab', () => {
  it('renders event card and triggers handlers', () => {
    const onRegister = jest.fn();
    const onLearnMore = jest.fn();
    render(<EventsTab events={events} onRegister={onRegister} onLearnMore={onLearnMore} />);
    expect(screen.getByTestId('alumni-event-card')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('alumni-button-register'));
    expect(onRegister).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('alumni-button-learnmore'));
    expect(onLearnMore).toHaveBeenCalled();
  });
});
