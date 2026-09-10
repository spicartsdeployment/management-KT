// ─── Campus Contact Information — Mock Data ────────────────────────────────────

export const OVERVIEW_CONTACTS = [
  { id: 1, title: 'Main Campus',       icon: '🏛️', phone: '+91-484-123-4567', email: 'info@campus.edu.in',        ext: '100', category: 'main',      status: 'Active' },
  { id: 2, title: 'Emergency Helpline',icon: '🚨', phone: '+91-484-123-4568', email: 'emergency@campus.edu.in',   ext: '911', category: 'emergency', status: 'Active' },
  { id: 3, title: 'Reception Desk',    icon: '🏢', phone: '+91-484-123-4569', email: 'reception@campus.edu.in',   ext: '101', category: 'reception', status: 'Active' },
  { id: 4, title: 'Admission Office',  icon: '📋', phone: '+91-484-123-4570', email: 'admissions@campus.edu.in',  ext: '102', category: 'admission', status: 'Active' },
  { id: 5, title: 'Transport Helpdesk',icon: '🚌', phone: '+91-484-123-4571', email: 'transport@campus.edu.in',   ext: '103', category: 'transport', status: 'Active' },
  { id: 6, title: 'Hostel Support',    icon: '🏠', phone: '+91-484-123-4572', email: 'hostel@campus.edu.in',      ext: '104', category: 'hostel',    status: 'Active' },
  { id: 7, title: 'IT Support',        icon: '💻', phone: '+91-484-123-4573', email: 'itsupport@campus.edu.in',   ext: '105', category: 'it',        status: 'Active' },
  { id: 8, title: 'Accounts Office',   icon: '💰', phone: '+91-484-123-4574', email: 'accounts@campus.edu.in',    ext: '106', category: 'accounts',  status: 'Active' },
];

export const CAMPUS_BRANCHES = [
  {
    id: 1, name: 'Main Campus', type: 'Main',
    address: '123 Education Avenue, Knowledge Park',
    city: 'Kochi', state: 'Kerala', postal: '682001', country: 'India',
    landmark: 'Near High Court Junction',
    coordinates: '9.9312° N, 76.2673° E',
    phone: '+91-484-123-4567', email: 'main@campus.edu.in',
  },
  {
    id: 2, name: 'North Campus', type: 'Branch',
    address: '45 Innovation Road, Tech Zone',
    city: 'Thrissur', state: 'Kerala', postal: '680001', country: 'India',
    landmark: 'Adjacent to Software Park',
    coordinates: '10.5200° N, 76.2100° E',
    phone: '+91-487-123-4567', email: 'north@campus.edu.in',
  },
];

