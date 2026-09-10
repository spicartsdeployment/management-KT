import React from 'react';
import '../../../assets/scss/Communication.scss';

/**
 * ChatTabs - Tabs for contact list with evenly distributed layout
 */
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'groups', label: 'Groups' },
  { id: 'direct', label: 'Direct' },
];

const ChatTabs = ({ tab, setTab }) => {
  return (
    <div className="chat-tabs">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`chat-tabs__tab ${tab === t.id ? 'chat-tabs__tab--active' : ''}`}
          onClick={() => setTab(t.id)}
          data-testid={`school-tab-${t.id}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ChatTabs;
