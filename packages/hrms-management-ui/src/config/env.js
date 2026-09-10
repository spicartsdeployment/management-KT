/**
 * Runtime environment configuration
 * Reads VITE_MGMT_* environment variables
 */

// Service-specific microservice URLs
export const DASHBOARD_SERVER = import.meta.env.VITE_MGMT_DASHBOARD_API
  ? [import.meta.env.VITE_MGMT_DASHBOARD_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8001'];

export const FEES_SERVER = import.meta.env.VITE_MGMT_FEES_API
  ? [import.meta.env.VITE_MGMT_FEES_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8002'];

export const TRANSPORT_SERVER = import.meta.env.VITE_MGMT_TRANSPORT_API
  ? [import.meta.env.VITE_MGMT_TRANSPORT_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8003'];

export const GRIEVANCES_SERVER = import.meta.env.VITE_MGMT_GRIEVANCES_API
  ? [import.meta.env.VITE_MGMT_GRIEVANCES_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8004'];

export const ANNOUNCEMENTS_SERVER = import.meta.env.VITE_MGMT_ANNOUNCEMENTS_API
  ? [import.meta.env.VITE_MGMT_ANNOUNCEMENTS_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8005'];

export const EVENTS_SERVER = import.meta.env.VITE_MGMT_EVENTS_API
  ? [import.meta.env.VITE_MGMT_EVENTS_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8006'];

export const POLICIES_SERVER = import.meta.env.VITE_MGMT_POLICIES_API
  ? [import.meta.env.VITE_MGMT_POLICIES_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8007'];

export const STAFF_SERVER = import.meta.env.VITE_MGMT_STAFF_API
  ? [import.meta.env.VITE_MGMT_STAFF_API]
  : [import.meta.env.VITE_MGMT_API_BASE || 'http://localhost:8008'];

// Auth token key
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'edgiant_token';
