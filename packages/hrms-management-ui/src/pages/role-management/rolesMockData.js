// ─── Roles & Permissions Mock Data ───────────────────────────────────────────

export const PERMISSION_TYPES = ["view", "create", "edit", "delete"];

export const PERMISSION_GROUPS = [
  "Dashboard",
  "Fees",
  "Transport",
  "Announcements",
  "Grievances",
  "Academic Setup",
  "Events",
  "Alumni",
  "Leave Management",
  "Policies",
  "Staff Management",
  "Campus Management",
  "User Management",
  "Reports & Analytics",
  "Settings",
];

// Build a fully-off permission map
export const emptyPermissions = () =>
  Object.fromEntries(
    PERMISSION_GROUPS.map((g) => [
      g,
      Object.fromEntries(PERMISSION_TYPES.map((t) => [t, false])),
    ])
  );

// Pre-set permission profiles
const fullAccess = () =>
  Object.fromEntries(
    PERMISSION_GROUPS.map((g) => [
      g,
      Object.fromEntries(PERMISSION_TYPES.map((t) => [t, true])),
    ])
  );

const viewOnly = () =>
  Object.fromEntries(
    PERMISSION_GROUPS.map((g) => [
      g,
      { view: true, create: false, edit: false, delete: false },
    ])
  );

const staffPermissions = () => {
  const p = emptyPermissions();
  ["Dashboard", "Announcements", "Leave Management", "Policies", "Events"].forEach(
    (g) => (p[g].view = true)
  );
  ["Leave Management"].forEach((g) => {
    p[g].create = true;
    p[g].edit = true;
  });
  return p;
};

const feeManagerPermissions = () => {
  const p = emptyPermissions();
  ["Fees", "Reports & Analytics", "Dashboard"].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
  });
  p["Fees"].delete = true;
  return p;
};

const transportPermissions = () => {
  const p = emptyPermissions();
  ["Transport", "Dashboard", "Reports & Analytics"].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
  });
  p["Transport"].delete = true;
  return p;
};

const hrPermissions = () => {
  const p = emptyPermissions();
  [
    "Staff Management", "Leave Management", "Policies",
    "Announcements", "Dashboard", "Reports & Analytics",
  ].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
  });
  p["Staff Management"].delete = true;
  return p;
};

const academicPermissions = () => {
  const p = emptyPermissions();
  [
    "Academic Setup", "Announcements", "Events",
    "Alumni", "Dashboard", "Reports & Analytics",
  ].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
  });
  p["Academic Setup"].delete = true;
  return p;
};

const campusPermissions = () => {
  const p = emptyPermissions();
  ["Campus Management", "Dashboard", "Reports & Analytics"].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
  });
  p["Campus Management"].delete = true;
  return p;
};

const itAdminPermissions = () => {
  const p = emptyPermissions();
  [
    "User Management", "Settings", "Dashboard",
    "Reports & Analytics",
  ].forEach((g) => {
    p[g].view = true;
    p[g].create = true;
    p[g].edit = true;
    p[g].delete = true;
  });
  return p;
};

const countPermissions = (perms) =>
  Object.values(perms).reduce(
    (sum, group) => sum + Object.values(group).filter(Boolean).length,
    0
  );

const daysAgo = (n) => {
  const d = new Date("2026-05-21");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const MOCK_ROLES = [
  {
    id: "role-001",
    name: "Super Admin",
    description: "Full system access with all permissions enabled across every module.",
    type: "system",
    status: "active",
    totalUsers: 2,
    createdDate: daysAgo(730),
    permissions: fullAccess(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#c9a962",
  },
  {
    id: "role-002",
    name: "Principal",
    description: "School-wide administrative access covering academic and operational modules.",
    type: "system",
    status: "active",
    totalUsers: 1,
    createdDate: daysAgo(600),
    permissions: fullAccess(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#2563eb",
  },
  {
    id: "role-003",
    name: "Teacher",
    description: "Standard access for teaching staff — attendance, grades, and announcements.",
    type: "system",
    status: "active",
    totalUsers: 45,
    createdDate: daysAgo(500),
    permissions: staffPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#16a34a",
  },
  {
    id: "role-004",
    name: "Accountant",
    description: "Fee collection, payment tracking, and financial reporting access.",
    type: "system",
    status: "active",
    totalUsers: 3,
    createdDate: daysAgo(480),
    permissions: feeManagerPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#d97706",
  },
  {
    id: "role-005",
    name: "Transport Manager",
    description: "Full control over transport routes, drivers, and bus tracking.",
    type: "system",
    status: "active",
    totalUsers: 2,
    createdDate: daysAgo(460),
    permissions: transportPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#0d9488",
  },
  {
    id: "role-006",
    name: "HR Manager",
    description: "Staff management, leave approvals, and policy administration.",
    type: "system",
    status: "active",
    totalUsers: 2,
    createdDate: daysAgo(440),
    permissions: hrPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#7c3aed",
  },
  {
    id: "role-007",
    name: "IT Admin",
    description: "System configuration, user management, and security settings.",
    type: "system",
    status: "active",
    totalUsers: 1,
    createdDate: daysAgo(420),
    permissions: itAdminPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#e11d48",
  },
  {
    id: "role-008",
    name: "Academic Coordinator",
    description: "Academic setup, events, alumni management, and curriculum planning.",
    type: "custom",
    status: "active",
    totalUsers: 4,
    createdDate: daysAgo(200),
    permissions: academicPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#0891b2",
  },
  {
    id: "role-009",
    name: "Campus Supervisor",
    description: "Oversees campus infrastructure, facilities, and contact management.",
    type: "custom",
    status: "active",
    totalUsers: 2,
    createdDate: daysAgo(150),
    permissions: campusPermissions(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#65a30d",
  },
  {
    id: "role-010",
    name: "Viewer",
    description: "Read-only access across all modules. Cannot create, edit, or delete.",
    type: "custom",
    status: "inactive",
    totalUsers: 5,
    createdDate: daysAgo(90),
    permissions: viewOnly(),
    get permissionsCount() { return countPermissions(this.permissions); },
    color: "#6b7280",
  },
];

export const ROLE_METRICS = [
  { id: "total",    icon: "🛡️",  label: "Total Roles",       color: "primary" },
  { id: "active",   icon: "✅",  label: "Active Roles",      color: "success" },
  { id: "custom",   icon: "⚙️", label: "Custom Roles",      color: "info"    },
  { id: "groups",   icon: "📋",  label: "Permission Groups", color: "warning" },
];

export const computeMetrics = (roles) => ({
  total:  roles.length,
  active: roles.filter((r) => r.status === "active").length,
  custom: roles.filter((r) => r.type === "custom").length,
  groups: PERMISSION_GROUPS.length,
});

export const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const TYPE_OPTIONS = [
  { value: "all",    label: "All Types" },
  { value: "system", label: "System" },
  { value: "custom", label: "Custom" },
];
