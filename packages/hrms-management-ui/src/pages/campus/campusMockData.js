/**
 * Campus Infrastructure – Mock Data
 * All data is structured for easy swap-out with real API responses.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pick = (arr, i) => arr[i % arr.length];
const STATUSES   = ['Active', 'Maintenance', 'Restricted'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs Repair'];
const FLOORS     = ['Ground', '1st', '2nd', '3rd', '4th'];

// ─── Overview Metrics ─────────────────────────────────────────────────────────

export const OVERVIEW_METRICS = [
  { key: 'campus-area',     label: 'Total Campus Area',            value: '28 Acres',   sub: '4 campuses',          icon: '🏫', tone: 'blue'   },
  { key: 'buildings',       label: 'Total Buildings',              value: '24',         sub: '18 Academic · 6 Other',icon: '🏢', tone: 'indigo' },
  { key: 'classrooms',      label: 'Total Classrooms',             value: '180',        sub: '92% utilised',        icon: '🏛️', tone: 'violet' },
  { key: 'smart-rooms',     label: 'Smart Classrooms',             value: '72',         sub: 'Smart board + WiFi',  icon: '💡', tone: 'amber'  },
  { key: 'labs',            label: 'Total Laboratories',           value: '32',         sub: '8 types',             icon: '🔬', tone: 'teal'   },
  { key: 'library',         label: 'Library Capacity',             value: '1,200',      sub: 'seats · 85% avg use', icon: '📚', tone: 'cyan'   },
  { key: 'sports',          label: 'Sports Facilities',            value: '14',         sub: 'fields · courts · pool',icon: '⚽', tone: 'green'  },
  { key: 'hostel',          label: 'Hostel Capacity',              value: '2,400',      sub: '1,840 occupied',      icon: '🏠', tone: 'purple' },
  { key: 'transport',       label: 'Active Vehicles',              value: '48',         sub: '42 GPS-enabled',      icon: '🚌', tone: 'orange' },
  { key: 'cctv',            label: 'CCTV Coverage',                value: '94%',        sub: '328 cameras live',    icon: '📷', tone: 'red'    },
  { key: 'wifi',            label: 'WiFi Coverage',                value: '98%',        sub: '120 access points',   icon: '📶', tone: 'sky'    },
  { key: 'maintenance',     label: 'Pending Maintenance',          value: '17',         sub: '4 critical',          icon: '🔧', tone: 'rose'   },
];

// ─── Buildings ─────────────────────────────────────────────────────────────────

const DEPTS = ['Science', 'Arts', 'Commerce', 'Engineering', 'Administration', 'Sports', 'Labs', 'Library'];
const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'Admin', 'Science', 'Arts'];

export const BUILDINGS = Array.from({ length: 8 }, (_, i) => ({
  id: `BLD-${String(i + 1).padStart(3, '0')}`,
  name: `${pick(BLOCKS, i)} Block`,
  block: pick(BLOCKS, i),
  floors: (i % 4) + 2,
  totalRooms: 12 + i * 4,
  departments: [pick(DEPTS, i), pick(DEPTS, i + 2)],
  capacity: 400 + i * 50,
  occupancyPct: 62 + (i * 7) % 35,
  status: pick(STATUSES, i),
  constructionYear: 2000 + i * 2,
  safetyCompliance: i % 3 !== 2 ? 'Compliant' : 'Review Pending',
  floors_data: Array.from({ length: (i % 4) + 2 }, (__, f) => ({
    id: `${i + 1}-F${f}`,
    label: `${pick(FLOORS, f)} Floor`,
    rooms: Array.from({ length: 4 + (f % 3) }, (___, r) => ({
      id: `RM-${i + 1}${f}${r + 1}`,
      number: `${pick(BLOCKS, i)}${f}0${r + 1}`,
      type: r % 4 === 0 ? 'Lab' : r % 4 === 1 ? 'Office' : 'Classroom',
      capacity: 30 + r * 10,
      occupancyPct: 50 + (r * 13) % 50,
      status: r % 5 === 4 ? 'Maintenance' : 'Available',
    })),
  })),
}));

// ─── Classrooms ───────────────────────────────────────────────────────────────

const SECTIONS = ['A', 'B', 'C', 'D'];

export const CLASSROOMS = Array.from({ length: 20 }, (_, i) => ({
  id: `CR-${String(i + 1).padStart(3, '0')}`,
  roomNumber: `${pick(BLOCKS, i)}${Math.floor(i / 4) + 1}0${(i % 4) + 1}`,
  building: `${pick(BLOCKS, i)} Block`,
  floor: pick(FLOORS, Math.floor(i / 4)),
  capacity: 35 + (i % 5) * 5,
  currentOccupancy: 20 + (i * 9) % 30,
  smartBoard: i % 3 !== 0,
  projector: i % 4 !== 3,
  ac: i % 2 === 0,
  internet: i % 5 !== 4,
  assignedClass: `Class ${(i % 10) + 1} - ${pick(SECTIONS, i)}`,
  utilizationPct: 60 + (i * 7) % 38,
  status: i % 7 === 5 ? 'Under Maintenance' : 'Available',
  lastMaintenance: `2026-0${(i % 4) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

// ─── Laboratories ─────────────────────────────────────────────────────────────

const LAB_TYPES = [
  { name: 'Computer Lab',  icon: '🖥️', equipment: 42, color: '#6366f1' },
  { name: 'Physics Lab',   icon: '⚗️', equipment: 28, color: '#f59e0b' },
  { name: 'Chemistry Lab', icon: '🧪', equipment: 34, color: '#ef4444' },
  { name: 'Biology Lab',   icon: '🔬', equipment: 26, color: '#22c55e' },
  { name: 'Robotics Lab',  icon: '🤖', equipment: 18, color: '#8b5cf6' },
  { name: 'Language Lab',  icon: '🗣️', equipment: 36, color: '#06b6d4' },
];

export const LABS = LAB_TYPES.map((lab, i) => ({
  id: `LAB-${String(i + 1).padStart(3, '0')}`,
  ...lab,
  capacity: 30 + i * 4,
  activeSystems: lab.equipment - (i * 2) % 5,
  inCharge: ['Dr. R. Sharma', 'Prof. A. Patel', 'Dr. S. Nair', 'Prof. M. Rao', 'Dr. K. Singh', 'Prof. D. Iyer'][i],
  safetyStatus: i % 4 !== 3 ? 'Compliant' : 'Review',
  maintenanceStatus: i % 5 === 4 ? 'Due' : 'Up to Date',
  utilizationPct: 55 + (i * 11) % 40,
  nextBooking: `2026-05-${20 + i}`,
  schedule: Array.from({ length: 3 }, (_, d) => ({
    day: ['Monday', 'Wednesday', 'Friday'][d],
    time: `${8 + d * 2}:00 – ${10 + d * 2}:00`,
    class: `Class ${10 - d} - ${pick(SECTIONS, d)}`,
  })),
}));

// ─── Library ──────────────────────────────────────────────────────────────────

export const LIBRARY = {
  totalBooks: 42_800,
  digitalAccess: true,
  seatingCapacity: 1200,
  activeReaders: 380,
  librarian: 'Mrs. Kavitha Menon',
  assistants: ['Mr. Ravi Kumar', 'Ms. Priya Singh'],
  readingRooms: 6,
  issuedToday: 48,
  returnedToday: 31,
  overdueBooks: 12,
  digitalResources: [
    { name: 'NPTEL Courses', count: 1200 },
    { name: 'E-Books (IEEE)', count: 3400 },
    { name: 'Research Journals', count: 890 },
    { name: 'Online Newspapers', count: 24 },
  ],
  occupancyPct: 77,
};

// ─── Sports Facilities ────────────────────────────────────────────────────────

export const SPORTS_FACILITIES = [
  { id: 'SF-001', name: 'Football Ground',   icon: '⚽', capacity: 500, coach: 'Mr. Suresh Babu',    status: 'Available',  condition: 'Good',       maintenanceDate: '2026-06-01' },
  { id: 'SF-002', name: 'Cricket Ground',    icon: '🏏', capacity: 200, coach: 'Mr. Arun Nair',      status: 'Booked',     condition: 'Excellent',  maintenanceDate: '2026-06-15' },
  { id: 'SF-003', name: 'Basketball Court',  icon: '🏀', capacity: 100, coach: 'Ms. Divya Rao',      status: 'Available',  condition: 'Good',       maintenanceDate: '2026-06-08' },
  { id: 'SF-004', name: 'Indoor Stadium',    icon: '🏸', capacity: 400, coach: 'Mr. Prakash M.',     status: 'Maintenance',condition: 'Fair',       maintenanceDate: '2026-05-22' },
  { id: 'SF-005', name: 'Gymnasium',         icon: '🏋️', capacity: 60,  coach: 'Ms. Ananya Pillai',  status: 'Available',  condition: 'Excellent',  maintenanceDate: '2026-07-01' },
  { id: 'SF-006', name: 'Swimming Pool',     icon: '🏊', capacity: 80,  coach: 'Mr. Samuel D.',      status: 'Available',  condition: 'Good',       maintenanceDate: '2026-06-20' },
];

// ─── Transport ────────────────────────────────────────────────────────────────

export const TRANSPORT_VEHICLES = Array.from({ length: 12 }, (_, i) => ({
  id: `VH-${String(i + 1).padStart(3, '0')}`,
  vehicleNumber: `TN ${String(i + 10).padStart(2, '0')} AB ${String(1000 + i * 73)}`,
  route: `Route ${i + 1}`,
  driver: ['Ravi Kumar', 'Suresh P.', 'Anand R.', 'Mohan S.', 'Vijay T.', 'Karthi N.',
           'Balu M.', 'Dinesh P.', 'Praveen K.', 'Arumugam V.', 'Selvam D.', 'Mani R.'][i],
  capacity: 42 + (i % 3) * 8,
  studentsAssigned: 28 + (i * 9) % 28,
  fuelStatus: ['Full', 'Good', 'Low'][i % 3],
  gps: i % 6 !== 5,
  insuranceExpiry: `2026-${String((i % 9) + 4).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  fitnessExpiry: `2026-${String((i % 10) + 3).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  maintenanceStatus: i % 4 === 3 ? 'Due' : 'OK',
  status: i % 7 === 6 ? 'In Workshop' : 'Active',
}));

export const TRANSPORT_METRICS = {
  total: 12, active: 11, gpsEnabled: 10, maintenanceDue: 3,
};

// ─── Hostel ───────────────────────────────────────────────────────────────────

export const HOSTEL_BLOCKS = [
  { id: 'HB-001', name: 'Boys Hostel – Block 1',  type: 'Boys',  warden: 'Mr. Ramesh K.',   totalRooms: 80,  occupiedRooms: 72, bedCapacity: 160, occupiedBeds: 138, mess: true,  issues: 3 },
  { id: 'HB-002', name: 'Boys Hostel – Block 2',  type: 'Boys',  warden: 'Mr. Ganesh M.',   totalRooms: 60,  occupiedRooms: 55, bedCapacity: 120, occupiedBeds: 102, mess: true,  issues: 1 },
  { id: 'HB-003', name: 'Girls Hostel – Block A', type: 'Girls', warden: 'Mrs. Shanthi N.', totalRooms: 90,  occupiedRooms: 84, bedCapacity: 180, occupiedBeds: 162, mess: true,  issues: 2 },
  { id: 'HB-004', name: 'Girls Hostel – Block B', type: 'Girls', warden: 'Mrs. Lakshmi R.', totalRooms: 70,  occupiedRooms: 62, bedCapacity: 140, occupiedBeds: 118, mess: false, issues: 4 },
  { id: 'HB-005', name: 'International Hostel',   type: 'Mixed', warden: 'Mr. Joseph A.',   totalRooms: 40,  occupiedRooms: 28, bedCapacity: 80,  occupiedBeds: 54,  mess: true,  issues: 0 },
];

// ─── Security ─────────────────────────────────────────────────────────────────

export const SECURITY = {
  totalCCTV: 350, activeCCTV: 328, offline: 22,
  accessPoints: 14, biometricDevices: 22, emergencyExits: 38,
  personnelCount: 28,
  incidents: [
    { id: 'INC-001', date: '2026-05-18', type: 'Unauthorized Entry', location: 'Gate 3',   severity: 'Medium', status: 'Resolved' },
    { id: 'INC-002', date: '2026-05-17', type: 'Camera Offline',     location: 'Block C',  severity: 'Low',    status: 'Open'     },
    { id: 'INC-003', date: '2026-05-15', type: 'Fire Alarm Trigger', location: 'Lab Wing', severity: 'High',   status: 'Resolved' },
    { id: 'INC-004', date: '2026-05-14', type: 'Visitor Overstay',   location: 'Admin',    severity: 'Low',    status: 'Closed'   },
  ],
};

// ─── IT Infrastructure ───────────────────────────────────────────────────────

export const IT_INFRA = {
  servers: { total: 8, active: 7, maintenance: 1 },
  computers: { total: 420, active: 398, offline: 22 },
  smartBoards: { total: 72, active: 68, maintenance: 4 },
  printers: { total: 35, active: 30, maintenance: 5 },
  wifiZones: { total: 18, active: 18 },
  bandwidth: '1 Gbps',
  uptimePct: 99.2,
  erpKiosks: 8,
  healthScore: 92,
  networkUtilisationPct: 67,
  devices: [
    { type: 'Servers',      total: 8,   active: 7,  icon: '🖥️' },
    { type: 'Computers',    total: 420, active: 398, icon: '💻' },
    { type: 'Smart Boards', total: 72,  active: 68,  icon: '📺' },
    { type: 'Printers',     total: 35,  active: 30,  icon: '🖨️' },
    { type: 'WiFi APs',     total: 18,  active: 18,  icon: '📶' },
    { type: 'ERP Kiosks',   total: 8,   active: 8,   icon: '🖱️' },
  ],
};

// ─── Maintenance ─────────────────────────────────────────────────────────────

const MAINT_CATEGORIES = ['Electrical', 'Plumbing', 'Civil', 'HVAC', 'IT', 'Housekeeping'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const MAINT_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Escalated'];

export const MAINTENANCE_REQUESTS = Array.from({ length: 20 }, (_, i) => ({
  id: `MR-${String(i + 1).padStart(4, '0')}`,
  category: pick(MAINT_CATEGORIES, i),
  building: `${pick(BLOCKS, i)} Block`,
  room: `Rm ${i + 101}`,
  technician: i % 5 === 0 ? 'Unassigned' : ['T. Babu', 'S. Nair', 'R. Kumar', 'M. Das'][i % 4],
  severity: pick(SEVERITIES, i),
  status: pick(MAINT_STATUSES, i),
  raised: `2026-05-${String((i % 18) + 1).padStart(2, '0')}`,
  eta: i % 4 !== 2 ? `2026-05-${String((i % 18) + 5).padStart(2, '0')}` : '—',
  description: `${pick(MAINT_CATEGORIES, i)} issue reported in ${pick(BLOCKS, i)} Block Rm ${i + 101}.`,
}));

// ─── Utilities ────────────────────────────────────────────────────────────────

export const UTILITIES = {
  electricity: { currentKw: 380, monthlyKwh: 14_200, cost: 142_000, trend: '+4%' },
  water: { currentLitres: 18_400, monthlyLitres: 520_000, cost: 24_000, trend: '-2%' },
  solar: { generatedKwh: 4_200, coverage: 30, trend: '+12%' },
  generator: { status: 'Standby', lastTest: '2026-05-10', fuelLevel: 78 },
  internet: { uptime: 99.7, avgSpeedMbps: 820, provider: 'BSNL Leased', renewalDate: '2027-03-31' },
  monthly: [
    { month: 'Jan', elec: 13_200, water: 490_000 },
    { month: 'Feb', elec: 12_800, water: 478_000 },
    { month: 'Mar', elec: 13_600, water: 502_000 },
    { month: 'Apr', elec: 14_000, water: 510_000 },
    { month: 'May', elec: 14_200, water: 520_000 },
  ],
};

// ─── Assets ───────────────────────────────────────────────────────────────────

const ASSET_CATS = ['Furniture', 'Electronics', 'Lab Equipment', 'Sports', 'Vehicles', 'Library'];

export const ASSETS = Array.from({ length: 18 }, (_, i) => ({
  id: `AST-${String(i + 1).padStart(4, '0')}`,
  name: ['Desk', 'Bench', 'Computer', 'Projector', 'AC Unit', 'Lab Microscope',
         'Printer', 'Smart Board', 'Library Rack', 'Generator', 'CCTV Camera',
         'Whiteboard', 'Locker', 'Server Rack', 'Scanner', 'Gym Equipment', 'Bus', 'Lathe Machine'][i],
  category: pick(ASSET_CATS, i),
  quantity: 10 + i * 8,
  purchaseDate: `20${18 + (i % 7)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
  warrantyExpiry: `20${24 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
  location: `${pick(BLOCKS, i)} Block`,
  condition: pick(CONDITIONS, i % 4),
  depreciation: `${8 + (i % 5) * 4}%`,
}));
