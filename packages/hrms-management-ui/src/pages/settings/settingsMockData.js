/** @module settingsMockData – mock data for the General Settings module */

export const INSTITUTION_DEFAULTS = {
  name: 'Cambridge International Academy',
  code: 'CIA-2026',
  board: 'CBSE',
  regNumber: 'REG-KL-2001-0042',
  academicYear: '2025-2026',
  established: '2001',
  principal: 'Dr. Priya Sharma',
  category: 'Higher Secondary',
  website: 'https://www.ciaschool.edu.in',
};

export const CAMPUSES = [
  { id: 1, name: 'Main Campus',  code: 'CIA-MAIN',  city: 'Kochi',   state: 'Kerala', timezone: 'IST (UTC+5:30)', workingHours: '8 AM – 5 PM', status: 'Active' },
  { id: 2, name: 'North Campus', code: 'CIA-NORTH', city: 'Thrissur', state: 'Kerala', timezone: 'IST (UTC+5:30)', workingHours: '8 AM – 4 PM', status: 'Active' },
];

export const INTEGRATIONS = [
  { id: 1, name: 'Razorpay',     category: 'Payment',    icon: '💳', status: 'Connected',      lastSync: '2026-05-20 09:00' },
  { id: 2, name: 'Twilio SMS',   category: 'SMS',        icon: '📱', status: 'Connected',      lastSync: '2026-05-20 08:45' },
  { id: 3, name: 'SendGrid',     category: 'Email',      icon: '✉️', status: 'Connected',      lastSync: '2026-05-20 09:15' },
  { id: 4, name: 'Google SSO',   category: 'Auth',       icon: '🔐', status: 'Connected',      lastSync: '2026-05-19 18:00' },
  { id: 5, name: 'Moodle LMS',   category: 'LMS',        icon: '📚', status: 'Disconnected',   lastSync: '—' },
  { id: 6, name: 'Tally ERP',    category: 'Accounting', icon: '📊', status: 'Disconnected',   lastSync: '—' },
  { id: 7, name: 'Stripe',       category: 'Payment',    icon: '💰', status: 'Not Configured', lastSync: '—' },
  { id: 8, name: 'WhatsApp API', category: 'Messaging',  icon: '💬', status: 'Connected',      lastSync: '2026-05-20 09:00' },
];

export const BACKUP_HISTORY = [
  { id: 'BKP-001', type: 'Automatic', status: 'Success', size: '2.4 GB', date: '2026-05-20 03:00', storage: 'Cloud' },
  { id: 'BKP-002', type: 'Manual',    status: 'Success', size: '2.3 GB', date: '2026-05-19 18:30', storage: 'Cloud' },
  { id: 'BKP-003', type: 'Automatic', status: 'Success', size: '2.3 GB', date: '2026-05-19 03:00', storage: 'Cloud' },
  { id: 'BKP-004', type: 'Automatic', status: 'Failed',  size: '—',      date: '2026-05-18 03:00', storage: 'Cloud' },
  { id: 'BKP-005', type: 'Automatic', status: 'Success', size: '2.2 GB', date: '2026-05-17 03:00', storage: 'Cloud' },
];

export const AUDIT_LOGS = [
  { id: 'AUD-001', admin: 'Dr. Priya Sharma',   module: 'Branding',      action: 'Updated school logo',           severity: 'Info',    time: '2026-05-20 10:15' },
  { id: 'AUD-002', admin: 'Mr. Rajesh Nair',    module: 'Fee Settings',  action: 'Changed late fee percentage',   severity: 'Medium',  time: '2026-05-20 09:45' },
  { id: 'AUD-003', admin: 'Ms. Meena Iyer',     module: 'Security',      action: 'Enabled 2FA for all admins',    severity: 'High',    time: '2026-05-20 09:00' },
  { id: 'AUD-004', admin: 'Mr. Vinod Rajan',    module: 'Integrations',  action: 'Connected Razorpay API',        severity: 'Info',    time: '2026-05-19 17:30' },
  { id: 'AUD-005', admin: 'Dr. Priya Sharma',   module: 'Academic',      action: 'Updated grading scale',         severity: 'Medium',  time: '2026-05-19 15:00' },
  { id: 'AUD-006', admin: 'Mr. Rajesh Nair',    module: 'Backup',        action: 'Manual backup triggered',       severity: 'Info',    time: '2026-05-19 18:30' },
  { id: 'AUD-007', admin: 'System',             module: 'Maintenance',   action: 'Scheduled maintenance started', severity: 'Warning', time: '2026-05-18 02:00' },
  { id: 'AUD-008', admin: 'Ms. Divya Krishnan', module: 'Communication', action: 'Updated SMTP configuration',    severity: 'Info',    time: '2026-05-18 11:00' },
];

export const FINANCE_DEFAULTS = {
  currency: 'INR', currencySymbol: '₹',
  taxLabel: 'GST', taxRate: 18,
  invoicePrefix: 'INV', invoiceStartNo: 1001,
  lateFeeRate: 2, lateFeeType: 'Percentage',
  reminderInterval: 7,
};

export const NOTIFICATION_PREFS = [
  { id: 'att',  label: 'Attendance Alerts',  sms: true,  email: true,  push: true,  whatsapp: false },
  { id: 'fee',  label: 'Fee Reminders',      sms: true,  email: true,  push: false, whatsapp: true  },
  { id: 'exam', label: 'Exam Notifications', sms: false, email: true,  push: true,  whatsapp: false },
  { id: 'emer', label: 'Emergency Alerts',   sms: true,  email: true,  push: true,  whatsapp: true  },
  { id: 'evt',  label: 'Event Reminders',    sms: false, email: true,  push: true,  whatsapp: false },
];

export const TEMPLATES = [
  { id: 1, name: 'Report Card',    type: 'PDF',   last: '2026-04-15', status: 'Active' },
  { id: 2, name: 'Fee Receipt',    type: 'PDF',   last: '2026-03-01', status: 'Active' },
  { id: 3, name: 'ID Card',        type: 'Print', last: '2026-01-10', status: 'Active' },
  { id: 4, name: 'Certificate',    type: 'PDF',   last: '2025-12-20', status: 'Draft'  },
  { id: 5, name: 'Admit Card',     type: 'PDF',   last: '2026-02-28', status: 'Active' },
  { id: 6, name: 'Transfer Cert.', type: 'PDF',   last: '2025-11-15', status: 'Active' },
];

export const HEALTH_DATA = [
  { label: 'CPU Usage',       value: 42,   unit: '%',          status: 'good',    icon: '🖥️' },
  { label: 'Memory Usage',    value: 68,   unit: '%',          status: 'warning', icon: '💾' },
  { label: 'Storage Used',    value: 36,   unit: '% of 5 TB',  status: 'good',    icon: '🗄️' },
  { label: 'Active Sessions', value: 247,  unit: 'users',      status: 'good',    icon: '👥' },
  { label: 'API Uptime',      value: 99.8, unit: '%',          status: 'good',    icon: '🔌' },
  { label: 'DB Response',     value: 45,   unit: 'ms',         status: 'good',    icon: '📊' },
];

export const PAYMENT_GATEWAYS = [
  { id: 'razorpay', name: 'Razorpay', status: 'Active',   mode: 'Live' },
  { id: 'stripe',   name: 'Stripe',   status: 'Inactive', mode: '—'    },
  { id: 'payu',     name: 'PayU',     status: 'Inactive', mode: '—'    },
];
