import React, { useState, useMemo, useCallback } from 'react';
import '../../Assets/styles/AssignBus.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  MOCK_BUSES,
  ROUTE_OPTIONS,
  BUS_STATUS_OPTIONS,
  AC_OPTIONS,
  OCCUPANCY_OPTIONS,
  DETAIL_TABS,
  SERVICE_ICON_MAP,
  ALERT_TYPE_MAP,
} from './assignBusMockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return '–';
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const getStatusConfig = (status) => {
  const map = {
    active: { label: 'Active', cls: 'ab-badge--active' },
    idle: { label: 'Idle', cls: 'ab-badge--idle' },
    breakdown: { label: 'Breakdown', cls: 'ab-badge--breakdown' },
    service: { label: 'In Service', cls: 'ab-badge--service' },
  };
  return map[status] || { label: status, cls: '' };
};

const getAlertSeverityClass = (sev) => {
  const map = { critical: 'ab-alert-row--critical', high: 'ab-alert-row--high', medium: 'ab-alert-row--medium', low: 'ab-alert-row--low' };
  return map[sev] || '';
};

const getExpiryClass = (isoDate) => {
  if (!isoDate) return '';
  const exp = new Date(isoDate);
  const today = new Date('2026-05-01');
  const daysLeft = Math.floor((exp - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'ab-info-item--expiry-expired';
  if (daysLeft <= 30) return 'ab-info-item--expiry-critical';
  if (daysLeft <= 90) return 'ab-info-item--expiry-warning';
  return 'ab-info-item--expiry-ok';
};

const calcOccupancy = (bus) => {
  const students = bus.students.length;
  const teachers = bus.teachers.length;
  const cleaner = bus.cleaner ? 1 : 0;
  const incharge = bus.transportInCharge ? 1 : 0;
  const backup = bus.backupDriver ? 1 : 0;
  const occupied = students + teachers + cleaner + incharge;
  const available = bus.capacity - occupied;
  return { total: bus.capacity, students, teachers, cleaner, incharge, backup, occupied, available, pct: Math.round((occupied / bus.capacity) * 100) };
};

const getRoute = (routeId) => {
  const r = ROUTE_OPTIONS.find((x) => x.id === routeId);
  return r ? r.label : '–';
};

const getOccClass = (pct) => {
  if (pct >= 85) return 'ab-occ-bar--full';
  if (pct >= 60) return 'ab-occ-bar--high';
  return 'ab-occ-bar--ok';
};

// ─── UI Primitives ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = getStatusConfig(status);
  return <span className={`ab-badge ${cfg.cls}`}>{cfg.label}</span>;
}

function AcBadge({ acType }) {
  const cls = acType === 'ac' ? 'ab-ac-badge--ac' : 'ab-ac-badge--nonac';
  const lbl = acType === 'ac' ? 'AC' : 'Non-AC';
  return <span className={`ab-ac-badge ${cls}`}>{lbl}</span>;
}

function GpsBadge({ gpsStatus }) {
  const cls = gpsStatus === 'online' ? 'ab-gps-badge--online' : 'ab-gps-badge--offline';
  const lbl = gpsStatus === 'online' ? '🟢 Online' : '🔴 Offline';
  return <span className={`ab-gps-badge ${cls}`}>{lbl}</span>;
}

function OccBar({ pct }) {
  return (
    <div className="ab-occ-bar">
      <div className={`ab-occ-bar__fill ${getOccClass(pct)}`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`ab-toast ab-toast--${toast.type}`}>✓ {toast.message}</div>;
}

// ─── Modals ──────────────────────────────────────────────────────────────────
function AddStudentModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ name: '', class: '', boardingStop: '', phone: '', feeStatus: 'paid' });
  const [errors, setErrors] = useState({});
  if (!isOpen) return null;
  const handleSave = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.class.trim()) errs.class = 'Required';
    if (!form.boardingStop.trim()) errs.boardingStop = 'Required';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave();
  };
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Add Student</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-form-grid">
            <div className="ab-field">
              <label className="ab-field__label">Student Name *</label>
              <input className="ab-field__input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="school-field-modal-name" />
              {errors.name && <span className="ab-field__error">{errors.name}</span>}
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Class *</label>
              <input className="ab-field__input" placeholder="e.g., 10-A" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} data-testid="school-field-modal-class" />
              {errors.class && <span className="ab-field__error">{errors.class}</span>}
            </div>
            <div className="ab-field ab-form-grid__full">
              <label className="ab-field__label">Boarding Stop *</label>
              <select className="ab-field__select" value={form.boardingStop} onChange={(e) => setForm({ ...form, boardingStop: e.target.value })} data-testid="school-field-modal-stop">
                <option value="">Select stop...</option>
                {bus?.stops.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              {errors.boardingStop && <span className="ab-field__error">{errors.boardingStop}</span>}
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Parent Phone</label>
              <input className="ab-field__input" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="school-field-modal-phone" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Fee Status</label>
              <select className="ab-field__select" value={form.feeStatus} onChange={(e) => setForm({ ...form, feeStatus: e.target.value })} data-testid="school-field-modal-fee">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={handleSave} data-testid="school-button-modal-save">Add Student</button>
        </div>
      </div>
    </div>
  );
}

