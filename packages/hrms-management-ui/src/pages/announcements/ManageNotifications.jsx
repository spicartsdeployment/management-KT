import React, { useState, useMemo, useCallback, useEffect } from 'react';
import '../../Assets/styles/ManageNotifications.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  MA_CATEGORIES,
  MA_STATUSES,
  MA_PRIORITIES,
  MA_CHANNELS,
  MA_AUDIENCE_OPTIONS,
  MA_CREATOR_OPTIONS,
  MOCK_ANNOUNCEMENTS,
  MA_AUDIT_LOG,
  computeMetrics,
} from './manageAnnouncementsMockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Format ISO date string as locale date.
 * @param {string} iso
 * @returns {string}
 */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Format ISO date as relative time.
 * @param {string} iso
 * @returns {string}
 */
const fmtRelative = (iso) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

/**
 * Get read rate percentage for an announcement.
 * @param {object} a
 * @returns {number|null}
 */
const readRate = (a) =>
  a.recipients > 0 ? Math.round((a.readCount / a.recipients) * 100) : null;

/**
 * Get category config by id.
 * @param {string} id
 * @returns {object}
 */
const getCat = (id) =>
  MA_CATEGORIES.find((c) => c.id === id) || { label: id, icon: '📢', color: '#6b7280', bg: 'rgba(107,114,128,.1)' };

/**
 * Get status config by value.
 * @param {string} val
 * @returns {object}
 */
const getStatus = (val) =>
  MA_STATUSES.find((s) => s.value === val) || { label: val, color: '#6b7280', bg: 'rgba(107,114,128,.1)' };

/**
 * Get priority config by value.
 * @param {string} val
 * @returns {object}
 */
const getPriority = (val) =>
  MA_PRIORITIES.find((p) => p.value === val) || { label: val, color: '#6b7280', bg: 'rgba(107,114,128,.1)' };

// ─── UI Primitives ────────────────────────────────────────────────────────────
/** @param {{ status: string }} props */
const StatusBadge = ({ status }) => {
  const s = getStatus(status);
  return (
    <span className={`ma-status-badge ma-status-badge--${status}`}
      style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
};

/** @param {{ priority: string }} props */
const PriorityBadge = ({ priority }) => {
  const p = getPriority(priority);
  const icon = priority === 'urgent' ? '🔴' : priority === 'high' ? '🟠' : priority === 'medium' ? '🟡' : '🟢';
  return (
    <span className={`ma-priority-badge ma-priority-badge--${priority}`}
      style={{ color: p.color, background: p.bg }}>
      {icon} {p.label}
    </span>
  );
};

/** @param {{ categoryId: string }} props */
const CatBadge = ({ categoryId }) => {
  const c = getCat(categoryId);
  return (
    <span className="ma-cat-badge" style={{ color: c.color, background: c.bg }}>
      {c.icon} {c.label}
    </span>
  );
};

/** @param {{ channels: string[] }} props */
const ChannelChips = ({ channels }) => (
  <div className="ma-channel-chips">
    {channels.map((ch) => (
      <span key={ch} className="ma-channel-chip" title={MA_CHANNELS[ch]?.label || ch}>
        {MA_CHANNELS[ch]?.icon || '📡'}
      </span>
    ))}
  </div>
);

/** @param {{ pct: number|null }} props */
const ReadRateBar = ({ pct }) => {
  if (pct === null) return <span className="ma-cell-muted">—</span>;
  const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626';
  return (
    <div className="ma-read-rate">
      <div className="ma-read-rate__bar">
        <div className="ma-read-rate__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ma-read-rate__pct" style={{ color }}>{pct}%</span>
    </div>
  );
};

/** @param {{ msg: string, type?: string, onDone: function }} props */
const Toast = ({ msg, type = 'success', onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  return (
    <div className={`ma-toast ma-toast--${type}`} role="alert">
      {icons[type]} {msg}
    </div>
  );
};

/** @param {{ current: number, total: number, pageSize: number, onPage: function }} props */
const Pagination = ({ current, total, pageSize, onPage }) => {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="ma-pagination" data-testid="school-pagination-ma">
      <span className="ma-pagination__info">
        Showing {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, total)} of {total}
      </span>
      <div className="ma-pagination__controls">
        <button className="ma-pagination__btn" onClick={() => onPage(current - 1)} disabled={current === 1} data-testid="school-button-ma-prev-page">‹ Prev</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <button key={p} className={`ma-pagination__btn${p === current ? ' ma-pagination__btn--active' : ''}`}
            onClick={() => onPage(p)} data-testid={`school-button-ma-page-${p}`}>{p}</button>
        ))}
        <button className="ma-pagination__btn" onClick={() => onPage(current + 1)} disabled={current === pages} data-testid="school-button-ma-next-page">Next ›</button>
      </div>
    </div>
  );
};

// ─── View Modal ───────────────────────────────────────────────────────────────
/**
 * View full announcement details.
 * @param {{ ann: object, onClose: function, onEdit: function }} props
 */
