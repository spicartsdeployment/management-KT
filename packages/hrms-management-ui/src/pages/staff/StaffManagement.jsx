/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback } from "react";
import "../../Assets/styles/StaffManagement.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD   = "#c9a962";
const GREEN  = "#16a34a";
const RED    = "#dc2626";
const BLUE   = "#2563eb";
const AMBER  = "#d97706";
const PURPLE = "#7c3aed";

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: "directory",   label: "Staff Directory",          icon: "👥" },
  { id: "allocations", label: "Allocations & Workload",   icon: "📋" },
  { id: "departments", label: "Departments & Hierarchy",  icon: "🏢" },
  { id: "performance", label: "Performance & Appraisal",  icon: "⭐" },
  { id: "operations",  label: "Staff Operations",         icon: "⚙️" },
];

// ─── Filter options ───────────────────────────────────────────────────────────
const DEPT_OPTIONS   = ["All Departments","Science","Mathematics","Languages","Administration","Transport","Hostel","Security","Maintenance"];
const DESIG_OPTIONS  = ["All Designations","Principal","Vice Principal","HOD","Senior Teacher","Teacher","Counselor","Admin Staff"];
const CAMPUS_OPTIONS = ["All Campuses","North Campus","South Campus","East Wing"];
const STATUS_OPTIONS = ["All Status","Active","On Leave","Suspended","Resigned","Retired"];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STAFF_DATA = [
  { id:"STF001", name:"Dr. Meera Krishnan",     emp_id:"EMP2015001", desig:"Principal",      dept:"Administration", campus:"North Campus", phone:"+91 9876543210", email:"meera@school.edu",     status:"Active",     dob:"1970-05-15", gender:"Female", blood:"O+", qual:"M.A., B.Ed", exp:22, join:"2003-06-01", photo:"👨‍🏫" },
  { id:"STF002", name:"Rajesh Kumar Singh",    emp_id:"EMP2016002", desig:"Vice Principal",  dept:"Administration", campus:"North Campus", phone:"+91 9876543211", email:"rajesh@school.edu",    status:"Active",     dob:"1975-08-22", gender:"Male",   blood:"B+", qual:"M.Sc., B.Ed", exp:18, join:"2008-07-15", photo:"👨‍🏫" },
  { id:"STF003", name:"Priya Sharma",          emp_id:"EMP2018003", desig:"HOD",             dept:"Science",        campus:"North Campus", phone:"+91 9876543212", email:"priya@school.edu",      status:"Active",     dob:"1980-03-10", gender:"Female", blood:"A+", qual:"M.Sc., B.Ed", exp:14, join:"2010-04-01", photo:"👩‍🏫" },
  { id:"STF004", name:"Arjun Verma",           emp_id:"EMP2017004", desig:"Senior Teacher",  dept:"Mathematics",    campus:"North Campus", phone:"+91 9876543213", email:"arjun@school.edu",      status:"Active",     dob:"1982-11-28", gender:"Male",   blood:"AB+", qual:"M.A., B.Ed", exp:12, join:"2012-06-15", photo:"👨‍🏫" },
  { id:"STF005", name:"Sunita Patel",          emp_id:"EMP2019005", desig:"Teacher",         dept:"Languages",      campus:"South Campus", phone:"+91 9876543214", email:"sunita@school.edu",     status:"On Leave",   dob:"1985-07-14", gender:"Female", blood:"O-", qual:"M.A., B.Ed", exp:8, join:"2016-08-20", photo:"👩‍🏫" },
  { id:"STF006", name:"Vikram Singh",          emp_id:"EMP2018006", desig:"Teacher",         dept:"Science",        campus:"North Campus", phone:"+91 9876543215", email:"vikram@school.edu",     status:"Active",     dob:"1988-09-05", gender:"Male",   blood:"B-", qual:"B.Sc., B.Ed", exp:6, join:"2018-09-01", photo:"👨‍🏫" },
  { id:"STF007", name:"Anjali Misra",          emp_id:"EMP2020007", desig:"Counselor",       dept:"Administration", campus:"East Wing",   phone:"+91 9876543216", email:"anjali@school.edu",      status:"Active",     dob:"1990-02-18", gender:"Female", blood:"A-", qual:"M.A., B.Ed", exp:4, join:"2020-03-15", photo:"👩‍🏫" },
  { id:"STF008", name:"Deepak Joshi",          emp_id:"EMP2017008", desig:"Admin Staff",     dept:"Administration", campus:"North Campus", phone:"+91 9876543217", email:"deepak@school.edu",      status:"Suspended",  dob:"1992-12-01", gender:"Male",   blood:"O+", qual:"12th Pass", exp:2, join:"2022-01-10", photo:"👨‍💼" },
];

