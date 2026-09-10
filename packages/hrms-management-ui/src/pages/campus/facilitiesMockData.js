// ─── Campus Facilities Mock Data ─────────────────────────────────────────────
// API-ready structure for all Facilities module sections

// ─── Overview Metrics ─────────────────────────────────────────────────────────
export const FACILITY_METRICS = [
  { key: 'total',            label: 'Total Facilities',         value: 248,            sub: 'Across all campus',      icon: '🏛️', tone: 'blue'   },
  { key: 'active',           label: 'Active Facilities',        value: 214,            sub: '86.3% operational',      icon: '✅', tone: 'green'  },
  { key: 'maintenance',      label: 'Under Maintenance',        value: 18,             sub: '7.3% affected',          icon: '🔧', tone: 'amber'  },
  { key: 'bookings-today',   label: 'Bookings Today',           value: 34,             sub: '+8 from yesterday',      icon: '📅', tone: 'indigo' },
  { key: 'utilization',      label: 'Facility Utilization',     value: '74%',          sub: 'Avg. across facilities', icon: '📊', tone: 'teal'   },
  { key: 'available',        label: 'Available Now',            value: 89,             sub: 'Ready to book',          icon: '🟢', tone: 'cyan'   },
  { key: 'pending',          label: 'Pending Requests',         value: 12,             sub: 'Awaiting approval',      icon: '⏳', tone: 'orange' },
  { key: 'most-used',        label: 'Most Used Facility',       value: 'Main Auditorium', sub: '148 bookings/month',  icon: '🏆', tone: 'violet' },
  { key: 'upcoming-events',  label: 'Upcoming Events',          value: 7,              sub: 'Next 7 days',            icon: '📌', tone: 'rose'   },
  { key: 'capacity',         label: 'Capacity Utilization',     value: '68%',          sub: 'Peak hours avg',         icon: '🎯', tone: 'purple' },
];

// ─── Facility Categories ──────────────────────────────────────────────────────
export const CATEGORIES = [
  { key: 'academic',      label: 'Academic Facilities',     icon: '🎓', total: 42, available: 28, utilization: 72, color: '#4f46e5' },
  { key: 'sports',        label: 'Sports Facilities',       icon: '⚽', total: 24, available: 18, utilization: 65, color: '#22c55e' },
  { key: 'events',        label: 'Event Facilities',        icon: '🎭', total: 12, available: 7,  utilization: 83, color: '#f59e0b' },
  { key: 'dining',        label: 'Dining Facilities',       icon: '🍽️', total: 8,  available: 6,  utilization: 78, color: '#ef4444' },
  { key: 'hostel',        label: 'Hostel Facilities',       icon: '🏠', total: 36, available: 22, utilization: 61, color: '#8b5cf6' },
  { key: 'health',        label: 'Health Facilities',       icon: '🏥', total: 6,  available: 4,  utilization: 55, color: '#06b6d4' },
  { key: 'transport',     label: 'Transport Facilities',    icon: '🚌', total: 28, available: 20, utilization: 70, color: '#f97316' },
  { key: 'recreational',  label: 'Recreational Facilities', icon: '🎮', total: 16, available: 11, utilization: 58, color: '#14b8a6' },
  { key: 'it-digital',    label: 'IT & Digital',            icon: '💻', total: 18, available: 14, utilization: 81, color: '#0284c7' },
  { key: 'staff',         label: 'Staff Facilities',        icon: '👔', total: 22, available: 15, utilization: 45, color: '#9333ea' },
];

