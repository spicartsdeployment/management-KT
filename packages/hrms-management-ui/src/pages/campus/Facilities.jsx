import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import '../../Assets/styles/Facilities.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  FACILITY_METRICS, CATEGORIES, ACADEMIC_FACILITIES, SPORTS_FACILITIES,
  EVENT_FACILITIES, DINING_FACILITIES, HOSTEL_FACILITIES, HEALTH_FACILITIES,
  TRANSPORT_ROUTES, IT_FACILITIES, RECREATIONAL_FACILITIES, STAFF_FACILITIES,
  BOOKINGS, MAINTENANCE_REQUESTS, COMPLAINTS, FACILITY_ANALYTICS, CALENDAR_EVENTS,
} from './facilitiesMockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'overview',     label: '🏛️ Overview'      },
  { key: 'academic',     label: '🎓 Academic'       },
  { key: 'sports',       label: '⚽ Sports'         },
  { key: 'events',       label: '🎭 Events'         },
  { key: 'dining',       label: '🍽️ Dining'         },
  { key: 'hostel',       label: '🏠 Hostel'         },
  { key: 'health',       label: '🏥 Health'         },
  { key: 'transport',    label: '🚌 Transport'      },
  { key: 'it-digital',   label: '💻 IT & Digital'  },
  { key: 'recreational', label: '🎮 Recreational'  },
  { key: 'staff',        label: '👔 Staff'          },
  { key: 'bookings',     label: '📋 Bookings'       },
  { key: 'maintenance',  label: '🔧 Maintenance'    },
  { key: 'analytics',    label: '📊 Analytics'      },
];

// ─── Shared Primitives ────────────────────────────────────────────────────────

