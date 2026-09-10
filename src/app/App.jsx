import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from './routes'
import { selectTheme } from '../../packages/hrms-school-ui/src/schoolSlice'
import { queryClient } from '../../packages/hrms-school-ui/src/lib/queryClient'
import { configureAuthRefresh } from '@school-hrms/utility'
import { refreshAccessToken } from '../features/common/auth/auth.api'
import { setAccessToken, logout } from '../features/common/auth/authSlice'
import { store } from './store'
import '../../packages/hrms-teacher-ui/src/assets/scss/theme.scss'

// Configure JWT refresh once — outside component so it runs exactly once.
// Uses store.dispatch so it works independently of React render cycles.
configureAuthRefresh({
  /**
   * Called by the 401 interceptor when an access token has expired.
   * Reads the refresh token, calls the refresh endpoint, persists the new
   * access token in Redux + localStorage, and returns it for the retry.
   */
  async getRefreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    const data = await refreshAccessToken(refreshToken);
    store.dispatch(setAccessToken(data.access));
    return data.access;
  },
  /**
   * Called when the refresh itself fails (e.g., refresh token expired).
   * Clears all auth state and redirects the user to the login page.
   */
  onAuthFailure() {
    store.dispatch(logout());
    window.location.href = '/login';
  },
});

function App() {
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  useEffect(() => {
    const root = document.documentElement;
    // Temporarily disable all CSS transitions so theme switch is instant
    root.classList.add('no-theme-transition');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // Re-enable transitions after the browser has painted the new theme
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('no-theme-transition');
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [theme])

  useEffect(() => {
    // Initialize user from localStorage on app start
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    const savedRole = localStorage.getItem('role')

    if (savedUser && savedToken && savedRole) {
      // User is already logged in, store will be initialized from localStorage
      // No need to dispatch setCredentials as it's already in initial state
    }
  }, [dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <AppRoutes />
      </div>
    </QueryClientProvider>
  )
}

export default App