// ─── Academic Facilities ──────────────────────────────────────────────────────
export const ACADEMIC_FACILITIES = [
  { id: 1, name: 'Smart Classroom A-101', type: 'Smart Classroom',  capacity: 60,  department: 'Computer Science', available: true,  smartEquipment: true,  occupancy: 45, utilization: 75, status: 'Operational', floor: '1st',    block: 'Block A'        },
  { id: 2, name: 'Smart Classroom B-201', type: 'Smart Classroom',  capacity: 50,  department: 'Physics',          available: false, smartEquipment: true,  occupancy: 50, utilization: 100, status: 'Occupied',   floor: '2nd',    block: 'Block B'        },
  { id: 3, name: 'Seminar Hall SH-01',    type: 'Seminar Hall',     capacity: 120, department: 'General',          available: true,  smartEquipment: true,  occupancy: 0,  utilization: 0,   status: 'Available',  floor: 'Ground', block: 'Main Block'     },
  { id: 4, name: 'Main Auditorium',        type: 'Auditorium',       capacity: 800, department: 'General',          available: false, smartEquipment: true,  occupancy: 650, utilization: 81, status: 'Occupied',  floor: 'Ground', block: 'Central Block'  },
  { id: 5, name: 'Physics Lab PL-02',      type: 'Laboratory',       capacity: 30,  department: 'Physics',          available: true,  smartEquipment: false, occupancy: 0,  utilization: 0,   status: 'Available',  floor: '1st',    block: 'Science Block'  },
  { id: 6, name: 'Computer Center CC-1',   type: 'Computer Center',  capacity: 60,  department: 'IT',               available: true,  smartEquipment: true,  occupancy: 32, utilization: 53,  status: 'Operational', floor: '2nd',   block: 'IT Block'       },
  { id: 7, name: 'Language Lab LL-01',     type: 'Language Lab',     capacity: 25,  department: 'English',          available: true,  smartEquipment: true,  occupancy: 10, utilization: 40,  status: 'Operational', floor: '3rd',   block: 'Humanities'     },
  { id: 8, name: 'Discussion Room DR-3',   type: 'Discussion Room',  capacity: 15,  department: 'MBA',              available: true,  smartEquipment: false, occupancy: 0,  utilization: 0,   status: 'Available',  floor: '4th',    block: 'Management'     },
];

// ─── Sports Facilities ────────────────────────────────────────────────────────
export const SPORTS_FACILITIES = [
  { id: 1, name: 'Football Ground',  icon: '⚽', capacity: 500,  coach: 'Mr. Arjun Singh',    timings: '6:00 AM – 8:00 PM', available: true,  maintenanceStatus: 'Good',           occupancy: 0,   nextEvent: 'Inter-College Match, May 25'  },
  { id: 2, name: 'Cricket Ground',   icon: '🏏', capacity: 800,  coach: 'Mr. Ravi Kumar',     timings: '6:00 AM – 7:00 PM', available: true,  maintenanceStatus: 'Good',           occupancy: 0,   nextEvent: 'Practice Session, May 21'     },
  { id: 3, name: 'Basketball Court', icon: '🏀', capacity: 200,  coach: 'Ms. Priya Nair',     timings: '7:00 AM – 9:00 PM', available: false, maintenanceStatus: 'Good',           occupancy: 24,  nextEvent: 'Tournament Finals, May 22'    },
  { id: 4, name: 'Badminton Court',  icon: '🏸', capacity: 40,   coach: 'Mr. Suresh Pillai',  timings: '6:00 AM – 10:00 PM',available: true,  maintenanceStatus: 'Good',           occupancy: 0,   nextEvent: 'Open Practice, May 21'        },
  { id: 5, name: 'Gymnasium',        icon: '💪', capacity: 80,   coach: 'Mr. Karan Mehta',    timings: '5:30 AM – 9:00 PM', available: true,  maintenanceStatus: 'Good',           occupancy: 22,  nextEvent: 'Fitness Camp, May 23'         },
  { id: 6, name: 'Swimming Pool',    icon: '🏊', capacity: 60,   coach: 'Ms. Deepa Rao',      timings: '6:00 AM – 6:00 PM', available: false, maintenanceStatus: 'Under Cleaning', occupancy: 0,   nextEvent: 'Swimming Gala, May 28'        },
  { id: 7, name: 'Indoor Stadium',   icon: '🏋️', capacity: 1200, coach: 'Mr. Vijay Thomas',   timings: '7:00 AM – 9:00 PM', available: true,  maintenanceStatus: 'Good',           occupancy: 0,   nextEvent: 'State Championship, May 30'   },
  { id: 8, name: 'Yoga Hall',        icon: '🧘', capacity: 40,   coach: 'Ms. Anita Sharma',   timings: '6–8 AM, 5–7 PM',    available: true,  maintenanceStatus: 'Good',           occupancy: 15,  nextEvent: 'International Yoga Day, Jun 21' },
];

