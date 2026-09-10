/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/AttendanceRules.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STUDENT_RULES = [
  { id:"SR001", name:"Minimum Attendance %",       value:75, unit:"%",  category:"threshold", desc:"Students below this % are flagged for attendance shortage.", editKey:"minPct"    },
  { id:"SR002", name:"Exam Eligibility Threshold", value:65, unit:"%",  category:"threshold", desc:"Minimum attendance required to appear in exams.",           editKey:"examPct"   },
  { id:"SR003", name:"Shortage Warning Level",     value:80, unit:"%",  category:"warning",   desc:"Students below this % receive an early warning notice.",    editKey:"warnPct"   },
  { id:"SR004", name:"Maximum Medical Leave Days", value:15, unit:"days",category:"leave",    desc:"Per academic year medical leave days without marks penalty.", editKey:"medDays"   },
  { id:"SR005", name:"Late Entry Grace Period",    value:10, unit:"min", category:"late",     desc:"Students arriving within this window are marked Present.",   editKey:"lateGrace" },
  { id:"SR006", name:"Half-Day Threshold",         value:3,  unit:"periods", category:"late", desc:"Absence beyond this many periods counts as full-day absence.",editKey:"halfDay" },
];

const MOCK_STAFF_RULES = [
  { id:"STR001", name:"Min Attendance % – Teachers",  value:90, unit:"%",    category:"threshold", desc:"Teachers must maintain this attendance for monthly salary." },
  { id:"STR002", name:"Late Arrival Tolerance",        value:15, unit:"min",  category:"late",      desc:"Minutes after scheduled start before marking late."         },
  { id:"STR003", name:"Max Casual Leave Per Month",    value:2,  unit:"days", category:"leave",     desc:"Casual leave allowed per calendar month."                    },
  { id:"STR004", name:"Half-Day Threshold – Staff",    value:4,  unit:"hours",category:"late",     desc:"Hours worked below which attendance is marked as half-day." },
];

const MOCK_EXEMPTIONS = [
  { id:"EX001", name:"Riya Sharma",   role:"student", type:"medical",  startDate:"2026-04-10", endDate:"2026-04-20", reason:"Surgery recovery",       status:"approved" },
  { id:"EX002", name:"Coach Rajan",   role:"staff",   type:"sports",   startDate:"2026-04-15", endDate:"2026-04-17", reason:"National Coaching Camp",  status:"approved" },
  { id:"EX003", name:"Aman Verma",    role:"student", type:"sports",   startDate:"2026-05-08", endDate:"2026-05-10", reason:"State-level athletics",   status:"approved" },
  { id:"EX004", name:"Sara Thomas",   role:"student", type:"event",    startDate:"2026-05-22", endDate:"2026-05-22", reason:"Cultural team performance",status:"pending"  },
  { id:"EX005", name:"Mr. Singh",     role:"staff",   type:"special",  startDate:"2026-06-01", endDate:"2026-06-03", reason:"Family bereavement",      status:"approved" },
];

const MOCK_ALERTS = [
  { id:"AL001", channel:"sms",   trigger:"below_75", label:"SMS on <75% Attendance",   enabled:true  },
  { id:"AL002", channel:"email", trigger:"below_75", label:"Email on <75% Attendance", enabled:true  },
  { id:"AL003", channel:"sms",   trigger:"below_65", label:"SMS on <65% – Danger",     enabled:true  },
  { id:"AL004", channel:"email", trigger:"exam_risk", label:"Email on Exam Risk Flag",  enabled:false },
  { id:"AL005", channel:"email", trigger:"3_absent",  label:"Email on 3 Consec. Absences",enabled:true},
  { id:"AL006", channel:"sms",   trigger:"recover",  label:"SMS on Attendance Recovery",enabled:false },
];

