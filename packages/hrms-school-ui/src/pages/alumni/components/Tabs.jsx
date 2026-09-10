import React from 'react';
import PropTypes from 'prop-types';

const tabs = [
  { key: 'directory', label: 'Alumni Directory', testid: 'alumni-tabs-directory' },
  { key: 'events', label: 'Events', testid: 'alumni-tabs-events' },
  // Mentorship tab hidden — feature under construction
  // { key: 'mentorship', label: 'Mentorship', testid: 'alumni-tabs-mentorship' },
];

export default function Tabs({ activeTab, onTabChange }) {
  return (
    <div className="sch-alu-tabs-row">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`sch-alu-tab-btn ${activeTab === tab.key ? 'sch-alu-tab-active' : 'sch-alu-tab-inactive'}`}
          onClick={() => onTabChange(tab.key)}
          data-testid={tab.testid}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

