// Sidebar menu configuration
export const SIDEBAR_MENU_ITEMS = [
  {
    id: 'dashboard',
    title: 'Overview',
    path: '/school/dashboard',
    icon: 'HomeIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'bus-tracking',
    title: 'Bus Tracking',
    path: '/school/bus-tracking',
    icon: 'TruckIcon',
    badge: 'live',
    status: 'active'
  },
  {
    id: 'daily-schedule',
    title: 'Daily Schedule',
    path: '/school/daily-schedule',
    icon: 'CalendarDaysIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'fee-management',
    title: 'Fee Management',
    path: '/school/fee-management',
    icon: 'CreditCardIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'alumni-network',
    title: 'Alumni Network',
    path: '/school/alumni-network',
    icon: 'UsersIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'leave-management',
    title: 'Leave Management',
    path: '/school/leave-management',
    icon: 'DocumentCheckIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'performance-analytics',
    title: 'Performance Analytics',
    path: '/school/performance-analytics',
    icon: 'ChartBarIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'communication-hub',
    title: 'Communication Hub',
    path: '/school/communication-hub',
    icon: 'ChatBubbleLeftRightIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'meeting-scheduler',
    title: 'Meeting Scheduler',
    path: '/school/meeting-scheduler',
    icon: 'VideoCameraIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'grievance-system',
    title: 'Grievance System',
    path: '/school/grievance-system',
    icon: 'ExclamationTriangleIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'community-forum',
    title: 'Community Forum',
    path: '/school/community-forum',
    icon: 'ChatBubbleBottomCenterTextIcon',
    badge: null,
    status: 'active'
  },
  {
    id: 'global-announcements',
    title: 'Global Announcements',
    path: '/school/global-announcements',
    icon: 'SpeakerWaveIcon',
    badge: '3',
    status: 'active'
  }
]

// User roles
export const USER_ROLES = {
  PARENT: 'parent',
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  MANAGEMENT: 'management',
}

// Portal label shown to user when they try to log in from wrong tab
export const ROLE_PORTAL_LABELS = {
  parent: 'Parent',
  student: 'Student',
  teacher: 'Teacher',
  admin: 'Admin',
  management: 'Management',
}

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

// Dummy student data
export const DUMMY_STUDENTS = [
  {
    id: 'STU001',
    name: 'Alex Johnson',
    class: '10-A',
    rollNumber: '001',
    section: 'A',
    avatar: null,
    parentId: 'PAR001',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'],
    currentGrade: 'A+',
    attendance: 94.5,
    busRoute: 'Route-7'
  },
  {
    id: 'STU002',
    name: 'Emma Davis',
    class: '9-B',
    rollNumber: '015',
    section: 'B',
    avatar: null,
    parentId: 'PAR001',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Art'],
    currentGrade: 'A',
    attendance: 96.2,
    busRoute: 'Route-7'
  }
]

// Subject schedule data
export const DAILY_SCHEDULE = [
  {
    id: 'schedule-1',
    subject: 'Mathematics',
    teacher: 'Dr. Smith',
    time: '09:00 - 09:45',
    room: 'Room 101',
    type: 'regular',
    icon: 'CalculatorIcon',
    color: 'bg-blue-500'
  },
  {
    id: 'schedule-2',
    subject: 'Physics',
    teacher: 'Prof. Johnson',
    time: '09:45 - 10:30',
    room: 'Lab 201',
    type: 'lab',
    icon: 'BeakerIcon',
    color: 'bg-purple-500'
  },
  {
    id: 'schedule-3',
    subject: 'English',
    teacher: 'Ms. Brown',
    time: '10:45 - 11:30',
    room: 'Room 105',
    type: 'regular',
    icon: 'BookOpenIcon',
    color: 'bg-green-500'
  },
  {
    id: 'schedule-4',
    subject: 'Chemistry',
    teacher: 'Dr. Wilson',
    time: '11:30 - 12:15',
    room: 'Lab 203',
    type: 'lab',
    icon: 'BeakerIcon',
    color: 'bg-red-500'
  },
  {
    id: 'schedule-5',
    subject: 'History',
    teacher: 'Mr. Taylor',
    time: '13:15 - 14:00',
    room: 'Room 108',
    type: 'regular',
    icon: 'ClockIcon',
    color: 'bg-yellow-500'
  },
  {
    id: 'schedule-6',
    subject: 'Computer Science',
    teacher: 'Ms. Garcia',
    time: '14:00 - 14:45',
    room: 'Computer Lab',
    type: 'lab',
    icon: 'ComputerDesktopIcon',
    color: 'bg-indigo-500'
  },
  {
    id: 'schedule-7',
    subject: 'Geography',
    teacher: 'Dr. Lee',
    time: '14:45 - 15:30',
    room: 'Room 110',
    type: 'regular',
    icon: 'GlobeAltIcon',
    color: 'bg-teal-500'
  },
  {
    id: 'schedule-8',
    subject: 'Physical Education',
    teacher: 'Coach Martinez',
    time: '15:30 - 16:15',
    room: 'Gymnasium',
    type: 'sports',
    icon: 'Trophy',
    color: 'bg-orange-500'
  }
]

