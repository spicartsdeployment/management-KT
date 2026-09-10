/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CLASSES_DATA, OVERVIEW_METRICS, formatINR, formatINRFull } from './mockData';
import '../../Assets/styles/FeeOverview.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

// ─── METRIC DEFINITIONS ───────────────────────────────────────────────────────
const METRIC_DEFS = [
  { key: 'totalStudents', icon: '🎓', label: 'Total Students', variant: 'primary', fmt: v => v.toLocaleString('en-IN') },
  { key: 'totalExpected',  icon: '💼', label: 'Fees Expected',  variant: 'info',    fmt: formatINR },
  { key: 'totalCollected', icon: '✅', label: 'Fees Collected', variant: 'success', fmt: formatINR },
  { key: 'totalPending',   icon: '⏳', label: 'Total Pending',  variant: 'warning', fmt: formatINR },
  { key: 'totalOverdue',   icon: '⚠️', label: 'Total Overdue',  variant: 'danger',  fmt: formatINR },
  { key: 'collectionPct',  icon: '📊', label: 'Collection %',   variant: 'neutral', fmt: v => `${v}%` },
];

const ACTION_DEFS = [
  { key: 'payment',     icon: '💳', label: 'Record Payment'      },
  { key: 'reminder',    icon: '🔔', label: 'Send Reminder'       },
  { key: 'sms',         icon: '💬', label: 'Send SMS'            },
  { key: 'email',       icon: '📧', label: 'Send Email'          },
  { key: 'call',        icon: '📞', label: 'Call Parent'         },
  { key: 'discount',    icon: '🏷️', label: 'Apply Discount'      },
  { key: 'scholarship', icon: '🎖️', label: 'Apply Scholarship'   },
  { key: 'latefee',     icon: '⚡', label: 'Apply Late Fee'      },
  { key: 'statement',   icon: '📄', label: 'Download Statement'  },
  { key: 'receipt',     icon: '🧾', label: 'Generate Receipt'    },
];

const STATUS_LABEL = { paid: 'Paid', partial: 'Partial', overdue: 'Overdue', pending: 'Pending' };