export const DEPARTMENTS = [
  { id: 1,  name: 'Administration',   icon: '🏛️', head: 'Mr. Rajesh Nair',      ext: '201', email: 'admin@campus.edu.in',        room: 'ADM-101', hours: '9 AM – 5 PM',  alt: '+91-484-200-0001', status: 'Open'   },
  { id: 2,  name: 'Admissions',       icon: '📋', head: 'Ms. Divya Krishnan',   ext: '202', email: 'admissions@campus.edu.in',   room: 'ADM-102', hours: '9 AM – 4 PM',  alt: '+91-484-200-0002', status: 'Open'   },
  { id: 3,  name: 'Accounts',         icon: '💰', head: 'Mr. Suresh Menon',     ext: '203', email: 'accounts@campus.edu.in',     room: 'ADM-103', hours: '9 AM – 4 PM',  alt: '+91-484-200-0003', status: 'Open'   },
  { id: 4,  name: 'Academics',        icon: '🎓', head: 'Dr. Priya Sharma',     ext: '204', email: 'academics@campus.edu.in',    room: 'ACK-201', hours: '9 AM – 5 PM',  alt: '+91-484-200-0004', status: 'Open'   },
  { id: 5,  name: 'Examination Cell', icon: '📝', head: 'Prof. Anand Kumar',    ext: '205', email: 'exams@campus.edu.in',        room: 'EXM-101', hours: '9 AM – 4 PM',  alt: '+91-484-200-0005', status: 'Open'   },
  { id: 6,  name: 'Library',          icon: '📚', head: 'Ms. Rekha Pillai',     ext: '206', email: 'library@campus.edu.in',      room: 'LIB-001', hours: '8 AM – 8 PM',  alt: '+91-484-200-0006', status: 'Open'   },
  { id: 7,  name: 'Sports Dept.',     icon: '⚽', head: 'Mr. Arjun Singh',      ext: '207', email: 'sports@campus.edu.in',       room: 'SPT-001', hours: '7 AM – 7 PM',  alt: '+91-484-200-0007', status: 'Open'   },
  { id: 8,  name: 'Hostel Dept.',     icon: '🏠', head: 'Ms. Anitha Rao',       ext: '208', email: 'hostel@campus.edu.in',       room: 'HST-001', hours: '24 Hours',     alt: '+91-484-200-0008', status: 'Open'   },
  { id: 9,  name: 'Transport Dept.',  icon: '🚌', head: 'Mr. Biju Thomas',      ext: '209', email: 'transport@campus.edu.in',    room: 'TRP-001', hours: '6 AM – 9 PM',  alt: '+91-484-200-0009', status: 'Open'   },
  { id: 10, name: 'HR Department',    icon: '👥', head: 'Ms. Meena Iyer',       ext: '210', email: 'hr@campus.edu.in',           room: 'HR-101',  hours: '9 AM – 5 PM',  alt: '+91-484-200-0010', status: 'Open'   },
  { id: 11, name: 'IT Support',       icon: '💻', head: 'Mr. Vinod Rajan',      ext: '211', email: 'itsupport@campus.edu.in',    room: 'IT-201',  hours: '8 AM – 8 PM',  alt: '+91-484-200-0011', status: 'Open'   },
  { id: 12, name: 'Maintenance',      icon: '🔧', head: 'Mr. Soman Pillai',     ext: '212', email: 'maintenance@campus.edu.in',  room: 'MNT-001', hours: '8 AM – 6 PM',  alt: '+91-484-200-0012', status: 'Open'   },
  { id: 13, name: 'Security Office',  icon: '🛡️', head: 'Mr. Ravi Kumar',       ext: '213', email: 'security@campus.edu.in',    room: 'SEC-001', hours: '24 Hours',     alt: '+91-484-200-0013', status: 'Open'   },
];

