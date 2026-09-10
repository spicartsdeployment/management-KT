import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { getMessagesByChatId } from '../../../constants/chatData';
import { getAvatarStyle } from '../RightPanel/ChatListItem';
import '../../../assets/scss/Communication.scss';
import PropTypes from 'prop-types';

/**
 * ChatMessages - Scrollable chat area
 * @param {string} selectedChatId
 * @param {object} selectedChat - The selected chat object
 * @param {array} allChats - All available chats
 */
const ChatMessages = ({ selectedChatId, selectedChat, search, setNotFound }) => {
  // Get messages priority: 
  // 1. Custom messages from selectedChat.messages (includes new messages sent)
  // 2. Original messages from getMessagesByChatId (for existing chats)
  const originalMessages = getMessagesByChatId(selectedChatId);
  
  // Combine: if we have custom messages, append them to original messages
  const messages = React.useMemo(() => {
    const customMessages = selectedChat?.messages || [];
    return customMessages.length > 0 
      ? [...originalMessages, ...customMessages]
      : originalMessages;
  }, [selectedChat?.messages, originalMessages]);
  
  const containerRef = useRef(null);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  
  // Auto-scroll to latest message when messages change
  useEffect(() => {
    if (!search || !search.trim()) {
      setTimeout(() => {
        const allMsgs = containerRef.current && containerRef.current.querySelectorAll('[data-testid^="school-message-"]');
        if (allMsgs && allMsgs.length > 0) {
          allMsgs[allMsgs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    }
  }, [messages.length, search]);
  
  useEffect(() => {
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      const idx = messages.findIndex(m => m.text && m.text.toLowerCase().includes(s));
      if (idx !== -1) {
        setHighlightIdx(idx);
        setNotFound(false);
        setTimeout(() => {
          const msgDiv = containerRef.current && containerRef.current.querySelectorAll('[data-testid^="school-message-"]')[idx];
          if (msgDiv) {
            msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        setHighlightIdx(-1);
        setNotFound(true);
      }
    } else {
      setHighlightIdx(-1);
      setNotFound(false);
      // Scroll to latest message when search is cleared or not active
      setTimeout(() => {
        const allMsgs = containerRef.current && containerRef.current.querySelectorAll('[data-testid^="school-message-"]');
        if (allMsgs && allMsgs.length > 0) {
          allMsgs[allMsgs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 100);
    }
  }, [search, messages, setNotFound]);
  
  // Helper to format date labels
  const formatDateLabel = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-GB', options);
    }
  };
  
  // Group messages by date
  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = currentMsg.date ? new Date(currentMsg.date).toDateString() : new Date().toDateString();
    const prevDate = prevMsg.date ? new Date(prevMsg.date).toDateString() : new Date().toDateString();
    return currentDate !== prevDate;
  };
  
  return (
    <div ref={containerRef} className="comm-messages-container">
      {messages.length === 0 ? (
        <div className="comm-messages-empty-state">
          <div className="comm-messages-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="comm-messages-empty-title">
            {selectedChat?.isGroup ? 'Start Group Conversation' : 'Start Conversation'}
          </h3>
          <p className="comm-messages-empty-subtitle">
            {selectedChat?.isGroup 
              ? 'No messages yet. Be the first to share something with the group!'
              : 'No messages yet. Say hi and start the conversation!'}
          </p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          // Get avatar style based on sender initials for consistency
          const msgAvatarStyle = getAvatarStyle(msg.initials || 'UK');
          const showDateSeparator = shouldShowDateSeparator(msg, messages[idx - 1]);
          
          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="comm-date-separator">
                  <div className="comm-date-badge">
                    {formatDateLabel(msg.date)}
                  </div>
                </div>
              )}
              <div data-testid={`school-message-${msg.id}`} className={`comm-message-row ${msg.sender === 'me' ? 'comm-message-row-sent' : 'comm-message-row-received'}`}>
                <div className={`comm-message-wrapper ${msg.sender === 'me' ? 'comm-message-wrapper-sent' : ''}`}>
                  <div 
                    className="comm-message-avatar"
                    style={{ ...msgAvatarStyle, width: '35px', height: '35px'}}
                  >
                    {msg.avatar ? <img src={msg.avatar} alt={msg.initials} className="comm-message-avatar-img" /> : msg.initials}
                  </div>
                  <MessageBubble msg={msg} highlight={highlightIdx === idx} />
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

ChatMessages.propTypes = {
  selectedChatId: PropTypes.string,
  selectedChat: PropTypes.object,
  search: PropTypes.string,
  setNotFound: PropTypes.func
};

export default ChatMessages;