const DEPARTMENTS = [
  { name:"Science",          hod:"Priya Sharma",        staff:8,  active:7 },
  { name:"Mathematics",      hod:"Arjun Verma",         staff:6,  active:6 },
  { name:"Languages",        hod:"Rajesh Kumar",        staff:5,  active:4 },
  { name:"Administration",   hod:"Dr. Meera Krishnan",  staff:12, active:11 },
  { name:"Transport",        hod:"—",                    staff:4,  active:3 },
  { name:"Hostel",           hod:"—",                    staff:3,  active:3 },
  { name:"Security",         hod:"—",                    staff:8,  active:8 },
  { name:"Maintenance",      hod:"—",                    staff:5,  active:5 },
];

// ─── Modal shell ──────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="sm-overlay" role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`sm-modal${wide ? " sm-modal--wide" : ""}`}>
      <div className="sm-modal__hd">
        <h2 className="sm-modal__title">{title}</h2>
        <button className="sm-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="sm-modal__body">{children}</div>
    </div>
  </div>
);

// ─── Form Primitives ──────────────────────────────────────────────────────────
const Field = ({ label, type = "text", name, value, onChange, required, hint }) => (
  <div className="sm-field">
    <label className="sm-field__label">{label}{required && <span className="sm-field__req">*</span>}</label>
    <input className="sm-field__input" type={type} name={name} value={value} onChange={onChange}
      placeholder={label} data-testid={`school-field-staff-${name}`} />
    {hint && <p className="sm-field__hint">{hint}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, options, required }) => (
  <div className="sm-field">
    <label className="sm-field__label">{label}{required && <span className="sm-field__req">*</span>}</label>
    <select className="sm-field__select" name={name} value={value} onChange={onChange} data-testid={`school-dropdown-staff-${name}`}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const ModalActions = ({ onClose, submitLabel, onSubmit }) => (
  <div className="sm-modal__footer">
    <button className="sm-btn sm-btn--ghost" onClick={onClose} data-testid="school-button-modal-cancel">Cancel</button>
    <button className="sm-btn sm-btn--primary" onClick={onSubmit} data-testid="school-button-modal-submit">{submitLabel}</button>
  </div>
);

// ─── Add Staff Modal ───────────────────────────────────────────────────────────
const AddStaffModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name:"", emp_id:"", gender:"", dob:"", blood:"", qual:"", exp:"", join:"",
    dept:"", desig:"", campus:"", branch:"",
    phone:"", email:"", address:"", emergency:"",
    photo:"",
  });
  const f = useCallback(e => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);

  return (
    <Modal title="Add New Staff Member" onClose={onClose} wide>
      <div className="sm-form-section">
        <p className="sm-form-section__title">Basic Information</p>
        <div className="sm-form-grid">
          <Field label="Full Name" name="name" value={form.name} onChange={f} required />
          <Field label="Employee ID" name="emp_id" value={form.emp_id} onChange={f} required />
          <Select label="Gender" name="gender" value={form.gender} onChange={f} options={["Male","Female","Other"]} required />
          <Field label="Date of Birth" type="date" name="dob" value={form.dob} onChange={f} required />
          <Select label="Blood Group" name="blood" value={form.blood} onChange={f} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} />
          <Field label="Qualification" name="qual" value={form.qual} onChange={f} required />
          <Field label="Experience (years)" type="number" name="exp" value={form.exp} onChange={f} />
          <Field label="Joining Date" type="date" name="join" value={form.join} onChange={f} required />
        </div>
      </div>

      <div className="sm-form-section">
        <p className="sm-form-section__title">Professional Information</p>
        <div className="sm-form-grid">
          <Select label="Department" name="dept" value={form.dept} onChange={f} options={["Science","Mathematics","Languages","Administration","Transport","Hostel","Security","Maintenance"]} required />
          <Select label="Designation" name="desig" value={form.desig} onChange={f} options={["Principal","Vice Principal","HOD","Senior Teacher","Teacher","Counselor","Admin Staff"]} required />
          <Select label="Campus" name="campus" value={form.campus} onChange={f} options={["North Campus","South Campus","East Wing"]} required />
          <Field label="Branch/Building" name="branch" value={form.branch} onChange={f} />
        </div>
      </div>

      <div className="sm-form-section">
        <p className="sm-form-section__title">Contact Information</p>
        <div className="sm-form-grid">
          <Field label="Phone" type="tel" name="phone" value={form.phone} onChange={f} required />
          <Field label="Email" type="email" name="email" value={form.email} onChange={f} required />
          <div className="sm-form-grid--full">
            <Field label="Address" name="address" value={form.address} onChange={f} />
          </div>
          <Field label="Emergency Contact" name="emergency" value={form.emergency} onChange={f} />
        </div>
      </div>

      <div className="sm-form-section">
        <p className="sm-form-section__title">Documents</p>
        <div className="sm-form-grid">
          <Field label="Profile Photo" type="file" name="photo" onChange={f} />
        </div>
      </div>

      <ModalActions onClose={onClose} submitLabel="Add Staff" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Staff Profile Modal ──────────────────────────────────────────────────────
