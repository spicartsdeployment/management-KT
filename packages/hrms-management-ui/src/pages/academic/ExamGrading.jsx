/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/ExamGrading.scss";
import ManagementPageHeader from "../../app/components/common/ManagementPageHeader";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_EXAM_TYPES = [
  { id:"ET001", name:"Unit Test",           code:"UT",  maxMarks:25,  duration:60,  type:"written",   classes:"All",            desc:"Quarterly unit assessment.", status:"active" },
  { id:"ET002", name:"Mid-Term Examination",code:"MID", maxMarks:50,  duration:90,  type:"written",   classes:"All",            desc:"Mid-semester exam covering first half syllabus.", status:"active" },
  { id:"ET003", name:"Final / Annual Exam", code:"FIN", maxMarks:100, duration:180, type:"written",   classes:"All",            desc:"Annual board-style examination.", status:"active" },
  { id:"ET004", name:"Practical Exam",      code:"PRAC",maxMarks:30,  duration:120, type:"practical", classes:"Science, CS",    desc:"Lab-based practical exam.", status:"active" },
  { id:"ET005", name:"Viva / Oral",         code:"VIVA",maxMarks:20,  duration:30,  type:"oral",      classes:"All",            desc:"Spoken assessment by subject teacher.", status:"active" },
  { id:"ET006", name:"Internal Assessment", code:"IA",  maxMarks:20,  duration:null,type:"assignment", classes:"All",           desc:"Assignments, projects and quizzes.", status:"active" },
  { id:"ET007", name:"Prelim / Board Prep", code:"PRE", maxMarks:100, duration:180, type:"written",   classes:"Class 10, 12",  desc:"Board exam practice test.", status:"active" },
];

const MOCK_GRADING_SYSTEMS = [
  {
    id:"GS001", name:"Percentage Grading", type:"percentage", classes:"All",
    grades:[
      { grade:"A+", from:91, to:100, gpa:4.0, remark:"Outstanding"  },
      { grade:"A",  from:81, to:90,  gpa:3.7, remark:"Excellent"    },
      { grade:"B+", from:71, to:80,  gpa:3.3, remark:"Very Good"    },
      { grade:"B",  from:61, to:70,  gpa:3.0, remark:"Good"         },
      { grade:"C",  from:51, to:60,  gpa:2.5, remark:"Average"      },
      { grade:"D",  from:35, to:50,  gpa:2.0, remark:"Below Average"},
      { grade:"F",  from:0,  to:34,  gpa:0.0, remark:"Fail"         },
    ],
    status:"active",
  },
  {
    id:"GS002", name:"GPA 10-Point Scale", type:"gpa", classes:"Senior Secondary",
    grades:[
      { grade:"O",  from:91, to:100, gpa:10, remark:"Outstanding"  },
      { grade:"A1", from:81, to:90,  gpa:9,  remark:"Excellent"    },
      { grade:"A2", from:71, to:80,  gpa:8,  remark:"Very Good"    },
      { grade:"B1", from:61, to:70,  gpa:7,  remark:"Good"         },
      { grade:"B2", from:51, to:60,  gpa:6,  remark:"Above Average"},
      { grade:"C1", from:41, to:50,  gpa:5,  remark:"Average"      },
      { grade:"C2", from:33, to:40,  gpa:4,  remark:"Pass"         },
      { grade:"F",  from:0,  to:32,  gpa:0,  remark:"Fail"         },
    ],
    status:"active",
  },
];

const MOCK_PASS_CRITERIA = [
  { id:"PC001", scope:"All Students",     minTheory:33, minPractical:25, minOverall:35, examEligibility:65, status:"active"  },
  { id:"PC002", scope:"Class 10 & 12",    minTheory:33, minPractical:27, minOverall:35, examEligibility:75, status:"active"  },
  { id:"PC003", scope:"Pre-Primary",      minTheory:null,minPractical:null,minOverall:null,examEligibility:null, status:"active", note:"Grade-based, no numeric pass criteria." },
  { id:"PC004", scope:"Sports Quota",     minTheory:28, minPractical:20, minOverall:30, examEligibility:55, status:"active"  },
];

