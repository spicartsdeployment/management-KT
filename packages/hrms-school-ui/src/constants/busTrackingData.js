/**
 * Bus Tracking Static Data Constants
 * This file contains all static/mock data for the bus tracking page.
 * Backend team should return data in these exact formats.
 * 
 * NOTE: Live tracking will use lat/long coordinates from API
 */

// Bus Current Status
export const busCurrentStatus = {
  status: 'on-route', // 'on-route' | 'at-stop' | 'delayed' | 'breakdown' | 'idle'
  busNumber: 'SC-BUS-01',
  route: 'Madhapur Route',
  nextStop: 'School Campus',
  currentLocation: {
    lat: 17.502184,
    lng: 78.394876,
    address: 'Currently on Pine Road',
    timestamp: Date.now(),
  },
};

// Driver Information
export const driverInfo = {
  id: 'DRV-2023-001',
  name: 'Ramesh Kumar',
  avatar: '',
  license: 'TS09-20150123456',
  yearsOfExperience: 8,
  phone: '9000020001',
  isVerified: true,
  rating: 4.8,
  totalTrips: 1250,
};

// Support Staff
export const supportStaff = [
  {
    id: 55001,
    role: 'Helper',
    name: 'Ramu',
    avatar: '',
    phone: '',
    certification: 'Safety Certified',
    certificationColor: 'pink',
    staffId: 55001,
  },
  {
    id: 55003,
    role: 'Transport Admin',
    name: 'Ramesh Kumar',
    avatar: '',
    phone: '',
    certification: 'Transport Licensed',
    certificationColor: 'blue',
    staffId: 55003,
  },
];

// Live Location & Timing
export const busTimings = {
  pickupTime: '08:00:00',
  pickupLabel: 'Morning pickup',
  dropTime: '08:25:00',
  dropLabel: 'School arrival',
  estimatedArrival: '25 min',
  totalTravelTime: '25 min',
};

// Route Visualization Data (for map display)
export const routeVisualization = {
  startPoint: {
    lat: 17.502184,
    lng: 78.394876,
    label: 'Home',
    time: '08:15',
    icon: '🏠',
  },
  endPoint: {
    lat: 17.522184,
    lng: 78.414876,
    label: 'School',
    time: '08:45',
    icon: '🏫',
  },
  currentBusPosition: {
    lat: 17.512184,
    lng: 78.404876,
    heading: 45, // degrees, for bus icon rotation
    speed: 35, // km/h
    lastUpdated: Date.now(),
  },
  // Intermediate stops/waypoints
  waypoints: [
    { lat: 17.505184, lng: 78.397876, type: 'stop', completed: true },
    { lat: 17.510184, lng: 78.402876, type: 'stop', completed: false },
    { lat: 17.515184, lng: 78.407876, type: 'landmark', completed: false },
  ],
};

// Route & Schedule (List of stops)
export const routeSchedule = [
  {
    id: 1,
    stopNumber: 1,
    name: 'Madhapur Main Road',
    address: '',
    time: '08:00',
    status: 'completed',
    lat: 17.502184,
    lng: 78.394876,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
  },
  {
    id: 2,
    stopNumber: 2,
    name: 'Hitech City Junction',
    address: '',
    time: '08:10',
    status: 'completed',
    lat: 17.510184,
    lng: 78.404876,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
  },
  {
    id: 3,
    stopNumber: 3,
    name: 'Kondapur Signal',
    address: '',
    time: '08:18',
    status: 'current',
    lat: 17.516184,
    lng: 78.410876,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
  },
  {
    id: 4,
    stopNumber: 4,
    name: 'School Campus',
    address: '',
    time: '08:25',
    status: 'pending',
    lat: 17.522184,
    lng: 78.414876,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
    isDestination: false,
  },
  {
    id: 5,
    stopNumber: 5,
    name: 'Main Gate',
    address: '',
    time: '08:35',
    status: 'pending',
    lat: 17.525000,
    lng: 78.418000,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
    isDestination: false,
  },
  {
    id: 6,
    stopNumber: 6,
    name: 'School Entrance',
    address: '',
    time: '08:45',
    status: 'pending',
    lat: 17.528000,
    lng: 78.420000,
    studentsBoarded: 0,
    estimatedWaitTime: 0,
    isDestination: true,
  },
];

// Daily Performance Metrics
export const dailyPerformance = {
  onTimeRate: 'NA',
  totalStudents: 'NA',
  routeDistance: 'NA',
  estimatedTimeArrival: 'NA',
  statusMessage: 'NA',
  statusIcon: '🏆',
  metrics: [
    {
      id: 1,
      label: 'On Time',
      value: 'NA',
      color: 'green',
      bgColor: 'sch-bus-metric-bg-green',
      textColor: 'sch-bus-metric-text-green',
    },
    {
      id: 2,
      label: 'Students',
      value: 'NA',
      color: 'blue',
      bgColor: 'sch-bus-metric-bg-blue',
      textColor: 'sch-bus-metric-text-blue',
    },
    {
      id: 3,
      label: 'km Route',
      value: 'NA',
      color: 'yellow',
      bgColor: 'sch-bus-metric-bg-yellow',
      textColor: 'sch-bus-metric-text-yellow',
    },
    {
      id: 4,
      label: 'min ETA',
      value: 'NA',
      color: 'purple',
      bgColor: 'sch-bus-metric-bg-purple',
      textColor: 'sch-bus-metric-text-purple',
    },
  ],
};

