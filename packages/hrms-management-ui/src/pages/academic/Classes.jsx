/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback } from "react";
import "../../Assets/styles/Classes.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";
import {
  MOCK_CLASSES,
  computeClassMetrics,
  getTeacherById,
  getAllTeachers,
  ACADEMIC_YEAR_OPTIONS,
  TIMETABLE_PERIODS,
  DAYS_OF_WEEK,
} from "./ClassesMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Occupancy color by percentage */
function occColor(pct) {
  if (pct >= 90) return "#dc2626";
  if (pct >= 75) return "#d97706";
  return "#16a34a";
}

/** Attendance color by percentage */
function attColor(pct) {
  if (pct < 75) return "#dc2626";
  if (pct < 85) return "#d97706";
  return "#16a34a";
}

/** Subject color by index (cyclic) */
const SUBJECT_COLORS = [
  { bg: "rgba(201,169,98,.12)",  color: "#c9a962" },
  { bg: "rgba(37,99,235,.10)",   color: "#2563eb" },
  { bg: "rgba(22,163,74,.10)",   color: "#16a34a" },
  { bg: "rgba(147,51,234,.10)",  color: "#9333ea" },
  { bg: "rgba(219,39,119,.10)",  color: "#db2777" },
  { bg: "rgba(217,119,6,.10)",   color: "#d97706" },
  { bg: "rgba(8,145,178,.10)",   color: "#0891b2" },
];
const subjectColor = (idx) => SUBJECT_COLORS[idx % SUBJECT_COLORS.length];

// ─── Atoms ────────────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return (
    <div className="cs-progress">
      <div
        className="cs-progress__fill"
        style={{ width: `${pct}%`, background: color || occColor(pct) }}
      />
    </div>
  );
}

function Badge({ label, variant = "neutral" }) {
  return <span className={`cs-badge cs-badge--${variant}`}>{label}</span>;
}

function SubjectChip({ name, idx, small }) {
  const c = subjectColor(idx);
  return (
    <span
      className={`cs-subject-chip${small ? " cs-subject-chip--sm" : ""}`}
      style={{ background: c.bg, color: c.color }}
    >
      {name}
    </span>
  );
}

function TeacherAvatar({ initials, size = "md" }) {
  return (
    <div className={`cs-teacher-avatar cs-teacher-avatar--${size}`}>
      {initials}
    </div>
  );
}