// ─── Event Facilities ─────────────────────────────────────────────────────────
export const EVENT_FACILITIES = [
  { id: 1, name: 'Main Auditorium',      capacity: 800,  avEquipment: true,  eventManager: 'Mr. Ramesh Verma',    status: 'Booked',    upcomingEvent: 'Annual Day Rehearsal',        eventDate: 'May 22', currentBookings: 3 },
  { id: 2, name: 'Conference Hall C-1',  capacity: 80,   avEquipment: true,  eventManager: 'Ms. Divya Krishnan',  status: 'Available', upcomingEvent: 'Faculty Meet',                eventDate: 'May 23', currentBookings: 1 },
  { id: 3, name: 'Seminar Hall SH-02',   capacity: 150,  avEquipment: true,  eventManager: 'Mr. Harish Naidu',    status: 'Available', upcomingEvent: 'Guest Lecture',               eventDate: 'May 21', currentBookings: 2 },
  { id: 4, name: 'Open Air Stage',       capacity: 2000, avEquipment: true,  eventManager: 'Ms. Rekha Pillai',    status: 'Booked',    upcomingEvent: 'Cultural Night',              eventDate: 'May 24', currentBookings: 1 },
  { id: 5, name: 'Meeting Room MR-4',    capacity: 20,   avEquipment: false, eventManager: 'Mr. Anil Joshi',      status: 'Available', upcomingEvent: 'HOD Meeting',                 eventDate: 'May 20', currentBookings: 4 },
];

// ─── Dining Facilities ────────────────────────────────────────────────────────
export const DINING_FACILITIES = [
  { id: 1, name: 'Main Cafeteria',     block: 'Central Block',  capacity: 300, occupancy: 120, hygieneStatus: 'Excellent', timings: '7:30 AM – 9:00 PM', menu: ['South Indian Breakfast', 'North Indian Lunch', 'Snacks', 'Dinner'], status: 'Open'   },
  { id: 2, name: 'Food Court FC-2',    block: 'Tech Block',     capacity: 150, occupancy: 85,  hygieneStatus: 'Good',      timings: '8:00 AM – 8:00 PM', menu: ['Fast Food', 'Beverages', 'Snacks'],                                   status: 'Open'   },
  { id: 3, name: 'Boys Mess BM-1',     block: 'Hostel A',       capacity: 200, occupancy: 160, hygieneStatus: 'Good',      timings: '6:30 AM – 10:00 PM',menu: ['Veg & Non-Veg'],                                                      status: 'Open'   },
  { id: 4, name: 'Girls Mess GM-1',    block: 'Hostel B',       capacity: 180, occupancy: 140, hygieneStatus: 'Excellent', timings: '6:30 AM – 10:00 PM',menu: ['Veg & Non-Veg'],                                                      status: 'Open'   },
  { id: 5, name: 'Faculty Cafeteria',  block: 'Staff Block',    capacity: 80,  occupancy: 20,  hygieneStatus: 'Excellent', timings: '8:00 AM – 5:00 PM', menu: ['Snacks', 'Lunch', 'Beverages'],                                       status: 'Open'   },
];

// ─── Hostel Facilities ────────────────────────────────────────────────────────
export const HOSTEL_FACILITIES = [
  { id: 1, name: 'Laundry Room L-1',     hostel: 'Hostel A',       capacity: 30,  occupancy: 12,  timings: '7:00 AM – 9:00 PM', status: 'Operational', issues: 0 },
  { id: 2, name: 'Study Hall SH-A',      hostel: 'Hostel A',       capacity: 50,  occupancy: 28,  timings: '24 Hours',           status: 'Operational', issues: 0 },
  { id: 3, name: 'Recreation Room RR-A', hostel: 'Hostel A',       capacity: 30,  occupancy: 10,  timings: '6:00 AM – 11:00 PM', status: 'Operational', issues: 1 },
  { id: 4, name: 'Hostel Gym HG-1',      hostel: 'Hostel A & B',   capacity: 40,  occupancy: 15,  timings: '5:30 AM – 9:00 PM', status: 'Operational', issues: 0 },
  { id: 5, name: 'Common Room CR-B',     hostel: 'Hostel B',       capacity: 60,  occupancy: 22,  timings: '7:00 AM – 11:00 PM', status: 'Operational', issues: 0 },
  { id: 6, name: 'WiFi Zone WZ-1',       hostel: 'All Hostels',    capacity: 200, occupancy: 148, timings: '24 Hours',           status: 'Operational', issues: 0 },
  { id: 7, name: 'Girls Common Room GCR',hostel: 'Hostel B',       capacity: 50,  occupancy: 18,  timings: '7:00 AM – 10:30 PM', status: 'Maintenance', issues: 2 },
];