// Safety & Alerts
export const safetyAlerts = [
  {
    id: 1,
    type: 'success', // 'success' | 'warning' | 'error' | 'info'
    title: 'All Students Boarded',
    message: 'Every student checked in',
    icon: '✓',
    color: 'green',
    bgColor: 'sch-bus-alert-bg-green',
    textColor: 'sch-bus-alert-text-green',
    textSecondary: 'sch-bus-alert-text-green',
    iconBg: 'sch-bus-alert-icon-green',
    timestamp: Date.now(),
    priority: 'low',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Light Traffic Alert',
    message: '5 min delay expected',
    icon: '!',
    color: 'yellow',
    bgColor: 'sch-bus-alert-bg-yellow',
    textColor: 'sch-bus-alert-text-yellow',
    textSecondary: 'sch-bus-alert-text-yellow',
    iconBg: 'sch-bus-alert-icon-yellow',
    timestamp: Date.now(),
    priority: 'medium',
  },
];

// Emergency Contact Information
export const emergencyContact = {
  number: '+1-234-567-8999',
  name: 'Transport Coordinator',
  available24x7: true,
  alternateNumber: '+1-234-567-9000',
};

// Transport Incharge Information
export const transportIncharge = {
  id: 'TI-55003',
  name: 'Ramesh Kumar',
  role: 'Transport Admin',
  phone: '9000030005',
  yearsOfExperience: 9,
  availability: 'Available 24/7',
  isVerified: true,
  staffId: 55003,
};

// Weekly Analytics
export const weeklyAnalytics = {
  averageOnTimeRate: 95,
  totalDistance: 245,
  fuelEfficiency: 7.1,
  studentAttendance: 73.33,
  totalTrips: 50,
  totalStudentsTransported: 1750,
  averageSpeed: 35,
  carbonFootprint: 120,
  stats: [
    {
      id: 1,
      label: 'Average On-Time Rate',
      value: '95%',
      color: 'green',
      textColor: 'sch-bus-stat-text-green',
    },
    {
      id: 2,
      label: 'Total Distance',
      value: '245 km',
      color: 'blue',
      textColor: 'sch-bus-stat-text-blue',
    },
    {
      id: 3,
      label: 'Fuel Efficiency',
      value: '7.1 km/L',
      color: 'orange',
      textColor: 'sch-bus-stat-text-orange',
    },
    {
      id: 4,
      label: 'Student Attendance',
      value: '73.33%',
      color: 'purple',
      textColor: 'sch-bus-stat-text-purple',
    },
  ],
};

// Bus Capacity & Details
export const busCapacity = {
  currentOccupancy: 35,
  maxCapacity: 45,
  availableSeats: 10,
  wheelchairAccessible: true,
  hasAirConditioning: true,
  hasGPS: true,
  hasCCTV: true,
  lastMaintenanceDate: '2024-10-15',
  nextMaintenanceDate: '2025-01-15',
};

// Status Color Mapping (for UI consistency)
export const statusColors = {
  'on-route': {
    bg: 'sch-bus-status-bg-green',
    text: 'sch-bus-text-green',
    badge: 'sch-bus-badge-green',
    label: 'On Route',
  },
  'at-stop': {
    bg: 'sch-bus-status-bg-blue',
    text: 'sch-bus-text-blue',
    badge: 'sch-bus-badge-blue',
    label: 'At Stop',
  },
  delayed: {
    bg: 'sch-bus-status-bg-yellow',
    text: 'sch-bus-text-yellow',
    badge: 'sch-bus-badge-yellow',
    label: 'Delayed',
  },
  breakdown: {
    bg: 'sch-bus-status-bg-red',
    text: 'sch-bus-text-red',
    badge: 'sch-bus-badge-red',
    label: 'Breakdown',
  },
  idle: {
    bg: 'sch-bus-status-bg-gray',
    text: 'sch-bus-text-gray',
    badge: 'sch-bus-badge-gray',
    label: 'Idle',
  },
};

// API Endpoints (for future integration)
export const BUS_TRACKING_ENDPOINTS = {
  CURRENT_STATUS: '/api/bus/current-status',
  DRIVER_INFO: '/api/bus/driver',
  SUPPORT_STAFF: '/api/bus/support-staff',
  LIVE_LOCATION: '/api/bus/live-location',
  ROUTE_SCHEDULE: '/api/bus/route-schedule',
  DAILY_PERFORMANCE: '/api/bus/daily-performance',
  SAFETY_ALERTS: '/api/bus/safety-alerts',
  WEEKLY_ANALYTICS: '/api/bus/weekly-analytics',
};

// WebSocket configuration for live tracking
export const WEBSOCKET_CONFIG = {
  LIVE_TRACKING_URL: '/ws/bus-tracking',
  RECONNECT_INTERVAL: 3000, // ms
  MAX_RECONNECT_ATTEMPTS: 5,
  PING_INTERVAL: 30000, // ms
};
