/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/AcademicCalendar.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 4; // May (0-indexed)

const EVENT_TYPES = {
  exam:      { label: "Exam",            color: "#dc2626", bg: "rgba(220,38,38,.10)"  },
  holiday:   { label: "Holiday",         color: "#16a34a", bg: "rgba(22,163,74,.10)"  },
  sports:    { label: "Sports",          color: "#2563eb", bg: "rgba(37,99,235,.10)"  },
  cultural:  { label: "Cultural",        color: "#db2777", bg: "rgba(219,39,119,.10)" },
  assembly:  { label: "Assembly",        color: "#7c3aed", bg: "rgba(124,58,237,.10)" },
  staff:     { label: "Staff Meeting",   color: "#d97706", bg: "rgba(217,119,6,.10)"  },
  pta:       { label: "PTA Meeting",     color: "#0891b2", bg: "rgba(8,145,178,.10)"  },
  result:    { label: "Result Day",      color: "#c9a962", bg: "rgba(201,169,98,.10)" },
};

const MOCK_EVENTS = [
  { id:"E001", title:"Unit Test – Class 9 & 10",     type:"exam",     date:"2026-05-06", branch:"All Branches",   classes:["Class 9","Class 10"], status:"upcoming",  description:"Mathematics and Science unit test." },
  { id:"E002", title:"Annual Sports Day",            type:"sports",   date:"2026-05-10", branch:"Main Campus",    classes:["All"],               status:"upcoming",  description:"Inter-house sports competition." },
  { id:"E003", title:"PTA Meeting – Term 1",         type:"pta",      date:"2026-05-15", branch:"All Branches",   classes:["All"],               status:"upcoming",  description:"Parent–Teacher meeting for Term 1 progress." },
  { id:"E004", title:"Eid-ul-Adha Holiday",          type:"holiday",  date:"2026-05-18", branch:"All Branches",   classes:["All"],               status:"upcoming",  description:"Public holiday — Eid-ul-Adha." },
  { id:"E005", title:"Mid-Term Exams Begin",         type:"exam",     date:"2026-05-20", branch:"All Branches",   classes:["All"],               status:"upcoming",  description:"Mid-term examinations for all classes." },
  { id:"E006", title:"Cultural Festival",            type:"cultural", date:"2026-05-24", branch:"Main Campus",    classes:["All"],               status:"upcoming",  description:"Annual cultural fest — Pratibha 2026." },
  { id:"E007", title:"Staff Training Day",           type:"staff",    date:"2026-05-28", branch:"All Branches",   classes:["N/A"],               status:"upcoming",  description:"Mandatory staff skill-development workshop." },
  { id:"E008", title:"Result Declaration – Term 1",  type:"result",   date:"2026-06-02", branch:"All Branches",   classes:["All"],               status:"upcoming",  description:"Term 1 results to be declared." },
  { id:"E009", title:"Republic Day Assembly",        type:"assembly", date:"2026-01-26", branch:"All Branches",   classes:["All"],               status:"completed", description:"Annual Republic Day assembly and parade." },
  { id:"E010", title:"Board Exam Preparation Camp",  type:"exam",     date:"2026-06-10", branch:"Main Campus",    classes:["Class 10","Class 12"],status:"upcoming",  description:"Intensive revision camp for board students." },
];

const MOCK_HOLIDAYS = [
  { id:"H001", name:"Republic Day",         date:"2026-01-26", type:"national",   branch:"All Branches" },
  { id:"H002", name:"Holi",                 date:"2026-03-13", type:"national",   branch:"All Branches" },
  { id:"H003", name:"Ugadi",                date:"2026-03-20", type:"local",      branch:"Bangalore Branches" },
  { id:"H004", name:"Good Friday",          date:"2026-04-03", type:"national",   branch:"All Branches" },
  { id:"H005", name:"Dr. Ambedkar Jayanti", date:"2026-04-14", type:"national",   branch:"All Branches" },
  { id:"H006", name:"Eid-ul-Adha",          date:"2026-05-18", type:"national",   branch:"All Branches" },
  { id:"H007", name:"Independence Day",     date:"2026-08-15", type:"national",   branch:"All Branches" },
  { id:"H008", name:"Gandhi Jayanti",       date:"2026-10-02", type:"national",   branch:"All Branches" },
  { id:"H009", name:"Dussehra",             date:"2026-10-10", type:"national",   branch:"All Branches" },
  { id:"H010", name:"Diwali",               date:"2026-11-07", type:"national",   branch:"All Branches" },
  { id:"H011", name:"Kannada Rajyotsava",   date:"2026-11-01", type:"local",      branch:"Bangalore Branches" },
  { id:"H012", name:"Christmas",            date:"2026-12-25", type:"national",   branch:"All Branches" },
];

