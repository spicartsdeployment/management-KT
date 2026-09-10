import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInputBar from './ChatInputBar';
import '../../../assets/scss/Communication.scss';

/**
 * LeftPanel - Chat preview section
 * @param {string} selectedChatId
 * @param {object} selectedChat - The selected chat object
 * @param {function} onDeleteChat - Callback when chat is deleted
 * @param {array} allChats - All available chats (static + new)
 * @param {function} onSendMessage - Callback to send a new message
 */
const LeftPanel = ({ selectedChatId, selectedChat, onDeleteChat, allChats = [], onSendMessage, onToggleMute, mutedChatIds = [], onBack }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [notFound, setNotFound] = useState(false);
  
  return (
  <div className="comm-chat-panel">
      <ChatHeader
        key={selectedChatId}
        selectedChatId={selectedChatId}
        selectedChat={selectedChat}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        search={search}
        setSearch={setSearch}
        onDeleteChat={onDeleteChat}
        allChats={allChats}
        onToggleMute={onToggleMute}
        isMuted={mutedChatIds.includes(selectedChatId)}
        onBack={onBack}
      />
      <ChatMessages 
        key={`messages-${selectedChatId}`}
        selectedChatId={selectedChatId}
        selectedChat={selectedChat}
        search={searchOpen ? search : ''} 
        setNotFound={setNotFound}
        allChats={allChats}
      />
      {notFound && searchOpen && (
  <div className="comm-search-not-found" data-testid="school-message-search-not-found">
          No matching message found
        </div>
      )}
      <ChatInputBar 
        selectedChatId={selectedChatId} 
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

LeftPanel.propTypes = {
  selectedChatId: PropTypes.string,
  selectedChat: PropTypes.object,
  onDeleteChat: PropTypes.func,
  allChats: PropTypes.array,
  onSendMessage: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func,
  mutedChatIds: PropTypes.array,
  onBack: PropTypes.func
};

export default LeftPanel
