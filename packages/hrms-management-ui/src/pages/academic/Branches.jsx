/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/Branches.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ALL_CLASSES = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
];

const ALL_STAFF = [
  { id: "S001", name: "Mr. Arun Kumar",       role: "Vice Principal",  dept: "Admin"      },
  { id: "S002", name: "Mrs. Priya Sharma",     role: "HOD - Science",   dept: "Science"    },
  { id: "S003", name: "Mr. Rajesh Patel",      role: "HOD - Math",      dept: "Mathematics"},
  { id: "S004", name: "Ms. Anjali Gupta",      role: "Senior Teacher",  dept: "Languages"  },
  { id: "S005", name: "Mr. Vikram Rao",        role: "IT Coordinator",  dept: "IT"         },
  { id: "S006", name: "Mrs. Deepika Singh",    role: "Lab Incharge",    dept: "Science Lab"},
  { id: "S007", name: "Ms. Neha Sharma",       role: "Librarian",       dept: "Library"    },
  { id: "S008", name: "Mr. Karthik Menon",     role: "Sports Coach",    dept: "PE"         },
];

const MOCK_BRANCHES = [
  {
    id: "BR001",
    name: "Main Campus",
    code: "MC",
    type: "main",
    location: "Indiranagar, Bangalore, Karnataka",
    address: "No. 12, 100 Feet Road, Indiranagar, Bangalore – 560038",
    coordinator: { name: "Dr. Rajesh Kumar", role: "Principal" },
    students: 1200,
    staff: 89,
    classesAssigned: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"],
    capacity: 1400,
    timing: { start: "06:30", end: "13:30" },
    academicYear: "2026-27",
    status: "active",
    established: "2001",
    email: "main@school.edu",
    phone: "+91-80-2345-6789",
  },
  {
    id: "BR002",
    name: "North Branch",
    code: "NB",
    type: "branch",
    location: "Yelahanka, Bangalore, Karnataka",
    address: "Plot 45, New Town Road, Yelahanka, Bangalore – 560064",
    coordinator: { name: "Mrs. Sunita Rao",  role: "Branch Principal" },
    students: 680,
    staff: 52,
    classesAssigned: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8"],
    capacity: 800,
    timing: { start: "07:00", end: "13:30" },
    academicYear: "2026-27",
    status: "active",
    established: "2010",
    email: "north@school.edu",
    phone: "+91-80-2345-6790",
  },
  {
    id: "BR003",
    name: "East Branch",
    code: "EB",
    type: "branch",
    location: "Whitefield, Bangalore, Karnataka",
    address: "Sy. No. 78, ITPL Road, Whitefield, Bangalore – 560066",
    coordinator: { name: "Mr. Anil Menon",   role: "Branch Principal" },
    students: 450,
    staff: 38,
    classesAssigned: ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6"],
    capacity: 600,
    timing: { start: "07:00", end: "13:30" },
    academicYear: "2026-27",
    status: "active",
    established: "2015",
    email: "east@school.edu",
    phone: "+91-80-2345-6791",
  },
  {
    id: "BR004",
    name: "South Branch",
    code: "SB",
    type: "branch",
    location: "JP Nagar, Bangalore, Karnataka",
    address: "No. 5, 15th Cross, JP Nagar 3rd Phase, Bangalore – 560078",
    coordinator: { name: "Ms. Kavya Sharma", role: "Branch Principal" },
    students: 213,
    staff: 21,
    classesAssigned: ["Class 1","Class 2","Class 3","Class 4","Class 5"],
    capacity: 350,
    timing: { start: "07:30", end: "13:30" },
    academicYear: "2026-27",
    status: "active",
    established: "2019",
    email: "south@school.edu",
    phone: "+91-80-2345-6792",
  },
  {
    id: "BR005",
    name: "West Annex",
    code: "WA",
    type: "annex",
    location: "Rajajinagar, Bangalore, Karnataka",
    address: "No. 22, 5th Block, Rajajinagar, Bangalore – 560010",
    coordinator: { name: "Mr. Suresh Iyer",  role: "Coordinator"     },
    students: 0,
    staff: 6,
    classesAssigned: [],
    capacity: 200,
    timing: { start: "07:00", end: "13:00" },
    academicYear: "2026-27",
    status: "archived",
    established: "2022",
    email: "west@school.edu",
    phone: "+91-80-2345-6793",
  },
];

