/** @module notificationsMockData – mock data for the Notifications module */

export const METRICS = [
  { id: 'total-sent',    label: 'Total Sent',           value: '1,24,832', icon: '📤', trend: '+12% this month', color: 'primary' },
  { id: 'scheduled',     label: 'Scheduled',            value: '347',      icon: '🕐', trend: '5 due today',    color: 'info' },
  { id: 'failed',        label: 'Failed Deliveries',    value: '128',      icon: '❌', trend: '-18% vs last',  color: 'danger' },
  { id: 'success-rate',  label: 'Success Rate',         value: '99.2%',    icon: '✅', trend: '+0.4%',         color: 'success' },
  { id: 'templates',     label: 'Active Templates',     value: '24',       icon: '📋', trend: '2 new this week',color: 'warning' },
  { id: 'emergency',     label: 'Emergency Alerts',     value: '3',        icon: '🚨', trend: 'This month',    color: 'emergency' },
];

export const CHANNELS_STATUS = [
  { id: 'email',    name: 'Email',              icon: '✉️', provider: 'SendGrid',                  status: 'Active', sentToday: 4820, failRate: '0.8%' },
  { id: 'sms',      name: 'SMS',                icon: '📱', provider: 'Twilio',                    status: 'Active', sentToday: 3210, failRate: '1.2%' },
  { id: 'whatsapp', name: 'WhatsApp',           icon: '💬', provider: 'WhatsApp Business API',     status: 'Active', sentToday: 1840, failRate: '0.4%' },
  { id: 'push',     name: 'Push Notifications', icon: '🔔', provider: 'Firebase FCM',              status: 'Active', sentToday: 7620, failRate: '0.2%' },
  { id: 'inapp',    name: 'In-App',             icon: '🖥️', provider: 'Internal',                  status: 'Active', sentToday: 9430, failRate: '0.0%' },
];

export const NOTIFICATION_TEMPLATES = [
  { id: 1, name: 'Fee Reminder',         type: 'Fee',        channel: ['SMS', 'Email', 'WhatsApp'], trigger: 'Manual / Auto', status: 'Active', lastUsed: '2026-05-20' },
  { id: 2, name: 'Attendance Alert',     type: 'Attendance', channel: ['SMS', 'Push'],              trigger: 'Auto',          status: 'Active', lastUsed: '2026-05-20' },
  { id: 3, name: 'Exam Reminder',        type: 'Exam',       channel: ['Email', 'Push'],            trigger: 'Scheduled',     status: 'Active', lastUsed: '2026-05-15' },
  { id: 4, name: 'Transport Alert',      type: 'Transport',  channel: ['SMS', 'Push'],              trigger: 'Auto',          status: 'Active', lastUsed: '2026-05-20' },
  { id: 5, name: 'Leave Notification',   type: 'Leave',      channel: ['Email'],                    trigger: 'Manual',        status: 'Active', lastUsed: '2026-05-18' },
  { id: 6, name: 'Payment Confirmation', type: 'Fee',        channel: ['Email', 'SMS'],             trigger: 'Auto',          status: 'Active', lastUsed: '2026-05-20' },
  { id: 7, name: 'Emergency Alert',      type: 'Emergency',  channel: ['SMS', 'Email', 'Push', 'WhatsApp'], trigger: 'Manual', status: 'Active', lastUsed: '2026-05-18' },
  { id: 8, name: 'Hostel Check-in',      type: 'Hostel',     channel: ['SMS', 'Push'],              trigger: 'Scheduled',     status: 'Draft',  lastUsed: '—' },
  { id: 9, name: 'Assignment Reminder',  type: 'Academic',   channel: ['Push', 'Email'],            trigger: 'Auto',          status: 'Active', lastUsed: '2026-05-19' },
  { id: 10,name: 'System Alert',         type: 'System',     channel: ['Email', 'Push'],            trigger: 'Auto',          status: 'Active', lastUsed: '2026-05-17' },
];