function ProgressBar({ pct, tone = 'green' }) {
  const colors = {
    green:  '#22c55e', amber:  '#f59e0b', red:    '#ef4444',
    blue:   '#6366f1', gold:   '#c9a962', teal:   '#14b8a6',
    sky:    '#38bdf8', violet: '#8b5cf6', indigo: '#4f46e5',
  };
  return (
    <div className="cf-progress">
      <div className="cf-progress__track">
        <div className="cf-progress__fill" style={{ width: `${Math.min(pct, 100)}%`, background: colors[tone] || colors.green }} />
      </div>
      <span className="cf-progress__label">{pct}%</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase().replace(/[\s/]+/g, '-');
  return <span className={`cf-badge cf-badge--${s}`}>{status}</span>;
}

function SeverityBadge({ severity }) {
  const s = (severity || '').toLowerCase();
  return <span className={`cf-severity cf-severity--${s}`}>{severity}</span>;
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div
      className="cf-modal-backdrop"
      ref={ref}
      onClick={(e) => e.target === ref.current && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className={`cf-modal${wide ? ' cf-modal--wide' : ''}`} aria-label={title}>
        <div className="cf-modal__header">
          <h3 className="cf-modal__title">{title}</h3>
          <button className="cf-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="cf-modal__body">{children}</div>
      </div>
    </div>
  );
}

// ─── Book Facility Modal ──────────────────────────────────────────────────────

function BookFacilityModal({ onClose, data }) {
  const [form, setForm] = useState({ facility: data?.name || data?.route || '', date: '', from: '', to: '', purpose: '', notes: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <Modal title="Book Facility" onClose={onClose} wide>
      <div className="cf-form">
        <div className="cf-form__row">
          <label className="cf-form__label">Facility</label>
          <input className="cf-form__input" value={form.facility} onChange={e => set('facility', e.target.value)} placeholder="Select or type facility name" data-testid="school-field-cf-book-facility" />
        </div>
        <div className="cf-form__row cf-form__row--2col">
          <div>
            <label className="cf-form__label">Date</label>
            <input className="cf-form__input" type="date" value={form.date} onChange={e => set('date', e.target.value)} data-testid="school-field-cf-book-date" />
          </div>
          <div>
            <label className="cf-form__label">Time Slot</label>
            <div className="cf-form__time-row">
              <input className="cf-form__input" type="time" value={form.from} onChange={e => set('from', e.target.value)} data-testid="school-field-cf-book-from" />
              <span className="cf-form__time-sep">to</span>
              <input className="cf-form__input" type="time" value={form.to} onChange={e => set('to', e.target.value)} data-testid="school-field-cf-book-to" />
            </div>
          </div>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Purpose</label>
          <input className="cf-form__input" value={form.purpose} onChange={e => set('purpose', e.target.value)} placeholder="Reason for booking" data-testid="school-field-cf-book-purpose" />
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Additional Notes</label>
          <textarea className="cf-form__textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Any special requirements…" data-testid="school-field-cf-book-notes" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-book-cancel">Cancel</button>
          <button className="cf-btn cf-btn--primary" data-testid="school-button-cf-book-submit">Submit Request</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Raise Complaint Modal ────────────────────────────────────────────────────

function RaiseComplaintModal({ onClose, data }) {
  const [form, setForm] = useState({ facility: data?.name || '', issue: '', severity: 'Medium', description: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <Modal title="Raise Complaint" onClose={onClose}>
      <div className="cf-form">
        <div className="cf-form__row">
          <label className="cf-form__label">Facility</label>
          <input className="cf-form__input" value={form.facility} onChange={e => set('facility', e.target.value)} data-testid="school-field-cf-complaint-facility" />
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Issue</label>
          <input className="cf-form__input" value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="e.g. AC not working, Internet issue" data-testid="school-field-cf-complaint-issue" />
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Severity</label>
          <select className="cf-form__select" value={form.severity} onChange={e => set('severity', e.target.value)} data-testid="school-dropdown-cf-complaint-severity">
            {['Low', 'Medium', 'High', 'Urgent'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Description</label>
          <textarea className="cf-form__textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the issue in detail…" data-testid="school-field-cf-complaint-desc" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-complaint-cancel">Cancel</button>
          <button className="cf-btn cf-btn--danger" data-testid="school-button-cf-complaint-submit">Raise Complaint</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Maintenance Request Modal ────────────────────────────────────────────────

function MaintenanceRequestModal({ onClose, data }) {
  const [form, setForm] = useState({ facility: data?.name || '', issue: '', severity: 'Medium', scheduledDate: '', notes: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <Modal title="Schedule Maintenance" onClose={onClose}>
      <div className="cf-form">
        <div className="cf-form__row">
          <label className="cf-form__label">Facility</label>
          <input className="cf-form__input" value={form.facility} onChange={e => set('facility', e.target.value)} data-testid="school-field-cf-maint-facility" />
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Issue Description</label>
          <input className="cf-form__input" value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="Describe the maintenance needed" data-testid="school-field-cf-maint-issue" />
        </div>
        <div className="cf-form__row cf-form__row--2col">
          <div>
            <label className="cf-form__label">Severity</label>
            <select className="cf-form__select" value={form.severity} onChange={e => set('severity', e.target.value)} data-testid="school-dropdown-cf-maint-severity">
              {['Low', 'Medium', 'High', 'Urgent'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="cf-form__label">Scheduled Date</label>
            <input className="cf-form__input" type="date" value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)} data-testid="school-field-cf-maint-date" />
          </div>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Notes</label>
          <textarea className="cf-form__textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} data-testid="school-field-cf-maint-notes" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-maint-cancel">Cancel</button>
          <button className="cf-btn cf-btn--primary" data-testid="school-button-cf-maint-submit">Schedule Maintenance</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Facility Modal ───────────────────────────────────────────────────────

function AddFacilityModal({ onClose }) {
  const [form, setForm] = useState({ name: '', category: 'Academic', block: '', floor: '', capacity: '', status: 'Operational', description: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <Modal title="Add New Facility" onClose={onClose} wide>
      <div className="cf-form">
        <div className="cf-form__row cf-form__row--2col">
          <div>
            <label className="cf-form__label">Facility Name</label>
            <input className="cf-form__input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Smart Classroom C-301" data-testid="school-field-cf-add-name" />
          </div>
          <div>
            <label className="cf-form__label">Category</label>
            <select className="cf-form__select" value={form.category} onChange={e => set('category', e.target.value)} data-testid="school-dropdown-cf-add-category">
              {['Academic', 'Sports', 'Events', 'Dining', 'Hostel', 'Health', 'Transport', 'IT & Digital', 'Recreational', 'Staff'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="cf-form__row cf-form__row--3col">
          <div>
            <label className="cf-form__label">Block / Location</label>
            <input className="cf-form__input" value={form.block} onChange={e => set('block', e.target.value)} placeholder="Block C" data-testid="school-field-cf-add-block" />
          </div>
          <div>
            <label className="cf-form__label">Floor</label>
            <input className="cf-form__input" value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="3rd" data-testid="school-field-cf-add-floor" />
          </div>
          <div>
            <label className="cf-form__label">Capacity</label>
            <input className="cf-form__input" type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} data-testid="school-field-cf-add-capacity" />
          </div>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Initial Status</label>
          <select className="cf-form__select" value={form.status} onChange={e => set('status', e.target.value)} data-testid="school-dropdown-cf-add-status">
            {['Operational', 'Available', 'Maintenance', 'Restricted', 'Unavailable'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Description</label>
          <textarea className="cf-form__textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={2} data-testid="school-field-cf-add-desc" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-add-cancel">Cancel</button>
          <button className="cf-btn cf-btn--primary" data-testid="school-button-cf-add-submit">Add Facility</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Approve Booking Modal ────────────────────────────────────────────────────

function ApproveBookingModal({ onClose, data }) {
  const [remarks, setRemarks] = useState('');
  return (
    <Modal title="Approve / Reject Booking" onClose={onClose}>
      <div className="cf-approve-modal">
        <div className="cf-approve-modal__info">
          {[
            ['Booking ID', data?.id],
            ['Facility',   data?.facility],
            ['Requester',  data?.requester],
            ['Date',       data?.date],
            ['Timing',     data?.timing],
            ['Purpose',    data?.purpose],
          ].map(([label, value]) => (
            <div key={label} className="cf-approve-modal__row">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="cf-form__row" style={{ marginTop: '1rem' }}>
          <label className="cf-form__label">Remarks (optional)</label>
          <textarea className="cf-form__textarea" value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} placeholder="Add approval or rejection reason…" data-testid="school-field-cf-approve-remarks" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-approve-cancel">Cancel</button>
          <button className="cf-btn cf-btn--danger" data-testid="school-button-cf-approve-reject">Reject</button>
          <button className="cf-btn cf-btn--success" data-testid="school-button-cf-approve-approve">Approve</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Reschedule Booking Modal ─────────────────────────────────────────────────

function RescheduleBookingModal({ onClose, data }) {
  const [form, setForm] = useState({ date: '', from: '', to: '', reason: '' });
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  return (
    <Modal title="Reschedule Booking" onClose={onClose}>
      <div className="cf-form">
        <div className="cf-approve-modal__info" style={{ marginBottom: '1rem' }}>
          <div className="cf-approve-modal__row"><span>Booking ID</span><strong>{data?.id}</strong></div>
          <div className="cf-approve-modal__row"><span>Facility</span><strong>{data?.facility}</strong></div>
          <div className="cf-approve-modal__row"><span>Current Date</span><strong>{data?.date}</strong></div>
        </div>
        <div className="cf-form__row cf-form__row--2col">
          <div>
            <label className="cf-form__label">New Date</label>
            <input className="cf-form__input" type="date" value={form.date} onChange={e => set('date', e.target.value)} data-testid="school-field-cf-reschedule-date" />
          </div>
          <div>
            <label className="cf-form__label">New Time Slot</label>
            <div className="cf-form__time-row">
              <input className="cf-form__input" type="time" value={form.from} onChange={e => set('from', e.target.value)} data-testid="school-field-cf-reschedule-from" />
              <span className="cf-form__time-sep">to</span>
              <input className="cf-form__input" type="time" value={form.to} onChange={e => set('to', e.target.value)} data-testid="school-field-cf-reschedule-to" />
            </div>
          </div>
        </div>
        <div className="cf-form__row">
          <label className="cf-form__label">Reason for Reschedule</label>
          <textarea className="cf-form__textarea" value={form.reason} onChange={e => set('reason', e.target.value)} rows={2} data-testid="school-field-cf-reschedule-reason" />
        </div>
        <div className="cf-form__actions">
          <button className="cf-btn cf-btn--ghost" onClick={onClose} data-testid="school-button-cf-reschedule-cancel">Cancel</button>
          <button className="cf-btn cf-btn--primary" data-testid="school-button-cf-reschedule-submit">Reschedule</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ openModal }) {
  return (
    <div className="cf-overview">
      <div className="cf-metrics-grid">
        {FACILITY_METRICS.map(m => (
          <div key={m.key} className={`cf-metric-card cf-metric-card--${m.tone}`} data-testid={`school-card-cf-metric-${m.key}`}>
            <div className="cf-metric-card__icon">{m.icon}</div>
            <div className="cf-metric-card__body">
              <div className="cf-metric-card__value">{m.value}</div>
              <div className="cf-metric-card__label">{m.label}</div>
              <div className="cf-metric-card__sub">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="cf-section-title">Facility Categories</h2>
      <div className="cf-category-grid">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="cf-category-card" data-testid={`school-card-cf-category-${cat.key}`}>
            <div className="cf-category-card__icon" style={{ background: `${cat.color}18`, color: cat.color }}>
              {cat.icon}
            </div>
            <div className="cf-category-card__body">
              <div className="cf-category-card__name">{cat.label}</div>
              <div className="cf-category-card__stats">
                <span>{cat.total} Total</span>
                <span>{cat.available} Available</span>
              </div>
              <ProgressBar pct={cat.utilization} tone="blue" />
              <div className="cf-category-card__util">{cat.utilization}% Utilized</div>
            </div>
            <button className="cf-btn cf-btn--sm cf-btn--outline" data-testid={`school-button-cf-category-${cat.key}`}>View All</button>
          </div>
        ))}
      </div>

      <h2 className="cf-section-title">Quick Actions</h2>
      <div className="cf-quick-actions">
        {[
          { label: 'Book Facility',         icon: '📅', key: 'book-facility',        tone: 'primary'  },
          { label: 'Add Facility',          icon: '➕', key: 'add-facility',         tone: 'outline'  },
          { label: 'Raise Complaint',       icon: '⚠️', key: 'raise-complaint',      tone: 'danger'   },
          { label: 'Schedule Maintenance',  icon: '🔧', key: 'maintenance-request',  tone: 'outline'  },
          { label: 'Check Availability',    icon: '🔍', key: null,                   tone: 'ghost'    },
          { label: 'Download Report',       icon: '⬇️', key: null,                   tone: 'ghost'    },
        ].map(a => (
          <button
            key={a.label}
            className={`cf-btn cf-btn--${a.tone} cf-quick-btn`}
            onClick={() => a.key && openModal(a.key, null)}
            data-testid={`school-button-cf-quick-${a.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>

      <h2 className="cf-section-title">Upcoming Bookings &amp; Events</h2>
      <div className="cf-event-list">
        {CALENDAR_EVENTS.map((ev, i) => (
          <div key={i} className={`cf-event-item cf-event-item--${ev.type}`} data-testid={`school-card-cf-event-${i}`}>
            <div className="cf-event-item__date">{ev.date}</div>
            <div className="cf-event-item__body">
              <div className="cf-event-item__title">{ev.title}</div>
              <div className="cf-event-item__time">{ev.time}</div>
            </div>
            <span className={`cf-badge cf-badge--${ev.type}`}>{ev.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Academic Tab ─────────────────────────────────────────────────────────────

function AcademicTab({ openModal }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', ...new Set(ACADEMIC_FACILITIES.map(f => f.type))];
  const filtered = useMemo(() =>
    ACADEMIC_FACILITIES.filter(f =>
      (typeFilter === 'All' || f.type === typeFilter) &&
      f.name.toLowerCase().includes(search.toLowerCase())
    ), [search, typeFilter]);

  return (
    <div className="cf-tab-content">
      <div className="cf-filters-bar">
        <input className="cf-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search academic facilities…" data-testid="school-field-cf-academic-search" />
        <select className="cf-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} data-testid="school-dropdown-cf-academic-type">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="cf-facility-grid">
        {filtered.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-academic-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>🏫 {f.type}</span>
              <span>👥 Cap: {f.capacity}</span>
              <span>📍 {f.block}, {f.floor} Floor</span>
              <span>🎓 {f.department}</span>
            </div>
            {f.occupancy > 0 && <ProgressBar pct={f.utilization} tone="blue" />}
            <div className="cf-facility-card__chips">
              <span className={`cf-chip cf-chip--${f.smartEquipment ? 'green' : 'muted'}`}>
                {f.smartEquipment ? '✅ Smart Equipment' : '❌ No Smart Equip'}
              </span>
              <span className={`cf-chip cf-chip--${f.available ? 'green' : 'red'}`}>
                {f.available ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', f)} data-testid={`school-button-cf-academic-book-${f.id}`}>Book</button>
              <button className="cf-btn cf-btn--sm cf-btn--outline" data-testid={`school-button-cf-academic-avail-${f.id}`}>Availability</button>
              <button className="cf-btn cf-btn--sm cf-btn--ghost" onClick={() => openModal('maintenance-request', f)} data-testid={`school-button-cf-academic-maint-${f.id}`}>Maintenance</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="cf-empty-state">No facilities match your search.</div>}
      </div>
    </div>
  );
}

// ─── Sports Tab ───────────────────────────────────────────────────────────────

function SportsTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-sports-grid">
        {SPORTS_FACILITIES.map(f => (
          <div key={f.id} className="cf-sports-card" data-testid={`school-card-cf-sports-${f.id}`}>
            <div className="cf-sports-card__icon">{f.icon}</div>
            <div className="cf-sports-card__name">{f.name}</div>
            <div className="cf-sports-card__meta">
              <span>👤 Coach: {f.coach}</span>
              <span>🕐 {f.timings}</span>
              <span>👥 Capacity: {f.capacity}</span>
              <span>📅 {f.nextEvent}</span>
            </div>
            <div className="cf-sports-card__status">
              <StatusBadge status={f.available ? 'Available' : 'Occupied'} />
              <span className={`cf-chip cf-chip--${f.maintenanceStatus === 'Good' ? 'green' : 'amber'}`}>
                {f.maintenanceStatus}
              </span>
            </div>
            {f.occupancy > 0 && (
              <ProgressBar pct={Math.round((f.occupancy / f.capacity) * 100)} tone="teal" />
            )}
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', f)} data-testid={`school-button-cf-sports-book-${f.id}`}>Book Slot</button>
              <button className="cf-btn cf-btn--sm cf-btn--ghost" onClick={() => openModal('raise-complaint', f)} data-testid={`school-button-cf-sports-complaint-${f.id}`}>Report Issue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-facility-grid">
        {EVENT_FACILITIES.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-events-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>👥 Capacity: {f.capacity}</span>
              <span>👤 Manager: {f.eventManager}</span>
              <span>📅 Next: {f.upcomingEvent}</span>
              <span>🗓️ {f.eventDate}</span>
              <span>📋 Active Bookings: {f.currentBookings}</span>
            </div>
            <div className="cf-facility-card__chips">
              <span className={`cf-chip cf-chip--${f.avEquipment ? 'green' : 'muted'}`}>
                {f.avEquipment ? '✅ AV Equipment' : '❌ No AV'}
              </span>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', f)} data-testid={`school-button-cf-events-book-${f.id}`}>Book Event Space</button>
              <button className="cf-btn cf-btn--sm cf-btn--outline" data-testid={`school-button-cf-events-calendar-${f.id}`}>View Calendar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dining Tab ───────────────────────────────────────────────────────────────

function DiningTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-dining-grid">
        {DINING_FACILITIES.map(f => (
          <div key={f.id} className="cf-dining-card" data-testid={`school-card-cf-dining-${f.id}`}>
            <div className="cf-dining-card__header">
              <div className="cf-dining-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-dining-card__meta">
              <span>📍 {f.block}</span>
              <span>🕐 {f.timings}</span>
            </div>
            <div className="cf-dining-card__hygiene">
              <span className={`cf-chip cf-chip--${f.hygieneStatus === 'Excellent' ? 'green' : 'amber'}`}>
                🧹 Hygiene: {f.hygieneStatus}
              </span>
            </div>
            <ProgressBar pct={Math.round((f.occupancy / f.capacity) * 100)} tone="amber" />
            <div className="cf-dining-card__occ">{f.occupancy} / {f.capacity} Seats Occupied</div>
            <div className="cf-dining-card__menu">
              <span className="cf-dining-card__menu-label">Today's Menu:</span>
              <div className="cf-dining-card__menu-chips">
                {f.menu.map(m => <span key={m} className="cf-chip cf-chip--muted">{m}</span>)}
              </div>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--ghost" onClick={() => openModal('raise-complaint', f)} data-testid={`school-button-cf-dining-complaint-${f.id}`}>Report Issue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hostel Tab ───────────────────────────────────────────────────────────────

function HostelTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-facility-grid">
        {HOSTEL_FACILITIES.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-hostel-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>🏠 {f.hostel}</span>
              <span>🕐 {f.timings}</span>
              <span>👥 Capacity: {f.capacity}</span>
            </div>
            {f.issues > 0 && (
              <div className="cf-facility-card__chips">
                <span className="cf-chip cf-chip--red">⚠️ {f.issues} Open Issue{f.issues > 1 ? 's' : ''}</span>
              </div>
            )}
            <ProgressBar pct={f.capacity > 0 ? Math.round((f.occupancy / f.capacity) * 100) : 0} tone="violet" />
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--ghost" onClick={() => openModal('raise-complaint', f)} data-testid={`school-button-cf-hostel-complaint-${f.id}`}>Report Issue</button>
              {f.status === 'Maintenance' && (
                <button className="cf-btn cf-btn--sm cf-btn--outline" onClick={() => openModal('maintenance-request', f)} data-testid={`school-button-cf-hostel-maint-${f.id}`}>View Maintenance</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

function HealthTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-health-alert" data-testid="school-card-cf-health-alert">
        <span>🚨</span>
        <span>
          Emergency Contacts — Campus Medical: <strong>+91-98765-43210</strong>
          &nbsp;|&nbsp; Ambulance: <strong>+91-98765-43211</strong>
          &nbsp;|&nbsp; Fire: <strong>101</strong>
        </span>
      </div>
      <div className="cf-facility-grid">
        {HEALTH_FACILITIES.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-health-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>🏥 {f.type}</span>
              <span>👨‍⚕️ {f.doctor}</span>
              <span>🕐 {f.timings}</span>
            </div>
            <div className="cf-facility-card__chips">
              {f.emergencyBeds > 0 && <span className="cf-chip cf-chip--red">🛏️ {f.emergencyBeds} Emergency Beds</span>}
              <span className={`cf-chip cf-chip--${f.ambulanceAvailable ? 'green' : 'muted'}`}>
                🚑 Ambulance {f.ambulanceAvailable ? 'Available' : 'N/A'}
              </span>
              <span className={`cf-chip cf-chip--${f.pharmacy ? 'green' : 'muted'}`}>
                💊 Pharmacy {f.pharmacy ? 'Available' : 'N/A'}
              </span>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', f)} data-testid={`school-button-cf-health-book-${f.id}`}>Book Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Transport Tab ────────────────────────────────────────────────────────────

function TransportTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-transport-grid">
        {TRANSPORT_ROUTES.map(r => (
          <div key={r.id} className="cf-transport-card" data-testid={`school-card-cf-transport-${r.id}`}>
            <div className="cf-transport-card__header">
              <div className="cf-transport-card__route">{r.route}</div>
              <StatusBadge status={r.status} />
            </div>
            <div className="cf-transport-card__meta">
              <span>🚌 {r.busNo}</span>
              <span>👤 {r.driver}</span>
              <span>⏰ Next: {r.nextDeparture}</span>
            </div>
            <ProgressBar pct={r.capacity > 0 ? Math.round((r.occupancy / r.capacity) * 100) : 0} tone="sky" />
            <div className="cf-transport-card__occ">{r.occupancy} / {r.capacity} Passengers</div>
            <div className="cf-transport-card__stops">
              <span className="cf-transport-card__stops-label">Pickup Points:</span>
              <div className="cf-transport-card__stop-chips">
                {r.pickupPoints.map((p, i) => <span key={i} className="cf-chip cf-chip--muted">{p}</span>)}
              </div>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', r)} data-testid={`school-button-cf-transport-book-${r.id}`}>Book Seat</button>
              <button className="cf-btn cf-btn--sm cf-btn--outline" data-testid={`school-button-cf-transport-track-${r.id}`}>🗺️ Live Track</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── IT & Digital Tab ─────────────────────────────────────────────────────────

function ITDigitalTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-facility-grid">
        {IT_FACILITIES.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-it-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>🔌 {f.type}</span>
              <span>📍 {f.coverage}</span>
              <span>👥 Active Users: {f.activeUsers}</span>
            </div>
            <div className="cf-it-uptime">
              <span className="cf-it-uptime__label">Uptime</span>
              <ProgressBar pct={f.uptime} tone={f.uptime >= 97 ? 'green' : f.uptime >= 90 ? 'amber' : 'red'} />
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--ghost" onClick={() => openModal('raise-complaint', f)} data-testid={`school-button-cf-it-complaint-${f.id}`}>Report Issue</button>
              <button className="cf-btn cf-btn--sm cf-btn--outline" onClick={() => openModal('maintenance-request', f)} data-testid={`school-button-cf-it-maint-${f.id}`}>Maintenance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recreational Tab ─────────────────────────────────────────────────────────

function RecreationalTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-rec-grid">
        {RECREATIONAL_FACILITIES.map(f => (
          <div key={f.id} className="cf-rec-card" data-testid={`school-card-cf-rec-${f.id}`}>
            <div className="cf-rec-card__icon">{f.icon}</div>
            <div className="cf-rec-card__body">
              <div className="cf-rec-card__name">{f.name}</div>
              <div className="cf-rec-card__meta">
                <span>🕐 {f.timings}</span>
                <span>📅 {f.upcomingEvent}</span>
              </div>
              <ProgressBar pct={f.capacity > 0 ? Math.round((f.occupancy / f.capacity) * 100) : 0} tone="teal" />
              <div className="cf-rec-card__occ">{f.occupancy} / {f.capacity} Present</div>
            </div>
            <div className="cf-facility-card__actions">
              <button className="cf-btn cf-btn--sm cf-btn--primary" onClick={() => openModal('book-facility', f)} data-testid={`school-button-cf-rec-book-${f.id}`}>Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Staff Tab ────────────────────────────────────────────────────────────────

function StaffTab({ openModal }) {
  return (
    <div className="cf-tab-content">
      <div className="cf-facility-grid">
        {STAFF_FACILITIES.map(f => (
          <div key={f.id} className="cf-facility-card" data-testid={`school-card-cf-staff-${f.id}`}>
            <div className="cf-facility-card__header">
              <div className="cf-facility-card__name">{f.name}</div>
              <StatusBadge status={f.status} />
            </div>
            <div className="cf-facility-card__meta">
              <span>📍 {f.block}</span>
              <span>👥 Capacity: {f.capacity}</span>
              <span>🔐 {f.accessPermission}</span>
            </div>
            <ProgressBar pct={f.capacity > 0 ? Math.round((f.occupancy / f.capacity) * 100) : 0} tone="indigo" />
            <div className="cf-facility-card__chips">
              <span className={`cf-chip cf-chip--${f.available ? 'green' : 'red'}`}>
                {f.available ? '✅ Available to Book' : '❌ Not Available'}
              </span>
            </div>
            <div className="cf-facility-card__actions">
              <button
                className="cf-btn cf-btn--sm cf-btn--primary"
                disabled={!f.available}
                onClick={() => f.available && openModal('book-facility', f)}
                data-testid={`school-button-cf-staff-book-${f.id}`}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────

function BookingsTab({ openModal }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];
  const filtered = useMemo(() =>
    BOOKINGS.filter(b => statusFilter === 'All' || b.status === statusFilter),
    [statusFilter]);

  return (
    <div className="cf-tab-content">
      <div className="cf-filters-bar">
        <div className="cf-status-chips">
          {statuses.map(s => (
            <button
              key={s}
              className={`cf-chip-btn ${statusFilter === s ? 'cf-chip-btn--active' : ''}`}
              onClick={() => setStatusFilter(s)}
              data-testid={`school-button-cf-bookings-filter-${s.toLowerCase()}`}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="cf-btn cf-btn--primary" onClick={() => openModal('book-facility', null)} data-testid="school-button-cf-bookings-new">
          + New Booking
        </button>
      </div>
      <div className="cf-table-wrap">
        <table className="cf-table" data-testid="school-table-cf-bookings">
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility</th>
              <th>Requester</th>
              <th>Date</th>
              <th>Timing</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} data-testid={`school-row-cf-booking-${b.id}`}>
                <td className="cf-table__id">{b.id}</td>
                <td>{b.facility}</td>
                <td>{b.requester}</td>
                <td>{b.date}</td>
                <td className="cf-table__timing">{b.timing}</td>
                <td className="cf-table__purpose">{b.purpose}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <div className="cf-table__actions">
                    {b.status === 'Pending' && (
                      <button className="cf-btn cf-btn--xs cf-btn--success" onClick={() => openModal('approve-booking', b)} data-testid={`school-button-cf-booking-approve-${b.id}`}>Approve</button>
                    )}
                    <button className="cf-btn cf-btn--xs cf-btn--ghost" onClick={() => openModal('reschedule-booking', b)} data-testid={`school-button-cf-booking-reschedule-${b.id}`}>Reschedule</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="cf-empty-state">No bookings found for this status.</div>
        )}
      </div>
    </div>
  );
}

// ─── Maintenance Tab ──────────────────────────────────────────────────────────

function MaintenanceTab({ openModal }) {
  const [view, setView] = useState('maintenance');
  const data = view === 'maintenance' ? MAINTENANCE_REQUESTS : COMPLAINTS;

  return (
    <div className="cf-tab-content">
      <div className="cf-filters-bar">
        <div className="cf-status-chips">
          <button className={`cf-chip-btn ${view === 'maintenance' ? 'cf-chip-btn--active' : ''}`} onClick={() => setView('maintenance')} data-testid="school-button-cf-maint-view-maintenance">Maintenance Requests</button>
          <button className={`cf-chip-btn ${view === 'complaints' ? 'cf-chip-btn--active' : ''}`} onClick={() => setView('complaints')} data-testid="school-button-cf-maint-view-complaints">Complaints &amp; Feedback</button>
        </div>
        <div className="cf-filters-bar__right">
          <button className="cf-btn cf-btn--outline" onClick={() => openModal('maintenance-request', null)} data-testid="school-button-cf-maint-new">Schedule Maintenance</button>
          <button className="cf-btn cf-btn--danger" onClick={() => openModal('raise-complaint', null)} data-testid="school-button-cf-complaint-new">Raise Complaint</button>
        </div>
      </div>
      <div className="cf-table-wrap">
        <table className="cf-table" data-testid={`school-table-cf-${view}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Facility</th>
              <th>Issue</th>
              <th>Severity</th>
              <th>Raised By</th>
              <th>Assigned To</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(m => (
              <tr key={m.id} data-testid={`school-row-cf-${view}-${m.id}`}>
                <td className="cf-table__id">{m.id}</td>
                <td>{m.facility}</td>
                <td>{m.issue}</td>
                <td><SeverityBadge severity={m.severity} /></td>
                <td>{m.raisedBy}</td>
                <td>{m.assignedTo}</td>
                <td>{m.eta}</td>
                <td><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  const maxBooking = Math.max(...FACILITY_ANALYTICS.bookingTrend.map(d => d.count));
  const maxMaint   = Math.max(...FACILITY_ANALYTICS.maintenanceFrequency.map(d => d.count));
  const maxBooked  = Math.max(...FACILITY_ANALYTICS.topBooked.map(d => d.bookings));
  const maxPeak    = Math.max(...FACILITY_ANALYTICS.peakHours.map(d => d.load));

  return (
    <div className="cf-analytics">
      <div className="cf-analytics-stats">
        {[
          { label: 'Total Bookings (Month)', value: '174',   icon: '📅', tone: 'blue'  },
          { label: 'Avg. Utilization',       value: '71.6%', icon: '📊', tone: 'teal'  },
          { label: 'Open Maintenance',       value: '5',     icon: '🔧', tone: 'amber' },
          { label: 'Open Complaints',        value: '3',     icon: '⚠️', tone: 'rose'  },
        ].map(s => (
          <div key={s.label} className={`cf-analytics-stat cf-analytics-stat--${s.tone}`} data-testid={`school-card-cf-analytics-${s.tone}`}>
            <div className="cf-analytics-stat__icon">{s.icon}</div>
            <div className="cf-analytics-stat__value">{s.value}</div>
            <div className="cf-analytics-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="cf-analytics-grid">
        <div className="cf-chart-card" data-testid="school-card-cf-chart-utilization">
          <div className="cf-chart-card__title">Utilization by Category</div>
          <div className="cf-hbar-chart">
            {FACILITY_ANALYTICS.utilizationByCategory.map(d => (
              <div key={d.label} className="cf-hbar-chart__row">
                <span className="cf-hbar-chart__label">{d.label}</span>
                <div className="cf-hbar-chart__track">
                  <div className="cf-hbar-chart__fill cf-hbar-chart__fill--teal" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="cf-hbar-chart__val">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-chart-card" data-testid="school-card-cf-chart-top-booked">
          <div className="cf-chart-card__title">Top Booked Facilities</div>
          <div className="cf-hbar-chart">
            {FACILITY_ANALYTICS.topBooked.map(d => (
              <div key={d.name} className="cf-hbar-chart__row">
                <span className="cf-hbar-chart__label">{d.name}</span>
                <div className="cf-hbar-chart__track">
                  <div className="cf-hbar-chart__fill cf-hbar-chart__fill--gold" style={{ width: `${(d.bookings / maxBooked) * 100}%` }} />
                </div>
                <span className="cf-hbar-chart__val">{d.bookings}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-chart-card" data-testid="school-card-cf-chart-bookings">
          <div className="cf-chart-card__title">Monthly Booking Trend</div>
          <div className="cf-vbar-chart">
            {FACILITY_ANALYTICS.bookingTrend.map(d => (
              <div key={d.month} className="cf-vbar-chart__col">
                <span className="cf-vbar-chart__val">{d.count}</span>
                <div className="cf-vbar-chart__bar cf-vbar-chart__bar--blue" style={{ height: `${(d.count / maxBooking) * 100}%` }} />
                <span className="cf-vbar-chart__label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-chart-card" data-testid="school-card-cf-chart-maintenance">
          <div className="cf-chart-card__title">Maintenance Frequency by Type</div>
          <div className="cf-vbar-chart">
            {FACILITY_ANALYTICS.maintenanceFrequency.map(d => (
              <div key={d.label} className="cf-vbar-chart__col">
                <span className="cf-vbar-chart__val">{d.count}</span>
                <div className="cf-vbar-chart__bar cf-vbar-chart__bar--amber" style={{ height: `${(d.count / maxMaint) * 100}%` }} />
                <span className="cf-vbar-chart__label">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-chart-card cf-chart-card--wide" data-testid="school-card-cf-chart-peak">
          <div className="cf-chart-card__title">Peak Usage Hours</div>
          <div className="cf-vbar-chart cf-vbar-chart--wide">
            {FACILITY_ANALYTICS.peakHours.map(d => (
              <div key={d.hour} className="cf-vbar-chart__col">
                <span className="cf-vbar-chart__val">{d.load}%</span>
                <div className="cf-vbar-chart__bar cf-vbar-chart__bar--indigo" style={{ height: `${(d.load / maxPeak) * 100}%` }} />
                <span className="cf-vbar-chart__label">{d.hour}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Registry ───────────────────────────────────────────────────────────

const MODAL_REGISTRY = {
  'book-facility':        (d, close) => <BookFacilityModal       onClose={close} data={d} />,
  'raise-complaint':      (d, close) => <RaiseComplaintModal     onClose={close} data={d} />,
  'maintenance-request':  (d, close) => <MaintenanceRequestModal onClose={close} data={d} />,
  'add-facility':         (_, close) => <AddFacilityModal        onClose={close} />,
  'approve-booking':      (d, close) => <ApproveBookingModal     onClose={close} data={d} />,
  'reschedule-booking':   (d, close) => <RescheduleBookingModal  onClose={close} data={d} />,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Facilities() {
  const [activeTab,   setActiveTab]   = useState('overview');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData,   setModalData]   = useState(null);
  const tabBarRef = useRef();

  const openModal = useCallback((key, data) => {
    setActiveModal(key);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const active = bar.querySelector('.cf-tab--active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'overview':     return <OverviewTab     openModal={openModal} />;
      case 'academic':     return <AcademicTab     openModal={openModal} />;
      case 'sports':       return <SportsTab       openModal={openModal} />;
      case 'events':       return <EventsTab       openModal={openModal} />;
      case 'dining':       return <DiningTab       openModal={openModal} />;
      case 'hostel':       return <HostelTab       openModal={openModal} />;
      case 'health':       return <HealthTab       openModal={openModal} />;
      case 'transport':    return <TransportTab    openModal={openModal} />;
      case 'it-digital':   return <ITDigitalTab    openModal={openModal} />;
      case 'recreational': return <RecreationalTab openModal={openModal} />;
      case 'staff':        return <StaffTab        openModal={openModal} />;
      case 'bookings':     return <BookingsTab     openModal={openModal} />;
      case 'maintenance':  return <MaintenanceTab  openModal={openModal} />;
      case 'analytics':    return <AnalyticsTab />;
      default:             return null;
    }
  }, [activeTab, openModal]);

  return (
    <div className="cf-root">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Campus" },
          { label: "Facilities" },
        ]}
        title="Campus Facilities"
        subtitle="Smart campus facility management &amp; operations platform"
        actions={(
          <>
            <button className="cf-btn cf-btn--outline" onClick={() => openModal('add-facility', null)} data-testid="school-button-cf-header-add">+ Add Facility</button>
            <button className="cf-btn cf-btn--primary" onClick={() => openModal('book-facility', null)} data-testid="school-button-cf-header-book">📅 Book Facility</button>
          </>
        )}
      />

      <div className="cf-tabs-wrap">
        <div className="cf-tabs" ref={tabBarRef} role="tablist" data-testid="school-tabs-cf">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              className={`cf-tab ${activeTab === t.key ? 'cf-tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
              data-testid={`school-tab-cf-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cf-tab-panel" role="tabpanel">
        {tabContent}
      </div>

      {activeModal && MODAL_REGISTRY[activeModal]?.(modalData, closeModal)}
    </div>
  );
}