export const STAFF_DIRECTORY = [
  { id: 1,  empId: 'EMP-001', name: 'Dr. Priya Sharma',    designation: 'Principal',              dept: 'Administration',  email: 'principal@campus.edu.in',   ext: '101', room: 'PNC-001', type: 'Admin',       avatar: 'PS', timing: '9 AM – 5 PM'  },
  { id: 2,  empId: 'EMP-002', name: 'Prof. Anand Kumar',   designation: 'VP Academics',           dept: 'Academics',       email: 'vp@campus.edu.in',          ext: '201', room: 'ACK-201', type: 'Admin',       avatar: 'AK', timing: '9 AM – 5 PM'  },
  { id: 3,  empId: 'EMP-003', name: 'Dr. Rajan Das',       designation: 'HOD – Computer Sci.',   dept: 'Computer Science',email: 'hod.cs@campus.edu.in',      ext: '301', room: 'CS-301',  type: 'Teaching',    avatar: 'RD', timing: '9 AM – 4 PM'  },
  { id: 4,  empId: 'EMP-004', name: 'Prof. Meena Pillai',  designation: 'HOD – Physics',          dept: 'Physics',         email: 'hod.physics@campus.edu.in', ext: '302', room: 'PH-201',  type: 'Teaching',    avatar: 'MP', timing: '9 AM – 4 PM'  },
  { id: 5,  empId: 'EMP-005', name: 'Ms. Divya Krishnan',  designation: 'Admissions Officer',     dept: 'Admissions',      email: 'admissions@campus.edu.in',  ext: '202', room: 'ADM-102', type: 'Admin',       avatar: 'DK', timing: '9 AM – 4 PM'  },
  { id: 6,  empId: 'EMP-006', name: 'Mr. Suresh Menon',    designation: 'Accounts Manager',       dept: 'Accounts',        email: 'accounts@campus.edu.in',    ext: '203', room: 'ADM-103', type: 'Admin',       avatar: 'SM', timing: '9 AM – 4 PM'  },
  { id: 7,  empId: 'EMP-007', name: 'Ms. Rekha Pillai',    designation: 'Chief Librarian',        dept: 'Library',         email: 'library@campus.edu.in',     ext: '206', room: 'LIB-001', type: 'Non-Teaching', avatar: 'RP', timing: '8 AM – 8 PM'  },
  { id: 8,  empId: 'EMP-008', name: 'Mr. Arjun Singh',     designation: 'Sports Director',        dept: 'Sports',          email: 'sports@campus.edu.in',      ext: '207', room: 'SPT-001', type: 'Non-Teaching', avatar: 'AS', timing: '7 AM – 7 PM'  },
  { id: 9,  empId: 'EMP-009', name: 'Ms. Anitha Rao',      designation: 'Chief Warden',           dept: 'Hostel',          email: 'hostel@campus.edu.in',      ext: '208', room: 'HST-001', type: 'Admin',       avatar: 'AR', timing: '24 Hours'     },
  { id: 10, empId: 'EMP-010', name: 'Mr. Vinod Rajan',     designation: 'IT Manager',             dept: 'IT Support',      email: 'itsupport@campus.edu.in',   ext: '211', room: 'IT-201',  type: 'Technical',   avatar: 'VR', timing: '8 AM – 8 PM'  },
  { id: 11, empId: 'EMP-011', name: 'Dr. Lalitha Menon',   designation: 'Campus Doctor',          dept: 'Health Center',   email: 'doctor@campus.edu.in',      ext: '212', room: 'MED-001', type: 'Medical',     avatar: 'LM', timing: '8 AM – 8 PM'  },
  { id: 12, empId: 'EMP-012', name: 'Ms. Meena Iyer',      designation: 'HR Manager',             dept: 'HR',              email: 'hr@campus.edu.in',          ext: '210', room: 'HR-101',  type: 'Admin',       avatar: 'MI', timing: '9 AM – 5 PM'  },
];

export const EMERGENCY_CONTACTS = [
  { id: 1, type: 'Ambulance',           icon: '🚑', phone: '108',              alt: '+91-484-200-1001', available: '24/7',        escalation: 'Medical Officer',      desc: 'Campus medical emergency'     },
  { id: 2, type: 'Fire Safety',         icon: '🔥', phone: '101',              alt: '+91-484-200-1002', available: '24/7',        escalation: 'Safety Officer',       desc: 'Fire emergency & safety'      },
  { id: 3, type: 'Campus Security',     icon: '🛡️', phone: '+91-484-SEC-0001', alt: '+91-484-200-1003', available: '24/7',        escalation: 'Security Head',        desc: 'Campus security control room' },
  { id: 4, type: 'Medical Room',        icon: '🏥', phone: 'Ext: 911',         alt: '+91-484-200-1004', available: '8 AM – 8 PM', escalation: 'Campus Doctor',        desc: 'On-campus medical facility'   },
  { id: 5, type: 'Anti-Ragging Cell',   icon: '⚠️', phone: '1800-180-5522',    alt: '+91-484-200-1005', available: '24/7',        escalation: 'Dean of Students',     desc: 'Ragging complaints & support' },
  { id: 6, type: 'Women Safety Cell',   icon: '🌸', phone: '+91-484-WSC-0001', alt: '+91-484-200-1006', available: '24/7',        escalation: 'Cell Coordinator',     desc: 'Women safety & support'       },
  { id: 7, type: 'Disaster Management', icon: '🌊', phone: '+91-484-DM-0001',  alt: '+91-484-200-1007', available: '24/7',        escalation: 'Campus Head',          desc: 'Disaster response team'       },
  { id: 8, type: 'Police Station',      icon: '🚔', phone: '100',              alt: '+91-484-POL-0001', available: '24/7',        escalation: 'Station Officer',      desc: 'Nearest police station'       },
  { id: 9, type: 'Nearby Hospital',     icon: '🏨', phone: '+91-484-HOS-0001', alt: '+91-484-200-1009', available: '24/7',        escalation: 'Medical Director',     desc: 'Nearest general hospital'     },
];