export const SCHEDULED_QUEUE = [
  { id: 'SCH-001', name: 'Fee Due Reminder — June Batch',    channel: 'SMS + Email',       recipients: 842,  scheduledAt: '2026-06-01 09:00', status: 'Pending' },
  { id: 'SCH-002', name: 'Exam Timetable Announcement',      channel: 'Email + Push',      recipients: 1240, scheduledAt: '2026-05-25 07:30', status: 'Pending' },
  { id: 'SCH-003', name: 'Holiday Reminder — Eid',           channel: 'WhatsApp',          recipients: 2100, scheduledAt: '2026-05-22 18:00', status: 'Pending' },
  { id: 'SCH-004', name: 'Attendance Report — Weekly',       channel: 'Email',             recipients: 380,  scheduledAt: '2026-05-21 20:00', status: 'Processing' },
  { id: 'SCH-005', name: 'PTA Meeting Reminder',             channel: 'SMS + WhatsApp',    recipients: 760,  scheduledAt: '2026-05-20 17:00', status: 'Sent' },
];

export const NOTIFICATION_HISTORY = [
  { id: 'NH-001', name: 'Fee Reminder — May Batch',    type: 'Fee',       channel: 'SMS + Email',  recipients: 824,  sent: 821, failed: 3, sentAt: '2026-05-20 09:00', status: 'Completed' },
  { id: 'NH-002', name: 'Attendance Alert — Grade 10', type: 'Attendance',channel: 'SMS',          recipients: 42,   sent: 40,  failed: 2, sentAt: '2026-05-20 08:15', status: 'Completed' },
  { id: 'NH-003', name: 'Transport Delay Alert',       type: 'Transport', channel: 'Push + SMS',   recipients: 186,  sent: 186, failed: 0, sentAt: '2026-05-20 07:48', status: 'Completed' },
  { id: 'NH-004', name: 'PTA Meeting Reminder',        type: 'Reminder',  channel: 'SMS + WhatsApp',recipients: 760, sent: 755, failed: 5, sentAt: '2026-05-19 17:00', status: 'Completed' },
  { id: 'NH-005', name: 'Exam Timetable Update',       type: 'Exam',      channel: 'Email',        recipients: 1240, sent: 1236,failed: 4, sentAt: '2026-05-18 10:00', status: 'Completed' },
  { id: 'NH-006', name: 'Hostel Check-in Reminder',    type: 'Hostel',    channel: 'SMS',          recipients: 180,  sent: 178, failed: 2, sentAt: '2026-05-17 16:00', status: 'Completed' },
  { id: 'NH-007', name: 'Emergency — School Closure',  type: 'Emergency', channel: 'All Channels', recipients: 2840, sent: 2840,failed: 0, sentAt: '2026-05-18 06:00', status: 'Completed' },
];

export const DELIVERY_LOGS = [
  { id: 'DLV-001', recipient: 'Arun Kumar (Parent)',     type: 'Fee Reminder',        channel: 'SMS',     status: 'Delivered', sentAt: '2026-05-20 09:02', deliveredAt: '2026-05-20 09:02', retries: 0 },
  { id: 'DLV-002', recipient: 'Priya Nair (Parent)',     type: 'Fee Reminder',        channel: 'Email',   status: 'Opened',    sentAt: '2026-05-20 09:02', deliveredAt: '2026-05-20 09:05', retries: 0 },
  { id: 'DLV-003', recipient: 'Rajesh Menon (Parent)',   type: 'Attendance Alert',    channel: 'SMS',     status: 'Failed',    sentAt: '2026-05-20 08:00', deliveredAt: '—',                retries: 3, failReason: 'Invalid number' },
  { id: 'DLV-004', recipient: 'Meena Iyer (Parent)',     type: 'Transport Alert',     channel: 'Push',    status: 'Delivered', sentAt: '2026-05-20 07:45', deliveredAt: '2026-05-20 07:45', retries: 0 },
  { id: 'DLV-005', recipient: 'Vinod Rajan (Parent)',    type: 'Exam Reminder',       channel: 'WhatsApp',status: 'Pending',   sentAt: '—',                deliveredAt: '—',                retries: 0 },
  { id: 'DLV-006', recipient: 'Divya Krishnan (Staff)',  type: 'Leave Notification',  channel: 'Email',   status: 'Delivered', sentAt: '2026-05-19 11:00', deliveredAt: '2026-05-19 11:01', retries: 0 },
  { id: 'DLV-007', recipient: 'Suresh Babu (Parent)',    type: 'Fee Reminder',        channel: 'SMS',     status: 'Retrying',  sentAt: '2026-05-19 09:00', deliveredAt: '—',                retries: 1, failReason: 'Network timeout' },
  { id: 'DLV-008', recipient: 'Ananya Sharma (Parent)',  type: 'Payment Confirmation',channel: 'Email',   status: 'Delivered', sentAt: '2026-05-19 14:30', deliveredAt: '2026-05-19 14:31', retries: 0 },
];

