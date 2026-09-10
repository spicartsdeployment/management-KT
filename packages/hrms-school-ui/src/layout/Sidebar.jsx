import React, { memo, useCallback, useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import '../assets/scss/Sidebar.scss'
import {
  HomeIcon,
  TruckIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  SpeakerWaveIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { selectSidebarCollapsed, toggleSidebar, selectAnnouncementUnreadCount } from '../schoolSlice'
import { Card } from '@school-hrms/common-components'
import { SIDEBAR_MENU_ITEMS } from '../constants/constants'
import { prefetchOverview } from '../services/overview.queries'
import { prefetchAnnouncements } from '../services/announcements.queries'
import { prefetchCommunityForum } from '../services/communityForum.queries'
import { prefetchDailySchedule } from '../services/schedule.queries'
import { prefetchGrievanceStats } from '../services/grievance.queries'
import { prefetchMeetingDashboard } from '../services/meetingScheduler.queries'
import { prefetchLeaveStatistics } from '../services/leave.queries'

// Icon mapping
const iconMap = {
  HomeIcon,
  TruckIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UsersIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  SpeakerWaveIcon,
}

/** Map of sidebar route IDs to their prefetch function. */
const PREFETCH_MAP = {
  'dashboard': (qc) => prefetchOverview(qc),
  'global-announcements': (qc) => prefetchAnnouncements(qc),
  'community-forum': (qc) => prefetchCommunityForum(qc),
  'daily-schedule': (qc) => prefetchDailySchedule(qc),
  'grievance-system': (qc) => prefetchGrievanceStats(qc),
  'meeting-scheduler': (qc) => prefetchMeetingDashboard(qc),
  'leave-management': (qc) => prefetchLeaveStatistics(qc),
}

const Sidebar = memo(({ mobileSidebarOpen = false, onCloseMobileSidebar }) => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const isCollapsed = useSelector(selectSidebarCollapsed)
  const announcementUnreadCount = useSelector(selectAnnouncementUnreadCount)
  // On mobile drawer, always show labels regardless of collapsed state
  const showLabels = !isCollapsed || mobileSidebarOpen
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handlePrefetch = useCallback((itemId) => {
    const prefetchFn = PREFETCH_MAP[itemId]
    if (!prefetchFn) return
    prefetchFn(queryClient)
  }, [queryClient])

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    checkDarkMode()

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const handleToggle = useCallback(() => {
    // Mobile drawer
    if (window.innerWidth < 768 && mobileSidebarOpen) {
      onCloseMobileSidebar?.();
      return;
    }

    // Desktop collapse
    dispatch(toggleSidebar());
  }, [dispatch, mobileSidebarOpen, onCloseMobileSidebar]);

  return (
    <>
      {/* Sidebar */}
      <div className="sidebar-container">
        <Card
          variant="glass"
          className="sidebar-card"
          padding="none"
        // style={{ height: '85vh' }}
        >
          {/* Header */}
          <div className="sidebar-header">
            {/* <div className={`sidebar-brand ${isCollapsed ? 'sidebar-brand-collapsed' : ''}`}>
              <div className="sidebar-brand-logo">
                <span className="sidebar-brand-logo-text">S</span>
              </div>
              {!isCollapsed && (
                <span className="sidebar-brand-name">
                  School ERP
                </span>
              )}
            </div> */}
            <button
              onClick={handleToggle}
              className="sidebar-toggle-btn"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgb(255 179 71 / 10%)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              data-testid="school-button-sidebar-toggle"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="sidebar-toggle-icon" />
              ) : (
                <ChevronLeftIcon className="sidebar-toggle-icon" />
              )}
            </button>
          </div>

          {/* Menu Section Header */}
          <div className="sidebar-menu-header">
            <span className="sidebar-menu-label">MENU</span>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            {SIDEBAR_MENU_ITEMS.map((item) => {
              const IconComponent = iconMap[item.icon]
              const isEmoji = !IconComponent && item.icon
              const isComingSoon = item.status === 'coming-soon'
              return (
                <NavLink
                  key={item.id}
                  to={isComingSoon ? '#' : item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive && !isComingSoon
                      ? 'sidebar-nav-link-active'
                      : 'sidebar-nav-link-inactive'
                    } ${isComingSoon ? 'sidebar-nav-link-disabled' : ''}`
                  }
                  style={({ isActive }) => ({
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                    background: isActive && !isComingSoon
                      ? isDarkMode
                        ? 'linear-gradient(135deg, rgb(76, 201, 240) 0%, rgb(0, 255, 209) 100%)'
                        : 'linear-gradient(135deg, rgb(255, 179, 71) 0%, rgb(255, 154, 60) 100%)'
                      : undefined
                  })}
                  onClick={(e) => {
                    if (isComingSoon) { e.preventDefault(); return; }
                    if (mobileSidebarOpen && onCloseMobileSidebar) onCloseMobileSidebar();
                  }}
                  onMouseEnter={() => !isComingSoon && handlePrefetch(item.id)}
                  data-testid={`school-menuitem-${item.id}`}
                >
                  <div className={`sidebar-nav-link-content ${isCollapsed && !mobileSidebarOpen ? 'sidebar-nav-link-content-collapsed' : ''}`}>
                    {isEmoji ? (
                      <span className={`sidebar-nav-emoji ${isCollapsed ? '' : 'sidebar-nav-emoji-expanded'}`}>
                        {item.icon}
                      </span>
                    ) : IconComponent ? (
                      <IconComponent className={`sidebar-nav-icon ${isCollapsed ? '' : 'sidebar-nav-icon-expanded'}`} />
                    ) : null}
                    {showLabels && (
                      <span className="sidebar-nav-text">
                        {item.title}
                      </span>
                    )}
                  </div>
                  {/* Hide badges when collapsed */}
                  {showLabels && (() => {
                    if (item.id === 'global-announcements') {
                      return announcementUnreadCount > 0 ? (
                        <span className="sidebar-nav-badge sidebar-nav-badge-default" data-testid="school-badge-announcements">
                          {announcementUnreadCount}
                        </span>
                      ) : null;
                    }
                    return item.badge && item.badge !== 'live' ? (
                      <span className={`sidebar-nav-badge ${item.badge === 'coming-soon'
                        ? 'text-purple-600 bg-purple-100'
                        : 'sidebar-nav-badge-default'
                        }`}>
                        {item.badge}
                      </span>
                    ) : null;
                  })()}
                </NavLink>
              )
            })}
          </nav>

          {/* Footer */}
          {/* {!isCollapsed && (
            <div className="px-4 py-3 border-t border-white/10">
              <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary text-center">
                <p>School ERP Dashboard</p>
                <p className="mt-1">v1.0.0</p>
              </div>
            </div>
          )} */}
        </Card>
      </div>
    </>
  )
})

Sidebar.displayName = 'SchoolSidebar'
export default Sidebar