function RemoveStudentModal({ isOpen, onClose, bus, onSave }) {
  const [studentId, setStudentId] = useState('');
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Remove Student</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">Select Student</label>
            <select className="ab-field__select" value={studentId} onChange={(e) => setStudentId(e.target.value)} data-testid="school-field-modal-student">
              <option value="">Choose...</option>
              {bus?.students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
            </select>
          </div>
          <p style={{ fontSize: '.875rem', color: 'var(--ab-muted)', marginTop: '.5rem' }}>This will remove the student from this bus route.</p>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--danger ab-btn--sm" onClick={onSave} disabled={!studentId} data-testid="school-button-modal-save">Remove</button>
        </div>
      </div>
    </div>
  );
}

function EditDriverModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState(bus?.driver || {});
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Edit Driver</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-form-grid">
            <div className="ab-field">
              <label className="ab-field__label">Name</label>
              <input className="ab-field__input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="school-field-modal-name" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Age</label>
              <input className="ab-field__input" type="number" value={form.age || ''} onChange={(e) => setForm({ ...form, age: e.target.value })} data-testid="school-field-modal-age" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Experience (years)</label>
              <input className="ab-field__input" type="number" value={form.experience || ''} onChange={(e) => setForm({ ...form, experience: e.target.value })} data-testid="school-field-modal-exp" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">License Number</label>
              <input className="ab-field__input" value={form.license || ''} onChange={(e) => setForm({ ...form, license: e.target.value })} data-testid="school-field-modal-license" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">License Expiry</label>
              <input className="ab-field__input" type="date" value={form.licenseExpiry || ''} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} data-testid="school-field-modal-expiry" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Phone</label>
              <input className="ab-field__input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="school-field-modal-phone" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Alternate Phone</label>
              <input className="ab-field__input" value={form.altPhone || ''} onChange={(e) => setForm({ ...form, altPhone: e.target.value })} data-testid="school-field-modal-altphone" />
            </div>
            <div className="ab-field">
              <label className="ab-field__label">Joining Date</label>
              <input className="ab-field__input" type="date" value={form.joiningDate || ''} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} data-testid="school-field-modal-joining" />
            </div>
            <div className="ab-field ab-form-grid__full">
              <label className="ab-field__label">Emergency Contact</label>
              <input className="ab-field__input" value={form.emergencyContact || ''} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} data-testid="school-field-modal-emergency" />
            </div>
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Save</button>
        </div>
      </div>
    </div>
  );
}

function SwapDriverModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ newDriver: '', reason: '' });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Swap Driver</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">New Driver</label>
            <input className="ab-field__input" placeholder="Enter driver name" value={form.newDriver} onChange={(e) => setForm({ ...form, newDriver: e.target.value })} data-testid="school-field-modal-driver" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Reason</label>
            <textarea className="ab-field__textarea" placeholder="Why is the driver being swapped?" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} data-testid="school-field-modal-reason" />
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Swap</button>
        </div>
      </div>
    </div>
  );
}

function AddCleanerModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Add Cleaner</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">Cleaner Name</label>
            <input className="ab-field__input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="school-field-modal-name" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Phone</label>
            <input className="ab-field__input" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="school-field-modal-phone" />
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Add</button>
        </div>
      </div>
    </div>
  );
}

function AssignInChargeModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ name: '', phone: '' });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Assign Transport In-Charge</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">In-Charge Name</label>
            <input className="ab-field__input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="school-field-modal-name" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Phone</label>
            <input className="ab-field__input" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="school-field-modal-phone" />
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Assign</button>
        </div>
      </div>
    </div>
  );
}

function EditRouteModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ routeName: '', shiftStart: '07:00', shiftEnd: '14:00' });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Edit Route</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">Route Name</label>
            <input className="ab-field__input" placeholder="e.g., Route 1 - North" value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} data-testid="school-field-modal-route" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Shift Start</label>
            <input className="ab-field__input" type="time" value={form.shiftStart} onChange={(e) => setForm({ ...form, shiftStart: e.target.value })} data-testid="school-field-modal-start" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Shift End</label>
            <input className="ab-field__input" type="time" value={form.shiftEnd} onChange={(e) => setForm({ ...form, shiftEnd: e.target.value })} data-testid="school-field-modal-end" />
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Save</button>
        </div>
      </div>
    </div>
  );
}

function AddStopModal({ isOpen, onClose, bus, onSave }) {
  const [form, setForm] = useState({ name: '', eta: '', distance: '', fee: '' });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Add Stop</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-field">
            <label className="ab-field__label">Stop Name</label>
            <input className="ab-field__input" placeholder="Location name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="school-field-modal-name" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">ETA</label>
            <input className="ab-field__input" type="time" value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} data-testid="school-field-modal-eta" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Distance (km)</label>
            <input className="ab-field__input" type="number" placeholder="0.0" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} data-testid="school-field-modal-distance" />
          </div>
          <div className="ab-field">
            <label className="ab-field__label">Fee (₹)</label>
            <input className="ab-field__input" type="number" placeholder="0" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} data-testid="school-field-modal-fee" />
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Add Stop</button>
        </div>
      </div>
    </div>
  );
}

function EnableAlertsModal({ isOpen, onClose, bus, onSave }) {
  const [alerts, setAlerts] = useState({
    deviation: true,
    overspeeding: true,
    delayed: true,
    stoppage: true,
    gps: true,
    maintenance: true,
  });
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Configure Alerts</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {Object.entries(ALERT_TYPE_MAP).map(([key, val]) => (
            <label
              key={key}
              style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.875rem', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={alerts[key]}
                onChange={(e) => setAlerts({ ...alerts, [key]: e.target.checked })}
                data-testid={`school-field-modal-alert-${key}`}
              />
              <span style={{ color: '#fff' }}>{val.icon} {val.label}</span>
            </label>
          ))}
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose}>Cancel</button>
          <button className="ab-btn ab-btn--primary ab-btn--sm" onClick={onSave} data-testid="school-button-modal-save">Configure</button>
        </div>
      </div>
    </div>
  );
}

