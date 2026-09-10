import React, { useMemo, Suspense, useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../assets/scss/SchoolLayout.scss'
import { selectSidebarCollapsed } from '../schoolSlice'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ContentOverlayLoader from '../components/ContentOverlayLoader'

const SchoolLayout = () => {
  const sidebarCollapsed = useSelector(selectSidebarCollapsed)
  const location = useLocation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const handleMenuToggle = useCallback(() => setMobileSidebarOpen((v) => !v), [])
  const handleOverlayClick = useCallback(() => setMobileSidebarOpen(false), [])

  // Check if current route is communication hub
  const isCommunicationPage = location.pathname.includes('/communication-hub')

  // Memoize inline styles to prevent object recreation
  const mainStyles = useMemo(() => ({
    // maxHeight: '84vh',
    overflowY: 'auto',
    width: '98%',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    /* FIX: Align marginLeft with actual sidebar widths from SCSS (260px expanded, 80px collapsed) + gap */
    marginLeft: sidebarCollapsed ? 'calc(80px + 2rem)' : 'calc(260px + 2rem)',
    transition: 'margin-left 0.3s'
    // padding is now controlled by CSS class
    // borderRadius and marginRight are now handled by SCSS media queries
  }), [sidebarCollapsed])

  return (
    <div className={`school-layout-root${mobileSidebarOpen ? ' mobile-nav-open' : ''}`}>
      {/* Topbar Container - Full Width */}
      <div className={`school-layout-topbar${mobileSidebarOpen ? ' topbar-behind-nav' : ''}`}>
        <Topbar onMenuToggle={handleMenuToggle} mobileSidebarOpen={mobileSidebarOpen} />
      </div>

      {/* Main Layout Container: Sidebar + Outlet */}
      <div className="school-layout-body">
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div
            className="school-layout-sidebar-backdrop"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`school-layout-sidebar ${sidebarCollapsed ? 'school-layout-sidebar-collapsed' : 'school-layout-sidebar-expanded'}${mobileSidebarOpen ? ' mobile-open' : ''}`}
        >
          <Sidebar mobileSidebarOpen={mobileSidebarOpen} onCloseMobileSidebar={handleOverlayClick} />
        </aside>

        {/* Main Content Area */}
        <main
          className={`school-layout-main ${isCommunicationPage ? 'school-layout-main--no-padding' : ''}`}
          style={mainStyles}
        >
          <Suspense
            fallback={<ContentOverlayLoader pathname={location.pathname} />}
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default SchoolLayout