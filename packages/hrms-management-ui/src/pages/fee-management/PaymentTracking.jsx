/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  PAYMENT_TRANSACTIONS,
  PT_METRICS,
  formatINR,
  formatINRFull,
} from './paymentMockData';
import '../../Assets/styles/PaymentTracking.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PT_METRIC_DEFS = [
  { key: 'todayTotal',              icon: '💰', label: "Today's Collection",   variant: 'success', fmt: formatINR },
  { key: 'monthCollected',          icon: '📅', label: 'Month Collection',      variant: 'primary', fmt: formatINR },
  { key: 'pendingCount',            icon: '⏳', label: 'Pending Transactions',  variant: 'warning', fmt: v => v.toLocaleString('en-IN') },
  { key: 'failedCount',             icon: '❌', label: 'Failed Transactions',   variant: 'danger',  fmt: v => v.toLocaleString('en-IN') },
  { key: 'discountsApplied',        icon: '🏷️', label: 'Discounts Applied',     variant: 'info',    fmt: v => v.toLocaleString('en-IN') },
  { key: 'collectionEfficiencyPct', icon: '📊', label: 'Collection Efficiency', variant: 'success', fmt: v => `${v}%` },
];

const PT_ACTION_DEFS = [
  { key: 'record',  icon: '💳', label: 'Record Payment' },
  { key: 'receipt', icon: '🧾', label: 'View Receipt'   },
  { key: 'resend',  icon: '📤', label: 'Resend Receipt' },
  { key: 'fail',    icon: '🚫', label: 'Mark Failed'    },
  { key: 'refund',  icon: '↩️', label: 'Initiate Refund'},
  { key: 'reminder',icon: '🔔', label: 'Send Reminder'  },
  { key: 'download',icon: '⬇️', label: 'Download'       },
];

const STATUS_VARIANT = {
  Completed: 'completed',
  Partial:   'partial',
  Failed:    'failed',
  Pending:   'pending',
  Refunded:  'refunded',
};

