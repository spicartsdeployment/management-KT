// ─── Users Mock Data ──────────────────────────────────────────────────────────

export const USER_METRICS = [
  { id: "total",    icon: "👥", value: 248, label: "Total Users",      color: "primary" },
  { id: "active",   icon: "✅", value: 201, label: "Active Users",     color: "success" },
  { id: "inactive", icon: "⛔", value: 31,  label: "Inactive Users",   color: "danger"  },
  { id: "pending",  icon: "📨", value: 16,  label: "Pending Invites",  color: "warning" },
];

export const DEPARTMENTS = [
  "All Departments",
  "Administration",
  "Academics",
  "Finance",
  "Human Resources",
  "IT & Systems",
  "Student Affairs",
  "Transport",
  "Library",
  "Hostel",
  "Sports",
  "Counselling",
];

export const ROLES = [
  "All Roles",
  "Super Admin",
  "Principal",
  "Vice Principal",
  "Head of Department",
  "Teacher",
  "Class Teacher",
  "Accountant",
  "Librarian",
  "Transport Manager",
  "Hostel Warden",
  "Receptionist",
  "HR Manager",
  "IT Admin",
  "Data Entry Operator",
];

const ASSIGNABLE_ROLES = ROLES.slice(1); // exclude "All Roles"

export { ASSIGNABLE_ROLES };

export const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended",label: "Suspended" },
  { value: "pending",  label: "Pending" },
];

export const DATE_JOINED_OPTIONS = [
  { value: "all",      label: "All Time" },
  { value: "today",    label: "Today" },
  { value: "week",     label: "This Week" },
  { value: "month",    label: "This Month" },
  { value: "quarter",  label: "This Quarter" },
  { value: "year",     label: "This Year" },
];

const avatarColors = ["#c9a962","#2563eb","#16a34a","#dc2626","#7c3aed","#0d9488","#d97706","#e11d48"];
const getColor = i => avatarColors[i % avatarColors.length];
const initials = name => name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

const now = new Date("2026-05-21");
const daysAgo = n => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toISOString().slice(0,10); };

const makeUser = (i, overrides = {}) => ({
  id:         `USR-${String(i).padStart(4,"0")}`,
  name:       overrides.name       ?? "User Name",
  email:      overrides.email      ?? `user${i}@school.edu`,
  phone:      overrides.phone      ?? `+91 98${String(i).padStart(8,"0")}`,
  empId:      overrides.empId      ?? `EMP-${String(i).padStart(4,"0")}`,
  role:       overrides.role       ?? "Teacher",
  department: overrides.department ?? "Academics",
  status:     overrides.status     ?? "active",
  joinDate:   overrides.joinDate   ?? daysAgo(Math.floor(Math.random() * 365)),
  lastLogin:  overrides.lastLogin  ?? daysAgo(Math.floor(Math.random() * 30)),
  avatarColor: getColor(i - 1),
  initials:    initials(overrides.name ?? "User Name"),
});