const EMPTY_FORM = {
  name: "", code: "", type: "branch", location: "", address: "",
  coordinatorName: "", coordinatorRole: "Branch Principal",
  capacity: "", timingStart: "07:00", timingEnd: "13:30",
  academicYear: "2026-27", email: "", phone: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const occupancyPct = (b) =>
  b.capacity > 0 ? Math.round((b.students / b.capacity) * 100) : 0;

const occColor = (pct) =>
  pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#16a34a";

// ─── Atoms ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   { label: "Active",   cls: "active"   },
    inactive: { label: "Inactive", cls: "inactive" },
    archived: { label: "Archived", cls: "archived" },
  };
  const s = map[status] || map.active;
  return <span className={`br-badge br-badge--${s.cls}`}>{s.label}</span>;
}

function TypeBadge({ type }) {
  const map = {
    main:   { label: "Main Campus", cls: "primary" },
    branch: { label: "Branch",      cls: "info"    },
    annex:  { label: "Annex",       cls: "neutral" },
  };
  const t = map[type] || map.branch;
  return <span className={`br-badge br-badge--${t.cls}`}>{t.label}</span>;
}

function OccupancyBar({ pct }) {
  return (
    <div className="br-occ-bar">
      <div className="br-occ-bar__fill" style={{ width: `${pct}%`, background: occColor(pct) }} />
    </div>
  );
}