function ViewModal({ ann, onClose, onEdit }) {
  const cat = getCat(ann.category);
  const rr  = readRate(ann);
  return (
    <div className="ma-modal-backdrop" role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="school-modal-ma-view">
      <div className="ma-modal ma-modal--lg">
        <div className="ma-modal__header">
          <div className="ma-modal__header-left">
            <span className="ma-modal__badge" style={{ color: cat.color, background: cat.bg }}>{cat.icon} {cat.label}</span>
            <span className="ma-modal__title">{ann.title}</span>
          </div>
          <button className="ma-modal__close" onClick={onClose} aria-label="Close modal" data-testid="school-button-ma-view-close">✕</button>
        </div>
        <div className="ma-modal__body">
          <div className="ma-modal__meta-row">
            <StatusBadge status={ann.status} />
            <PriorityBadge priority={ann.priority} />
            {ann.pinned && <span className="ma-pin-chip">📌 Pinned</span>}
            {ann.emergencyAlert && <span className="ma-emergency-chip">🚨 Emergency</span>}
          </div>
          <p className="ma-modal__summary">{ann.summary}</p>
          <div className="ma-modal__info-grid">
            <div className="ma-modal__info-block">
              <span className="ma-modal__info-label">Audience</span>
              <span className="ma-modal__info-value">{ann.audience}</span>
            </div>
            <div className="ma-modal__info-block">
              <span className="ma-modal__info-label">Created By</span>
              <span className="ma-modal__info-value">{ann.createdBy}</span>
            </div>
            <div className="ma-modal__info-block">
              <span className="ma-modal__info-label">Publish Date</span>
              <span className="ma-modal__info-value">{fmtDate(ann.publishDate)}</span>
            </div>
            <div className="ma-modal__info-block">
              <span className="ma-modal__info-label">Expiry Date</span>
              <span className="ma-modal__info-value">{fmtDate(ann.expiryDate)}</span>
            </div>
          </div>
          <div className="ma-modal__section-title">Delivery Channels</div>
          <ChannelChips channels={ann.channels} />
          {ann.recipients > 0 && (
            <>
              <div className="ma-modal__section-title ma-modal__section-title--mt">Engagement Metrics</div>
              <div className="ma-modal__stats-grid">
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value">{ann.recipients.toLocaleString()}</span>
                  <span className="ma-modal__stat-label">Recipients</span>
                </div>
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value">{ann.delivered.toLocaleString()}</span>
                  <span className="ma-modal__stat-label">Delivered</span>
                </div>
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value">{ann.readCount.toLocaleString()}</span>
                  <span className="ma-modal__stat-label">Read</span>
                </div>
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value">{ann.ackCount.toLocaleString()}</span>
                  <span className="ma-modal__stat-label">Acknowledged</span>
                </div>
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value">{ann.clickCount.toLocaleString()}</span>
                  <span className="ma-modal__stat-label">Clicks</span>
                </div>
                <div className="ma-modal__stat">
                  <span className="ma-modal__stat-value ma-modal__stat-value--danger">{ann.failed}</span>
                  <span className="ma-modal__stat-label">Failed</span>
                </div>
              </div>
              <div className="ma-modal__read-rate-bar">
                <span className="ma-modal__read-rate-label">Read Rate</span>
                <ReadRateBar pct={rr} />
              </div>
            </>
          )}
          {ann.editHistory?.length > 0 && (
            <>
              <div className="ma-modal__section-title ma-modal__section-title--mt">Edit History</div>
              <div className="ma-history-timeline">
                {ann.editHistory.map((h, i) => (
                  <div key={i} className="ma-history-timeline__item">
                    <span className="ma-history-timeline__dot" />
                    <div className="ma-history-timeline__content">
                      <span className="ma-history-timeline__action">{h.action}</span>
                      <span className="ma-history-timeline__meta">by {h.by} · {fmtRelative(h.at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="ma-modal__footer">
          <button className="ma-btn ma-btn--ghost" onClick={onClose} data-testid="school-button-ma-view-cancel">Close</button>
          {/* {['draft', 'scheduled', 'published'].includes(ann.status) && (
            <button className="ma-btn ma-btn--primary" onClick={() => { onEdit(ann); onClose(); }} data-testid="school-button-ma-view-edit">
              ✏️ Edit Announcement
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: '', category: 'general', audience: 'All Students', summary: '',
  priority: 'medium', status: 'draft', publishDate: '', expiryDate: '',
  channels: ['in-app', 'email'],
};

/**
 * Create / Edit announcement modal.
 * @param {{ ann: object|null, onClose: function, onSave: function }} props
 */
function EditModal({ ann, onClose, onSave }) {
  const isEdit              = Boolean(ann);
  const [form, setForm]     = useState(isEdit ? { ...ann } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  /** @param {string} f @param {*} v */
  const set = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: undefined }));
  };

  /** Toggle delivery channel. @param {string} ch */
  const toggleChannel = (ch) => {
    setForm((p) => ({
      ...p,
      channels: p.channels.includes(ch)
        ? p.channels.filter((c) => c !== ch)
        : [...p.channels, ch],
    }));
  };

  /** Validate form. @returns {object} */
  const validate = () => {
    const e = {};
    if (!form.title?.trim())    e.title    = 'Title is required.';
    if (!form.category)         e.category = 'Category is required.';
    if (!form.audience)         e.audience = 'Audience is required.';
    if (!form.channels?.length) e.channels = 'Select at least one channel.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: ann?.id || `ann-${Date.now()}` }, isEdit);
  };

  return (
    <div className="ma-modal-backdrop" role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="school-modal-ma-edit">
      <div className="ma-modal ma-modal--lg">
        <div className="ma-modal__header">
          <span className="ma-modal__title">{isEdit ? '✏️ Edit Announcement' : '📢 Create Announcement'}</span>
          <button className="ma-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-ma-edit-close">✕</button>
        </div>
        <div className="ma-modal__body">
          <div className="ma-form">
            <div className="ma-form__section-label">Basic Information</div>
            <div className="ma-field">
              <label className="ma-field__label">Title *</label>
              <input className={`ma-field__input${errors.title ? ' ma-field__input--error' : ''}`}
                value={form.title} onChange={(e) => set('title', e.target.value)}
                placeholder="Enter announcement title…" data-testid="school-field-ma-title" />
              {errors.title && <span className="ma-field__error">{errors.title}</span>}
            </div>
            <div className="ma-form__grid">
              <div className="ma-field">
                <label className="ma-field__label">Category *</label>
                <select className={`ma-field__select${errors.category ? ' ma-field__select--error' : ''}`}
                  value={form.category} onChange={(e) => set('category', e.target.value)}
                  data-testid="school-select-ma-category">
                  {MA_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div className="ma-field">
                <label className="ma-field__label">Priority</label>
                <select className="ma-field__select" value={form.priority}
                  onChange={(e) => set('priority', e.target.value)} data-testid="school-select-ma-priority">
                  {MA_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="ma-form__grid">
              <div className="ma-field">
                <label className="ma-field__label">Audience *</label>
                <select className={`ma-field__select${errors.audience ? ' ma-field__select--error' : ''}`}
                  value={form.audience} onChange={(e) => set('audience', e.target.value)}
                  data-testid="school-select-ma-audience">
                  {MA_AUDIENCE_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="ma-field">
                <label className="ma-field__label">Status</label>
                <select className="ma-field__select" value={form.status}
                  onChange={(e) => set('status', e.target.value)} data-testid="school-select-ma-status">
                  {MA_STATUSES.filter((s) => ['draft', 'scheduled', 'published'].includes(s.value)).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="ma-field">
              <label className="ma-field__label">Summary</label>
              <textarea className="ma-field__textarea" value={form.summary}
                onChange={(e) => set('summary', e.target.value)}
                placeholder="Brief description of this announcement…"
                data-testid="school-field-ma-summary" />
            </div>
            <div className="ma-form__section-label">Schedule & Expiry</div>
            <div className="ma-form__grid">
              <div className="ma-field">
                <label className="ma-field__label">Publish Date</label>
                <input type="date" className="ma-field__input" value={form.publishDate || ''}
                  onChange={(e) => set('publishDate', e.target.value)} data-testid="school-field-ma-publish-date" />
              </div>
              <div className="ma-field">
                <label className="ma-field__label">Expiry Date</label>
                <input type="date" className="ma-field__input" value={form.expiryDate || ''}
                  onChange={(e) => set('expiryDate', e.target.value)} data-testid="school-field-ma-expiry-date" />
              </div>
            </div>
            <div className="ma-form__section-label">Delivery Channels *</div>
            <div className={`ma-channel-selector${errors.channels ? ' ma-channel-selector--error' : ''}`}
              data-testid="school-field-ma-channels">
              {Object.entries(MA_CHANNELS).map(([id, ch]) => (
                <label key={id} className={`ma-channel-option${form.channels?.includes(id) ? ' ma-channel-option--active' : ''}`}
                  data-testid={`school-check-ma-channel-${id}`}>
                  <input type="checkbox" checked={form.channels?.includes(id)} onChange={() => toggleChannel(id)} />
                  {ch.icon} {ch.label}
                </label>
              ))}
            </div>
            {errors.channels && <span className="ma-field__error">{errors.channels}</span>}
          </div>
        </div>
        <div className="ma-modal__footer">
          <button className="ma-btn ma-btn--ghost" onClick={onClose} data-testid="school-button-ma-edit-cancel">Cancel</button>
          <button className="ma-btn ma-btn--primary" onClick={handleSubmit} data-testid="school-button-ma-edit-save">
            {isEdit ? '💾 Save Changes' : '📢 Create Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
/**
 * Generic confirmation dialog.
 * @param {{ title: string, message: React.ReactNode, confirmLabel: string, confirmClass: string, onClose: function, onConfirm: function, testId: string }} props
 */
function ConfirmModal({ title, message, confirmLabel, confirmClass, onClose, onConfirm, testId }) {
  return (
    <div className="ma-modal-backdrop" role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid={testId}>
      <div className="ma-modal ma-modal--sm">
        <div className="ma-modal__header">
          <span className="ma-modal__title">{title}</span>
          <button className="ma-modal__close" onClick={onClose} aria-label="Close" data-testid={`${testId}-close`}>✕</button>
        </div>
        <div className="ma-modal__body">
          <p className="ma-modal__info">{message}</p>
        </div>
        <div className="ma-modal__footer">
          <button className="ma-btn ma-btn--ghost" onClick={onClose} data-testid={`${testId}-cancel`}>Cancel</button>
          <button className={`ma-btn ${confirmClass}`} onClick={onConfirm} data-testid={`${testId}-confirm`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Extend Expiry Modal ──────────────────────────────────────────────────────
/**
 * Extend the expiry date of an announcement.
 * @param {{ ann: object, onClose: function, onSave: function }} props
 */
function ExtendExpiryModal({ ann, onClose, onSave }) {
  const [date, setDate] = useState(ann.expiryDate || '');
  return (
    <div className="ma-modal-backdrop" role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-testid="school-modal-ma-extend-expiry">
      <div className="ma-modal ma-modal--sm">
        <div className="ma-modal__header">
          <span className="ma-modal__title">📅 Extend Expiry</span>
          <button className="ma-modal__close" onClick={onClose} aria-label="Close" data-testid="school-button-ma-extend-close">✕</button>
        </div>
        <div className="ma-modal__body">
          <p className="ma-modal__info">Extending expiry for: <strong>{ann.title}</strong></p>
          <div className="ma-field">
            <label className="ma-field__label">New Expiry Date</label>
            <input type="date" className="ma-field__input" value={date}
              onChange={(e) => setDate(e.target.value)} data-testid="school-field-ma-new-expiry" />
          </div>
        </div>
        <div className="ma-modal__footer">
          <button className="ma-btn ma-btn--ghost" onClick={onClose} data-testid="school-button-ma-extend-cancel">Cancel</button>
          <button className="ma-btn ma-btn--primary" onClick={() => date && onSave(date)}
            disabled={!date} data-testid="school-button-ma-extend-save">Update Expiry</button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk Action Modal ────────────────────────────────────────────────────────
/**
 * Confirm bulk action on selected items.
 * @param {{ count: number, action: string, onClose: function, onConfirm: function }} props
 */
function BulkActionModal({ count, action, onClose, onConfirm }) {
  const labels = {
    archive: { label: 'Archive', cls: 'ma-btn--ghost',    icon: '📦' },
    delete:  { label: 'Delete',  cls: 'ma-btn--danger',   icon: '🗑️' },
    publish: { label: 'Publish', cls: 'ma-btn--success',  icon: '📢' },
    resend:  { label: 'Resend',  cls: 'ma-btn--info',     icon: '🔁' },
    pin:     { label: 'Pin',     cls: 'ma-btn--primary',  icon: '📌' },
  };
  const cfg = labels[action] || { label: action, cls: 'ma-btn--primary', icon: '⚙️' };
  return (
    <ConfirmModal
      title={`${cfg.icon} Bulk ${cfg.label}`}
      message={`This will ${action} ${count} selected announcement${count !== 1 ? 's' : ''}. Are you sure?`}
      confirmLabel={`${cfg.icon} ${cfg.label} ${count} Items`}
      confirmClass={cfg.cls}
      onClose={onClose}
      onConfirm={onConfirm}
      testId="school-modal-ma-bulk"
    />
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
/**
 * @param {{ icon: string, label: string, value: string|number, variant: string }} props
 */
function MetricCard({ icon, label, value, variant }) {
  return (
    <div className={`ma-metric-card ma-metric-card--${variant}`}
      data-testid={`school-card-ma-metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <span className="ma-metric-card__icon">{icon}</span>
      <div className="ma-metric-card__body">
        <span className="ma-metric-card__value">{value}</span>
        <span className="ma-metric-card__label">{label}</span>
      </div>
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
/**
 * @param {{ filters: object, onChange: function, onClear: function }} props
 */
function Toolbar({ filters, onChange, onClear }) {
  const [showFilters, setShowFilters] = useState(true);
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.priority !== 'all'
    || filters.audience || filters.creator || filters.dateFrom || filters.dateTo;

  return (
    <div className="ma-toolbar" data-testid="school-toolbar-ma">
      <div className="ma-search" data-testid="school-search-ma">
        <span className="ma-search__icon">🔍</span>
        <input value={filters.search} onChange={(e) => onChange('search', e.target.value)}
          placeholder="Search by title, audience, creator…" data-testid="school-field-ma-search" />
        {filters.search && (
          <button className="ma-search__clear" onClick={() => onChange('search', '')} aria-label="Clear search" data-testid="school-button-ma-clear-search">✕</button>
        )}
      </div>
      <button className="ma-toolbar__filters-toggle" onClick={() => setShowFilters((v) => !v)}
        data-testid="school-button-ma-filters-toggle">
        ⚙️ Filters {hasActiveFilters && <span className="ma-toolbar__filter-dot" />}
      </button>
      <div className={`ma-toolbar__filters${showFilters ? '' : ' ma-toolbar__filters--hidden'}`}>
        <select className="ma-filter-select" value={filters.category}
          onChange={(e) => onChange('category', e.target.value)} data-testid="school-select-ma-filter-category">
          <option value="all">All Categories</option>
          {MA_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select className="ma-filter-select" value={filters.priority}
          onChange={(e) => onChange('priority', e.target.value)} data-testid="school-select-ma-filter-priority">
          <option value="all">All Priorities</option>
          {MA_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select className="ma-filter-select" value={filters.audience}
          onChange={(e) => onChange('audience', e.target.value)} data-testid="school-select-ma-filter-audience">
          <option value="">All Audiences</option>
          {MA_AUDIENCE_OPTIONS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select className="ma-filter-select" value={filters.creator}
          onChange={(e) => onChange('creator', e.target.value)} data-testid="school-select-ma-filter-creator">
          <option value="">All Creators</option>
          {MA_CREATOR_OPTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="date" className="ma-filter-select" value={filters.dateFrom}
          onChange={(e) => onChange('dateFrom', e.target.value)}
          title="Publish date from" data-testid="school-field-ma-filter-date-from" />
        <input type="date" className="ma-filter-select" value={filters.dateTo}
          onChange={(e) => onChange('dateTo', e.target.value)}
          title="Publish date to" data-testid="school-field-ma-filter-date-to" />
        {hasActiveFilters && (
          <button className="ma-btn ma-btn--ghost ma-btn--sm" onClick={onClear}
            data-testid="school-button-ma-clear-filters">✕ Clear</button>
        )}
      </div>
    </div>
  );
}

// ─── Bulk Action Bar ──────────────────────────────────────────────────────────
/**
 * @param {{ count: number, onBulk: function, onClear: function }} props
 */
function BulkBar({ count, onBulk, onClear }) {
  return (
    <div className="ma-bulk-bar" data-testid="school-bulk-bar-ma">
      <span className="ma-bulk-bar__count">{count} selected</span>
      <div className="ma-bulk-bar__actions">
        <button className="ma-btn ma-btn--sm ma-btn--success" onClick={() => onBulk('publish')} data-testid="school-button-ma-bulk-publish">📢 Publish</button>
        <button className="ma-btn ma-btn--sm ma-btn--ghost"   onClick={() => onBulk('pin')}     data-testid="school-button-ma-bulk-pin">📌 Pin</button>
        <button className="ma-btn ma-btn--sm ma-btn--ghost"   onClick={() => onBulk('archive')} data-testid="school-button-ma-bulk-archive">📦 Archive</button>
        <button className="ma-btn ma-btn--sm ma-btn--info"    onClick={() => onBulk('resend')}  data-testid="school-button-ma-bulk-resend">🔁 Resend</button>
        <button className="ma-btn ma-btn--sm ma-btn--danger"  onClick={() => onBulk('delete')}  data-testid="school-button-ma-bulk-delete">🗑️ Delete</button>
      </div>
      <button className="ma-bulk-bar__deselect" onClick={onClear} data-testid="school-button-ma-bulk-deselect">✕ Deselect All</button>
    </div>
  );
}

// ─── Announcements Table ──────────────────────────────────────────────────────
const PAGE_SIZE = 7;

/**
 * @param {{ items: Array, selected: Set, onSelect: function, onSelectAll: function, onAction: function }} props
 */
function AnnouncementsTable({ items, selected, onSelect, onSelectAll, onAction }) {
  const [page, setPage]       = useState(1);
  const [sortKey, setSortKey] = useState('publishDate');
  const [sortDir, setSortDir] = useState('desc');

  /** Toggle sort column. @param {string} key */
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [items, sortKey, sortDir]);

  const paged     = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allOnPage = paged.length > 0 && paged.every((a) => selected.has(a.id));

  /** Render sort indicator. @param {string} key @returns {string} */
  const si = (key) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  return (
    <div className="ma-table-wrap" data-testid="school-table-wrap-ma">
      <div className="ma-table-scroll">
        <table className="ma-table" data-testid="school-table-ma-announcements">
          <thead>
            <tr>
              <th className="ma-table__check-col">
                <input type="checkbox" checked={allOnPage} onChange={() => onSelectAll(paged)}
                  aria-label="Select all on page" data-testid="school-check-ma-select-all" />
              </th>
              <th className="ma-table__th--sortable" onClick={() => toggleSort('title')}>Title{si('title')}</th>
              <th>Category</th>
              <th>Audience</th>
              <th className="ma-table__th--sortable" onClick={() => toggleSort('createdBy')}>Created By{si('createdBy')}</th>
              <th className="ma-table__th--sortable" onClick={() => toggleSort('publishDate')}>Publish Date{si('publishDate')}</th>
              <th>Expiry Date</th>
              <th>Channels</th>
              <th className="ma-table__th--sortable" onClick={() => toggleSort('status')}>Status{si('status')}</th>
              <th className="ma-table__th--sortable" onClick={() => toggleSort('priority')}>Priority{si('priority')}</th>
              <th>Read Rate</th>
              <th className="ma-table__actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr className="ma-table__empty">
                <td colSpan={12}>📭 No announcements match the current filters.</td>
              </tr>
            ) : paged.map((a) => (
              <tr key={a.id}
                className={`${selected.has(a.id) ? 'ma-table__row--selected' : ''}${a.emergencyAlert ? ' ma-table__row--emergency' : ''}`}
                data-testid={`school-row-ma-announcement-${a.id}`}>
                <td className="ma-table__check-col">
                  <input type="checkbox" checked={selected.has(a.id)} onChange={() => onSelect(a.id)}
                    aria-label={`Select ${a.title}`} data-testid={`school-check-ma-row-${a.id}`} />
                </td>
                <td>
                  <div className="ma-cell-title">
                    {a.pinned && <span className="ma-pin-indicator" title="Pinned">📌 </span>}
                    {a.emergencyAlert && <span className="ma-emergency-indicator" title="Emergency">🚨 </span>}
                    {a.title}
                  </div>
                  <div className="ma-cell-sub">{a.summary}</div>
                </td>
                <td><CatBadge categoryId={a.category} /></td>
                <td className="ma-cell-muted">{a.audience}</td>
                <td className="ma-cell-muted">{a.createdBy}</td>
                <td className="ma-cell-muted">{fmtDate(a.publishDate)}</td>
                <td className="ma-cell-muted">{fmtDate(a.expiryDate)}</td>
                <td><ChannelChips channels={a.channels} /></td>
                <td><StatusBadge status={a.status} /></td>
                <td><PriorityBadge priority={a.priority} /></td>
                <td><ReadRateBar pct={readRate(a)} /></td>
                <td className="ma-table__actions-col">
                  <div className="ma-row-actions">
                    <button className="ma-row-actions__btn" onClick={() => onAction('view', a)}
                      title="View Details" data-testid={`school-button-ma-view-${a.id}`}>👁️</button>
                    {['draft', 'scheduled', 'published'].includes(a.status) && (
                      <button className="ma-row-actions__btn" onClick={() => onAction('edit', a)}
                        title="Edit" data-testid={`school-button-ma-edit-${a.id}`}>✏️</button>
                    )}
                    <button className="ma-row-actions__btn" onClick={() => onAction('duplicate', a)}
                      title="Duplicate" data-testid={`school-button-ma-duplicate-${a.id}`}>📋</button>
                    {a.status === 'published' && (
                      <button className="ma-row-actions__btn" onClick={() => onAction('extend', a)}
                        title="Extend Expiry" data-testid={`school-button-ma-extend-${a.id}`}>📅</button>
                    )}
                    {a.status === 'failed' && (
                      <button className="ma-row-actions__btn ma-row-actions__btn--info" onClick={() => onAction('resend', a)}
                        title="Resend" data-testid={`school-button-ma-resend-${a.id}`}>🔁</button>
                    )}
                    {!['archived'].includes(a.status) && (
                      <button className="ma-row-actions__btn" onClick={() => onAction('archive', a)}
                        title="Archive" data-testid={`school-button-ma-archive-${a.id}`}>📦</button>
                    )}
                    <button className="ma-row-actions__btn ma-row-actions__btn--danger" onClick={() => onAction('delete', a)}
                      title="Delete" data-testid={`school-button-ma-delete-${a.id}`}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ma-table-footer">
        <Pagination current={page} total={sorted.length} pageSize={PAGE_SIZE} onPage={setPage} />
      </div>
    </div>
  );
}

// ─── Engagement Analytics Section ─────────────────────────────────────────────
/**
 * @param {{ announcements: Array }} props
 */
function EngagementSection({ announcements }) {
  const published = announcements.filter((a) => a.recipients > 0);
  if (!published.length) return null;

  const totRecipients = published.reduce((s, a) => s + a.recipients, 0);
  const totDelivered  = published.reduce((s, a) => s + a.delivered,  0);
  const totRead       = published.reduce((s, a) => s + a.readCount,  0);
  const totAck        = published.reduce((s, a) => s + a.ackCount,   0);
  const totClicks     = published.reduce((s, a) => s + a.clickCount, 0);
  const totFailed     = published.reduce((s, a) => s + a.failed,     0);
  const deliveryRate  = totRecipients > 0 ? Math.round((totDelivered / totRecipients) * 100) : 0;
  const readRateAll   = totRecipients > 0 ? Math.round((totRead      / totRecipients) * 100) : 0;
  const ackRate       = totRecipients > 0 ? Math.round((totAck       / totRecipients) * 100) : 0;
  const ctr           = totDelivered  > 0 ? Math.round((totClicks    / totDelivered)  * 100) : 0;

  const topItems = [...published].sort((a, b) => (readRate(b) || 0) - (readRate(a) || 0)).slice(0, 5);

  return (
    <div className="ma-section" data-testid="school-section-ma-engagement">
      <div className="ma-section__header">
        <div className="ma-section__title">📊 Engagement &amp; Analytics</div>
        <div className="ma-section__subtitle">Aggregate delivery and read metrics across all sent announcements</div>
      </div>
      <div className="ma-analytics-grid">
        {[
          { label: 'Total Recipients',       value: totRecipients.toLocaleString(), pct: 100,          color: '#c9a962' },
          { label: 'Delivery Rate',          value: `${deliveryRate}%`,             pct: deliveryRate,  color: deliveryRate >= 90 ? '#16a34a' : '#d97706' },
          { label: 'Read Rate',              value: `${readRateAll}%`,              pct: readRateAll,   color: '#2563eb' },
          { label: 'Acknowledgement Rate',   value: `${ackRate}%`,                  pct: ackRate,       color: '#8b5cf6' },
          { label: 'Click-Through Rate',     value: `${ctr}%`,                      pct: ctr,           color: '#06b6d4' },
          { label: 'Failed Deliveries',      value: totFailed.toLocaleString(),     pct: totRecipients > 0 ? Math.round((totFailed / totRecipients) * 100) : 0, color: '#dc2626', danger: true },
        ].map(({ label, value, pct, color, danger }) => (
          <div key={label} className={`ma-analytics-card${danger ? ' ma-analytics-card--danger' : ''}`}
            data-testid={`school-card-ma-analytics-${label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="ma-analytics-card__label">{label}</div>
            <div className="ma-analytics-card__value" style={{ color }}>{value}</div>
            <div className="ma-analytics-card__bar">
              <div className="ma-analytics-card__fill" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="ma-top-announcements">
        <div className="ma-top-announcements__title">Top 5 Announcements by Read Rate</div>
        <div className="ma-table-scroll">
          <table className="ma-inner-table" data-testid="school-table-ma-top-announcements">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Recipients</th><th>Read</th><th>Read Rate</th><th>Acks</th></tr>
            </thead>
            <tbody>
              {topItems.map((a) => (
                <tr key={a.id} data-testid={`school-row-ma-top-${a.id}`}>
                  <td className="ma-cell-title">{a.title}</td>
                  <td><CatBadge categoryId={a.category} /></td>
                  <td className="ma-cell-muted">{a.recipients.toLocaleString()}</td>
                  <td className="ma-cell-muted">{a.readCount.toLocaleString()}</td>
                  <td><ReadRateBar pct={readRate(a)} /></td>
                  <td className="ma-cell-muted">{a.ackCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Scheduled Queue Section ──────────────────────────────────────────────────
/**
 * @param {{ announcements: Array, onAction: function }} props
 */
function ScheduledQueueSection({ announcements, onAction }) {
  const scheduled = announcements.filter((a) => a.status === 'scheduled');
  return (
    <div className="ma-section" data-testid="school-section-ma-scheduled">
      <div className="ma-section__header">
        <div className="ma-section__title">⏰ Scheduled Queue</div>
        <div className="ma-section__subtitle">
          {scheduled.length} announcement{scheduled.length !== 1 ? 's' : ''} pending delivery
        </div>
      </div>
      {scheduled.length === 0 ? (
        <div className="ma-empty-state">📭 No scheduled announcements at this time.</div>
      ) : (
        <div className="ma-scheduled-list">
          {scheduled.map((a) => {
            const cat = getCat(a.category);
            return (
              <div key={a.id} className="ma-scheduled-item" data-testid={`school-row-ma-scheduled-${a.id}`}>
                <div className="ma-scheduled-item__icon" style={{ background: cat.bg, color: cat.color }}>{cat.icon}</div>
                <div className="ma-scheduled-item__body">
                  <div className="ma-scheduled-item__title">{a.title}</div>
                  <div className="ma-scheduled-item__meta">
                    <span>{cat.label}</span><span>·</span>
                    <span>{a.audience}</span><span>·</span>
                    <span>by {a.createdBy}</span>
                  </div>
                </div>
                <div className="ma-scheduled-item__right">
                  <div className="ma-scheduled-item__date">📅 {fmtDate(a.publishDate)}</div>
                  <ChannelChips channels={a.channels} />
                </div>
                <div className="ma-scheduled-item__actions">
                  <button className="ma-btn ma-btn--ghost ma-btn--sm" onClick={() => onAction('edit', a)}
                    data-testid={`school-button-ma-scheduled-edit-${a.id}`}>Edit</button>
                  <button className="ma-btn ma-btn--danger ma-btn--sm" onClick={() => onAction('delete', a)}
                    data-testid={`school-button-ma-scheduled-delete-${a.id}`}>Cancel</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── History / Audit Log Section ──────────────────────────────────────────────
/**
 * @param {{ logs: Array }} props
 */
function HistorySection({ logs }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() =>
    logs.filter((l) => !search ||
      [l.admin, l.action, l.module].some((f) => f.toLowerCase().includes(search.toLowerCase()))),
    [logs, search]
  );
  const severityColor = { info: '#2563eb', high: '#dc2626', danger: '#9f1239', warning: '#d97706' };

  return (
    <div className="ma-section" data-testid="school-section-ma-history">
      <div className="ma-section__header">
        <div className="ma-section__title">📋 Activity Log</div>
        <div className="ma-section__subtitle">Audit trail of all announcement activity and admin actions</div>
      </div>
      <div className="ma-history-filters">
        <div className="ma-search ma-search--sm">
          <span className="ma-search__icon">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by admin, action or announcement…"
            data-testid="school-field-ma-history-search" />
        </div>
      </div>
      <div className="ma-table-scroll">
        <table className="ma-inner-table" data-testid="school-table-ma-activity-log">
          <thead>
            <tr><th>#</th><th>Admin</th><th>Action</th><th>Announcement</th><th>Severity</th><th>Time</th></tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} data-testid={`school-row-ma-log-${l.id}`}>
                <td className="ma-cell-mono">{l.id}</td>
                <td className="ma-cell-muted">{l.admin}</td>
                <td style={{ color: severityColor[l.severity] || '#6b7280', fontWeight: 600 }}>{l.action}</td>
                <td className="ma-cell-title">{l.module}</td>
                <td>
                  <span className="ma-log-severity"
                    style={{ color: severityColor[l.severity], background: `${severityColor[l.severity]}18` }}>
                    {l.severity}
                  </span>
                </td>
                <td className="ma-cell-muted">{fmtRelative(l.at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="ma-table__empty-cell">No log entries match the filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ManageNotifications ──────────────────────────────────────────────────────
const INITIAL_FILTERS = {
  search: '', status: 'all', category: 'all', priority: 'all',
  audience: '', creator: '', dateFrom: '', dateTo: '',
};

/**
 * Manage Announcements — communication management center, tracking system, and operational dashboard.
 */
export default function ManageNotifications() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [filters, setFilters]             = useState(INITIAL_FILTERS);
  const [selected, setSelected]           = useState(new Set());
  const [activeModal, setActiveModal]     = useState(null);
  const [modalData, setModalData]         = useState(null);
  const [toast, setToast]                 = useState(null);
  const [bulkAction, setBulkAction]       = useState(null);

  const metrics = useMemo(() => computeMetrics(announcements), [announcements]);

  /** @param {string} field @param {*} value */
  const handleFilterChange = useCallback((field, value) => {
    setFilters((p) => ({ ...p, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSelected(new Set());
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      if (filters.status   !== 'all' && a.status   !== filters.status)   return false;
      if (filters.category !== 'all' && a.category !== filters.category) return false;
      if (filters.priority !== 'all' && a.priority !== filters.priority) return false;
      if (filters.audience && !a.audience.toLowerCase().includes(filters.audience.toLowerCase())) return false;
      if (filters.creator  && a.createdBy !== filters.creator) return false;
      if (filters.dateFrom && a.publishDate && a.publishDate < filters.dateFrom) return false;
      if (filters.dateTo   && a.publishDate && a.publishDate > filters.dateTo)   return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (![a.title, a.audience, a.createdBy, a.summary].some((f) => (f || '').toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [announcements, filters]);

  /** @param {string} key @param {*} data */
  const openModal  = useCallback((key, data = null) => { setModalData(data); setActiveModal(key); }, []);
  const closeModal = useCallback(() => { setActiveModal(null); setModalData(null); }, []);

  /** @param {string} msg @param {string} type */
  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

  /** @param {string} action @param {object} ann */
  const handleAction = useCallback((action, ann) => {
    switch (action) {
      case 'view':      openModal('view', ann); break;
      case 'edit':      openModal('edit', ann); break;
      case 'duplicate': {
        const dup = { ...ann, id: `ann-dup-${Date.now()}`, title: `${ann.title} (Copy)`, status: 'draft', publishDate: null, expiryDate: null, recipients: 0, delivered: 0, readCount: 0, ackCount: 0, clickCount: 0, failed: 0, pinned: false };
        setAnnouncements((p) => [dup, ...p]);
        showToast('Announcement duplicated as draft.', 'success');
        break;
      }
      case 'archive': openModal('archive-confirm', ann); break;
      case 'delete':  openModal('delete-confirm',  ann); break;
      case 'extend':  openModal('extend-expiry',   ann); break;
      case 'resend':  openModal('resend-confirm',  ann); break;
      default: break;
    }
  }, [openModal, showToast]);

  /** @param {string} id */
  const handleSelect = useCallback((id) => {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  /** @param {Array} rows */
  const handleSelectAll = useCallback((rows) => {
    const allSelected = rows.every((r) => selected.has(r.id));
    setSelected((p) => { const n = new Set(p); rows.forEach((r) => allSelected ? n.delete(r.id) : n.add(r.id)); return n; });
  }, [selected]);

  const handleBulkAction = useCallback((action) => setBulkAction(action), []);

  const confirmBulkAction = useCallback(() => {
    if (!bulkAction) return;
    const ids = [...selected];
    if (bulkAction === 'delete')  setAnnouncements((p) => p.filter((a) => !ids.includes(a.id)));
    if (bulkAction === 'archive') setAnnouncements((p) => p.map((a) => ids.includes(a.id) ? { ...a, status: 'archived' } : a));
    if (bulkAction === 'publish') setAnnouncements((p) => p.map((a) => ids.includes(a.id) && a.status === 'draft' ? { ...a, status: 'published', publishDate: new Date().toISOString().split('T')[0] } : a));
    if (bulkAction === 'pin')     setAnnouncements((p) => p.map((a) => ids.includes(a.id) ? { ...a, pinned: true } : a));
    showToast(bulkAction === 'resend' ? `Resend queued for ${ids.length} items.` : `${ids.length} announcement(s) ${bulkAction}d.`, bulkAction === 'resend' ? 'info' : 'success');
    setSelected(new Set());
    setBulkAction(null);
  }, [bulkAction, selected, showToast]);

  /** @param {object} form @param {boolean} isEdit */
  const handleSave = useCallback((form, isEdit) => {
    if (isEdit) setAnnouncements((p) => p.map((a) => a.id === form.id ? { ...a, ...form } : a));
    else        setAnnouncements((p) => [form, ...p]);
    showToast(isEdit ? 'Announcement updated.' : 'Announcement created.', 'success');
    closeModal();
  }, [closeModal, showToast]);

  const handleArchiveConfirm = useCallback(() => {
    setAnnouncements((p) => p.map((a) => a.id === modalData?.id ? { ...a, status: 'archived' } : a));
    showToast('Announcement archived.', 'success');
    closeModal();
  }, [modalData, showToast, closeModal]);

  const handleDeleteConfirm = useCallback(() => {
    setAnnouncements((p) => p.filter((a) => a.id !== modalData?.id));
    showToast('Announcement deleted.', 'warn');
    closeModal();
  }, [modalData, showToast, closeModal]);

  /** @param {string} newDate */
  const handleExtendSave = useCallback((newDate) => {
    setAnnouncements((p) => p.map((a) => a.id === modalData?.id ? { ...a, expiryDate: newDate } : a));
    showToast('Expiry date extended.', 'success');
    closeModal();
  }, [modalData, showToast, closeModal]);

  const handleResendConfirm = useCallback(() => {
    showToast('Resend notification queued.', 'info');
    closeModal();
  }, [showToast, closeModal]);

  const STATUS_TABS = [
    { value: 'all',       label: 'All',       count: announcements.length },
    { value: 'published', label: 'Published',  count: metrics.published },
    { value: 'scheduled', label: 'Scheduled',  count: metrics.scheduled },
    { value: 'draft',     label: 'Drafts',     count: metrics.drafts },
    { value: 'expired',   label: 'Expired',    count: announcements.filter((a) => a.status === 'expired').length },
    { value: 'archived',  label: 'Archived',   count: announcements.filter((a) => a.status === 'archived').length },
    { value: 'failed',    label: 'Failed',     count: metrics.failed },
  ];

  return (
    <div className="ma-root" data-testid="school-page-manage-announcements">

      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Announcements' },
          { label: 'Manage' },
        ]}
        title="Manage Announcements"
        subtitle="Communication management center — track, edit, archive and monitor all announcements"
        actions={(
          <>
            <button className="ma-btn ma-btn--ghost ma-btn--sm" type="button" data-testid="school-button-ma-export">
              ⬇️ Export
            </button>
            <button className="ma-btn ma-btn--primary" type="button" onClick={() => openModal('edit', null)}
              data-testid="school-button-ma-create">
              ＋ New Announcement
            </button>
          </>
        )}
      />

      {/* ── Metric Cards ─────────────────────────────────────────────────── */}
      <div className="ma-metrics" data-testid="school-metrics-ma">
        <MetricCard icon="📢" label="Total Announcements" value={metrics.total}          variant="primary" />
        <MetricCard icon="✅" label="Published"           value={metrics.published}      variant="success" />
        <MetricCard icon="⏰" label="Scheduled"           value={metrics.scheduled}      variant="info"    />
        <MetricCard icon="📝" label="Drafts"              value={metrics.drafts}         variant="neutral" />
        <MetricCard icon="👁️" label="Read Rate"           value={`${metrics.readRate}%`} variant="warning" />
        <MetricCard icon="❌" label="Failed Deliveries"   value={metrics.failed}         variant="danger"  />
      </div>

      {/* ── Status Filter Tabs ────────────────────────────────────────────── */}
      <div className="ma-cat-bar" role="tablist" aria-label="Filter by status" data-testid="school-status-tabs-ma">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={filters.status === tab.value}
            className={`ma-cat-chip${filters.status === tab.value ? ' ma-cat-chip--active' : ''}`}
            onClick={() => handleFilterChange('status', tab.value)}
            type="button"
            data-testid={`school-tab-ma-${tab.value}`}
          >
            {tab.label}
            <span className="ma-cat-chip__count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <Toolbar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />

      {/* ── Bulk Action Bar ───────────────────────────────────────────────── */}
      {selected.size > 0 && (
        <BulkBar count={selected.size} onBulk={handleBulkAction} onClear={() => setSelected(new Set())} />
      )}

      {/* ── Results Info ──────────────────────────────────────────────────── */}
      <div className="ma-results-bar">
        <span className="ma-results-bar__count">
          {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''} found
          {selected.size > 0 && ` · ${selected.size} selected`}
        </span>
      </div>

      {/* ── Announcements Table ───────────────────────────────────────────── */}
      <AnnouncementsTable
        items={filteredAnnouncements}
        selected={selected}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onAction={handleAction}
      />

      {/* ── Engagement Analytics ──────────────────────────────────────────── */}
      <EngagementSection announcements={announcements} />

      {/* ── Scheduled Queue ───────────────────────────────────────────────── */}
      <ScheduledQueueSection announcements={announcements} onAction={handleAction} />

      {/* ── Activity History ──────────────────────────────────────────────── */}
      <HistorySection logs={MA_AUDIT_LOG} />

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {activeModal === 'view' && modalData && (
        <ViewModal ann={modalData} onClose={closeModal} onEdit={(a) => openModal('edit', a)} />
      )}
      {activeModal === 'edit' && (
        <EditModal ann={modalData} onClose={closeModal} onSave={handleSave} />
      )}
      {activeModal === 'delete-confirm' && modalData && (
        <ConfirmModal
          title="🗑️ Delete Announcement"
          message={<>Permanently delete <strong>{modalData.title}</strong>? This cannot be undone.</>}
          confirmLabel="🗑️ Delete"
          confirmClass="ma-btn--danger"
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
          testId="school-modal-ma-delete"
        />
      )}
      {activeModal === 'archive-confirm' && modalData && (
        <ConfirmModal
          title="📦 Archive Announcement"
          message={<>Archive <strong>{modalData.title}</strong>? Archived announcements can be restored later.</>}
          confirmLabel="📦 Archive"
          confirmClass="ma-btn--ghost"
          onClose={closeModal}
          onConfirm={handleArchiveConfirm}
          testId="school-modal-ma-archive"
        />
      )}
      {activeModal === 'resend-confirm' && modalData && (
        <ConfirmModal
          title="🔁 Resend Notification"
          message={<>Resend <strong>{modalData.title}</strong> to {modalData.failed} failed recipients?</>}
          confirmLabel="🔁 Resend Now"
          confirmClass="ma-btn--info"
          onClose={closeModal}
          onConfirm={handleResendConfirm}
          testId="school-modal-ma-resend"
        />
      )}
      {activeModal === 'extend-expiry' && modalData && (
        <ExtendExpiryModal ann={modalData} onClose={closeModal} onSave={handleExtendSave} />
      )}
      {bulkAction && (
        <BulkActionModal count={selected.size} action={bulkAction}
          onClose={() => setBulkAction(null)} onConfirm={confirmBulkAction} />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
