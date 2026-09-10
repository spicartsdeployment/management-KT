/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/Subjects.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_TEACHERS = [
  { id: "T001", name: "Mr. Arun Patel",     dept: "Mathematics",  specialization: "Algebra & Calculus",   exp: 12, workload: 24, initials: "AP" },
  { id: "T002", name: "Mrs. Priya Menon",   dept: "Science",      specialization: "Physics & Chemistry",  exp: 8,  workload: 20, initials: "PM" },
  { id: "T003", name: "Ms. Rekha Sharma",   dept: "Languages",    specialization: "English Literature",   exp: 10, workload: 22, initials: "RS" },
  { id: "T004", name: "Mr. Vijay Kumar",    dept: "Languages",    specialization: "Hindi Grammar",        exp: 7,  workload: 18, initials: "VK" },
  { id: "T005", name: "Dr. Suresh Iyer",    dept: "Science",      specialization: "Physics",              exp: 15, workload: 16, initials: "SI" },
  { id: "T006", name: "Mrs. Deepa Rao",     dept: "Science",      specialization: "Chemistry",            exp: 9,  workload: 20, initials: "DR" },
  { id: "T007", name: "Mr. Karthik Nair",   dept: "IT",           specialization: "Computer Science",     exp: 6,  workload: 18, initials: "KN" },
  { id: "T008", name: "Ms. Anjali Singh",   dept: "Physical Ed.", specialization: "Sports & Fitness",     exp: 5,  workload: 15, initials: "AS" },
];

const SUBJECT_TYPES = ["core", "elective", "language", "lab", "co-curricular"];
const ALL_CLASS_LABELS = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10"];

