import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/scss/Sidebar.scss';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MonitorPlay,
  BookOpen,
  Calendar,
  Trophy,
  Mail,
  MessageCircle,
  AlertCircle,
  Users
} from "lucide-react";

// SidebarItem - reusable component
export const SidebarItem = memo(({ path, icon, label, isCollapsed, onClose }) => (
  <li className="hsu-teach-sidebar__menu-item">
    <NavLink
      to={path}
      className={({ isActive }) =>
        `hsu-teach-sidebar__link ${isActive ? 'active' : ''}`
      }
      data-testid={`teacher-sidebar-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
      title={isCollapsed ? label : undefined}
      onClick={onClose}
    >
      <span className="hsu-teach-sidebar__icon-wrapper" aria-hidden="true">
        <span className="hsu-teach-sidebar__icon">{icon}</span>
      </span>
      {!isCollapsed && <span className="hsu-teach-sidebar__text">{label}</span>}
      {!isCollapsed && <span className="hsu-teach-sidebar__active-indicator" aria-hidden="true" />}
    </NavLink>
  </li>
));

SidebarItem.displayName = 'SidebarItem';

const Sidebar = memo(({ isCollapsed, toggleSidebar, isMobileOpen, closeMobile }) => {
  console.log('🔄 Teacher Sidebar rendered');

  const menuItems = [
    { path: '/teacher/overview', icon: <LayoutDashboard />, label: 'Overview' },
    { path: '/teacher/live-classes', icon: <MonitorPlay />, label: 'Live Classes' },
    { path: '/teacher/my-classes', icon: <BookOpen />, label: 'My Classes' },
    { path: '/teacher/my-schedule', icon: <Calendar />, label: 'My Schedule' },
    { path: '/teacher/sports', icon: <Trophy />, label: 'Sports' },
    { path: '/teacher/staff-requests', icon: <Mail />, label: 'Request For Us' },
    { path: '/teacher/community', icon: <MessageCircle />, label: 'Community' },
    { path: '/teacher/grievances', icon: <AlertCircle />, label: 'Grievance' },
    { path: '/teacher/staff-connect', icon: <Users />, label: 'Staff Connect' },
  ];

  return (
    <>
      {/* Mobile backdrop overlay - click to close */}
      {isMobileOpen && (
        <div
          className="hsu-teach-sidebar__backdrop"
          onClick={closeMobile}
          aria-hidden="true"
          data-testid="teacher-sidebar-backdrop"
        />
      )}

      <aside
        className={`hsu-teach-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        data-testid="teacher-sidebar"
        role="navigation"
        aria-label="Main navigation"
      >


        <nav className="hsu-teach-sidebar__nav" data-testid="teacher-sidebar-nav">
          <div className="hsu-teach-sidebar__header" data-testid="teacher-sidebar-header">

            <button
              className="hsu-teach-sidebar__toggle"
              onClick={toggleSidebar}
              data-testid="teacher-sidebar-toggle"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>
          <ul className="hsu-teach-sidebar__menu" role="menubar">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                onClose={closeMobile}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
});

Sidebar.displayName = 'TeacherSidebar';
export default Sidebar;