import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupChatForm from '../src/features/communication/AddChatModal/GroupChatForm';

describe('GroupChatForm', () => {
  const baseProps = {
    formData: {
      name: '',
      description: '',
      selectedMembers: [],
    },
    setFormData: jest.fn(),
    availableContacts: [
      { name: 'Alice', role: 'Student', initials: 'A' },
      { name: 'Bob', role: 'Teacher', initials: 'B' },
      { name: 'Charlie', role: 'Parent', initials: 'C' },
    ],
  };

  it('renders group name, description, and member search fields', () => {
    render(<GroupChatForm {...baseProps} />);
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Search Members/i)).toBeInTheDocument();
  });

  it('shows available contacts and allows selecting members', () => {
    const setFormData = jest.fn();
    render(<GroupChatForm {...baseProps} setFormData={setFormData} />);
    // All contacts should be listed (check by testid and text content)
    const alice = screen.getByTestId('school-checkbox-group-member-Alice').closest('label');
    const bob = screen.getByTestId('school-checkbox-group-member-Bob').closest('label');
    const charlie = screen.getByTestId('school-checkbox-group-member-Charlie').closest('label');
    expect(alice).toHaveTextContent('Alice');
    expect(alice).toHaveTextContent('Student');
    expect(bob).toHaveTextContent('Bob');
    expect(bob).toHaveTextContent('Teacher');
    expect(charlie).toHaveTextContent('Charlie');
    expect(charlie).toHaveTextContent('Parent');
    // Select Alice
    fireEvent.click(screen.getByTestId('school-checkbox-group-member-Alice'));
    expect(setFormData).toHaveBeenCalled();
  });

  it('shows member count and validation indicator', () => {
    render(
      <GroupChatForm
        {...baseProps}
        formData={{ ...baseProps.formData, selectedMembers: [baseProps.availableContacts[0]] }}
      />
    );
    expect(screen.getByTestId('school-counter-group-members')).toHaveTextContent('1 member');
    expect(screen.getByTestId('school-counter-group-members')).toHaveTextContent('minimum 2 required');
  });

  it('shows correct char count for name and description', () => {
    render(
      <GroupChatForm
        {...baseProps}
        formData={{ ...baseProps.formData, name: 'Test Group', description: 'A group for testing' }}
      />
    );
    expect(screen.getByText('10/50')).toBeInTheDocument();
    // Actual rendered is 19/200 due to whitespace/newline
    expect(screen.getByText('19/200')).toBeInTheDocument();
  });

  it('filters contacts by search', () => {
    render(<GroupChatForm {...baseProps} />);
    const searchInput = screen.getByLabelText('Search Members');
    fireEvent.change(searchInput, { target: { value: 'Bob' } });
    const bob = screen.getByTestId('school-checkbox-group-member-Bob').closest('label');
    expect(bob).toHaveTextContent('Bob');
    expect(bob).toHaveTextContent('Teacher');
    // Alice should not be in the document
    expect(screen.queryByTestId('school-checkbox-group-member-Alice')).toBeNull();
  });
});
