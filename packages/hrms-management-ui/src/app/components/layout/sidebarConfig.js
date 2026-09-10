/**
 * Centralized sidebar navigation configuration for Management UI.
 * Parent items use emoji icons (matching School sidebar style).
 * Children (sub-items) intentionally have NO icons — text only.
 */

/** All route path constants — single source of truth */
export const MGMT_ROUTES = {
  DASHBOARD:               '/management/dashboard',

  FEES_OVERVIEW:           '/management/fees/overview',
  FEES_PAYMENTS:           '/management/fees/payments',
  FEES_DUE:                '/management/fees/due-management',

  TRANSPORT_ASSIGN:        '/management/transport/assign-bus',
  TRANSPORT_ROUTES:        '/management/transport/routes-drivers',
  TRANSPORT_TRACKING:      '/management/transport/tracking',

  ANNOUNCEMENTS_CREATE:    '/management/announcements/create',
  ANNOUNCEMENTS_MANAGE:    '/management/announcements/manage',

  GRIEVANCES_VIEW:         '/management/grievances/view',
  GRIEVANCES_RESOLVE:      '/management/grievances/assign',

  ACADEMIC_CLASSES:        '/management/academic/classes',
  ACADEMIC_SUBJECTS:       '/management/academic/subjects',
  ACADEMIC_BRANCHES:       '/management/academic/branches',

  EVENTS_CREATE:           '/management/events/create',
  EVENTS_MANAGE:           '/management/events/manage',
  EVENTS_PARTICIPATION:    '/management/events/participation',

  ALUMNI:                  '/management/alumni',
  LEAVE_MANAGEMENT:        '/management/leave-management',
  POLICIES:                '/management/policies',
  STAFF_MANAGEMENT:        '/management/staff-management',

  CAMPUS_INFRASTRUCTURE:   '/management/campus/infrastructure',
  CAMPUS_FACILITIES:       '/management/campus/facilities',
  CAMPUS_GALLERY:          '/management/campus/gallery',
  CAMPUS_CONTACT:          '/management/campus/contact',

  USERS_LIST:              '/management/users',
  USERS_ROLES:             '/management/users/roles',
  USERS_ADMIN:             '/management/users/admin-access',

  ANALYTICS_BUS:           '/management/analytics/bus',
  ANALYTICS_OPERATIONS:    '/management/analytics/operational',
  ANALYTICS_FEES:          '/management/analytics/fees',
  ANALYTICS_ATTENDANCE:    '/management/analytics/attendance',

  SETTINGS_GENERAL:        '/management/settings/general',
  SETTINGS_NOTIFICATIONS:  '/management/settings/notifications',
  SETTINGS_PREFERENCES:    '/management/settings/preferences',
};

/**
 * @typedef {Object} NavItem
 * @property {string}    id          - Unique identifier
 * @property {string}    label       - Display label
 * @property {string}    [path]      - Route path (leaf items only)
 * @property {string}    [icon]      - Emoji icon (parent/leaf items only — never on children)
 * @property {NavItem[]} [children]  - Nested sub-items (no icon field)
 * @property {string[]}  [roles]     - Allowed roles; omit for all roles
 */

