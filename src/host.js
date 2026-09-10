/**
 * Global Host Application State & Integration Layer
 * Provides centralized authentication, settings, and navigation
 */
import axios from 'axios';
import { loginUser } from './features/common/auth/auth.api';

const APP_STATE = {
  authToken: null,
  refreshToken: null,
  user: null,
  settings: {
    theme: 'light',
    language: 'en',
    schoolConfig: {}
  }
};

/**
 * Initialize authentication from localStorage
 */
const initAuth = () => {
  try {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    if (token) APP_STATE.authToken = token;
    if (refreshToken) APP_STATE.refreshToken = refreshToken;
    if (userStr) APP_STATE.user = JSON.parse(userStr);
    
    // Load theme
    const theme = localStorage.getItem('theme') || 'light';
    setTheme(theme);
  } catch (error) {
    console.error('Failed to initialize auth:', error);
  }
};

/**
 * Fetch user details from API
 */
const fetchUserDetails = async () => {
  try {
    const response = await axios.get('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${APP_STATE.authToken}` }
    });
    const user = response.data;
    APP_STATE.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    return null;
  }
};

/**
 * Refresh authentication token
 */
const refreshAuthToken = async () => {
  try {
    const response = await axios.post('/api/auth/refresh', {
      refreshToken: APP_STATE.refreshToken
    });
    const { token, refreshToken } = response.data;
    APP_STATE.authToken = token;
    APP_STATE.refreshToken = refreshToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    logout();
    return null;
  }
};

/**
 * Get current auth token
 */
const getAuthToken = () => APP_STATE.authToken;

/**
 * Get application settings
 */
const getSettings = () => ({
  theme: APP_STATE.settings.theme,
  language: APP_STATE.settings.language,
  schoolConfig: APP_STATE.settings.schoolConfig
});

/**
 * Set theme (light/dark)
 */
const setTheme = (theme) => {
  APP_STATE.settings.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Logout user
 */
const logout = () => {
  APP_STATE.authToken = null;
  APP_STATE.refreshToken = null;
  APP_STATE.user = null;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  window.location.href = '/login';
};

/**
 * Login user
 */
const login = async ({ email, password }) => {
  try {
    const data = await loginUser({ email, password });
    APP_STATE.authToken = data.access;
    APP_STATE.refreshToken = data.refresh;
    APP_STATE.user = data.user ?? null;
    localStorage.setItem('authToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user has permission
 */
const hasPermission = (permission) => {
  if (!APP_STATE.user || !APP_STATE.user.permissions) return false;
  return APP_STATE.user.permissions.includes(permission);
};

/**
 * Check if user has any of the permissions
 */
const hasAnyPermission = (permissions) => {
  if (!APP_STATE.user || !APP_STATE.user.permissions) return false;
  return permissions.some(p => APP_STATE.user.permissions.includes(p));
};

/**
 * Get current user
 */
const getCurrentUser = () => APP_STATE.user;

/**
 * Navigate to route
 */
const navigate = (path) => {
  window.location.href = path;
};

// Expose global API
window.__HRMS__ = {
  getAuthToken,
  getSettings,
  setTheme,
  logout,
  login,
  hasPermission,
  hasAnyPermission,
  getCurrentUser,
  navigate,
  refreshAuthToken
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

// Auto-refresh token every 50 minutes
setInterval(() => {
  if (APP_STATE.authToken) {
    refreshAuthToken();
  }
}, 50 * 60 * 1000);

export default window.__HRMS__;
