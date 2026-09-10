import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@school-hrms/common-components';
import {
	BellIcon,
	UserIcon,
	Cog6ToothIcon,
	CheckCircleIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { selectTheme, toggleTheme } from '../schoolSlice';
import { logout } from '../../../../src/features/common/auth/authSlice';
import '../assets/scss/Topbar.scss';

/** Mock notifications data */
const INITIAL_NOTIFICATIONS = [
	{ id: 1,  type: 'alert',   priority: 'high',   title: 'Bus route 12 delayed by 15 minutes',             time: '2 min ago',  unread: true  },
	{ id: 2,  type: 'info',    priority: 'medium', title: 'Fee payment for March is due tomorrow',           time: '1 hr ago',   unread: true  },
	{ id: 3,  type: 'success', priority: 'low',    title: 'Grade 11-A results have been published',          time: '3 hrs ago',  unread: true  },
	{ id: 4,  type: 'alert',   priority: 'high',   title: 'Ananya was marked absent in Period 3 today',      time: '4 hrs ago',  unread: true  },
	{ id: 5,  type: 'info',    priority: 'medium', title: 'Sports Day registrations close this Friday',      time: '5 hrs ago',  unread: true  },
	{ id: 6,  type: 'success', priority: 'low',    title: 'Library book "Physics Vol. II" due in 2 days',    time: '6 hrs ago',  unread: true  },
	{ id: 7,  type: 'info',    priority: 'medium', title: 'New assignment posted: Math Chapter 9 Practice',  time: '8 hrs ago',  unread: false },
	{ id: 8,  type: 'info',    priority: 'medium', title: 'Parent-teacher meeting on Friday confirmed',      time: '1 day ago',  unread: false },
	{ id: 9,  type: 'success', priority: 'low',    title: 'School holiday declared on 25 March (Holi)',      time: '1 day ago',  unread: false },
	{ id: 10, type: 'alert',   priority: 'medium', title: 'System maintenance scheduled Sunday 22 March',   time: '2 days ago', unread: false },
	{ id: 11, type: 'success', priority: 'low',    title: 'Annual report card download is now available',    time: '3 days ago', unread: false },
];

const NOTIFICATION_ICONS = {
	alert:   ExclamationCircleIcon,
	info:    InformationCircleIcon,
	success: CheckCircleIcon,
};

/** Notification stream modal */
const NotificationPanel = ({ notifications, openUnreadIds, onMarkAllRead, onClose }) => (
	<>
		<div className="topbar-notif-overlay" onClick={onClose} aria-hidden="true" />
		<div className="topbar-notif-modal" role="dialog" aria-label="Notifications" aria-modal="true">
			<div className="topbar-notif-modal-header">
				<div className="topbar-notif-modal-title-row">
					<span className="topbar-notif-modal-title">Notifications</span>
					{openUnreadIds.size > 0 && (
						<span className="topbar-notif-modal-unread-count">{openUnreadIds.size} new</span>
					)}
				</div>
				<div className="topbar-notif-modal-actions">
					<button
						className="topbar-notif-mark-read-btn"
						onClick={onMarkAllRead}
						data-testid="school-button-notifications-mark-read"
					>
						Mark all read
					</button>
					<button
						className="topbar-notif-close-btn"
						onClick={onClose}
						aria-label="Close notifications"
						data-testid="school-button-notifications-close"
					>
						<XMarkIcon className="topbar-notif-close-icon" />
					</button>
				</div>
			</div>
			<ul className="topbar-notif-list">
				{notifications.map((n) => {
					const Icon = NOTIFICATION_ICONS[n.type] || InformationCircleIcon;
					const isNew = openUnreadIds.has(n.id);
					return (
						<li key={n.id} className={`topbar-notif-item topbar-notif-item--${n.priority}`}>
							<span className={`topbar-notif-item-icon topbar-notif-item-icon--${n.type}`}>
								<Icon className="topbar-notif-item-icon-svg" />
							</span>
							<div className="topbar-notif-item-body">
								<div className="topbar-notif-item-title-row">
									<p className="topbar-notif-item-title">{n.title}</p>
									{isNew && <span className="topbar-notif-item-new-tag">New</span>}
								</div>
								<span className="topbar-notif-item-time">{n.time}</span>
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	</>
);

/** Profile dropdown menu */
const ProfileMenu = ({ onClose, onNavigate, onLogout }) => (
	<div className="topbar-profile-menu" role="menu" aria-label="Profile menu">
		<div className="topbar-profile-menu-header">
			<Avatar
				src="https://randomuser.me/api/portraits/women/44.jpg"
				alt="Ananya Sharma"
				size="default"
				data-testid="school-avatar-profile-menu"
			/>
			<div className="topbar-profile-menu-user">
				<span className="topbar-profile-menu-name">Ananya Sharma</span>
				<span className="topbar-profile-menu-email">ananya.sharma@eduspace.com</span>
			</div>
		</div>
		<div className="topbar-profile-menu-badges">
			<span className="topbar-profile-menu-badge">Grade 11-A</span>
			<span className="topbar-profile-menu-badge">Roll: 007</span>
		</div>
		<div className="topbar-profile-menu-divider" />
		<button
			className="topbar-profile-menu-item topbar-profile-menu-item--disabled"
			role="menuitem"
			disabled
			data-testid="school-button-profile-menu-profile"
		>
			<UserIcon className="topbar-profile-menu-item-icon" />
			Profile
		</button>
		<button
			className="topbar-profile-menu-item topbar-profile-menu-item--disabled"
			role="menuitem"
			disabled
			data-testid="school-button-profile-menu-settings"
		>
			<Cog6ToothIcon className="topbar-profile-menu-item-icon" />
			Settings
		</button>
		<div className="topbar-profile-menu-divider" />
		<button
			className="topbar-profile-menu-item topbar-profile-menu-item--logout"
			role="menuitem"
			onClick={onLogout}
			data-testid="school-button-profile-menu-logout"
		>
			Logout
		</button>
	</div>
);

const Topbar = memo(({ onMenuToggle, mobileSidebarOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const theme = useSelector(selectTheme);
	const isDark = theme === 'dark';
	const handleThemeToggle = useCallback(() => dispatch(toggleTheme()), [dispatch]);

	const [showNotifications, setShowNotifications] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
	const [openUnreadIds, setOpenUnreadIds] = useState(new Set());
	const notificationRef = useRef(null);
	const profileRef = useRef(null);

	// Close dropdowns on outside click or ESC key
	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (notificationRef.current && !notificationRef.current.contains(e.target)) {
				setShowNotifications(false);
			}
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setShowProfileMenu(false);
			}
		};
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setShowNotifications(false);
				setShowProfileMenu(false);
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleNotificationClick = useCallback(() => {
		setShowNotifications((v) => {
			if (!v) {
				// Capture currently-unread IDs to show "New" tags while panel is open
				setOpenUnreadIds(new Set(notifications.filter((n) => n.unread).map((n) => n.id)));
			}
			return !v;
		});
		setShowProfileMenu(false);
	}, [notifications]);

	const handleCloseNotifications = useCallback(() => {
		// Mark all as read when the panel is closed
		setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));
		setOpenUnreadIds(new Set());
		setShowNotifications(false);
	}, []);

	const handleMarkAllRead = useCallback(() => {
		setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));
		setOpenUnreadIds(new Set());
	}, []);

	const handleProfileClick = useCallback(() => {
		setShowProfileMenu((v) => !v);
		setShowNotifications(false);
	}, []);

	const handleProfileNavigate = useCallback((path) => {
		setShowProfileMenu(false);
		navigate(path);
	}, [navigate]);

	const handleLogout = useCallback(() => {
		dispatch(logout());
		window.location.href = '/?logout=true';
	}, [dispatch]);

	const unreadCount = notifications.filter((n) => n.unread).length;

	return (
		<div className="topbar-container">
			{/* Left: Hamburger (mobile) + Logo and Title */}
			<div className="topbar-left">
				<button
					className={`topbar-hamburger${mobileSidebarOpen ? ' topbar-hamburger--open' : ''}`}
					onClick={onMenuToggle}
					aria-label={mobileSidebarOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileSidebarOpen}
					data-testid="school-button-hamburger-menu"
				>
					<span className="topbar-hamburger-line" />
					<span className="topbar-hamburger-line" />
					<span className="topbar-hamburger-line" />
				</button>
				<div className="topbar-logo">
					<svg className="topbar-logo-icon" fill="currentColor" viewBox="0 0 20 20">
						<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
					</svg>
				</div>
				<div className="topbar-school-info">
					<span className="topbar-school-name">EduSpace Academy</span>
					<span className="topbar-school-tagline">Excellence in Education</span>
				</div>
			</div>

			{/* Center: Greeting Message */}
			<div className="topbar-center">
				<div className="topbar-greeting">
					<span className="topbar-greeting-emoji">✨</span>
					<span className="topbar-greeting-text">
						Good Afternoon, Ananya! Ready to excel today?
					</span>
				</div>
			</div>

			{/* Right: Theme toggle, notifications, profile */}
			<div className="topbar-right">
				{/* Theme Toggle */}
				<button
					className={`topbar-theme-toggle${isDark ? ' topbar-theme-toggle--dark' : ''}`}
					onClick={handleThemeToggle}
					data-testid="school-button-theme-toggle"
					aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				>
					<span className="topbar-toggle-sun" aria-hidden="true">☀️</span>
					<span className="topbar-toggle-moon" aria-hidden="true">🌙</span>
					<span className={`topbar-theme-toggle-knob${isDark ? ' topbar-theme-toggle-knob--dark' : ''}`} />
				</button>

				{/* Notification Icon + Dropdown */}
				<div className="topbar-notification" ref={notificationRef}>
					<button
						className="topbar-notification-btn"
						onClick={handleNotificationClick}
						aria-label="Notifications"
						aria-expanded={showNotifications}
						data-testid="school-button-notifications"
					>
						<BellIcon className="topbar-notification-icon" />
						{unreadCount > 0 && (
							<span className="topbar-notification-badge">{unreadCount}</span>
						)}
					</button>
					{showNotifications && (
						<NotificationPanel
							notifications={notifications}
							openUnreadIds={openUnreadIds}
							onMarkAllRead={handleMarkAllRead}
							onClose={handleCloseNotifications}
						/>
					)}
				</div>

				{/* Profile Section + Dropdown */}
				<div
					className="topbar-profile"
					ref={profileRef}
					onClick={handleProfileClick}
					role="button"
					tabIndex={0}
					aria-expanded={showProfileMenu}
					aria-label="Profile menu"
					onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}
					data-testid="school-button-profile"
				>
					<div className="topbar-profile-info">
						<span className="topbar-profile-name">Ananya Sharma</span>
						<span className="topbar-profile-grade">Grade 11-A</span>
					</div>
					<Avatar
						src="https://randomuser.me/api/portraits/women/44.jpg"
						alt="Ananya Sharma"
						size="sm"
					/>
					{showProfileMenu && (
						<ProfileMenu
							onClose={() => setShowProfileMenu(false)}
							onNavigate={handleProfileNavigate}
							onLogout={handleLogout}
						/>
					)}
				</div>
			</div>
		</div>
	);
});

Topbar.displayName = 'Topbar';
export default Topbar;
