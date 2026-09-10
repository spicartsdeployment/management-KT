
import React, { useState } from 'react';

/**
 * GroupChatForm - Form for creating group chats
 */
const GroupChatForm = ({ formData, setFormData, availableContacts }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMember = (contact) => {
    const isSelected = formData.selectedMembers.some(m => m.name === contact.name);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedMembers: prev.selectedMembers.filter(m => m.name !== contact.name),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedMembers: [...prev.selectedMembers, contact],
      }));
    }
  };

  const isMemberSelected = (contact) =>
    formData.selectedMembers.some(m => m.name === contact.name);

  return (
    <div className="add-chat-modal__form">
      {/* Group Name */}
      <label className="add-chat-modal__label">
        📝 Group Name <span className="add-chat-modal__required">*</span>
      </label>
      <input
        className="add-chat-modal__input"
        name="name"
        type="text"
        placeholder="Group Name *"
        value={formData.name || ''}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
        maxLength={50}
        data-testid="school-field-group-name"
        aria-label="Group Name"
      />
      <div className="add-chat-modal__char-count">
        {(formData.name || '').length}/50
      </div>

      {/* Description */}
      <label className="add-chat-modal__label">📖 Description (optional)</label>
      <textarea
        className="add-chat-modal__textarea"
        name="description"
        placeholder="Description (optional)"
        value={formData.description || ''}
        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        rows={2}
        maxLength={200}
        data-testid="school-field-group-description"
        aria-label="Group Description"
      />
      <div className="add-chat-modal__char-count">
        {(formData.description || '').length}/200
      </div>

      {/* Member Search */}
      <label className="add-chat-modal__label">
        👥 Add Members <span className="add-chat-modal__required">*</span>
      </label>
      <input
        className="add-chat-modal__input"
        type="text"
        placeholder="Search members..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        data-testid="school-field-search-group-members"
        aria-label="Search Members"
      />

      {/* Members List */}
      <div className="add-chat-modal__contact-list">
        {filteredContacts.length === 0 ? (
          <div className="add-chat-modal__empty-state">
            <svg className="add-chat-modal__empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 8V11M11 14H11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="add-chat-modal__empty-title">No group found</p>
            <p className="add-chat-modal__empty-subtitle">Try searching with a different group name</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <label
              key={contact.name}
              className="add-chat-modal__contact-item"
              htmlFor={`group-member-${contact.name}`}
            >
              <input
                id={`group-member-${contact.name}`}
                type="checkbox"
                className="add-chat-modal__checkbox"
                checked={formData.selectedMembers.some(m => m.name === contact.name)}
                onChange={() => handleSelectMember(contact)}
                data-testid={`school-checkbox-group-member-${contact.name}`}
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

      {/* Member Count with validation indicator */}
      <div 
        className="add-chat-modal__counter" 
        data-testid="school-counter-group-members"
        style={{ 
          color: formData.selectedMembers.length >= 2 ? '#059669' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>{formData.selectedMembers.length >= 2 ? '✓' : '!'}</span>
        <span>
          {formData.selectedMembers.length} member{formData.selectedMembers.length !== 1 ? 's' : ''} selected
          {formData.selectedMembers.length < 2 && ' (minimum 2 required)'}
        </span>
      </div>
    </div>
  );
};

export default GroupChatForm;