const MOCK_EXAMS = [
  { id:"EX001", name:"Unit Test 1",    month:"May 2026",    classes:"Class 9, 10",    subjects:"Math, Science",     status:"upcoming"  },
  { id:"EX002", name:"Mid-Term",       month:"May 2026",    classes:"All Classes",    subjects:"All Subjects",      status:"upcoming"  },
  { id:"EX003", name:"Unit Test 2",    month:"July 2026",   classes:"Class 9, 10",    subjects:"All Subjects",      status:"scheduled" },
  { id:"EX004", name:"Final Exams",    month:"Oct 2026",    classes:"All Classes",    subjects:"All Subjects",      status:"scheduled" },
  { id:"EX005", name:"Board Prelims",  month:"Dec 2026",    classes:"Class 10, 12",   subjects:"Core Subjects",     status:"scheduled" },
];

const MOCK_MEETINGS = [
  { id:"M001", title:"PTA Meeting – Term 1",    date:"2026-05-15", type:"pta",   attendees:"Parents, Class Teachers", status:"upcoming"  },
  { id:"M002", title:"Staff Training Day",       date:"2026-05-28", type:"staff", attendees:"All Teaching Staff",      status:"upcoming"  },
  { id:"M003", title:"HOD Monthly Review",       date:"2026-06-05", type:"staff", attendees:"HODs, Principal",          status:"scheduled" },
  { id:"M004", title:"Board of Directors Meet",  date:"2026-06-12", type:"board", attendees:"Management, Principal",   status:"scheduled" },
  { id:"M005", title:"PTA Meeting – Term 2",     date:"2026-09-18", type:"pta",   attendees:"Parents, Class Teachers", status:"scheduled" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function padDate(n) { return String(n).padStart(2, "0"); }

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function EventTypeBadge({ type }) {
  const m = EVENT_TYPES[type] || EVENT_TYPES.exam;
  return <span className="ac-badge" style={{ background: m.bg, color: m.color }}>{m.label}</span>;
}

function StatusBadge({ status }) {
  const map = {
    upcoming:   { label: "Upcoming",   cls: "upcoming"   },
    completed:  { label: "Completed",  cls: "completed"  },
    scheduled:  { label: "Scheduled",  cls: "scheduled"  },
    cancelled:  { label: "Cancelled",  cls: "cancelled"  },
  };
  const s = map[status] || map.upcoming;
  return <span className={`ac-status ac-status--${s.cls}`}>{s.label}</span>;
}

function MetricCard({ icon, value, label, variant, sub }) {
  return (
    <div className={`ac-metric-card ac-metric-card--${variant}`} data-testid={`school-card-ac-metric-${label.replace(/\s+/g,"-").toLowerCase()}`}>
      <div className="ac-metric-card__icon">{icon}</div>
      <div className="ac-metric-card__body">
        <div className="ac-metric-card__value">{value}</div>
        <div className="ac-metric-card__label">{label}</div>
        {sub && <div className="ac-metric-card__sub">{sub}</div>}
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
    <div className="ac-modal-overlay" role="dialog" aria-modal="true" data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`ac-modal${wide ? " ac-modal--wide" : ""}`}>
        <div className="ac-modal__header">
          <h3 className="ac-modal__title">{title}</h3>
          <button className="ac-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Event Form Modal ─────────────────────────────────────────────────────────
function EventFormModal({ event, onClose, onSave }) {
  const isEdit = Boolean(event);
  const [form, setForm] = useState(isEdit
    ? { title: event.title, type: event.type, date: event.date, branch: event.branch, description: event.description }
    : { title: "", type: "exam", date: "", branch: "All Branches", description: "" }
  );
  const [err, setErr] = useState({});

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErr((p) => ({ ...p, [f]: undefined })); };

  const save = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.date)          e.date  = "Date is required";
    if (Object.keys(e).length) { setErr(e); return; }
    onSave(form);
  };

  return (
    <Modal title={isEdit ? `Edit Event` : "Add New Event"} onClose={onClose} wide testId="school-modal-ac-event">
      <div className="ac-modal__body ac-modal__body--scroll">
        <div className="ac-form-grid">
          <div className="ac-form-group ac-form-group--full">
            <label className="ac-form-label">Event Title *</label>
            <input className={`ac-form-input${err.title?" ac-form-input--error":""}`} value={form.title}
              onChange={(e)=>set("title",e.target.value)} placeholder="e.g. Annual Sports Day"
              data-testid="school-input-ac-event-title"/>
            {err.title && <span className="ac-form-error">{err.title}</span>}
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label">Event Type</label>
            <select className="ac-form-select" value={form.type} onChange={(e)=>set("type",e.target.value)} data-testid="school-dropdown-ac-event-type">
              {Object.entries(EVENT_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label">Date *</label>
            <input type="date" className={`ac-form-input${err.date?" ac-form-input--error":""}`} value={form.date}
              onChange={(e)=>set("date",e.target.value)} data-testid="school-input-ac-event-date"/>
            {err.date && <span className="ac-form-error">{err.date}</span>}
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label">Branch</label>
            <select className="ac-form-select" value={form.branch} onChange={(e)=>set("branch",e.target.value)} data-testid="school-dropdown-ac-event-branch">
              <option>All Branches</option><option>Main Campus</option><option>North Branch</option><option>East Branch</option>
            </select>
          </div>
          <div className="ac-form-group ac-form-group--full">
            <label className="ac-form-label">Description</label>
            <textarea className="ac-form-textarea" rows={3} value={form.description}
              onChange={(e)=>set("description",e.target.value)} placeholder="Brief event description…" data-testid="school-textarea-ac-event-desc"/>
          </div>
        </div>
      </div>
      <div className="ac-modal__footer">
        <button className="ac-btn ac-btn--ghost" onClick={onClose} data-testid="school-button-ac-event-cancel">Cancel</button>
        <button className="ac-btn ac-btn--primary" onClick={save} data-testid="school-button-ac-event-save">{isEdit?"Save Changes":"Add Event"}</button>
      </div>
    </Modal>
  );
}

// ─── Holiday Form Modal ───────────────────────────────────────────────────────
function HolidayFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name:"", date:"", type:"national", branch:"All Branches" });
  const [err, setErr] = useState({});
  const set = (f,v) => { setForm(p=>({...p,[f]:v})); setErr(p=>({...p,[f]:undefined})); };
  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name="Name required";
    if (!form.date)        e.date="Date required";
    if (Object.keys(e).length){setErr(e);return;}
    onSave(form);
  };
  return (
    <Modal title="Add Holiday" onClose={onClose} testId="school-modal-ac-holiday">
      <div className="ac-modal__body">
        <div className="ac-form-grid">
          <div className="ac-form-group ac-form-group--full">
            <label className="ac-form-label">Holiday Name *</label>
            <input className={`ac-form-input${err.name?" ac-form-input--error":""}`} value={form.name}
              onChange={(e)=>set("name",e.target.value)} placeholder="e.g. Diwali" data-testid="school-input-ac-holiday-name"/>
            {err.name&&<span className="ac-form-error">{err.name}</span>}
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label">Date *</label>
            <input type="date" className={`ac-form-input${err.date?" ac-form-input--error":""}`} value={form.date}
              onChange={(e)=>set("date",e.target.value)} data-testid="school-input-ac-holiday-date"/>
            {err.date&&<span className="ac-form-error">{err.date}</span>}
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label">Type</label>
            <select className="ac-form-select" value={form.type} onChange={(e)=>set("type",e.target.value)} data-testid="school-dropdown-ac-holiday-type">
              <option value="national">National</option><option value="local">Local</option><option value="emergency">Emergency Closure</option>
            </select>
          </div>
          <div className="ac-form-group ac-form-group--full">
            <label className="ac-form-label">Applicable Branch</label>
            <select className="ac-form-select" value={form.branch} onChange={(e)=>set("branch",e.target.value)} data-testid="school-dropdown-ac-holiday-branch">
              <option>All Branches</option><option>Main Campus</option><option>North Branch</option><option>East Branch</option><option>Bangalore Branches</option>
            </select>
          </div>
        </div>
      </div>
      <div className="ac-modal__footer">
        <button className="ac-btn ac-btn--ghost" onClick={onClose} data-testid="school-button-ac-holiday-cancel">Cancel</button>
        <button className="ac-btn ac-btn--primary" onClick={save} data-testid="school-button-ac-holiday-save">Add Holiday</button>
      </div>
    </Modal>
  );
}

