// ─── Admin Access Mock Data ───────────────────────────────────────────────────

export const ACCESS_LEVELS = [
  { value: "super-admin",       label: "Super Admin",       color: "#c9a962", bg: "rgba(201,169,98,.12)"  },
  { value: "management-admin",  label: "Management Admin",  color: "#2563eb", bg: "rgba(37,99,235,.10)"   },
  { value: "operations-admin",  label: "Operations Admin",  color: "#0d9488", bg: "rgba(13,148,136,.10)"  },
  { value: "finance-admin",     label: "Finance Admin",     color: "#d97706", bg: "rgba(217,119,6,.10)"   },
  { value: "academic-admin",    label: "Academic Admin",    color: "#7c3aed", bg: "rgba(124,58,237,.10)"  },
];

export const LEVEL_OPTIONS = [
  { value: "all", label: "All Levels" },
  ...ACCESS_LEVELS.map((l) => ({ value: l.value, label: l.label })),
];

export const STATUS_OPTIONS = [
  { value: "all",       label: "All Status" },
  { value: "active",    label: "Active"     },
  { value: "inactive",  label: "Inactive"   },
  { value: "suspended", label: "Suspended"  },
];

export const ADMIN_METRICS = [
  { id: "total",     icon: "🛡️",  label: "Total Admins",          color: "primary" },
  { id: "active",    icon: "🟢",  label: "Active Admin Sessions",  color: "success" },
  { id: "super",     icon: "👑",  label: "Super Admins",           color: "warning" },
  { id: "suspended", icon: "🚫",  label: "Suspended Access",       color: "danger"  },
];

export const computeMetrics = (admins) => ({
  total:     admins.length,
  active:    admins.filter((a) => a.status === "active").length,
  super:     admins.filter((a) => a.accessLevel === "super-admin").length,
  suspended: admins.filter((a) => a.status === "suspended").length,
});