const MOCK_POLICIES = [
  { id:"PL001", name:"General Attendance Policy",   scope:"All Students",       branch:"All Branches", status:"active",   summary:"Standard 75% rule with medical exemptions." },
  { id:"PL002", name:"Board Class Policy",           scope:"Class 10 & 12",      branch:"Main Campus",  status:"active",   summary:"85% mandatory. Exam eligibility at 75%." },
  { id:"PL003", name:"Sports Exemption Policy",      scope:"Sports Team Members", branch:"All Branches", status:"active",   summary:"Matches and tournaments counted as present." },
  { id:"PL004", name:"Staff Attendance Policy",      scope:"Teaching Staff",      branch:"All Branches", status:"active",   summary:"90% minimum with half-day provisions." },
  { id:"PL005", name:"Part-Time Staff Policy",       scope:"Part-Time Faculty",   branch:"All Branches", status:"draft",    summary:"Attendance by session count, not daily." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function CategoryBadge({ category }) {
  const MAP = {
    threshold: { label:"Threshold", color:"#2563eb" },
    warning:   { label:"Warning",   color:"#d97706" },
    leave:     { label:"Leave",     color:"#16a34a" },
    late:      { label:"Late",      color:"#7c3aed" },
  };
  const s = MAP[category] || MAP.threshold;
  return <span className="ar-badge" style={{ background:`rgba(${hexRgb(s.color)},.1)`, color:s.color }}>{s.label}</span>;
}

function hexRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function StatusBadge({ status }) {
  const M = { active:{l:"Active",c:"success"}, draft:{l:"Draft",c:"warning"}, archived:{l:"Archived",c:"neutral"}, approved:{l:"Approved",c:"success"}, pending:{l:"Pending",c:"warning"}, rejected:{l:"Rejected",c:"danger"} };
  const s = M[status] || M.active;
  return <span className={`ar-status ar-status--${s.c}`}>{s.l}</span>;
}

function MetricCard({ icon, value, label, variant, sub }) {
  return (
    <div className={`ar-metric-card ar-metric-card--${variant}`} data-testid={`school-card-ar-metric-${label.replace(/\s+/g,"-").toLowerCase()}`}>
      <div className="ar-metric-card__icon">{icon}</div>
      <div className="ar-metric-card__body">
        <div className="ar-metric-card__value">{value}</div>
        <div className="ar-metric-card__label">{label}</div>
        {sub && <div className="ar-metric-card__sub">{sub}</div>}
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
    <div className="ar-modal-overlay" role="dialog" aria-modal="true" data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`ar-modal${wide?" ar-modal--wide":""}`}>
        <div className="ar-modal__header">
          <h3 className="ar-modal__title">{title}</h3>
          <button className="ar-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Exemption Form Modal ─────────────────────────────────────────────────────
function ExemptionFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name:"", role:"student", type:"medical", startDate:"", endDate:"", reason:"" });
  const [err, setErr]   = useState({});
  const set = (f,v) => { setForm(p=>({...p,[f]:v})); setErr(p=>({...p,[f]:undefined})); };
  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name="Name required";
    if (!form.startDate)   e.startDate="Start date required";
    if (!form.endDate)     e.endDate="End date required";
    if (!form.reason.trim()) e.reason="Reason required";
    if (Object.keys(e).length){setErr(e);return;}
    onSave(form);
  };
  return (
    <Modal title="Add Exemption" onClose={onClose} wide testId="school-modal-ar-exemption">
      <div className="ar-modal__body ar-modal__body--scroll">
        <div className="ar-form-grid">
          <div className="ar-form-group">
            <label className="ar-form-label">Name *</label>
            <input className={`ar-form-input${err.name?" ar-form-input--error":""}`} value={form.name}
              onChange={(e)=>set("name",e.target.value)} placeholder="Student/Staff name" data-testid="school-input-ar-exemption-name"/>
            {err.name&&<span className="ar-form-error">{err.name}</span>}
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">Role</label>
            <select className="ar-form-select" value={form.role} onChange={(e)=>set("role",e.target.value)} data-testid="school-dropdown-ar-exemption-role">
              <option value="student">Student</option><option value="staff">Staff</option>
            </select>
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">Exemption Type</label>
            <select className="ar-form-select" value={form.type} onChange={(e)=>set("type",e.target.value)} data-testid="school-dropdown-ar-exemption-type">
              <option value="medical">Medical</option><option value="sports">Sports</option><option value="event">Cultural Event</option><option value="special">Special</option>
            </select>
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">Start Date *</label>
            <input type="date" className={`ar-form-input${err.startDate?" ar-form-input--error":""}`} value={form.startDate}
              onChange={(e)=>set("startDate",e.target.value)} data-testid="school-input-ar-exemption-start"/>
            {err.startDate&&<span className="ar-form-error">{err.startDate}</span>}
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">End Date *</label>
            <input type="date" className={`ar-form-input${err.endDate?" ar-form-input--error":""}`} value={form.endDate}
              onChange={(e)=>set("endDate",e.target.value)} data-testid="school-input-ar-exemption-end"/>
            {err.endDate&&<span className="ar-form-error">{err.endDate}</span>}
          </div>
          <div className="ar-form-group ar-form-group--full">
            <label className="ar-form-label">Reason *</label>
            <textarea className="ar-form-textarea" rows={3} value={form.reason}
              onChange={(e)=>set("reason",e.target.value)} placeholder="Explain the reason for exemption…"
              data-testid="school-textarea-ar-exemption-reason"/>
            {err.reason&&<span className="ar-form-error">{err.reason}</span>}
          </div>
        </div>
      </div>
      <div className="ar-modal__footer">
        <button className="ar-btn ar-btn--ghost" onClick={onClose} data-testid="school-button-ar-exemption-cancel">Cancel</button>
        <button className="ar-btn ar-btn--primary" onClick={save} data-testid="school-button-ar-exemption-save">Add Exemption</button>
      </div>
    </Modal>
  );
}