// ─── Health Facilities ────────────────────────────────────────────────────────
export const HEALTH_FACILITIES = [
  { id: 1, name: 'Medical Room 1',  type: 'General',    doctor: 'Dr. Sneha Rao',     doctorAvailable: true,  emergencyBeds: 2, ambulanceAvailable: true,  pharmacy: true,  status: 'Open', timings: '8:00 AM – 8:00 PM' },
  { id: 2, name: 'Dental Clinic',   type: 'Dental',     doctor: 'Dr. Vinod Kumar',   doctorAvailable: true,  emergencyBeds: 0, ambulanceAvailable: false, pharmacy: false, status: 'Open', timings: '9:00 AM – 5:00 PM' },
  { id: 3, name: 'Emergency Ward',  type: 'Emergency',  doctor: 'Dr. Lalitha Menon', doctorAvailable: true,  emergencyBeds: 5, ambulanceAvailable: true,  pharmacy: true,  status: 'Open', timings: '24 Hours'           },
  { id: 4, name: 'Counseling Room', type: 'Counseling', doctor: 'Ms. Padma Iyer',    doctorAvailable: true,  emergencyBeds: 0, ambulanceAvailable: false, pharmacy: false, status: 'Open', timings: '10:00 AM – 4:00 PM' },
];

// ─── Transport Routes ─────────────────────────────────────────────────────────
export const TRANSPORT_ROUTES = [
  { id: 1, route: 'Route A – City Center', busNo: 'KL-01-AB-1234', driver: 'Mr. Biju Thomas',  capacity: 50, occupancy: 42, pickupPoints: ['City Center', 'Junction', 'College Gate'],         status: 'Active',        nextDeparture: '5:45 PM' },
  { id: 2, route: 'Route B – East Zone',   busNo: 'KL-01-CD-5678', driver: 'Mr. Soman Pillai', capacity: 50, occupancy: 38, pickupPoints: ['East Market', 'Library Road', 'College Gate'],      status: 'Active',        nextDeparture: '6:00 PM' },
  { id: 3, route: 'Route C – West Zone',   busNo: 'KL-01-EF-9012', driver: 'Mr. Ramesh Kumar', capacity: 45, occupancy: 30, pickupPoints: ['West End', 'Hospital Road', 'College Gate'],        status: 'Active',        nextDeparture: '5:50 PM' },
  { id: 4, route: 'Route D – North Zone',  busNo: 'KL-01-GH-3456', driver: 'Mr. Ajith Nair',   capacity: 50, occupancy: 0,  pickupPoints: ['North Square', 'Railway Station', 'College Gate'],  status: 'On Maintenance', nextDeparture: '—'       },
  { id: 5, route: 'Route E – South Zone',  busNo: 'KL-01-IJ-7890', driver: 'Mr. Sathish Rao',  capacity: 48, occupancy: 44, pickupPoints: ['South Gate', 'Bypass Road', 'College Gate'],        status: 'Active',        nextDeparture: '5:55 PM' },
];