export const AUTOMATION_RULES = [
  { id: 1, name: 'Overdue Fee Reminder',       trigger: 'Fee overdue by 7 days',               channels: ['SMS', 'WhatsApp'], frequency: 'Daily',          status: 'Active' },
  { id: 2, name: 'Consecutive Absence Alert',  trigger: 'Student absent 3+ consecutive days',  channels: ['SMS', 'Email'],    frequency: 'Immediate',      status: 'Active' },
  { id: 3, name: 'Exam Countdown Reminder',    trigger: '3 days before exam date',             channels: ['Email', 'Push'],   frequency: 'Once',           status: 'Active' },
  { id: 4, name: 'Leave Approval Notification',trigger: 'Leave request approved/rejected',     channels: ['Email', 'Push'],   frequency: 'Immediate',      status: 'Active' },
  { id: 5, name: 'Emergency Escalation',       trigger: 'Alert not acknowledged in 5 min',    channels: ['SMS', 'Email', 'WhatsApp', 'Push'], frequency: 'Every 5 mins', status: 'Active' },
  { id: 6, name: 'Transport Delay Alert',      trigger: 'Bus ETA delayed > 15 mins',          channels: ['SMS', 'Push'],     frequency: 'Immediate',      status: 'Paused' },
  { id: 7, name: 'Assignment Due Reminder',    trigger: '2 days before submission deadline',  channels: ['Push'],            frequency: 'Once',           status: 'Active' },
];

export const REMINDER_CONFIG = [
  { id: 'fee-overdue',  label: 'Fee Overdue Reminder',     triggerDays: 7,  maxCount: 5, channels: ['SMS', 'Email'],           active: true },
  { id: 'att-absent',   label: 'Absence Alert',            triggerDays: 1,  maxCount: 3, channels: ['SMS'],                    active: true },
  { id: 'exam-before',  label: 'Exam Countdown Reminder',  triggerDays: 3,  maxCount: 2, channels: ['Email', 'Push'],          active: true },
  { id: 'assign-due',   label: 'Assignment Due Reminder',  triggerDays: 2,  maxCount: 2, channels: ['Push'],                   active: true },
  { id: 'bday',         label: 'Birthday Greetings',       triggerDays: 0,  maxCount: 1, channels: ['Email', 'WhatsApp'],      active: false },
  { id: 'hostel',       label: 'Hostel Check-in Reminder', triggerDays: 1,  maxCount: 2, channels: ['SMS', 'Push'],            active: true },
];

export const EMERGENCY_ALERTS = [
  { id: 'EMR-001', title: 'School Closure — Heavy Rain', type: 'Weather',  sentAt: '2026-05-18 06:00', recipients: 2840, acknowledged: 2612, status: 'Delivered' },
  { id: 'EMR-002', title: 'Medical Emergency — Block C', type: 'Medical',  sentAt: '2026-05-10 11:23', recipients: 180,  acknowledged: 175,  status: 'Delivered' },
  { id: 'EMR-003', title: 'Fire Drill Alert',            type: 'Safety',   sentAt: '2026-05-05 09:00', recipients: 3100, acknowledged: 2980, status: 'Delivered' },
];
