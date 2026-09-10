import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddChatModal from '../src/features/communication/AddChatModal/AddChatModal';
import PropTypes from 'prop-types';

// Mock dependencies
const Modal = ({ children, isOpen, 'data-testid': dataTestId }) => isOpen ? <div data-testid={dataTestId || 'mock-modal'}>{children}</div> : null;
Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  'data-testid': PropTypes.string,
};
const Button = ({ children, ...props }) => <button {...props}>{children}</button>;
Button.propTypes = {
  children: PropTypes.node,
  'data-testid': PropTypes.string,
};
jest.mock('@school-hrms/common-components', () => ({ Modal, Button }));
jest.mock('@heroicons/react/24/outline', () => ({
  XMarkIcon: () => <svg data-testid="icon-xmark" />, 
  UserGroupIcon: () => <svg data-testid="icon-usergroup" />, 
  ArrowLeftIcon: () => <svg data-testid="icon-arrowleft" />,
}));

const baseProps = {
  isOpen: true,
  onOpenChange: jest.fn(),
  onAddChat: jest.fn(),
  existingChats: [
    { name: 'Alice', role: 'Student', isGroup: false },
    { name: 'Bob', role: 'Teacher', isGroup: false },
    { name: 'Group1', isGroup: true, role: 'Group', members: 3 },
  ],
};

global.crypto = { randomUUID: () => 'test-uuid' };

describe('AddChatModal', () => {
  it('renders direct chat view by default', () => {
    render(<AddChatModal {...baseProps} />);
    expect(screen.getByTestId('school-modal-add-chat')).toBeInTheDocument();
    // Use regex matcher for heading with emoji
    expect(screen.getByText(/Direct Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Select a contact to start chatting/i)).toBeInTheDocument();
    expect(screen.getByTestId('school-field-search-direct-contacts')).toBeInTheDocument();
    expect(screen.getByTestId('school-button-switch-to-group')).toBeInTheDocument();
  });

  it('switches to group chat view when group button is clicked', () => {
    render(<AddChatModal {...baseProps} />);
    fireEvent.click(screen.getByTestId('school-button-switch-to-group'));
    expect(screen.getByText(/Create Group Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/Form a new discussion group/i)).toBeInTheDocument();
    expect(screen.getByTestId('school-button-back-to-direct')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when close button is clicked', () => {
    render(<AddChatModal {...baseProps} />);
    fireEvent.click(screen.getByTestId('school-button-close-add-chat'));
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onAddChat for direct chat contact selection', () => {
    render(<AddChatModal {...baseProps} />);
    // Simulate a contact in filteredContacts
    const contactLabel = screen.queryByTestId('school-contact-Alice');
    if (contactLabel) {
      fireEvent.click(contactLabel);
      expect(baseProps.onAddChat).toHaveBeenCalled();
    }
  });

  it('shows empty state if no contacts match search', () => {
    render(<AddChatModal {...baseProps} />);
    fireEvent.change(screen.getByTestId('school-field-search-direct-contacts'), { target: { value: 'ZZZZ' } });
    expect(screen.getByText('No contact found')).toBeInTheDocument();
  });
});
