/**
 * ManagementLayout - Wrapper for management UI module
 * Integrates hrms-management-ui MainLayout with root app's auth & Redux store
 * Layout: full-width Navbar on top, Sidebar + Content below
 */
import React, { Suspense, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { LoadingSpinner } from '@school-hrms/common-components'
import { selectSidebarCollapsed, toggleSidebar } from '../../packages/hrms-management-ui/src/store/appSlice'
import { logout } from '../features/common/auth/authSlice'
import Sidebar from '../../packages/hrms-management-ui/src/app/components/layout/Sidebar'
import Header from '../../packages/hrms-management-ui/src/app/components/layout/Header'
import { Button } from '../../packages/hrms-management-ui/src/app/components/ui/Button'
import '../../packages/hrms-management-ui/default_shadcn_theme.css'
import '../../packages/hrms-management-ui/src/Assets/styles/MainLayout.scss'
import '../../packages/hrms-management-ui/src/Assets/styles/Sidebar.scss'

const ManagementLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sidebarCollapsed = useSelector(selectSidebarCollapsed)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  const handleLogout = () => {
    dispatch(logout())
    localStorage.clear()
    sessionStorage.clear()
    navigate('/login')
  }

  const handleOpenMobileDrawer = () => setMobileDrawerOpen(true)
  const handleCloseMobileDrawer = () => setMobileDrawerOpen(false)

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="main-layout">
        {/* Full-width Navbar */}
        <div className="main-layout__navbar">
          <Header
            onLogout={handleLogout}
            mobileTrigger={(
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenMobileDrawer}
                className="navbar__hamburger-btn"
                aria-label="Open navigation menu"
                data-testid="school-button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          />
        </div>

        {/* Backdrop overlay — mobile only, closes drawer on click */}
        {mobileDrawerOpen && (
          <div
            className="main-layout__backdrop"
            onClick={handleCloseMobileDrawer}
            aria-hidden="true"
            data-testid="school-overlay-mobile-backdrop"
          />
        )}

        {/* Body: Sidebar (left) + Content (right) */}
        <div className="main-layout__body">
          <div
            className={[
              'main-layout__sidebar',
              sidebarCollapsed
                ? 'main-layout__sidebar--collapsed'
                : 'main-layout__sidebar--expanded',
              mobileDrawerOpen ? 'main-layout__sidebar--mobile-open' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="main-layout__sidebar-card">
              <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={handleToggleSidebar}
                onMobileClose={mobileDrawerOpen ? handleCloseMobileDrawer : undefined}
              />
            </div>
          </div>

          <div className="main-layout__main">
            <div className="main-layout__content-card">
              <main className="main-layout__main-content">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default ManagementLayout
