/**
 * Host Integration Utilities
 * Helper functions to interact with the global HRMS host
 */

/**
 * Get authentication token
 * @returns {string|null} Auth token
 */
export const getAuthToken = () => {
  return window.__HRMS__?.getAuthToken() || null;
};

/**
 * Get application settings
 * @returns {Object} Settings object
 */
export const getSettings = () => {
  return window.__HRMS__?.getSettings() || {
    theme: 'light',
    language: 'en',
    schoolConfig: {}
  };
};

/**
 * Check if user has specific permission
 * @param {string} permission - Permission name
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  if (!window.__HRMS__) {
    console.warn('HRMS host not available');
    return false;
  }
  return window.__HRMS__.hasPermission(permission);
};

/**
 * Check if user has any of the permissions
 * @param {string[]} permissions - Array of permission names
 * @returns {boolean}
 */
export const hasAnyPermission = (permissions) => {
  if (!window.__HRMS__) return false;
  return window.__HRMS__.hasAnyPermission(permissions);
};

/**
 * Get current user
 * @returns {Object|null} User object
 */
export const getCurrentUser = () => {
  return window.__HRMS__?.getCurrentUser() || null;
};

/**
 * Get school configuration
 * @returns {Object} School config
 */
export const getSchoolConfig = () => {
  return window.__HRMS__?.getSettings()?.schoolConfig || {};
};

/**
 * Navigate to a different route
 * @param {string} path - Route path
 */
export const navigate = (path) => {
  if (window.__HRMS__) {
    window.__HRMS__.navigate(path);
  } else {
    window.location.href = path;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  if (window.__HRMS__) {
    window.__HRMS__.logout();
  }
};

/**
 * Set application theme
 * @param {string} theme - 'light' or 'dark'
 */
export const setTheme = (theme) => {
  if (window.__HRMS__) {
    window.__HRMS__.setTheme(theme);
  }
};

/**
 * Subscribe to user updates
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserUpdates = (callback) => {
  if (!window.__HRMS__) return () => {};
  
  const eventName = 'userUpdated';
  window.addEventListener(eventName, callback);
  
  return () => {
    window.removeEventListener(eventName, callback);
  };
};

export default {
  getAuthToken,
  getSettings,
  hasPermission,
  hasAnyPermission,
  getCurrentUser,
  getSchoolConfig,
  navigate,
  logout,
  setTheme,
  subscribeToUserUpdates
};