// ─── Edit Rule Modal ──────────────────────────────────────────────────────────
function EditRuleModal({ rule, onClose, onSave }) {
  const [val, setVal] = useState(String(rule.value));
  const [err, setErr] = useState("");
  const save = () => {
    const n = parseFloat(val);
    if (isNaN(n)||n<0) { setErr("Enter a valid number"); return; }
    onSave(n);
  };
  return (
    <Modal title={`Edit: ${rule.name}`} onClose={onClose} testId="school-modal-ar-rule">
      <div className="ar-modal__body">
        <div className="ar-form-group">
          <label className="ar-form-label">Value ({rule.unit})</label>
          <input type="number" className={`ar-form-input${err?" ar-form-input--error":""}`}
            value={val} onChange={(e)=>{setVal(e.target.value);setErr("");}}
            data-testid="school-input-ar-rule-value"/>
          {err && <span className="ar-form-error">{err}</span>}
        </div>
        <p className="ar-form-hint">{rule.desc}</p>
      </div>
      <div className="ar-modal__footer">
        <button className="ar-btn ar-btn--ghost" onClick={onClose} data-testid="school-button-ar-rule-cancel">Cancel</button>
        <button className="ar-btn ar-btn--primary" onClick={save} data-testid="school-button-ar-rule-save">Save</button>
      </div>
    </Modal>
  );
}

// ─── Policy Form Modal ────────────────────────────────────────────────────────
function PolicyFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name:"", scope:"All Students", branch:"All Branches", summary:"", status:"draft" });
  const [err, setErr] = useState({});
  const set = (f,v) => { setForm(p=>({...p,[f]:v})); setErr(p=>({...p,[f]:undefined})); };
  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name="Name required";
    if (!form.summary.trim()) e.summary="Summary required";
    if (Object.keys(e).length){setErr(e);return;}
    onSave(form);
  };
  return (
    <Modal title="Create Policy" onClose={onClose} wide testId="school-modal-ar-policy">
      <div className="ar-modal__body">
        <div className="ar-form-grid">
          <div className="ar-form-group ar-form-group--full">
            <label className="ar-form-label">Policy Name *</label>
            <input className={`ar-form-input${err.name?" ar-form-input--error":""}`} value={form.name}
              onChange={(e)=>set("name",e.target.value)} placeholder="e.g. Board Class Policy" data-testid="school-input-ar-policy-name"/>
            {err.name&&<span className="ar-form-error">{err.name}</span>}
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">Scope</label>
            <select className="ar-form-select" value={form.scope} onChange={(e)=>set("scope",e.target.value)} data-testid="school-dropdown-ar-policy-scope">
              <option>All Students</option><option>Class 10 & 12</option><option>Sports Team Members</option><option>Teaching Staff</option><option>Part-Time Faculty</option>
            </select>
          </div>
          <div className="ar-form-group">
            <label className="ar-form-label">Branch</label>
            <select className="ar-form-select" value={form.branch} onChange={(e)=>set("branch",e.target.value)} data-testid="school-dropdown-ar-policy-branch">
              <option>All Branches</option><option>Main Campus</option><option>North Branch</option><option>East Branch</option>
            </select>
          </div>
          <div className="ar-form-group ar-form-group--full">
            <label className="ar-form-label">Summary *</label>
            <textarea className="ar-form-textarea" rows={3} value={form.summary}
              onChange={(e)=>set("summary",e.target.value)} placeholder="Brief policy description…" data-testid="school-textarea-ar-policy-summary"/>
            {err.summary&&<span className="ar-form-error">{err.summary}</span>}
          </div>
        </div>
      </div>
      <div className="ar-modal__footer">
        <button className="ar-btn ar-btn--ghost" onClick={onClose} data-testid="school-button-ar-policy-cancel">Cancel</button>
        <button className="ar-btn ar-btn--primary" onClick={save} data-testid="school-button-ar-policy-save">Create Policy</button>
      </div>
    </Modal>
  );
}