const MOCK_WEIGHTAGE = [
  { id:"W001", exam:"Unit Test",            term1:20, term2:20, internal:30, external:70 },
  { id:"W002", exam:"Mid-Term Examination", term1:30, term2:30, internal:30, external:70 },
  { id:"W003", exam:"Internal Assessment",  term1:20, term2:20, internal:100, external:0 },
  { id:"W004", exam:"Final / Annual Exam",  term1:50, term2:50, internal:20, external:80 },
  { id:"W005", exam:"Practical Exam",       term1:30, term2:30, internal:40, external:60 },
];

const EVAL_POLICIES = [
  { id:"EP001", name:"Grace Marks Policy",         desc:"Upto 5 grace marks applicable per subject on borderline failures (28-33).", status:"active"   },
  { id:"EP002", name:"Moderation Policy",          desc:"Scaling applied where class average drops below 40%.",                      status:"active"   },
  { id:"EP003", name:"Re-evaluation Request",      desc:"Students may apply for re-check within 7 days of result declaration.",      status:"active"   },
  { id:"EP004", name:"Supplementary Exam Policy",  desc:"Students failing in ≤2 subjects eligible for supplementary exam.",          status:"active"   },
  { id:"EP005", name:"Absent / Medical Exam",      desc:"Students absent for valid medical reasons may sit a makeup exam.",          status:"active"   },
  { id:"EP006", name:"Practical Exemption",        desc:"Students with < 60% practical attendance must sit an additional viva.",     status:"draft"    },
];

// ─── Atoms ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const M = { active:{l:"Active",c:"success"}, draft:{l:"Draft",c:"warning"}, archived:{l:"Archived",c:"neutral"} };
  const s = M[status] || M.active;
  return <span className={`eg-status eg-status--${s.c}`}>{s.l}</span>;
}

function TypeBadge({ type }) {
  const M = { written:{l:"Written",c:"info"}, practical:{l:"Practical",c:"success"}, oral:{l:"Oral",c:"purple"}, assignment:{l:"Assignment",c:"gold"} };
  const s = M[type] || M.written;
  return <span className={`eg-type-badge eg-type-badge--${s.c}`}>{s.l}</span>;
}