const MOCK_SUBJECTS = [
  {
    id: "SUB001", name: "Mathematics", code: "MATH", type: "core",
    credits: 6, theoryPeriods: 5, practicalPeriods: 0, hasPractical: false,
    description: "Covers arithmetic, algebra, geometry, statistics and calculus for different class levels.",
    syllabusStatus: "in-progress",
    allocations: [
      { id: "A001", classLabel: "Class 8",  section: "A", teacherId: "T001", substituteId: null,   labInstructorId: null,  periodsWeek: 5, syllabusProgress: 80 },
      { id: "A002", classLabel: "Class 9",  section: "A", teacherId: "T001", substituteId: null,   labInstructorId: null,  periodsWeek: 5, syllabusProgress: 72 },
      { id: "A003", classLabel: "Class 9",  section: "B", teacherId: "T001", substituteId: null,   labInstructorId: null,  periodsWeek: 5, syllabusProgress: 68 },
      { id: "A004", classLabel: "Class 10", section: "A", teacherId: "T001", substituteId: null,   labInstructorId: null,  periodsWeek: 6, syllabusProgress: 55 },
      { id: "A005", classLabel: "Class 10", section: "B", teacherId: "T001", substituteId: null,   labInstructorId: null,  periodsWeek: 6, syllabusProgress: 50 },
    ],
  },
  {
    id: "SUB002", name: "Science", code: "SCI", type: "core",
    credits: 5, theoryPeriods: 4, practicalPeriods: 2, hasPractical: true,
    description: "Integrated science covering Physics, Chemistry and Biology concepts.",
    syllabusStatus: "completed",
    allocations: [
      { id: "A006", classLabel: "Class 6", section: "A", teacherId: "T002", substituteId: null, labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 100 },
      { id: "A007", classLabel: "Class 6", section: "B", teacherId: "T002", substituteId: null, labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 100 },
      { id: "A008", classLabel: "Class 7", section: "A", teacherId: "T002", substituteId: null, labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 96  },
    ],
  },
  {
    id: "SUB003", name: "English", code: "ENG", type: "language",
    credits: 4, theoryPeriods: 5, practicalPeriods: 0, hasPractical: false,
    description: "English language and literature. Grammar, comprehension, creative writing and poetry.",
    syllabusStatus: "in-progress",
    allocations: [
      { id: "A009", classLabel: "Class 8", section: "A", teacherId: "T003", substituteId: null, labInstructorId: null, periodsWeek: 5, syllabusProgress: 65 },
      { id: "A010", classLabel: "Class 8", section: "B", teacherId: "T003", substituteId: null, labInstructorId: null, periodsWeek: 5, syllabusProgress: 62 },
      { id: "A011", classLabel: "Class 9", section: "A", teacherId: "T003", substituteId: null, labInstructorId: null, periodsWeek: 5, syllabusProgress: 58 },
    ],
  },
  {
    id: "SUB004", name: "Hindi", code: "HIN", type: "language",
    credits: 4, theoryPeriods: 4, practicalPeriods: 0, hasPractical: false,
    description: "Hindi language with grammar, literature, poetry and prose across junior classes.",
    syllabusStatus: "pending",
    allocations: [
      { id: "A012", classLabel: "Class 7", section: "A", teacherId: "T004", substituteId: null, labInstructorId: null, periodsWeek: 4, syllabusProgress: 30 },
      { id: "A013", classLabel: "Class 7", section: "B", teacherId: "T004", substituteId: null, labInstructorId: null, periodsWeek: 4, syllabusProgress: 25 },
    ],
  },
  {
    id: "SUB005", name: "Physics", code: "PHY", type: "core",
    credits: 6, theoryPeriods: 4, practicalPeriods: 2, hasPractical: true,
    description: "Advanced Physics covering mechanics, electricity, magnetism, waves and modern physics.",
    syllabusStatus: "in-progress",
    allocations: [
      { id: "A014", classLabel: "Class 11", section: "A", teacherId: "T005", substituteId: "T002", labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 45 },
      { id: "A015", classLabel: "Class 12", section: "A", teacherId: "T005", substituteId: "T002", labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 38 },
    ],
  },
  {
    id: "SUB006", name: "Chemistry", code: "CHEM", type: "lab",
    credits: 5, theoryPeriods: 3, practicalPeriods: 3, hasPractical: true,
    description: "Chemistry with a heavy lab component. Organic, inorganic and physical chemistry.",
    syllabusStatus: "in-progress",
    allocations: [
      { id: "A016", classLabel: "Class 11", section: "A", teacherId: "T006", substituteId: null, labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 50 },
      { id: "A017", classLabel: "Class 12", section: "A", teacherId: "T006", substituteId: null, labInstructorId: "T006", periodsWeek: 6, syllabusProgress: 40 },
    ],
  },
  {
    id: "SUB007", name: "Computer Science", code: "CS", type: "elective",
    credits: 4, theoryPeriods: 3, practicalPeriods: 2, hasPractical: true,
    description: "Programming, data structures, algorithms, databases and networking fundamentals.",
    syllabusStatus: "completed",
    allocations: [
      { id: "A018", classLabel: "Class 10", section: "A", teacherId: "T007", substituteId: null, labInstructorId: "T007", periodsWeek: 5, syllabusProgress: 100 },
      { id: "A019", classLabel: "Class 9",  section: "A", teacherId: "T007", substituteId: null, labInstructorId: "T007", periodsWeek: 5, syllabusProgress: 95  },
    ],
  },
  {
    id: "SUB008", name: "Physical Education", code: "PE", type: "co-curricular",
    credits: 2, theoryPeriods: 1, practicalPeriods: 3, hasPractical: true,
    description: "Sports, fitness, yoga, team games and health education for all classes.",
    syllabusStatus: "not-started",
    allocations: [
      { id: "A020", classLabel: "Class 5", section: "A", teacherId: "T008", substituteId: null, labInstructorId: null, periodsWeek: 4, syllabusProgress: 0 },
      { id: "A021", classLabel: "Class 6", section: "A", teacherId: "T008", substituteId: null, labInstructorId: null, periodsWeek: 4, syllabusProgress: 0 },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const TYPE_META = {
  "core":           { label: "Core",          cls: "core",     color: "#2563eb" },
  "elective":       { label: "Elective",      cls: "elective", color: "#7c3aed" },
  "language":       { label: "Language",      cls: "language", color: "#059669" },
  "lab":            { label: "Lab",           cls: "lab",      color: "#d97706" },
  "co-curricular":  { label: "Co-Curricular", cls: "co",       color: "#db2777" },
};

const SYLLABUS_META = {
  "completed":   { label: "Completed",   cls: "completed"  },
  "in-progress": { label: "In Progress", cls: "progress"   },
  "pending":     { label: "Pending",     cls: "pending"    },
  "not-started": { label: "Not Started", cls: "not-started"},
};

const getTeacher = (id) => MOCK_TEACHERS.find((t) => t.id === id) || null;

const progressColor = (pct) =>
  pct >= 80 ? "#16a34a" : pct >= 50 ? "#d97706" : pct > 0 ? "#2563eb" : "#9ca3af";

const computeMetrics = (subjects) => {
  const allAllocs  = subjects.flatMap((s) => s.allocations);
  const teacherSet = new Set(allAllocs.flatMap((a) =>
    [a.teacherId, a.substituteId, a.labInstructorId].filter(Boolean)
  ));
  return {
    total:      subjects.length,
    totalAlloc: allAllocs.length,
    teachers:   teacherSet.size,
    completed:  subjects.filter((s) => s.syllabusStatus === "completed").length,
    practical:  subjects.filter((s) => s.hasPractical).length,
  };
};

// ─── Atoms ────────────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  const m = TYPE_META[type] || TYPE_META.core;
  return <span className={`su-badge su-badge--${m.cls}`}>{m.label}</span>;
}

function SyllabusBadge({ status }) {
  const m = SYLLABUS_META[status] || SYLLABUS_META["not-started"];
  return <span className={`su-badge su-badge--syl su-badge--syl-${m.cls}`}>{m.label}</span>;
}

function ProgressBar({ pct }) {
  return (
    <div className="su-progress">
      <div className="su-progress__fill" style={{ width: `${pct}%`, background: progressColor(pct) }} />
    </div>
  );
}

function MetricCard({ icon, value, label, variant, testId }) {
  return (
    <div className={`su-metric-card su-metric-card--${variant}`} data-testid={testId}>
      <div className="su-metric-card__icon">{icon}</div>
      <div className="su-metric-card__body">
        <div className="su-metric-card__value">{value}</div>
        <div className="su-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

function TeacherChip({ teacherId, role }) {
  const t = getTeacher(teacherId);
  if (!t) return null;
  return (
    <div className="su-teacher-chip" title={`${t.name} · ${role}`}>
      <div className="su-teacher-chip__avatar">{t.initials}</div>
      <div className="su-teacher-chip__info">
        <span className="su-teacher-chip__name">{t.name.split(" ").slice(-1)[0]}</span>
        <span className="su-teacher-chip__role">{role}</span>
      </div>
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ subject, onBack }) {
  return (
    <div className="su-breadcrumb" data-testid="school-breadcrumb-subjects">
      <button
        className="su-breadcrumb__item su-breadcrumb__item--link"
        onClick={onBack}
        data-testid="school-button-su-back"
      >
        Subjects
      </button>
      <span className="su-breadcrumb__sep">›</span>
      <span className="su-breadcrumb__item su-breadcrumb__item--active">{subject.name}</span>
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
      className="su-modal-overlay"
      role="dialog"
      aria-modal="true"
      data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`su-modal${wide ? " su-modal--wide" : ""}`}>
        <div className="su-modal__header">
          <h3 className="su-modal__title">{title}</h3>
          <button
            className="su-modal__close"
            onClick={onClose}
            data-testid="school-button-su-modal-close"
            aria-label="Close"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Subject Form Modal ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", code: "", type: "core", credits: "", theoryPeriods: "",
  practicalPeriods: "", hasPractical: false, description: "", syllabusStatus: "not-started",
};

function SubjectFormModal({ subject, onClose, onSave }) {
  const isEdit = Boolean(subject);
  const [form, setForm] = useState(
    isEdit
      ? {
          name: subject.name, code: subject.code, type: subject.type,
          credits: String(subject.credits), theoryPeriods: String(subject.theoryPeriods),
          practicalPeriods: String(subject.practicalPeriods), hasPractical: subject.hasPractical,
          description: subject.description, syllabusStatus: subject.syllabusStatus,
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
    if (!form.name.trim())    e.name    = "Subject name is required";
    if (!form.code.trim())    e.code    = "Subject code is required";
    if (!form.credits || isNaN(Number(form.credits)))           e.credits      = "Valid credits required";
    if (!form.theoryPeriods || isNaN(Number(form.theoryPeriods))) e.theoryPeriods = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <Modal
      title={isEdit ? `Edit Subject — ${subject.name}` : "Add New Subject"}
      onClose={onClose}
      wide
      testId="school-modal-su-form"
    >
      <div className="su-modal__body su-modal__body--scroll">
        <div className="su-form-grid">
          <div className="su-form-group su-form-group--full">
            <label className="su-form-label">Subject Name *</label>
            <input
              className={`su-form-input${errors.name ? " su-form-input--error" : ""}`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Mathematics"
              data-testid="school-input-su-name"
            />
            {errors.name && <span className="su-form-error">{errors.name}</span>}
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Subject Code *</label>
            <input
              className={`su-form-input${errors.code ? " su-form-input--error" : ""}`}
              value={form.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="e.g. MATH"
              maxLength={8}
              data-testid="school-input-su-code"
            />
            {errors.code && <span className="su-form-error">{errors.code}</span>}
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Subject Type</label>
            <select
              className="su-form-select"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              data-testid="school-dropdown-su-type"
            >
              <option value="core">Core</option>
              <option value="elective">Elective</option>
              <option value="language">Language</option>
              <option value="lab">Lab</option>
              <option value="co-curricular">Co-Curricular</option>
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Credits *</label>
            <input
              type="number" min={1} max={10}
              className={`su-form-input${errors.credits ? " su-form-input--error" : ""}`}
              value={form.credits}
              onChange={(e) => set("credits", e.target.value)}
              placeholder="e.g. 6"
              data-testid="school-input-su-credits"
            />
            {errors.credits && <span className="su-form-error">{errors.credits}</span>}
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Theory Periods / Week *</label>
            <input
              type="number" min={0} max={12}
              className={`su-form-input${errors.theoryPeriods ? " su-form-input--error" : ""}`}
              value={form.theoryPeriods}
              onChange={(e) => set("theoryPeriods", e.target.value)}
              placeholder="e.g. 5"
              data-testid="school-input-su-theory"
            />
            {errors.theoryPeriods && <span className="su-form-error">{errors.theoryPeriods}</span>}
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Practical Periods / Week</label>
            <input
              type="number" min={0} max={12}
              className="su-form-input"
              value={form.practicalPeriods}
              onChange={(e) => set("practicalPeriods", e.target.value)}
              placeholder="e.g. 2"
              data-testid="school-input-su-practical"
            />
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Syllabus Status</label>
            <select
              className="su-form-select"
              value={form.syllabusStatus}
              onChange={(e) => set("syllabusStatus", e.target.value)}
              data-testid="school-dropdown-su-syllabus"
            >
              <option value="not-started">Not Started</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="su-form-group su-form-group--check">
            <label className="su-form-check">
              <input
                type="checkbox"
                checked={form.hasPractical}
                onChange={(e) => set("hasPractical", e.target.checked)}
                data-testid="school-checkbox-su-practical"
              />
              <span>Has Practical Component</span>
            </label>
          </div>
          <div className="su-form-group su-form-group--full">
            <label className="su-form-label">Description</label>
            <textarea
              className="su-form-textarea"
              value={form.description}
              rows={3}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of the subject…"
              data-testid="school-textarea-su-desc"
            />
          </div>
        </div>
      </div>
      <div className="su-modal__footer">
        <button className="su-btn su-btn--ghost" onClick={onClose} data-testid="school-button-su-form-cancel">
          Cancel
        </button>
        <button className="su-btn su-btn--primary" onClick={handleSave} data-testid="school-button-su-form-save">
          {isEdit ? "Save Changes" : "Add Subject"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Assign Teacher Modal ─────────────────────────────────────────────────────
function AssignTeacherModal({ allocation, subject, onClose, onSave }) {
  const [primaryId,   setPrimary] = useState(allocation?.teacherId       || "");
  const [subId,       setSub]     = useState(allocation?.substituteId    || "");
  const [labId,       setLab]     = useState(allocation?.labInstructorId || "");
  const [periodsWeek, setPeriods] = useState(String(allocation?.periodsWeek || 5));

  return (
    <Modal
      title={`Teacher Assignment — ${subject.name} · ${allocation?.classLabel} Sec ${allocation?.section}`}
      onClose={onClose}
      testId="school-modal-su-assign"
    >
      <div className="su-modal__body">
        <div className="su-form-grid">
          <div className="su-form-group su-form-group--full">
            <label className="su-form-label">Primary Teacher</label>
            <select
              className="su-form-select"
              value={primaryId}
              onChange={(e) => setPrimary(e.target.value)}
              data-testid="school-dropdown-su-primary-teacher"
            >
              <option value="">— Select Teacher —</option>
              {MOCK_TEACHERS.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.dept})</option>
              ))}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Substitute Teacher</label>
            <select
              className="su-form-select"
              value={subId}
              onChange={(e) => setSub(e.target.value)}
              data-testid="school-dropdown-su-sub-teacher"
            >
              <option value="">— None —</option>
              {MOCK_TEACHERS.filter((t) => t.id !== primaryId).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Lab Instructor</label>
            <select
              className="su-form-select"
              value={labId}
              onChange={(e) => setLab(e.target.value)}
              data-testid="school-dropdown-su-lab-instructor"
            >
              <option value="">— None —</option>
              {MOCK_TEACHERS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Periods / Week</label>
            <input
              type="number" min={1} max={12}
              className="su-form-input"
              value={periodsWeek}
              onChange={(e) => setPeriods(e.target.value)}
              data-testid="school-input-su-assign-periods"
            />
          </div>
        </div>
      </div>
      <div className="su-modal__footer">
        <button className="su-btn su-btn--ghost" onClick={onClose} data-testid="school-button-su-assign-cancel">
          Cancel
        </button>
        <button
          className="su-btn su-btn--primary"
          onClick={() => onSave({ primaryId, subId, labId, periodsWeek: Number(periodsWeek) })}
          data-testid="school-button-su-assign-save"
        >
          Save Assignment
        </button>
      </div>
    </Modal>
  );
}

// ─── Add Allocation Modal ─────────────────────────────────────────────────────
function AddAllocationModal({ subject, onClose, onSave }) {
  const [classLabel, setClassLabel] = useState("");
  const [section,    setSection]    = useState("A");
  const [teacherId,  setTeacherId]  = useState("");
  const [periodsWeek,setPeriods]    = useState("5");
  const [error,      setError]      = useState("");

  const handleSave = () => {
    if (!classLabel || !teacherId) { setError("Please select a class and a teacher."); return; }
    onSave({ classLabel, section, teacherId, periodsWeek: Number(periodsWeek), substituteId: null, labInstructorId: null, syllabusProgress: 0 });
  };

  return (
    <Modal title={`Add Allocation — ${subject.name}`} onClose={onClose} testId="school-modal-su-add-alloc">
      <div className="su-modal__body">
        {error && <p className="su-form-error su-u-mb8">{error}</p>}
        <div className="su-form-grid">
          <div className="su-form-group">
            <label className="su-form-label">Class *</label>
            <select
              className="su-form-select"
              value={classLabel}
              onChange={(e) => setClassLabel(e.target.value)}
              data-testid="school-dropdown-su-alloc-class"
            >
              <option value="">— Select Class —</option>
              {ALL_CLASS_LABELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Section</label>
            <select
              className="su-form-select"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              data-testid="school-dropdown-su-alloc-section"
            >
              {["A","B","C","D"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Teacher *</label>
            <select
              className="su-form-select"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              data-testid="school-dropdown-su-alloc-teacher"
            >
              <option value="">— Select Teacher —</option>
              {MOCK_TEACHERS.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.dept})</option>)}
            </select>
          </div>
          <div className="su-form-group">
            <label className="su-form-label">Periods / Week</label>
            <input
              type="number" min={1} max={12}
              className="su-form-input"
              value={periodsWeek}
              onChange={(e) => setPeriods(e.target.value)}
              data-testid="school-input-su-alloc-periods"
            />
          </div>
        </div>
      </div>
      <div className="su-modal__footer">
        <button className="su-btn su-btn--ghost" onClick={onClose} data-testid="school-button-su-alloc-cancel">Cancel</button>
        <button className="su-btn su-btn--primary" onClick={handleSave} data-testid="school-button-su-alloc-save">Add Allocation</button>
      </div>
    </Modal>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({ subject, onView, onEdit }) {
  const tm = TYPE_META[subject.type] || TYPE_META.core;
  const uniqueClasses  = [...new Set(subject.allocations.map((a) => a.classLabel))];
  const uniqueTeachers = [...new Set(subject.allocations.map((a) => a.teacherId))];
  const avgProgress    = subject.allocations.length
    ? Math.round(subject.allocations.reduce((s, a) => s + a.syllabusProgress, 0) / subject.allocations.length)
    : 0;

  return (
    <div
      className="su-card"
      style={{ "--su-type-color": tm.color }}
      data-testid={`school-card-su-${subject.id}`}
    >
      <div className="su-card__top">
        <div className="su-card__icon-wrap">
          <div className="su-card__icon" style={{ background: `${tm.color}18`, color: tm.color }}>
            {subject.code.charAt(0)}
          </div>
        </div>
        <div className="su-card__badges">
          <TypeBadge type={subject.type} />
          {subject.hasPractical && <span className="su-badge su-badge--practical">⚗ Lab</span>}
        </div>
      </div>

      <h3 className="su-card__name">{subject.name}</h3>
      <p className="su-card__code">{subject.code} · {subject.credits} Credits</p>
      <p className="su-card__desc">{subject.description}</p>

      <div className="su-card__stats">
        <div className="su-card__stat">
          <span className="su-card__stat-val">{subject.theoryPeriods}</span>
          <span className="su-card__stat-label">Theory/wk</span>
        </div>
        <div className="su-card__stat">
          <span className="su-card__stat-val">{subject.practicalPeriods}</span>
          <span className="su-card__stat-label">Prac/wk</span>
        </div>
        <div className="su-card__stat">
          <span className="su-card__stat-val">{uniqueClasses.length}</span>
          <span className="su-card__stat-label">Classes</span>
        </div>
        <div className="su-card__stat">
          <span className="su-card__stat-val">{uniqueTeachers.length}</span>
          <span className="su-card__stat-label">Teachers</span>
        </div>
      </div>

      <div className="su-card__syllabus">
        <div className="su-card__syllabus-row">
          <span className="su-card__syllabus-label">Syllabus Progress</span>
          <div className="su-card__syllabus-right">
            <SyllabusBadge status={subject.syllabusStatus} />
            <span className="su-card__syllabus-pct" style={{ color: progressColor(avgProgress) }}>
              {avgProgress}%
            </span>
          </div>
        </div>
        <ProgressBar pct={avgProgress} />
      </div>

      {uniqueClasses.length > 0 && (
        <div className="su-card__classes">
          {uniqueClasses.slice(0, 4).map((c) => (
            <span key={c} className="su-class-tag">{c}</span>
          ))}
          {uniqueClasses.length > 4 && (
            <span className="su-class-tag su-class-tag--more">+{uniqueClasses.length - 4}</span>
          )}
        </div>
      )}

      <div className="su-card__footer">
        <button
          className="su-btn su-btn--primary su-btn--sm"
          onClick={() => onView(subject)}
          data-testid={`school-button-su-view-${subject.id}`}
        >
          View Details
        </button>
        <button
          className="su-btn su-btn--outline su-btn--sm"
          onClick={() => onEdit(subject)}
          data-testid={`school-button-su-edit-${subject.id}`}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// ─── Detail — Subject Info Tab ────────────────────────────────────────────────
function DetailInfoTab({ subject }) {
  const uniqueClasses = [...new Set(subject.allocations.map((a) => a.classLabel))];
  return (
    <div className="su-detail-info">
      <div className="su-info-grid">
        <div className="su-info-card">
          <h4 className="su-info-card__title">Subject Details</h4>
          <div className="su-info-row"><span className="su-info-row__label">Name</span>  <span className="su-info-row__val">{subject.name}</span></div>
          <div className="su-info-row"><span className="su-info-row__label">Code</span>  <span className="su-info-row__val su-mono">{subject.code}</span></div>
          <div className="su-info-row"><span className="su-info-row__label">Type</span>  <TypeBadge type={subject.type} /></div>
          <div className="su-info-row"><span className="su-info-row__label">Credits</span><span className="su-info-row__val">{subject.credits}</span></div>
          <div className="su-info-row"><span className="su-info-row__label">Practical</span><span className="su-info-row__val">{subject.hasPractical ? "✓ Yes" : "✗ No"}</span></div>
          <div className="su-info-row"><span className="su-info-row__label">Syllabus</span><SyllabusBadge status={subject.syllabusStatus} /></div>
        </div>

        <div className="su-info-card">
          <h4 className="su-info-card__title">Periods per Week</h4>
          <div className="su-periods-viz">
            <div className="su-periods-viz__item su-periods-viz__item--theory">
              <span className="su-periods-viz__count">{subject.theoryPeriods}</span>
              <span className="su-periods-viz__label">Theory</span>
              <span className="su-periods-viz__sub">periods/week</span>
            </div>
            <span className="su-periods-viz__sep">+</span>
            <div className="su-periods-viz__item su-periods-viz__item--practical">
              <span className="su-periods-viz__count">{subject.practicalPeriods}</span>
              <span className="su-periods-viz__label">Practical</span>
              <span className="su-periods-viz__sub">periods/week</span>
            </div>
            <span className="su-periods-viz__sep">=</span>
            <div className="su-periods-viz__item su-periods-viz__item--total">
              <span className="su-periods-viz__count">{subject.theoryPeriods + subject.practicalPeriods}</span>
              <span className="su-periods-viz__label">Total</span>
              <span className="su-periods-viz__sub">periods/week</span>
            </div>
          </div>
        </div>

        <div className="su-info-card">
          <h4 className="su-info-card__title">Assigned Classes ({uniqueClasses.length})</h4>
          <div className="su-tag-cloud">
            {uniqueClasses.map((c) => <span key={c} className="su-class-tag">{c}</span>)}
          </div>
        </div>

        <div className="su-info-card">
          <h4 className="su-info-card__title">Description</h4>
          <p className="su-info-desc">{subject.description || "—"}</p>
        </div>

        <div className="su-info-card su-info-card--full">
          <h4 className="su-info-card__title">Syllabus Progress by Section</h4>
          <div className="su-syllabus-list">
            {subject.allocations.map((a) => (
              <div key={a.id} className="su-syllabus-row" data-testid={`school-row-su-syllabus-${a.id}`}>
                <div className="su-syllabus-row__label">{a.classLabel} — Sec {a.section}</div>
                <div className="su-syllabus-row__bar"><ProgressBar pct={a.syllabusProgress} /></div>
                <div
                  className="su-syllabus-row__pct"
                  style={{ color: progressColor(a.syllabusProgress) }}
                >{a.syllabusProgress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail — Allocation Tab ──────────────────────────────────────────────────
function AllocationTab({ subject, onAssign, onAddAlloc }) {
  const uniqueClasses = [...new Set(subject.allocations.map((a) => a.classLabel))];
  return (
    <div className="su-alloc-tab" data-testid="school-container-su-allocation">
      <div className="su-alloc-tab__header">
        <p className="su-alloc-tab__desc">
          {subject.allocations.length} allocation{subject.allocations.length !== 1 ? "s" : ""} across{" "}
          {uniqueClasses.length} class{uniqueClasses.length !== 1 ? "es" : ""}
        </p>
        <button
          className="su-btn su-btn--primary su-btn--sm"
          onClick={onAddAlloc}
          data-testid="school-button-su-add-allocation"
        >
          + Add Allocation
        </button>
      </div>
      <div className="su-table-wrap">
        <table className="su-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Periods/Wk</th>
              <th>Primary Teacher</th>
              <th>Substitute</th>
              <th>Lab Instructor</th>
              <th>Syllabus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subject.allocations.map((alloc) => {
              const teacher = getTeacher(alloc.teacherId);
              const sub     = getTeacher(alloc.substituteId);
              const lab     = getTeacher(alloc.labInstructorId);
              return (
                <tr key={alloc.id} data-testid={`school-row-su-alloc-${alloc.id}`}>
                  <td><span className="su-class-tag">{alloc.classLabel}</span></td>
                  <td><span className="su-section-tag">Sec {alloc.section}</span></td>
                  <td><strong>{alloc.periodsWeek}</strong></td>
                  <td>{teacher ? <TeacherChip teacherId={alloc.teacherId} role="Primary" /> : <span className="su-muted-text">Unassigned</span>}</td>
                  <td>{sub     ? <TeacherChip teacherId={alloc.substituteId} role="Sub" /> : <span className="su-muted-text">—</span>}</td>
                  <td>{lab     ? <TeacherChip teacherId={alloc.labInstructorId} role="Lab" /> : <span className="su-muted-text">—</span>}</td>
                  <td>
                    <div className="su-table-progress">
                      <ProgressBar pct={alloc.syllabusProgress} />
                      <span style={{ color: progressColor(alloc.syllabusProgress), fontSize: ".75rem", fontWeight: 600 }}>
                        {alloc.syllabusProgress}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="su-btn su-btn--outline su-btn--xs"
                      onClick={() => onAssign(alloc)}
                      data-testid={`school-button-su-reassign-${alloc.id}`}
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Detail — Teacher Mapping Tab ─────────────────────────────────────────────
function TeacherMappingTab({ subject }) {
  const teacherMap = {};
  subject.allocations.forEach((a) => {
    if (a.teacherId) {
      if (!teacherMap[a.teacherId]) teacherMap[a.teacherId] = { role: "Primary", allocs: [] };
      teacherMap[a.teacherId].allocs.push(a);
    }
    if (a.substituteId) {
      if (!teacherMap[a.substituteId]) teacherMap[a.substituteId] = { role: "Substitute", allocs: [] };
      teacherMap[a.substituteId].allocs.push(a);
    }
    if (a.labInstructorId) {
      if (!teacherMap[a.labInstructorId]) teacherMap[a.labInstructorId] = { role: "Lab Instructor", allocs: [] };
      teacherMap[a.labInstructorId].allocs.push(a);
    }
  });

  if (!Object.keys(teacherMap).length) {
    return (
      <div className="su-empty">
        <div className="su-empty__icon">👨‍🏫</div>
        <h3 className="su-empty__title">No Teachers Assigned</h3>
        <p className="su-empty__sub">Add allocations first to see teacher mappings.</p>
      </div>
    );
  }

  return (
    <div className="su-mapping-tab" data-testid="school-container-su-mapping">
      <div className="su-mapping-grid">
        {Object.entries(teacherMap).map(([tid, info]) => {
          const t = getTeacher(tid);
          if (!t) return null;
          return (
            <div key={tid} className="su-teacher-card" data-testid={`school-card-su-teacher-${tid}`}>
              <div className="su-teacher-card__header">
                <div className="su-teacher-card__avatar">{t.initials}</div>
                <div className="su-teacher-card__info">
                  <p className="su-teacher-card__name">{t.name}</p>
                  <p className="su-teacher-card__dept">{t.dept}</p>
                </div>
                <span className="su-badge su-badge--role">{info.role}</span>
              </div>
              <div className="su-teacher-card__meta">
                <span>💼 {t.exp} yrs</span>
                <span>📊 {t.workload} periods/wk</span>
              </div>
              <p className="su-teacher-card__spec">{t.specialization}</p>
              <div className="su-teacher-card__allocs">
                <p className="su-teacher-card__alloc-title">Handles for this subject:</p>
                <div className="su-tag-cloud">
                  {info.allocs.map((a, i) => (
                    <span key={i} className="su-class-tag">{a.classLabel} — {a.section}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function DetailView({ subject, tab, setTab, onEditSubject, onAssignTeacher, onAddAlloc }) {
  const tm = TYPE_META[subject.type] || TYPE_META.core;
  return (
    <div className="su-detail" data-testid="school-container-su-detail">
      <div className="su-detail__header">
        <div className="su-detail__header-left">
          <div
            className="su-detail__icon"
            style={{ background: `${tm.color}20`, color: tm.color }}
          >
            {subject.code.substring(0, 2)}
          </div>
          <div>
            <h2 className="su-detail__name">{subject.name}</h2>
            <div className="su-detail__meta">
              <span className="su-mono">{subject.code}</span>
              <span className="su-detail__sep">·</span>
              <TypeBadge type={subject.type} />
              <span className="su-detail__sep">·</span>
              <span>{subject.credits} Credits</span>
              {subject.hasPractical && (
                <>
                  <span className="su-detail__sep">·</span>
                  <span className="su-badge su-badge--practical">⚗ Practical</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="su-detail__actions">
          <button
            className="su-btn su-btn--outline su-btn--sm"
            onClick={onEditSubject}
            data-testid="school-button-su-detail-edit"
          >
            Edit Subject
          </button>
        </div>
      </div>

      <div className="su-tabs" data-testid="school-tabs-su-detail">
        {[["info","Subject Info"],["allocation","Allocation"],["mapping","Teacher Mapping"]].map(([key, label]) => (
          <button
            key={key}
            className={`su-tabs__btn${tab === key ? " su-tabs__btn--active" : ""}`}
            onClick={() => setTab(key)}
            data-testid={`school-tab-su-${key}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "info"       && <DetailInfoTab    subject={subject} />}
      {tab === "allocation" && <AllocationTab    subject={subject} onAssign={onAssignTeacher} onAddAlloc={onAddAlloc} />}
      {tab === "mapping"    && <TeacherMappingTab subject={subject} />}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Subjects() {
  const [subjects,  setSubjects]        = useState(MOCK_SUBJECTS);
  const [view,      setView]            = useState("overview");
  const [selected,  setSelected]        = useState(null);
  const [detailTab, setDetailTab]       = useState("info");
  const [search,    setSearch]          = useState("");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [classFilter, setClassFilter]   = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [modal,     setModal]           = useState(null);

  const closeModal = useCallback(() => setModal(null), []);
  const metrics    = useMemo(() => computeMetrics(subjects), [subjects]);

  const filtered = useMemo(() => {
    let list = subjects;
    if (typeFilter !== "all")    list = list.filter((s) => s.type === typeFilter);
    if (classFilter !== "all")   list = list.filter((s) => s.allocations.some((a) => a.classLabel === classFilter));
    if (teacherFilter !== "all") list = list.filter((s) =>
      s.allocations.some((a) =>
        a.teacherId === teacherFilter || a.substituteId === teacherFilter || a.labInstructorId === teacherFilter
      )
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subjects, typeFilter, classFilter, teacherFilter, search]);

  const hasFilters = Boolean(search || typeFilter !== "all" || classFilter !== "all" || teacherFilter !== "all");

  const clearFilters = useCallback(() => {
    setSearch(""); setTypeFilter("all"); setClassFilter("all"); setTeacherFilter("all");
  }, []);

  const handleViewSubject = useCallback((subject) => {
    setSelected(subject);
    setDetailTab("info");
    setView("detail");
  }, []);

  const handleBack = useCallback(() => {
    setView("overview");
    setSelected(null);
  }, []);

  const handleSaveSubject = useCallback((form) => {
    const updates = {
      name: form.name, code: form.code, type: form.type,
      credits: Number(form.credits), theoryPeriods: Number(form.theoryPeriods),
      practicalPeriods: Number(form.practicalPeriods || 0),
      hasPractical: form.hasPractical, description: form.description,
      syllabusStatus: form.syllabusStatus,
    };
    if (modal?.subject) {
      setSubjects((prev) => prev.map((s) =>
        s.id === modal.subject.id ? { ...s, ...updates } : s
      ));
      if (selected?.id === modal.subject.id) {
        setSelected((prev) => ({ ...prev, ...updates }));
      }
    } else {
      const newSub = {
        id: `SUB${String(Date.now()).slice(-4)}`,
        ...updates,
        allocations: [],
      };
      setSubjects((prev) => [...prev, newSub]);
    }
    closeModal();
  }, [modal, selected, closeModal]);

  const handleSaveAssignment = useCallback((data) => {
    const updateAlloc = (a) =>
      a.id === modal?.allocId
        ? { ...a, teacherId: data.primaryId, substituteId: data.subId || null,
            labInstructorId: data.labId || null, periodsWeek: data.periodsWeek }
        : a;
    setSubjects((prev) => prev.map((s) =>
      s.id === selected?.id ? { ...s, allocations: s.allocations.map(updateAlloc) } : s
    ));
    setSelected((prev) => ({ ...prev, allocations: prev.allocations.map(updateAlloc) }));
    closeModal();
  }, [modal, selected, closeModal]);

  const handleAddAllocation = useCallback((data) => {
    const newAlloc = {
      id: `A${String(Date.now()).slice(-4)}`,
      classLabel: data.classLabel, section: data.section, teacherId: data.teacherId,
      substituteId: null, labInstructorId: null,
      periodsWeek: data.periodsWeek, syllabusProgress: 0,
    };
    setSubjects((prev) => prev.map((s) =>
      s.id === selected?.id ? { ...s, allocations: [...s.allocations, newAlloc] } : s
    ));
    setSelected((prev) => ({ ...prev, allocations: [...prev.allocations, newAlloc] }));
    closeModal();
  }, [selected, closeModal]);

  return (
    <div className="su-root" data-testid="school-page-subjects">
      <ManagementPageHeader
        breadcrumbContent={view === "detail" && selected ? <Breadcrumb subject={selected} onBack={handleBack} /> : null}
        breadcrumbs={view === "overview" ? [{ label: "Management" }, { label: "Academic Setup" }, { label: "Subjects" }] : []}
        title="Subjects & Allocation"
        subtitle="Manage subject catalog, curriculum mapping and teacher allocation"
        actions={(
          <>
            <button className="su-btn su-btn--ghost su-btn--sm" data-testid="school-button-su-export">⬇ Export</button>
            <button className="su-btn su-btn--primary" onClick={() => setModal({ type: "add" })} data-testid="school-button-su-add">
              + Add Subject
            </button>
          </>
        )}
      />

      {/* Metrics */}
      <div className="su-metrics">
        <MetricCard icon="📚" value={metrics.total}      label="Total Subjects"     variant="primary" testId="school-card-su-metric-total" />
        <MetricCard icon="📋" value={metrics.totalAlloc} label="Total Allocations"  variant="info"    testId="school-card-su-metric-allocations" />
        <MetricCard icon="👨‍🏫" value={metrics.teachers}  label="Teachers Engaged"  variant="success" testId="school-card-su-metric-teachers" />
        <MetricCard icon="✅" value={metrics.completed}  label="Syllabus Complete"  variant="warning" testId="school-card-su-metric-completed" />
        <MetricCard icon="⚗"  value={metrics.practical}  label="Practical Subjects" variant="neutral" testId="school-card-su-metric-practical" />
      </div>

      {/* Toolbar (overview only) */}
      {view === "overview" && (
        <div className="su-toolbar" data-testid="school-toolbar-subjects">
          <div className="su-toolbar__search">
            <span className="su-toolbar__search-icon">🔍</span>
            <input
              className="su-toolbar__input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject name or code…"
              data-testid="school-input-su-search"
            />
            {search && (
              <button className="su-toolbar__clear" onClick={() => setSearch("")} aria-label="Clear">✕</button>
            )}
          </div>
          <div className="su-toolbar__filters">
            <select
              className="su-toolbar__select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              data-testid="school-dropdown-su-type-filter"
            >
              <option value="all">All Types</option>
              {SUBJECT_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_META[t]?.label}</option>
              ))}
            </select>
            <select
              className="su-toolbar__select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              data-testid="school-dropdown-su-class-filter"
            >
              <option value="all">All Classes</option>
              {ALL_CLASS_LABELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="su-toolbar__select"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              data-testid="school-dropdown-su-teacher-filter"
            >
              <option value="all">All Teachers</option>
              {MOCK_TEACHERS.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                className="su-btn su-btn--ghost su-btn--sm"
                onClick={clearFilters}
                data-testid="school-button-su-clear-filters"
              >
                ✕ Clear
              </button>
            )}
            <span className="su-results-count">{filtered.length} subject{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}

      {/* Views */}
      {view === "overview" && (
        <>
          {filtered.length > 0 ? (
            <div className="su-grid" data-testid="school-container-su-grid">
              {filtered.map((s) => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  onView={handleViewSubject}
                  onEdit={(subj) => setModal({ type: "edit", subject: subj })}
                />
              ))}
            </div>
          ) : (
            <div className="su-empty" data-testid="school-container-su-empty">
              <div className="su-empty__icon">📚</div>
              <h3 className="su-empty__title">No Subjects Found</h3>
              <p className="su-empty__sub">Adjust your filters or add a new subject to get started.</p>
              <button
                className="su-btn su-btn--primary"
                onClick={() => setModal({ type: "add" })}
                data-testid="school-button-su-add-empty"
              >
                + Add Subject
              </button>
            </div>
          )}
        </>
      )}

      {view === "detail" && selected && (
        <DetailView
          subject={selected}
          tab={detailTab}
          setTab={setDetailTab}
          onEditSubject={() => setModal({ type: "edit", subject: selected })}
          onAssignTeacher={(alloc) => setModal({ type: "assign", allocId: alloc.id, alloc })}
          onAddAlloc={() => setModal({ type: "addAlloc" })}
        />
      )}

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <SubjectFormModal
          subject={modal.subject || null}
          onClose={closeModal}
          onSave={handleSaveSubject}
        />
      )}
      {modal?.type === "assign" && selected && (
        <AssignTeacherModal
          allocation={modal.alloc}
          subject={selected}
          onClose={closeModal}
          onSave={handleSaveAssignment}
        />
      )}
      {modal?.type === "addAlloc" && selected && (
        <AddAllocationModal
          subject={selected}
          onClose={closeModal}
          onSave={handleAddAllocation}
        />
      )}
    </div>
  );
}