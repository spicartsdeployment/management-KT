import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../src/features/common/auth/authSlice';
import { useAuth } from '../../../../src/hooks/useAuth';
import '../assets/scss/Topbar.scss';

// ── Notification Modal ──────────────────────────────────────────────
const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: 'New assignment submitted', desc: 'Aarav Kumar submitted Math HW', time: '5 min ago', unread: true },
  { id: 2, title: 'Attendance alert', desc: 'Class 9A attendance below 80%', time: '20 min ago', unread: true },
  { id: 3, title: 'Meeting reminder', desc: 'Parent-Teacher Conference at 10 AM', time: '1 hr ago', unread: false },
  { id: 4, title: 'Grievance update', desc: 'Student grievance #GR-042 resolved', time: '2 hrs ago', unread: false },
  { id: 5, title: 'Sports event', desc: 'Annual sports meet scheduled for next week', time: 'Yesterday', unread: false },
];

const NotificationModal = memo(({ onClose }) => {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  return (
    <div className="hsu-teach-notif-modal" ref={modalRef} role="dialog" aria-label="Notifications" data-testid="teacher-notification-modal">
      <div className="hsu-teach-notif-modal__header">
        <span className="hsu-teach-notif-modal__title">Notifications</span>
        <button className="hsu-teach-notif-modal__mark-read" onClick={markAllRead}>Mark all read</button>
      </div>
      <ul className="hsu-teach-notif-modal__list">
        {notifications.map(n => (
          <li key={n.id} className={`hsu-teach-notif-modal__item ${n.unread ? 'unread' : ''}`}>
            <div className="hsu-teach-notif-modal__dot" aria-hidden={!n.unread} />
            <div className="hsu-teach-notif-modal__body">
              <p className="hsu-teach-notif-modal__item-title">{n.title}</p>
              <p className="hsu-teach-notif-modal__item-desc">{n.desc}</p>
              <span className="hsu-teach-notif-modal__item-time">{n.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});
NotificationModal.displayName = 'NotificationModal';

// ── Topbar ──────────────────────────────────────────────────────────
const Topbar = memo(({ toggleSidebar, toggleTheme, theme }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, department } = useAuth();

  const unreadCount = SAMPLE_NOTIFICATIONS.filter(n => n.unread).length;

  console.log('🔄 Teacher Topbar rendered');

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.clear();
    navigate('/login');
  }, [dispatch, navigate]);

  const toggleProfile = useCallback((e) => {
    e.stopPropagation();
    setShowProfileMenu(prev => !prev);
    setShowNotifications(false);
  }, []);

  const toggleNotifications = useCallback((e) => {
    e.stopPropagation();
    setShowNotifications(prev => !prev);
    setShowProfileMenu(false);
  }, []);

  return (
    <header className="hsu-teach-topbar" data-testid="teacher-topbar">
      {/* Left: Hamburger + Logo */}
      <div className="hsu-teach-topbar__left">
        <button
          className="hsu-teach-topbar__hamburger"
          onClick={toggleSidebar}
          data-testid="teacher-topbar-menu"
          aria-label="Toggle navigation menu"
        >
          <span /><span /><span />
        </button>
        <div className="hsu-teach-topbar__brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <rect x="8" y="8" width="6" height="6" rx="1" fill="white" />
            <rect x="18" y="8" width="6" height="6" rx="1" fill="white" />
            <rect x="8" y="18" width="6" height="6" rx="1" fill="white" />
            <rect x="18" y="18" width="6" height="6" rx="1" fill="white" />
          </svg>
          <span className="hsu-teach-topbar__brand-name">EdUPortal</span>
        </div>
      </div>

      {/* Right: Theme Toggle + Notification + Profile */}
      <div className="hsu-teach-topbar__right">
        {/* Theme Toggle */}
        <button
          className={`hsu-teach-topbar__theme-toggle${theme === 'dark' ? ' hsu-teach-topbar__theme-toggle--dark' : ''}`}
          onClick={toggleTheme}
          data-testid="teacher-topbar-theme-toggle"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="hsu-teach-topbar__toggle-sun" aria-hidden="true">☀️</span>
          <span className="hsu-teach-topbar__toggle-moon" aria-hidden="true">🌙</span>
          <span className={`hsu-teach-topbar__theme-toggle-knob${theme === 'dark' ? ' hsu-teach-topbar__theme-toggle-knob--dark' : ''}`} />
        </button>

        {/* Notification Bell */}
        <div className="hsu-teach-topbar__notif-wrapper" ref={notifRef}>
          <button
            className="hsu-teach-topbar__icon-btn"
            onClick={toggleNotifications}
            data-testid="teacher-topbar-notifications"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={showNotifications}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="hsu-teach-topbar__badge" aria-hidden="true">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <NotificationModal onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile */}
        <div
          className="hsu-teach-topbar__profile"
          data-testid="teacher-topbar-profile"
          ref={profileRef}
          onClick={toggleProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleProfile(e); }}
          aria-haspopup="true"
          aria-expanded={showProfileMenu}
        >
          <div className="hsu-teach-topbar__avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Rahul Sharma')}&background=2563EB&color=fff`}
              alt="Profile"
            />
          </div>
          <div className="hsu-teach-topbar__user-info">
            <div className="hsu-teach-topbar__user-name">{user?.name || 'Mr. Rahul Sharma'}</div>
            <div className="hsu-teach-topbar__user-role">{department || 'Mathematics Teacher'}</div>
          </div>
          <span className="hsu-teach-topbar__profile-arrow" aria-hidden="true">
            <svg viewBox="0 0 10 6" width="10" height="6" fill="none">
              <path d={showProfileMenu ? 'M1 5l4-4 4 4' : 'M1 1l4 4 4-4'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="hsu-teach-topbar__profile-menu" role="menu" data-testid="teacher-profile-dropdown">
              <div className="hsu-teach-topbar__profile-header">
                <div className="hsu-teach-topbar__avatar">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Rahul Sharma')}&background=2563EB&color=fff`}
                    alt="Profile"
                  />
                </div>
                <div>
                  <div className="hsu-teach-topbar__profile-name">{user?.name || 'Mr. Rahul Sharma'}</div>
                  <div className="hsu-teach-topbar__profile-email">{user?.email || 'rahul.sharma@school.edu'}</div>
                </div>
              </div>
              <hr className="hsu-teach-topbar__profile-divider" />
              <button className="hsu-teach-topbar__profile-item" role="menuitem" data-testid="teacher-profile-menu-profile">
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                My Profile
              </button>
              <button className="hsu-teach-topbar__profile-item" role="menuitem" data-testid="teacher-profile-menu-settings">
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>
                Settings
              </button>
              <button className="hsu-teach-topbar__profile-item" role="menuitem" data-testid="teacher-profile-menu-privacy">
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Privacy & Security
              </button>
              <button
                className="hsu-teach-topbar__profile-item"
                role="menuitem"
                data-testid="teacher-profile-menu-darkmode"
                onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
              >
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className="hsu-teach-topbar__profile-item" role="menuitem" data-testid="teacher-profile-menu-help">
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Help & Support
              </button>
              <hr className="hsu-teach-topbar__profile-divider" />
              <button
                className="hsu-teach-topbar__profile-item hsu-teach-topbar__profile-item--logout"
                role="menuitem"
                data-testid="teacher-profile-menu-logout"
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              >
                <svg className="hsu-teach-topbar__profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

Topbar.displayName = 'TeacherTopbar';
export default Topbar;