function MetricCard({ icon, value, label, variant, sub }) {
  return (
    <div className={`eg-metric-card eg-metric-card--${variant}`} data-testid={`school-card-eg-metric-${label.replace(/\s+/g,"-").toLowerCase()}`}>
      <div className="eg-metric-card__icon">{icon}</div>
      <div className="eg-metric-card__body">
        <div className="eg-metric-card__value">{value}</div>
        <div className="eg-metric-card__label">{label}</div>
        {sub && <div className="eg-metric-card__sub">{sub}</div>}
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
    <div className="eg-modal-overlay" role="dialog" aria-modal="true" data-testid={testId}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`eg-modal${wide?" eg-modal--wide":""}`}>
        <div className="eg-modal__header">
          <h3 className="eg-modal__title">{title}</h3>
          <button className="eg-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Exam Type Form Modal ─────────────────────────────────────────────────────
function ExamTypeFormModal({ examType, onClose, onSave }) {
  const isEdit = Boolean(examType);
  const [form, setForm] = useState(isEdit
    ? { name:examType.name, code:examType.code, maxMarks:String(examType.maxMarks), duration:String(examType.duration||""), type:examType.type, classes:examType.classes, desc:examType.desc }
    : { name:"", code:"", maxMarks:"", duration:"", type:"written", classes:"All", desc:"" }
  );
  const [err, setErr] = useState({});
  const set = (f,v) => { setForm(p=>({...p,[f]:v})); setErr(p=>({...p,[f]:undefined})); };
  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name="Name required";
    if (!form.code.trim()) e.code="Code required";
    if (!form.maxMarks || isNaN(+form.maxMarks)) e.maxMarks="Valid marks required";
    if (Object.keys(e).length){setErr(e);return;}
    onSave({ ...form, maxMarks:+form.maxMarks, duration:form.duration?+form.duration:null });
  };
  return (
    <Modal title={isEdit?"Edit Exam Type":"Add Exam Type"} onClose={onClose} wide testId="school-modal-eg-exam-type">
      <div className="eg-modal__body eg-modal__body--scroll">
        <div className="eg-form-grid">
          <div className="eg-form-group">
            <label className="eg-form-label">Exam Name *</label>
            <input className={`eg-form-input${err.name?" eg-form-input--error":""}`} value={form.name}
              onChange={(e)=>set("name",e.target.value)} placeholder="e.g. Unit Test" data-testid="school-input-eg-exam-name"/>
            {err.name&&<span className="eg-form-error">{err.name}</span>}
          </div>
          <div className="eg-form-group">
            <label className="eg-form-label">Code *</label>
            <input className={`eg-form-input${err.code?" eg-form-input--error":""}`} value={form.code}
              onChange={(e)=>set("code",e.target.value.toUpperCase())} placeholder="UT" data-testid="school-input-eg-exam-code" maxLength={6}/>
            {err.code&&<span className="eg-form-error">{err.code}</span>}
          </div>
          <div className="eg-form-group">
            <label className="eg-form-label">Max Marks *</label>
            <input type="number" className={`eg-form-input${err.maxMarks?" eg-form-input--error":""}`} value={form.maxMarks}
              onChange={(e)=>set("maxMarks",e.target.value)} placeholder="100" data-testid="school-input-eg-exam-marks"/>
            {err.maxMarks&&<span className="eg-form-error">{err.maxMarks}</span>}
          </div>
          <div className="eg-form-group">
            <label className="eg-form-label">Duration (min)</label>
            <input type="number" className="eg-form-input" value={form.duration}
              onChange={(e)=>set("duration",e.target.value)} placeholder="60" data-testid="school-input-eg-exam-duration"/>
          </div>
          <div className="eg-form-group">
            <label className="eg-form-label">Type</label>
            <select className="eg-form-select" value={form.type} onChange={(e)=>set("type",e.target.value)} data-testid="school-dropdown-eg-exam-type">
              <option value="written">Written</option><option value="practical">Practical</option><option value="oral">Oral/Viva</option><option value="assignment">Assignment</option>
            </select>
          </div>
          <div className="eg-form-group">
            <label className="eg-form-label">Classes</label>
            <select className="eg-form-select" value={form.classes} onChange={(e)=>set("classes",e.target.value)} data-testid="school-dropdown-eg-exam-classes">
              <option value="All">All Classes</option><option value="Class 10, 12">Class 10 & 12</option><option value="Science, CS">Science & CS</option><option value="Senior Secondary">Senior Secondary</option>
            </select>
          </div>
          <div className="eg-form-group eg-form-group--full">
            <label className="eg-form-label">Description</label>
            <textarea className="eg-form-textarea" rows={2} value={form.desc}
              onChange={(e)=>set("desc",e.target.value)} placeholder="Brief description…" data-testid="school-textarea-eg-exam-desc"/>
          </div>
        </div>
      </div>
      <div className="eg-modal__footer">
        <button className="eg-btn eg-btn--ghost" onClick={onClose} data-testid="school-button-eg-exam-cancel">Cancel</button>
        <button className="eg-btn eg-btn--primary" onClick={save} data-testid="school-button-eg-exam-save">{isEdit?"Save Changes":"Add Exam Type"}</button>
      </div>
    </Modal>
  );
}