export const MOCK_USERS = [
  makeUser(1,  { name: "Arjun Sharma",       email: "arjun.sharma@school.edu",    phone: "+91 98001 23456", empId: "EMP-0001", role: "Super Admin",          department: "Administration",   status: "active",    joinDate: daysAgo(730), lastLogin: daysAgo(0)  }),
  makeUser(2,  { name: "Priya Nair",          email: "priya.nair@school.edu",      phone: "+91 98001 34567", empId: "EMP-0002", role: "Principal",            department: "Administration",   status: "active",    joinDate: daysAgo(600), lastLogin: daysAgo(1)  }),
  makeUser(3,  { name: "Karthik Menon",       email: "karthik.menon@school.edu",   phone: "+91 98001 45678", empId: "EMP-0003", role: "Vice Principal",       department: "Administration",   status: "active",    joinDate: daysAgo(500), lastLogin: daysAgo(2)  }),
  makeUser(4,  { name: "Divya Krishnan",      email: "divya.k@school.edu",         phone: "+91 98001 56789", empId: "EMP-0004", role: "Head of Department",   department: "Academics",        status: "active",    joinDate: daysAgo(450), lastLogin: daysAgo(0)  }),
  makeUser(5,  { name: "Suresh Pillai",       email: "suresh.p@school.edu",        phone: "+91 98001 67890", empId: "EMP-0005", role: "Teacher",              department: "Academics",        status: "active",    joinDate: daysAgo(400), lastLogin: daysAgo(3)  }),
  makeUser(6,  { name: "Meera Raj",           email: "meera.raj@school.edu",       phone: "+91 98001 78901", empId: "EMP-0006", role: "Class Teacher",        department: "Academics",        status: "active",    joinDate: daysAgo(380), lastLogin: daysAgo(1)  }),
  makeUser(7,  { name: "Ravi Kumar",          email: "ravi.kumar@school.edu",      phone: "+91 98001 89012", empId: "EMP-0007", role: "Accountant",           department: "Finance",          status: "active",    joinDate: daysAgo(350), lastLogin: daysAgo(0)  }),
  makeUser(8,  { name: "Anita George",        email: "anita.george@school.edu",    phone: "+91 98001 90123", empId: "EMP-0008", role: "HR Manager",           department: "Human Resources",  status: "active",    joinDate: daysAgo(320), lastLogin: daysAgo(5)  }),
  makeUser(9,  { name: "Vinod Babu",          email: "vinod.b@school.edu",         phone: "+91 98002 01234", empId: "EMP-0009", role: "IT Admin",             department: "IT & Systems",     status: "active",    joinDate: daysAgo(290), lastLogin: daysAgo(2)  }),
  makeUser(10, { name: "Latha Sundar",        email: "latha.s@school.edu",         phone: "+91 98002 12345", empId: "EMP-0010", role: "Librarian",            department: "Library",          status: "inactive",  joinDate: daysAgo(260), lastLogin: daysAgo(45) }),
  makeUser(11, { name: "Mohammed Faisal",     email: "faisal.m@school.edu",        phone: "+91 98002 23456", empId: "EMP-0011", role: "Transport Manager",    department: "Transport",        status: "active",    joinDate: daysAgo(240), lastLogin: daysAgo(1)  }),
  makeUser(12, { name: "Rekha Thomas",        email: "rekha.t@school.edu",         phone: "+91 98002 34567", empId: "EMP-0012", role: "Hostel Warden",        department: "Hostel",           status: "active",    joinDate: daysAgo(220), lastLogin: daysAgo(0)  }),
  makeUser(13, { name: "Deepak Nambiar",      email: "deepak.n@school.edu",        phone: "+91 98002 45678", empId: "EMP-0013", role: "Teacher",              department: "Academics",        status: "suspended", joinDate: daysAgo(200), lastLogin: daysAgo(60) }),
  makeUser(14, { name: "Sangeetha Iyer",      email: "sangeetha.i@school.edu",     phone: "+91 98002 56789", empId: "EMP-0014", role: "Receptionist",         department: "Administration",   status: "active",    joinDate: daysAgo(180), lastLogin: daysAgo(0)  }),
  makeUser(15, { name: "Arun Mathew",         email: "arun.m@school.edu",          phone: "+91 98002 67890", empId: "EMP-0015", role: "Data Entry Operator",  department: "Administration",   status: "pending",   joinDate: daysAgo(10),  lastLogin: null        }),
  makeUser(16, { name: "Nisha Varghese",      email: "nisha.v@school.edu",         phone: "+91 98002 78901", empId: "EMP-0016", role: "Teacher",              department: "Academics",        status: "active",    joinDate: daysAgo(160), lastLogin: daysAgo(2)  }),
  makeUser(17, { name: "Biju Eapen",          email: "biju.e@school.edu",          phone: "+91 98002 89012", empId: "EMP-0017", role: "Teacher",              department: "Academics",        status: "inactive",  joinDate: daysAgo(140), lastLogin: daysAgo(90) }),
  makeUser(18, { name: "Sindhu Pillai",       email: "sindhu.p@school.edu",        phone: "+91 98002 90123", empId: "EMP-0018", role: "Accountant",           department: "Finance",          status: "active",    joinDate: daysAgo(120), lastLogin: daysAgo(1)  }),
  makeUser(19, { name: "Thomas Abraham",      email: "thomas.a@school.edu",        phone: "+91 98003 01234", empId: "EMP-0019", role: "Teacher",              department: "Academics",        status: "pending",   joinDate: daysAgo(5),   lastLogin: null        }),
  makeUser(20, { name: "Jyothi Krishnaswamy",email: "jyothi.k@school.edu",        phone: "+91 98003 12345", empId: "EMP-0020", role: "Counselling",          department: "Counselling",      status: "active",    joinDate: daysAgo(90),  lastLogin: daysAgo(3)  }),
];