const avatarColors = ["#c9a962","#2563eb","#16a34a","#dc2626","#7c3aed","#0d9488","#d97706","#e11d48"];
const getColor = (i) => avatarColors[i % avatarColors.length];
const initials  = (name) => name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const now = new Date("2026-05-21");
const daysAgo = (n) => { const d = new Date(now); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
const minsAgo = (m) => { const d = new Date(now); d.setMinutes(d.getMinutes() - m); return d.toISOString(); };

export const MOCK_ADMINS = [
  {
    id: "ADM-0001", name: "Arjun Sharma",       email: "arjun.sharma@school.edu",   empId: "EMP-0001",
    role: "System Administrator",   accessLevel: "super-admin",
    department: "Administration",   status: "active",
    lastActive: minsAgo(12),        sessionStatus: "online",
    grantedDate: daysAgo(730),      grantedBy: "System",
    remarks: "Primary super admin account.",
    avatarColor: getColor(0),       initials: initials("Arjun Sharma"),
  },
  {
    id: "ADM-0002", name: "Priya Nair",          email: "priya.nair@school.edu",     empId: "EMP-0002",
    role: "Principal",              accessLevel: "super-admin",
    department: "Administration",   status: "active",
    lastActive: minsAgo(45),        sessionStatus: "online",
    grantedDate: daysAgo(600),      grantedBy: "Arjun Sharma",
    remarks: "Principal admin access.",
    avatarColor: getColor(1),       initials: initials("Priya Nair"),
  },
  {
    id: "ADM-0003", name: "Karthik Menon",       email: "karthik.menon@school.edu",  empId: "EMP-0003",
    role: "Vice Principal",         accessLevel: "management-admin",
    department: "Administration",   status: "active",
    lastActive: minsAgo(180),       sessionStatus: "online",
    grantedDate: daysAgo(500),      grantedBy: "Priya Nair",
    remarks: "Management-level access for operational oversight.",
    avatarColor: getColor(2),       initials: initials("Karthik Menon"),
  },
  {
    id: "ADM-0004", name: "Ravi Kumar",           email: "ravi.kumar@school.edu",    empId: "EMP-0007",
    role: "Chief Accountant",       accessLevel: "finance-admin",
    department: "Finance",          status: "active",
    lastActive: daysAgo(1),         sessionStatus: "offline",
    grantedDate: daysAgo(450),      grantedBy: "Priya Nair",
    remarks: "Full finance module access.",
    avatarColor: getColor(3),       initials: initials("Ravi Kumar"),
  },
  {
    id: "ADM-0005", name: "Anita George",         email: "anita.george@school.edu",  empId: "EMP-0008",
    role: "HR Manager",             accessLevel: "operations-admin",
    department: "Human Resources",  status: "active",
    lastActive: minsAgo(300),       sessionStatus: "online",
    grantedDate: daysAgo(400),      grantedBy: "Karthik Menon",
    remarks: "Operations admin for staff and HR workflows.",
    avatarColor: getColor(4),       initials: initials("Anita George"),
  },
  {
    id: "ADM-0006", name: "Vinod Babu",           email: "vinod.b@school.edu",       empId: "EMP-0009",
    role: "IT Administrator",       accessLevel: "management-admin",
    department: "IT & Systems",     status: "active",
    lastActive: minsAgo(20),        sessionStatus: "online",
    grantedDate: daysAgo(380),      grantedBy: "Arjun Sharma",
    remarks: "IT systems and infrastructure admin.",
    avatarColor: getColor(5),       initials: initials("Vinod Babu"),
  },
  {
    id: "ADM-0007", name: "Divya Krishnan",       email: "divya.k@school.edu",       empId: "EMP-0004",
    role: "Head of Department",     accessLevel: "academic-admin",
    department: "Academics",        status: "active",
    lastActive: daysAgo(2),         sessionStatus: "offline",
    grantedDate: daysAgo(300),      grantedBy: "Priya Nair",
    remarks: "Academic setup and records admin.",
    avatarColor: getColor(6),       initials: initials("Divya Krishnan"),
  },
  {
    id: "ADM-0008", name: "Mohammed Faisal",      email: "faisal.m@school.edu",      empId: "EMP-0011",
    role: "Transport Manager",      accessLevel: "operations-admin",
    department: "Transport",        status: "inactive",
    lastActive: daysAgo(30),        sessionStatus: "offline",
    grantedDate: daysAgo(250),      grantedBy: "Karthik Menon",
    remarks: "Transport and logistics operations.",
    avatarColor: getColor(7),       initials: initials("Mohammed Faisal"),
  },
  {
    id: "ADM-0009", name: "Sangeetha Iyer",       email: "sangeetha.i@school.edu",   empId: "EMP-0014",
    role: "Academic Coordinator",   accessLevel: "academic-admin",
    department: "Academics",        status: "suspended",
    lastActive: daysAgo(60),        sessionStatus: "offline",
    grantedDate: daysAgo(200),      grantedBy: "Divya Krishnan",
    remarks: "Access suspended pending review.",
    avatarColor: getColor(0),       initials: initials("Sangeetha Iyer"),
  },
  {
    id: "ADM-0010", name: "Sindhu Pillai",        email: "sindhu.p@school.edu",      empId: "EMP-0018",
    role: "Finance Officer",        accessLevel: "finance-admin",
    department: "Finance",          status: "active",
    lastActive: minsAgo(90),        sessionStatus: "online",
    grantedDate: daysAgo(150),      grantedBy: "Ravi Kumar",
    remarks: "Secondary finance admin.",
    avatarColor: getColor(1),       initials: initials("Sindhu Pillai"),
  },
  {
    id: "ADM-0011", name: "Biju Eapen",           email: "biju.e@school.edu",        empId: "EMP-0017",
    role: "Campus Supervisor",      accessLevel: "operations-admin",
    department: "Administration",   status: "suspended",
    lastActive: daysAgo(45),        sessionStatus: "offline",
    grantedDate: daysAgo(120),      grantedBy: "Karthik Menon",
    remarks: "Suspended - under HR investigation.",
    avatarColor: getColor(2),       initials: initials("Biju Eapen"),
  },
  {
    id: "ADM-0012", name: "Latha Sundar",         email: "latha.s@school.edu",       empId: "EMP-0010",
    role: "Librarian Admin",        accessLevel: "operations-admin",
    department: "Library",          status: "inactive",
    lastActive: daysAgo(90),        sessionStatus: "offline",
    grantedDate: daysAgo(100),      grantedBy: "Anita George",
    remarks: "Inactive - on leave.",
    avatarColor: getColor(3),       initials: initials("Latha Sundar"),
  },
];

export const DEPARTMENTS = [
  "Administration", "Academics", "Finance", "Human Resources",
  "IT & Systems", "Transport", "Library", "Hostel", "Campus",
];

export const SAMPLE_USERS = [
  { id: "EMP-0021", name: "Nisha Varghese",  email: "nisha.v@school.edu",  department: "Academics"  },
  { id: "EMP-0022", name: "Thomas Abraham",  email: "thomas.a@school.edu", department: "Finance"    },
  { id: "EMP-0023", name: "Rekha Thomas",    email: "rekha.t@school.edu",  department: "Hostel"     },
  { id: "EMP-0024", name: "Deepak Nambiar",  email: "deepak.n@school.edu", department: "Academics"  },
  { id: "EMP-0025", name: "Arun Mathew",     email: "arun.m@school.edu",   department: "Administration" },
];