const StaffProfileModal = ({ staff, onClose }) => {
  if (!staff) return null;

  return (
    <Modal title={`${staff.name} — Profile`} onClose={onClose} wide>
      <div className="sm-profile">
        <div className="sm-profile__hd">
          <div className="sm-profile__photo">{staff.photo}</div>
          <div className="sm-profile__info">
            <h3 className="sm-profile__name">{staff.name}</h3>
            <p className="sm-profile__meta">{staff.desig} · {staff.dept}</p>
            <div className="sm-profile__badges">
              <span className={`sm-badge sm-badge--${staff.status === "Active" ? "success" : staff.status === "On Leave" ? "info" : "danger"}`}>{staff.status}</span>
              <span className="sm-badge sm-badge--info">{staff.emp_id}</span>
            </div>
          </div>
        </div>

        <div className="sm-profile-grid">
          <section className="sm-profile-section">
            <h4 className="sm-profile-section__title">Basic Information</h4>
            <div className="sm-profile-rows">
              <div className="sm-profile-row"><span>Name</span><span>{staff.name}</span></div>
              <div className="sm-profile-row"><span>Employee ID</span><span>{staff.emp_id}</span></div>
              <div className="sm-profile-row"><span>Date of Birth</span><span>{staff.dob}</span></div>
              <div className="sm-profile-row"><span>Gender</span><span>{staff.gender}</span></div>
              <div className="sm-profile-row"><span>Blood Group</span><span>{staff.blood}</span></div>
            </div>
          </section>

          <section className="sm-profile-section">
            <h4 className="sm-profile-section__title">Professional Details</h4>
            <div className="sm-profile-rows">
              <div className="sm-profile-row"><span>Department</span><span>{staff.dept}</span></div>
              <div className="sm-profile-row"><span>Designation</span><span>{staff.desig}</span></div>
              <div className="sm-profile-row"><span>Campus</span><span>{staff.campus}</span></div>
              <div className="sm-profile-row"><span>Qualification</span><span>{staff.qual}</span></div>
              <div className="sm-profile-row"><span>Experience</span><span>{staff.exp} years</span></div>
              <div className="sm-profile-row"><span>Joining Date</span><span>{staff.join}</span></div>
            </div>
          </section>

          <section className="sm-profile-section">
            <h4 className="sm-profile-section__title">Contact Details</h4>
            <div className="sm-profile-rows">
              <div className="sm-profile-row"><span>Phone</span><span>{staff.phone}</span></div>
              <div className="sm-profile-row"><span>Email</span><span>{staff.email}</span></div>
            </div>
          </section>

          <section className="sm-profile-section">
            <h4 className="sm-profile-section__title">Attendance Summary</h4>
            <div className="sm-profile-rows">
              <div className="sm-profile-row"><span>Attendance %</span><span style={{color:GREEN, fontWeight:"600"}}>96.4%</span></div>
              <div className="sm-profile-row"><span>Late Arrivals</span><span>2</span></div>
              <div className="sm-profile-row"><span>Absent Days</span><span>1</span></div>
            </div>
          </section>
        </div>

        <div className="sm-profile-actions">
          <button className="sm-btn sm-btn--primary" data-testid="school-button-staff-edit">✏️ Edit Details</button>
          <button className="sm-btn sm-btn--ghost" data-testid="school-button-staff-transfer">↔️ Transfer</button>
          <button className="sm-btn sm-btn--ghost" data-testid="school-button-staff-deactivate">🔒 Deactivate</button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children, badge }) => (
  <section className="sm-section">
    <div className="sm-section__hd">
      <h2 className="sm-section__title">{title}</h2>
      {badge && <span className="sm-section__badge">{badge}</span>}
    </div>
    {children}
  </section>
);