export const TRANSPORT_CONTACTS = [
  { id: 1, name: 'Mr. Biju Thomas',   role: 'Transport Manager', phone: '+91-484-300-0001', route: 'All Routes', vehicle: '—',             ext: '209', email: 'transport@campus.edu.in' },
  { id: 2, name: 'Mr. Rajan Pillai',  role: 'Route A Driver',    phone: '+91-484-300-0002', route: 'Route A',    vehicle: 'KL-01-AB-1234', ext: '—',   email: '—'                       },
  { id: 3, name: 'Mr. Soman Nair',    role: 'Route B Driver',    phone: '+91-484-300-0003', route: 'Route B',    vehicle: 'KL-01-CD-5678', ext: '—',   email: '—'                       },
  { id: 4, name: 'Mr. Suresh Das',    role: 'Route C Driver',    phone: '+91-484-300-0004', route: 'Route C',    vehicle: 'KL-01-EF-9012', ext: '—',   email: '—'                       },
  { id: 5, name: 'Mr. Anoop Kumar',   role: 'Route A Helper',    phone: '+91-484-300-0005', route: 'Route A',    vehicle: 'KL-01-AB-1234', ext: '—',   email: '—'                       },
];

export const HOSTEL_CONTACTS = [
  { id: 1, name: 'Ms. Anitha Rao',    role: 'Chief Warden',           hostel: 'All Blocks', phone: '+91-484-400-0001', ext: '208', timing: '24 Hours',     available: true  },
  { id: 2, name: 'Ms. Padma Iyer',    role: 'Warden – Hostel A',      hostel: 'Hostel A',   phone: '+91-484-400-0002', ext: '301', timing: '24 Hours',     available: true  },
  { id: 3, name: 'Mr. Sathish Rao',   role: 'Warden – Hostel B',      hostel: 'Hostel B',   phone: '+91-484-400-0003', ext: '302', timing: '24 Hours',     available: true  },
  { id: 4, name: 'Mr. Ramesh Kumar',  role: 'Mess Manager',           hostel: 'Main Mess',  phone: '+91-484-400-0004', ext: '303', timing: '6 AM – 10 PM', available: true  },
  { id: 5, name: 'Mr. Vijay Thomas',  role: 'Security Desk',          hostel: 'Gate 1',     phone: '+91-484-400-0005', ext: '304', timing: '24 Hours',     available: true  },
  { id: 6, name: 'Mr. Anil Joshi',    role: 'Maintenance Support',    hostel: 'All Blocks', phone: '+91-484-400-0006', ext: '305', timing: '8 AM – 8 PM',  available: true  },
  { id: 7, name: 'Ms. Sheela Nair',   role: 'Floor Supervisor – A2',  hostel: 'Hostel A',   phone: '+91-484-400-0007', ext: '306', timing: '8 AM – 8 PM',  available: false },
];

