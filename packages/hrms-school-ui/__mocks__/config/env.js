// Jest mock for config/env.js to avoid import.meta.env errors
export const API_SERVERS = [
  'http://localhost:3000',
  'https://api.school.com'
];
export const ANNOUNCEMENTS_SERVER = ['http://localhost:3001'];
export const ALUMNI_SERVERS = ['http://localhost:3002'];
export const BUS_TRACKING_SERVERS = ['http://localhost:3003'];
export const COMMUNITY_SERVERS = ['http://localhost:3004'];
export const OVERVIEW_SERVERS = ['http://localhost:3005'];
export const PERFORMANCE_SERVERS = ['http://localhost:3006'];
export const SCHEDULE_SERVERS = ['http://localhost:3007'];
export const LEAVE_SERVERS = ['http://localhost:3008'];
export const GRIEVANCE_SERVERS = ['http://localhost:3009'];
export const MEETINGS_SERVERS = ['http://localhost:3010'];
export const VITE_API_LOCAL_SERVER = 'http://localhost:3000';
export const VITE_API_PROD_SERVER = 'https://api.school.com';
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
  VITE_API_PROD_SERVER
};