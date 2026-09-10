/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  DUE_CLASSES_DATA,
  DUE_OVERVIEW_METRICS,
  getAgingAnalysis,
  formatINR,
  formatINRFull,
} from './dueMockData';
import '../../Assets/styles/DueManagement.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DM_METRIC_DEFS = [
  { key: 'studentsWithOverdue', icon: '🚨', label: 'Students w/ Overdue', variant: 'danger',  fmt: v => v.toLocaleString('en-IN') },
  { key: 'totalOverdueAmount',  icon: '💸', label: 'Total Overdue Amount',variant: 'danger',  fmt: formatINR },
  { key: 'totalDue',            icon: '⏳', label: 'Total Due (incl. pending)', variant: 'warning', fmt: formatINR },
  { key: 'criticalStudents',    icon: '🔴', label: 'Critical Overdue',   variant: 'neutral', fmt: v => v.toLocaleString('en-IN') },
  { key: 'remindersSent',       icon: '🔔', label: 'Reminders Sent',     variant: 'info',    fmt: v => v.toLocaleString('en-IN') },
  { key: 'recoveryPct',         icon: '📈', label: 'Recovery Rate',      variant: 'success', fmt: v => `${v}%` },
];

const DM_ACTION_DEFS = [
  { key: 'reminder',  icon: '🔔', label: 'Send Reminder' },
  { key: 'sms',       icon: '💬', label: 'Send SMS'      },
  { key: 'email',     icon: '📧', label: 'Send Email'    },
  { key: 'call',      icon: '📞', label: 'Call Parent'   },
  { key: 'latefee',   icon: '⚡', label: 'Apply Late Fee'},
  { key: 'discount',  icon: '🏷️', label: 'Apply Discount'},
  { key: 'payment',   icon: '💳', label: 'Record Payment'},
  { key: 'statement', icon: '📄', label: 'Statement'     },
  { key: 'escalate',  icon: '🚀', label: 'Escalate'      },
];