// Dashboard widget data
export const DASHBOARD_WIDGETS = {
  attendance: {
    title: 'Attendance',
    value: '94.5%',
    change: '+2.1%',
    trend: 'up',
    icon: 'UserCheckIcon',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    data: [
      { date: '2024-01-01', value: 92 },
      { date: '2024-01-02', value: 94 },
      { date: '2024-01-03', value: 96 },
      { date: '2024-01-04', value: 93 },
      { date: '2024-01-05', value: 95 }
    ]
  },
  assignments: {
    title: 'Assignments',
    value: '8/10',
    change: '2 pending',
    trend: 'neutral',
    icon: 'DocumentTextIcon',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    pendingCount: 2,
    completedCount: 8,
    totalCount: 10
  },
  rank: {
    title: 'Class Rank',
    value: '#3',
    change: '+1 position',
    trend: 'up',
    icon: 'TrophyIcon',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    totalStudents: 45,
    currentRank: 3,
    previousRank: 4
  },
  grade: {
    title: 'Overall Grade',
    value: 'A+',
    change: '+0.2 GPA',
    trend: 'up',
    icon: 'AcademicCapIcon',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    gpa: 9.2,
    maxGpa: 10.0,
    subjects: 8
  }
}

// Bus tracking data
export const BUS_TRACKING_DATA = {
  busNumber: 'Bus-07',
  route: 'Route-7',
  driver: {
    name: 'John Smith',
    phone: '+1-234-567-8900',
    license: 'DL12345'
  },
  currentLocation: {
    lat: 40.7128,
    lng: -74.0060,
    address: 'Main St & 5th Ave'
  },
  nextStop: {
    name: 'Oakwood Elementary',
    eta: '5 min',
    students: 12
  },
  status: 'on-route', // 'on-route', 'at-stop', 'delayed', 'breakdown'
  speed: 25, // km/h
  capacity: 50,
  currentOccupancy: 32,
  students: [
    { id: 'STU001', name: 'Alex Johnson', stop: 'Central Park' },
    { id: 'STU002', name: 'Emma Davis', stop: 'Central Park' }
  ]
}

// Fee management data
export const FEE_DATA = {
  totalFees: 15000,
  paidAmount: 12000,
  pendingAmount: 3000,
  dueDate: '2024-02-15',
  installments: [
    {
      id: 'INS001',
      name: 'First Installment',
      amount: 5000,
      dueDate: '2024-01-15',
      status: 'paid',
      paidDate: '2024-01-12'
    },
    {
      id: 'INS002',
      name: 'Second Installment',
      amount: 5000,
      dueDate: '2024-02-15',
      status: 'paid',
      paidDate: '2024-02-10'
    },
    {
      id: 'INS003',
      name: 'Third Installment',
      amount: 2000,
      dueDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: 'INS004',
      name: 'Final Installment',
      amount: 3000,
      dueDate: '2024-04-15',
      status: 'upcoming'
    }
  ]
}

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ANNOUNCEMENT: 'announcement'
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  STUDENTS: {
    LIST: '/students',
    DETAIL: '/students/:id',
    ATTENDANCE: '/students/:id/attendance',
    GRADES: '/students/:id/grades'
  },
  SCHEDULE: {
    DAILY: '/schedule/daily',
    WEEKLY: '/schedule/weekly'
  },
  FEES: {
    SUMMARY: '/fees/summary',
    PAYMENTS: '/fees/payments',
    INSTALLMENTS: '/fees/installments'
  },
  BUS: {
    TRACKING: '/bus/tracking',
    ROUTES: '/bus/routes'
  }
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ROLE: 'user_role',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  SELECTED_STUDENT: 'selected_student',
  DASHBOARD_LAYOUT: 'dashboard_layout'
}

// Date and time formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm'
}

// Status colors
export const STATUS_COLORS = {
  active: 'text-green-600 bg-green-100',
  inactive: 'text-gray-600 bg-gray-100',
  pending: 'text-yellow-600 bg-yellow-100',
  overdue: 'text-red-600 bg-red-100',
  completed: 'text-blue-600 bg-blue-100',
  'coming-soon': 'text-purple-600 bg-purple-100'
}