export const PARENT_SUPPORT = [
  { id: 1, category: 'Fee Support',         icon: '💰', contact: 'Ms. Latha Nair',    phone: '+91-484-500-0001', email: 'fees@campus.edu.in',       hours: '9 AM – 4 PM'  },
  { id: 2, category: 'Admission Support',   icon: '📋', contact: 'Ms. Divya Krishnan',phone: '+91-484-500-0002', email: 'admissions@campus.edu.in', hours: '9 AM – 4 PM'  },
  { id: 3, category: 'Academic Counseling', icon: '🎓', contact: 'Dr. Sneha Rao',      phone: '+91-484-500-0003', email: 'counseling@campus.edu.in', hours: '10 AM – 4 PM' },
  { id: 4, category: 'Grievance Cell',      icon: '⚖️', contact: 'Mr. Harish Naidu',   phone: '+91-484-500-0004', email: 'grievance@campus.edu.in',  hours: '9 AM – 5 PM'  },
  { id: 5, category: 'Attendance Support',  icon: '📅', contact: 'Ms. Rekha Pillai',   phone: '+91-484-500-0005', email: 'attendance@campus.edu.in', hours: '9 AM – 4 PM'  },
  { id: 6, category: 'Transport Support',   icon: '🚌', contact: 'Mr. Biju Thomas',    phone: '+91-484-500-0006', email: 'transport@campus.edu.in',  hours: '7 AM – 7 PM'  },
];

export const IT_SUPPORT_CONTACTS = [
  { id: 1, category: 'ERP Support',          icon: '🖥️', agent: 'Mr. Vinod Rajan',  phone: 'Ext: 211', email: 'erp@campus.edu.in',        hours: '8 AM – 8 PM', status: 'Online'  },
  { id: 2, category: 'Password Reset',       icon: '🔑', agent: 'IT Helpdesk',      phone: 'Ext: 212', email: 'helpdesk@campus.edu.in',   hours: '8 AM – 6 PM', status: 'Online'  },
  { id: 3, category: 'LMS Support',          icon: '📚', agent: 'Mr. Arun Kumar',   phone: 'Ext: 213', email: 'lms@campus.edu.in',        hours: '9 AM – 6 PM', status: 'Online'  },
  { id: 4, category: 'Smart Class Support',  icon: '📺', agent: 'IT Team',          phone: 'Ext: 214', email: 'smartclass@campus.edu.in', hours: '8 AM – 5 PM', status: 'Online'  },
  { id: 5, category: 'WiFi Support',         icon: '📶', agent: 'Network Team',     phone: 'Ext: 215', email: 'wifi@campus.edu.in',       hours: '24 Hours',    status: 'Online'  },
  { id: 6, category: 'Hardware Support',     icon: '🖨️', agent: 'Hardware Team',    phone: 'Ext: 216', email: 'hardware@campus.edu.in',   hours: '9 AM – 5 PM', status: 'Offline' },
];

export const SOCIAL_MEDIA = [
  { id: 1, platform: 'Website',   icon: '🌐', handle: 'www.campus.edu.in',      color: '#4f46e5' },
  { id: 2, platform: 'Facebook',  icon: '📘', handle: '/CampusEdu',              color: '#1877f2' },
  { id: 3, platform: 'Instagram', icon: '📸', handle: '@campus_edu',             color: '#e1306c' },
  { id: 4, platform: 'LinkedIn',  icon: '💼', handle: 'Campus Educational',     color: '#0a66c2' },
  { id: 5, platform: 'YouTube',   icon: '▶️', handle: 'Campus EduTV',            color: '#ff0000' },
  { id: 6, platform: 'Twitter/X', icon: '🐦', handle: '@CampusEdu',              color: '#111827' },
];

export const CAMPUS_TIMINGS = [
  { id: 1, area: 'Main Office',       icon: '🏛️', weekday: '9:00 AM – 5:00 PM', saturday: '9:00 AM – 1:00 PM',  sunday: 'Closed',  holiday: 'Closed'    },
  { id: 2, area: 'Admission Office',  icon: '📋', weekday: '9:00 AM – 4:00 PM', saturday: '9:00 AM – 12:00 PM', sunday: 'Closed',  holiday: 'Closed'    },
  { id: 3, area: 'Library',           icon: '📚', weekday: '8:00 AM – 8:00 PM', saturday: '8:00 AM – 5:00 PM',  sunday: 'Closed',  holiday: 'Closed'    },
  { id: 4, area: 'Transport Office',  icon: '🚌', weekday: '6:00 AM – 9:00 PM', saturday: '6:00 AM – 8:00 PM',  sunday: 'Limited', holiday: 'Limited'   },
  { id: 5, area: 'Hostel / Warden',   icon: '🏠', weekday: '24 Hours',          saturday: '24 Hours',            sunday: '24 Hours',holiday: '24 Hours'  },
  { id: 6, area: 'Medical Room',      icon: '🏥', weekday: '8:00 AM – 8:00 PM', saturday: '9:00 AM – 4:00 PM',  sunday: 'On-call', holiday: 'On-call'   },
  { id: 7, area: 'Security',          icon: '🛡️', weekday: '24 Hours',          saturday: '24 Hours',            sunday: '24 Hours',holiday: '24 Hours'  },
];