// ─── IT & Digital Facilities ──────────────────────────────────────────────────
export const IT_FACILITIES = [
  { id: 1, name: 'WiFi Zone – Main Block',      uptime: 99.2, activeUsers: 320, status: 'Online',  coverage: 'Full Campus',          type: 'WiFi'              },
  { id: 2, name: 'Computer Center CC-1',         uptime: 98.7, activeUsers: 42,  status: 'Online',  coverage: '2nd Floor, IT Block',  type: 'Computer Center'   },
  { id: 3, name: 'Printing Station PS-3',        uptime: 95.0, activeUsers: 8,   status: 'Online',  coverage: 'Library Block',        type: 'Printing Station'  },
  { id: 4, name: 'ERP Kiosk K-01',              uptime: 97.4, activeUsers: 3,   status: 'Online',  coverage: 'Admin Block Lobby',    type: 'ERP Kiosk'         },
  { id: 5, name: 'Charging Station CS-02',       uptime: 100,  activeUsers: 12,  status: 'Online',  coverage: 'Student Lounge',       type: 'Charging Station'  },
  { id: 6, name: 'Digital Notice Board DNB-1',   uptime: 92.0, activeUsers: 0,   status: 'Offline', coverage: 'Main Entrance',        type: 'Digital Display'   },
  { id: 7, name: 'Server Room SR-1',             uptime: 99.9, activeUsers: 0,   status: 'Online',  coverage: 'IT Block, 3rd Floor',  type: 'Server Room'       },
];

// ─── Recreational Facilities ──────────────────────────────────────────────────
export const RECREATIONAL_FACILITIES = [
  { id: 1, name: 'Campus Park',        icon: '🌿', capacity: 300, occupancy: 45, timings: '6:00 AM – 9:00 PM',  upcomingEvent: 'Nature Walk, May 23',      status: 'Open' },
  { id: 2, name: 'Botanical Garden',   icon: '🌸', capacity: 150, occupancy: 12, timings: '8:00 AM – 5:00 PM',  upcomingEvent: 'Planting Drive, May 25',   status: 'Open' },
  { id: 3, name: 'Student Lounge',     icon: '🛋️', capacity: 80,  occupancy: 34, timings: '8:00 AM – 10:00 PM', upcomingEvent: '—',                         status: 'Open' },
  { id: 4, name: 'Activity Center',    icon: '🎯', capacity: 100, occupancy: 22, timings: '9:00 AM – 8:00 PM',  upcomingEvent: 'Talent Show, May 24',      status: 'Open' },
  { id: 5, name: 'Gaming Zone',        icon: '🎮', capacity: 30,  occupancy: 18, timings: '10:00 AM – 9:00 PM', upcomingEvent: '—',                         status: 'Open' },
  { id: 6, name: 'Cultural Room',      icon: '🎨', capacity: 40,  occupancy: 8,  timings: '9:00 AM – 7:00 PM',  upcomingEvent: 'Art Exhibition, May 28',   status: 'Open' },
];

