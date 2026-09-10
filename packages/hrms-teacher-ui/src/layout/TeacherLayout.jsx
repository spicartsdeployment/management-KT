import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Topbar from './Topbar';
import '../assets/scss/TeacherLayout.scss';
import ContentOverlayLoader from '../../../hrms-school-ui/src/components/ContentOverlayLoader';

const TeacherLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleSidebar = useCallback(() => {
    // On mobile, toggle the drawer; on desktop, toggle collapse
    if (window.innerWidth < 768) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => !prev);
    }
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  console.log('🔄 TeacherLayout rendered');

  return (
    <div className="hsu-teach-layout" data-theme={theme}>
      {/* Floating Topbar/Navbar */}
      <div className="hsu-teach-layout__navbar">
        <Topbar
          toggleSidebar={toggleSidebar}
          toggleTheme={toggleTheme}
          theme={theme}
          data-testid="teacher-layout-topbar"
        />
      </div>

      {/* Container for Sidebar and Main Content */}
      <div className="hsu-teach-layout__body">
        {/* Floating Sidebar */}
        <aside className={`hsu-teach-layout__sidebar-wrapper${isSidebarCollapsed ? ' collapsed' : ''}`}>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobileOpen={isMobileOpen}
            closeMobile={closeMobile}
            data-testid="teacher-layout-sidebar"
          />
        </aside>

        {/* Floating Main Content */}
        <div className="hsu-teach-layout__main">
          <main className="hsu-teach-layout__content" data-testid="teacher-layout-content">
            <Suspense
            // fallback={<ContentOverlayLoader />}
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