function ViewServiceHistoryModal({ isOpen, onClose, bus }) {
  if (!isOpen) return null;
  return (
    <div className="ab-modal-backdrop" onClick={onClose}>
      <div className="ab-modal ab-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__header">
          <div className="ab-modal__title">Service History</div>
          <button className="ab-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="ab-modal__body">
          <div className="ab-service-list">
            {bus?.serviceHistory && bus.serviceHistory.length > 0 ? (
              bus.serviceHistory.map((s) => (
                <div key={s.id} className="ab-service-row">
                  <div className="ab-service-row__icon">{SERVICE_ICON_MAP[s.type] || '🔧'}</div>
                  <div className="ab-service-row__info">
                    <div className="ab-service-row__type">{s.type}</div>
                    <div className="ab-service-row__date">{fmtDate(s.date)} • {s.odometer} km</div>
                    <div className="ab-service-row__desc">{s.description}</div>
                    <div className="ab-service-row__mechanic">by {s.mechanic}</div>
                  </div>
                  <div className="ab-service-row__cost">₹{s.cost.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="ab-empty" style={{ padding: '2rem' }}>
                <div className="ab-empty__icon">📋</div>
                <div className="ab-empty__title">No Service History</div>
              </div>
            )}
          </div>
        </div>
        <div className="ab-modal__footer">
          <button className="ab-btn ab-btn--ghost ab-btn--sm" onClick={onClose} data-testid="school-button-modal-close">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── BusDetailView ────────────────────────────────────────────────────────────
function BusDetailView({ bus, onBack, onModal }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const occ = useMemo(() => calcOccupancy(bus), [bus]);
  if (!bus) return null;

  const renderTabContent = () => {
    if (activeTab === 'Overview') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__body">
            <h3 style={{ fontSize: '.9375rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--ab-text)' }}>Bus Information</h3>
            <div className="ab-info-grid">
              <div className="ab-info-item">
                <div className="ab-info-item__label">Registration Number</div>
                <div className="ab-info-item__value">{bus.regNumber}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">Model</div>
                <div className="ab-info-item__value">{bus.model}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">Manufacturing Year</div>
                <div className="ab-info-item__value">{bus.manufacturingYear}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">Chassis Number</div>
                <div className="ab-info-item__value">{bus.chassisNumber}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">Seating Capacity</div>
                <div className="ab-info-item__value">{bus.capacity}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">GPS Status</div>
                <div style={{ fontSize: '.875rem', fontWeight: '600', marginTop: '.3rem' }}>
                  <GpsBadge gpsStatus={bus.gpsStatus} />
                </div>
              </div>
              <div className={`ab-info-item ${getExpiryClass(bus.insuranceExpiry)}`}>
                <div className="ab-info-item__label">Insurance Expiry</div>
                <div className="ab-info-item__value">{fmtDate(bus.insuranceExpiry)}</div>
              </div>
              <div className={`ab-info-item ${getExpiryClass(bus.fitnessCertExpiry)}`}>
                <div className="ab-info-item__label">Fitness Certificate</div>
                <div className="ab-info-item__value">{fmtDate(bus.fitnessCertExpiry)}</div>
              </div>
              <div className="ab-info-item">
                <div className="ab-info-item__label">Insurance Provider</div>
                <div className="ab-info-item__value">{bus.insuranceProvider}</div>
              </div>
            </div>
            <h3 style={{ fontSize: '.9375rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--ab-text)' }}>Occupancy</h3>
            <div className="ab-occ-full">
              <div className="ab-occ-full__bar">
                <OccBar pct={occ.pct} />
                <div className="ab-occ-full__bar-pct">{occ.pct}%</div>
              </div>
              <div className="ab-occ-full__details">
                <div className="ab-occ-full__item">
                  <span className="ab-occ-full__item-icon">👥</span>
                  <span className="ab-occ-full__item-count">{occ.students}</span>
                  <span className="ab-occ-full__item-label">Students</span>
                </div>
                <div className="ab-occ-full__item">
                  <span className="ab-occ-full__item-icon">👨‍🏫</span>
                  <span className="ab-occ-full__item-count">{occ.teachers}</span>
                  <span className="ab-occ-full__item-label">Teachers</span>
                </div>
                <div className="ab-occ-full__item">
                  <span className="ab-occ-full__item-icon">🧹</span>
                  <span className="ab-occ-full__item-count">{occ.cleaner}</span>
                  <span className="ab-occ-full__item-label">Cleaner</span>
                </div>
                <div className="ab-occ-full__item">
                  <span className="ab-occ-full__item-icon">📋</span>
                  <span className="ab-occ-full__item-count">{occ.incharge}</span>
                  <span className="ab-occ-full__item-label">In-Charge</span>
                </div>
                <div className="ab-occ-full__item ab-occ-full__item--available">
                  <span className="ab-occ-full__item-icon">✓</span>
                  <span className="ab-occ-full__item-count">{occ.available}</span>
                  <span className="ab-occ-full__item-label">Available</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ab-actions">
            <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('editDriver')} data-testid="school-button-bus-edit-driver">✏️ Edit Driver</button>
            <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('swapDriver')} data-testid="school-button-bus-swap-driver">🔄 Swap Driver</button>
            <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('addCleaner')} data-testid="school-button-bus-add-cleaner">🧹 Add Cleaner</button>
            <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('assignInCharge')} data-testid="school-button-bus-assign-incharge">📋 Assign In-Charge</button>
          </div>
        </div>
      );
    }

    if (activeTab === 'Driver & Staff') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__body">
            <div className="ab-staff-grid">
              <div className="ab-staff-card ab-staff-card--driver">
                <div className="ab-staff-card__head">
                  <div className="ab-staff-card__role">Driver</div>
                </div>
                <div className="ab-staff-card__body">
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Name</div>
                    <div className="ab-staff-row__value">{bus.driver.name}</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Age</div>
                    <div className="ab-staff-row__value">{bus.driver.age} years</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Experience</div>
                    <div className="ab-staff-row__value">{bus.driver.experience} years</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">License</div>
                    <div className="ab-staff-row__value">{bus.driver.license}</div>
                  </div>
                  <div className={`ab-staff-row ${getExpiryClass(bus.driver.licenseExpiry)}`}>
                    <div className="ab-staff-row__label">License Expiry</div>
                    <div className="ab-staff-row__value">{fmtDate(bus.driver.licenseExpiry)}</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Phone</div>
                    <div className="ab-staff-row__value">{bus.driver.phone}</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Emergency</div>
                    <div className="ab-staff-row__value" style={{ fontSize: '.75rem' }}>{bus.driver.emergencyContact}</div>
                  </div>
                </div>
              </div>
              {bus.backupDriver && (
                <div className="ab-staff-card ab-staff-card--backup">
                  <div className="ab-staff-card__head">
                    <div className="ab-staff-card__role">Backup Driver</div>
                  </div>
                  <div className="ab-staff-card__body">
                    <div className="ab-staff-row">
                      <div className="ab-staff-row__label">Name</div>
                      <div className="ab-staff-row__value">{bus.backupDriver.name}</div>
                    </div>
                    <div className="ab-staff-row">
                      <div className="ab-staff-row__label">Phone</div>
                      <div className="ab-staff-row__value">{bus.backupDriver.phone}</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="ab-staff-card ab-staff-card--cleaner">
                <div className="ab-staff-card__head">
                  <div className="ab-staff-card__role">Cleaner</div>
                </div>
                <div className="ab-staff-card__body">
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Name</div>
                    <div className="ab-staff-row__value">{bus.cleaner.name}</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Phone</div>
                    <div className="ab-staff-row__value">{bus.cleaner.phone}</div>
                  </div>
                </div>
              </div>
              <div className="ab-staff-card ab-staff-card--incharge">
                <div className="ab-staff-card__head">
                  <div className="ab-staff-card__role">Transport In-Charge</div>
                </div>
                <div className="ab-staff-card__body">
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Name</div>
                    <div className="ab-staff-row__value">{bus.transportInCharge.name}</div>
                  </div>
                  <div className="ab-staff-row">
                    <div className="ab-staff-row__label">Phone</div>
                    <div className="ab-staff-row__value">{bus.transportInCharge.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Passengers') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__head">
            <div className="ab-panel__title">
              <span>Passengers</span>
              <span style={{ marginLeft: 'auto', fontSize: '.875rem', color: 'var(--ab-muted)' }}>{bus.students.length + bus.teachers.length} total</span>
            </div>
            <button className="ab-btn ab-btn--outline ab-btn--xs" onClick={() => onModal('addStudent')} data-testid="school-button-bus-add-student">+ Student</button>
          </div>
          <div className="ab-panel__body">
            <div className="ab-pax-table-wrap">
              <table className="ab-pax-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Boarding Stop</th>
                    <th>Phone</th>
                    <th>Fee Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bus.students.length > 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '.625rem 1rem', fontSize: '.75rem', fontWeight: '700', color: 'var(--ab-muted)', textTransform: 'uppercase', letterSpacing: '.06em', background: 'var(--ab-bg)', border: 'none' }}>Students ({bus.students.length})</td>
                    </tr>
                  )}
                  {bus.students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="ab-pax-table__name">{s.name}</span>
                        <span className="ab-pax-table__class">{s.class}</span>
                      </td>
                      <td>{s.class}</td>
                      <td>{s.boardingStop}</td>
                      <td>{s.phone}</td>
                      <td>
                        <span style={{ fontSize: '.75rem', fontWeight: '600', padding: '.2rem .5rem', borderRadius: '999px', background: s.feeStatus === 'paid' ? 'rgba(22,163,74,.1)' : 'rgba(217,119,6,.1)', color: s.feeStatus === 'paid' ? '#16a34a' : '#d97706' }}>
                          {s.feeStatus.charAt(0).toUpperCase() + s.feeStatus.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button className="ab-btn ab-btn--danger ab-btn--xs" onClick={() => onModal('removeStudent')} data-testid={`school-button-bus-remove-student-${s.id}`}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {bus.teachers.length > 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '.625rem 1rem', fontSize: '.75rem', fontWeight: '700', color: 'var(--ab-muted)', textTransform: 'uppercase', letterSpacing: '.06em', background: 'var(--ab-bg)', border: 'none' }}>Teachers ({bus.teachers.length})</td>
                    </tr>
                  )}
                  {bus.teachers.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span className="ab-pax-table__name">{t.name}</span>
                        <span className="ab-pax-table__class">{t.dept}</span>
                      </td>
                      <td>–</td>
                      <td>{t.boardingStop}</td>
                      <td>{t.phone}</td>
                      <td>–</td>
                      <td>–</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Route & Stops') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__head">
            <div>
              <div className="ab-panel__title" style={{ fontSize: '1rem' }}>{getRoute(bus.routeId)}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--ab-muted)', marginTop: '.25rem' }}>Shift: {bus.shift}</div>
            </div>
            <button className="ab-btn ab-btn--outline ab-btn--xs" onClick={() => onModal('editRoute')} data-testid="school-button-bus-edit-route">✏️ Edit</button>
          </div>
          <div className="ab-panel__body">
            <div className="ab-stop-timeline">
              {bus.stops.map((stop, idx) => (
                <div key={stop.id} className="ab-stop-item">
                  <div className={`ab-stop-item__dot ${idx === 0 ? 'ab-stop-item__dot--school' : ''}`}></div>
                  <div className="ab-stop-item__info">
                    <div className="ab-stop-item__name">{stop.name}</div>
                    <div className="ab-stop-item__meta">
                      <span className="ab-stop-item__meta-chip">⏰ {stop.eta}</span>
                      <span className="ab-stop-item__meta-chip">📍 {stop.distance}</span>
                      {stop.fee > 0 && <span className="ab-stop-fee">₹{stop.fee}</span>}
                      {stop.students > 0 && <span className="ab-stop-item__meta-chip">👥 {stop.students} students</span>}
                      {stop.teachers > 0 && <span className="ab-stop-item__meta-chip">👨‍🏫 {stop.teachers} teachers</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Service History') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__head">
            <div className="ab-panel__title">Recent Services</div>
            <button className="ab-btn ab-btn--outline ab-btn--xs" onClick={() => onModal('serviceHistory')} data-testid="school-button-bus-view-history">View All</button>
          </div>
          <div className="ab-panel__body">
            {bus.serviceHistory && bus.serviceHistory.length > 0 ? (
              <div className="ab-service-list">
                {bus.serviceHistory.slice(0, 3).map((s) => (
                  <div key={s.id} className="ab-service-row">
                    <div className="ab-service-row__icon">{SERVICE_ICON_MAP[s.type] || '🔧'}</div>
                    <div className="ab-service-row__info">
                      <div className="ab-service-row__type">{s.type}</div>
                      <div className="ab-service-row__date">{fmtDate(s.date)} • {s.odometer} km</div>
                      <div className="ab-service-row__desc">{s.description}</div>
                    </div>
                    <div className="ab-service-row__cost">₹{s.cost.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ab-empty">
                <div className="ab-empty__icon">📋</div>
                <div className="ab-empty__title">No Service History</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'Alerts') {
      return (
        <div className="ab-panel" style={{ marginTop: '1rem' }}>
          <div className="ab-panel__body">
            {bus.alerts && bus.alerts.length > 0 ? (
              <div className="ab-alert-list">
                {bus.alerts.map((a) => {
                  const alertInfo = ALERT_TYPE_MAP[a.type];
                  return (
                    <div key={a.id} className={`ab-alert-row ${getAlertSeverityClass(a.severity)}`}>
                      <div className="ab-alert-row__icon">{alertInfo?.icon || '⚠️'}</div>
                      <div className="ab-alert-row__body">
                        <div className="ab-alert-row__type">{alertInfo?.label || a.type}</div>
                        <div className="ab-alert-row__msg">{a.message}</div>
                        <div className="ab-alert-row__ts">{fmtDate(a.timestamp)} • {new Date(a.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="ab-alert-row__right">
                        <span className={`ab-alert-resolved ${a.resolved ? '' : 'ab-alert-resolved--open'}`}>{a.resolved ? '✓ Resolved' : 'Open'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="ab-empty">
                <div className="ab-empty__icon">✓</div>
                <div className="ab-empty__title">No Active Alerts</div>
                <div className="ab-empty__desc">Bus is operating normally</div>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="ab-root" data-testid="school-page-bus-detail">
      <div className="ab-breadcrumb">
        <button onClick={onBack} data-testid="school-button-back">All Buses</button>
        <span className="ab-breadcrumb__sep">›</span>
        <span className="ab-breadcrumb__active">{bus.number}</span>
      </div>

      <div className="ab-detail-header">
        <div className="ab-detail-header__meta">
          <div className="ab-detail-header__number">{bus.number}</div>
          <div className="ab-detail-header__sub">
            <span>{bus.model}</span> · <span>Year {bus.manufacturingYear}</span>
          </div>
          <div className="ab-detail-header__badges">
            <StatusBadge status={bus.status} />
            <AcBadge acType={bus.acType} />
            <GpsBadge gpsStatus={bus.gpsStatus} />
          </div>
        </div>
        <div className="ab-detail-header__actions">
          <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('addStudent')} data-testid="school-button-bus-detail-add-student">+ Add Student</button>
          <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('enableAlerts')} data-testid="school-button-bus-detail-alerts">🔔 Alerts</button>
          <button className="ab-btn ab-btn--outline ab-btn--sm" onClick={() => onModal('editRoute')} data-testid="school-button-bus-detail-edit-route">✏️ Edit Route</button>
        </div>
      </div>

      <div className="ab-tabs">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab}
            className={`ab-tab${activeTab === tab ? ' ab-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            data-testid={`school-tab-bus-${tab.toLowerCase().replace(/ /g, '-')}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}

// ─── AllBusesView ────────────────────────────────────────────────────────────
function AllBusesView({ buses, onSelectBus, onModal }) {
  const [search, setSearch] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAc, setFilterAc] = useState('');
  const [filterOcc, setFilterOcc] = useState('');

  const filtered = useMemo(() => {
    return buses.filter((b) => {
      if (search && !b.number.toLowerCase().includes(search.toLowerCase()) && !b.model.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterRoute && b.routeId !== filterRoute) return false;
      if (filterStatus && b.status !== filterStatus) return false;
      if (filterAc && b.acType !== filterAc) return false;
      if (filterOcc) {
        const pct = calcOccupancy(b).pct;
        if (filterOcc === 'low' && pct >= 50) return false;
        if (filterOcc === 'med' && (pct < 50 || pct > 80)) return false;
        if (filterOcc === 'high' && pct <= 80) return false;
      }
      return true;
    });
  }, [buses, search, filterRoute, filterStatus, filterAc, filterOcc]);

  const activeCount = buses.filter((b) => b.status === 'active').length;
  const breakdownCount = buses.filter((b) => b.status === 'breakdown').length;

  return (
    <div className="ab-root" data-testid="school-page-assign-bus">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Transport' },
          { label: 'Assign Bus' },
        ]}
        title="Bus Fleet Management"
        subtitle="Manage buses, assignments, drivers and routes"
        actions={(
          <>
            <span className="ab-chip ab-chip--success">✓ {activeCount} Active</span>
            <span className="ab-chip ab-chip--danger">⚠ {breakdownCount} Breakdown</span>
          </>
        )}
      />

      <div className="ab-toolbar">
        <div className="ab-search">
          <span className="ab-search__icon">🔍</span>
          <input className="ab-search__input" placeholder="Search bus number or model…" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="school-field-bus-search" />
        </div>
        <select className="ab-filter" value={filterRoute} onChange={(e) => setFilterRoute(e.target.value)} data-testid="school-dropdown-bus-route">
          <option value="">All Routes</option>
          {ROUTE_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <select className="ab-filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} data-testid="school-dropdown-bus-status">
          {BUS_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="ab-filter" value={filterAc} onChange={(e) => setFilterAc(e.target.value)} data-testid="school-dropdown-bus-ac">
          {AC_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <select className="ab-filter" value={filterOcc} onChange={(e) => setFilterOcc(e.target.value)} data-testid="school-dropdown-bus-occupancy">
          {OCCUPANCY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="ab-toolbar__count">{filtered.length} of {buses.length} buses</span>
      </div>

      {filtered.length === 0 ? (
        <div className="ab-empty">
          <div className="ab-empty__icon">🚌</div>
          <div className="ab-empty__title">No Buses Found</div>
          <div className="ab-empty__desc">Try adjusting your filters</div>
        </div>
      ) : (
        <div className="ab-grid">
          {filtered.map((bus) => {
            const occ = calcOccupancy(bus);
            return (
              <div key={bus.id} className={`ab-bus-card ab-bus-card--${bus.status}`} data-testid={`school-card-bus-${bus.id}`}>
                <div className="ab-bus-card__head">
                  <div>
                    <div className="ab-bus-card__number">{bus.number}</div>
                    <div className="ab-bus-card__model">{bus.model}</div>
                  </div>
                  <StatusBadge status={bus.status} />
                </div>
                <div className="ab-bus-card__body">
                  <div className="ab-bus-card__row">
                    <span className="ab-bus-card__row-label">Route</span>
                    <span className="ab-bus-card__row-value">{getRoute(bus.routeId)}</span>
                  </div>
                  <div className="ab-bus-card__row">
                    <span className="ab-bus-card__row-label">Type</span>
                    <AcBadge acType={bus.acType} />
                  </div>
                  <div className="ab-bus-card__row">
                    <span className="ab-bus-card__row-label">Shift</span>
                    <span className="ab-bus-card__row-value" style={{ fontSize: '.75rem' }}>{bus.shift}</span>
                  </div>
                  <div className="ab-bus-card__row">
                    <span className="ab-bus-card__row-label">GPS</span>
                    <GpsBadge gpsStatus={bus.gpsStatus} />
                  </div>
                </div>
                <div className="ab-bus-card__occ">
                  <div className="ab-bus-card__occ-title">Occupancy</div>
                  <div className="ab-bus-card__occ-nums">
                    <div className="ab-occ-num">
                      <span className="ab-occ-num__val">{occ.occupied}</span>
                      <span className="ab-occ-num__lbl">Occupied</span>
                    </div>
                    <div className={`ab-occ-num ${occ.available <= 4 ? 'ab-occ-num--warn' : 'ab-occ-num--avail'}`}>
                      <span className="ab-occ-num__val">{occ.available}</span>
                      <span className="ab-occ-num__lbl">Available</span>
                    </div>
                    <div className="ab-occ-num">
                      <span className="ab-occ-num__val">{occ.total}</span>
                      <span className="ab-occ-num__lbl">Total</span>
                    </div>
                  </div>
                  <OccBar pct={occ.pct} />
                </div>
                <div className="ab-bus-card__footer">
                  <div className="ab-bus-card__driver">
                    <span className="ab-bus-card__driver-icon">👤</span>
                    <span className="ab-bus-card__driver-name">{bus.driver.name}</span>
                  </div>
                  <button className="ab-bus-card__view" onClick={() => onSelectBus(bus)} data-testid={`school-button-bus-view-${bus.id}`}>Details →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AssignBus() {
  const [selectedBus, setSelectedBus] = useState(null);
  const [buses] = useState(MOCK_BUSES);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const openModal = useCallback((key) => setModal(key), []);
  const closeModal = useCallback(() => setModal(null), []);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = useCallback(
    (actionKey) => {
      closeModal();
      const labels = {
        addStudent: 'Student added',
        editDriver: 'Driver updated',
        swapDriver: 'Driver swapped',
        addCleaner: 'Cleaner assigned',
        assignInCharge: 'In-charge assigned',
        editRoute: 'Route updated',
        addStop: 'Stop added',
        removeStop: 'Stop removed',
        editStopTiming: 'Timing updated',
        enableAlerts: 'Alerts configured',
        removeStudent: 'Student removed',
      };
      showToast(labels[actionKey] || 'Changes saved');
    },
    [closeModal, showToast]
  );

  return (
    <>
      {selectedBus ? (
        <BusDetailView bus={selectedBus} onBack={() => setSelectedBus(null)} onModal={openModal} />
      ) : (
        <AllBusesView buses={buses} onSelectBus={setSelectedBus} onModal={openModal} />
      )}

      <AddStudentModal isOpen={modal === 'addStudent'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('addStudent')} />
      <RemoveStudentModal isOpen={modal === 'removeStudent'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('removeStudent')} />
      <EditDriverModal isOpen={modal === 'editDriver'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('editDriver')} />
      <SwapDriverModal isOpen={modal === 'swapDriver'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('swapDriver')} />
      <AddCleanerModal isOpen={modal === 'addCleaner'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('addCleaner')} />
      <AssignInChargeModal isOpen={modal === 'assignInCharge'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('assignInCharge')} />
      <EditRouteModal isOpen={modal === 'editRoute'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('editRoute')} />
      <AddStopModal isOpen={modal === 'addStop'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('addStop')} />
      <EnableAlertsModal isOpen={modal === 'enableAlerts'} onClose={closeModal} bus={selectedBus} onSave={() => handleSave('enableAlerts')} />
      <ViewServiceHistoryModal isOpen={modal === 'serviceHistory'} onClose={closeModal} bus={selectedBus} />

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </>
  );
}
