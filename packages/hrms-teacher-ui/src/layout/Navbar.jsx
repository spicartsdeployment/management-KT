import React from 'react';
import '../assets/scss/Navbar.scss';

const Navbar = () => {
  const quickActions = [
    { label: 'Mark Attendance', icon: '✅', action: '/teacher/attendance' },
    { label: 'Upload Resource', icon: '📤', action: '/teacher/resources-uploading' },
    { label: 'Create Assignment', icon: '📝', action: '/teacher/assignments-exams' },
    { label: 'View Classes', icon: '👥', action: '/teacher/my-classes' },
  ];

  return (
    <nav className="hsu-teach-navbar" data-testid="teacher-navbar">
      <div className="hsu-teach-navbar__container">
        <div className="hsu-teach-navbar__title">Quick Actions</div>
        <div className="hsu-teach-navbar__actions">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className="hsu-teach-navbar__action-btn"
              data-testid={`teacher-navbar-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="hsu-teach-navbar__action-icon">{action.icon}</span>
              <span className="hsu-teach-navbar__action-text">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
