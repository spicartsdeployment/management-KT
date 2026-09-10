import React, { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from '@school-hrms/common-components';
import { XMarkIcon, UserGroupIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { chatData, availableStudents } from "../../../constants/chatData";
import GroupChatForm from "./GroupChatForm";
import "../../../assets/scss/AddChatModal.css";

/**
 * AddChatModal - Unified modal for creating direct and group chats
 * Opens with Direct Chat view, with option to switch to Group Chat creation
 */
const AddChatModal = ({ isOpen, onOpenChange, onAddChat, existingChats = [] }) => {
  // View state: 'direct' or 'group'
  const [currentView, setCurrentView] = useState('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    message: "",
    selectedContacts: [],
    selectedMembers: [],
  });

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      message: "",
      selectedContacts: [],
      selectedMembers: [],
    });
    setSearchQuery('');
    setCurrentView('direct');
    if (typeof onOpenChange === "function") onOpenChange(false);
  };

  // Build availableContacts from chatData, availableStudents, AND existingChats
  const availableContacts = useMemo(() => {
    const contacts = new Map();
    // 1. Add all contacts from chatData (teachers, staff, parents with existing chats)
    chatData.forEach((chat) => {
      if (chat.type === "direct" && chat.name && chat.role) {
        contacts.set(chat.name.toLowerCase(), {
          name: chat.name,
          role: chat.role,
          initials: chat.initials,
        });
      }
    });
    // 2. Add all students from availableStudents (students available for chat)
    availableStudents.forEach((student) => {
      contacts.set(student.name.toLowerCase(), {
        name: student.name,
        role: student.role,
        initials: student.initials,
      });
    });
    // 3. Add any newly created contacts from existingChats
    existingChats.forEach((chat) => {
      if (!chat.isGroup && chat.name && chat.role) {
        contacts.set(chat.name.toLowerCase(), {
          name: chat.name,
          role: chat.role,
          initials: chat.initials,
        });
      }
    });
    // Ensure unique key for each contact (avoid duplicate key warning)
    return Array.from(contacts.values()).map((contact, idx) => ({ ...contact, _key: `${contact.name}-${contact.role}-${idx}` }));
  }, [existingChats]);

  // Contacts available for direct chat (filter out existing direct chats)
  const directChatContacts = useMemo(() => {
    const existingDirectChatNames = existingChats
      .filter(chat => !chat.isGroup)
      .map(chat => chat.name.toLowerCase());
    
    return availableContacts.filter(contact => 
      !existingDirectChatNames.includes(contact.name.toLowerCase())
    );
  }, [availableContacts, existingChats]);

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
    const chatId = `chat-d${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newChat = {
      id: chatId,
      type: "direct",
      isGroup: false,
      name: contact.name,
      role: contact.role,
      initials: contact.initials,
      lastMessage: "Started a conversation",
      lastMessageSender: 'me', // User started the conversation
      unread: 0,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now.toISOString(),
      avatar: '',
      messageCount: 0,
      status: 'sent',
      createdAt: now.toISOString(),
      isNew: true,
      messages: [],
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
    // Generate UUID for group
    const groupId = `group-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}`;
    const newChat = {
      id: groupId,
      type: "group",
      isGroup: true,
      name: formData.name.trim(),
      description: formData.description.trim() || '',
      members: formData.selectedMembers.length,
      membersList: formData.selectedMembers,
      initials: formData.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2),
      lastMessage: `Group created with ${formData.selectedMembers.length} members`,
      lastMessageSender: 'me', // Group creator sent the last message
      unread: 0,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now.toISOString(),
      avatar: '',
      messageCount: 0,
      status: 'sent',
      createdAt: now.toISOString(),
      isNew: true,
      messages: [],
    };
    onAddChat(newChat);
    handleClose();
  };

  // Switch to group chat view
  const handleSwitchToGroup = () => {
    setSearchQuery('');
    setFormData({
      name: "",
      description: "",
      message: "",
      selectedContacts: [],
      selectedMembers: [],
    });
    setCurrentView('group');
  };

  // Switch back to direct chat view
  const handleBackToDirect = () => {
    setSearchQuery('');
    setFormData({
      name: "",
      description: "",
      message: "",
      selectedContacts: [],
      selectedMembers: [],
    });
    setCurrentView('direct');
  };

  const isDirectView = currentView === 'direct';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      showCloseButton={false}
      className="add-chat-modal"
    >
      <div data-testid="school-modal-add-chat">
          {/* Header */}
          <div className="add_modal_header_description">
            <div className="add-chat-modal__header-left">
              {!isDirectView && (
                <button
                  onClick={handleBackToDirect}
                  className="add-chat-modal__back-btn"
                  aria-label="Back to Direct Chat"
                  data-testid="school-button-back-to-direct"
                >
                  <ArrowLeftIcon style={{ width: 'clamp(16px, 2.5vw, 20px)', height: 'clamp(16px, 2.5vw, 20px)', color: "#4b5563" }} />
                </button>
              )}
              <div>
                <h2 className="add-chat-modal__title">
                  {isDirectView ? "💬 Direct Chat" : "👥 Create Group Chat"}
                </h2>
                <p className="add-chat-modal__subtitle">
                  {isDirectView
                    ? "Select a contact to start chatting"
                    : "Form a new discussion group"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="add-chat-modal__close-btn"
              aria-label="Close"
              data-testid="school-button-close-add-chat"
            >
              <XMarkIcon style={{ width: 'clamp(18px, 3vw, 22px)', height: 'clamp(18px, 3vw, 22px)', color: "#4b5563" }} />
            </button>
          </div>

          {/* Body */}  
          <div className="add-chat-modal__body">
            {isDirectView ? (
              <div className="add-chat-modal__form">
                {/* Search Bar */}
                <label className="add-chat-modal__label">📋 Select Contact</label>
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
                    <div className="add-chat-modal__empty-state">
                      <svg className="add-chat-modal__empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11 8V11M11 14H11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="add-chat-modal__empty-title">No contact found</p>
                      <p className="add-chat-modal__empty-subtitle">Try searching with a different contact name</p>
                    </div>
                  ) : (
                    filteredContacts.map(contact => (
                      <label
                        key={contact._key}
                        className="add-chat-modal__contact-item add-chat-modal__contact-item--clickable"
                        onClick={() => handleSelectContact(contact)}
                        data-testid={`school-contact-${contact.name}`}
                      >
                        <input
                          type="radio"
                          name="selectedContact"
                          className="add-chat-modal__checkbox"
                          readOnly
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
                {/* Group Chat Button */}
                <div 
                  className="add-chat-modal__group-chat-block"
                  onClick={handleSwitchToGroup}
                  data-testid="school-button-switch-to-group"
                >
                  <div className="add-chat-modal__group-chat-icon">
                    <UserGroupIcon style={{ width: 'clamp(20px, 3vw, 24px)', height: 'clamp(20px, 3vw, 24px)' }} />
                  </div>
                  <div className="add-chat-modal__group-chat-text">
                    <span className="add-chat-modal__group-chat-title"> Group Chat</span>
                    <span className="add-chat-modal__group-chat-subtitle">Create a new group with multiple members</span>
                  </div>
                  <span className="add-chat-modal__group-chat-arrow">→</span>
                </div>

                {/* Cancel Button */}
                <div className="std-add-modal-footer-btns-con" style={{ justifyContent: 'center' }}>
                  <Button
                    variant="secondary"
                    className="add-chat-modal__button add-chat-modal__button--secondary"
                    onClick={handleClose}
                    style={{ width: '100%' }}
                    data-testid="school-button-cancel-add-chat"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <GroupChatForm
                  formData={formData}
                  setFormData={setFormData}
                  availableContacts={availableContacts}
                />

                <div className="std-add-modal-footer-btns-con">
                  <Button
                    variant="secondary"
                    className="add-chat-modal__button add-chat-modal__button--secondary"
                    onClick={handleBackToDirect}
                    data-testid="school-button-back-add-chat"
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    className="add-chat-modal__button add-chat-modal__button--primary"
                    onClick={handleGroupChatSubmit}
                    disabled={!formData.name.trim() || formData.selectedMembers.length < 2}
                    data-testid="school-button-confirm-add-chat"
                  >
                    ✓ Create Group
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
  );
}

AddChatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onAddChat: PropTypes.func.isRequired,
  existingChats: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    isGroup: PropTypes.bool,
    initials: PropTypes.string,
    members: PropTypes.number,
  })),
};
export default AddChatModal;
