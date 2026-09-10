import React, { useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { chatData } from '../../../constants/chatData';
import { getAvatarStyle } from '../RightPanel/ChatListItem';
import '../../../assets/scss/Communication.scss';

/**
 * ChatHeader - Sticky chat header
 * @param {string} selectedChatId
 * @param {object} selectedChat - The selected chat object (passed from parent)
 * @param {function} onDeleteChat - Callback when user confirms delete
 * @param {array} allChats - All available chats (static + new)
 */

import PropTypes from 'prop-types';

function getChatFromProps(selectedChatId, selectedChat, allChats) {
  return (
    selectedChat ||
    allChats.find(c => c.id === selectedChatId) ||
    chatData.find(c => c.id === selectedChatId) ||
    allChats[0] ||
    chatData[0] || {
      name: 'Unknown',
      role: '',
      avatar: '',
      initials: 'UK',
      isGroup: false,
      members: 0,
    }
  );
}

function formatCreatedDate(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

const ChatHeader = ({ selectedChatId, selectedChat, searchOpen, setSearchOpen, search, setSearch, onDeleteChat, allChats = [], onToggleMute, isMuted = false, onBack }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const chat = getChatFromProps(selectedChatId, selectedChat, allChats);
  const avatarStyle = useMemo(() => getAvatarStyle(chat.name), [chat.name]);

  const handleOpenSearch = () => setSearchOpen(true);
  const handleCloseSearch = () => setSearchOpen(false);
  const handleClearSearch = () => setSearch('');
  const handleMuteToggle = () => onToggleMute(selectedChatId);
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDeleteChat(selectedChatId);
  };
  const handleDeleteCancel = () => setShowDeleteModal(false);

  return (
    <>
      <div className="chat-header" data-testid="school-chat-header">
        {onBack && (
          <button
            className="chat-header__back-btn"
            onClick={onBack}
            data-testid="school-button-back-to-chat-list"
            aria-label="Back to chat list"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className="chat-header__info">
          <div className="chat-header__avatar-wrapper">
            <div 
              className="chat-header__avatar"
              style={avatarStyle}
            >
              {chat.avatar ? <img src={chat.avatar} alt={chat.name} /> : (chat.initials || 'UK')}
            </div>
            {!chat.isGroup && chat.isOnline && (
              <span className="chat-header__online-indicator" data-testid="school-indicator-online-header" />
            )}
          </div>
          <div className="chat-header__details">
            <div className="chat-header__name">{chat.name}</div>
            {chat.isGroup ? (
              <>
                {chat.description && (
                  <div className="chat-header__description" title={chat.description}>
                    {chat.description}
                  </div>
                )}
                <div className="chat-header__meta">
                  {chat.members} member{chat.members !== 1 ? 's' : ''}
                  {chat.createdAt && ` • Created ${formatCreatedDate(chat.createdAt)}`}
                </div>
              </>
            ) : (
              <div className="chat-header__role">{chat.role || 'Contact'}</div>
            )}
          </div>
        </div>
        <div className="chat-header__actions">
          <div className="chat-header__search-wrapper">
            {!searchOpen ? (
              <button
                className="chat-header__search-button"
                onClick={handleOpenSearch}
                data-testid="school-button-open-search-panel"
              >
                <MagnifyingGlassIcon />
              </button>
            ) : (
              <div className="chat-header__search-panel">
                <div className="chat-header__search-container">
                  <div className="chat-header__search-box">
                    <input
                      type="text"
                      className="chat-header__search-input"
                      placeholder="Search messages..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      data-testid="school-input-search-messages"
                      autoFocus={searchOpen}
                    />
                    {search && (
                      <button
                        className="chat-header__clear-button"
                        onClick={handleClearSearch}
                        data-testid="school-button-clear-search"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                <button
                  className="chat-header__close-search-button"
                  onClick={handleCloseSearch}
                  data-testid="school-button-close-search-panel"
                  aria-label="Close search"
                >
                  <span>✕</span>
                </button>
              </div>
            )}
          </div>
          <button 
            className="chat-header__menu-button" 
            data-testid="school-button-mute-chat" 
            onClick={handleMuteToggle}
            title={isMuted ? "Unmute notifications" : "Mute notifications"}
            aria-label={isMuted ? "Unmute notifications" : "Mute notifications"}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      {showDeleteModal && (
        <div className="delete-modal__overlay">
          <div className="delete-modal__content" data-testid="school-modal-delete-chat">
            <div className="delete-modal__title">Are you sure you want to delete this chat?</div>
            <div className="delete-modal__actions">
              <button
                className="delete-modal__confirm-button"
                onClick={handleDeleteConfirm}
                data-testid="school-button-confirm-delete"
              >
                Yes
              </button>
              <button
                className="delete-modal__cancel-button"
                onClick={handleDeleteCancel}
                data-testid="school-button-cancel-delete"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ChatHeader.propTypes = {
  selectedChatId: PropTypes.string,
  selectedChat: PropTypes.object,
  searchOpen: PropTypes.bool.isRequired,
  setSearchOpen: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  allChats: PropTypes.array,
  onToggleMute: PropTypes.func.isRequired,
  isMuted: PropTypes.bool,
  onBack: PropTypes.func
};

export default ChatHeader;