// ─── Toolbar ──────────────────────────────────────────────────────────────────
const Toolbar = ({ filters, onChange, onClear, hasFilters }) => (
  <div className="sm-toolbar" data-testid="school-toolbar-staff-management">
    <div className="sm-toolbar__search-wrap">
      <span className="sm-toolbar__search-icon">🔍</span>
      <input className="sm-toolbar__search" placeholder="Search staff by name, ID, email…"
        value={filters.q} onChange={e => onChange("q", e.target.value)} data-testid="school-field-staff-search" />
    </div>
    <select className="sm-toolbar__sel" value={filters.dept} onChange={e => onChange("dept", e.target.value)} data-testid="school-dropdown-staff-dept">
      {DEPT_OPTIONS.map(o => <option key={o}>{o}</option>)}
    </select>
    <select className="sm-toolbar__sel" value={filters.desig} onChange={e => onChange("desig", e.target.value)} data-testid="school-dropdown-staff-desig">
      {DESIG_OPTIONS.map(o => <option key={o}>{o}</option>)}
    </select>
    <select className="sm-toolbar__sel" value={filters.campus} onChange={e => onChange("campus", e.target.value)} data-testid="school-dropdown-staff-campus">
      {CAMPUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
    </select>
    <select className="sm-toolbar__sel" value={filters.status} onChange={e => onChange("status", e.target.value)} data-testid="school-dropdown-staff-status">
      {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
    </select>
    {hasFilters && (
      <button className="sm-toolbar__clear" onClick={onClear} data-testid="school-button-staff-clear-filters">✕ Clear</button>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: STAFF DIRECTORY
// ══════════════════════════════════════════════════════════════════════════════
const DirectoryTab = ({ filters, onSelectStaff }) => {
  const filtered = STAFF_DATA.filter(s => {
    if (filters.q && !s.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    if (filters.dept !== "All Departments" && s.dept !== filters.dept) return false;
    if (filters.desig !== "All Designations" && s.desig !== filters.desig) return false;
    if (filters.campus !== "All Campuses" && s.campus !== filters.campus) return false;
    if (filters.status !== "All Status" && s.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="sm-tab-body">
      <Section title="Staff Members" badge={`${filtered.length} total`}>
        <div className="sm-staff-grid">
          {filtered.map(s => (
            <div key={s.id} className={`sm-staff-card sm-staff-card--${s.status === "Active" ? "active" : s.status === "On Leave" ? "leave" : "suspended"}`}
              data-testid={`school-card-staff-${s.id}`}>
              <div className="sm-staff-card__photo">{s.photo}</div>
              <div className="sm-staff-card__info">
                <h4 className="sm-staff-card__name">{s.name}</h4>
                <p className="sm-staff-card__meta">{s.desig}</p>
                <p className="sm-staff-card__dept">{s.dept}</p>
                <div className="sm-staff-card__contact">
                  <span title={s.phone}>📞</span>
                  <span title={s.email}>✉️</span>
                  <span className={`sm-badge sm-badge--${s.status === "Active" ? "success" : s.status === "On Leave" ? "info" : "danger"}`}>{s.status}</span>

                </div>
              </div>
              <button className="sm-staff-card__action" onClick={() => onSelectStaff(s)} data-testid={`school-button-staff-view-${s.id}`}>View</button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: ALLOCATIONS & WORKLOAD
// ══════════════════════════════════════════════════════════════════════════════
const AllocationsTab = () => {
  const allocations = [
    { id:1, name:"Priya Sharma",        dept:"Science",    classes:["10-A","10-B","11-A"], subjects:["Physics","Chemistry"], periods:24, workload:92 },
    { id:2, name:"Arjun Verma",        dept:"Mathematics",classes:["9-A","9-B","10-A"],   subjects:["Mathematics"],        periods:22, workload:88 },
    { id:3, name:"Vikram Singh",       dept:"Science",    classes:["8-A","8-B"],         subjects:["Biology"],            periods:18, workload:72 },
    { id:4, name:"Rajesh Kumar Singh", dept:"Languages",  classes:["6-A","7-A"],         subjects:["English","Hindi"],    periods:16, workload:64 },
  ];

  return (
    <div className="sm-tab-body">
      <Section title="Class Teacher & Subject Allocations">
        <div className="sm-alloc-list">
          {allocations.map(a => (
            <div key={a.id} className="sm-alloc-card" data-testid={`school-card-allocation-${a.id}`}>
              <div className="sm-alloc-card__hd">
                <h4>{a.name}</h4>
                <span className="sm-badge">{a.dept}</span>
              </div>
              <div className="sm-alloc-card__body">
                <div><strong>Classes:</strong> {a.classes.join(", ")}</div>
                <div><strong>Subjects:</strong> {a.subjects.join(", ")}</div>
                <div style={{marginTop:".5rem"}}>
                  <div className="sm-workload">
                    <span>Workload: {a.periods} periods/week</span>
                    <div className="sm-workload__bar">
                      <div className="sm-workload__fill" style={{width:`${a.workload}%`, background:a.workload>85?RED:a.workload>70?AMBER:GREEN}} />
                    </div>
                    <span style={{color:a.workload>85?RED:a.workload>70?AMBER:GREEN, fontWeight:"600"}}>{a.workload}%</span>
                  </div>
                </div>
              </div>
              <div className="sm-alloc-card__actions">
                <button className="sm-btn sm-btn--sm sm-btn--ghost" data-testid={`school-button-alloc-edit-${a.id}`}>Edit</button>
                <button className="sm-btn sm-btn--sm sm-btn--ghost" data-testid={`school-button-alloc-remove-${a.id}`}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: DEPARTMENTS & HIERARCHY
// ══════════════════════════════════════════════════════════════════════════════
const DepartmentsTab = ({ onSelectDept }) => {
  return (
    <div className="sm-tab-body">
      <Section title="Departments" badge={`${DEPARTMENTS.length} departments`}>
        <div className="sm-dept-grid">
          {DEPARTMENTS.map((d, i) => (
            <div key={i} className="sm-dept-card" onClick={() => onSelectDept(d)} data-testid={`school-card-dept-${d.name}`}>
              <div className="sm-dept-card__icon">🏢</div>
              <h4 className="sm-dept-card__name" style={{color:'#fff'}}>{d.name}</h4>
              <p className="sm-dept-card__meta">
                <strong>{d.active}</strong> active · <strong>{d.staff}</strong> total
              </p>
              <p className="sm-dept-card__hod">HOD: {d.hod}</p>
              <button className="sm-dept-card__action" data-testid={`school-button-dept-view-${d.name}`}>View Team</button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: PERFORMANCE & APPRAISAL
// ══════════════════════════════════════════════════════════════════════════════
const PerformanceTab = () => {
  const ratings = [
    { name:"Priya Sharma",        rating:4.8, achievements:["Excellent teaching","Research publication","Student feedback 4.9/5"], remarks:"Outstanding performer" },
    { name:"Arjun Verma",         rating:4.5, achievements:["Improved student scores","Curriculum design"], remarks:"Good performance" },
    { name:"Vikram Singh",        rating:4.2, achievements:["Active in events","Student mentorship"], remarks:"Satisfactory" },
    { name:"Rajesh Kumar Singh",  rating:3.8, achievements:["Staff coordination","Event management"], remarks:"Needs improvement in teaching innovation" },
  ];

  return (
    <div className="sm-tab-body">
      <Section title="Performance Ratings">
        <div className="sm-perf-list">
          {ratings.map((r, i) => (
            <div key={i} className="sm-perf-card" data-testid={`school-card-performance-${i}`}>
              <div className="sm-perf-card__hd">
                <h4>{r.name}</h4>
                <div className="sm-perf-rating" style={{color:r.rating>4?GREEN:r.rating>3?AMBER:RED}}>
                  ⭐ {r.rating}/5
                </div>
              </div>
              <div className="sm-perf-card__body">
                <p><strong>Achievements:</strong></p>
                <ul style={{fontSize:".8rem", color:"var(--sm-muted)", marginLeft:"1rem"}}>
                  {r.achievements.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
                <p style={{marginTop:".5rem"}}><strong>Remarks:</strong> {r.remarks}</p>
              </div>
              <div className="sm-perf-card__actions">
                <button className="sm-btn sm-btn--sm sm-btn--ghost" data-testid={`school-button-perf-add-${i}`}>+ Remark</button>
                <button className="sm-btn sm-btn--sm sm-btn--ghost" data-testid={`school-button-perf-edit-${i}`}>Update</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  TAB: STAFF OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════
const OperationsTab = () => {
  const operations = [
    { icon:"↔️", title:"Staff Transfer",        body:"Transfer staff across campuses or departments", action:"Initiate" },
    { icon:"📈", title:"Promotion Updates",     body:"Record staff promotions and salary increments", action:"Update" },
    { icon:"📋", title:"Contract Renewal",      body:"Manage contract renewals and extensions",    action:"Manage" },
    { icon:"⏰", title:"Document Expiry Alerts",body:"Track certification, license, visa expiry",  action:"View" },
    { icon:"📢", title:"Staff Communication",   body:"Send notices, circulars, announcements",     action:"Send" },
  ];

  return (
    <div className="sm-tab-body">
      <Section title="Staff Operations">
        <div className="sm-ops-grid">
          {operations.map((op, i) => (
            <div key={i} className="sm-ops-card" data-testid={`school-card-operation-${i}`}>
              <div className="sm-ops-card__icon">{op.icon}</div>
              <h4 className="sm-ops-card__title">{op.title}</h4>
              <p className="sm-ops-card__body">{op.body}</p>
              <button className="sm-btn sm-btn--sm sm-btn--primary" data-testid={`school-button-op-${i}`}>{op.action}</button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const TAB_COMPONENTS = {
  directory:   DirectoryTab,
  allocations: AllocationsTab,
  departments: DepartmentsTab,
  performance: PerformanceTab,
  operations:  OperationsTab,
};

const INIT_FILTERS = { q:"", dept:"All Departments", desig:"All Designations", campus:"All Campuses", status:"All Status" };

/**
 * StaffManagement — centralized staff operations dashboard.
 */
export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState("directory");
  const [filters, setFilters] = useState(INIT_FILTERS);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  const handleFilter = useCallback((key, val) => setFilters(p => ({ ...p, [key]: val })), []);
  const clearFilters = useCallback(() => setFilters(INIT_FILTERS), []);
  const hasFilters = Object.values(filters).some(v => v && !["All Departments", "All Designations", "All Campuses", "All Status"].includes(v));

  const ActiveTab = useMemo(() => TAB_COMPONENTS[activeTab] || DirectoryTab, [activeTab]);

  return (
    <div className="sm-root" data-testid="school-page-staff-management">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Staff Management" },
        ]}
        title="Staff Management"
        subtitle="Centralized workforce operations and administration"
        actions={(
          <>
            <button className="sm-btn sm-btn--ghost" data-testid="school-button-staff-export">📤 Export</button>
            <button className="sm-btn sm-btn--primary" onClick={() => setOpenModal("add-staff")} data-testid="school-button-staff-add">➕ Add Staff</button>
          </>
        )}
      />

      {/* Toolbar */}
      <Toolbar filters={filters} onChange={handleFilter} onClear={clearFilters} hasFilters={hasFilters} />

      {/* Tabs */}
      <div className="sm-tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`sm-tab${activeTab === t.id ? " sm-tab--active" : ""}`}
            onClick={() => setActiveTab(t.id)}
            data-testid={`school-tab-staff-${t.id}`}
          >
            <span className="sm-tab__icon">{t.icon}</span>
            <span className="sm-tab__label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <ActiveTab filters={filters} onSelectStaff={setSelectedStaff} onSelectDept={() => {}} />

      {/* Modals */}
      {selectedStaff && <StaffProfileModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
      {openModal === "add-staff" && <AddStaffModal onClose={() => setOpenModal(null)} />}
    </div>
  );
}