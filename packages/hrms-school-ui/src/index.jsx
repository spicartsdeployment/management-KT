/**
 * School UI Package Entry Point
 * Exports all public components and utilities
 */

// Pages
export { default as BusTracking } from './pages/bus-tracking';
export { default as DailySchedule } from './pages/daily-schedule';
export { default as MeetingScheduler } from './pages/meeting-scheduler';
export { default as GrievanceSystem } from './pages/grievance-system';
export { default as CommunityForum } from './pages/community-forum';

// Components
export { default as MapView } from './components/MapView';

// Services
export { default as busSocket } from './services/socket/busSocket';

// Constants
export * from './constants/busTrackingData';
