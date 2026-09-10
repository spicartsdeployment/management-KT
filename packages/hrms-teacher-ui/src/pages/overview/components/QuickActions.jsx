import React from 'react';

const QuickActions = () => {
  const actions = [
    { label: 'Mark Attendance', icon: '✅', color: 'green' },
    { label: 'Upload Resource', icon: '📤', color: 'blue' },
    { label: 'Create Assignment', icon: '📝', color: 'orange' },
    { label: 'Grade Students', icon: '⭐', color: 'purple' },
    { label: 'Schedule Meeting', icon: '📅', color: 'red' },
    { label: 'View Messages', icon: '💬', color: 'pink' },
  ];

  return (
    <div className="sch-ov-card" data-testid="teacher-overview-actions">
      <h3 className="sch-ov-card-title">Quick Actions</h3>
      <div className="sch-ov-actions-grid">
        {actions.map((action, index) => (
          <button 
            key={index}
            className={`ov-action-btn ov-action-btn--${action.color}`}
            data-testid={`teacher-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="sch-ov-action-icon">{action.icon}</span>
            <span className="sch-ov-action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
