import React, { useState, useMemo, useEffect } from 'react';
import LeftPanel from './LeftPanel/LeftPanel';
import RightPanel from './RightPanel/RightPanel';
import AddChatModal from './AddChatModal/AddChatModal';
import { chatData } from '../../constants/chatData';
import '../../assets/scss/communication.css';
import '../../assets/scss/Communication.scss';

/**
 * ChatContainer - Main two-column chat layout with add chat modal
 * @returns {JSX.Element}
 */
const ChatContainer = () => {
  // State management
  const [selectedChatId, setSelectedChatId] = useState('chat1');
  const [deletedChatIds, setDeletedChatIds] = useState([]);
  const [newChats, setNewChats] = useState([]);
  const [showAddChatModal, setShowAddChatModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'groups' | 'direct' - for RightPanel chat list filtering
  const [pendingChatId, setPendingChatId] = useState(null); // Store chat ID to select after state updates
  const [readChatIds, setReadChatIds] = useState([]); // Track which chats have been opened
  const [mutedChatIds, setMutedChatIds] = useState([]); // Track which chats have notifications muted
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat' — for mobile single-view navigation

  // Combine new chats first (on top), then original chats - remove duplicates by ID
  const allChats = useMemo(() => {
    const newChatIds = newChats.map(c => c.id);
    const uniqueOriginalChats = chatData.filter(c => !newChatIds.includes(c.id));
    return [...newChats, ...uniqueOriginalChats];
  }, [newChats]);
  
  // Filter out deleted chats
  const availableChats = useMemo(
    () => allChats.filter(chat => !deletedChatIds.includes(chat.id)),
    [allChats, deletedChatIds]
  );

  // Sort chats by most recent activity (updatedAt or last message date)
  const sortedAvailableChats = useMemo(() => {
    const getActivityTimestamp = (chat) => {
      if (chat.updatedAt) {
        const ts = Date.parse(chat.updatedAt);
        if (!Number.isNaN(ts)) return ts;
      }
      const lastMsg = chat.messages && chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1]
        : null;
      if (lastMsg && lastMsg.date) {
        const ts = Date.parse(lastMsg.date);
        if (!Number.isNaN(ts)) return ts;
      }
      return 0;
    };
    return [...availableChats].sort((a, b) => getActivityTimestamp(b) - getActivityTimestamp(a));
  }, [availableChats]);

  // Get the currently selected chat object
  const selectedChat = useMemo(
    () => sortedAvailableChats.find(chat => chat.id === selectedChatId) || null,
    [sortedAvailableChats, selectedChatId]
  );

  // Effect to select pending chat after state updates
  useEffect(() => {
    if (pendingChatId && availableChats.find(c => c.id === pendingChatId)) {
      setSelectedChatId(pendingChatId);
      setPendingChatId(null);
    }
  }, [pendingChatId, availableChats]);

  // Mark chat as read when selected
  useEffect(() => {
    if (selectedChatId && !readChatIds.includes(selectedChatId)) {
      setReadChatIds([...readChatIds, selectedChatId]);
    }
  }, [selectedChatId, readChatIds]);

  const handleDeleteChat = (chatIdToDelete) => {
    const updatedDeletedIds = [...deletedChatIds, chatIdToDelete];
    setDeletedChatIds(updatedDeletedIds);
    
    // If deleted chat is currently selected, switch to first available non-deleted chat
    if (selectedChatId === chatIdToDelete) {
      const firstAvailableChat = availableChats.find(chat => chat.id !== chatIdToDelete);
      const nextChatId = firstAvailableChat ? firstAvailableChat.id : 'chat1';
      setSelectedChatId(nextChatId);
    }
  };

  const handleAddChat = (newChat) => {
    const chatWithId = {
      ...newChat,
      updatedAt: new Date().toISOString(),
    };
    // Add new chat to the TOP of the list
    setNewChats([chatWithId, ...newChats]);
    // Set pending chat ID - will be selected after state updates via useEffect
    setPendingChatId(chatWithId.id);
    setShowAddChatModal(false);
  };

  const handleToggleMute = (chatId) => {
    if (mutedChatIds.includes(chatId)) {
      // Unmute
      setMutedChatIds(mutedChatIds.filter(id => id !== chatId));
    } else {
      // Mute
      setMutedChatIds([...mutedChatIds, chatId]);
    }
  };

  // When opening modal, just show the modal
  const handleOpenAddChatModal = () => {
    setShowAddChatModal(true);
  };

  const handleSendMessage = (messageText) => {
    if (!messageText.trim() || !selectedChatId) return;
    
    const now = new Date();
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toISOString(),
      sender: 'me',
      avatar: '',
      initials: 'ME',
      delivered: true,
      seen: false,
    };

    // Update messages for the selected chat and move it to the top
    setNewChats(prevNewChats => {
      const chatIndex = prevNewChats.findIndex(c => c.id === selectedChatId);
      if (chatIndex !== -1) {
        const updatedChat = {
          ...prevNewChats[chatIndex],
          messages: [...(prevNewChats[chatIndex].messages || []), newMessage],
          lastMessage: messageText,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: false, // Remove new flag when message is sent
          status: 'sent', // Update status to sent
          updatedAt: now.toISOString(),
        };
        // Remove the chat from its current position and add it to the top
        const otherChats = prevNewChats.filter(c => c.id !== selectedChatId);
        return [updatedChat, ...otherChats];
      }
      return prevNewChats;
    });

    // Also update static chat data if it's an existing chat
    const existingChatIndex = chatData.findIndex(c => c.id === selectedChatId);
    if (existingChatIndex !== -1) {
      // For existing chats, we need to track messages in state
      const existingInNew = newChats.findIndex(c => c.id === selectedChatId);
      if (existingInNew === -1) {
        // Add existing chat to newChats with the new message at the TOP
        const existingChat = chatData[existingChatIndex];
        setNewChats(prevNewChats => [
          {
            ...existingChat,
            messages: [newMessage],
            lastMessage: messageText,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            updatedAt: now.toISOString(),
          },
          ...prevNewChats
        ]);
      }
    }
  };

  return (
    <>
      {/* Left Panel: Chat Window — hidden on mobile when showing list */}
      <div className={`comm-left-panel${mobileView === 'list' ? ' comm-left-panel--mobile-hidden' : ''}`}>
        <LeftPanel 
          key={selectedChatId}
          selectedChatId={selectedChatId}
          selectedChat={selectedChat}
          onDeleteChat={handleDeleteChat}
          allChats={sortedAvailableChats}
          onSendMessage={handleSendMessage}
          onToggleMute={handleToggleMute}
          mutedChatIds={mutedChatIds}
          onBack={() => setMobileView('list')}
        />
      </div>
      {/* Right Panel: Communication List — hidden on mobile when showing chat */}
      <div className={`comm-right-panel${mobileView === 'chat' ? ' comm-right-panel--mobile-hidden' : ''}`}>
        <RightPanel 
          selectedChatId={selectedChatId} 
          setSelectedChatId={(id) => { setSelectedChatId(id); setMobileView('chat'); }}
          deletedChatIds={deletedChatIds}
          allChats={sortedAvailableChats}
          onOpenAddChatModal={handleOpenAddChatModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          readChatIds={readChatIds}
          newChatIds={newChats.map(c => c.id)}
          mutedChatIds={mutedChatIds}
        />
      </div>
      
      <AddChatModal 
        isOpen={showAddChatModal}
        onOpenChange={setShowAddChatModal}
        onAddChat={handleAddChat}
        existingChats={sortedAvailableChats}
      />
    </>
  );
};

export default ChatContainer;
