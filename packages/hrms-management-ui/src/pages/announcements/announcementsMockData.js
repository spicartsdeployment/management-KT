// --- Announcements Mock Data (an-*) ---

// Announcement Types/Categories
export const ANNOUNCEMENT_TYPES = [
  { id: 'general', label: 'General Notice', icon: 'info', color: '#2563eb' },
  { id: 'emergency', label: 'Emergency Alert', icon: 'alert', color: '#dc2626' },
  { id: 'fee', label: 'Fee Reminder', icon: 'dollar-sign', color: '#d97706' },
  { id: 'event', label: 'Event Announcement', icon: 'calendar', color: '#8b5cf6' },
  { id: 'holiday', label: 'Holiday Notice', icon: 'sun', color: '#06b6d4' },
  { id: 'exam', label: 'Exam Notice', icon: 'clipboard-list', color: '#7c3aed' },
  { id: 'transport', label: 'Transport Alert', icon: 'truck', color: '#6366f1' },
  { id: 'staff', label: 'Staff Circular', icon: 'users', color: '#14b8a6' },
  { id: 'pta', label: 'PTA Update', icon: 'message-square', color: '#ec4899' },
  { id: 'sports', label: 'Sports/Cultural', icon: 'star', color: '#f59e0b' },
  { id: 'maintenance', label: 'Maintenance Notice', icon: 'wrench', color: '#64748b' },
  { id: 'closure', label: 'Urgent Closure', icon: 'x-circle', color: '#ef4444' },
];

export const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low', icon: 'chevron-down', color: '#16a34a' },
  { id: 'medium', label: 'Medium', icon: 'minus', color: '#d97706' },
  { id: 'high', label: 'High', icon: 'chevron-up', color: '#dc2626' },
  { id: 'urgent', label: 'Urgent', icon: 'alert-circle', color: '#9f1239' },
];

// Delivery Channels
export const DELIVERY_CHANNELS = [
  { id: 'in-app', label: 'In-App Notification', icon: 'bell', selected: true },
  { id: 'sms', label: 'SMS', icon: 'message-circle', selected: true },
  { id: 'email', label: 'Email', icon: 'mail', selected: true },
  { id: 'push', label: 'Push Notification', icon: 'send', selected: false },
  { id: 'website', label: 'Website Banner', icon: 'layout', selected: false },
  { id: 'parent-app', label: 'Parent App', icon: 'smartphone', selected: false },
  { id: 'staff-app', label: 'Staff App', icon: 'tablet', selected: false },
];

// Audience Segments
export const AUDIENCE_SEGMENTS = {
  students: [
    { id: 'all-students', label: 'All Students' },
    { id: 'class-1-a', label: 'Class 1-A', group: 'Class-wise' },
    { id: 'class-1-b', label: 'Class 1-B', group: 'Class-wise' },
    { id: 'class-2-a', label: 'Class 2-A', group: 'Class-wise' },
    { id: 'class-2-b', label: 'Class 2-B', group: 'Class-wise' },
    { id: 'class-10-a', label: 'Class 10-A', group: 'Class-wise' },
    { id: 'class-10-b', label: 'Class 10-B', group: 'Class-wise' },
    { id: 'section-a', label: 'Section A', group: 'Section-wise' },
    { id: 'section-b', label: 'Section B', group: 'Section-wise' },
    { id: 'house-red', label: 'House Red', group: 'House-wise' },
    { id: 'house-blue', label: 'House Blue', group: 'House-wise' },
    { id: 'house-green', label: 'House Green', group: 'House-wise' },
    { id: 'bus-students', label: 'Bus Students', group: 'Custom Groups' },
    { id: 'hostel-students', label: 'Hostel Students', group: 'Custom Groups' },
  ],
  parents: [
    { id: 'all-parents', label: 'All Parents' },
    { id: 'class-1-parents', label: 'Class 1 Parents', group: 'Class-wise' },
    { id: 'class-2-parents', label: 'Class 2 Parents', group: 'Class-wise' },
    { id: 'class-10-parents', label: 'Class 10 Parents', group: 'Class-wise' },
  ],
  staff: [
    { id: 'all-staff', label: 'All Staff' },
    { id: 'teachers', label: 'Teachers', group: 'Role-wise' },
    { id: 'transport-staff', label: 'Transport Staff', group: 'Role-wise' },
    { id: 'admin-staff', label: 'Admin Staff', group: 'Role-wise' },
    { id: 'support-staff', label: 'Support Staff', group: 'Role-wise' },
  ],
};

