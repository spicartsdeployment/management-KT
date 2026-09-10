import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DirectChatForm from '../src/features/communication/AddChatModal/DirectChatForm';

describe('DirectChatForm', () => {
  const availableContacts = [
    { name: 'Alice', role: 'Student', initials: 'A' },
    { name: 'Bob', role: 'Teacher', initials: 'B' },
    { name: 'Charlie', role: 'Parent', initials: 'C' },
  ];
  const baseFormData = {
    name: '',
    description: '',
    message: '',
    selectedContacts: [],
    selectedMembers: [],
  };
  it('renders search, contacts, and message fields', () => {
    render(
      <DirectChatForm
        formData={baseFormData}
        setFormData={jest.fn()}
        availableContacts={availableContacts}
      />
    );
    expect(screen.getByLabelText('Search Contacts')).toBeInTheDocument();
    expect(screen.getByLabelText('Initial Message')).toBeInTheDocument();
    expect(screen.getByTestId('school-field-search-direct-contacts')).toBeInTheDocument();
    expect(screen.getByTestId('school-field-direct-message')).toBeInTheDocument();
  });

  it('filters contacts by search', () => {
    render(
      <DirectChatForm
        formData={baseFormData}
        setFormData={jest.fn()}
        availableContacts={availableContacts}
      />
    );
    fireEvent.change(screen.getByTestId('school-field-search-direct-contacts'), { target: { value: 'Bob' } });
    expect(screen.getByTestId('school-radio-direct-contact-Bob')).toBeInTheDocument();
    expect(screen.queryByTestId('school-radio-direct-contact-Alice')).not.toBeInTheDocument();
  });

  it('calls setFormData when a contact is selected', () => {
    const setFormData = jest.fn();
    render(
      <DirectChatForm
        formData={baseFormData}
        setFormData={setFormData}
        availableContacts={availableContacts}
      />
    );
    fireEvent.click(screen.getByTestId('school-radio-direct-contact-Alice'));
    expect(setFormData).toHaveBeenCalled();
  });

  it('shows char count for message', () => {
    render(
      <DirectChatForm
        formData={{ ...baseFormData, message: 'Hello world!' }}
        setFormData={jest.fn()}
        availableContacts={availableContacts}
      />
    );
    expect(screen.getByText('12/500')).toBeInTheDocument();
  });

  it('shows empty state if no contacts match', () => {
    render(
      <DirectChatForm
        formData={baseFormData}
        setFormData={jest.fn()}
        availableContacts={availableContacts}
      />
    );
    fireEvent.change(screen.getByTestId('school-field-search-direct-contacts'), { target: { value: 'ZZZZ' } });
    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });
});
