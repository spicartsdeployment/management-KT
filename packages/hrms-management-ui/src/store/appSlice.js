import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'management-theme';

function readStoredTheme() {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'dark';
    } catch {
        return 'dark';
    }
}

const appSlice = createSlice({
  name: 'app',
  initialState: {
    sidebarCollapsed: false,
    theme: readStoredTheme(),
    notifications: [
      { id: 1, title: 'Fee Payment Overdue', message: '12 students have pending fee payments for June 2026.', type: 'new', timestamp: '2 min ago' },
      { id: 2, title: 'New Staff Application', message: 'A new application has been submitted for the Math Teacher position.', type: 'new', timestamp: '18 min ago' },
      { id: 3, title: 'Attendance Alert', message: 'Class 10-A attendance dropped below 75% this week.', type: 'alert', timestamp: '1 hour ago' },
      { id: 4, title: 'Exam Schedule Published', message: 'Mid-term exam schedule for all classes has been published.', type: 'info', timestamp: '3 hours ago' },
      { id: 5, title: 'Transport Route Updated', message: 'Route 4 has been modified. Please inform affected students.', type: 'info', timestamp: 'Yesterday' },
    ],
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
      } catch {
        /* ignore storage errors */
      }
    },
    setTheme(state, action) {
      state.theme = action.payload;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
      } catch {
        /* ignore storage errors */
      }
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
  addNotification,
  clearNotifications,
  removeNotification,
} = appSlice.actions;

// Selectors - adapted for root store integration (state.managementApp)
// When used in standalone mode, wrap with a selector adapter
export const selectSidebarCollapsed = (state) => {
  // Support both standalone (state.app) and integrated (state.managementApp) modes
  const appState = state.managementApp || state.app;
  return appState?.sidebarCollapsed || false;
};

export const selectTheme = (state) => {
  const appState = state.managementApp || state.app;
  return appState?.theme || 'light';
};

export const selectNotifications = (state) => {
  const appState = state.managementApp || state.app;
  return appState?.notifications || [];
};

export default appSlice.reducer;