// ─── Grading System Detail Modal ──────────────────────────────────────────────
function GradingDetailModal({ system, onClose }) {
  return (
    <Modal title={system.name} onClose={onClose} wide testId="school-modal-eg-grading">
      <div className="eg-modal__body eg-modal__body--scroll">
        <div className="eg-grade-table-wrap">
          <table className="eg-table">
            <thead>
              <tr><th>Grade</th><th>From %</th><th>To %</th><th>GPA</th><th>Remark</th></tr>
            </thead>
            <tbody>
              {system.grades.map((g,i)=>(
                <tr key={i} data-testid={`school-row-eg-grade-${g.grade}`}>
                  <td><span className="eg-grade-chip">{g.grade}</span></td>
                  <td>{g.from}</td>
                  <td>{g.to}</td>
                  <td><strong>{g.gpa}</strong></td>
                  <td>{g.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="eg-modal__footer">
        <button className="eg-btn eg-btn--ghost" onClick={onClose} data-testid="school-button-eg-grading-close">Close</button>
        <button className="eg-btn eg-btn--primary" data-testid="school-button-eg-grading-edit">Edit Scale</button>
      </div>
    </Modal>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function ExamTypesTab({ examTypes, setExamTypes, setModal }) {
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-exam-types">
      <div className="eg-toolbar eg-toolbar--simple">
        <p className="eg-toolbar__info">{examTypes.length} exam types configured</p>
        <button className="eg-btn eg-btn--primary eg-btn--sm" onClick={()=>setModal({type:"examType"})} data-testid="school-button-eg-add-exam-type">+ Add Exam Type</button>
      </div>
      <div className="eg-exam-grid">
        {examTypes.map(et=>(
          <div key={et.id} className="eg-exam-card" data-testid={`school-card-eg-exam-${et.id}`}>
            <div className="eg-exam-card__header">
              <span className="eg-exam-card__code">{et.code}</span>
              <StatusBadge status={et.status}/>
            </div>
            <h4 className="eg-exam-card__name">{et.name}</h4>
            <p className="eg-exam-card__desc">{et.desc}</p>
            <div className="eg-exam-card__stats">
              <div className="eg-stat"><span className="eg-stat__val">{et.maxMarks}</span><span className="eg-stat__lbl">Max Marks</span></div>
              <div className="eg-stat"><span className="eg-stat__val">{et.duration??"-"}</span><span className="eg-stat__lbl">Duration (min)</span></div>
            </div>
            <div className="eg-exam-card__footer">
              <TypeBadge type={et.type}/>
              <div style={{display:"flex",gap:".375rem"}}>
                <button className="eg-btn eg-btn--outline eg-btn--xs" onClick={()=>setModal({type:"examType",examType:et})} data-testid={`school-button-eg-edit-exam-${et.id}`}>Edit</button>
                <button className="eg-btn eg-btn--ghost eg-btn--xs" onClick={()=>setExamTypes(p=>p.filter(e=>e.id!==et.id))} data-testid={`school-button-eg-del-exam-${et.id}`}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradingSystemsTab({ setModal }) {
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-grading">
      <div className="eg-toolbar eg-toolbar--simple">
        <p className="eg-toolbar__info">{MOCK_GRADING_SYSTEMS.length} grading systems defined</p>
        <button className="eg-btn eg-btn--primary eg-btn--sm" data-testid="school-button-eg-add-grading">+ Add Grading System</button>
      </div>
      <div className="eg-grading-grid">
        {MOCK_GRADING_SYSTEMS.map(gs=>(
          <div key={gs.id} className="eg-grading-card" data-testid={`school-card-eg-grading-${gs.id}`}>
            <div className="eg-grading-card__header">
              <h4 className="eg-grading-card__name">{gs.name}</h4>
              <StatusBadge status={gs.status}/>
            </div>
            <p className="eg-grading-card__classes">Applied to: <strong>{gs.classes}</strong></p>
            <div className="eg-grade-chips-row">
              {gs.grades.slice(0,5).map(g=>(
                <span key={g.grade} className="eg-grade-chip">{g.grade}</span>
              ))}
              {gs.grades.length > 5 && <span className="eg-grade-chip eg-grade-chip--more">+{gs.grades.length-5}</span>}
            </div>
            <div className="eg-grading-card__footer">
              <button className="eg-btn eg-btn--outline eg-btn--sm" onClick={()=>setModal({type:"gradingDetail",system:gs})} data-testid={`school-button-eg-view-grading-${gs.id}`}>View Scale</button>
              <button className="eg-btn eg-btn--ghost eg-btn--sm" data-testid={`school-button-eg-edit-grading-${gs.id}`}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PassCriteriaTab() {
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-pass-criteria">
      <div className="eg-toolbar eg-toolbar--simple">
        <p className="eg-toolbar__info">{MOCK_PASS_CRITERIA.length} pass criteria defined</p>
        <button className="eg-btn eg-btn--primary eg-btn--sm" data-testid="school-button-eg-add-criteria">+ Add Criteria</button>
      </div>
      <div className="eg-table-wrap">
        <table className="eg-table">
          <thead>
            <tr><th>Scope</th><th>Min Theory %</th><th>Min Practical %</th><th>Min Overall %</th><th>Exam Eligibility %</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {MOCK_PASS_CRITERIA.map(pc=>(
              <tr key={pc.id} data-testid={`school-row-eg-criteria-${pc.id}`}>
                <td><strong>{pc.scope}</strong></td>
                <td>{pc.minTheory??<span style={{color:"var(--eg-muted)"}}>N/A</span>}</td>
                <td>{pc.minPractical??<span style={{color:"var(--eg-muted)"}}>N/A</span>}</td>
                <td>{pc.minOverall??<span style={{color:"var(--eg-muted)"}}>N/A</span>}</td>
                <td>{pc.examEligibility??<span style={{color:"var(--eg-muted)"}}>N/A</span>}</td>
                <td><StatusBadge status={pc.status}/></td>
                <td>
                  <div style={{display:"flex",gap:".375rem"}}>
                    <button className="eg-btn eg-btn--outline eg-btn--xs" data-testid={`school-button-eg-edit-criteria-${pc.id}`}>Edit</button>
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

function WeightageTab() {
  const [wt, setWt] = useState(MOCK_WEIGHTAGE);
  const update = (id, field, val) => setWt(p=>p.map(w=>w.id===id?{...w,[field]:+val}:w));
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-weightage">
      <div className="eg-section-head">
        <div>
          <h3 className="eg-section-head__title">Assessment Weightage Configuration</h3>
          <p className="eg-section-head__sub">Set term weightage and internal/external exam splits</p>
        </div>
        <button className="eg-btn eg-btn--primary eg-btn--sm" data-testid="school-button-eg-save-weightage">Save Changes</button>
      </div>
      <div className="eg-table-wrap">
        <table className="eg-table">
          <thead>
            <tr><th>Exam Type</th><th>Term 1 %</th><th>Term 2 %</th><th>Internal %</th><th>External %</th></tr>
          </thead>
          <tbody>
            {wt.map(w=>(
              <tr key={w.id} data-testid={`school-row-eg-weightage-${w.id}`}>
                <td><strong>{w.exam}</strong></td>
                {(["term1","term2","internal","external"]).map(f=>(
                  <td key={f}>
                    <input type="number" className="eg-inline-input" value={w[f]}
                      onChange={(e)=>update(w.id,f,e.target.value)} min={0} max={100}
                      data-testid={`school-input-eg-wt-${w.id}-${f}`}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportSettingsTab() {
  const [settings, setSettings] = useState({
    showRank:true, showGrade:true, showPercentage:true,
    showTeacherRemarks:true, showPrincipalRemarks:false,
    rankByClass:true, template:"standard",
  });
  const toggle = (k) => setSettings(p=>({...p,[k]:!p[k]}));
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-report">
      <div className="eg-settings-grid">
        <div className="eg-settings-card">
          <h4 className="eg-settings-card__title">Report Card Display</h4>
          {[
            ["showRank","Show Student Rank"],
            ["showGrade","Show Grade Letters"],
            ["showPercentage","Show Percentage"],
            ["showTeacherRemarks","Teacher Remarks"],
            ["showPrincipalRemarks","Principal Remarks"],
            ["rankByClass","Rank by Class (not school)"],
          ].map(([k,l])=>(
            <div key={k} className="eg-settings-row">
              <span className="eg-settings-row__label">{l}</span>
              <button className={`eg-toggle${settings[k]?" eg-toggle--on":""}`} onClick={()=>toggle(k)} data-testid={`school-toggle-eg-${k}`}>
                <span className="eg-toggle__knob"/>
              </button>
            </div>
          ))}
        </div>
        <div className="eg-settings-card">
          <h4 className="eg-settings-card__title">Report Card Template</h4>
          <div className="eg-form-group">
            <label className="eg-form-label">Template Style</label>
            <select className="eg-form-select" value={settings.template} onChange={(e)=>setSettings(p=>({...p,template:e.target.value}))} data-testid="school-dropdown-eg-template">
              <option value="standard">Standard (Classic)</option>
              <option value="modern">Modern (Card-based)</option>
              <option value="cbse">CBSE Format</option>
              <option value="icse">ICSE Format</option>
            </select>
          </div>
          <div className="eg-settings-note">
            <p>Changes to template settings will apply to the next generated report card. Existing PDFs are unaffected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvalPoliciesTab() {
  return (
    <div className="eg-tab-content" data-testid="school-container-eg-eval-policies">
      <div className="eg-toolbar eg-toolbar--simple">
        <p className="eg-toolbar__info">{EVAL_POLICIES.length} evaluation policies</p>
        <button className="eg-btn eg-btn--primary eg-btn--sm" data-testid="school-button-eg-add-eval-policy">+ Add Policy</button>
      </div>
      <div className="eg-policy-grid">
        {EVAL_POLICIES.map(p=>(
          <div key={p.id} className={`eg-policy-card eg-policy-card--${p.status}`} data-testid={`school-card-eg-policy-${p.id}`}>
            <div className="eg-policy-card__header">
              <h4 className="eg-policy-card__name">{p.name}</h4>
              <StatusBadge status={p.status}/>
            </div>
            <p className="eg-policy-card__desc">{p.desc}</p>
            <div className="eg-policy-card__footer">
              <button className="eg-btn eg-btn--outline eg-btn--xs" data-testid={`school-button-eg-edit-eval-${p.id}`}>Edit</button>
              <button className="eg-btn eg-btn--ghost eg-btn--xs" data-testid={`school-button-eg-toggle-eval-${p.id}`}>
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
const EG_TABS = [
  ["exam-types",   "Exam Types"],
  ["grading",      "Grading Systems"],
  ["pass-criteria","Pass Criteria"],
  ["weightage",    "Weightage"],
  ["report",       "Report Settings"],
  ["eval-policies","Evaluation Policies"],
];

export default function ExamGrading() {
  const [tab, setTab]           = useState("exam-types");
  const [examTypes, setExamTypes] = useState(MOCK_EXAM_TYPES);
  const [modal, setModal]       = useState(null);
  const closeModal              = useCallback(() => setModal(null), []);

  const handleSaveExamType = useCallback((form) => {
    if (modal?.examType) {
      setExamTypes(p=>p.map(e=>e.id===modal.examType.id?{...e,...form}:e));
    } else {
      setExamTypes(p=>[...p, { id:`ET${String(Date.now()).slice(-4)}`, ...form, status:"active" }]);
    }
    closeModal();
  }, [modal, closeModal]);

  const metrics = useMemo(() => [
    { icon:"📝", value: examTypes.length,                label:"Exam Types",      variant:"primary" },
    { icon:"🏅", value: MOCK_GRADING_SYSTEMS.length,     label:"Grading Systems", variant:"info" },
    { icon:"✅", value: MOCK_PASS_CRITERIA.length,        label:"Pass Criteria",   variant:"success" },
    { icon:"📋", value: EVAL_POLICIES.filter(p=>p.status==="active").length, label:"Active Policies", variant:"warning" },
  ], [examTypes]);

  return (
    <div className="eg-root" data-testid="school-page-exam-grading">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Academic Setup" },
          { label: "Exam & Grading" },
        ]}
        title="Exam & Grading"
        subtitle="Configure exam types, grading systems, pass criteria and evaluation policies"
        actions={(
          <>
            <button className="eg-btn eg-btn--ghost eg-btn--sm" data-testid="school-button-eg-export">⬇ Export</button>
            <button className="eg-btn eg-btn--primary" onClick={()=>setModal({type:"examType"})} data-testid="school-button-eg-add">+ Add Exam Type</button>
          </>
        )}
      />

      <div className="eg-metrics">
        {metrics.map(m=><MetricCard key={m.label} {...m}/>)}
      </div>

      <div className="eg-tabs-bar" data-testid="school-tabs-eg">
        {EG_TABS.map(([key,label])=>(
          <button key={key} className={`eg-tabs-bar__btn${tab===key?" eg-tabs-bar__btn--active":""}`}
            onClick={()=>setTab(key)} data-testid={`school-tab-eg-${key}`}>{label}</button>
        ))}
      </div>

      {tab === "exam-types"    && <ExamTypesTab examTypes={examTypes} setExamTypes={setExamTypes} setModal={setModal}/>}
      {tab === "grading"       && <GradingSystemsTab setModal={setModal}/>}
      {tab === "pass-criteria" && <PassCriteriaTab/>}
      {tab === "weightage"     && <WeightageTab/>}
      {tab === "report"        && <ReportSettingsTab/>}
      {tab === "eval-policies" && <EvalPoliciesTab/>}

      {modal?.type === "examType"     && <ExamTypeFormModal examType={modal.examType||null} onClose={closeModal} onSave={handleSaveExamType}/>}
      {modal?.type === "gradingDetail"&& <GradingDetailModal system={modal.system} onClose={closeModal}/>}
    </div>
  );
}