export const COMMUNICATION_LOGS = [
  { id: 'LOG-001', requester: 'Parent – S2 CS',   department: 'Admissions',   issue: 'Admission status inquiry',  priority: 'Medium', assigned: 'Ms. Divya Krishnan', status: 'Resolved',    timestamp: '2026-05-20 09:15' },
  { id: 'LOG-002', requester: 'Student – MBA',    department: 'Accounts',     issue: 'Fee payment receipt',       priority: 'High',   assigned: 'Mr. Suresh Menon',   status: 'Open',        timestamp: '2026-05-20 10:22' },
  { id: 'LOG-003', requester: 'Faculty – CS',     department: 'IT Support',   issue: 'Projector not working',     priority: 'Medium', assigned: 'Mr. Vinod Rajan',    status: 'In Progress', timestamp: '2026-05-20 11:05' },
  { id: 'LOG-004', requester: 'Parent',           department: 'Transport',    issue: 'Bus timing complaint',      priority: 'Low',    assigned: 'Mr. Biju Thomas',    status: 'Resolved',    timestamp: '2026-05-19 14:30' },
  { id: 'LOG-005', requester: 'Student',          department: 'Library',      issue: 'Book availability query',   priority: 'Low',    assigned: 'Ms. Rekha Pillai',   status: 'Resolved',    timestamp: '2026-05-19 16:00' },
  { id: 'LOG-006', requester: 'External Inquiry', department: 'Admissions',   issue: 'B.Tech admission process',  priority: 'High',   assigned: 'Ms. Divya Krishnan', status: 'Pending',     timestamp: '2026-05-20 08:45' },
  { id: 'LOG-007', requester: 'Student – S4 EEE', department: 'Academics',    issue: 'Internal mark dispute',     priority: 'High',   assigned: 'Dr. Priya Sharma',   status: 'Escalated',   timestamp: '2026-05-20 12:00' },
  { id: 'LOG-008', requester: 'Parent',           department: 'Hostel',       issue: 'Hostel facility complaint', priority: 'Medium', assigned: 'Ms. Anitha Rao',     status: 'Open',        timestamp: '2026-05-20 13:15' },
];

export const CONTACT_ANALYTICS = {
  resolutionRate: 78,
  avgResponseTime: '1.8 hrs',
  openTickets: 12,
  resolvedToday: 8,
  deptWiseRequests: [
    { dept: 'Admissions', count: 42 },
    { dept: 'Accounts',   count: 28 },
    { dept: 'IT Support', count: 35 },
    { dept: 'Transport',  count: 18 },
    { dept: 'Academics',  count: 24 },
    { dept: 'Hostel',     count: 15 },
  ],
  responseTrend: [
    { month: 'Dec', hours: 2.4 },
    { month: 'Jan', hours: 2.1 },
    { month: 'Feb', hours: 1.9 },
    { month: 'Mar', hours: 1.7 },
    { month: 'Apr', hours: 1.8 },
    { month: 'May', hours: 1.6 },
  ],
  topCategories: [
    { label: 'Admission Inquiries',  count: 42 },
    { label: 'Fee Queries',          count: 28 },
    { label: 'IT Support',           count: 35 },
    { label: 'Transport Complaints', count: 18 },
    { label: 'Academic Issues',      count: 24 },
  ],
};
