
import React, { useState } from 'react';

/**
 * DirectChatForm - Form for creating direct chats
 */
const DirectChatForm = ({ formData, setFormData, availableContacts }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedContact = formData.selectedContacts[0];

  const handleSelectContact = (contact) => {
    setFormData(prev => ({
      ...prev,
      selectedContacts: [contact],
    }));
  };

  return (
    <div className="add-chat-modal__form">
      {/* Contact Search */}
      <label className="add-chat-modal__label">📋 Select Contact <span className="add-chat-modal__required">*</span></label>
      <input
        className="add-chat-modal__input"
        type="text"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        data-testid="school-field-search-direct-contacts"
        aria-label="Search Contacts"
      />

      {/* Contacts List */}
      <div className="add-chat-modal__contact-list">
        {filteredContacts.length === 0 ? (
          <div className="add-chat-modal__contact-item" style={{ justifyContent: 'center', color: '#6b7280' }}>
            No contacts found
          </div>
        ) : (
          filteredContacts.map(contact => (
            <label
              key={contact.name}
              className="add-chat-modal__contact-item"
              htmlFor={`direct-contact-${contact.name}`}
            >
              <input
                id={`direct-contact-${contact.name}`}
                type="radio"
                name="selectedContact"
                className="add-chat-modal__checkbox"
                checked={selectedContact && selectedContact.name === contact.name}
                onChange={() => handleSelectContact(contact)}
                data-testid={`school-radio-direct-contact-${contact.name}`}
                aria-label={`Select ${contact.name}`}
              />
              <span className="add-chat-modal__avatar">{contact.initials}</span>
              <span className="add-chat-modal__contact-name">
                {contact.name} <span className="add-chat-modal__contact-role">({contact.role})</span>
              </span>
            </label>
          ))
        )}
      </div>

      {/* Optional Message */}
      <label className="add-chat-modal__label">✉️ Message (optional)</label>
      <textarea
        className="add-chat-modal__textarea"
        placeholder="Type your first message..."
        value={formData.message || ''}
        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
        maxLength={500}
        rows={3}
        data-testid="school-field-direct-message"
        aria-label="Initial Message"
      />
      <div className="add-chat-modal__char-count">
        {(formData.message || '').length}/500
      </div>
    </div>
  );
};

export default DirectChatForm;
