/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../../Assets/styles/Dashboard.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

// ─── Modal shell ──────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide = false }) => {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="db-overlay" role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`db-modal${wide ? " db-modal--wide" : ""}`}>
        <div className="db-modal__hd">
          <h2 className="db-modal__title">{title}</h2>
          <button className="db-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="db-modal__body">{children}</div>
      </div>
    </div>
  );
};

// ─── Form primitives ─────────────────────────────────────────────────────────
const Field = ({ label, type = "text", name, value, onChange, required, children, hint }) => (
  <div className="db-field">
    <label className="db-field__label">{label}{required && <span className="db-field__req">*</span>}</label>
    {children || (
      <input className="db-field__input" type={type} name={name} value={value} onChange={onChange}
        placeholder={label} data-testid={`school-field-${name}`} />
    )}
    {hint && <p className="db-field__hint">{hint}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, options, required }) => (
  <div className="db-field">
    <label className="db-field__label">{label}{required && <span className="db-field__req">*</span>}</label>
    <select className="db-field__select" name={name} value={value} onChange={onChange} data-testid={`school-dropdown-${name}`}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, name, value, onChange, rows = 3, placeholder }) => (
  <div className="db-field">
    <label className="db-field__label">{label}</label>
    <textarea className="db-field__textarea" name={name} value={value} onChange={onChange}
      rows={rows} placeholder={placeholder || label} data-testid={`school-field-${name}`} />
  </div>
);

const FormSection = ({ title, children }) => (
  <div className="db-form-section">
    <p className="db-form-section__title">{title}</p>
    <div className="db-form-grid">{children}</div>
  </div>
);

const ModalActions = ({ onClose, submitLabel, onSubmit }) => (
  <div className="db-modal__footer">
    <button className="db-btn db-btn--ghost" onClick={onClose} data-testid="school-button-modal-cancel">Cancel</button>
    <button className="db-btn db-btn--primary" onClick={onSubmit} data-testid="school-button-modal-submit">{submitLabel}</button>
  </div>
);