// ─── Rule Card ────────────────────────────────────────────────────────────────
function RuleCard({ rule, onEdit }) {
  return (
    <div className="ar-rule-card" data-testid={`school-card-ar-rule-${rule.id}`}>
      <div className="ar-rule-card__header">
        <h4 className="ar-rule-card__name">{rule.name}</h4>
        <CategoryBadge category={rule.category}/>
      </div>
      <p className="ar-rule-card__desc">{rule.desc}</p>
      <div className="ar-rule-card__footer">
        <div className="ar-rule-card__value-block">
          <span className="ar-rule-card__value">{rule.value}</span>
          <span className="ar-rule-card__unit">{rule.unit}</span>
        </div>
        <button className="ar-btn ar-btn--outline ar-btn--sm" onClick={()=>onEdit(rule)} data-testid={`school-button-ar-edit-${rule.id}`}>Edit</button>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function OverviewTab() {
  const allRules = [...MOCK_STUDENT_RULES, ...MOCK_STAFF_RULES];
  const metrics = [
    { icon:"📊", value:"75%",  label:"Min Student Attendance",  variant:"primary", sub:"Required for classes" },
    { icon:"📋", value:MOCK_POLICIES.filter(p=>p.status==="active").length, label:"Active Policies", variant:"info" },
    { icon:"🏥", value:MOCK_EXEMPTIONS.filter(e=>e.status==="approved").length, label:"Active Exemptions", variant:"success" },
    { icon:"⚠️", value:MOCK_ALERTS.filter(a=>a.enabled).length, label:"Active Alerts", variant:"warning" },
  ];
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-overview">
      <div className="ar-metrics">
        {metrics.map(m=><MetricCard key={m.label} {...m}/>)}
      </div>
      <div className="ar-overview-summary">
        <div className="ar-summary-card">
          <h4 className="ar-summary-card__title">Quick Rule Summary</h4>
          <div className="ar-summary-rows">
            {allRules.slice(0,6).map(r=>(
              <div key={r.id} className="ar-summary-row" data-testid={`school-row-ar-summary-${r.id}`}>
                <span className="ar-summary-row__name">{r.name}</span>
                <span className="ar-summary-row__val">{r.value} <em>{r.unit}</em></span>
                <CategoryBadge category={r.category}/>
              </div>
            ))}
          </div>
        </div>
        <div className="ar-summary-card">
          <h4 className="ar-summary-card__title">Active Policies</h4>
          <div className="ar-policy-chips">
            {MOCK_POLICIES.map(p=>(
              <div key={p.id} className="ar-policy-chip" data-testid={`school-chip-ar-policy-${p.id}`}>
                <div className="ar-policy-chip__row">
                  <strong>{p.name}</strong>
                  <StatusBadge status={p.status}/>
                </div>
                <p className="ar-policy-chip__scope">{p.scope} · {p.branch}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentRulesTab({ rules, setRules, setModal }) {
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-student-rules">
      <div className="ar-section-head">
        <div>
          <h3 className="ar-section-head__title">Student Attendance Rules</h3>
          <p className="ar-section-head__sub">Configure minimum attendance, eligibility and leave rules for students</p>
        </div>
      </div>
      <div className="ar-rule-grid">
        {rules.map(r=><RuleCard key={r.id} rule={r} onEdit={(rule)=>setModal({type:"editRule",rule,scope:"student"})}/>)}
      </div>
    </div>
  );
}

function StaffRulesTab({ setModal }) {
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-staff-rules">
      <div className="ar-section-head">
        <div>
          <h3 className="ar-section-head__title">Staff Attendance Rules</h3>
          <p className="ar-section-head__sub">Configure attendance rules for teaching and non-teaching staff</p>
        </div>
      </div>
      <div className="ar-rule-grid">
        {MOCK_STAFF_RULES.map(r=><RuleCard key={r.id} rule={r} onEdit={(rule)=>setModal({type:"editRule",rule,scope:"staff"})}/>)}
      </div>
    </div>
  );
}

function ExemptionsTab({ exemptions, setExemptions, setModal }) {
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-exemptions">
      <div className="ar-toolbar ar-toolbar--simple">
        <p className="ar-toolbar__info">{exemptions.length} exemptions on record</p>
        <button className="ar-btn ar-btn--primary ar-btn--sm" onClick={()=>setModal({type:"exemption"})} data-testid="school-button-ar-add-exemption">+ Add Exemption</button>
      </div>
      <div className="ar-table-wrap">
        <table className="ar-table">
          <thead>
            <tr><th>Name</th><th>Role</th><th>Type</th><th>Period</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {exemptions.map(ex=>(
              <tr key={ex.id} data-testid={`school-row-ar-exemption-${ex.id}`}>
                <td><strong>{ex.name}</strong></td>
                <td><span className={`ar-role-badge ar-role-badge--${ex.role}`}>{ex.role.charAt(0).toUpperCase()+ex.role.slice(1)}</span></td>
                <td><span className={`ar-type-badge ar-type-badge--${ex.type}`}>{ex.type}</span></td>
                <td style={{whiteSpace:"nowrap"}}>{formatDate(ex.startDate)} – {formatDate(ex.endDate)}</td>
                <td style={{maxWidth:"200px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ex.reason}</td>
                <td><StatusBadge status={ex.status}/></td>
                <td>
                  <div style={{display:"flex",gap:".375rem"}}>
                    <button className="ar-btn ar-btn--ghost ar-btn--xs" onClick={()=>setExemptions(p=>p.filter(e=>e.id!==ex.id))} data-testid={`school-button-ar-del-ex-${ex.id}`}>Remove</button>
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

function AlertsTab({ alerts, setAlerts }) {
  const toggle = (id) => setAlerts(p=>p.map(a=>a.id===id?{...a,enabled:!a.enabled}:a));
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-alerts">
      <div className="ar-section-head">
        <div>
          <h3 className="ar-section-head__title">Alerts & Notifications</h3>
          <p className="ar-section-head__sub">Configure automated SMS and email alerts for attendance thresholds</p>
        </div>
      </div>
      <div className="ar-alert-grid">
        {alerts.map(al=>(
          <div key={al.id} className={`ar-alert-card${al.enabled?" ar-alert-card--on":""}`} data-testid={`school-card-ar-alert-${al.id}`}>
            <div className="ar-alert-card__icon">{al.channel==="sms"?"💬":"📧"}</div>
            <div className="ar-alert-card__body">
              <p className="ar-alert-card__label">{al.label}</p>
              <p className="ar-alert-card__channel">{al.channel.toUpperCase()}</p>
            </div>
            <button className={`ar-toggle${al.enabled?" ar-toggle--on":""}`}
              onClick={()=>toggle(al.id)} data-testid={`school-toggle-ar-alert-${al.id}`}>
              <span className="ar-toggle__knob"/>
            </button>
          </div>
        ))}
      </div>
      <div className="ar-alert-note">
        <span>ℹ️</span>
        <p>Alerts are sent to parents/guardians for students and HR department for staff. Configure contact numbers in the respective profiles.</p>
      </div>
    </div>
  );
}

function PoliciesTab({ policies, setPolicies, setModal }) {
  return (
    <div className="ar-tab-content" data-testid="school-container-ar-policies">
      <div className="ar-toolbar ar-toolbar--simple">
        <p className="ar-toolbar__info">{policies.length} policies configured</p>
        <button className="ar-btn ar-btn--primary ar-btn--sm" onClick={()=>setModal({type:"policy"})} data-testid="school-button-ar-add-policy">+ Create Policy</button>
      </div>
      <div className="ar-policy-grid">
        {policies.map(p=>(
          <div key={p.id} className={`ar-policy-card ar-policy-card--${p.status}`} data-testid={`school-card-ar-policy-${p.id}`}>
            <div className="ar-policy-card__header">
              <h4 className="ar-policy-card__name">{p.name}</h4>
              <StatusBadge status={p.status}/>
            </div>
            <p className="ar-policy-card__summary">{p.summary}</p>
            <div className="ar-policy-card__meta">
              <span>👥 {p.scope}</span>
              <span>📍 {p.branch}</span>
            </div>
            <div className="ar-policy-card__footer">
              <button className="ar-btn ar-btn--outline ar-btn--xs" data-testid={`school-button-ar-edit-policy-${p.id}`}>Edit</button>
              <button className="ar-btn ar-btn--ghost ar-btn--xs" onClick={()=>setPolicies(pr=>pr.map(x=>x.id===p.id?{...x,status:x.status==="active"?"draft":"active"}:x))} data-testid={`school-button-ar-toggle-policy-${p.id}`}>
                {p.status==="active"?"Deactivate":"Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AR_TABS = [
  ["overview",       "Overview"],
  ["student-rules",  "Student Rules"],
  ["staff-rules",    "Staff Rules"],
  ["exemptions",     "Exemptions"],
  ["alerts",         "Alerts"],
  ["policies",       "Policies"],
];

export default function AttendanceRules() {
  const [tab, setTab]               = useState("overview");
  const [studentRules, setStudentRules] = useState(MOCK_STUDENT_RULES);
  const [exemptions, setExemptions] = useState(MOCK_EXEMPTIONS);
  const [alerts, setAlerts]         = useState(MOCK_ALERTS);
  const [policies, setPolicies]     = useState(MOCK_POLICIES);
  const [modal, setModal]           = useState(null);
  const closeModal                  = useCallback(() => setModal(null), []);

  const handleSaveExemption = useCallback((form) => {
    setExemptions(p=>[...p, { id:`EX${String(Date.now()).slice(-4)}`, ...form, status:"pending" }]);
    closeModal();
  }, [closeModal]);

  const handleSavePolicy = useCallback((form) => {
    setPolicies(p=>[...p, { id:`PL${String(Date.now()).slice(-4)}`, ...form }]);
    closeModal();
  }, [closeModal]);

  const handleSaveRule = useCallback((val) => {
    if (modal?.scope === "student") {
      setStudentRules(p=>p.map(r=>r.id===modal.rule.id?{...r,value:val}:r));
    }
    closeModal();
  }, [modal, closeModal]);

  return (
    <div className="ar-root" data-testid="school-page-attendance-rules">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Academic Setup" },
          { label: "Attendance Rules" },
        ]}
        title="Attendance Rules"
        subtitle="Configure attendance thresholds, exemptions, alerts and policies"
        actions={(
          <>
            <button className="ar-btn ar-btn--ghost ar-btn--sm" data-testid="school-button-ar-export">⬇ Export Report</button>
            <button className="ar-btn ar-btn--primary" onClick={()=>setModal({type:"exemption"})} data-testid="school-button-ar-add">+ Add Exemption</button>
          </>
        )}
      />

      <div className="ar-tabs-bar" data-testid="school-tabs-ar">
        {AR_TABS.map(([key,label])=>(
          <button key={key} className={`ar-tabs-bar__btn${tab===key?" ar-tabs-bar__btn--active":""}`}
            onClick={()=>setTab(key)} data-testid={`school-tab-ar-${key}`}>{label}</button>
        ))}
      </div>

      {tab === "overview"      && <OverviewTab/>}
      {tab === "student-rules" && <StudentRulesTab rules={studentRules} setRules={setStudentRules} setModal={setModal}/>}
      {tab === "staff-rules"   && <StaffRulesTab setModal={setModal}/>}
      {tab === "exemptions"    && <ExemptionsTab exemptions={exemptions} setExemptions={setExemptions} setModal={setModal}/>}
      {tab === "alerts"        && <AlertsTab alerts={alerts} setAlerts={setAlerts}/>}
      {tab === "policies"      && <PoliciesTab policies={policies} setPolicies={setPolicies} setModal={setModal}/>}

      {modal?.type === "exemption" && <ExemptionFormModal onClose={closeModal} onSave={handleSaveExemption}/>}
      {modal?.type === "editRule"  && <EditRuleModal rule={modal.rule} onClose={closeModal} onSave={handleSaveRule}/>}
      {modal?.type === "policy"    && <PolicyFormModal onClose={closeModal} onSave={handleSavePolicy}/>}
    </div>
  );
}