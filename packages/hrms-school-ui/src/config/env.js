// Runtime environment config — reads Vite env vars and exports typed constants.
// Jest uses __mocks__/config/env.js instead of this file.

export const API_SERVERS = [
  import.meta.env.VITE_API_LOCAL_SERVER,
  import.meta.env.VITE_API_DEV,
].filter(Boolean);

// Service-specific microservice URLs (override generic API_SERVERS if set)
export const ANNOUNCEMENTS_SERVER = import.meta.env.VITE_API_ANNOUNCEMENTS_SERVER
  ? [import.meta.env.VITE_API_ANNOUNCEMENTS_SERVER]
  : API_SERVERS;

export const ALUMNI_SERVERS = import.meta.env.VITE_API_ALUMNI_SERVER
  ? [import.meta.env.VITE_API_ALUMNI_SERVER]
  : API_SERVERS;

export const BUS_TRACKING_SERVERS = import.meta.env.VITE_API_BUS_TRACKING_SERVER
  ? [import.meta.env.VITE_API_BUS_TRACKING_SERVER]
  : API_SERVERS;

export const COMMUNITY_SERVERS = import.meta.env.VITE_API_COMMUNITY_SERVER
  ? [import.meta.env.VITE_API_COMMUNITY_SERVER]
  : API_SERVERS;

export const OVERVIEW_SERVERS = import.meta.env.VITE_API_OVERVIEW_SERVER
  ? [import.meta.env.VITE_API_OVERVIEW_SERVER]
  : API_SERVERS;

export const PERFORMANCE_SERVERS = import.meta.env.VITE_API_PERFORMANCE_SERVER
  ? [import.meta.env.VITE_API_PERFORMANCE_SERVER]
  : API_SERVERS;

export const SCHEDULE_SERVERS = import.meta.env.VITE_API_SCHEDULE_SERVER
  ? [import.meta.env.VITE_API_SCHEDULE_SERVER]
  : API_SERVERS;

export const LEAVE_SERVERS = import.meta.env.VITE_API_LEAVE_SERVER
  ? [import.meta.env.VITE_API_LEAVE_SERVER]
  : API_SERVERS;

export const GRIEVANCE_SERVERS = import.meta.env.VITE_API_GRIEVANCE_SERVER
  ? [import.meta.env.VITE_API_GRIEVANCE_SERVER]
  : API_SERVERS;

export const MEETINGS_SERVERS = import.meta.env.VITE_API_MEETINGS_SERVER
  ? [import.meta.env.VITE_API_MEETINGS_SERVER]
  : API_SERVERS;

export const VITE_API_LOCAL_SERVER = import.meta.env.VITE_API_LOCAL_SERVER || '';
export const VITE_API_PROD_SERVER = import.meta.env.VITE_API_DEV || '';

export default {
  API_SERVERS,
  ANNOUNCEMENTS_SERVER,
  ALUMNI_SERVERS,
  BUS_TRACKING_SERVERS,
  COMMUNITY_SERVERS,
  OVERVIEW_SERVERS,
  PERFORMANCE_SERVERS,
  SCHEDULE_SERVERS,
  LEAVE_SERVERS,
  GRIEVANCE_SERVERS,
  MEETINGS_SERVERS,
  VITE_API_LOCAL_SERVER,
  VITE_API_PROD_SERVER,
};
