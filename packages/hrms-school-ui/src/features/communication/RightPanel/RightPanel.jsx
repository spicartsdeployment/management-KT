import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CommunicationHeader from './CommunicationHeader';
import SearchBar from './SearchBar';
import ChatTabs from './ChatTabs';
import ChatList from './ChatList';
import '../../../assets/scss/Communication.scss';

/**
 * RightPanel - Contacts and chat list section
 * @param {string} selectedChatId
 * @param {function} setSelectedChatId
 * @param {array} deletedChatIds - Array of deleted chat IDs to filter out
 * @param {array} allChats - Available chats to display
 * @param {function} onOpenAddChatModal - Callback to open add chat modal
 * @param {string} activeTab - Current active tab ('all', 'groups', 'direct')
 * @param {function} setActiveTab - Callback to set active tab
 * @param {array} readChatIds - Array of chat IDs that have been opened
 * @param {array} newChatIds - Array of newly created chat IDs
 */
const RightPanel = ({ 
  selectedChatId, 
  setSelectedChatId, 
  onSearchFocus, 
  deletedChatIds = [],
  allChats = [],
  onOpenAddChatModal,
  activeTab = 'all',
  setActiveTab,
  readChatIds = [],
  newChatIds = [],
  mutedChatIds = []
}) => {
  const [search, setSearch] = useState('');

  return (
    <div className="comm-contacts-panel">
      {/* Header with Add Chat Button */}
      <div className="comm-contacts-header">
        <CommunicationHeader />
        <button
          onClick={onOpenAddChatModal}
          className="comm-add-btn"
          style={{ 
            background: 'rgb(144, 184, 214)', 
            border: 'none',
            borderRadius: '50%',
            color: 'rgb(255, 255, 255)'
          }}
          title="Add new chat"
          data-testid="school-button-add-chat"
          aria-label="Add new chat"
        >
          <PlusIcon className="sch-comm-icon-sm" />
        </button>
      </div>
      
      <SearchBar search={search} setSearch={setSearch} />
      <ChatTabs tab={activeTab} setTab={setActiveTab} />
      <ChatList 
        selectedChatId={selectedChatId} 
        setSelectedChatId={setSelectedChatId} 
        tab={activeTab} 
        search={search} 
        deletedChatIds={deletedChatIds}
        readChatIds={readChatIds}
        newChatIds={newChatIds}
        allChats={allChats}
        mutedChatIds={mutedChatIds}
      />
    </div>
  );
};

export default RightPanel;