// Templates
export const ANNOUNCEMENT_TEMPLATES = [
  {
    id: 'temp-1',
    name: 'Fee Payment Reminder',
    category: 'fee',
    subject: 'Fee Payment Reminder',
    preview: 'Please submit your fees by...',
    description: 'Standard fee reminder template',
  },
  {
    id: 'temp-2',
    name: 'Holiday Closure',
    category: 'holiday',
    subject: 'Holiday Closure Notice',
    preview: 'School will be closed for...',
    description: 'Holiday announcement template',
  },
  {
    id: 'temp-3',
    name: 'Exam Schedule',
    category: 'exam',
    subject: 'Exam Schedule Released',
    preview: 'The exam schedule has been released...',
    description: 'Exam notification template',
  },
  {
    id: 'temp-4',
    name: 'Event Invitation',
    category: 'event',
    subject: 'You are invited to...',
    preview: 'Join us for our upcoming event...',
    description: 'Event invitation template',
  },
];

// Scheduled Announcements (Sample)
export const MOCK_SCHEDULED_ANNOUNCEMENTS = [
  {
    id: 'sch-001',
    title: 'Annual Day 2026 - Save The Date',
    category: 'event',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: '2026-06-15T10:00:00',
    audience: ['all-students', 'all-parents'],
    channels: ['in-app', 'email', 'sms'],
    views: 0,
    clicks: 0,
    sent: false,
  },
  {
    id: 'sch-002',
    title: 'Q3 Fee Payment Due',
    category: 'fee',
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: '2026-06-01T08:00:00',
    audience: ['all-parents'],
    channels: ['email', 'sms'],
    views: 0,
    clicks: 0,
    sent: false,
  },
];

// Draft Announcements (Sample)
export const MOCK_DRAFT_ANNOUNCEMENTS = [
  {
    id: 'draft-001',
    title: 'Summer Vacation Schedule',
    category: 'holiday',
    priority: 'medium',
    status: 'draft',
    summary: 'Information about summer vacation dates',
    createdDate: '2026-05-20T14:30:00',
    lastModified: '2026-05-25T09:15:00',
  },
  {
    id: 'draft-002',
    title: 'Sports Day Registration',
    category: 'sports',
    priority: 'low',
    status: 'draft',
    summary: 'Registration details for upcoming sports day',
    createdDate: '2026-05-22T10:00:00',
    lastModified: '2026-05-25T14:00:00',
  },
];

// Published Announcements (Sample)
export const MOCK_PUBLISHED_ANNOUNCEMENTS = [
  {
    id: 'pub-001',
    title: 'School Reopening - May 26, 2026',
    category: 'general',
    priority: 'high',
    status: 'published',
    publishedDate: '2026-05-25T08:00:00',
    audience: ['all-students', 'all-parents', 'all-staff'],
    channels: ['in-app', 'email', 'sms', 'website'],
    views: 1247,
    clicks: 342,
    expiryDate: '2026-06-25T23:59:59',
  },
  {
    id: 'pub-002',
    title: 'Transport Schedule Update',
    category: 'transport',
    priority: 'medium',
    status: 'published',
    publishedDate: '2026-05-24T10:30:00',
    audience: ['bus-students', 'all-parents'],
    channels: ['in-app', 'sms', 'parent-app'],
    views: 856,
    clicks: 128,
    expiryDate: '2026-06-24T23:59:59',
  },
];

// Sample Rich Text Content
export const SAMPLE_ANNOUNCEMENT_CONTENT = {
  title: 'Annual Day 2026 - Grand Celebration',
  summary: 'Join us for our magnificent annual celebration showcasing talent, achievements, and school spirit.',
  description: `Dear Esteemed Parents, Students, and Staff,

We are delighted to announce the Annual Day 2026 celebration of our prestigious institution.

Event Highlights:
• Cultural performances by students from all classes
• Awards ceremony recognizing academic and sports excellence
• Special guest appearances
• Interactive stalls and refreshments

Date: June 15, 2026
Time: 10:00 AM onwards
Venue: School Auditorium

Please mark your calendars and join us for an unforgettable day of celebration and pride.

For further details, please contact the Office of Student Affairs.

Best Regards,
School Management`,
};

// Test Recipients
export const TEST_RECIPIENTS = [
  { id: 'test-1', email: 'principal@school.edu', phone: '+91-9876543210', name: 'Principal' },
  { id: 'test-2', email: 'admin@school.edu', phone: '+91-9876543211', name: 'Admin Head' },
];

// Attachment Types
export const SUPPORTED_FILE_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'doc', 'docx', 'xls', 'xlsx'];
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Languages
export const SUPPORTED_LANGUAGES = [
  { id: 'en', label: 'English', nativeName: 'English' },
  { id: 'es', label: 'Spanish', nativeName: 'Español' },
  { id: 'fr', label: 'French', nativeName: 'Français' },
  { id: 'de', label: 'German', nativeName: 'Deutsch' },
];