function MetricCard({ icon, value, label, variant }) {
  return (
    <div
      className={`br-metric-card br-metric-card--${variant}`}
      data-testid={`school-card-br-metric-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
    >
      <div className="br-metric-card__icon">{icon}</div>
      <div className="br-metric-card__body">
        <div className="br-metric-card__value">{value}</div>
        <div className="br-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide, testId }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div
      className="br-modal-overlay"
      role="dialog"
      aria-modal="true"
      data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`br-modal${wide ? " br-modal--wide" : ""}`}>
        <div className="br-modal__header">
          <h3 className="br-modal__title">{title}</h3>
          <button
            className="br-modal__close"
            onClick={onClose}
            data-testid="school-button-br-modal-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Add / Edit Branch Modal ──────────────────────────────────────────────────
function BranchFormModal({ branch, onClose, onSave }) {
  const isEdit = Boolean(branch);
  const [form, setForm] = useState(
    isEdit
      ? {
          name: branch.name, code: branch.code, type: branch.type,
          location: branch.location, address: branch.address,
          coordinatorName: branch.coordinator.name,
          coordinatorRole: branch.coordinator.role,
          capacity: String(branch.capacity),
          timingStart: branch.timing.start, timingEnd: branch.timing.end,
          academicYear: branch.academicYear, email: branch.email, phone: branch.phone,
        }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name = "Branch name is required";
    if (!form.code.trim())            e.code = "Branch code is required";
    if (!form.location.trim())        e.location = "Location is required";
    if (!form.coordinatorName.trim()) e.coordinatorName = "Coordinator name is required";
    if (!form.capacity || isNaN(Number(form.capacity))) e.capacity = "Valid capacity is required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal
      title={isEdit ? `Edit Branch — ${branch.name}` : "Add New Branch"}
      onClose={onClose}
      wide
      testId="school-modal-br-form"
    >
      <div className="br-modal__body br-modal__body--scroll">
        <div className="br-form-grid">
          <div className="br-form-group br-form-group--full">
            <label className="br-form-label">Branch Name *</label>
            <input
              className={`br-form-input${errors.name ? " br-form-input--error" : ""}`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. North Branch"
              data-testid="school-input-br-name"
            />
            {errors.name && <span className="br-form-error">{errors.name}</span>}
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Branch Code *</label>
            <input
              className={`br-form-input${errors.code ? " br-form-input--error" : ""}`}
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="e.g. NB"
              maxLength={4}
              data-testid="school-input-br-code"
            />
            {errors.code && <span className="br-form-error">{errors.code}</span>}
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Branch Type</label>
            <select
              className="br-form-select"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              data-testid="school-dropdown-br-type"
            >
              <option value="main">Main Campus</option>
              <option value="branch">Branch</option>
              <option value="annex">Annex</option>
            </select>
          </div>

          <div className="br-form-group br-form-group--full">
            <label className="br-form-label">Location *</label>
            <input
              className={`br-form-input${errors.location ? " br-form-input--error" : ""}`}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City, State"
              data-testid="school-input-br-location"
            />
            {errors.location && <span className="br-form-error">{errors.location}</span>}
          </div>

          <div className="br-form-group br-form-group--full">
            <label className="br-form-label">Full Address</label>
            <textarea
              className="br-form-textarea"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Street, area, city, pin code"
              rows={2}
              data-testid="school-textarea-br-address"
            />
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Coordinator Name *</label>
            <input
              className={`br-form-input${errors.coordinatorName ? " br-form-input--error" : ""}`}
              value={form.coordinatorName}
              onChange={(e) => set("coordinatorName", e.target.value)}
              placeholder="e.g. Dr. Rajesh Kumar"
              data-testid="school-input-br-coordinator"
            />
            {errors.coordinatorName && <span className="br-form-error">{errors.coordinatorName}</span>}
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Coordinator Role</label>
            <input
              className="br-form-input"
              value={form.coordinatorRole}
              onChange={(e) => set("coordinatorRole", e.target.value)}
              placeholder="e.g. Principal"
              data-testid="school-input-br-coordinator-role"
            />
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Capacity (Students) *</label>
            <input
              type="number"
              className={`br-form-input${errors.capacity ? " br-form-input--error" : ""}`}
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              placeholder="e.g. 800"
              min={1}
              data-testid="school-input-br-capacity"
            />
            {errors.capacity && <span className="br-form-error">{errors.capacity}</span>}
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Academic Year</label>
            <select
              className="br-form-select"
              value={form.academicYear}
              onChange={(e) => set("academicYear", e.target.value)}
              data-testid="school-dropdown-br-year"
            >
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
            </select>
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Timing — Start</label>
            <input
              type="time"
              className="br-form-input"
              value={form.timingStart}
              onChange={(e) => set("timingStart", e.target.value)}
              data-testid="school-input-br-timing-start"
            />
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Timing — End</label>
            <input
              type="time"
              className="br-form-input"
              value={form.timingEnd}
              onChange={(e) => set("timingEnd", e.target.value)}
              data-testid="school-input-br-timing-end"
            />
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Email</label>
            <input
              type="email"
              className="br-form-input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="branch@school.edu"
              data-testid="school-input-br-email"
            />
          </div>

          <div className="br-form-group">
            <label className="br-form-label">Phone</label>
            <input
              className="br-form-input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91-80-XXXX-XXXX"
              data-testid="school-input-br-phone"
            />
          </div>
        </div>
      </div>
      <div className="br-modal__footer">
        <button className="br-btn br-btn--ghost" onClick={onClose} data-testid="school-button-br-form-cancel">
          Cancel
        </button>
        <button className="br-btn br-btn--primary" onClick={handleSave} data-testid="school-button-br-form-save">
          {isEdit ? "Save Changes" : "Add Branch"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Assign Classes Modal ─────────────────────────────────────────────────────
function AssignClassesModal({ branch, onClose, onSave }) {
  const [selected, setSelected] = useState(new Set(branch.classesAssigned));

  const toggle = (cls) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(cls) ? next.delete(cls) : next.add(cls);
      return next;
    });

  return (
    <Modal title={`Assign Classes — ${branch.name}`} onClose={onClose} testId="school-modal-br-classes">
      <div className="br-modal__body">
        <p className="br-modal__desc">Select classes to assign to this branch for Academic Year {branch.academicYear}.</p>
        <div className="br-class-grid">
          {ALL_CLASSES.map((cls) => (
            <button
              key={cls}
              className={`br-class-chip${selected.has(cls) ? " br-class-chip--active" : ""}`}
              onClick={() => toggle(cls)}
              data-testid={`school-button-br-class-${cls.replace(" ", "-").toLowerCase()}`}
            >
              {selected.has(cls) ? "✓ " : ""}{cls}
            </button>
          ))}
        </div>
        <p className="br-modal__count">{selected.size} class{selected.size !== 1 ? "es" : ""} selected</p>
      </div>
      <div className="br-modal__footer">
        <button className="br-btn br-btn--ghost" onClick={onClose} data-testid="school-button-br-classes-cancel">Cancel</button>
        <button className="br-btn br-btn--primary" onClick={() => onSave([...selected])} data-testid="school-button-br-classes-save">
          Save Assignment
        </button>
      </div>
    </Modal>
  );
}

// ─── Assign Staff Modal ───────────────────────────────────────────────────────
function AssignStaffModal({ branch, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      ALL_STAFF.filter(
        (s) =>
          !search.trim() ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.role.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Modal title={`Assign Staff — ${branch.name}`} onClose={onClose} testId="school-modal-br-staff">
      <div className="br-modal__body br-modal__body--scroll">
        <div className="br-modal__search">
          <span>🔍</span>
          <input
            className="br-modal__search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or role…"
            data-testid="school-input-br-staff-search"
          />
        </div>
        <div className="br-staff-list">
          {filtered.map((s) => (
            <div key={s.id} className="br-staff-row" data-testid={`school-row-br-staff-${s.id}`}>
              <div className="br-staff-row__avatar">{s.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}</div>
              <div className="br-staff-row__info">
                <p className="br-staff-row__name">{s.name}</p>
                <p className="br-staff-row__meta">{s.role} · {s.dept}</p>
              </div>
              <button className="br-btn br-btn--outline br-btn--xs" data-testid={`school-button-br-assign-staff-${s.id}`}>
                Assign
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="br-modal__empty">No staff found matching your search.</p>
          )}
        </div>
      </div>
      <div className="br-modal__footer">
        <button className="br-btn br-btn--ghost" onClick={onClose} data-testid="school-button-br-staff-cancel">Close</button>
      </div>
    </Modal>
  );
}

// ─── Manage Timings Modal ─────────────────────────────────────────────────────
function TimingsModal({ branch, onClose, onSave }) {
  const [start, setStart] = useState(branch.timing.start);
  const [end,   setEnd]   = useState(branch.timing.end);

  return (
    <Modal title={`Manage Timings — ${branch.name}`} onClose={onClose} testId="school-modal-br-timings">
      <div className="br-modal__body">
        <p className="br-modal__desc">Configure school timings for {branch.name} (Academic Year {branch.academicYear}).</p>
        <div className="br-timings-grid">
          <div className="br-form-group">
            <label className="br-form-label">Start Time</label>
            <input
              type="time"
              className="br-form-input"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              data-testid="school-input-br-timing-start-modal"
            />
          </div>
          <div className="br-form-group">
            <label className="br-form-label">End Time</label>
            <input
              type="time"
              className="br-form-input"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              data-testid="school-input-br-timing-end-modal"
            />
          </div>
        </div>
        <div className="br-timings-preview">
          <span className="br-timings-preview__label">Daily Schedule</span>
          <span className="br-timings-preview__val">{start} – {end}</span>
          <span className="br-timings-preview__dur">
            ({Math.round((new Date(`2000-01-01T${end}`) - new Date(`2000-01-01T${start}`)) / 36e5 * 10) / 10} hrs)
          </span>
        </div>
      </div>
      <div className="br-modal__footer">
        <button className="br-btn br-btn--ghost" onClick={onClose} data-testid="school-button-br-timings-cancel">Cancel</button>
        <button className="br-btn br-btn--primary" onClick={() => onSave({ start, end })} data-testid="school-button-br-timings-save">
          Save Timings
        </button>
      </div>
    </Modal>
  );
}

// ─── Archive Confirm Modal ─────────────────────────────────────────────────────
function ArchiveConfirmModal({ branch, onClose, onConfirm }) {
  return (
    <Modal title="Archive Branch" onClose={onClose} testId="school-modal-br-archive">
      <div className="br-modal__body">
        <div className="br-confirm">
          <div className="br-confirm__icon">⚠️</div>
          <h4 className="br-confirm__title">Archive {branch.name}?</h4>
          <p className="br-confirm__desc">
            This will archive the branch and make it inactive. Existing student records will be retained.
            You can reactivate it later from archived branches.
          </p>
          <div className="br-confirm__info">
            <span>📍 {branch.location}</span>
            <span>👥 {branch.students} students</span>
            <span>👨‍🏫 {branch.staff} staff</span>
          </div>
        </div>
      </div>
      <div className="br-modal__footer">
        <button className="br-btn br-btn--ghost" onClick={onClose} data-testid="school-button-br-archive-cancel">Cancel</button>
        <button className="br-btn br-btn--danger" onClick={() => onConfirm(branch.id)} data-testid="school-button-br-archive-confirm">
          Archive Branch
        </button>
      </div>
    </Modal>
  );
}

// ─── Branch Card ──────────────────────────────────────────────────────────────
function BranchCard({ branch, onEdit, onAssignClasses, onAssignStaff, onTimings, onArchive }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const occ = occupancyPct(branch);

  return (
    <div
      className={`br-card${branch.status === "archived" ? " br-card--archived" : ""}`}
      data-testid={`school-card-br-${branch.id}`}
    >
      {/* Card Header */}
      <div className="br-card__header">
        <div className="br-card__header-left">
          <div className="br-card__code">{branch.code}</div>
          <div>
            <h3 className="br-card__name">{branch.name}</h3>
            <p className="br-card__location">📍 {branch.location}</p>
          </div>
        </div>
        <div className="br-card__header-right">
          <StatusBadge status={branch.status} />
          <TypeBadge type={branch.type} />
          <div className="br-card__menu-wrap">
            <button
              className="br-card__menu-btn"
              onClick={() => setMenuOpen((p) => !p)}
              data-testid={`school-button-br-menu-${branch.id}`}
              aria-label="Branch actions"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="br-card__menu" onMouseLeave={() => setMenuOpen(false)}>
                <button className="br-card__menu-item" onClick={() => { onEdit(branch); setMenuOpen(false); }} data-testid={`school-button-br-edit-${branch.id}`}>
                  ✏️ Edit Branch
                </button>
                <button className="br-card__menu-item" onClick={() => { onAssignClasses(branch); setMenuOpen(false); }} data-testid={`school-button-br-assign-classes-${branch.id}`}>
                  📚 Assign Classes
                </button>
                <button className="br-card__menu-item" onClick={() => { onAssignStaff(branch); setMenuOpen(false); }} data-testid={`school-button-br-assign-staff-${branch.id}`}>
                  👨‍🏫 Assign Staff
                </button>
                <button className="br-card__menu-item" onClick={() => { onTimings(branch); setMenuOpen(false); }} data-testid={`school-button-br-timings-${branch.id}`}>
                  🕐 Manage Timings
                </button>
                <div className="br-card__menu-divider" />
                <button className="br-card__menu-item br-card__menu-item--danger" onClick={() => { onArchive(branch); setMenuOpen(false); }} data-testid={`school-button-br-archive-${branch.id}`}>
                  🗃️ Archive Branch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="br-card__stats">
        <div className="br-card__stat">
          <span className="br-card__stat-label">Students</span>
          <span className="br-card__stat-val">{branch.students.toLocaleString("en-IN")}</span>
        </div>
        <div className="br-card__stat">
          <span className="br-card__stat-label">Staff</span>
          <span className="br-card__stat-val">{branch.staff}</span>
        </div>
        <div className="br-card__stat">
          <span className="br-card__stat-label">Classes</span>
          <span className="br-card__stat-val">{branch.classesAssigned.length}</span>
        </div>
        <div className="br-card__stat">
          <span className="br-card__stat-label">Capacity</span>
          <span className="br-card__stat-val">{branch.capacity.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Occupancy */}
      <div className="br-card__occ">
        <div className="br-card__occ-row">
          <span className="br-card__occ-label">Occupancy</span>
          <span className="br-card__occ-val" style={{ color: occColor(occ) }}>{occ}%</span>
        </div>
        <OccupancyBar pct={occ} />
      </div>

      {/* Coordinator */}
      <div className="br-card__coordinator">
        <div className="br-card__coordinator-avatar">
          {branch.coordinator.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
        </div>
        <div>
          <p className="br-card__coordinator-name">{branch.coordinator.name}</p>
          <p className="br-card__coordinator-role">{branch.coordinator.role}</p>
        </div>
      </div>

      {/* Classes chips */}
      {branch.classesAssigned.length > 0 && (
        <div className="br-card__classes">
          {branch.classesAssigned.slice(0, 5).map((cls) => (
            <span key={cls} className="br-class-tag">{cls}</span>
          ))}
          {branch.classesAssigned.length > 5 && (
            <span className="br-class-tag br-class-tag--more">+{branch.classesAssigned.length - 5}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="br-card__footer">
        <div className="br-card__footer-meta">
          <span>🕐 {branch.timing.start} – {branch.timing.end}</span>
          <span>📅 {branch.academicYear}</span>
          {branch.established && <span>Est. {branch.established}</span>}
        </div>
        <div className="br-card__footer-actions">
          <button
            className="br-btn br-btn--outline br-btn--sm"
            onClick={() => onEdit(branch)}
            data-testid={`school-button-br-edit-card-${branch.id}`}
          >
            Edit
          </button>
          <button
            className="br-btn br-btn--ghost br-btn--sm"
            onClick={() => onAssignClasses(branch)}
            data-testid={`school-button-br-assign-classes-card-${branch.id}`}
          >
            Classes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Branches() {
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [modal, setModal] = useState(null); // { type, branch? }

  const closeModal = useCallback(() => setModal(null), []);

  // ── Metrics
  const metrics = useMemo(() => {
    const active = branches.filter((b) => b.status === "active");
    return {
      total:    branches.length,
      active:   active.length,
      students: active.reduce((s, b) => s + b.students, 0),
      staff:    active.reduce((s, b) => s + b.staff, 0),
      capacity: active.reduce((s, b) => s + b.capacity, 0),
    };
  }, [branches]);

  // ── Filtered
  const filtered = useMemo(() => {
    let list = branches;
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (typeFilter !== "all")   list = list.filter((b) => b.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.coordinator.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [branches, statusFilter, typeFilter, search]);

  const hasFilters = Boolean(search || statusFilter !== "all" || typeFilter !== "all");

  // ── Handlers
  const handleSaveBranch = useCallback((form) => {
    if (modal?.branch) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === modal.branch.id
            ? {
                ...b,
                name: form.name, code: form.code, type: form.type,
                location: form.location, address: form.address,
                coordinator: { name: form.coordinatorName, role: form.coordinatorRole },
                capacity: Number(form.capacity),
                timing: { start: form.timingStart, end: form.timingEnd },
                academicYear: form.academicYear,
                email: form.email, phone: form.phone,
              }
            : b
        )
      );
    } else {
      setBranches((prev) => [
        ...prev,
        {
          id: `BR${String(Date.now()).slice(-4)}`,
          name: form.name, code: form.code, type: form.type,
          location: form.location, address: form.address,
          coordinator: { name: form.coordinatorName, role: form.coordinatorRole },
          students: 0, staff: 0, classesAssigned: [],
          capacity: Number(form.capacity),
          timing: { start: form.timingStart, end: form.timingEnd },
          academicYear: form.academicYear,
          status: "active",
          established: new Date().getFullYear().toString(),
          email: form.email, phone: form.phone,
        },
      ]);
    }
    closeModal();
  }, [modal, closeModal]);

  const handleSaveClasses = useCallback((classes) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === modal?.branch?.id ? { ...b, classesAssigned: classes } : b
      )
    );
    closeModal();
  }, [modal, closeModal]);

  const handleSaveTimings = useCallback((timing) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === modal?.branch?.id ? { ...b, timing } : b
      )
    );
    closeModal();
  }, [modal, closeModal]);

  const handleArchive = useCallback((branchId) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branchId ? { ...b, status: "archived" } : b))
    );
    closeModal();
  }, [closeModal]);

  return (
    <div className="br-root" data-testid="school-page-branches">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Academic Setup" },
          { label: "Branches" },
        ]}
        title="Branches & Campuses"
        subtitle="Manage school branches, assign classes, configure staff and timings"
        actions={(
          <>
            <button
              className="br-btn br-btn--ghost br-btn--sm"
              data-testid="school-button-br-export"
            >
              ⬇ Export
            </button>
            <button
              className="br-btn br-btn--primary"
              onClick={() => setModal({ type: "add" })}
              data-testid="school-button-br-add"
            >
              + Add Branch
            </button>
          </>
        )}
      />

      {/* ── Metrics ── */}
      <div className="br-metrics">
        <MetricCard icon="🏫" value={metrics.total}                               label="Total Branches"   variant="primary" />
        <MetricCard icon="✅" value={metrics.active}                              label="Active Branches"  variant="success" />
        <MetricCard icon="👥" value={metrics.students.toLocaleString("en-IN")}    label="Total Students"   variant="info"    />
        <MetricCard icon="👨‍🏫" value={metrics.staff}                              label="Total Staff"      variant="warning" />
        <MetricCard icon="📊" value={`${Math.round((metrics.students / (metrics.capacity || 1)) * 100)}%`} label="Avg Occupancy" variant="neutral" />
      </div>

      {/* ── Toolbar ── */}
      <div className="br-toolbar" data-testid="school-toolbar-branches">
        <div className="br-toolbar__search">
          <span className="br-toolbar__search-icon">🔍</span>
          <input
            className="br-toolbar__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branch name, location, coordinator…"
            data-testid="school-input-br-search"
          />
          {search && (
            <button className="br-toolbar__clear" onClick={() => setSearch("")} aria-label="Clear search">✕</button>
          )}
        </div>
        <div className="br-toolbar__filters">
          <select
            className="br-toolbar__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="school-dropdown-br-status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="br-toolbar__select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            data-testid="school-dropdown-br-type"
          >
            <option value="all">All Types</option>
            <option value="main">Main Campus</option>
            <option value="branch">Branch</option>
            <option value="annex">Annex</option>
          </select>
          {hasFilters && (
            <button
              className="br-btn br-btn--ghost br-btn--sm"
              onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
              data-testid="school-button-br-clear-filters"
            >
              ✕ Clear
            </button>
          )}
          <span className="br-results-count">
            {filtered.length} of {branches.length} branch{branches.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      {/* ── Branch Grid ── */}
      {filtered.length > 0 ? (
        <div className="br-grid">
          {filtered.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onEdit={(b)           => setModal({ type: "edit",   branch: b })}
              onAssignClasses={(b)  => setModal({ type: "classes", branch: b })}
              onAssignStaff={(b)    => setModal({ type: "staff",  branch: b })}
              onTimings={(b)        => setModal({ type: "timings", branch: b })}
              onArchive={(b)        => setModal({ type: "archive", branch: b })}
            />
          ))}
        </div>
      ) : (
        <div className="br-empty" data-testid="school-container-br-empty">
          <div className="br-empty__icon">🏫</div>
          <h3 className="br-empty__title">No Branches Found</h3>
          <p className="br-empty__sub">Adjust your filters or add a new branch to get started.</p>
          <button
            className="br-btn br-btn--primary"
            onClick={() => setModal({ type: "add" })}
            data-testid="school-button-br-add-empty"
          >
            + Add Branch
          </button>
        </div>
      )}

      {/* ── Modals ── */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <BranchFormModal
          branch={modal.type === "edit" ? modal.branch : null}
          onClose={closeModal}
          onSave={handleSaveBranch}
        />
      )}
      {modal?.type === "classes" && (
        <AssignClassesModal
          branch={modal.branch}
          onClose={closeModal}
          onSave={handleSaveClasses}
        />
      )}
      {modal?.type === "staff" && (
        <AssignStaffModal
          branch={modal.branch}
          onClose={closeModal}
        />
      )}
      {modal?.type === "timings" && (
        <TimingsModal
          branch={modal.branch}
          onClose={closeModal}
          onSave={handleSaveTimings}
        />
      )}
      {modal?.type === "archive" && (
        <ArchiveConfirmModal
          branch={modal.branch}
          onClose={closeModal}
          onConfirm={handleArchive}
        />
      )}
    </div>
  );
}