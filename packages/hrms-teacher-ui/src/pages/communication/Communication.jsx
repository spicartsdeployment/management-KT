import React, { useState, useMemo, useEffect, useRef } from 'react';
import AddChatModal from './AddChatModal';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Communication.scss';

const Communication = () => {
  // State management
  const [selectedChatId, setSelectedChatId] = useState('chat1');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'groups' | 'direct'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddChatModal, setShowAddChatModal] = useState(false);
  const [newChats, setNewChats] = useState([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const messagesAreaRef = useRef(null);

  // Mock chat data - teachers, students, groups
  const [staticChats] = useState([
    {
      id: 'com-chat1',
      name: 'Sarah Johnson',
      role: 'Parent - Grade 10A',
      avatar: '',
      initials: 'SJ',
      lastMessage: 'Thank you for the progress update!',
      time: '10:30 AM',
      unread: 2,
      type: 'direct',
      color: '#4f46e5',
      messages: [
        { id: 1, text: 'Hello, I wanted to ask about my child\'s progress', time: '10:15 AM', sender: 'com-them', initials: 'SJ', color: '#4f46e5' },
        { id: 2, text: 'Hi Sarah! Your child is doing excellent in Math.', time: '10:20 AM', sender: 'com-me', initials: 'ME', color: '#10b981' },
        { id: 3, text: 'Thank you for the progress update!', time: '10:30 AM', sender: 'com-them', initials: 'SJ', color: '#4f46e5' }
      ]
    },
    {
      id: 'com-chat2',
      name: 'Mathematics Department',
      role: '12 members',
      avatar: '',
      initials: 'MD',
      lastMessage: 'Meeting scheduled for tomorrow at 3 PM',
      time: 'Yesterday',
      unread: 0,
      type: 'group',
      color: '#06b6d4',
      messages: [
        { id: 1, text: 'Team, we need to finalize the curriculum', time: '2:00 PM', sender: 'com-them', initials: 'JD', color: '#06b6d4' },
        { id: 2, text: 'I have prepared the draft. Will share today.', time: '2:15 PM', sender: 'com-me', initials: 'ME', color: '#10b981' },
        { id: 3, text: 'Meeting scheduled for tomorrow at 3 PM', time: '3:00 PM', sender: 'com-them', initials: 'AD', color: '#06b6d4' }
      ]
    },
    {
      id: 'com-chat3',
      name: 'Principal Dr. Smith',
      role: 'Principal',
      avatar: '',
      initials: 'DS',
      lastMessage: 'Great work on the recent evaluation',
      time: '2 days ago',
      unread: 0,
      type: 'direct',
      color: '#4f46e5',
      messages: [
        { id: 1, text: 'I reviewed your student evaluations', time: '9:00 AM', sender: 'com-them', initials: 'DS', color: '#4f46e5' },
        { id: 2, text: 'Thank you! I tried to be thorough.', time: '9:30 AM', sender: 'com-me', initials: 'ME', color: '#10b981' },
        { id: 3, text: 'Great work on the recent evaluation', time: '10:00 AM', sender: 'com-them', initials: 'DS', color: '#4f46e5' }
      ]
    },
    {
      id: 'com-chat4',
      name: 'Class 10A Parents Group',
      role: '45 members',
      avatar: '',
      initials: 'CP',
      lastMessage: 'Homework assignments posted',
      time: '3 days ago',
      unread: 5,
      type: 'group',
      color: '#06b6d4',
      messages: [
        { id: 1, text: 'When is the next parent-teacher meeting?', time: '4:00 PM', sender: 'com-them', initials: 'MK', color: '#06b6d4' },
        { id: 2, text: 'It will be next Friday at 5 PM', time: '4:15 PM', sender: 'com-me', initials: 'ME', color: '#10b981' },
        { id: 3, text: 'Homework assignments posted', time: '5:00 PM', sender: 'com-me', initials: 'ME', color: '#10b981' }
      ]
    },
    {
      id: 'com-chat5',
      name: 'Michael Brown',
      role: 'Student - Class 12A',
      avatar: '',
      initials: 'MB',
      lastMessage: 'Thank you sir, I understand now',
      time: '1 week ago',
      unread: 0,
      type: 'direct',
      color: '#4f46e5',
      messages: [
        { id: 1, text: 'Sir, I need help with calculus homework', time: '3:00 PM', sender: 'com-them', initials: 'MB', color: '#4f46e5' },
        { id: 2, text: 'Sure! Which topic are you stuck on?', time: '3:10 PM', sender: 'com-me', initials: 'ME', color: '#10b981' },
        { id: 3, text: 'Thank you sir, I understand now', time: '3:30 PM', sender: 'com-them', initials: 'MB', color: '#4f46e5' }
      ]
    },
    {
      id: 'com-chat6',
      name: 'Staff Room',
      role: '28 members',
      avatar: '',
      initials: 'SR',
      lastMessage: 'Holiday notice shared',
      time: '1 week ago',
      unread: 0,
      type: 'group',
      color: '#14b8a6',
      messages: [
        { id: 1, text: 'Reminder: Staff meeting at 4 PM', time: '1:00 PM', sender: 'com-them', initials: 'com-AD', color: '#14b8a6' },
        { id: 2, text: 'I will be there', time: '1:15 PM', sender: 'com-me', initials: 'com-ME', color: '#10b981' },
        { id: 3, text: 'Holiday notice shared', time: '2:00 PM', sender: 'com-them', initials: 'com-HR', color: '#14b8a6' }
      ]
    }
  ]);

  // Combine new chats first (on top), then static chats
  const allChats = useMemo(() => [...newChats, ...staticChats], [newChats]);

  // Filter chats based on tab and search
  const filteredChats = useMemo(() => {
    let filtered = allChats;

    // Filter by tab
    if (activeTab === 'groups') {
      filtered = filtered.filter(chat => chat.type === 'group');
    } else if (activeTab === 'direct') {
      filtered = filtered.filter(chat => chat.type === 'direct');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [allChats, activeTab, searchQuery]);

  // Get selected chat
  const selectedChat = useMemo(
    () => allChats.find(chat => chat.id === selectedChatId) || allChats[0],
    [allChats, selectedChatId]
  );

  // Handle adding new chat from modal
  const handleAddChat = (newChat) => {
    setNewChats([newChat, ...newChats]);
    setSelectedChatId(newChat.id);
    setShowAddChatModal(false);
  };

  // Handle search in chat messages with highlighting
  useEffect(() => {
    if (showSearchInChat && chatSearchQuery.trim() && selectedChat?.messages) {
      const query = chatSearchQuery.trim().toLowerCase();
      const matchingMessage = selectedChat.messages.find(msg =>
        msg.text.toLowerCase().includes(query)
      );
      
      if (matchingMessage) {
        setHighlightedMessageId(matchingMessage.id);
        setSearchNotFound(false);
        
        // Scroll to highlighted message
        setTimeout(() => {
          const messageElement = document.querySelector(`[data-message-id="${matchingMessage.id}"]`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        setHighlightedMessageId(null);
        setSearchNotFound(true);
      }
    } else {
      setHighlightedMessageId(null);
      setSearchNotFound(false);
    }
  }, [chatSearchQuery, showSearchInChat, selectedChat]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const now = new Date();
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'com-me',
      initials: 'ME',
      color: '#10b981',
    };

    // Find and update the chat with the new message
    const chatIndex = newChats.findIndex(c => c.id === selectedChatId);
    if (chatIndex !== -1) {
      const updatedChats = [...newChats];
      updatedChats[chatIndex] = {
        ...updatedChats[chatIndex],
        messages: [...updatedChats[chatIndex].messages, newMessage],
        lastMessage: messageText,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setNewChats(updatedChats);
    } else {
      // If it's a static chat, add it to newChats with the new message
      const staticChat = staticChats.find(c => c.id === selectedChatId);
      if (staticChat) {
        setNewChats([{
          ...staticChat,
          messages: [...staticChat.messages, newMessage],
          lastMessage: messageText,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, ...newChats]);
      }
    }
    
    setMessageText('');
  };

  const handleDeleteChat = () => {
    console.log('Deleting chat:', selectedChatId);
    setShowDeleteModal(false);
  };

  return (
    <div className="com-hsu-teach-communication" data-testid="teacher-page-communication">
      <div className="com-hsu-teach-communication__container">
        
        {/* Left Side - Chat List */}
        <div className="com-hsu-teach-communication__left">
          <div className="com-hsu-teach-communication__chat-list">
            
            {/* Header */}
            <div className="com-hsu-teach-communication__list-header">
              <div className="com-hsu-teach-communication__header-content">
                <h2 className="com-hsu-teach-communication__header-title">
                  <span className="com-hsu-teach-communication__header-icon">💬</span>
                  Messages
                </h2>
                <button 
                  className="com-hsu-teach-communication__add-btn"
                  onClick={() => setShowAddChatModal(true)}
                  data-testid="teacher-button-new-chat"
                >
                  <span>+</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="com-hsu-teach-communication__search-section">
              <div className="com-hsu-teach-communication__search-bar">
                <span className="com-hsu-teach-communication__search-icon">🔍</span>
                <input
                  type="text"
                  className="com-hsu-teach-communication__search-input"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="teacher-input-search-chats"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="com-hsu-teach-communication__tabs">
              <button
                className={`com-hsu-teach-communication__tab ${activeTab === 'all' ? 'hsu-teach-communication__tab--active' : ''}`}
                onClick={() => setActiveTab('all')}
                data-testid="teacher-button-tab-all"
              >
                All
              </button>
              <button
                className={`com-hsu-teach-communication__tab ${activeTab === 'groups' ? 'hsu-teach-communication__tab--active' : ''}`}
                onClick={() => setActiveTab('groups')}
                data-testid="teacher-button-tab-groups"
              >
                Groups
              </button>
              <button
                className={`com-hsu-teach-communication__tab ${activeTab === 'direct' ? 'hsu-teach-communication__tab--active' : ''}`}
                onClick={() => setActiveTab('direct')}
                data-testid="teacher-button-tab-direct"
              >
                Direct
              </button>
            </div>

            {/* Chat List Items */}
            <div className="com-hsu-teach-communication__chats-container">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`com-hsu-teach-communication__chat-item ${
                    selectedChatId === chat.id ? 'hsu-teach-communication__chat-item--active' : ''
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
                  data-testid={`teacher-chat-item-${chat.id}`}
                >
                  <div className="com-hsu-teach-communication__chat-avatar" style={{ background: chat.color }}>
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} />
                    ) : (
                      <span>{chat.initials}</span>
                    )}
                  </div>
                  <div className="com-hsu-teach-communication__chat-content">
                    <div className="com-hsu-teach-communication__chat-header-row">
                      <h4 className="com-hsu-teach-communication__chat-name">{chat.name}</h4>
                      <span className="com-hsu-teach-communication__chat-time">{chat.time}</span>
                    </div>
                    <div className="com-hsu-teach-communication__chat-footer-row">
                      <p className="com-hsu-teach-communication__chat-message">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="com-hsu-teach-communication__unread-badge">{chat.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Chat Preview */}
        <div className="com-hsu-teach-communication__right">
          <div className="com-hsu-teach-communication__chat-preview">
            
            {/* Chat Header */}
            <div className="com-hsu-teach-communication__preview-header">
              <div className="com-hsu-teach-communication__preview-info">
                <div className="com-hsu-teach-communication__preview-avatar" style={{ background: selectedChat.color }}>
                  {selectedChat.avatar ? (
                    <img src={selectedChat.avatar} alt={selectedChat.name} />
                  ) : (
                    <span>{selectedChat.initials}</span>
                  )}
                </div>
                <div className="com-hsu-teach-communication__preview-details">
                  <h3 className="com-hsu-teach-communication__preview-name">{selectedChat.name}</h3>
                  <p className="com-hsu-teach-communication__preview-role">{selectedChat.role}</p>
                </div>
              </div>
              <div className="com-hsu-teach-communication__preview-actions">
                <button
                  className="com-hsu-teach-communication__action-btn"
                  onClick={() => setShowSearchInChat(!showSearchInChat)}
                  data-testid="teacher-button-search-in-chat"
                >
                  🔍
                </button>
                <button
                  className="com-hsu-teach-communication__action-btn"
                  onClick={() => setShowDeleteModal(true)}
                  data-testid="teacher-button-delete-chat"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Search in Chat */}
            {showSearchInChat && (
              <div className="com-hsu-teach-communication__chat-search">
                <input
                  type="text"
                  className="com-hsu-teach-communication__chat-search-input"
                  placeholder="Search in conversation..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  data-testid="teacher-input-search-messages"
                />
                <button
                  className="com-hsu-teach-communication__chat-search-close"
                  onClick={() => {
                    setShowSearchInChat(false);
                    setChatSearchQuery('');
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="com-hsu-teach-communication__messages-area" ref={messagesAreaRef}>
              {selectedChat.messages.length === 0 ? (
                <div className="com-hsu-teach-communication__empty-state" data-testid="teacher-message-empty-state">
                  <div className="com-hsu-teach-communication__empty-icon">💬</div>
                  <div className="com-hsu-teach-communication__empty-text">Send a message to start chat</div>
                </div>
              ) : (
                <>
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      data-message-id={message.id}
                      className={`com-hsu-teach-communication__message ${
                        message.sender === 'me' || message.sender === 'com-me'
                          ? 'hsu-teach-communication__message--sent' 
                          : 'hsu-teach-communication__message--received'
                      } ${highlightedMessageId === message.id ? 'com-hsu-teach-communication__message--highlighted' : ''}`}
                      data-testid={`teacher-message-${message.id}`}
                    >
                      {message.sender !== 'me' && message.sender !== 'com-me' && (
                        <div className="com-hsu-teach-communication__message-avatar" style={{ background: message.color }}>
                          <span>{message.initials}</span>
                        </div>
                      )}
                      <div className="com-hsu-teach-communication__message-content">
                        <div className="com-hsu-teach-communication__message-bubble">
                          {message.text}
                        </div>
                        <span className="com-hsu-teach-communication__message-time">{message.time}</span>
                      </div>
                      {(message.sender === 'me' || message.sender === 'com-me') && (
                        <div className="com-hsu-teach-communication__message-avatar" style={{ background: message.color }}>
                          <span>{message.initials}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {searchNotFound && showSearchInChat && (
                    <div className="com-hsu-teach-communication__search-not-found" data-testid="teacher-message-search-not-found">
                      No match found
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="com-hsu-teach-communication__input-area">
              <button className="com-hsu-teach-communication__attachment-btn" data-testid="teacher-button-attach">
                📎
              </button>
              <input
                type="text"
                className="com-hsu-teach-communication__message-input"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                data-testid="teacher-input-message"
              />
              <button
                className="com-hsu-teach-communication__send-btn"
                onClick={handleSendMessage}
                data-testid="teacher-button-send-message"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Chat Modal */}
      {showDeleteModal && (
        <div 
          className="com-hsu-teach-communication__modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="com-hsu-teach-communication__modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-delete-chat"
          >
            <div className="com-hsu-teach-communication__modal-header">
              <h3 className="com-hsu-teach-communication__modal-title">Delete Chat</h3>
              <button
                className="com-hsu-teach-communication__modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="com-hsu-teach-communication__modal-body">
              <p>Are you sure you want to delete this chat with <strong>{selectedChat.name}</strong>?</p>
              <p className="com-hsu-teach-communication__modal-warning">This action cannot be undone.</p>
            </div>
            <div className="com-hsu-teach-communication__modal-footer">
              <button
                className="com-hsu-teach-communication__modal-btn hsu-teach-communication__modal-btn--cancel"
                onClick={() => setShowDeleteModal(false)}
                data-testid="teacher-button-cancel-delete"
              >
                Cancel
              </button>
              <button
                className="com-hsu-teach-communication__modal-btn hsu-teach-communication__modal-btn--delete"
                onClick={handleDeleteChat}
                data-testid="teacher-button-confirm-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Chat Modal */}
      <AddChatModal
        isOpen={showAddChatModal}
        onClose={() => setShowAddChatModal(false)}
        onAddChat={handleAddChat}
        existingChats={allChats}
      />      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />    </div>
  );
};

export default Communication;
