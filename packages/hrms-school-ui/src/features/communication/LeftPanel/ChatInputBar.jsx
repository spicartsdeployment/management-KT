import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import '../../../assets/scss/Communication.scss';

import PropTypes from 'prop-types';

/**
 * ChatInputBar - Message input area
 * @param {function} onSendMessage - Callback to send a message
 */
const ChatInputBar = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmoji && emojiButtonRef.current && !emojiButtonRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmoji]);

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSend();
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: handle file upload logic
      alert(`Selected file: ${file.name}`);
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmoji(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="chat-input-bar">
      <div className="chat-input-bar__wrapper">
        <input
          ref={inputRef}
          type="text"
          className="chat-input-bar__input"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="school-input-message"
        />
        <button 
          ref={emojiButtonRef}
          className="chat-input-bar__inside-button" 
          data-testid="school-button-emoji" 
          onClick={() => setShowEmoji(v => !v)}
        >
          <FaceSmileIcon />
          {showEmoji && (
            <div className="chat-input-bar__emoji-picker">
              {['😀','😂','😍','👍','🙏','🎉','😎','😢','🔥','❤️'].map(e => (
                <button key={e} onClick={() => handleEmojiClick(e)}>{e}</button>
              ))}
            </div>
          )}
        </button>
        <button className="chat-input-bar__inside-button" data-testid="school-button-attach-file" onClick={handleAttachClick}>
          <PaperClipIcon />
          <input
            ref={fileInputRef}
            type="file"
            className="chat-input-bar__file-input"
            onChange={handleFileChange}
            data-testid="school-input-attach-file"
          />
        </button>
      </div>
      <button
        className={`chat-input-bar__send-button ${message.trim() ? 'chat-input-bar__send-button--active' : 'chat-input-bar__send-button--disabled'}`}
        disabled={!message.trim()}
        onClick={handleSend}
        data-testid="school-button-send-message"
      >
        <PaperAirplaneIcon />
      </button>
    </div>
  );
};

ChatInputBar.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatInputBar;
