import React from 'react';
import ChatListItem from './ChatListItem';
import { chatData } from '../../../constants/chatData';
import '../../../assets/scss/Communication.scss';

/**
 * ChatList - Scrollable list of chats
 * @param {string} selectedChatId
 * @param {function} setSelectedChatId
 * @param {array} deletedChatIds - Array of deleted chat IDs to filter out
 * @param {array} readChatIds - Array of chat IDs that have been opened
 * @param {array} newChatIds - Array of newly created chat IDs
 * @param {array} allChats - All available chats (includes new chats)
 * @param {array} mutedChatIds - Array of chat IDs with notifications muted
 */

const ChatList = ({ selectedChatId, setSelectedChatId, tab, search, deletedChatIds = [], readChatIds = [], newChatIds = [], allChats = [], mutedChatIds = [] }) => {
  // Debugging: Track chat order and props
  console.log('ChatList - allChats:', allChats);
  // debugger;
  // Use allChats prop if provided, otherwise fallback to chatData
  const chatsToDisplay = allChats.length > 0 ? allChats : chatData;
  console.log('chatsToDisplay:...............dv ', chatsToDisplay);

  // Sort chats by createdAt (newest first), fallback to timestamp if needed
  const sortedChats = [...chatsToDisplay].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (a.timestamp && b.timestamp) {
      return b.timestamp.localeCompare(a.timestamp);
    }
    return 0;
  });

  let filteredChats = sortedChats.filter(c => !deletedChatIds.includes(c.id));
  if (tab === 'group' || tab === 'groups') filteredChats = filteredChats.filter(c => c.isGroup);
  else if (tab === 'direct') filteredChats = filteredChats.filter(c => !c.isGroup);
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    filteredChats = filteredChats.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.lastMessage.toLowerCase().includes(s)
    );
  }

  // Override unread count and isNew flag for chats that have been opened
  const getChatForList = chat => {
    if (readChatIds.includes(chat.id)) {
      return { ...chat, unread: 0, isNew: false };
    }
    return chat;
  };

  return (
    <div className="chat-list">
      {/* Debug: Print filteredChats order */}
      {console.log('ChatList - filteredChats:', filteredChats)}
      {filteredChats.length === 0 ? (
        <div className="chat-list__empty-state">
          <svg className="chat-list__empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C4.46957 16 3.96086 15.7893 3.58579 15.4142C3.21071 15.0391 3 14.5304 3 14V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V14C21 14.5304 20.7893 15.0391 20.4142 15.4142C20.0391 15.7893 19.5304 16 19 16H14L9 21V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="chat-list__empty-title">No {tab === 'group' || tab === 'groups' ? 'groups' : tab === 'direct' ? 'contacts' : 'chats'} found</p>
          <p className="chat-list__empty-subtitle">Try searching with a different {tab === 'group' || tab === 'groups' ? 'group' : 'contact'} name</p>
        </div>
      ) : (
        filteredChats.map(chat => (
          <React.Fragment key={chat.id}>
            {console.log('Rendering chat:', chat)}
            <ChatListItem
              chat={getChatForList(chat)}
              selected={selectedChatId === chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              isRead={readChatIds.includes(chat.id)}
              isNew={!readChatIds.includes(chat.id) && (chat.isNew || newChatIds.includes(chat.id))}
              isMuted={mutedChatIds.includes(chat.id)}
            />
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default ChatList;