/** @type {NavItem[]} */
export const SIDEBAR_CONFIG = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: MGMT_ROUTES.DASHBOARD,
    icon: '📊',
  },
  {
    id: 'fees',
    label: 'Fees',
    icon: '💰',
    children: [
      { id: 'fees-overview',  label: 'Fee Overview',      path: MGMT_ROUTES.FEES_OVERVIEW },
      { id: 'fees-payments',  label: 'Payment Tracking',  path: MGMT_ROUTES.FEES_PAYMENTS },
      { id: 'fees-due',       label: 'Due Management',    path: MGMT_ROUTES.FEES_DUE },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚌',
    children: [
      { id: 'transport-assign',   label: 'Assign Bus',       path: MGMT_ROUTES.TRANSPORT_ASSIGN },
      { id: 'transport-routes',   label: 'Routes & Drivers', path: MGMT_ROUTES.TRANSPORT_ROUTES },
      { id: 'transport-tracking', label: 'Live Tracking',    path: MGMT_ROUTES.TRANSPORT_TRACKING },
    ],
  },
  {
    id: 'announcements',
    label: 'Announcements',
    icon: '📢',
    children: [
      { id: 'announcements-create', label: 'Create Announcement',  path: MGMT_ROUTES.ANNOUNCEMENTS_CREATE },
      { id: 'announcements-manage', label: 'Manage Announcements', path: MGMT_ROUTES.ANNOUNCEMENTS_MANAGE },
    ],
  },
  {
    id: 'grievances',
    label: 'Grievances',
    icon: '⚠️',
    children: [
      { id: 'grievances-view',    label: 'View Complaints',  path: MGMT_ROUTES.GRIEVANCES_VIEW },
      { id: 'grievances-resolve', label: 'Assign & Resolve', path: MGMT_ROUTES.GRIEVANCES_RESOLVE },
    ],
  },
  {
    id: 'academic',
    label: 'Academic Setup',
    icon: '🎓',
    children: [
      { id: 'academic-classes',  label: 'Classes',  path: MGMT_ROUTES.ACADEMIC_CLASSES },
      { id: 'academic-subjects', label: 'Subjects', path: MGMT_ROUTES.ACADEMIC_SUBJECTS },
      { id: 'academic-branches', label: 'Branches', path: MGMT_ROUTES.ACADEMIC_BRANCHES },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    icon: '📅',
    children: [
      { id: 'events-create',        label: 'Create Events',        path: MGMT_ROUTES.EVENTS_CREATE },
      { id: 'events-manage',        label: 'Manage Events',        path: MGMT_ROUTES.EVENTS_MANAGE },
      { id: 'events-participation', label: 'Participation Mgmt.',  path: MGMT_ROUTES.EVENTS_PARTICIPATION },
    ],
  },
  {
    id: 'alumni',
    label: 'Alumni',
    path: MGMT_ROUTES.ALUMNI,
    icon: '🧑‍🎓',
  },
  {
    id: 'leave-management',
    label: 'Leave Management',
    path: MGMT_ROUTES.LEAVE_MANAGEMENT,
    icon: '🗒️',
  },
  {
    id: 'policies',
    label: 'Policies',
    path: MGMT_ROUTES.POLICIES,
    icon: '📋',
  },
  {
    id: 'staff-management',
    label: 'Staff Management',
    path: MGMT_ROUTES.STAFF_MANAGEMENT,
    icon: '👥',
  },
  {
    id: 'campus',
    label: 'Campus Management',
    icon: '🏢',
    children: [
      { id: 'campus-infrastructure', label: 'Infrastructure',     path: MGMT_ROUTES.CAMPUS_INFRASTRUCTURE },
      { id: 'campus-facilities',     label: 'Facilities',         path: MGMT_ROUTES.CAMPUS_FACILITIES },
      { id: 'campus-gallery',        label: 'Gallery',            path: MGMT_ROUTES.CAMPUS_GALLERY },
      { id: 'campus-contact',        label: 'Contact Information',path: MGMT_ROUTES.CAMPUS_CONTACT },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: '🔐',
    roles: ['admin', 'management'],
    children: [
      { id: 'users-list',  label: 'Users',              path: MGMT_ROUTES.USERS_LIST },
      { id: 'users-roles', label: 'Roles & Permissions', path: MGMT_ROUTES.USERS_ROLES },
      { id: 'users-admin', label: 'Admin Access',        path: MGMT_ROUTES.USERS_ADMIN },
    ],
  },
  {
    id: 'analytics',
    label: 'Reports & Analytics',
    icon: '📈',
    children: [
      { id: 'analytics-bus',        label: 'Bus Analytics',       path: MGMT_ROUTES.ANALYTICS_BUS },
      { id: 'analytics-operations', label: 'Operational Insights', path: MGMT_ROUTES.ANALYTICS_OPERATIONS },
      { id: 'analytics-fees',       label: 'Fee Reports',         path: MGMT_ROUTES.ANALYTICS_FEES },
      { id: 'analytics-attendance', label: 'Attendance Reports',  path: MGMT_ROUTES.ANALYTICS_ATTENDANCE },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    children: [
      { id: 'settings-general',       label: 'General Settings',  path: MGMT_ROUTES.SETTINGS_GENERAL },
      { id: 'settings-notifications', label: 'Notifications',     path: MGMT_ROUTES.SETTINGS_NOTIFICATIONS },
      { id: 'settings-preferences',   label: 'System Preferences',path: MGMT_ROUTES.SETTINGS_PREFERENCES },
    ],
  },
];