// ─── Modal: Add New Student ───────────────────────────────────────────────────
const AddStudentModal = ({ onClose }) => {
  const [form, setForm] = useState({
    // Basic Information
    name:"", pin:"", dob:"", gender:"", blood:"", nationality:"", religion:"", caste:"",
    motherTongue:"", languages:"", marks:"", enrollDate:"", aadharNumber:"",
    // Contact Information
    email:"", altEmail:"", phone:"", altPhone:"", address:"", city:"", state:"", pincode:"",
    // Academic Information
    year:"", curriculum:"", campus:"", branch:"", cls:"", residenceType:"",
    // Guardian
    hasGuardian:false,
    // Parent Information
    fatherName:"", fatherOccupation:"", motherName:"", motherOccupation:"", parentIncome:"", parentIdProof:"",
    // Health
    healthIssues:"", physicallyDisabled:"",
    // Previous School
    isPrevious:false, prevSchoolName:"", prevClass:"",
    // Scholarship
    scholarshipType:"", scholarshipDetails:"",
    // Documents
    photo:"", aadhar:"", casteCert:"", incomeCert:"", tc:"", prevCert:"", birthCert:"", otherDocs:"",
    // Fee Details
    totalFees:"", scholarship:"", reimbursement:"", paymentPlan:"",
    // Added By
    addedBy:"", department:"", designation:"", addedDate:"", verified:false,
    // Additional
    favoriteSport:"",
  });
  const f = useCallback(e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const netPayable = useMemo(() => {
    const t = parseFloat(form.totalFees) || 0;
    const s = parseFloat(form.scholarship) || 0;
    const r = parseFloat(form.reimbursement) || 0;
    const net = t - s - r;
    return net > 0 ? `₹ ${net.toLocaleString("en-IN")}` : "—";
  }, [form.totalFees, form.scholarship, form.reimbursement]);

  return (
    <Modal title="Add New Student" onClose={onClose} wide>
      {/* Basic Information */}
      <FormSection title="Basic Information">
        <Field label="Student Name" name="name" value={form.name} onChange={f} required />
        <Field label="PIN Number" name="pin" value={form.pin} onChange={f} hint="STU2024XXX" required />
        <Field label="Date of Birth" type="date" name="dob" value={form.dob} onChange={f} required />
        <Select label="Gender" name="gender" value={form.gender} onChange={f} options={["Male","Female","Other"]} required />
        <Select label="Blood Group" name="blood" value={form.blood} onChange={f} options={["A+","A-","B+","B-","O+","O-","AB+","AB-"]} required />
        <Field label="Nationality" name="nationality" value={form.nationality} onChange={f} required />
        <Field label="Religion" name="religion" value={form.religion} onChange={f} />
        <Select label="Caste Category" name="caste" value={form.caste} onChange={f} options={["Select caste","General","OBC","SC","ST"]} />
        <Field label="Mother Tongue" name="motherTongue" value={form.motherTongue} onChange={f} required />
        <Field label="Known Languages" name="languages" value={form.languages} onChange={f} hint="e.g., English, Hindi, Tamil (comma separated)" />
        <div className="db-form-grid--full">
          <Textarea label="Identification Marks" name="marks" value={form.marks} onChange={f} rows={2} placeholder="e.g., Mole on left cheek, Scar on right hand" />
        </div>
        <Field label="Application Submitted / Enrolled Date" type="date" name="enrollDate" value={form.enrollDate} onChange={f} required />
        <Field label="Aadhar Card Number" name="aadharNumber" value={form.aadharNumber} onChange={f} hint="XXXX XXXX XXXX" />
      </FormSection>

      {/* Contact Information */}
      <FormSection title="Contact Information">
        <Field label="Email" type="email" name="email" value={form.email} onChange={f} required />
        <Field label="Alternative Email" type="email" name="altEmail" value={form.altEmail} onChange={f} />
        <Field label="Phone Number" type="tel" name="phone" value={form.phone} onChange={f} required />
        <Field label="Alternative Phone Number" type="tel" name="altPhone" value={form.altPhone} onChange={f} />
        <div className="db-form-grid--full">
          <Textarea label="Address" name="address" value={form.address} onChange={f} rows={2} placeholder="Enter full address" required />
        </div>
        <Field label="City" name="city" value={form.city} onChange={f} required />
        <Field label="State" name="state" value={form.state} onChange={f} required />
        <Field label="Pincode" name="pincode" value={form.pincode} onChange={f} required />
      </FormSection>

      {/* Academic Information */}
      <FormSection title="Academic Information">
        <Select label="Academic Year" name="year" value={form.year} onChange={f} options={["2025-26","2024-25","2026-27"]} required />
        <Select label="Curriculum" name="curriculum" value={form.curriculum} onChange={f} options={["CBSE","ICSE","State Board","IB"]} required />
        <Select label="Campus" name="campus" value={form.campus} onChange={f} options={["North Campus","South Campus","East Wing"]} required />
        <Select label="Branch" name="branch" value={form.branch} onChange={f} options={["Science","Commerce","Arts","Engineering"]} required />
        <Select label="Class" name="cls" value={form.cls} onChange={f} options={["Class 1","Class 6","Class 9","Class 10","Class 12"]} required />
        <Select label="Residence Type" name="residenceType" value={form.residenceType} onChange={f} options={["Day Scholar","Boarder","Semi-Boarder"]} required />
      </FormSection>

      {/* Guardian Information */}
      <FormSection title="Guardian Information">
        <div style={{display:"flex",alignItems:"center",gap:".5rem",padding:".5rem"}}>
          <input type="checkbox" id="guardian" name="hasGuardian" checked={form.hasGuardian} onChange={f} data-testid="school-field-has-guardian" />
          <label htmlFor="guardian" style={{fontSize:".875rem",margin:0}}>Student is under Guardian (not parents)</label>
        </div>
      </FormSection>

      {/* Parent Information */}
      <FormSection title="Parent/Guardian Information">
        <Field label="Father's Name" name="fatherName" value={form.fatherName} onChange={f} required />
        <Field label="Father's Occupation" name="fatherOccupation" value={form.fatherOccupation} onChange={f} />
        <Field label="Mother's Name" name="motherName" value={form.motherName} onChange={f} required />
        <Field label="Mother's Occupation" name="motherOccupation" value={form.motherOccupation} onChange={f} />
        <Field label="Parents Annual Income (USD)" type="number" name="parentIncome" value={form.parentIncome} onChange={f} hint="Required for scholarship eligibility" />
        <Field label="Parents ID Proof (Government ID)" type="file" name="parentIdProof" onChange={f} hint="Aadhar, Passport, Driving License, Voter ID, etc." required />
      </FormSection>

      {/* Health Information */}
      <FormSection title="Health Information">
        <div className="db-form-grid--full">
          <Textarea label="Any Health Issues or Allergies" name="healthIssues" value={form.healthIssues} onChange={f} rows={2} placeholder="Describe any health issues or allergies" />
        </div>
        <Select label="Physically Challenged" name="physicallyDisabled" value={form.physicallyDisabled} onChange={f} options={["No","Yes"]} />
      </FormSection>

      {/* Previous School Details */}
      <FormSection title="Previous School Details">
        <div style={{display:"flex",alignItems:"center",gap:".5rem",padding:".5rem"}}>
          <input type="checkbox" id="previous" name="isPrevious" checked={form.isPrevious} onChange={f} data-testid="school-field-has-previous-school" />
          <label htmlFor="previous" style={{fontSize:".875rem",margin:0}}>Migrating from another branch of the same school</label>
        </div>
        {form.isPrevious && (
          <>
            <Field label="Previous School Name" name="prevSchoolName" value={form.prevSchoolName} onChange={f} />
            <Field label="Previous Class/Year" name="prevClass" value={form.prevClass} onChange={f} />
          </>
        )}
      </FormSection>

      {/* Scholarship Information */}
      <FormSection title="Scholarship Information">
        <Select label="Scholarship Type" name="scholarshipType" value={form.scholarshipType} onChange={f} options={["Not Applicable","Merit Scholarship","Need-Based","Sports Excellence","Government Scheme","Management Discretion"]} />
        <div className="db-form-grid--full">
          <Textarea label="Scholarship Details" name="scholarshipDetails" value={form.scholarshipDetails} onChange={f} rows={2} placeholder="Enter scholarship details, amount, and eligibility" />
        </div>
      </FormSection>

      {/* Document Uploads */}
      <FormSection title="Document Uploads">
        <Field label="Passport Size Photo" type="file" name="photo" onChange={f} hint="JPG / PNG, max 2 MB" />
        <Field label="Aadhar Card Copy" type="file" name="aadhar" onChange={f} hint="PDF / JPG, max 5 MB" />
        <Field label="Caste Certificate" type="file" name="casteCert" onChange={f} hint="Required for scholarship application" />
        <Field label="Income Certificate" type="file" name="incomeCert" onChange={f} hint="Required for scholarship application" />
        <Field label="Transfer Certificate (TC)" type="file" name="tc" onChange={f} />
        <Field label="Previous Year Study Certificate" type="file" name="prevCert" onChange={f} />
        <Field label="Birth Certificate" type="file" name="birthCert" onChange={f} />
        <Field label="Other Documents (Optional)" type="file" name="otherDocs" onChange={f} />
      </FormSection>

      {/* Fee Details */}
      <FormSection title="Fee Details">
        <Field label="Total Fees (Annual) (₹)" type="number" name="totalFees" value={form.totalFees} onChange={f} required />
        <Field label="Scholarship Amount (₹)" type="number" name="scholarship" value={form.scholarship} onChange={f} />
        <Field label="Reimbursement Amount (₹)" type="number" name="reimbursement" value={form.reimbursement} onChange={f} hint="Government/Corporate reimbursement" />
        <Select label="Payment Plan" name="paymentPlan" value={form.paymentPlan} onChange={f} options={["Monthly","Quarterly","Half-Yearly","Annual"]} required />
        <div className="db-fee-net">
          <span className="db-fee-net__lbl">Net Payable Amount</span>
          <span className="db-fee-net__val">{netPayable}</span>
        </div>
      </FormSection>

      {/* Added By Information */}
      <FormSection title="Enrollment Details">
        <Field label="Added By (Full Name)" name="addedBy" value={form.addedBy} onChange={f} required />
        <Select label="Department" name="department" value={form.department} onChange={f} options={["Administration","Finance","Academic","HR","Other"]} required />
        <Field label="Designation" name="designation" value={form.designation} onChange={f} required />
        <Field label="Date" type="date" name="addedDate" value={form.addedDate} onChange={f} required />
        <div style={{display:"flex",alignItems:"center",gap:".5rem",padding:".5rem"}}>
          <input type="checkbox" id="verified" name="verified" checked={form.verified} onChange={f} data-testid="school-field-enrollment-verified" />
          <label htmlFor="verified" style={{fontSize:".875rem",margin:0}}>I confirm that I have verified all the information provided by the student/parent</label>
        </div>
      </FormSection>

      {/* Additional Information */}
      <FormSection title="Additional Information">
        <Field label="Favourite Sport" name="favoriteSport" value={form.favoriteSport} onChange={f} />
      </FormSection>

      {/* Declaration */}
      <div className="db-declaration">
        <input type="checkbox" id="decl" data-testid="school-field-declaration" />
        <label htmlFor="decl">I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to the cancellation of admission.</label>
      </div>

      <ModalActions onClose={onClose} submitLabel="Add Student" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Modal: Add New Teacher ───────────────────────────────────────────────────
const AddTeacherModal = ({ onClose }) => {
  const [form, setForm] = useState({ name:"", empId:"", branch:"", campus:"", subject:"", email:"", phone:"", qual:"", exp:"" });
  const f = useCallback(e => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);
  return (
    <Modal title="Add New Teacher" onClose={onClose}>
      <FormSection title="Teacher Details">
        <Field label="Full Name"    name="name"    value={form.name}    onChange={f} required />
        <Field label="Employee ID"  name="empId"   value={form.empId}   onChange={f} required />
        <Field label="Email"        type="email" name="email" value={form.email} onChange={f} required />
        <Field label="Phone"        type="tel"   name="phone" value={form.phone} onChange={f} required />
        <Select label="Campus"      name="campus"  value={form.campus}  onChange={f} options={["North Campus","South Campus","East Wing"]} required />
        <Select label="Branch"      name="branch"  value={form.branch}  onChange={f} options={["Science","Commerce","Arts","Engineering"]} required />
        <Select label="Subject"     name="subject" value={form.subject} onChange={f} options={["Mathematics","Science","English","Social Studies","Hindi","Commerce","Computer Science"]} required />
        <Field label="Qualification" name="qual"   value={form.qual}   onChange={f} />
        <Field label="Experience (years)" type="number" name="exp" value={form.exp} onChange={f} />
      </FormSection>
      <ModalActions onClose={onClose} submitLabel="Add Teacher" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Modal: Create Announcement ──────────────────────────────────────────────
const AnnouncementModal = ({ onClose }) => {
  const [form, setForm] = useState({ title:"", desc:"", audience:"", priority:"", date:"" });
  const f = useCallback(e => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);
  return (
    <Modal title="Create Announcement" onClose={onClose}>
      <FormSection title="Announcement Details">
        <div className="db-form-grid--full"><Field label="Title" name="title" value={form.title} onChange={f} required /></div>
        <div className="db-form-grid--full"><Textarea label="Description" name="desc" value={form.desc} onChange={f} rows={4} /></div>
        <Select label="Audience"  name="audience" value={form.audience} onChange={f} options={["All","Students","Staff","Parents","Management"]} required />
        <Select label="Priority"  name="priority" value={form.priority} onChange={f} options={["Normal","Important","Urgent"]} />
        <Field label="Publish Date" type="date" name="date" value={form.date} onChange={f} />
      </FormSection>
      <ModalActions onClose={onClose} submitLabel="Publish Announcement" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Modal: Schedule Meeting ─────────────────────────────────────────────────
const MeetingModal = ({ onClose }) => {
  const [form, setForm] = useState({ title:"", participants:"", date:"", time:"", type:"", notes:"" });
  const f = useCallback(e => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);
  return (
    <Modal title="Schedule Meeting" onClose={onClose}>
      <FormSection title="Meeting Details">
        <div className="db-form-grid--full"><Field label="Meeting Title" name="title" value={form.title} onChange={f} required /></div>
        <Field label="Date" type="date" name="date" value={form.date} onChange={f} required />
        <Field label="Time" type="time" name="time" value={form.time} onChange={f} required />
        <Select label="Meeting Type" name="type" value={form.type} onChange={f} options={["In-Person","Online","Hybrid","Board Meeting","Staff Meeting","Parent-Teacher"]} />
        <div className="db-form-grid--full"><Field label="Participants" name="participants" value={form.participants} onChange={f} hint="Comma-separated names or roles" /></div>
        <div className="db-form-grid--full"><Textarea label="Notes / Agenda" name="notes" value={form.notes} onChange={f} rows={3} /></div>
      </FormSection>
      <ModalActions onClose={onClose} submitLabel="Schedule Meeting" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Modal: Approve Leaves ───────────────────────────────────────────────────
const MOCK_LEAVES = [
  { id:1, name:"Arjun Sharma",  dept:"Mathematics",    type:"Sick Leave",   days:3, date:"Jul 1-3",    status:"pending" },
  { id:2, name:"Priya Nair",    dept:"Science",         type:"Maternity",    days:60,date:"Jul 5 +",    status:"pending" },
  { id:3, name:"Rahul Verma",   dept:"English",         type:"Casual Leave", days:2, date:"Jul 8-9",    status:"pending" },
  { id:4, name:"Sunita Patel",  dept:"Administration",  type:"Emergency",    days:1, date:"Jul 2",      status:"pending" },
  { id:5, name:"Vikram Singh",  dept:"IT",              type:"Paid Leave",   days:5, date:"Jul 15-19",  status:"pending" },
];

const ApproveLeavesModal = ({ onClose }) => {
  const [statuses, setStatuses] = useState({});
  const [remarks, setRemarks] = useState("");
  const handle = (id, val) => setStatuses(p => ({ ...p, [id]: val }));

  return (
    <Modal title="Approve Leave Requests" onClose={onClose} wide>
      <div className="db-leave-list">
        {MOCK_LEAVES.map(l => (
          <div key={l.id} className="db-leave-row">
            <div className="db-leave-row__info">
              <p className="db-leave-row__name">{l.name}</p>
              <p className="db-leave-row__meta">{l.dept} · {l.type} · {l.days} day{l.days>1?"s":""} · {l.date}</p>
            </div>
            <div className="db-leave-row__actions">
              <button className={`db-leave-btn db-leave-btn--approve${statuses[l.id]==="approved"?" db-leave-btn--active-approve":""}`}
                onClick={() => handle(l.id,"approved")} data-testid={`school-button-leave-approve-${l.id}`}>✓ Approve</button>
              <button className={`db-leave-btn db-leave-btn--reject${statuses[l.id]==="rejected"?" db-leave-btn--active-reject":""}`}
                onClick={() => handle(l.id,"rejected")} data-testid={`school-button-leave-reject-${l.id}`}>✕ Reject</button>
            </div>
          </div>
        ))}
      </div>
      <Textarea label="General Remarks (optional)" name="remarks" value={remarks} onChange={e=>setRemarks(e.target.value)} rows={2} />
      <ModalActions onClose={onClose} submitLabel="Save Decisions" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Modal: Manage Scholarships ──────────────────────────────────────────────
const ScholarshipModal = ({ onClose }) => {
  const [form, setForm] = useState({ student:"", type:"", amount:"", notes:"", status:"" });
  const f = useCallback(e => setForm(p => ({ ...p, [e.target.name]: e.target.value })), []);
  return (
    <Modal title="Manage Scholarships" onClose={onClose}>
      <FormSection title="Scholarship Details">
        <Field label="Student Name / ID" name="student" value={form.student} onChange={f} required />
        <Select label="Scholarship Type" name="type"   value={form.type}   onChange={f}
          options={["Merit Scholarship","Need-Based","Sports Excellence","Government Scheme","Management Discretion"]} required />
        <Field label="Amount (₹)" type="number" name="amount" value={form.amount} onChange={f} required />
        <Select label="Status"    name="status"  value={form.status}  onChange={f} options={["Pending","Approved","Disbursed","Rejected"]} />
        <div className="db-form-grid--full">
          <Textarea label="Eligibility Notes" name="notes" value={form.notes} onChange={f} rows={3} placeholder="Reason or eligibility criteria…" />
        </div>
      </FormSection>
      <ModalActions onClose={onClose} submitLabel="Save Scholarship" onSubmit={onClose} />
    </Modal>
  );
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const METRICS = [
  { icon:"👨‍🎓", label:"Total Students",     value:"2,847", sub:"+124 this year",     color:"primary"  },
  { icon:"👩‍🏫", label:"Total Staff",         value:"312",   sub:"28 departments",     color:"info"     },
  { icon:"💰", label:"Fee Collection",       value:"91.2%", sub:"₹48.6L of ₹53.2L",  color:"success"  },
  { icon:"📅", label:"Avg Attendance",       value:"88.4%", sub:"+1.2% vs last term", color:"success"  },
  { icon:"📣", label:"Pending Grievances",   value:"17",    sub:"-5 this week",        color:"warning"  },
  { icon:"🚌", label:"Active Buses",         value:"22",    sub:"2 under maintenance", color:"primary"  },
];

const ACTIVITIES = [
  { icon:"🎓", type:"admission",  title:"New student enrolled",       desc:"Aryan Patel — Class 8-B",           time:"10 min ago",  color:"primary" },
  { icon:"💰", type:"fee",        title:"Fee payment received",        desc:"₹45,000 from Class 10-A",           time:"28 min ago",  color:"success" },
  { icon:"📋", type:"leave",      title:"Leave approved",              desc:"Mrs. Priya Sharma · 2 days",        time:"1 hr ago",    color:"info"    },
  { icon:"📢", type:"announce",   title:"Announcement published",      desc:"Annual Sports Day — 10 May",        time:"2 hrs ago",   color:"warning" },
  { icon:"✅", type:"grievance",  title:"Grievance resolved",          desc:"Canteen hygiene — Case #G-048",     time:"3 hrs ago",   color:"success" },
  { icon:"👤", type:"teacher",    title:"New teacher onboarded",       desc:"Dr. Meera Krishnan — Science",      time:"Yesterday",   color:"purple"  },
];

const EVENTS = [
  { title:"Annual Sports Day",       date:"10 May 2026",  badge:"Sports",   color:"#16a34a" },
  { title:"Parent-Teacher Meeting",  date:"15 May 2026",  badge:"Academic", color:"#2563eb" },
  { title:"Science Exhibition",      date:"22 May 2026",  badge:"Academic", color:"#c9a962" },
  { title:"Staff Training Workshop", date:"28 May 2026",  badge:"Training", color:"#d97706" },
  { title:"Term 1 Examinations",     date:"Jun 2-12 2026",badge:"Exams",    color:"#dc2626" },
];

const ALERTS = [
  { icon:"⚠️", level:"danger",  title:"324 students with overdue fees",     detail:"₹1.4L pending — Class 7 has highest rate (18.4%)" },
  { icon:"📣", level:"warning", title:"17 unresolved grievances",           detail:"Oldest case open for 9 days — requires escalation" },
  { icon:"🚌", level:"warning", title:"Bus delays on Route C",              detail:"Bus 103 delayed 9 of last 15 trips. Avg: 18 min" },
  { icon:"📅", level:"danger",  title:"142 students below 75% attendance",  detail:"Exam eligibility at risk — parent notifications sent" },
];

const ACTIONS = [
  { id:"student",      icon:"🎓", label:"Add New Student",      desc:"Enroll a new student",          color:"primary" },
  { id:"teacher",      icon:"👩‍🏫", label:"Add New Teacher",      desc:"Onboard a staff member",        color:"info"    },
  { id:"announcement", icon:"📢", label:"Create Announcement",  desc:"Broadcast to students & staff", color:"warning" },
  { id:"meeting",      icon:"📅", label:"Schedule Meeting",     desc:"Plan staff or board meetings",  color:"purple"  },
  { id:"leaves",       icon:"📋", label:"Approve Leaves",       desc:"Review pending leave requests", color:"success" },
  { id:"scholarship",  icon:"🏆", label:"Manage Scholarships",  desc:"Grant or update scholarships",  color:"gold"    },
];

// ─── Metric Card ─────────────────────────────────────────────────────────────
const MetricCard = ({ icon, label, value, sub, color }) => (
  <div className={`db-metric db-metric--${color}`} data-testid={`school-kpi-${label.toLowerCase().replace(/\s+/g,"-")}`}>
    <span className="db-metric__icon">{icon}</span>
    <div className="db-metric__body">
      <p className="db-metric__val">{value}</p>
      <p className="db-metric__lbl">{label}</p>
      {sub && <p className="db-metric__sub">{sub}</p>}
    </div>
  </div>
);

// ─── Quick Action Card ────────────────────────────────────────────────────────
const ActionCard = ({ icon, label, desc, color, onClick }) => (
  <button className={`db-action db-action--${color}`} onClick={onClick}
    data-testid={`school-button-quick-action-${label.toLowerCase().replace(/\s+/g,"-")}`}>
    <span className="db-action__icon">{icon}</span>
    <div className="db-action__body">
      <p className="db-action__label">{label}</p>
      <p className="db-action__desc">{desc}</p>
    </div>
    <span className="db-action__arrow">›</span>
  </button>
);

// ─── Alert Card ───────────────────────────────────────────────────────────────
const AlertItem = ({ icon, level, title, detail }) => (
  <div className={`db-alert db-alert--${level}`}>
    <span className="db-alert__icon">{icon}</span>
    <div>
      <p className="db-alert__title">{title}</p>
      <p className="db-alert__detail">{detail}</p>
    </div>
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children, badge }) => (
  <section className="db-section">
    <div className="db-section__hd">
      <h2 className="db-section__title">{title}</h2>
      {badge && <span className="db-section__badge">{badge}</span>}
    </div>
    {children}
  </section>
);

// ─── MODALS MAP ───────────────────────────────────────────────────────────────
const MODAL_MAP = {
  student:      AddStudentModal,
  teacher:      AddTeacherModal,
  announcement: AnnouncementModal,
  meeting:      MeetingModal,
  leaves:       ApproveLeavesModal,
  scholarship:  ScholarshipModal,
};

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
/**
 * Dashboard — Management ERP main page.
 */
const Dashboard = () => {
  const [openModal, setOpenModal] = useState(null);
  const closeModal = useCallback(() => setOpenModal(null), []);
  const ModalComponent = openModal ? MODAL_MAP[openModal] : null;

  return (
    <div className="db-root" data-testid="school-page-management-dashboard">

      {/* ── Header ── */}
      <div className="db-header">
        <div className="db-header__left">
          <nav className="db-breadcrumb">
            <span>Management</span>
            <span className="db-breadcrumb__sep">›</span>
            <span className="db-breadcrumb__active">Dashboard</span>
          </nav>
          <h1 className="db-header__title">Welcome back, Admin</h1>
          <p className="db-header__sub">Here's a quick overview of school operations</p>
        </div>
        <div className="db-header__right">
          <div className="db-header__chip db-header__chip--live">● Live</div>
          <div className="db-header__chip db-header__chip--year">AY 2025-26</div>
          <div className="db-header__date">{today()}</div>
        </div>
      </div>

      {/* ── Summary Metrics ── */}
      <Section title="School Overview">
        <div className="db-metrics">
          {METRICS.map(m => <MetricCard key={m.label} {...m} />)}
        </div>
      </Section>

      {/* ── Quick Actions ── */}
      <Section title="Quick Actions">
        <div className="db-actions">
          {ACTIONS.map(a => (
            <ActionCard key={a.id} {...a} onClick={() => setOpenModal(a.id)} />
          ))}
        </div>
      </Section>

      {/* ── Activities + Events row ── */}
      <div className="db-two-col">
        {/* Recent Activities */}
        <Section title="Recent Activity" badge="Today">
          <ul className="db-activity-list">
            {ACTIVITIES.map((a, i) => (
              <li key={i} className="db-activity-item">
                <span className={`db-activity-item__icon db-activity-item__icon--${a.color}`}>{a.icon}</span>
                <div className="db-activity-item__body">
                  <p className="db-activity-item__title">{a.title}</p>
                  <p className="db-activity-item__desc">{a.desc}</p>
                </div>
                <span className="db-activity-item__time">{a.time}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Upcoming Events */}
        <Section title="Upcoming Events">
          <ul className="db-event-list">
            {EVENTS.map((e, i) => (
              <li key={i} className="db-event-item" style={{ borderLeftColor: e.color }}>
                <div className="db-event-item__date-chip" style={{ background: `${e.color}18`, color: e.color }}>{e.date}</div>
                <div className="db-event-item__body">
                  <p className="db-event-item__title">{e.title}</p>
                  <span className="db-event-item__badge" style={{ background: `${e.color}18`, color: e.color }}>{e.badge}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* ── Alerts ── */}
      <Section title="Alerts & Notifications" badge={`${ALERTS.length} active`}>
        <div className="db-alerts">
          {ALERTS.map((a, i) => <AlertItem key={i} {...a} />)}
        </div>
      </Section>

      {/* ── Active Modal ── */}
      {ModalComponent && <ModalComponent onClose={closeModal} />}
    </div>
  );
};

export default Dashboard;