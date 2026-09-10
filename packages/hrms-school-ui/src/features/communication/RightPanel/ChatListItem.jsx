import React, { useMemo } from 'react';
import '../../../assets/scss/Communication.scss';

// Avatar color options - exported for reuse across components
export const AVATAR_COLORS = [
  { background: 'rgba(59, 130, 246, 0.15)' },   // Blue
  { background: 'rgba(234, 88, 12, 0.15)' },    // Orange
  { background: 'rgba(239, 68, 68, 0.15)' },    // Red
  { background: 'rgba(99, 102, 241, 0.15)' },   // Indigo
];

// Simple hash function to get consistent color for same name - exported for reuse
export const getColorIndex = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_COLORS.length;
};

// Helper to get avatar style - exported for reuse
export const getAvatarStyle = (name) => {
  const colorIndex = getColorIndex(name || '');
  return {
    background: AVATAR_COLORS[colorIndex].background,
    color: 'rgb(31, 41, 55)',
    fontWeight: 600,
    fontSize: '13px'
  };
};

/**
 * ChatListItem - Individual chat preview row
 * @param {object} chat
 * @param {boolean} selected
 * @param {function} onClick
 * @param {boolean} isRead - Whether the chat has been opened
 * @param {boolean} isNew - Whether this is a newly created chat
 * @param {boolean} isMuted - Whether notifications are muted for this chat
 */
const ChatListItem = ({ chat, selected, onClick, isRead = false, isNew = false, isMuted = false }) => {
  // Get consistent avatar color based on chat name
  const avatarStyle = useMemo(() => {
    const colorIndex = getColorIndex(chat.name || '');
    return {
      background: AVATAR_COLORS[colorIndex].background,
      color: 'rgb(31, 41, 55)',
      fontWeight: 600,
      fontSize: '13px'
    };
  }, [chat.name]);

  return (
    <div
      className={`chat-list-item ${selected ? 'chat-list-item--selected' : ''}`}
      onClick={onClick}
      data-testid={`school-chat-list-item-${chat.id}`}
    >
      <div className="chat-list-item__avatar-wrapper">
        <div className="chat-list-item__avatar" style={avatarStyle}>
          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} />
          ) : (
            chat.initials
          )}
        </div>
        {chat.isOnline && (
          <span className="chat-list-item__online-indicator" data-testid="school-indicator-online" />
        )}
      </div>
      
      <div className="chat-list-item__content">
        <div className="chat-list-item__header">
          <span className="chat-list-item__name">{chat.name}</span>
          {chat.isGroup && (
            <span className="chat-list-item__group-label">(Group)</span>
          )}
          {isNew && (
            <span className="chat-list-item__new-badge" data-testid="school-badge-new-chat">New</span>
          )}
        </div>
        <div className="chat-list-item__last-message">{chat.lastMessage}</div>
      </div>
      
      <div className="chat-list-item__meta">
        <span className="chat-list-item__time">{chat.time}</span>
        <div className="chat-list-item__status">
          {/* Show mute icon if chat is muted */}
          {isMuted && (
            <svg 
              className="chat-list-item__mute-icon" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              data-testid="school-icon-muted-chat"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          )}
          {/* Show ticks for sent messages, unread badge for received messages */}
          {/* Don't show ticks for new conversations with no actual messages */}
          {chat.lastMessageSender === 'other' ? (
            // Last message was explicitly RECEIVED - show unread badge if unread
            chat.unread > 0 && !isRead ? (
              <span className="chat-list-item__unread-badge">{chat.unread}</span>
            ) : null
          ) : (!isNew && chat.lastMessage !== 'Started a conversation') ? (
            // Last message was SENT - show ticks only if not new and has actual messages
            <>
              {chat.status === 'seen' ? (
                <span className="chat-list-item__check chat-list-item__check--seen">✓✓</span>
              ) : chat.status === 'delivered' || chat.status === 'read' ? (
                <span className="chat-list-item__check chat-list-item__check--delivered">✓✓</span>
              ) : chat.status === 'sent' ? (
                <span className="chat-list-item__check chat-list-item__check--sent">✓</span>
              ) : null}
              {/* Show unread badge alongside if there are unread messages */}
              {!isRead && chat.unread > 0 && (
                <span className="chat-list-item__unread-badge">{chat.unread}</span>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