const RISK_FROM_PRIORITY = { Urgent: 'critical', High: 'high', Medium: 'medium', Low: 'low' };
const SEVERITY_COLORS = { Low: '#16a34a', Moderate: '#d97706', High: '#b45309', Severe: '#dc2626' };

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function agingColor(days) {
  return days <= 30 ? '#16a34a' : days <= 60 ? '#d97706' : days <= 90 ? '#fb7185' : '#dc2626';
}

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function MetricCard({ icon, value, label, variant }) {
  return (
    <div className={`dm-metric-card dm-metric-card--${variant}`}
      data-testid={`school-card-dm-metric-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
      <div className="dm-metric-card__icon">{icon}</div>
      <div className="dm-metric-card__body">
        <div className="dm-metric-card__value">{value}</div>
        <div className="dm-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

function SeverityChip({ severity }) {
  return <span className={`dm-severity-chip dm-severity-chip--${(severity || '').toLowerCase()}`}>{severity}</span>;
}

function RiskBadge({ priority }) {
  const key = RISK_FROM_PRIORITY[priority] ?? 'low';
  return <span className={`dm-risk-badge dm-risk-badge--${key}`}>{priority}</span>;
}

function ReminderBadge({ status }) {
  const key = status === 'Delivered' || status === 'Read' ? 'sent' : status === 'Failed' ? 'failed' : 'pending';
  return <span className={`dm-reminder-badge dm-reminder-badge--${key}`}>{status}</span>;
}

function CardProgress({ pct, color }) {
  return (
    <div className="dm-card-progress">
      <div className="dm-card-progress__fill" style={{ width: `${pct}%`, background: color || '#dc2626' }} />
    </div>
  );
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
function Breadcrumb({ view, selClass, selSection, goOverview, goClass }) {
  return (
    <nav className="dm-breadcrumb">
      <button className="dm-breadcrumb__item" onClick={goOverview}
        data-testid="school-button-dm-breadcrumb-overview">Due Management</button>
      {(view === 'class' || view === 'section') && (
        <>
          <span className="dm-breadcrumb__sep">›</span>
          {view === 'class'
            ? <span className="dm-breadcrumb__active">{selClass?.label}</span>
            : <button className="dm-breadcrumb__item" onClick={goClass}
                data-testid="school-button-dm-breadcrumb-class">{selClass?.label}</button>
          }
        </>
      )}
      {view === 'section' && (
        <>
          <span className="dm-breadcrumb__sep">›</span>
          <span className="dm-breadcrumb__active">{selSection?.label}</span>
        </>
      )}
    </nav>
  );
}

// ─── OVERVIEW VIEW ────────────────────────────────────────────────────────────
function OverviewView({ onSelectClass }) {
  return (
    <>
      <div className="dm-metrics">
        {DM_METRIC_DEFS.map((m) => (
          <MetricCard key={m.key} icon={m.icon}
            value={m.fmt(DUE_OVERVIEW_METRICS[m.key] ?? 0)} label={m.label} variant={m.variant} />
        ))}
      </div>
      <p className="dm-subtitle">
        Highest due: <strong>{DUE_OVERVIEW_METRICS.highestDueClass}</strong> · Click a class to drill down into sections
      </p>
      <div className="dm-class-grid">
        {DUE_CLASSES_DATA.map((cls) => (
          <div key={cls.id} className={`dm-class-card dm-class-card--${cls.severity?.toLowerCase()}`}
            role="button" tabIndex={0}
            onClick={() => onSelectClass(cls)}
            onKeyDown={e => e.key === 'Enter' && onSelectClass(cls)}
            data-testid={`school-card-dm-class-${cls.id}`}>
            <div className="dm-class-card__header">
              <h3 className="dm-class-card__title">{cls.label}</h3>
              <SeverityChip severity={cls.severity} />
            </div>
            <CardProgress pct={cls.overduePct} color={SEVERITY_COLORS[cls.severity]} />
            <div className="dm-class-card__stats">
              <div className="dm-class-card__stat">
                <span className="dm-class-card__stat-label">Overdue Students</span>
                <span className="dm-class-card__stat-val dm-class-card__stat-val--danger">{cls.overdueStudentsCount}</span>
              </div>
              <div className="dm-class-card__stat">
                <span className="dm-class-card__stat-label">Total Due</span>
                <span className="dm-class-card__stat-val dm-class-card__stat-val--danger">{formatINR(cls.totalDue)}</span>
              </div>
              <div className="dm-class-card__stat">
                <span className="dm-class-card__stat-label">Overdue Amt</span>
                <span className="dm-class-card__stat-val dm-class-card__stat-val--warning">{formatINR(cls.overdueAmount)}</span>
              </div>
              <div className="dm-class-card__stat">
                <span className="dm-class-card__stat-label">Critical</span>
                <span className="dm-class-card__stat-val dm-class-card__stat-val--danger">{cls.criticalCount}</span>
              </div>
            </div>
            <div className="dm-class-card__footer">
              <span>{cls.sections.length} sections</span>
              <button className="dm-class-card__cta">View →</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── CLASS VIEW ───────────────────────────────────────────────────────────────
function ClassView({ cls, onSelectSection }) {
  const clsMetrics = [
    { icon: '🚨', label: 'Overdue Students', value: cls.overdueStudentsCount.toLocaleString('en-IN'), variant: 'danger'  },
    { icon: '💸', label: 'Overdue Amount',   value: formatINR(cls.overdueAmount),                    variant: 'danger'  },
    { icon: '⏳', label: 'Total Due',         value: formatINR(cls.totalDue),                         variant: 'warning' },
    { icon: '🔴', label: 'Critical Cases',   value: cls.criticalCount.toLocaleString('en-IN'),       variant: 'neutral' },
    { icon: '📊', label: 'Overdue %',         value: `${cls.overduePct}%`,                            variant: 'info'    },
    { icon: '💪', label: 'Recovery',         value: `${cls.recoveryProgress}%`,                      variant: 'success' },
  ];
  return (
    <>
      <div className="dm-section-header">
        <div className="dm-section-header__left">
          <h2 className="dm-section-header__title">{cls.label}</h2>
          <p className="dm-section-header__sub">
            {cls.sections.length} sections · {cls.overdueStudentsCount} students with dues · Click a section to view student list
          </p>
        </div>
        <SeverityChip severity={cls.severity} />
      </div>
      <div className="dm-metrics">
        {clsMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>
      <div className="dm-section-grid">
        {cls.sections.map((sec) => (
          <div key={sec.id} className="dm-section-card" role="button" tabIndex={0}
            onClick={() => onSelectSection(sec)}
            onKeyDown={e => e.key === 'Enter' && onSelectSection(sec)}
            data-testid={`school-card-dm-section-${sec.id}`}>
            <div className="dm-section-card__header">
              <h3 className="dm-section-card__title">{sec.label}</h3>
              <SeverityChip severity={sec.collectionHealth} />
            </div>
            <CardProgress pct={sec.overduePct} color="#dc2626" />
            <div className="dm-section-card__stats">
              <div className="dm-section-card__stat">
                <span className="dm-section-card__stat-label">Overdue</span>
                <span className="dm-section-card__stat-val dm-section-card__stat-val--danger">{sec.overdueStudentsCount}</span>
              </div>
              <div className="dm-section-card__stat">
                <span className="dm-section-card__stat-label">Total Due</span>
                <span className="dm-section-card__stat-val dm-section-card__stat-val--danger">{formatINR(sec.totalDue)}</span>
              </div>
              <div className="dm-section-card__stat">
                <span className="dm-section-card__stat-label">Critical</span>
                <span className="dm-section-card__stat-val dm-section-card__stat-val--warning">{sec.criticalCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── SECTION VIEW ─────────────────────────────────────────────────────────────
function SectionView({ cls, section, onSelectStudent }) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let rows = section.students;
    if (priorityFilter !== 'all') rows = rows.filter(s => s.priority === priorityFilter);
    if (statusFilter !== 'all') rows = rows.filter(s => s.paymentStatus === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        String(s.rollNo).includes(q)
      );
    }
    return rows;
  }, [section.students, priorityFilter, statusFilter, search]);

  const secMetrics = [
    { icon: '🚨', label: 'Overdue Students', value: section.overdueStudentsCount.toLocaleString('en-IN'), variant: 'danger'  },
    { icon: '💸', label: 'Overdue Amount',   value: formatINR(section.overdueAmount),                    variant: 'danger'  },
    { icon: '⏳', label: 'Total Due',         value: formatINR(section.totalDue),                         variant: 'warning' },
    { icon: '🔴', label: 'Critical',         value: section.criticalCount.toLocaleString('en-IN'),       variant: 'neutral' },
    { icon: '💪', label: 'Avg Recovery',     value: `${section.recoveryProgress}%`,                      variant: 'success' },
  ];

  return (
    <>
      <div className="dm-section-header">
        <div className="dm-section-header__left">
          <h2 className="dm-section-header__title">{cls.label} — {section.label}</h2>
          <p className="dm-section-header__sub">{section.overdueStudentsCount} students with overdue · Click a row to view student profile</p>
        </div>
      </div>
      <div className="dm-metrics">
        {secMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>
      <div className="dm-toolbar">
        <div className="dm-search">
          <span className="dm-search__icon">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, roll no, admission no…"
            data-testid="school-input-dm-search" />
          {search && <button className="dm-search__clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <button className="dm-toolbar__filters-toggle" onClick={() => setShowFilters(p => !p)}
          data-testid="school-button-dm-filters-toggle">⚙ Filters {showFilters ? '▲' : '▼'}</button>
        <div className={`dm-toolbar__filters${showFilters ? '' : ' dm-toolbar__filters--hidden'}`}>
          <select className="dm-filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            data-testid="school-dropdown-dm-priority">
            <option value="all">All Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select className="dm-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            data-testid="school-dropdown-dm-status">
            <option value="all">All Status</option>
            <option value="Critical Overdue">Critical Overdue</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="dm-results-bar">
        <span className="dm-results-bar__count">
          Showing {filtered.length} of {section.students.length} overdue students
        </span>
      </div>
      <div className="dm-table-wrap">
        <div className="dm-table-scroll">
          <table className="dm-table" data-testid="school-table-dm-students">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Admission No</th>
                <th>Parent Contact</th>
                <th>Total Due</th>
                <th>Overdue Amt</th>
                <th>Overdue Since</th>
                <th>Last Payment</th>
                <th>Reminder</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="dm-table__empty"><td colSpan={11}>No overdue students match the current filters.</td></tr>
              ) : filtered.map((st) => (
                <tr key={st.id} onClick={() => onSelectStudent(st)} data-testid={`school-row-dm-student-${st.id}`}>
                  <td className="dm-cell-mono">{st.rollNo}</td>
                  <td>
                    <div className="dm-cell-name">{st.name}</div>
                    <div className="dm-cell-sub">{st.paymentStatus}</div>
                  </td>
                  <td className="dm-cell-mono">{st.admissionNo}</td>
                  <td style={{ fontSize: '.75rem' }}>{st.parentContact}</td>
                  <td className="dm-cell-amt dm-cell-amt--danger">{formatINRFull(st.totalPendingAmount)}</td>
                  <td className="dm-cell-amt dm-cell-amt--warning">{formatINRFull(st.overdueAmount)}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: agingColor(st.overdueDays) }}>
                      {st.overdueDays}d
                    </span>
                    <div className="dm-cell-sub">{st.dueDate}</div>
                  </td>
                  <td className="dm-cell-mono" style={{ fontSize: '.75rem' }}>{st.lastPaymentDate}</td>
                  <td><ReminderBadge status={st.latestReminder?.status || 'Pending'} /></td>
                  <td><RiskBadge priority={st.priority} /></td>
                  <td>
                    <button className="dm-btn dm-btn--xs dm-btn--outline"
                      onClick={e => { e.stopPropagation(); onSelectStudent(st); }}
                      data-testid={`school-button-dm-view-${st.id}`}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── ACTION MODAL ─────────────────────────────────────────────────────────────
function DmActionModal({ type, student, onClose, onSuccess }) {
  const today = new Date().toISOString().slice(0, 10);

  const CONFIGS = {
    reminder: {
      title: 'Send Reminder',
      fields: [
        { key: 'channel', label: 'Channel', type: 'select', required: true, options: ['Email', 'SMS', 'Both', 'WhatsApp'] },
        { key: 'message', label: 'Custom Message (optional)', type: 'textarea', required: false },
      ],
      validate: f => { const e = {}; if (!f.channel) e.channel = 'Select a channel'; return e; },
    },
    sms: {
      title: 'Send SMS',
      fields: [
        { key: 'phone',   label: 'Phone Number', type: 'text',     required: true, defaultValue: student.phone },
        { key: 'message', label: 'Message',       type: 'textarea', required: true, maxLength: 160 },
      ],
      validate: f => {
        const e = {};
        if (!f.phone) e.phone = 'Phone required';
        if (!/^\d{10}$/.test((f.phone || '').replace(/\s/g, ''))) e.phone = 'Enter valid 10-digit number';
        if (!f.message) e.message = 'Message is required';
        if ((f.message || '').length > 160) e.message = 'Max 160 characters';
        return e;
      },
    },
    email: {
      title: 'Send Email',
      fields: [
        { key: 'to',      label: 'To',      type: 'text',     required: true, defaultValue: student.email },
        { key: 'subject', label: 'Subject',  type: 'text',     required: true },
        { key: 'body',    label: 'Message',  type: 'textarea', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.to) e.to = 'Email required';
        if (!f.subject) e.subject = 'Subject required';
        if (!f.body) e.body = 'Message required';
        return e;
      },
    },
    call: {
      title: 'Log Call to Parent',
      fields: [
        { key: 'phone', label: 'Parent Phone', type: 'text',     required: true, defaultValue: student.phone },
        { key: 'note',  label: 'Call Notes',   type: 'textarea', required: false },
      ],
      validate: f => { const e = {}; if (!f.phone) e.phone = 'Phone required'; return e; },
    },
    latefee: {
      title: 'Apply Late Fee',
      fields: [
        { key: 'daysOverdue', label: 'Days Overdue',     type: 'number', required: false, readOnly: true, defaultValue: String(student.overdueDays ?? 0) },
        { key: 'rate',        label: 'Rate (%)',          type: 'number', required: true,  hint: '0.1 – 5%' },
        { key: 'confirm',     label: 'Confirm applying this late fee to the student account', type: 'checkbox', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.rate || Number(f.rate) <= 0 || Number(f.rate) > 5) e.rate = 'Enter rate between 0.1 and 5';
        if (!f.confirm) e.confirm = 'Please confirm to proceed';
        return e;
      },
    },
    discount: {
      title: 'Apply Discount',
      fields: [
        { key: 'category', label: 'Fee Category',       type: 'select',   required: true, options: ['Tuition Fee', 'Transport Fee', 'Lab Fee', 'Books Fee', 'Exam Fee', 'Hostel Fee', 'Miscellaneous'] },
        { key: 'amount',   label: 'Discount Amount (₹)', type: 'number',   required: true },
        { key: 'reason',   label: 'Reason',              type: 'textarea', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.category) e.category = 'Select category';
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter valid amount';
        if (!f.reason) e.reason = 'Reason required';
        return e;
      },
    },
    payment: {
      title: 'Record Payment',
      fields: [
        { key: 'amount',    label: 'Amount (₹)',    type: 'number', required: true },
        { key: 'mode',      label: 'Payment Mode',   type: 'select', required: true, options: ['Cash', 'UPI', 'NEFT', 'RTGS', 'Card', 'Cheque'] },
        { key: 'date',      label: 'Payment Date',   type: 'date',   required: true, max: today },
        { key: 'reference', label: 'Reference/TxnID',type: 'text',   required: false },
        { key: 'remarks',   label: 'Remarks',        type: 'textarea', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter valid amount';
        if (!f.mode) e.mode = 'Select payment mode';
        if (!f.date) e.date = 'Select date';
        if (f.date > today) e.date = 'Cannot be future date';
        return e;
      },
    },
    statement: {
      title: 'Download Statement',
      fields: [
        { key: 'from',   label: 'From Date', type: 'date',   required: true },
        { key: 'to',     label: 'To Date',   type: 'date',   required: true },
        { key: 'format', label: 'Format',    type: 'select', required: true, options: ['PDF', 'Excel'] },
      ],
      validate: f => {
        const e = {};
        if (!f.from) e.from = 'From date required';
        if (!f.to) e.to = 'To date required';
        if (f.from && f.to && f.from > f.to) e.to = 'Must be after from date';
        if (!f.format) e.format = 'Select format';
        return e;
      },
    },
    escalate: {
      title: 'Escalate Case',
      fields: [
        { key: 'level',    label: 'Escalate To',      type: 'select',   required: true, options: ['HOD', 'Principal', 'Management Board'] },
        { key: 'reason',   label: 'Reason',            type: 'textarea', required: true },
        { key: 'action',   label: 'Action Required',   type: 'textarea', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.level) e.level = 'Select escalation level';
        if (!f.reason) e.reason = 'Reason is required';
        if (!f.action) e.action = 'Action required field is mandatory';
        return e;
      },
    },
  };

  const config = CONFIGS[type];
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const defaults = {};
    (config?.fields || []).forEach(f => { if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue; });
    setForm(defaults);
    setErrors({});
  }, [type]);

  if (!config) return null;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };
  const handleSubmit = () => {
    const errs = config.validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSuccess(type, form);
  };

  const renderField = (field) => {
    const val = form[field.key] ?? '';
    const err = errors[field.key];
    if (field.type === 'checkbox') return (
      <div key={field.key} className="dm-form-group">
        <label className="dm-form-check">
          <input type="checkbox" checked={!!form[field.key]} onChange={e => handleChange(field.key, e.target.checked)} />
          {field.label}{field.required && <span className="dm-form-required">*</span>}
        </label>
        {err && <span className="dm-form-error">{err}</span>}
      </div>
    );
    if (field.type === 'select') return (
      <div key={field.key} className="dm-form-group">
        <label className="dm-form-label">{field.label}{field.required && <span className="dm-form-required">*</span>}</label>
        <select className={`dm-form-select${err ? ' dm-form-input--error' : ''}`} value={val}
          onChange={e => handleChange(field.key, e.target.value)} data-testid={`school-dropdown-dm-action-${field.key}`}>
          <option value="">— Select —</option>
          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {err && <span className="dm-form-error">{err}</span>}
        {field.hint && <span className="dm-form-hint">{field.hint}</span>}
      </div>
    );
    if (field.type === 'textarea') return (
      <div key={field.key} className="dm-form-group">
        <label className="dm-form-label">{field.label}{field.required && <span className="dm-form-required">*</span>}</label>
        <textarea className={`dm-form-textarea${err ? ' dm-form-input--error' : ''}`} value={val}
          maxLength={field.maxLength} onChange={e => handleChange(field.key, e.target.value)}
          data-testid={`school-input-dm-action-${field.key}`} />
        {err && <span className="dm-form-error">{err}</span>}
        {field.maxLength && <span className="dm-form-hint">{(val || '').length}/{field.maxLength}</span>}
      </div>
    );
    return (
      <div key={field.key} className="dm-form-group">
        <label className="dm-form-label">{field.label}{field.required && <span className="dm-form-required">*</span>}</label>
        <input className={`dm-form-input${err ? ' dm-form-input--error' : ''}`}
          type={field.type} value={val} readOnly={field.readOnly} max={field.max}
          placeholder={field.placeholder || ''}
          onChange={e => !field.readOnly && handleChange(field.key, e.target.value)}
          data-testid={`school-input-dm-action-${field.key}`} />
        {err && <span className="dm-form-error">{err}</span>}
        {field.hint && <span className="dm-form-hint">{field.hint}</span>}
      </div>
    );
  };

  return (
    <div className="dm-action-overlay" role="dialog" aria-modal="true" data-testid="school-modal-dm-action">
      <div className="dm-action-modal">
        <div className="dm-action-modal__header">
          <h3 className="dm-action-modal__title">{config.title}</h3>
          <button className="dm-action-modal__close" onClick={onClose} data-testid="school-button-dm-action-close">✕</button>
        </div>
        <div className="dm-action-modal__body">{config.fields.map(renderField)}</div>
        <div className="dm-action-modal__footer">
          <button className="dm-btn dm-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="dm-btn dm-btn--primary" onClick={handleSubmit}>{config.title}</button>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT MODAL ────────────────────────────────────────────────────────────
function DmStudentModal({ student, onClose, showToast }) {
  const [tab, setTab] = useState('overview');
  const [actionModal, setActionModal] = useState(null);

  const TABS = [
    { key: 'overview',  label: 'Overview'   },
    { key: 'breakdown', label: 'Breakdown'  },
    { key: 'reminders', label: 'Reminders'  },
    { key: 'commlogs',  label: 'Comm Logs'  },
    { key: 'actions',   label: 'Actions'    },
  ];

  const agingData = getAgingAnalysis(student);

  const handleActionSuccess = useCallback((type) => {
    setActionModal(null);
    showToast(`${DM_ACTION_DEFS.find(a => a.key === type)?.label || type} completed.`, 'success');
  }, [showToast]);

  return (
    <>
      <div className="dm-modal-overlay" role="dialog" aria-modal="true"
        data-testid="school-modal-dm-student"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="dm-modal">
          <div className="dm-modal-header">
            <div className="dm-modal-header__avatar">{initials(student.name)}</div>
            <div className="dm-modal-header__info">
              <h2 className="dm-modal-header__name">{student.name}</h2>
              <div className="dm-modal-header__meta">
                <span>{student.class} – {student.section}</span>
                <span className="dm-modal-header__meta-sep">·</span>
                <span>Roll #{student.rollNo}</span>
                <span className="dm-modal-header__meta-sep">·</span>
                <span>{student.admissionNo}</span>
                <span className="dm-modal-header__meta-sep">·</span>
                <RiskBadge priority={student.priority} />
              </div>
            </div>
            <button className="dm-modal-header__close" onClick={onClose}
              data-testid="school-button-dm-modal-close">✕</button>
          </div>

          <div className="dm-modal-tabs" role="tablist">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key}
                className={`dm-modal-tab${tab === t.key ? ' dm-modal-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
                data-testid={`school-button-dm-tab-${t.key}`}>{t.label}</button>
            ))}
          </div>

          <div className="dm-modal-body" role="tabpanel">

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <>
                <p className="dm-modal-section-title">Student &amp; Overdue Summary</p>
                <div className="dm-overdue-summary">
                  <div className="dm-overdue-summary__item">
                    <span className="dm-overdue-summary__label">Total Due</span>
                    <span className="dm-overdue-summary__value dm-overdue-summary__value--danger">{formatINRFull(student.totalPendingAmount)}</span>
                  </div>
                  <div className="dm-overdue-summary__item">
                    <span className="dm-overdue-summary__label">Overdue Amount</span>
                    <span className="dm-overdue-summary__value dm-overdue-summary__value--warning">{formatINRFull(student.overdueAmount)}</span>
                  </div>
                  <div className="dm-overdue-summary__item">
                    <span className="dm-overdue-summary__label">Overdue Days</span>
                    <span className="dm-overdue-summary__value" style={{ color: agingColor(student.overdueDays) }}>{student.overdueDays} days</span>
                  </div>
                  <div className="dm-overdue-summary__item">
                    <span className="dm-overdue-summary__label">Due Since</span>
                    <span className="dm-overdue-summary__value">{student.dueDate}</span>
                  </div>
                </div>

                <p className="dm-modal-section-title">Contact Details</p>
                <div className="dm-info-card">
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Parent Name</span>
                    <span className="dm-info-card__value">{student.parentName}</span>
                  </div>
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Phone</span>
                    <span className="dm-info-card__value">{student.phone}</span>
                  </div>
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Email</span>
                    <span className="dm-info-card__value" style={{ wordBreak: 'break-all' }}>{student.email}</span>
                  </div>
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Gender</span>
                    <span className="dm-info-card__value">{student.gender}</span>
                  </div>
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Last Payment</span>
                    <span className="dm-info-card__value">{student.lastPaymentDate}</span>
                  </div>
                  <div className="dm-info-card__field">
                    <span className="dm-info-card__label">Address</span>
                    <span className="dm-info-card__value">{student.address}</span>
                  </div>
                </div>

                <p className="dm-modal-section-title">Aging Analysis</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  <div className="dm-aging-bar">
                    {agingData.map((seg, i) => (
                      <div key={i} className={`dm-aging-bar__seg dm-aging-bar__seg--${['0-30','31-60','61-90','90p'][i]}`}
                        style={{ flex: seg.amount > 0 ? 1 : 0.05 }} />
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.5rem' }}>
                    {agingData.map((seg) => (
                      <div key={seg.label} style={{ display: 'flex', flexDirection: 'column', gap: '.15rem' }}>
                        <span style={{ fontSize: '.6875rem', color: 'var(--dm-muted)', fontWeight: 600 }}>{seg.label}</span>
                        <span style={{ fontSize: '.875rem', fontWeight: 700, color: seg.color }}>
                          {seg.amount > 0 ? formatINRFull(seg.amount) : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── BREAKDOWN TAB ── */}
            {tab === 'breakdown' && student.feeBreakdown && (
              <>
                <p className="dm-modal-section-title">Fee Breakdown</p>
                {Object.entries(student.feeBreakdown).map(([termKey, rows]) => (
                  <div key={termKey} style={{ background: 'var(--dm-surface)', border: '1px solid var(--dm-line)', borderRadius: '.625rem', overflow: 'hidden' }}>
                    <div style={{ padding: '.75rem 1rem', fontWeight: 700, fontSize: '.875rem', background: 'var(--dm-bg)', borderBottom: '1px solid var(--dm-line)' }}>
                      {termKey === 'term1' ? 'Term 1' : 'Term 2'}
                    </div>
                    {rows.map((row, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 80px', gap: '.5rem', padding: '.625rem 1rem', borderBottom: '1px solid var(--dm-line)', fontSize: '.8125rem', alignItems: 'center' }}>
                        <span>{row.category}</span>
                        <span>{formatINRFull(row.expected)}</span>
                        <span style={{ color: '#16a34a', fontWeight: 600 }}>{formatINRFull(row.paid)}</span>
                        <span style={{ color: '#dc2626' }}>{row.overdue > 0 ? formatINRFull(row.overdue) : '—'}</span>
                        <span><RiskBadge priority={row.overdue > 0 ? 'Urgent' : 'Low'} /></span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}

            {/* ── REMINDERS TAB ── */}
            {tab === 'reminders' && (
              <>
                <p className="dm-modal-section-title">Reminder Log</p>
                {(!student.reminderLogs || student.reminderLogs.length === 0) ? (
                  <div className="dm-empty"><div className="dm-empty__icon">🔕</div><p className="dm-empty__title">No reminders sent yet</p></div>
                ) : (
                  <div className="dm-reminder-timeline">
                    {student.reminderLogs.map((log) => {
                      const key = log.status === 'Read' ? 'read' : log.status === 'Failed' ? 'failed' : 'sent';
                      const icon = key === 'read' ? '👁' : key === 'failed' ? '✕' : '✓';
                      return (
                        <div key={log.id} className="dm-reminder-timeline__item">
                          <div className={`dm-reminder-timeline__dot dm-reminder-timeline__dot--${key}`}>{icon}</div>
                          <div className="dm-reminder-timeline__content">
                            <div className="dm-reminder-timeline__top">
                              <span className="dm-reminder-timeline__type">{log.type}</span>
                              <ReminderBadge status={log.status} />
                              <span className="dm-reminder-timeline__date">{log.sentOn}</span>
                            </div>
                            <div className="dm-reminder-timeline__meta">
                              {log.template} · by {log.sentBy}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── COMM LOGS TAB ── */}
            {tab === 'commlogs' && (
              <>
                <p className="dm-modal-section-title">Communication Logs</p>
                <div className="dm-comm-log" data-testid="school-table-dm-commlogs">
                  <div className="dm-comm-log__row dm-comm-log__row--header">
                    <span>Date</span>
                    <span>Channel</span>
                    <span>Outcome</span>
                    <span>Notes</span>
                    <span>By</span>
                  </div>
                  {(!student.communicationLogs || student.communicationLogs.length === 0) ? (
                    <div className="dm-comm-log__empty">No communication logs found.</div>
                  ) : student.communicationLogs.map((log) => (
                    <div key={log.id} className="dm-comm-log__row">
                      <span className="dm-cell-mono">{log.date}</span>
                      <span>{log.channel}</span>
                      <span style={{ fontSize: '.75rem', fontWeight: 600 }}>{log.outcome}</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--dm-muted)' }}>{log.notes}</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--dm-muted)' }}>{log.by}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ACTIONS TAB ── */}
            {tab === 'actions' && (
              <>
                <p className="dm-modal-section-title">Available Actions</p>
                <div className="dm-action-grid">
                  {DM_ACTION_DEFS.map((a) => (
                    <button key={a.key}
                      className={`dm-action-btn${a.key === 'escalate' ? ' dm-action-btn--danger' : ''}`}
                      onClick={() => setActionModal(a.key)}
                      data-testid={`school-button-dm-action-${a.key}`}>
                      <span className="dm-action-btn__icon">{a.icon}</span>
                      <span className="dm-action-btn__label">{a.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {actionModal && (
        <DmActionModal
          type={actionModal}
          student={student}
          onClose={() => setActionModal(null)}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

/**
 * DueManagement — enterprise 3-level drill-down overdue fee module.
 * Overview → Class → Section → Student Profile (modal)
 */
export default function DueManagement() {
  const [view, setView] = useState('overview');
  const [selClass, setSelClass] = useState(null);
  const [selSection, setSelSection] = useState(null);
  const [selStudent, setSelStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goOverview = () => { setView('overview'); setSelClass(null); setSelSection(null); };
  const goClass = () => { if (selClass) { setView('class'); setSelSection(null); } };

  const fullSection = useMemo(() => {
    if (!selClass || !selSection) return null;
    return selClass.sections.find(s => s.id === selSection.id) ?? selSection;
  }, [selClass, selSection]);

  const titleMap = {
    overview: 'Due Management',
    class: selClass?.label ?? 'Class',
    section: selSection ? `${selClass?.label} — ${selSection.label}` : 'Section',
  };

  return (
    <div className="dm-root" data-testid="school-page-due-management">
      <ManagementPageHeader
        breadcrumbContent={(
          <Breadcrumb view={view} selClass={selClass} selSection={selSection}
            goOverview={goOverview} goClass={goClass} />
        )}
        title={titleMap[view]}
        subtitle={
          view === 'overview'
            ? `Academic Year 2024–25 · ${DUE_OVERVIEW_METRICS.studentsWithOverdue} students with overdue dues`
            : view === 'class'
              ? `${selClass?.sections?.length ?? 0} sections · Click section to view student list`
              : `${fullSection?.overdueStudentsCount ?? 0} overdue students`
        }
        actions={(
          <>
            {view !== 'overview' && (
              <button className="dm-btn dm-btn--ghost"
                onClick={view === 'section' ? goClass : goOverview}
                data-testid="school-button-dm-back">← Back</button>
            )}
            <button className="dm-btn dm-btn--outline"
              onClick={() => showToast('Bulk reminders sent to all overdue students.', 'info')}
              data-testid="school-button-dm-bulk-remind">🔔 Bulk Remind</button>
            <button className="dm-btn dm-btn--primary"
              onClick={() => showToast('Report exported successfully.', 'info')}
              data-testid="school-button-dm-export">📥 Export</button>
          </>
        )}
      />

      {view === 'overview' && <OverviewView onSelectClass={cls => { setSelClass(cls); setView('class'); }} />}
      {view === 'class' && selClass && <ClassView cls={selClass} onSelectSection={sec => { setSelSection(sec); setView('section'); }} />}
      {view === 'section' && selClass && fullSection && <SectionView cls={selClass} section={fullSection} onSelectStudent={setSelStudent} />}

      {selStudent && (
        <DmStudentModal student={selStudent} onClose={() => setSelStudent(null)} showToast={showToast} />
      )}

      {toast && (
        <div className={`dm-toast dm-toast--${toast.type}`} data-testid="school-toast-dm">
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}
    </div>
  );
}

