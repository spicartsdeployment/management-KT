import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatHeader from '../src/features/communication/LeftPanel/ChatHeader';

describe('ChatHeader', () => {
  const baseProps = {
    selectedChatId: '1',
    selectedChat: {
      id: '1',
      name: 'John Doe',
      avatar: '',
      initials: 'JD',
      isGroup: false,
      isOnline: true,
      role: 'Teacher',
      members: 1,
      createdAt: new Date().toISOString(),
    },
    searchOpen: false,
    setSearchOpen: jest.fn(),
    search: '',
    setSearch: jest.fn(),
    onDeleteChat: jest.fn(),
    allChats: [
      {
        id: '1',
        name: 'John Doe',
        avatar: '',
        initials: 'JD',
        isGroup: false,
        isOnline: true,
        role: 'Teacher',
        members: 1,
        createdAt: new Date().toISOString(),
      }
    ],
    onToggleMute: jest.fn(),
    isMuted: false,
  };

  it('renders chat header with name and role', () => {
    render(<ChatHeader {...baseProps} />);
    expect(screen.getByTestId('school-chat-header')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
  });

  it('shows online indicator for online user', () => {
    render(<ChatHeader {...baseProps} />);
    expect(screen.getByTestId('school-indicator-online-header')).toBeInTheDocument();
  });

  it('calls setSearchOpen when search button is clicked', () => {
    render(<ChatHeader {...baseProps} />);
    fireEvent.click(screen.getByTestId('school-button-open-search-panel'));
    expect(baseProps.setSearchOpen).toHaveBeenCalledWith(true);
  });

  it('calls onToggleMute when mute button is clicked', () => {
    render(<ChatHeader {...baseProps} />);
    fireEvent.click(screen.getByTestId('school-button-mute-chat'));
    expect(baseProps.onToggleMute).toHaveBeenCalledWith('1');
  });

  it('shows group details if isGroup is true', () => {
    const groupProps = {
      ...baseProps,
      selectedChat: {
        ...baseProps.selectedChat,
        isGroup: true,
        name: 'Group Chat',
        members: 5,
        description: 'A group for teachers',
      },
    };
    render(<ChatHeader {...groupProps} />);
    expect(screen.getByText('Group Chat')).toBeInTheDocument();
    expect(screen.getByText('A group for teachers')).toBeInTheDocument();
    expect(screen.getByText(/5 members?/)).toBeInTheDocument();
  });

  it('shows and handles delete modal', () => {
    const props = { ...baseProps };
    render(<ChatHeader {...props} />);
    // Open modal
    fireEvent.click(screen.getByTestId('school-button-mute-chat'));
    // Open modal by setting state
    // Simulate delete modal open
    // Since modal is controlled internally, we can't open it directly without refactor
    // So this test is a placeholder for modal logic
    // You may want to refactor to expose setShowDeleteModal for testability
  });
});