// ─── Staff Facilities ─────────────────────────────────────────────────────────
export const STAFF_FACILITIES = [
  { id: 1, name: 'Staff Room SR-A',    block: 'Main Block',  capacity: 40,  occupancy: 12, available: true,  accessPermission: 'Faculty Only',        status: 'Open'      },
  { id: 2, name: 'Meeting Room MR-1',  block: 'Admin Block', capacity: 20,  occupancy: 0,  available: true,  accessPermission: 'Staff & HOD',         status: 'Available' },
  { id: 3, name: 'Faculty Lounge FL-1',block: 'Staff Block', capacity: 30,  occupancy: 8,  available: true,  accessPermission: 'Faculty Only',        status: 'Open'      },
  { id: 4, name: 'Principal Cabin',    block: 'Admin Block', capacity: 6,   occupancy: 0,  available: false, accessPermission: 'Appointment Only',    status: 'Busy'      },
  { id: 5, name: 'Staff Parking Lot',  block: 'Gate 2',      capacity: 120, occupancy: 78, available: true,  accessPermission: 'Staff Pass Required', status: 'Open'      },
  { id: 6, name: 'Staff Cafeteria',    block: 'Staff Block', capacity: 80,  occupancy: 20, available: true,  accessPermission: 'Staff Only',          status: 'Open'      },
];

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const BOOKINGS = [
  { id: 'BK-001', facility: 'Main Auditorium',      requester: 'Dr. Priya Menon',     date: '2026-05-22', timing: '10:00 AM – 1:00 PM', purpose: 'Annual Day Rehearsal',            status: 'Approved',   approvedBy: 'Principal'        },
  { id: 'BK-002', facility: 'Conference Hall C-1',  requester: 'HOD – CS Dept',       date: '2026-05-23', timing: '2:00 PM – 4:00 PM',  purpose: 'Faculty Meeting',                 status: 'Pending',    approvedBy: '—'                },
  { id: 'BK-003', facility: 'Seminar Hall SH-01',   requester: 'Prof. Rajan Das',     date: '2026-05-21', timing: '11:00 AM – 12:30 PM',purpose: 'Guest Lecture – AI in Education',  status: 'Approved',   approvedBy: 'VP Academics'     },
  { id: 'BK-004', facility: 'Basketball Court',     requester: 'Sports Secretary',    date: '2026-05-22', timing: '3:00 PM – 5:00 PM',  purpose: 'Tournament Finals',               status: 'Approved',   approvedBy: 'Sports HOD'       },
  { id: 'BK-005', facility: 'Computer Center CC-1', requester: 'IT Lab Coordinator',  date: '2026-05-24', timing: '9:00 AM – 11:00 AM', purpose: 'Placement Training Session',       status: 'Pending',    approvedBy: '—'                },
  { id: 'BK-006', facility: 'Open Air Stage',       requester: 'Cultural Committee',  date: '2026-05-24', timing: '5:00 PM – 9:00 PM',  purpose: 'Cultural Night 2026',             status: 'Approved',   approvedBy: 'Dean of Students' },
  { id: 'BK-007', facility: 'Yoga Hall',            requester: 'Wellness Club',       date: '2026-05-25', timing: '7:00 AM – 8:00 AM',  purpose: 'Morning Yoga Session',            status: 'Rejected',   approvedBy: 'Sports HOD'       },
  { id: 'BK-008', facility: 'Swimming Pool',        requester: 'Aquatics Team',       date: '2026-05-21', timing: '4:00 PM – 6:00 PM',  purpose: 'Practice Session',                status: 'Cancelled',  approvedBy: '—'                },
];

// ─── Maintenance Requests ─────────────────────────────────────────────────────
export const MAINTENANCE_REQUESTS = [
  { id: 'MR-001', facility: 'Smart Classroom A-101', issue: 'Projector not working',       severity: 'High',   raisedBy: 'Prof. Anand Kumar',  raisedOn: '2026-05-18', status: 'In Progress', assignedTo: 'IT Team',        eta: '2026-05-21' },
  { id: 'MR-002', facility: 'Swimming Pool',          issue: 'Pump filter replacement',     severity: 'Medium', raisedBy: 'Sports HOD',         raisedOn: '2026-05-17', status: 'Scheduled',   assignedTo: 'Maint. Team',    eta: '2026-05-22' },
  { id: 'MR-003', facility: 'Girls Common Room GCR',  issue: 'AC unit malfunction',         severity: 'Medium', raisedBy: 'Hostel Warden',      raisedOn: '2026-05-19', status: 'Pending',     assignedTo: '—',              eta: '—'          },
  { id: 'MR-004', facility: 'Digital Notice Board',   issue: 'Display screen offline',      severity: 'Low',    raisedBy: 'Admin Staff',        raisedOn: '2026-05-16', status: 'Pending',     assignedTo: '—',              eta: '—'          },
  { id: 'MR-005', facility: 'Boys Mess Kitchen',      issue: 'Gas pipeline safety check',   severity: 'High',   raisedBy: 'Mess Manager',       raisedOn: '2026-05-20', status: 'Urgent',      assignedTo: 'Safety Team',    eta: '2026-05-20' },
  { id: 'MR-006', facility: 'Basketball Court',       issue: 'Court surface crack',         severity: 'Medium', raisedBy: 'Sports Secretary',   raisedOn: '2026-05-15', status: 'Resolved',    assignedTo: 'Civil Team',     eta: 'Resolved'   },
];