function barColor(pct) {
  return pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function MetricCard({ icon, value, label, variant }) {
  return (
    <div className={`fo-metric-card fo-metric-card--${variant}`}
      data-testid={`school-card-fo-metric-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
      <div className="fo-metric-card__icon">{icon}</div>
      <div className="fo-metric-card__body">
        <div className="fo-metric-card__value">{value}</div>
        <div className="fo-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`fo-badge fo-badge--${status}`}>{STATUS_LABEL[status] ?? status}</span>;
}

function CardProgress({ pct }) {
  return (
    <div className="fo-card-progress">
      <div className="fo-card-progress__fill" style={{ width: `${pct}%`, background: barColor(pct) }} />
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div className="fo-progress-cell">
      <div className="fo-progress-cell__bar">
        <div className="fo-progress-cell__fill" style={{ width: `${pct}%`, background: barColor(pct) }} />
      </div>
      <span className="fo-progress-cell__pct">{pct}%</span>
    </div>
  );
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
function Breadcrumb({ view, selClass, selSection, goOverview, goClass }) {
  return (
    <nav className="fo-breadcrumb" aria-label="Navigation">
      <button className="fo-breadcrumb__item" onClick={goOverview}
        data-testid="school-button-fo-breadcrumb-overview">Fee Overview</button>
      {(view === 'class' || view === 'section') && (
        <>
          <span className="fo-breadcrumb__sep" aria-hidden>›</span>
          {view === 'class'
            ? <span className="fo-breadcrumb__active">{selClass?.label}</span>
            : <button className="fo-breadcrumb__item" onClick={goClass}
                data-testid="school-button-fo-breadcrumb-class">{selClass?.label}</button>
          }
        </>
      )}
      {view === 'section' && (
        <>
          <span className="fo-breadcrumb__sep" aria-hidden>›</span>
          <span className="fo-breadcrumb__active">{selSection?.label}</span>
        </>
      )}
    </nav>
  );
}

// ─── OVERVIEW VIEW ────────────────────────────────────────────────────────────
function OverviewView({ onSelectClass }) {
  return (
    <>
      <div className="fo-metrics">
        {METRIC_DEFS.map((m) => (
          <MetricCard key={m.key} icon={m.icon}
            value={m.fmt(OVERVIEW_METRICS[m.key])} label={m.label} variant={m.variant} />
        ))}
      </div>
      <p className="fo-subtitle">Academic Year 2024–25 · All Classes · Click a class to drill down</p>
      <div className="fo-class-grid">
        {CLASSES_DATA.map((cls) => {
          const pct = cls.collectionPct;
          return (
            <div key={cls.id} className="fo-class-card" role="button" tabIndex={0}
              onClick={() => onSelectClass(cls)}
              onKeyDown={e => e.key === 'Enter' && onSelectClass(cls)}
              data-testid={`school-card-fo-class-${cls.id}`}>
              <div className="fo-class-card__header">
                <h3 className="fo-class-card__title">{cls.label}</h3>
                <span className="fo-class-card__pct">{pct}%</span>
              </div>
              <CardProgress pct={pct} />
              <div className="fo-class-card__stats">
                <div className="fo-class-card__stat">
                  <span className="fo-class-card__stat-label">Students</span>
                  <span className="fo-class-card__stat-val">{cls.totalStudents}</span>
                </div>
                <div className="fo-class-card__stat">
                  <span className="fo-class-card__stat-label">Expected</span>
                  <span className="fo-class-card__stat-val">{formatINR(cls.expected)}</span>
                </div>
                <div className="fo-class-card__stat">
                  <span className="fo-class-card__stat-label">Collected</span>
                  <span className="fo-class-card__stat-val fo-class-card__stat-val--success">{formatINR(cls.collected)}</span>
                </div>
                <div className="fo-class-card__stat">
                  <span className="fo-class-card__stat-label">Pending</span>
                  <span className="fo-class-card__stat-val fo-class-card__stat-val--warning">{formatINR(cls.pending)}</span>
                </div>
                {cls.overdue > 0 && (
                  <div className="fo-class-card__stat">
                    <span className="fo-class-card__stat-label">Overdue</span>
                    <span className="fo-class-card__stat-val fo-class-card__stat-val--danger">{formatINR(cls.overdue)}</span>
                  </div>
                )}
              </div>
              <div className="fo-class-card__footer">
                <span>{cls.sections.length} sections</span>
                <button className="fo-class-card__cta">View Details →</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── CLASS VIEW ───────────────────────────────────────────────────────────────
function ClassView({ cls, onSelectSection }) {
  const clsMetrics = [
    { icon: '🎓', label: 'Students',    value: cls.totalStudents.toLocaleString('en-IN'), variant: 'primary' },
    { icon: '💼', label: 'Expected',    value: formatINR(cls.expected),   variant: 'info'    },
    { icon: '✅', label: 'Collected',   value: formatINR(cls.collected),  variant: 'success' },
    { icon: '⏳', label: 'Pending',     value: formatINR(cls.pending),    variant: 'warning' },
    { icon: '⚠️', label: 'Overdue',    value: formatINR(cls.overdue),    variant: 'danger'  },
    { icon: '📊', label: 'Collection %', value: `${cls.collectionPct}%`, variant: 'neutral' },
  ];

  return (
    <>
      <div className="fo-section-header">
        <div className="fo-section-header__left">
          <h2 className="fo-section-header__title">{cls.label}</h2>
          <p className="fo-section-header__sub">
            {cls.sections.length} sections · {cls.totalStudents} students · Click a section to view student-wise details
          </p>
        </div>
      </div>
      <div className="fo-metrics">
        {clsMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>
      <div className="fo-section-grid">
        {cls.sections.map((sec) => (
          <div key={sec.id} className="fo-section-card" role="button" tabIndex={0}
            onClick={() => onSelectSection(sec)}
            onKeyDown={e => e.key === 'Enter' && onSelectSection(sec)}
            data-testid={`school-card-fo-section-${sec.id}`}>
            <div className="fo-section-card__header">
              <h3 className="fo-section-card__title">{sec.label}</h3>
              <span className="fo-section-card__pct">{sec.collectionPct}%</span>
            </div>
            <CardProgress pct={sec.collectionPct} />
            <div className="fo-section-card__stats">
              <div className="fo-section-card__stat">
                <span className="fo-section-card__stat-label">Students</span>
                <span className="fo-section-card__stat-val">{sec.totalStudents}</span>
              </div>
              <div className="fo-section-card__stat">
                <span className="fo-section-card__stat-label">Collected</span>
                <span className="fo-section-card__stat-val fo-section-card__stat-val--success">{formatINR(sec.collected)}</span>
              </div>
              <div className="fo-section-card__stat">
                <span className="fo-section-card__stat-label">Pending</span>
                <span className="fo-section-card__stat-val fo-section-card__stat-val--warning">{formatINR(sec.pending)}</span>
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let rows = section.students;
    if (statusFilter !== 'all') rows = rows.filter(s => s.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        String(s.rollNo).includes(q)
      );
    }
    return rows;
  }, [section.students, statusFilter, search]);

  const secMetrics = [
    { icon: '🎓', label: 'Students',   value: section.totalStudents.toLocaleString('en-IN'), variant: 'primary' },
    { icon: '✅', label: 'Collected',  value: formatINR(section.collected),  variant: 'success' },
    { icon: '⏳', label: 'Pending',    value: formatINR(section.pending),    variant: 'warning' },
    { icon: '⚠️', label: 'Overdue',   value: formatINR(section.overdue),    variant: 'danger'  },
    { icon: '📊', label: 'Collection %', value: `${section.collectionPct}%`, variant: 'neutral' },
  ];

  return (
    <>
      <div className="fo-section-header">
        <div className="fo-section-header__left">
          <h2 className="fo-section-header__title">{cls.label} — {section.label}</h2>
          <p className="fo-section-header__sub">{section.totalStudents} students · Click a row to view student profile</p>
        </div>
      </div>
      <div className="fo-metrics">
        {secMetrics.map((m) => (
          <MetricCard key={m.label} icon={m.icon} value={m.value} label={m.label} variant={m.variant} />
        ))}
      </div>
      <div className="fo-toolbar">
        <div className="fo-search" data-testid="school-field-fo-search">
          <span className="fo-search__icon">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, roll no, admission no…"
            data-testid="school-input-fo-search" />
          {search && <button className="fo-search__clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <button className="fo-toolbar__filters-toggle" onClick={() => setShowFilters(p => !p)}
          data-testid="school-button-fo-filters-toggle">
          ⚙ Filters {showFilters ? '▲' : '▼'}
        </button>
        <div className={`fo-toolbar__filters${showFilters ? '' : ' fo-toolbar__filters--hidden'}`}>
          <select className="fo-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            data-testid="school-dropdown-fo-status">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
            <option value="pending">Pending</option>
          </select>
          <select className="fo-filter-select" value={termFilter} onChange={e => setTermFilter(e.target.value)}
            data-testid="school-dropdown-fo-term">
            <option value="all">All Terms</option>
            <option value="term1">Term 1</option>
            <option value="term2">Term 2</option>
          </select>
        </div>
      </div>
      <div className="fo-results-bar">
        <span className="fo-results-bar__count">
          Showing {filtered.length} of {section.students.length} students
        </span>
      </div>
      <div className="fo-table-wrap">
        <div className="fo-table-scroll">
          <table className="fo-table" data-testid="school-table-fo-students">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Admission No</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Overdue</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="fo-table__empty"><td colSpan={10}>No students match the current filters.</td></tr>
              ) : filtered.map((st) => (
                <tr key={st.id} onClick={() => onSelectStudent(st)} data-testid={`school-row-fo-student-${st.id}`}>
                  <td className="fo-cell-mono">{st.rollNo}</td>
                  <td>
                    <div className="fo-cell-name">{st.name}</div>
                    <div className="fo-cell-sub">{st.gender}</div>
                  </td>
                  <td className="fo-cell-mono">{st.admissionNo}</td>
                  <td className="fo-cell-amt">{formatINRFull(st.totalAmount)}</td>
                  <td className="fo-cell-amt fo-cell-amt--success">{formatINRFull(st.paidAmount)}</td>
                  <td className="fo-cell-amt fo-cell-amt--warning">{formatINRFull(st.pendingAmount)}</td>
                  <td className="fo-cell-amt fo-cell-amt--danger">
                    {st.overdueAmount > 0 ? formatINRFull(st.overdueAmount) : '—'}
                  </td>
                  <td><ProgressBar pct={st.collectionPct} /></td>
                  <td><StatusBadge status={st.status} /></td>
                  <td>
                    <button className="fo-btn fo-btn--xs fo-btn--outline"
                      onClick={e => { e.stopPropagation(); onSelectStudent(st); }}
                      data-testid={`school-button-fo-view-${st.id}`}>View</button>
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
function ActionModal({ type, student, onClose, onSuccess }) {
  const today = new Date().toISOString().slice(0, 10);
  const maxDue = student.pendingAmount + student.overdueAmount;

  const CONFIGS = {
    payment: {
      title: 'Record Payment',
      fields: [
        { key: 'amount',    label: 'Amount (₹)',        type: 'number', required: true, hint: `Max payable: ${formatINRFull(maxDue)}` },
        { key: 'mode',      label: 'Payment Mode',       type: 'select', required: true, options: ['Cash', 'UPI', 'NEFT', 'RTGS', 'Card', 'Cheque', 'DD'] },
        { key: 'date',      label: 'Payment Date',       type: 'date',   required: true, max: today },
        { key: 'reference', label: 'Reference / TxnID',  type: 'text',   required: false },
        { key: 'remarks',   label: 'Remarks',            type: 'textarea', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter a valid amount';
        if (Number(f.amount) > maxDue) e.amount = `Amount exceeds due of ${formatINRFull(maxDue)}`;
        if (!f.mode) e.mode = 'Select payment mode';
        if (!f.date) e.date = 'Select payment date';
        if (f.date > today) e.date = 'Date cannot be in the future';
        return e;
      },
    },
    reminder: {
      title: 'Send Reminder',
      fields: [
        { key: 'channel', label: 'Channel', type: 'select', required: true, options: ['Email', 'SMS', 'Both'] },
        { key: 'message', label: 'Custom Message (optional)', type: 'textarea', required: false },
      ],
      validate: f => { const e = {}; if (!f.channel) e.channel = 'Select a channel'; return e; },
    },
    sms: {
      title: 'Send SMS',
      fields: [
        { key: 'phone',   label: 'Phone Number', type: 'text',     required: true, defaultValue: student.phone },
        { key: 'message', label: 'Message',       type: 'textarea', required: true, maxLength: 160, hint: 'Max 160 characters' },
      ],
      validate: f => {
        const e = {};
        if (!f.phone) e.phone = 'Phone required';
        if (!/^\d{10}$/.test((f.phone || '').replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit number';
        if (!f.message) e.message = 'Message is required';
        if ((f.message || '').length > 160) e.message = 'Message must be ≤ 160 characters';
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
        if (!f.to) e.to = 'Email is required';
        if (!f.subject) e.subject = 'Subject is required';
        if (!f.body) e.body = 'Message is required';
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
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter a valid amount';
        if (!f.reason) e.reason = 'Reason is required';
        return e;
      },
    },
    scholarship: {
      title: 'Apply Scholarship',
      fields: [
        { key: 'name',    label: 'Scholarship Name', type: 'text',     required: true },
        { key: 'amount',  label: 'Amount (₹)',        type: 'number',   required: true },
        { key: 'period',  label: 'Period',            type: 'text',     required: true, placeholder: 'e.g. 2024–25' },
        { key: 'remarks', label: 'Remarks',           type: 'textarea', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.name) e.name = 'Scholarship name required';
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter a valid amount';
        if (!f.period) e.period = 'Period required';
        return e;
      },
    },
    latefee: {
      title: 'Apply Late Fee',
      fields: [
        { key: 'daysOverdue', label: 'Days Overdue',        type: 'number', required: false, readOnly: true, defaultValue: String(student.overdueAmount > 0 ? 45 : 0) },
        { key: 'rate',        label: 'Late Fee Rate (%)',    type: 'number', required: true, placeholder: 'e.g. 1.5', hint: 'Range: 0.1% – 5%' },
        { key: 'confirm',     label: 'I confirm applying this late fee to the student account', type: 'checkbox', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.rate || Number(f.rate) <= 0 || Number(f.rate) > 5) e.rate = 'Enter a rate between 0.1 and 5';
        if (!f.confirm) e.confirm = 'Please confirm to proceed';
        return e;
      },
    },
    statement: {
      title: 'Download Fee Statement',
      fields: [
        { key: 'from',   label: 'From Date', type: 'date',   required: true },
        { key: 'to',     label: 'To Date',   type: 'date',   required: true },
        { key: 'format', label: 'Format',    type: 'select', required: true, options: ['PDF', 'Excel'] },
      ],
      validate: f => {
        const e = {};
        if (!f.from) e.from = 'From date required';
        if (!f.to) e.to = 'To date required';
        if (f.from && f.to && f.from > f.to) e.to = 'To date must be after from date';
        if (!f.format) e.format = 'Select format';
        return e;
      },
    },
    receipt: {
      title: 'Generate Receipt',
      fields: [
        { key: 'txnId',   label: 'Select Payment',    type: 'select',   required: true, options: (student.paymentHistory || []).map(p => p.receiptNo) },
        { key: 'remarks', label: 'Remarks (optional)', type: 'textarea', required: false },
      ],
      validate: f => { const e = {}; if (!f.txnId) e.txnId = 'Select a payment record'; return e; },
    },
  };

  const config = CONFIGS[type];
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const defaults = {};
    (config?.fields || []).forEach(f => {
      if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue;
    });
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
    const cls = `fo-form-input${err ? ' fo-form-input--error' : ''}`;

    if (field.type === 'checkbox') {
      return (
        <div key={field.key} className="fo-form-group">
          <label className="fo-form-check">
            <input type="checkbox" checked={!!form[field.key]}
              onChange={e => handleChange(field.key, e.target.checked)} />
            {field.label}
            {field.required && <span className="fo-form-required">*</span>}
          </label>
          {err && <span className="fo-form-error">{err}</span>}
        </div>
      );
    }
    if (field.type === 'select') {
      return (
        <div key={field.key} className="fo-form-group">
          <label className="fo-form-label">{field.label}{field.required && <span className="fo-form-required">*</span>}</label>
          <select className={cls.replace('fo-form-input', 'fo-form-select')}
            value={val} onChange={e => handleChange(field.key, e.target.value)}
            data-testid={`school-dropdown-fo-action-${field.key}`}>
            <option value="">— Select —</option>
            {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {err && <span className="fo-form-error">{err}</span>}
          {field.hint && <span className="fo-form-hint">{field.hint}</span>}
        </div>
      );
    }
    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="fo-form-group">
          <label className="fo-form-label">{field.label}{field.required && <span className="fo-form-required">*</span>}</label>
          <textarea className={`fo-form-textarea${err ? ' fo-form-input--error' : ''}`}
            value={val} maxLength={field.maxLength}
            onChange={e => handleChange(field.key, e.target.value)}
            data-testid={`school-input-fo-action-${field.key}`} />
          {err && <span className="fo-form-error">{err}</span>}
          {field.hint && <span className="fo-form-hint">{field.hint}</span>}
          {field.maxLength && <span className="fo-form-hint">{(val || '').length}/{field.maxLength}</span>}
        </div>
      );
    }
    return (
      <div key={field.key} className="fo-form-group">
        <label className="fo-form-label">{field.label}{field.required && <span className="fo-form-required">*</span>}</label>
        <input className={cls} type={field.type} value={val}
          readOnly={field.readOnly} max={field.max}
          placeholder={field.placeholder || ''}
          onChange={e => !field.readOnly && handleChange(field.key, e.target.value)}
          data-testid={`school-input-fo-action-${field.key}`} />
        {err && <span className="fo-form-error">{err}</span>}
        {field.hint && <span className="fo-form-hint">{field.hint}</span>}
      </div>
    );
  };

  return (
    <div className="fo-action-overlay" role="dialog" aria-modal="true"
      data-testid="school-modal-fo-action">
      <div className="fo-action-modal">
        <div className="fo-action-modal__header">
          <h3 className="fo-action-modal__title">{config.title}</h3>
          <button className="fo-action-modal__close" onClick={onClose}
            data-testid="school-button-fo-action-close">✕</button>
        </div>
        <div className="fo-action-modal__body">
          {config.fields.map(renderField)}
        </div>
        <div className="fo-action-modal__footer">
          <button className="fo-btn fo-btn--ghost" onClick={onClose}
            data-testid="school-button-fo-action-cancel">Cancel</button>
          <button className="fo-btn fo-btn--primary" onClick={handleSubmit}
            data-testid="school-button-fo-action-submit">{config.title}</button>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT MODAL ────────────────────────────────────────────────────────────
function StudentModal({ student, onClose, showToast }) {
  const [tab, setTab] = useState('overview');
  const [expandedTerms, setExpandedTerms] = useState({ term1: true, term2: false });
  const [actionModal, setActionModal] = useState(null);

  const TABS = [
    { key: 'overview',   label: 'Overview'     },
    { key: 'breakdown',  label: 'Fee Breakdown' },
    { key: 'history',    label: 'Payment History' },
    { key: 'actions',    label: 'Actions'      },
  ];

  const toggleTerm = (t) => setExpandedTerms(p => ({ ...p, [t]: !p[t] }));

  const handleActionSuccess = useCallback((type, formData) => {
    setActionModal(null);
    showToast(`${ACTION_DEFS.find(a => a.key === type)?.label || type} completed successfully.`, 'success');
  }, [showToast]);

  return (
    <>
      <div className="fo-modal-overlay" role="dialog" aria-modal="true"
        data-testid="school-modal-fo-student"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="fo-modal">
          {/* Header */}
          <div className="fo-modal-header">
            <div className="fo-modal-header__avatar">{initials(student.name)}</div>
            <div className="fo-modal-header__info">
              <h2 className="fo-modal-header__name">{student.name}</h2>
              <div className="fo-modal-header__meta">
                <span>{student.class} – {student.section}</span>
                <span className="fo-modal-header__meta-sep">·</span>
                <span>Roll #{student.rollNo}</span>
                <span className="fo-modal-header__meta-sep">·</span>
                <span>{student.admissionNo}</span>
                <span className="fo-modal-header__meta-sep">·</span>
                <StatusBadge status={student.status} />
              </div>
            </div>
            <button className="fo-modal-header__close" onClick={onClose}
              data-testid="school-button-fo-modal-close">✕</button>
          </div>

          {/* Tabs */}
          <div className="fo-modal-tabs" role="tablist">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key}
                className={`fo-modal-tab${tab === t.key ? ' fo-modal-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
                data-testid={`school-button-fo-modal-tab-${t.key}`}>{t.label}</button>
            ))}
          </div>

          {/* Body */}
          <div className="fo-modal-body" role="tabpanel">

            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <>
                <p className="fo-modal-section-title">Student &amp; Parent Details</p>
                <div className="fo-contact-card">
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Admission Date</span>
                    <span className="fo-contact-card__value">{student.admissionDate}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Gender</span>
                    <span className="fo-contact-card__value">{student.gender}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Parent Name</span>
                    <span className="fo-contact-card__value">{student.parentName}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Phone</span>
                    <span className="fo-contact-card__value">{student.phone}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Email</span>
                    <span className="fo-contact-card__value" style={{ wordBreak: 'break-all' }}>{student.email}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Address</span>
                    <span className="fo-contact-card__value">{student.address}</span>
                  </div>
                </div>

                <p className="fo-modal-section-title">Fee Summary</p>
                <div className="fo-big-progress">
                  <div className="fo-big-progress__top">
                    <span style={{ color: 'var(--fo-muted)' }}>Collection Progress</span>
                    <span style={{ color: barColor(student.collectionPct) }}>{student.collectionPct}%</span>
                  </div>
                  <div className="fo-big-progress__bar">
                    <div className="fo-big-progress__fill"
                      style={{ width: `${student.collectionPct}%`, background: barColor(student.collectionPct) }} />
                  </div>
                  <div className="fo-big-progress__labels">
                    <span>Paid: {formatINRFull(student.paidAmount)}</span>
                    <span>Total: {formatINRFull(student.totalAmount)}</span>
                  </div>
                </div>

                <div className="fo-contact-card">
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Total Fee</span>
                    <span className="fo-contact-card__value">{formatINRFull(student.totalAmount)}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Amount Paid</span>
                    <span className="fo-contact-card__value" style={{ color: '#16a34a' }}>{formatINRFull(student.paidAmount)}</span>
                  </div>
                  <div className="fo-contact-card__field">
                    <span className="fo-contact-card__label">Pending</span>
                    <span className="fo-contact-card__value" style={{ color: '#d97706' }}>{formatINRFull(student.pendingAmount)}</span>
                  </div>
                  {student.overdueAmount > 0 && (
                    <div className="fo-contact-card__field">
                      <span className="fo-contact-card__label">Overdue</span>
                      <span className="fo-contact-card__value" style={{ color: '#dc2626' }}>{formatINRFull(student.overdueAmount)}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── BREAKDOWN TAB ── */}
            {tab === 'breakdown' && student.feeBreakdown && (
              <>
                <p className="fo-modal-section-title">Fee Breakdown by Term</p>
                {Object.entries(student.feeBreakdown).map(([termKey, rows]) => {
                  const termLabel = termKey === 'term1' ? 'Term 1' : 'Term 2';
                  const isOpen = expandedTerms[termKey];
                  const totals = rows.reduce((acc, r) => ({
                    expected: acc.expected + r.expected,
                    paid: acc.paid + r.paid,
                    pending: acc.pending + (r.pending || 0),
                    overdue: acc.overdue + (r.overdue || 0),
                  }), { expected: 0, paid: 0, pending: 0, overdue: 0 });

                  return (
                    <div key={termKey} className="fo-breakdown-term">
                      <div className="fo-breakdown-term__header"
                        onClick={() => toggleTerm(termKey)}
                        data-testid={`school-button-fo-term-${termKey}`}>
                        <h4 className="fo-breakdown-term__htitle">{termLabel}</h4>
                        <span className={`fo-breakdown-term__arrow${isOpen ? ' fo-breakdown-term__arrow--open' : ''}`}>▼</span>
                      </div>
                      {isOpen && (
                        <div className="fo-breakdown-term__body">
                          <div className="fo-breakdown-term__row fo-breakdown-term__row--header">
                            <span>Category</span>
                            <span>Expected</span>
                            <span>Paid</span>
                            <span>Pending</span>
                            <span>Overdue</span>
                            <span>Status</span>
                          </div>
                          {rows.map((row, i) => (
                            <div key={i} className="fo-breakdown-term__row">
                              <span>{row.category}</span>
                              <span>{formatINRFull(row.expected)}</span>
                              <span style={{ color: '#16a34a', fontWeight: 600 }}>{formatINRFull(row.paid)}</span>
                              <span style={{ color: '#d97706' }}>{formatINRFull(row.pending || 0)}</span>
                              <span style={{ color: '#dc2626' }}>{row.overdue > 0 ? formatINRFull(row.overdue) : '—'}</span>
                              <span><StatusBadge status={row.status} /></span>
                            </div>
                          ))}
                          <div className="fo-breakdown-term__totals">
                            <div className="fo-breakdown-term__total-item">
                              <span className="fo-breakdown-term__total-label">Expected</span>
                              <span>{formatINRFull(totals.expected)}</span>
                            </div>
                            <div className="fo-breakdown-term__total-item">
                              <span className="fo-breakdown-term__total-label">Paid</span>
                              <span style={{ color: '#16a34a' }}>{formatINRFull(totals.paid)}</span>
                            </div>
                            <div className="fo-breakdown-term__total-item">
                              <span className="fo-breakdown-term__total-label">Pending</span>
                              <span style={{ color: '#d97706' }}>{formatINRFull(totals.pending)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* ── HISTORY TAB ── */}
            {tab === 'history' && (
              <>
                <p className="fo-modal-section-title">Payment History</p>
                <div className="fo-payment-history" data-testid="school-table-fo-payment-history">
                  <div className="fo-payment-history__row fo-payment-history__row--header">
                    <span>Date</span>
                    <span>Receipt No</span>
                    <span>Amount</span>
                    <span>Mode</span>
                    <span>Status</span>
                    <span>Collected By</span>
                    <span>TxnID</span>
                  </div>
                  {(!student.paymentHistory || student.paymentHistory.length === 0) ? (
                    <div className="fo-payment-history__empty">No payment records found.</div>
                  ) : student.paymentHistory.map((ph, i) => (
                    <div key={i} className="fo-payment-history__row">
                      <span className="fo-cell-mono">{ph.date}</span>
                      <span className="fo-cell-mono">{ph.receiptNo}</span>
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatINRFull(ph.amount)}</span>
                      <span><span className="fo-mode-badge">{ph.mode}</span></span>
                      <span><StatusBadge status={ph.status || 'paid'} /></span>
                      <span style={{ fontSize: '.75rem' }}>{ph.collectedBy}</span>
                      <span className="fo-cell-mono" style={{ fontSize: '.65rem' }}>{ph.txnId}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── ACTIONS TAB ── */}
            {tab === 'actions' && (
              <>
                <p className="fo-modal-section-title">Available Actions</p>
                <div className="fo-action-grid">
                  {ACTION_DEFS.map((a) => (
                    <button key={a.key} className="fo-action-btn"
                      onClick={() => setActionModal(a.key)}
                      data-testid={`school-button-fo-action-${a.key}`}>
                      <span className="fo-action-btn__icon">{a.icon}</span>
                      <span className="fo-action-btn__label">{a.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {actionModal && (
        <ActionModal
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
 * FeeOverview — enterprise 3-level drill-down fee management module.
 * Overview → Class → Section → Student Profile (modal)
 */
export default function FeeOverview() {
  const [view, setView] = useState('overview');          // 'overview' | 'class' | 'section'
  const [selClass, setSelClass] = useState(null);
  const [selSection, setSelSection] = useState(null);
  const [selStudent, setSelStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goOverview = useCallback(() => {
    setView('overview'); setSelClass(null); setSelSection(null);
  }, []);

  const goClass = useCallback(() => {
    if (!selClass) return;
    setView('class'); setSelSection(null);
  }, [selClass]);

  const handleSelectClass = useCallback((cls) => {
    setSelClass(cls); setView('class');
  }, []);

  const handleSelectSection = useCallback((sec) => {
    setSelSection(sec); setView('section');
  }, []);

  // Derive the full section object (with student list) from selSection
  const fullSection = useMemo(() => {
    if (!selClass || !selSection) return null;
    return selClass.sections.find(s => s.id === selSection.id) ?? selSection;
  }, [selClass, selSection]);

  const titleMap = {
    overview: 'Fee Overview',
    class: selClass?.label ?? 'Class',
    section: selSection ? `${selClass?.label} — ${selSection.label}` : 'Section',
  };

  const subtitleMap = {
    overview: 'Academic Year 2024–25 · All Classes · All Sections',
    class: `${selClass?.sections?.length ?? 0} sections · Click a section to drill down`,
    section: `${fullSection?.totalStudents ?? 0} students · Click a row to view student profile`,
  };

  return (
    <div className="fo-root" data-testid="school-page-fee-overview">
      <ManagementPageHeader
        breadcrumbContent={(
          <Breadcrumb
            view={view}
            selClass={selClass}
            selSection={selSection}
            goOverview={goOverview}
            goClass={goClass}
          />
        )}
        title={titleMap[view]}
        subtitle={subtitleMap[view]}
        actions={(
          <>
            {view !== 'overview' && (
              <button className="fo-btn fo-btn--ghost"
                onClick={view === 'section' ? goClass : goOverview}
                data-testid="school-button-fo-back">
                ← Back
              </button>
            )}
            <button className="fo-btn fo-btn--outline"
              onClick={() => showToast('Report exported successfully.', 'info')}
              data-testid="school-button-fo-export">
              📥 Export
            </button>
          </>
        )}
      />

      {/* ── Views ───────────────────────────────────────────────────────────── */}
      {view === 'overview' && (
        <OverviewView onSelectClass={handleSelectClass} />
      )}
      {view === 'class' && selClass && (
        <ClassView cls={selClass} onSelectSection={handleSelectSection} />
      )}
      {view === 'section' && selClass && fullSection && (
        <SectionView
          cls={selClass}
          section={fullSection}
          onSelectStudent={setSelStudent}
        />
      )}

      {/* ── Student Profile Modal ────────────────────────────────────────────── */}
      {selStudent && (
        <StudentModal
          student={selStudent}
          onClose={() => setSelStudent(null)}
          showToast={showToast}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fo-toast fo-toast--${toast.type}`}
          data-testid="school-toast-fo">
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}
    </div>
  );
}