function MetricCard({ icon, value, label, variant }) {
  return (
    <div
      className={`cs-metric-card cs-metric-card--${variant}`}
      data-testid={`school-card-cs-metric-${label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
    >
      <div className="cs-metric-card__icon">{icon}</div>
      <div className="cs-metric-card__body">
        <div className="cs-metric-card__value">{value}</div>
        <div className="cs-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ view, selClass, selSection, goOverview, goClass }) {
  return (
    <nav className="cs-breadcrumb" aria-label="Navigation breadcrumb">
      <button
        className="cs-breadcrumb__item"
        onClick={goOverview}
        data-testid="school-button-cs-breadcrumb-overview"
      >
        Classes &amp; Sections
      </button>
      {(view === "class" || view === "section") && (
        <>
          <span className="cs-breadcrumb__sep" aria-hidden>›</span>
          {view === "class" ? (
            <span className="cs-breadcrumb__active">{selClass?.label}</span>
          ) : (
            <button
              className="cs-breadcrumb__item"
              onClick={goClass}
              data-testid="school-button-cs-breadcrumb-class"
            >
              {selClass?.label}
            </button>
          )}
        </>
      )}
      {view === "section" && (
        <>
          <span className="cs-breadcrumb__sep" aria-hidden>›</span>
          <span className="cs-breadcrumb__active">{selSection?.label}</span>
        </>
      )}
    </nav>
  );
}

// ─── Toolbar (Policies-style single-row) ─────────────────────────────────────
function ClassesToolbar({
  search, onSearch,
  sectionFilter, onSectionFilter,
  teacherFilter, onTeacherFilter,
  yearFilter, onYearFilter,
  onClear,
  hasFilters,
}) {
  const allTeachers = useMemo(() => getAllTeachers(), []);
  return (
    <div className="cs-toolbar" data-testid="school-toolbar-classes">
      <div className="cs-toolbar__search">
        <span className="cs-toolbar__search-icon">🔍</span>
        <input
          className="cs-toolbar__input"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search class, section, teacher…"
          data-testid="school-input-cs-search"
        />
        {search && (
          <button className="cs-toolbar__clear-input" onClick={() => onSearch("")}>✕</button>
        )}
      </div>
      <div className="cs-toolbar__filters">
        <select
          className="cs-toolbar__select"
          value={sectionFilter}
          onChange={(e) => onSectionFilter(e.target.value)}
          data-testid="school-dropdown-cs-section"
        >
          <option value="">All Sections</option>
          {["A", "B", "C", "D"].map((s) => (
            <option key={s} value={s}>Section {s}</option>
          ))}
        </select>
        <select
          className="cs-toolbar__select"
          value={teacherFilter}
          onChange={(e) => onTeacherFilter(e.target.value)}
          data-testid="school-dropdown-cs-teacher"
        >
          <option value="">All Teachers</option>
          {allTeachers.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          className="cs-toolbar__select"
          value={yearFilter}
          onChange={(e) => onYearFilter(e.target.value)}
          data-testid="school-dropdown-cs-year"
        >
          <option value="">All Years</option>
          {ACADEMIC_YEAR_OPTIONS.map((y) => (
            <option key={y.value} value={y.value}>{y.label}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            className="cs-btn cs-btn--ghost cs-btn--sm"
            onClick={onClear}
            data-testid="school-button-cs-clear-filters"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ─── OVERVIEW VIEW ───────────────────────────────────────────────────────────
const OVERVIEW_METRIC_DEFS = [
  { key: "total",      icon: "📚", label: "Total Classes",   variant: "primary" },
  { key: "sections",   icon: "🗂️", label: "Total Sections",  variant: "info"    },
  { key: "teachers",   icon: "👨‍🏫", label: "Class Teachers",  variant: "success" },
  { key: "students",   icon: "👥", label: "Total Students",  variant: "warning" },
  { key: "occupancy",  icon: "🏫", label: "Avg Occupancy",   variant: "neutral" },
  { key: "attendance", icon: "📋", label: "Avg Attendance",  variant: "accent"  },
];

function ClassCard({ cls, onSelect }) {
  const occ = cls.avgOccupancy;
  const att = cls.avgAttendance;
  return (
    <div
      className="cs-class-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(cls)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(cls)}
      data-testid={`school-card-cs-class-${cls.id}`}
    >
      <div className="cs-class-card__header">
        <div className="cs-class-card__title-row">
          <h3 className="cs-class-card__title">{cls.label}</h3>
          <Badge label={cls.status === "active" ? "Active" : "Inactive"} variant={cls.status === "active" ? "success" : "neutral"} />
        </div>
        <p className="cs-class-card__year">{cls.academicYear}</p>
      </div>

      <div className="cs-class-card__stats">
        <div className="cs-class-card__stat">
          <span className="cs-class-card__stat-label">Students</span>
          <span className="cs-class-card__stat-val">{cls.totalStudents}</span>
        </div>
        <div className="cs-class-card__stat">
          <span className="cs-class-card__stat-label">Sections</span>
          <span className="cs-class-card__stat-val">{cls.totalSections}</span>
        </div>
        <div className="cs-class-card__stat">
          <span className="cs-class-card__stat-label">Teachers</span>
          <span className="cs-class-card__stat-val">{cls.totalTeachers}</span>
        </div>
      </div>

      <div className="cs-class-card__room-row">
        {cls.sections.slice(0, 1).map((sec) => (
          <span key={sec.id} className="cs-class-card__room-info">
            🏠 Room {sec.room.roomNo} · Floor {sec.room.floor} · Block {sec.room.block}
          </span>
        ))}
      </div>

      <div className="cs-class-card__metrics">
        <div className="cs-class-card__metric">
          <div className="cs-class-card__metric-row">
            <span className="cs-class-card__metric-label">Occupancy</span>
            <span className="cs-class-card__metric-val" style={{ color: occColor(occ) }}>{occ}%</span>
          </div>
          <ProgressBar pct={occ} color={occColor(occ)} />
        </div>
        <div className="cs-class-card__metric">
          <div className="cs-class-card__metric-row">
            <span className="cs-class-card__metric-label">Attendance</span>
            <span className="cs-class-card__metric-val" style={{ color: attColor(att) }}>{att}%</span>
          </div>
          <ProgressBar pct={att} color={attColor(att)} />
        </div>
      </div>

      <div className="cs-class-card__footer">
        <span className="cs-class-card__sections-preview">
          {cls.sections.map((s) => (
            <span key={s.id} className="cs-class-card__sec-dot">{s.sectionLabel}</span>
          ))}
        </span>
        <button className="cs-class-card__cta" tabIndex={-1}>View Sections →</button>
      </div>
    </div>
  );
}

function OverviewView({ metrics, classes, onSelectClass }) {
  return (
    <>
      <div className="cs-metrics">
        {OVERVIEW_METRIC_DEFS.map((m) => (
          <MetricCard
            key={m.key}
            icon={m.icon}
            label={m.label}
            variant={m.variant}
            value={
              m.key === "occupancy" || m.key === "attendance"
                ? `${metrics[m.key]}%`
                : metrics[m.key].toLocaleString("en-IN")
            }
          />
        ))}
      </div>
      <p className="cs-subtitle">
        Academic Year 2026–27 · {classes.length} classes · Click a class to view sections
      </p>
      <div className="cs-class-grid">
        {classes.map((cls) => (
          <ClassCard key={cls.id} cls={cls} onSelect={onSelectClass} />
        ))}
      </div>
      {classes.length === 0 && (
        <div className="cs-empty" data-testid="school-container-cs-empty">
          <div className="cs-empty__icon">📚</div>
          <h3 className="cs-empty__title">No Classes Found</h3>
          <p className="cs-empty__sub">Adjust filters or search to find matching classes.</p>
        </div>
      )}
    </>
  );
}

// ─── CLASS VIEW ───────────────────────────────────────────────────────────────
function SectionCard({ sec, cls, onSelect }) {
  const teacher = getTeacherById(sec.classTeacherId);
  return (
    <div
      className="cs-section-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(sec)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(sec)}
      data-testid={`school-card-cs-section-${sec.id}`}
    >
      <div className="cs-section-card__header">
        <div>
          <h3 className="cs-section-card__title">
            {cls.label} — {sec.label}
          </h3>
          <p className="cs-section-card__year">{sec.academicYear}</p>
        </div>
        <Badge label="Active" variant="success" />
      </div>

      <div className="cs-section-card__stats">
        <div className="cs-section-card__stat">
          <span className="cs-section-card__stat-lbl">👥 Students</span>
          <span className="cs-section-card__stat-val">{sec.studentCount}</span>
        </div>
        <div className="cs-section-card__stat">
          <span className="cs-section-card__stat-lbl">📋 Attendance</span>
          <span className="cs-section-card__stat-val" style={{ color: attColor(sec.weeklyAttendance) }}>
            {sec.weeklyAttendance}%
          </span>
        </div>
        <div className="cs-section-card__stat">
          <span className="cs-section-card__stat-lbl">🏫 Room</span>
          <span className="cs-section-card__stat-val">
            {sec.room.roomNo} · F{sec.room.floor} · Blk {sec.room.block}
          </span>
        </div>
      </div>

      <div className="cs-section-card__occ">
        <div className="cs-section-card__occ-row">
          <span>Occupancy</span>
          <span style={{ color: occColor(sec.occupancy), fontWeight: 700 }}>{sec.occupancy}%</span>
        </div>
        <ProgressBar pct={sec.occupancy} color={occColor(sec.occupancy)} />
      </div>

      {teacher && (
        <div className="cs-section-card__teacher">
          <TeacherAvatar initials={teacher.initials} size="sm" />
          <div>
            <p className="cs-section-card__teacher-name">{teacher.name}</p>
            <p className="cs-section-card__teacher-role">Class Teacher · {teacher.dept}</p>
          </div>
        </div>
      )}

      <div className="cs-section-card__subjects">
        {sec.subjects.slice(0, 4).map((s, idx) => (
          <SubjectChip key={s.name} name={s.name} idx={idx} small />
        ))}
        {sec.subjects.length > 4 && (
          <span className="cs-subject-chip cs-subject-chip--sm cs-subject-chip--more">
            +{sec.subjects.length - 4}
          </span>
        )}
      </div>

      <button
        className="cs-section-card__cta"
        data-testid={`school-button-cs-section-details-${sec.id}`}
        tabIndex={-1}
      >
        View Details →
      </button>
    </div>
  );
}

function ClassView({ cls, onSelectSection }) {
  const clsMetrics = [
    { icon: "👥", label: "Students",    value: cls.totalStudents.toLocaleString("en-IN"), variant: "primary" },
    { icon: "🗂️", label: "Sections",   value: cls.totalSections,                         variant: "info"    },
    { icon: "👨‍🏫", label: "Teachers",   value: cls.totalTeachers,                         variant: "success" },
    { icon: "🏫", label: "Avg Occ.",    value: `${cls.avgOccupancy}%`,                    variant: "warning" },
    { icon: "📋", label: "Avg Attend.", value: `${cls.avgAttendance}%`,                   variant: "accent"  },
  ];
  return (
    <>
      <div className="cs-section-header">
        <div>
          <h2 className="cs-section-header__title">{cls.label}</h2>
          <p className="cs-section-header__sub">
            {cls.totalSections} sections · {cls.totalStudents} students · Click a section to drill down
          </p>
        </div>
        <Badge label="Active" variant="success" />
      </div>
      <div className="cs-metrics cs-metrics--compact">
        {clsMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>
      <div className="cs-section-grid">
        {cls.sections.map((sec) => (
          <SectionCard key={sec.id} sec={sec} cls={cls} onSelect={onSelectSection} />
        ))}
      </div>
    </>
  );
}

// ─── SECTION VIEW ─────────────────────────────────────────────────────────────
function TeacherAllocationCard({ role, teacherId, onReassign, label }) {
  const teacher = getTeacherById(teacherId);
  if (!teacher) return null;
  return (
    <div className="cs-teacher-card" data-testid={`school-card-cs-teacher-${role}`}>
      <div className="cs-teacher-card__header">
        <TeacherAvatar initials={teacher.initials} size="lg" />
        <div className="cs-teacher-card__info">
          <p className="cs-teacher-card__name">{teacher.name}</p>
          <p className="cs-teacher-card__role">{label}</p>
          <p className="cs-teacher-card__dept">{teacher.dept}</p>
        </div>
      </div>
      <div className="cs-teacher-card__meta">
        <span className="cs-teacher-card__meta-item">🎓 {teacher.exp} yrs exp</span>
        <span className="cs-teacher-card__meta-item">📅 {teacher.workload} hrs/wk</span>
      </div>
      <div className="cs-teacher-card__contact">
        <span className="cs-teacher-card__contact-item">📞 {teacher.phone}</span>
        <span className="cs-teacher-card__contact-item">✉️ {teacher.email}</span>
      </div>
      <button
        className="cs-btn cs-btn--outline cs-btn--sm"
        onClick={() => onReassign(role)}
        data-testid={`school-button-cs-reassign-${role}`}
      >
        ↩ Reassign
      </button>
    </div>
  );
}

function TimetableGrid({ timetable }) {
  return (
    <div className="cs-timetable-wrap">
      <div className="cs-timetable-scroll">
        <table className="cs-timetable" data-testid="school-table-cs-timetable">
          <thead>
            <tr>
              <th className="cs-timetable__th cs-timetable__th--period">Period</th>
              {DAYS_OF_WEEK.map((d) => (
                <th key={d} className="cs-timetable__th">{d.slice(0, 3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMETABLE_PERIODS.map((period) => {
              if (period.type === "break") {
                return (
                  <tr key={period.num} className="cs-timetable__break-row">
                    <td className="cs-timetable__td cs-timetable__td--time">{period.time}</td>
                    <td colSpan={DAYS_OF_WEEK.length} className="cs-timetable__break-cell">
                      {period.label}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={period.num} className="cs-timetable__row">
                  <td className="cs-timetable__td cs-timetable__td--time">
                    <span className="cs-timetable__period-num">P{period.num}</span>
                    <span className="cs-timetable__period-time">{period.time}</span>
                  </td>
                  {DAYS_OF_WEEK.map((day) => {
                    const entry = timetable?.[day]?.[period.num];
                    if (!entry) return <td key={day} className="cs-timetable__td cs-timetable__td--empty">—</td>;
                    const teacher = getTeacherById(entry.teacherId);
                    return (
                      <td key={day} className="cs-timetable__td cs-timetable__td--entry">
                        <span className="cs-timetable__subj">{entry.subject}</span>
                        {teacher && (
                          <span className="cs-timetable__teacher">{teacher.initials}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentsTable({ students }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let rows = students;
    if (statusFilter !== "all") rows = rows.filter((s) => s.todayStatus === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.includes(q)
      );
    }
    return rows;
  }, [students, statusFilter, search]);

  return (
    <>
      <div className="cs-students-toolbar">
        <div className="cs-toolbar__search cs-toolbar__search--sm">
          <span className="cs-toolbar__search-icon">🔍</span>
          <input
            className="cs-toolbar__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, roll no, admission no…"
            data-testid="school-input-cs-student-search"
          />
          {search && (
            <button className="cs-toolbar__clear-input" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <select
          className="cs-toolbar__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="school-dropdown-cs-student-status"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">On Leave</option>
        </select>
        <span className="cs-results-count">
          {filtered.length} / {students.length} students
        </span>
      </div>
      <div className="cs-table-wrap">
        <div className="cs-table-scroll">
          <table className="cs-table" data-testid="school-table-cs-students">
            <thead>
              <tr>
                <th className="cs-table__th">Roll No</th>
                <th className="cs-table__th">Name</th>
                <th className="cs-table__th">Adm. No</th>
                <th className="cs-table__th">Gender</th>
                <th className="cs-table__th">Attendance %</th>
                <th className="cs-table__th">Today</th>
                <th className="cs-table__th">Parent Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu) => (
                <tr key={stu.id} className="cs-table__row">
                  <td className="cs-table__td cs-table__td--roll">{stu.rollNo}</td>
                  <td className="cs-table__td cs-table__td--name">{stu.name}</td>
                  <td className="cs-table__td cs-table__td--mono">{stu.admissionNo}</td>
                  <td className="cs-table__td">{stu.gender}</td>
                  <td className="cs-table__td">
                    <div className="cs-table__att-cell">
                      <span style={{ color: attColor(stu.attendance), fontWeight: 700 }}>
                        {stu.attendance}%
                      </span>
                      <div className="cs-table__att-bar">
                        <div
                          className="cs-table__att-fill"
                          style={{ width: `${stu.attendance}%`, background: attColor(stu.attendance) }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="cs-table__td">
                    <Badge
                      label={stu.todayStatus === "present" ? "Present" : stu.todayStatus === "absent" ? "Absent" : "Leave"}
                      variant={stu.todayStatus === "present" ? "success" : stu.todayStatus === "absent" ? "danger" : "warning"}
                    />
                  </td>
                  <td className="cs-table__td cs-table__td--mono">{stu.parentPhone}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="cs-table__empty">No students match your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function SectionView({ cls, sec }) {
  const [tab, setTab] = useState("overview");
  const [reassignRole, setReassignRole] = useState(null);

  const handleReassign = useCallback((role) => {
    setReassignRole(role);
  }, []);

  const secMetrics = [
    { icon: "👥", label: "Students",   value: sec.studentCount,               variant: "primary" },
    { icon: "🏫", label: "Occupancy",  value: `${sec.occupancy}%`,             variant: "warning" },
    { icon: "📋", label: "Attendance", value: `${sec.weeklyAttendance}%`,       variant: "success" },
    { icon: "📚", label: "Subjects",   value: sec.subjects.length,             variant: "info"    },
  ];

  const TABS = [
    { id: "overview",   label: "Overview"          },
    { id: "timetable",  label: "Timetable"         },
    { id: "students",   label: `Students (${sec.studentCount})` },
  ];

  return (
    <>
      <div className="cs-section-header">
        <div>
          <h2 className="cs-section-header__title">
            {cls.label} — {sec.label}
          </h2>
          <p className="cs-section-header__sub">
            Room {sec.room.roomNo} · Floor {sec.room.floor} · Block {sec.room.block} · {sec.room.category}
          </p>
        </div>
        <div className="cs-section-header__actions">
          <Badge label="Active" variant="success" />
        </div>
      </div>

      <div className="cs-metrics cs-metrics--compact">
        {secMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>

      <div className="cs-tabs" role="tablist" data-testid="school-tabs-cs-section">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`cs-tabs__tab${tab === t.id ? " cs-tabs__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
            data-testid={`school-tab-cs-${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="cs-section-overview-grid">
          {/* Class Leader */}
          <div className="cs-info-card">
            <h4 className="cs-info-card__title">🏅 Class Leader</h4>
            <div className="cs-info-card__body">
              <TeacherAvatar initials={sec.classLeader.name.slice(0, 2).toUpperCase()} size="md" />
              <div>
                <p className="cs-info-card__name">{sec.classLeader.name}</p>
                <p className="cs-info-card__sub">Roll No. {sec.classLeader.rollNo}</p>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="cs-info-card">
            <h4 className="cs-info-card__title">🏠 Room Allocation</h4>
            <div className="cs-info-card__rows">
              <div className="cs-info-card__row">
                <span>Room No.</span><strong>Room {sec.room.roomNo}</strong>
              </div>
              <div className="cs-info-card__row">
                <span>Floor</span><strong>Floor {sec.room.floor}</strong>
              </div>
              <div className="cs-info-card__row">
                <span>Block</span><strong>Block {sec.room.block}</strong>
              </div>
              <div className="cs-info-card__row">
                <span>Capacity</span><strong>{sec.room.capacity} seats</strong>
              </div>
              <div className="cs-info-card__row">
                <span>Category</span><strong>{sec.room.category}</strong>
              </div>
            </div>
            <div className="cs-info-card__occ">
              <div className="cs-info-card__occ-row">
                <span>Occupancy</span>
                <span style={{ color: occColor(sec.occupancy), fontWeight: 700 }}>{sec.occupancy}%</span>
              </div>
              <ProgressBar pct={sec.occupancy} color={occColor(sec.occupancy)} />
            </div>
          </div>

          {/* Teacher Allocation */}
          <div className="cs-teacher-allocation">
            <h4 className="cs-teacher-allocation__title">👨‍🏫 Teacher Allocation</h4>
            <div className="cs-teacher-allocation__grid">
              <TeacherAllocationCard
                role="class-teacher"
                label="Class Teacher"
                teacherId={sec.classTeacherId}
                onReassign={handleReassign}
              />
              <TeacherAllocationCard
                role="co-teacher"
                label="Co-Class Teacher"
                teacherId={sec.coTeacherId}
                onReassign={handleReassign}
              />
              <TeacherAllocationCard
                role="coordinator"
                label="Coordinator"
                teacherId={sec.coordinatorId}
                onReassign={handleReassign}
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="cs-subjects-panel">
            <h4 className="cs-subjects-panel__title">📚 Assigned Subjects &amp; Teachers</h4>
            <div className="cs-subjects-panel__grid">
              {sec.subjects.map((subj, idx) => {
                const teacher = getTeacherById(subj.teacherId);
                return (
                  <div key={subj.name} className="cs-subject-row" data-testid={`school-row-cs-subject-${idx}`}>
                    <SubjectChip name={subj.name} idx={idx} />
                    {teacher && (
                      <div className="cs-subject-row__teacher">
                        <TeacherAvatar initials={teacher.initials} size="xs" />
                        <span className="cs-subject-row__teacher-name">{teacher.name}</span>
                        <button
                          className="cs-btn cs-btn--ghost cs-btn--xs"
                          data-testid={`school-button-cs-reassign-subject-${idx}`}
                        >
                          ↩
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Attendance Overview */}
          <div className="cs-attendance-panel">
            <h4 className="cs-attendance-panel__title">📊 Weekly Attendance</h4>
            <div className="cs-attendance-panel__ring-area">
              <div className="cs-attendance-ring" style={{ "--att-pct": sec.weeklyAttendance }}>
                <span className="cs-attendance-ring__val">{sec.weeklyAttendance}%</span>
                <span className="cs-attendance-ring__lbl">This Week</span>
              </div>
              <div className="cs-attendance-panel__stats">
                <div className="cs-attendance-panel__stat">
                  <span className="cs-attendance-panel__stat-lbl">Present Today</span>
                  <span className="cs-attendance-panel__stat-val" style={{ color: "#16a34a" }}>
                    {sec.students.filter((s) => s.todayStatus === "present").length}
                  </span>
                </div>
                <div className="cs-attendance-panel__stat">
                  <span className="cs-attendance-panel__stat-lbl">Absent Today</span>
                  <span className="cs-attendance-panel__stat-val" style={{ color: "#dc2626" }}>
                    {sec.students.filter((s) => s.todayStatus === "absent").length}
                  </span>
                </div>
                <div className="cs-attendance-panel__stat">
                  <span className="cs-attendance-panel__stat-lbl">On Leave</span>
                  <span className="cs-attendance-panel__stat-val" style={{ color: "#d97706" }}>
                    {sec.students.filter((s) => s.todayStatus === "leave").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "timetable" && (
        <div className="cs-card">
          <div className="cs-card__header">
            <h4 className="cs-card__title">📅 Weekly Timetable — {cls.label} {sec.label}</h4>
            <button className="cs-btn cs-btn--outline cs-btn--sm" data-testid="school-button-cs-timetable-edit">
              ✏ Edit Timetable
            </button>
          </div>
          <TimetableGrid timetable={sec.timetable} />
        </div>
      )}

      {tab === "students" && (
        <div className="cs-card">
          <div className="cs-card__header">
            <h4 className="cs-card__title">👥 Student List — {cls.label} {sec.label}</h4>
            <button className="cs-btn cs-btn--primary cs-btn--sm" data-testid="school-button-cs-add-student">
              + Add Student
            </button>
          </div>
          <StudentsTable students={sec.students} />
        </div>
      )}

      {reassignRole && (
        <div className="cs-modal-overlay" role="dialog" aria-modal="true">
          <div className="cs-modal" data-testid="school-modal-cs-reassign">
            <div className="cs-modal__header">
              <h3 className="cs-modal__title">Reassign {reassignRole.replace("-", " ")}</h3>
              <button
                className="cs-modal__close"
                onClick={() => setReassignRole(null)}
                data-testid="school-button-cs-modal-close"
              >
                ✕
              </button>
            </div>
            <p className="cs-modal__sub">Select a teacher to assign as {reassignRole.replace("-", " ")}:</p>
            <div className="cs-modal__teacher-list">
              {getAllTeachers().map((t) => (
                <button
                  key={t.id}
                  className="cs-modal__teacher-option"
                  onClick={() => setReassignRole(null)}
                  data-testid={`school-button-cs-select-teacher-${t.id}`}
                >
                  <TeacherAvatar initials={t.initials} size="sm" />
                  <div>
                    <p className="cs-modal__teacher-name">{t.name}</p>
                    <p className="cs-modal__teacher-meta">{t.dept} · {t.exp} yrs · {t.workload} hrs/wk</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="cs-modal__footer">
              <button
                className="cs-btn cs-btn--ghost"
                onClick={() => setReassignRole(null)}
                data-testid="school-button-cs-modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Classes() {
  const [view, setView] = useState("overview");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const metrics = useMemo(() => computeClassMetrics(MOCK_CLASSES), []);

  const hasFilters = Boolean(search || sectionFilter || teacherFilter || yearFilter);

  const filteredClasses = useMemo(() => {
    let list = MOCK_CLASSES;
    if (yearFilter) list = list.filter((c) => c.academicYear === yearFilter);
    if (sectionFilter) {
      list = list.filter((c) =>
        c.sections.some((s) => s.sectionLabel === sectionFilter)
      );
    }
    if (teacherFilter) {
      list = list.filter((c) =>
        c.sections.some(
          (s) => s.classTeacherId === teacherFilter || s.coTeacherId === teacherFilter
        )
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.sections.some(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              getTeacherById(s.classTeacherId)?.name.toLowerCase().includes(q)
          )
      );
    }
    return list;
  }, [search, sectionFilter, teacherFilter, yearFilter]);

  const handleSelectClass = useCallback((cls) => {
    setSelectedClass(cls);
    setView("class");
  }, []);

  const handleSelectSection = useCallback((sec) => {
    setSelectedSection(sec);
    setView("section");
  }, []);

  const goOverview = useCallback(() => {
    setView("overview");
    setSelectedClass(null);
    setSelectedSection(null);
  }, []);

  const goClass = useCallback(() => {
    setView("class");
    setSelectedSection(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSectionFilter("");
    setTeacherFilter("");
    setYearFilter("");
  }, []);

  return (
    <div className="cs-root" data-testid="school-page-classes">
      <ManagementPageHeader
        breadcrumbContent={(
          <Breadcrumb
            view={view}
            selClass={selectedClass}
            selSection={selectedSection}
            goOverview={goOverview}
            goClass={goClass}
          />
        )}
        title={
          view === "overview"
            ? "Classes & Sections"
            : view === "class"
              ? selectedClass?.label
              : `${selectedClass?.label} — ${selectedSection?.label}`
        }
        subtitle={
          view === "overview"
            ? "Academic year 2026-27 · Manage all classes, sections, teachers & timetables"
            : view === "class"
              ? `${selectedClass?.totalSections} sections · ${selectedClass?.totalStudents} students · Academic 2026-27`
              : `Room ${selectedSection?.room?.roomNo} · ${selectedSection?.studentCount} students · Academic 2026-27`
        }
        actions={(
          <>
            {view === "overview" && (
              <>
                <button className="cs-btn cs-btn--ghost cs-btn--sm" data-testid="school-button-cs-export">
                  ⬇ Export
                </button>
                <button className="cs-btn cs-btn--primary" data-testid="school-button-cs-add-class">
                  + Add Class
                </button>
              </>
            )}
            {view === "class" && (
              <button className="cs-btn cs-btn--primary" data-testid="school-button-cs-add-section">
                + Add Section
              </button>
            )}
          </>
        )}
      />

      {/* ── Toolbar (overview only) ── */}
      {view === "overview" && (
        <ClassesToolbar
          search={search}
          onSearch={setSearch}
          sectionFilter={sectionFilter}
          onSectionFilter={setSectionFilter}
          teacherFilter={teacherFilter}
          onTeacherFilter={setTeacherFilter}
          yearFilter={yearFilter}
          onYearFilter={setYearFilter}
          onClear={clearFilters}
          hasFilters={hasFilters}
        />
      )}

      {/* ── Content ── */}
      {view === "overview" && (
        <OverviewView
          metrics={metrics}
          classes={filteredClasses}
          onSelectClass={handleSelectClass}
        />
      )}
      {view === "class" && selectedClass && (
        <ClassView cls={selectedClass} onSelectSection={handleSelectSection} />
      )}
      {view === "section" && selectedClass && selectedSection && (
        <SectionView cls={selectedClass} sec={selectedSection} />
      )}
    </div>
  );
}