// ─── Calendar Grid ────────────────────────────────────────────────────────────
function CalendarGrid({ events, year, month, onMonthChange }) {
  const cells = useMemo(() => getCalendarDays(year, month), [year, month]);
  const eventsByDay = useMemo(() => {
    const m = {};
    events.forEach((ev) => {
      const d = new Date(ev.date + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!m[day]) m[day] = [];
        m[day].push(ev);
      }
    });
    return m;
  }, [events, year, month]);

  const today = new Date();
  return (
    <div className="ac-calendar" data-testid="school-calendar-ac-grid">
      <div className="ac-calendar__nav">
        <button className="ac-btn ac-btn--ghost ac-btn--sm" onClick={() => onMonthChange(-1)} data-testid="school-button-ac-prev-month">‹ Prev</button>
        <h3 className="ac-calendar__month">{MONTHS[month]} {year}</h3>
        <button className="ac-btn ac-btn--ghost ac-btn--sm" onClick={() => onMonthChange(1)} data-testid="school-button-ac-next-month">Next ›</button>
      </div>
      <div className="ac-calendar__grid">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="ac-calendar__day-header">{d}</div>
        ))}
        {cells.map((day, i) => {
          const isToday = day && today.getDate()===day && today.getMonth()===month && today.getFullYear()===year;
          const dayEvents = day ? (eventsByDay[day] || []) : [];
          return (
            <div key={i} className={`ac-calendar__cell${day?" ac-calendar__cell--day":""}${isToday?" ac-calendar__cell--today":""}`}>
              {day && <span className="ac-calendar__date">{day}</span>}
              {dayEvents.slice(0,2).map((ev) => (
                <div key={ev.id} className="ac-calendar__event-dot"
                  style={{ background: EVENT_TYPES[ev.type]?.color }}
                  title={ev.title}/>
              ))}
              {dayEvents.length > 2 && <span className="ac-calendar__more">+{dayEvents.length-2}</span>}
            </div>
          );
        })}
      </div>
      <div className="ac-calendar__legend">
        {Object.entries(EVENT_TYPES).slice(0,5).map(([k,v])=>(
          <span key={k} className="ac-calendar__legend-item">
            <span style={{background:v.color}} className="ac-calendar__legend-dot"/>
            {v.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs Content Components ──────────────────────────────────────────────────
function OverviewTab({ events, calYear, calMonth, onMonthChange }) {
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0,5);
  const metrics = [
    { icon:"📅", value: events.length, label:"Total Events", variant:"primary" },
    { icon:"🎉", value: events.filter(e=>e.type!=="exam"&&e.type!=="holiday").length, label:"Academic Events", variant:"info" },
    { icon:"🏖",  value: MOCK_HOLIDAYS.length, label:"Holidays",       variant:"success" },
    { icon:"📝", value: events.filter(e=>e.type==="exam").length,       label:"Exams Scheduled", variant:"warning" },
  ];
  return (
    <div className="ac-tab-content" data-testid="school-container-ac-overview">
      <div className="ac-metrics">
        {metrics.map((m) => <MetricCard key={m.label} {...m}/>)}
      </div>
      <div className="ac-overview-grid">
        <div className="ac-card ac-card--upcoming">
          <h4 className="ac-card__title">Upcoming Events</h4>
          <div className="ac-event-list">
            {upcoming.map((ev) => (
              <div key={ev.id} className="ac-event-row" data-testid={`school-row-ac-event-${ev.id}`}>
                <div className="ac-event-row__dot" style={{ background: EVENT_TYPES[ev.type]?.color }}/>
                <div className="ac-event-row__info">
                  <p className="ac-event-row__title">{ev.title}</p>
                  <p className="ac-event-row__meta">{formatDate(ev.date)} · {ev.branch}</p>
                </div>
                <EventTypeBadge type={ev.type}/>
              </div>
            ))}
          </div>
        </div>
        <CalendarGrid events={events} year={calYear} month={calMonth} onMonthChange={onMonthChange}/>
      </div>
    </div>
  );
}

function EventsTab({ events, setEvents, setModal }) {
  const [search, setSearch] = useState("");
  const [typeF, setTypeF] = useState("all");
  const filtered = useMemo(() => {
    let l = events;
    if (typeF !== "all") l = l.filter((e) => e.type === typeF);
    if (search.trim()) {
      const q = search.toLowerCase();
      l = l.filter((e) => e.title.toLowerCase().includes(q));
    }
    return l;
  }, [events, typeF, search]);

  return (
    <div className="ac-tab-content" data-testid="school-container-ac-events">
      <div className="ac-toolbar">
        <div className="ac-toolbar__search">
          <span>🔍</span>
          <input className="ac-toolbar__input" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search events…" data-testid="school-input-ac-search"/>
          {search && <button className="ac-toolbar__clear" onClick={()=>setSearch("")}>✕</button>}
        </div>
        <div className="ac-toolbar__filters">
          <select className="ac-toolbar__select" value={typeF} onChange={(e)=>setTypeF(e.target.value)} data-testid="school-dropdown-ac-type-filter">
            <option value="all">All Types</option>
            {Object.entries(EVENT_TYPES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          <span className="ac-results-count">{filtered.length} events</span>
          <button className="ac-btn ac-btn--primary ac-btn--sm" onClick={()=>setModal({type:"event"})} data-testid="school-button-ac-add-event">+ Add Event</button>
        </div>
      </div>
      <div className="ac-events-grid">
        {filtered.map((ev) => (
          <div key={ev.id} className="ac-event-card" style={{"--ac-evt-color": EVENT_TYPES[ev.type]?.color}} data-testid={`school-card-ac-event-${ev.id}`}>
            <div className="ac-event-card__header">
              <EventTypeBadge type={ev.type}/>
              <StatusBadge status={ev.status}/>
            </div>
            <h4 className="ac-event-card__title">{ev.title}</h4>
            <p className="ac-event-card__desc">{ev.description}</p>
            <div className="ac-event-card__meta">
              <span>📅 {formatDate(ev.date)}</span>
              <span>📍 {ev.branch}</span>
            </div>
            {ev.classes?.[0] !== "N/A" && <div className="ac-event-card__classes">{ev.classes.slice(0,3).map(c=><span key={c} className="ac-class-tag">{c}</span>)}</div>}
            <div className="ac-event-card__footer">
              <button className="ac-btn ac-btn--outline ac-btn--xs" onClick={()=>setModal({type:"event",event:ev})} data-testid={`school-button-ac-edit-${ev.id}`}>Edit</button>
              <button className="ac-btn ac-btn--ghost ac-btn--xs" onClick={()=>setEvents(p=>p.filter(e=>e.id!==ev.id))} data-testid={`school-button-ac-delete-${ev.id}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HolidaysTab({ holidays, setHolidays, setModal }) {
  return (
    <div className="ac-tab-content" data-testid="school-container-ac-holidays">
      <div className="ac-toolbar ac-toolbar--simple">
        <p className="ac-toolbar__info">{holidays.length} holidays configured for Academic Year 2026-27</p>
        <button className="ac-btn ac-btn--primary ac-btn--sm" onClick={()=>setModal({type:"holiday"})} data-testid="school-button-ac-add-holiday">+ Add Holiday</button>
      </div>
      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr><th>Holiday Name</th><th>Date</th><th>Type</th><th>Branch</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.id} data-testid={`school-row-ac-holiday-${h.id}`}>
                <td><strong>{h.name}</strong></td>
                <td>{formatDate(h.date)}</td>
                <td><span className={`ac-type-badge ac-type-badge--${h.type}`}>{h.type.charAt(0).toUpperCase()+h.type.slice(1)}</span></td>
                <td>{h.branch}</td>
                <td><button className="ac-btn ac-btn--ghost ac-btn--xs" onClick={()=>setHolidays(p=>p.filter(x=>x.id!==h.id))} data-testid={`school-button-ac-del-holiday-${h.id}`}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExamScheduleTab() {
  return (
    <div className="ac-tab-content" data-testid="school-container-ac-exams">
      <div className="ac-toolbar ac-toolbar--simple">
        <p className="ac-toolbar__info">{MOCK_EXAMS.length} exam schedules for 2026-27</p>
        <button className="ac-btn ac-btn--primary ac-btn--sm" data-testid="school-button-ac-add-exam">+ Schedule Exam</button>
      </div>
      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr><th>Exam Name</th><th>Month</th><th>Classes</th><th>Subjects</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {MOCK_EXAMS.map((ex) => (
              <tr key={ex.id} data-testid={`school-row-ac-exam-${ex.id}`}>
                <td><strong>{ex.name}</strong></td>
                <td>{ex.month}</td>
                <td>{ex.classes}</td>
                <td>{ex.subjects}</td>
                <td><StatusBadge status={ex.status}/></td>
                <td>
                  <div style={{display:"flex",gap:".375rem"}}>
                    <button className="ac-btn ac-btn--outline ac-btn--xs" data-testid={`school-button-ac-edit-exam-${ex.id}`}>Edit</button>
                    <button className="ac-btn ac-btn--ghost ac-btn--xs" data-testid={`school-button-ac-view-exam-${ex.id}`}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MeetingsTab() {
  return (
    <div className="ac-tab-content" data-testid="school-container-ac-meetings">
      <div className="ac-toolbar ac-toolbar--simple">
        <p className="ac-toolbar__info">{MOCK_MEETINGS.length} meetings & activities scheduled</p>
        <button className="ac-btn ac-btn--primary ac-btn--sm" data-testid="school-button-ac-add-meeting">+ Add Meeting</button>
      </div>
      <div className="ac-events-grid">
        {MOCK_MEETINGS.map((m) => (
          <div key={m.id} className="ac-meeting-card" data-testid={`school-card-ac-meeting-${m.id}`}>
            <div className="ac-meeting-card__header">
              <span className={`ac-type-badge ac-type-badge--${m.type}`}>{m.type.toUpperCase()}</span>
              <StatusBadge status={m.status}/>
            </div>
            <h4 className="ac-meeting-card__title">{m.title}</h4>
            <div className="ac-meeting-card__meta">
              <span>📅 {formatDate(m.date)}</span>
              <span>👥 {m.attendees}</span>
            </div>
            <div className="ac-meeting-card__footer">
              <button className="ac-btn ac-btn--outline ac-btn--xs" data-testid={`school-button-ac-edit-meeting-${m.id}`}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({
    showHolidays: true, showExams: true, showMeetings: true, showEvents: true,
    workingDays: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    academicYear: "2026-27", termSystem: "2-term",
  });
  const toggle = (k) => setSettings((p) => ({ ...p, [k]: !p[k] }));
  return (
    <div className="ac-tab-content" data-testid="school-container-ac-settings">
      <div className="ac-settings-grid">
        <div className="ac-settings-card">
          <h4 className="ac-settings-card__title">Calendar Display</h4>
          {[["showHolidays","Show Holidays"],["showExams","Show Exams"],["showMeetings","Show Meetings"],["showEvents","Show Events"]].map(([k,l])=>(
            <div key={k} className="ac-settings-row">
              <span className="ac-settings-row__label">{l}</span>
              <button className={`ac-toggle${settings[k]?" ac-toggle--on":""}`} onClick={()=>toggle(k)} data-testid={`school-toggle-ac-${k}`}>
                <span className="ac-toggle__knob"/>
              </button>
            </div>
          ))}
        </div>
        <div className="ac-settings-card">
          <h4 className="ac-settings-card__title">Academic Year Config</h4>
          <div className="ac-form-group">
            <label className="ac-form-label">Current Academic Year</label>
            <select className="ac-form-select" value={settings.academicYear} onChange={(e)=>setSettings(p=>({...p,academicYear:e.target.value}))} data-testid="school-dropdown-ac-year">
              <option>2025-26</option><option>2026-27</option><option>2027-28</option>
            </select>
          </div>
          <div className="ac-form-group" style={{marginTop:".75rem"}}>
            <label className="ac-form-label">Term System</label>
            <select className="ac-form-select" value={settings.termSystem} onChange={(e)=>setSettings(p=>({...p,termSystem:e.target.value}))} data-testid="school-dropdown-ac-terms">
              <option value="2-term">2-Term System</option><option value="3-term">3-Term System</option><option value="semester">Semester</option>
            </select>
          </div>
        </div>
        <div className="ac-settings-card">
          <h4 className="ac-settings-card__title">Working Days</h4>
          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day)=>(
            <div key={day} className="ac-settings-row">
              <span className="ac-settings-row__label">{day}</span>
              <button
                className={`ac-toggle${settings.workingDays.includes(day)?" ac-toggle--on":""}`}
                onClick={()=>setSettings(p=>({...p,workingDays:p.workingDays.includes(day)?p.workingDays.filter(d=>d!==day):[...p.workingDays,day]}))}
                data-testid={`school-toggle-ac-day-${day}`}
              >
                <span className="ac-toggle__knob"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AC_TABS = [
  ["overview",  "Overview"],
  ["events",    "Academic Events"],
  ["holidays",  "Holidays"],
  ["exams",     "Exam Schedule"],
  ["meetings",  "Meetings"],
  ["settings",  "Settings"],
];

export default function AcademicCalendar() {
  const [tab, setTab]           = useState("overview");
  const [events, setEvents]     = useState(MOCK_EVENTS);
  const [holidays, setHolidays] = useState(MOCK_HOLIDAYS);
  const [calYear, setCalYear]   = useState(CURRENT_YEAR);
  const [calMonth, setCalMonth] = useState(CURRENT_MONTH);
  const [modal, setModal]       = useState(null);
  const closeModal              = useCallback(() => setModal(null), []);

  const onMonthChange = useCallback((dir) => {
    setCalMonth((m) => {
      const next = m + dir;
      if (next < 0)  { setCalYear((y) => y - 1); return 11; }
      if (next > 11) { setCalYear((y) => y + 1); return 0; }
      return next;
    });
  }, []);

  const handleSaveEvent = useCallback((form) => {
    if (modal?.event) {
      setEvents((p) => p.map((e) => e.id === modal.event.id ? { ...e, ...form } : e));
    } else {
      setEvents((p) => [...p, { id:`E${String(Date.now()).slice(-4)}`, ...form, status:"upcoming", classes:["All"] }]);
    }
    closeModal();
  }, [modal, closeModal]);

  const handleSaveHoliday = useCallback((form) => {
    setHolidays((p) => [...p, { id:`H${String(Date.now()).slice(-4)}`, ...form }]);
    closeModal();
  }, [closeModal]);

  return (
    <div className="ac-root" data-testid="school-page-academic-calendar">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Academic Setup" },
          { label: "Academic Calendar" },
        ]}
        title="Academic Calendar"
        subtitle="Centralized academic planning — events, holidays and exam schedule"
        actions={(
          <>
            <button className="ac-btn ac-btn--ghost ac-btn--sm" data-testid="school-button-ac-export">⬇ Export</button>
            <button className="ac-btn ac-btn--primary" onClick={()=>setModal({type:"event"})} data-testid="school-button-ac-add">+ Add Event</button>
          </>
        )}
      />

      <div className="ac-tabs-bar" data-testid="school-tabs-ac">
        {AC_TABS.map(([key,label])=>(
          <button key={key} className={`ac-tabs-bar__btn${tab===key?" ac-tabs-bar__btn--active":""}`}
            onClick={()=>setTab(key)} data-testid={`school-tab-ac-${key}`}>{label}</button>
        ))}
      </div>

      {tab === "overview"  && <OverviewTab events={events} calYear={calYear} calMonth={calMonth} onMonthChange={onMonthChange}/>}
      {tab === "events"    && <EventsTab events={events} setEvents={setEvents} setModal={setModal}/>}
      {tab === "holidays"  && <HolidaysTab holidays={holidays} setHolidays={setHolidays} setModal={setModal}/>}
      {tab === "exams"     && <ExamScheduleTab/>}
      {tab === "meetings"  && <MeetingsTab/>}
      {tab === "settings"  && <SettingsTab/>}

      {modal?.type === "event"   && <EventFormModal   event={modal.event||null} onClose={closeModal} onSave={handleSaveEvent}/>}
      {modal?.type === "holiday" && <HolidayFormModal onClose={closeModal} onSave={handleSaveHoliday}/>}
    </div>
  );
}