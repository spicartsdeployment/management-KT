import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GlobalAnnouncements from './GlobalAnnouncements';

jest.mock('../../services/announcements.queries', () => ({
  useAnnouncementsQuery: () => ({ data: [], isLoading: false }),
}));

const mockStore = configureStore([]);
const store = mockStore({ school: { seenAnnouncementIds: [] } });

const renderWithProvider = (ui) => render(<Provider store={store}>{ui}</Provider>);

describe('GlobalAnnouncements', () => {
  it('should render main container with correct data-testid', () => {
    renderWithProvider(<GlobalAnnouncements />);
    expect(screen.getByTestId('school-container-global-announcements')).toBeInTheDocument();
  });

  it('should render card with announcements icon', () => {
    renderWithProvider(<GlobalAnnouncements />);
    expect(screen.getByTestId('school-container-quick-priority')).toBeInTheDocument();
    expect(screen.getByTestId('school-field-announcements-search')).toBeInTheDocument();
  });

  it('should render correct title and description', () => {
    renderWithProvider(<GlobalAnnouncements />);
    expect(screen.getByText('Global Announcements')).toBeInTheDocument();
    expect(screen.getByText('Stay updated with important school news, events, and information')).toBeInTheDocument();
  });
});
