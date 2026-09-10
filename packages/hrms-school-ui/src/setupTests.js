require('@testing-library/jest-dom');

// Mock window.__HRMS__ global object
global.window.__HRMS__ = {
  getAuthToken: jest.fn(() => 'mock-token'),
  getSettings: jest.fn(() => ({
    theme: 'light',
    language: 'en',
    schoolConfig: {}
  })),
  hasPermission: jest.fn(() => true),
  hasAnyPermission: jest.fn(() => true),
  getCurrentUser: jest.fn(() => ({
    id: 'user123',
    name: 'Test User',
    email: 'test@school.com',
    permissions: ['view_buses', 'manage_transport']
  })),
  navigate: jest.fn(),
  logout: jest.fn(),
  setTheme: jest.fn(),
  refreshAuthToken: jest.fn()
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock Leaflet
jest.mock('leaflet', () => ({
  icon: jest.fn(() => ({})),
  divIcon: jest.fn(() => ({})),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn()
      }
    }
  }
}));

