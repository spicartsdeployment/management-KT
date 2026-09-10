import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme } from '../schoolSlice';
import '../assets/scss/Navbar.scss';

/** Left brand/logo section */
const NavbarLeft = () => (
  <div className="navbar-left">
    <div className="navbar-logo-wrapper">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="navbar-logo-img" />
      </div>
    </div>
    <div className="navbar-brand">
      <span className="navbar-brand-name">EduSpace Academy</span>
      <span className="navbar-brand-tagline">Excellence in Education</span>
    </div>
  </div>
);

/** Center greeting section */
const NavbarCenter = () => (
  <div className="navbar-center">
    <div className="navbar-greeting">
      <span className="navbar-greeting-emoji">✨</span>
      <span className="navbar-greeting-text">Good Afternoon, Ananya! Ready to excel today?</span>
    </div>
  </div>
);

/** Theme toggle button */
const NavbarThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="navbar-theme-toggle"
    data-testid="school-button-theme-toggle"
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {!isDark && (
      <span className="navbar-theme-icon-left">
        <svg className="navbar-icon-sm" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      </span>
    )}
    {isDark && (
      <span className="navbar-theme-icon-right">
        <svg className="navbar-icon-sm" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>
    )}
    <span className={`navbar-theme-knob ${isDark ? 'navbar-theme-knob-dark' : 'navbar-theme-knob-light'}`} />
  </button>
);

NavbarThemeToggle.propTypes = {
  isDark: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

/** Notification bell */
const NavbarNotification = () => (
  <div className="navbar-notification">
    <button className="navbar-notification-btn">
      <svg className="navbar-notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </button>
    <span className="navbar-notification-badge">3</span>
  </div>
);

/** Profile avatar + info */
const NavbarProfile = () => (
  <div className="navbar-profile">
    <img src="/profile.jpg" alt="Ananya Sharma" className="navbar-profile-avatar" />
    <div className="navbar-profile-info">
      <span className="navbar-profile-name">Ananya Sharma</span>
      <span className="navbar-profile-grade">Grade 11-A</span>
    </div>
  </div>
);

/**
 * Navbar - top navigation bar with theme toggle.
 * Theme state is managed via Redux so all components update simultaneously.
 */
const Navbar = memo(() => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';
  const handleToggle = useCallback(() => dispatch(toggleTheme()), [dispatch]);

  return (
    <nav className="navbar-container">
      <NavbarLeft />
      <NavbarCenter />
      <div className="navbar-right">
        <NavbarThemeToggle isDark={isDark} onToggle={handleToggle} />
        <NavbarNotification />
        <NavbarProfile />
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