const today = new Date().toISOString().slice(0, 10);

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function MetricCard({ icon, value, label, variant }) {
  return (
    <div className={`pt-metric-card pt-metric-card--${variant}`}
      data-testid={`school-card-pt-metric-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
      <div className="pt-metric-card__icon">{icon}</div>
      <div className="pt-metric-card__body">
        <div className="pt-metric-card__value">{value}</div>
        <div className="pt-metric-card__label">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`pt-status-badge pt-status-badge--${STATUS_VARIANT[status] ?? 'neutral'}`}>{status}</span>;
}

// ─── ACTION MODAL ─────────────────────────────────────────────────────────────
function PtActionModal({ type, txn, onClose, onSuccess }) {
  const CONFIGS = {
    record: {
      title: 'Record Payment',
      fields: [
        { key: 'amount',    label: 'Amount (₹)',    type: 'number', required: true },
        { key: 'mode',      label: 'Payment Mode',  type: 'select', required: true, options: ['Cash', 'UPI', 'NEFT', 'RTGS', 'Card', 'Cheque'] },
        { key: 'date',      label: 'Payment Date',  type: 'date',   required: true, max: today },
        { key: 'reference', label: 'Reference No',  type: 'text',   required: false },
        { key: 'remarks',   label: 'Remarks',       type: 'textarea', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter valid amount';
        if (!f.mode) e.mode = 'Select mode';
        if (!f.date) e.date = 'Date required';
        if (f.date > today) e.date = 'Cannot be future date';
        return e;
      },
    },
    receipt: {
      title: 'View / Print Receipt',
      fields: [
        { key: 'txnId', label: 'Transaction ID', type: 'text', required: true, readOnly: true, defaultValue: txn?.txnRef ?? '' },
      ],
      validate: () => ({}),
    },
    resend: {
      title: 'Resend Receipt',
      fields: [
        { key: 'channel', label: 'Send via', type: 'select', required: true, options: ['Email', 'SMS', 'WhatsApp'] },
        { key: 'to',      label: 'Recipient', type: 'text',   required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.channel) e.channel = 'Select channel';
        if (!f.to) e.to = 'Recipient required';
        return e;
      },
    },
    fail: {
      title: 'Mark as Failed',
      fields: [
        { key: 'reason', label: 'Reason for failure', type: 'textarea', required: true },
        { key: 'notify', label: 'Notify parent via SMS/Email', type: 'checkbox', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.reason) e.reason = 'Reason is required';
        return e;
      },
    },
    refund: {
      title: 'Initiate Refund',
      fields: [
        { key: 'amount',  label: 'Refund Amount (₹)', type: 'number',   required: true, hint: `Paid: ${formatINRFull(txn?.paidAmount ?? 0)}` },
        { key: 'reason',  label: 'Reason for Refund', type: 'textarea', required: true },
        { key: 'confirm', label: 'I confirm this refund request is authorised', type: 'checkbox', required: true },
      ],
      validate: f => {
        const e = {};
        if (!f.amount || Number(f.amount) <= 0) e.amount = 'Enter valid amount';
        if (txn?.paidAmount && Number(f.amount) > txn.paidAmount) e.amount = 'Cannot exceed paid amount';
        if (!f.reason) e.reason = 'Reason required';
        if (!f.confirm) e.confirm = 'Please confirm to proceed';
        return e;
      },
    },
    reminder: {
      title: 'Send Reminder',
      fields: [
        { key: 'channel', label: 'Channel', type: 'select', required: true, options: ['Email', 'SMS', 'Both', 'WhatsApp'] },
        { key: 'message', label: 'Message (optional)', type: 'textarea', required: false },
      ],
      validate: f => {
        const e = {};
        if (!f.channel) e.channel = 'Select channel';
        return e;
      },
    },
    download: {
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
      <div key={field.key} className="pt-form-group">
        <label className="pt-form-check">
          <input type="checkbox" checked={!!form[field.key]} onChange={e => handleChange(field.key, e.target.checked)} />
          {field.label}
        </label>
        {err && <span className="pt-form-error">{err}</span>}
      </div>
    );
    if (field.type === 'select') return (
      <div key={field.key} className="pt-form-group">
        <label className="pt-form-label">{field.label}{field.required && <span className="pt-form-required">*</span>}</label>
        <select className={`pt-form-select${err ? ' pt-form-input--error' : ''}`} value={val}
          onChange={e => handleChange(field.key, e.target.value)} data-testid={`school-dropdown-pt-action-${field.key}`}>
          <option value="">— Select —</option>
          {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {err && <span className="pt-form-error">{err}</span>}
      </div>
    );
    if (field.type === 'textarea') return (
      <div key={field.key} className="pt-form-group">
        <label className="pt-form-label">{field.label}{field.required && <span className="pt-form-required">*</span>}</label>
        <textarea className={`pt-form-textarea${err ? ' pt-form-input--error' : ''}`} value={val}
          onChange={e => handleChange(field.key, e.target.value)} data-testid={`school-input-pt-action-${field.key}`} />
        {err && <span className="pt-form-error">{err}</span>}
      </div>
    );
    return (
      <div key={field.key} className="pt-form-group">
        <label className="pt-form-label">{field.label}{field.required && <span className="pt-form-required">*</span>}</label>
        <input className={`pt-form-input${err ? ' pt-form-input--error' : ''}`}
          type={field.type} value={val} readOnly={field.readOnly} max={field.max}
          onChange={e => !field.readOnly && handleChange(field.key, e.target.value)}
          data-testid={`school-input-pt-action-${field.key}`} />
        {err && <span className="pt-form-error">{err}</span>}
        {field.hint && <span className="pt-form-hint">{field.hint}</span>}
      </div>
    );
  };

  return (
    <div className="pt-action-overlay" role="dialog" aria-modal="true" data-testid="school-modal-pt-action">
      <div className="pt-action-modal">
        <div className="pt-action-modal__header">
          <h3 className="pt-action-modal__title">{config.title}</h3>
          <button className="pt-action-modal__close" onClick={onClose} data-testid="school-button-pt-action-close">✕</button>
        </div>
        <div className="pt-action-modal__body">{config.fields.map(renderField)}</div>
        <div className="pt-action-modal__footer">
          <button className="pt-btn pt-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="pt-btn pt-btn--primary" onClick={handleSubmit}>{config.title}</button>
        </div>
      </div>
    </div>
  );
}

// ─── TRANSACTION MODAL ────────────────────────────────────────────────────────
function TxnModal({ txn, onClose, showToast }) {
  const [tab, setTab] = useState('details');
  const [actionModal, setActionModal] = useState(null);

  const TABS = [
    { key: 'details',  label: 'Details'   },
    { key: 'receipt',  label: 'Receipt'   },
    { key: 'audit',    label: 'Audit Log' },
    { key: 'actions',  label: 'Actions'   },
  ];

  const handleActionSuccess = useCallback((type) => {
    setActionModal(null);
    showToast(`${PT_ACTION_DEFS.find(a => a.key === type)?.label ?? type} completed.`, 'success');
  }, [showToast]);

  return (
    <>
      <div className="pt-modal-overlay" role="dialog" aria-modal="true"
        data-testid="school-modal-pt-transaction"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="pt-modal">
          <div className="pt-modal-header">
            <div className="pt-modal-header__icon">💳</div>
            <div className="pt-modal-header__info">
              <h2 className="pt-modal-header__title">{txn.receiptId} · {txn.studentName}</h2>
              <div className="pt-modal-header__meta">
                <span>{txn.classLabel} – {txn.section}</span>
                <span className="pt-modal-header__sep">·</span>
                <span className="pt-cell-mono">{txn.txnRef}</span>
                <span className="pt-modal-header__sep">·</span>
                <StatusBadge status={txn.status} />
              </div>
            </div>
            <button className="pt-modal-header__close" onClick={onClose} data-testid="school-button-pt-modal-close">✕</button>
          </div>
          <div className="pt-modal-tabs" role="tablist">
            {TABS.map(t => (
              <button key={t.key} role="tab" aria-selected={tab === t.key}
                className={`pt-modal-tab${tab === t.key ? ' pt-modal-tab--active' : ''}`}
                onClick={() => setTab(t.key)} data-testid={`school-button-pt-tab-${t.key}`}>{t.label}</button>
            ))}
          </div>
          <div className="pt-modal-body" role="tabpanel">

            {tab === 'details' && (
              <>
                <p className="pt-section-title">Transaction Details</p>
                <div className="pt-info-card">
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Receipt ID</span>
                    <span className="pt-info-card__value">{txn.receiptId}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Txn Ref</span>
                    <span className="pt-info-card__value">{txn.txnRef}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Date &amp; Time</span>
                    <span className="pt-info-card__value">{txn.dateTime}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Amount</span>
                    <span className={`pt-info-card__value pt-info-card__value--${txn.status === 'Completed' ? 'success' : 'warning'}`}>{formatINRFull(txn.paidAmount)}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Mode</span>
                    <span className="pt-info-card__value">{txn.mode}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Purpose</span>
                    <span className="pt-info-card__value">{txn.purpose}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Processed By</span>
                    <span className="pt-info-card__value">{txn.processedBy}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Status</span>
                    <StatusBadge status={txn.status} />
                  </div>
                  {txn.refundStatus !== 'None' && txn.refundAmount > 0 && (
                    <div className="pt-info-card__field">
                      <span className="pt-info-card__label">Refund</span>
                      <span className="pt-info-card__value pt-info-card__value--purple">{formatINRFull(txn.refundAmount)} ({txn.refundStatus})</span>
                    </div>
                  )}
                  {txn.remarks && (
                    <div className="pt-info-card__field" style={{ gridColumn: 'span 3' }}>
                      <span className="pt-info-card__label">Remarks</span>
                      <span className="pt-info-card__value">{txn.remarks}</span>
                    </div>
                  )}
                </div>

                <p className="pt-section-title">Student Details</p>
                <div className="pt-info-card">
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Name</span>
                    <span className="pt-info-card__value">{txn.studentName}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Admission No</span>
                    <span className="pt-info-card__value">{txn.admissionNo}</span>
                  </div>
                  <div className="pt-info-card__field">
                    <span className="pt-info-card__label">Class &amp; Section</span>
                    <span className="pt-info-card__value">{txn.classLabel} – {txn.section}</span>
                  </div>
                </div>
              </>
            )}

            {tab === 'receipt' && (
              <>
                <div className="pt-receipt-preview">
                  <div className="pt-receipt-preview__header">
                    <div className="pt-receipt-preview__school">Edgiant School</div>
                    <div className="pt-receipt-preview__sub">Fee Receipt — Official Copy</div>
                  </div>
                  <div className="pt-receipt-preview__row"><span>Receipt No</span><span>{txn.receiptId}</span></div>
                  <div className="pt-receipt-preview__row"><span>Date</span><span>{txn.dateTime.slice(0, 10)}</span></div>
                  <div className="pt-receipt-preview__row"><span>Student</span><span>{txn.studentName}</span></div>
                  <div className="pt-receipt-preview__row"><span>Class</span><span>{txn.classLabel} – {txn.section}</span></div>
                  <div className="pt-receipt-preview__row"><span>Purpose</span><span>{txn.purpose}</span></div>
                  <div className="pt-receipt-preview__row"><span>Mode</span><span>{txn.mode}</span></div>
                  <div className="pt-receipt-preview__row"><span>Txn Ref</span><span className="pt-cell-mono">{txn.txnRef}</span></div>
                  <div className="pt-receipt-preview__total"><span>Amount Paid</span><span style={{ color: '#16a34a' }}>{formatINRFull(txn.paidAmount)}</span></div>
                  <div className="pt-receipt-preview__footer">
                    {txn.status === 'Completed' && <span className="pt-receipt-preview__stamp">✓ PAID</span>}
                    <p>This is a computer-generated receipt — no signature required.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.625rem', justifyContent: 'center' }}>
                  <button className="pt-btn pt-btn--outline" onClick={() => showToast('Receipt downloaded.', 'info')}
                    data-testid="school-button-pt-receipt-download">⬇️ Download PDF</button>
                  <button className="pt-btn pt-btn--ghost" onClick={() => showToast('Receipt sent to parent.', 'success')}
                    data-testid="school-button-pt-receipt-resend">📤 Resend</button>
                </div>
              </>
            )}

            {tab === 'audit' && (
              <>
                <p className="pt-section-title">Audit Trail</p>
                {(!txn.auditLog || txn.auditLog.length === 0)
                  ? <div className="pt-empty"><div className="pt-empty__icon">📋</div><p className="pt-empty__title">No audit trail</p></div>
                  : (
                    <div className="pt-audit-trail">
                      {txn.auditLog.map((entry, i) => (
                        <div key={i} className="pt-audit-trail__item">
                          <div className="pt-audit-trail__dot">✓</div>
                          <div className="pt-audit-trail__body">
                            <div className="pt-audit-trail__action">{entry.action}</div>
                            <div className="pt-audit-trail__meta">{entry.ts} · {entry.by}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </>
            )}

            {tab === 'actions' && (
              <>
                <p className="pt-section-title">Available Actions</p>
                <div className="pt-action-grid">
                  {PT_ACTION_DEFS.map((a) => (
                    <button key={a.key}
                      className={`pt-action-btn${a.key === 'fail' || a.key === 'refund' ? ' pt-action-btn--danger' : ''}`}
                      onClick={() => setActionModal(a.key)}
                      data-testid={`school-button-pt-action-${a.key}`}>
                      <span className="pt-action-btn__icon">{a.icon}</span>
                      <span className="pt-action-btn__label">{a.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {actionModal && (
        <PtActionModal type={actionModal} txn={txn} onClose={() => setActionModal(null)} onSuccess={handleActionSuccess} />
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

/**
 * PaymentTracking — flat operational screen showing all payment transactions
 * with 6 filters, transaction detail modal (4 tabs), and 7 action modals.
 */
export default function PaymentTracking() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selTxn, setSelTxn] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const classes = useMemo(() => [...new Set(PAYMENT_TRANSACTIONS.map(t => t.classLabel))].sort(), []);
  const purposes = useMemo(() => [...new Set(PAYMENT_TRANSACTIONS.map(t => t.purpose))].sort(), []);
  const modes = ['Cash', 'UPI', 'NEFT', 'RTGS', 'Card', 'Cheque'];
  const statuses = ['Completed', 'Partial', 'Failed', 'Pending', 'Refunded'];

  const filtered = useMemo(() => {
    let rows = PAYMENT_TRANSACTIONS;
    if (statusFilter !== 'all') rows = rows.filter(t => t.status === statusFilter);
    if (modeFilter !== 'all') rows = rows.filter(t => t.mode === modeFilter);
    if (classFilter !== 'all') rows = rows.filter(t => t.classLabel === classFilter);
    if (purposeFilter !== 'all') rows = rows.filter(t => t.purpose === purposeFilter);
    if (dateFilter) rows = rows.filter(t => t.dateTime.startsWith(dateFilter));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(t =>
        t.studentName.toLowerCase().includes(q) ||
        t.txnRef.toLowerCase().includes(q) ||
        t.receiptId.toLowerCase().includes(q) ||
        t.admissionNo.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, statusFilter, modeFilter, classFilter, purposeFilter, dateFilter]);

  return (
    <div className="pt-root" data-testid="school-page-payment-tracking">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Fees' },
          { label: 'Payment Tracking' },
        ]}
        title="Payment Tracking"
        subtitle={`${PAYMENT_TRANSACTIONS.length} total transactions · Collection efficiency ${PT_METRICS.collectionEfficiencyPct}%`}
        actions={(
          <>
            <button className="pt-btn pt-btn--outline"
              onClick={() => showToast('Report exported.', 'info')}
              data-testid="school-button-pt-export">📥 Export</button>
            <button className="pt-btn pt-btn--primary"
              onClick={() => showToast('Reminders sent.', 'success')}
              data-testid="school-button-pt-remind">🔔 Remind Pending</button>
          </>
        )}
      />

      {/* Metrics */}
      <div className="pt-metrics">
        {PT_METRIC_DEFS.map((m) => (
          <MetricCard key={m.key} icon={m.icon} value={m.fmt(PT_METRICS[m.key] ?? 0)} label={m.label} variant={m.variant} />
        ))}
      </div>

      {/* Toolbar / Filters */}
      <div className="pt-toolbar">
        <div className="pt-search">
          <span className="pt-search__icon">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search student, receipt, txn ref…"
            data-testid="school-input-pt-search" />
          {search && <button className="pt-search__clear" onClick={() => setSearch('')}>✕</button>}
        </div>
        <select className="pt-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          data-testid="school-dropdown-pt-status">
          <option value="all">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="pt-filter-select" value={modeFilter} onChange={e => setModeFilter(e.target.value)}
          data-testid="school-dropdown-pt-mode">
          <option value="all">All Modes</option>
          {modes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="pt-filter-select" value={classFilter} onChange={e => setClassFilter(e.target.value)}
          data-testid="school-dropdown-pt-class">
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="pt-filter-select" value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)}
          data-testid="school-dropdown-pt-purpose">
          <option value="all">All Purposes</option>
          {purposes.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="date" className="pt-filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          max={today} data-testid="school-input-pt-date" />
        {(search || statusFilter !== 'all' || modeFilter !== 'all' || classFilter !== 'all' || purposeFilter !== 'all' || dateFilter) && (
          <button className="pt-btn pt-btn--ghost pt-btn--sm"
            onClick={() => { setSearch(''); setStatusFilter('all'); setModeFilter('all'); setClassFilter('all'); setPurposeFilter('all'); setDateFilter(''); }}
            data-testid="school-button-pt-clear-filters">Clear</button>
        )}
      </div>

      <div className="pt-results-bar">
        <span className="pt-results-bar__count">
          Showing {filtered.length} of {PAYMENT_TRANSACTIONS.length} transactions
        </span>
      </div>

      {/* Table */}
      <div className="pt-table-wrap">
        <div className="pt-table-scroll">
          <table className="pt-table" data-testid="school-table-pt-transactions">
            <thead>
              <tr>
                <th>#</th>
                <th>Receipt / Txn ID</th>
                <th>Student</th>
                <th>Class</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Processed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="pt-table__empty"><td colSpan={11}>No transactions match the current filters.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} onClick={() => setSelTxn(t)} data-testid={`school-row-pt-txn-${t.id}`}>
                  <td className="pt-cell-mono">{t.id}</td>
                  <td>
                    <div className="pt-cell-mono" style={{ fontSize: '.75rem' }}>{t.receiptId}</div>
                    <div className="pt-cell-sub">{t.txnRef}</div>
                  </td>
                  <td>
                    <div className="pt-cell-name">{t.studentName}</div>
                    <div className="pt-cell-sub">{t.admissionNo}</div>
                  </td>
                  <td>{t.classLabel} – {t.section}</td>
                  <td style={{ fontSize: '.75rem' }}>{t.purpose}</td>
                  <td>
                    <div className={`pt-cell-amt pt-cell-amt--${t.status === 'Completed' ? 'success' : t.status === 'Failed' ? 'danger' : 'warning'}`}>
                      {formatINRFull(t.paidAmount)}
                    </div>
                    {t.isPartial && <div className="pt-cell-sub">of {formatINRFull(t.amount)}</div>}
                  </td>
                  <td><span className="pt-mode-badge">{t.mode}</span></td>
                  <td className="pt-cell-mono" style={{ fontSize: '.75rem' }}>{t.dateTime}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td style={{ fontSize: '.75rem', color: 'var(--pt-muted)' }}>{t.processedBy}</td>
                  <td>
                    <button className="pt-btn pt-btn--xs pt-btn--outline"
                      onClick={e => { e.stopPropagation(); setSelTxn(t); }}
                      data-testid={`school-button-pt-view-${t.id}`}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selTxn && <TxnModal txn={selTxn} onClose={() => setSelTxn(null)} showToast={showToast} />}

      {toast && (
        <div className={`pt-toast pt-toast--${toast.type}`} data-testid="school-toast-pt">
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}
    </div>
  );
}