// ─── Complaints ───────────────────────────────────────────────────────────────
export const COMPLAINTS = [
  { id: 'CP-001', facility: 'Computer Center CC-1', issue: 'Internet connectivity issue',      severity: 'High',   raisedBy: 'Student – S2 CS',    raisedOn: '2026-05-20', status: 'Open',        assignedTo: 'IT Team',        eta: '2026-05-21' },
  { id: 'CP-002', facility: 'Main Cafeteria',        issue: 'Cleanliness near food counter',    severity: 'Medium', raisedBy: 'Student Council',    raisedOn: '2026-05-19', status: 'Resolved',    assignedTo: 'Housekeeping',   eta: '2026-05-20' },
  { id: 'CP-003', facility: 'Seminar Hall SH-01',   issue: 'AC not working',                   severity: 'High',   raisedBy: 'Prof. Meena Pillai', raisedOn: '2026-05-18', status: 'In Progress', assignedTo: 'Maint. Team',    eta: '2026-05-22' },
  { id: 'CP-004', facility: 'Hostel WiFi Zone',      issue: 'WiFi drops intermittently',        severity: 'Medium', raisedBy: 'Hostel Students',    raisedOn: '2026-05-17', status: 'Open',        assignedTo: 'IT Team',        eta: '2026-05-23' },
];

// ─── Analytics ────────────────────────────────────────────────────────────────
export const FACILITY_ANALYTICS = {
  utilizationByCategory: [
    { label: 'Academic',     pct: 72 },
    { label: 'Sports',       pct: 65 },
    { label: 'Events',       pct: 83 },
    { label: 'Dining',       pct: 78 },
    { label: 'IT & Digital', pct: 81 },
    { label: 'Hostel',       pct: 61 },
    { label: 'Transport',    pct: 70 },
    { label: 'Recreation',   pct: 58 },
  ],
  bookingTrend: [
    { month: 'Dec', count: 112 },
    { month: 'Jan', count: 138 },
    { month: 'Feb', count: 125 },
    { month: 'Mar', count: 162 },
    { month: 'Apr', count: 148 },
    { month: 'May', count: 174 },
  ],
  maintenanceFrequency: [
    { label: 'AC Units',     count: 12 },
    { label: 'Projectors',   count: 9  },
    { label: 'Plumbing',     count: 7  },
    { label: 'Electrical',   count: 11 },
    { label: 'IT Equip.',    count: 15 },
    { label: 'Civil',        count: 4  },
  ],
  topBooked: [
    { name: 'Main Auditorium',  bookings: 148 },
    { name: 'Seminar Hall 1',   bookings: 112 },
    { name: 'Basketball Court', bookings: 98  },
    { name: 'Computer Center',  bookings: 87  },
    { name: 'Conference Hall',  bookings: 74  },
  ],
  peakHours: [
    { hour: '8 AM',  load: 30 },
    { hour: '10 AM', load: 85 },
    { hour: '12 PM', load: 92 },
    { hour: '2 PM',  load: 78 },
    { hour: '4 PM',  load: 88 },
    { hour: '6 PM',  load: 55 },
    { hour: '8 PM',  load: 25 },
  ],
};

// ─── Calendar Events ──────────────────────────────────────────────────────────
export const CALENDAR_EVENTS = [
  { date: '2026-05-21', title: 'Guest Lecture – Seminar Hall',           type: 'academic', time: '11:00 AM' },
  { date: '2026-05-22', title: 'Annual Day Rehearsal – Auditorium',      type: 'event',    time: '10:00 AM' },
  { date: '2026-05-22', title: 'Tournament Finals – Basketball Court',   type: 'sports',   time: '3:00 PM'  },
  { date: '2026-05-23', title: 'Faculty Meeting – Conference Hall',      type: 'academic', time: '2:00 PM'  },
  { date: '2026-05-24', title: 'Cultural Night – Open Air Stage',        type: 'event',    time: '5:00 PM'  },
  { date: '2026-05-24', title: 'Placement Training – Computer Center',   type: 'academic', time: '9:00 AM'  },
  { date: '2026-05-25', title: 'Morning Yoga – Yoga Hall',               type: 'sports',   time: '7:00 AM'  },
  { date: '2026-05-28', title: 'Swimming Gala – Pool',                   type: 'sports',   time: '9:00 AM'  },
  { date: '2026-05-30', title: 'State Championship – Indoor Stadium',    type: 'sports',   time: '8:00 AM'  },
];
