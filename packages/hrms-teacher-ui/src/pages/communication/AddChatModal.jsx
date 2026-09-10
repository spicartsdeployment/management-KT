import React, { useState, useMemo } from "react";
import { XMarkIcon, UserGroupIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import "../../assets/scss/AddChatModal.scss";

// Available contacts for teachers (students, parents, other teachers, staff)
const availableContacts = [
  { name: "Vikram Singh", role: "Student - Class 12A", initials: "VS" },
  { name: "Meera Joshi", role: "Student - Class 10B", initials: "MJ" },
  { name: "Arjun Desai", role: "Student - Class 9B", initials: "AD" },
  { name: "Priya Nair", role: "Student - Class 11B", initials: "PN" },
  { name: "Karan Malhotra", role: "Student - Class 12C", initials: "KM" },
  { name: "Mrs. Sharma", role: "Parent - Vikram Singh", initials: "MS" },
  { name: "Mr. Joshi", role: "Parent - Meera Joshi", initials: "MJ" },
  { name: "Dr. Kapoor", role: "Principal", initials: "DK" },
  { name: "Ms. Patel", role: "Science Teacher", initials: "MP" },
  { name: "Mr. Kumar", role: "Math Teacher", initials: "MK" },
  { name: "Ms. Reddy", role: "English Teacher", initials: "MR" },
  { name: "Mrs. Gupta", role: "Parent - Arjun Desai", initials: "MG" },
];

/**
 * AddChatModal - Modal for creating direct and group chats
 */
const AddChatModal = ({ isOpen, onClose, onAddChat, existingChats = [] }) => {
  const [currentView, setCurrentView] = useState('direct'); // 'direct' or 'group'
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedMembers: [],
  });

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      selectedMembers: [],
    });
    setSearchQuery('');
    setCurrentView('direct');
    onClose();
  };

  // Contacts available for direct chat (filter out existing direct chats)
  const directChatContacts = useMemo(() => {
    const existingDirectChatNames = existingChats
      .filter(chat => chat.type === 'direct')
      .map(chat => chat.name.toLowerCase());
    
    return availableContacts.filter(contact => 
      !existingDirectChatNames.includes(contact.name.toLowerCase())
    );
  }, [existingChats]);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    return directChatContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [directChatContacts, searchQuery]);

  // Handle selecting a contact - immediately create and open chat
  const handleSelectContact = (contact) => {
    const now = new Date();
    const chatId = `teacher-chat-${Date.now()}`;
    const newChat = {
      id: chatId,
      type: "direct",
      name: contact.name,
      role: contact.role,
      initials: contact.initials,
      lastMessage: "Start a conversation",
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: 0,
      avatar: '',
      color: '#4f46e5', // Blue for direct
      messages: [],
      isNew: true,
    };
    onAddChat(newChat);
    handleClose();
  };

  // Handle group chat submission
  const handleGroupChatSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (formData.selectedMembers.length < 2) {
      alert("Please select at least 2 members");
      return;
    }
    const now = new Date();
    const groupId = `teacher-group-${Date.now()}`;
    const newChat = {
      id: groupId,
      type: "group",
      name: formData.name.trim(),
      role: `${formData.selectedMembers.length} members`,
      initials: formData.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2),
      lastMessage: `Group created with ${formData.selectedMembers.length} members`,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: 0,
      avatar: '',
      color: '#06b6d4', // Seablue for group
      messages: [],
      membersList: formData.selectedMembers,
      isNew: true,
    };
    onAddChat(newChat);
    handleClose();
  };

  // Toggle member selection for group chat
  const toggleMember = (contact) => {
    const isSelected = formData.selectedMembers.some(m => m.name === contact.name);
    if (isSelected) {
      setFormData({
        ...formData,
        selectedMembers: formData.selectedMembers.filter(m => m.name !== contact.name)
      });
    } else {
      setFormData({
        ...formData,
        selectedMembers: [...formData.selectedMembers, contact]
      });
    }
  };

  const isDirectView = currentView === 'direct';

  // Filter contacts for group chat based on search
  const filteredGroupContacts = useMemo(() => {
    return availableContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="teach-add-chat-modal-overlay" onClick={handleClose}>
      <div className="teach-add-chat-modal" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-add-chat">{/* Header */}
        <div className="teach-add-chat-modal__header">
          <div className="teach-add-chat-modal__header-left">
            {!isDirectView && (
              <button
                onClick={() => setCurrentView('direct')}
                className="teach-add-chat-modal__back-btn"
                aria-label="Back to Direct Chat"
                data-testid="teacher-button-back-to-direct"
              >
                <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
              </button>
            )}
            <div>
              <h2 className="teach-add-chat-modal__title">
                {isDirectView ? "New chat" : "Create Group Chat"}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="teach-add-chat-modal__close-btn"
            aria-label="Close"
            data-testid="teacher-button-close-add-chat"
          >
            <XMarkIcon style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Body */}  
        <div className="teach-add-chat-modal__body">
          {isDirectView ? (
            <div className="teach-add-chat-modal__form">
              {/* Search Bar */}
              <div className="teach-add-chat-modal__search-wrapper">
                <span className="teach-add-chat-modal__search-icon">🔍</span>
                <input
                  className="teach-add-chat-modal__search-input"
                  type="text"
                  placeholder="Search name or number"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  data-testid="teacher-field-search-direct-contacts"
                  aria-label="Search Contacts"
                />
              </div>

              {/* New Group Button */}
              <div 
                className="teach-add-chat-modal__new-group"
                onClick={() => setCurrentView('group')}
                data-testid="teacher-button-switch-to-group"
              >
                <div className="teach-add-chat-modal__new-group-icon">
                  <UserGroupIcon style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="teach-add-chat-modal__new-group-text">New group</span>
              </div>

              {/* Contacts Label */}
              <div className="teach-add-chat-modal__contacts-label">CONTACTS ON CLASS</div>

              {/* Contacts List */}
              <div className="teach-add-chat-modal__contact-list">
                {filteredContacts.length === 0 ? (
                  <div className="teach-add-chat-modal__no-contacts">
                    No contacts found
                  </div>
                ) : (
                  filteredContacts.map(contact => (
                    <div
                      key={contact.name}
                      className="teach-add-chat-modal__contact-item"
                      onClick={() => handleSelectContact(contact)}
                      data-testid={`teacher-contact-${contact.name}`}
                    >
                      <div 
                        className="teach-add-chat-modal__contact-avatar"
                        style={{ background: '#4f46e5' }}
                      >
                        {contact.initials}
                      </div>
                      <div className="teach-add-chat-modal__contact-info">
                        <div className="teach-add-chat-modal__contact-name">{contact.name}</div>
                        <div className="teach-add-chat-modal__contact-role">{contact.role}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="teach-add-chat-modal__group-form">
              {/* Group Name Input */}
              <input
                className="teach-add-chat-modal__group-input"
                type="text"
                placeholder="Group name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                data-testid="teacher-field-group-name"
              />

              {/* Member Search */}
              <div className="teach-add-chat-modal__search-wrapper">
                <span className="teach-add-chat-modal__search-icon">🔍</span>
                <input
                  className="teach-add-chat-modal__search-input"
                  type="text"
                  placeholder="Search members"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  data-testid="teacher-field-search-group-members"
                />
              </div>

              {/* Selected Members Count */}
              {formData.selectedMembers.length > 0 && (
                <div className="teach-add-chat-modal__selected-count">
                  {formData.selectedMembers.length} member{formData.selectedMembers.length > 1 ? 's' : ''} selected
                </div>
              )}

              {/* Contacts Label */}
              <div className="teach-add-chat-modal__contacts-label">SELECT MEMBERS</div>

              {/* Members List with Checkboxes */}
              <div className="teach-add-chat-modal__contact-list">
                {filteredGroupContacts.map(contact => {
                  const isSelected = formData.selectedMembers.some(m => m.name === contact.name);
                  return (
                    <div
                      key={contact.name}
                      className="teach-add-chat-modal__contact-item"
                      onClick={() => toggleMember(contact)}
                      data-testid={`teacher-group-member-${contact.name}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}}
                        className="teach-add-chat-modal__checkbox"
                      />
                      <div 
                        className="teach-add-chat-modal__contact-avatar"
                        style={{ background: '#06b6d4' }}
                      >
                        {contact.initials}
                      </div>
                      <div className="teach-add-chat-modal__contact-info">
                        <div className="teach-add-chat-modal__contact-name">{contact.name}</div>
                        <div className="teach-add-chat-modal__contact-role">{contact.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Group Button */}
              <button
                className="teach-add-chat-modal__create-btn"
                onClick={handleGroupChatSubmit}
                disabled={!formData.name.trim() || formData.selectedMembers.length < 2}
                data-testid="teacher-button-create-group"
              >
                ✓ Create Group
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddChatModal;
