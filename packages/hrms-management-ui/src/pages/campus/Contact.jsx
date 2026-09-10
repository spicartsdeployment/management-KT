import React, { useState, useMemo, useRef, useCallback } from 'react';
import '../../Assets/styles/Contact.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  OVERVIEW_CONTACTS, CAMPUS_BRANCHES, DEPARTMENTS, STAFF_DIRECTORY,
  EMERGENCY_CONTACTS, TRANSPORT_CONTACTS, HOSTEL_CONTACTS, PARENT_SUPPORT,
  IT_SUPPORT_CONTACTS, SOCIAL_MEDIA, CAMPUS_TIMINGS, COMMUNICATION_LOGS,
  CONTACT_ANALYTICS,
} from './contactMockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',    label: '🏛️ Overview'     },
  { id: 'departments', label: '🏢 Departments'   },
  { id: 'staff',       label: '👥 Staff'         },
  { id: 'emergency',   label: '🚨 Emergency'     },
  { id: 'transport',   label: '🚌 Transport'     },
  { id: 'hostel',      label: '🏠 Hostel'        },
  { id: 'parents',     label: '👨‍👩‍👧 Parents'      },
  { id: 'it-support',  label: '💻 IT Support'    },
  { id: 'social',      label: '🌐 Social'        },
  { id: 'inquiry',     label: '📝 Inquiry'       },
  { id: 'timings',     label: '🕘 Timings'       },
  { id: 'logs',        label: '📋 Comm. Logs'    },
  { id: 'analytics',   label: '📊 Analytics'     },
];

const AVATAR_BG = ['#4f46e5','#0d9488','#d97706','#9333ea','#0891b2','#16a34a','#e11d48','#ea580c','#0284c7','#7c3aed','#db2777','#059669'];

// ─── Shared Primitives ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase().replace(/[\s/]+/g, '-');
  return <span className={`cc-badge cc-badge--${s}`}>{status}</span>;
}

// ─── Coordinate Parser & Map Helper ───────────────────────────────────────────

function parseCoordinates(coordStr) {
  if (!coordStr) return { lat: 10.0, lng: 76.0 };
  const match = coordStr.match(/(\d+\.?\d*)\s*°\s*([NS])\s*,?\s*(\d+\.?\d*)\s*°\s*([EW])/i);
  if (!match) return { lat: 10.0, lng: 76.0 };
  const [, lat, latDir, lng, lngDir] = match;
  return {
    lat: (latDir.toUpperCase() === 'S' ? -1 : 1) * parseFloat(lat),
    lng: (lngDir.toUpperCase() === 'W' ? -1 : 1) * parseFloat(lng),
  };
}

function MapEmbed({ coordinates, address }) {
  const { lat, lng } = parseCoordinates(coordinates);
  // Use simple Google Maps embed format with coordinates for reliable display
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  return (
    <iframe
      title="Location Map"
      src={mapUrl}
      width="100%"
      height="100%"
      style={{ border: 'none', borderRadius: '12px' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      data-testid="school-map-cc-embed"
    />
  );
}

function Avatar({ initials, index = 0 }) {
  return (
    <div className="cc-avatar" style={{ background: AVATAR_BG[index % AVATAR_BG.length] }}>
      {initials}
    </div>
  );
}

function ContactCTAs({ phone, email, compact = false }) {
  const copy = useCallback((t) => { navigator.clipboard?.writeText(t).catch(() => {}); }, []);
  return (
    <div className={`cc-ctas${compact ? ' cc-ctas--compact' : ''}`}>
      <a className="cc-btn cc-btn--xs cc-btn--primary" href={`tel:${phone}`} data-testid="school-button-cc-call">📞 Call</a>
      {email && email !== '—' && (
        <a className="cc-btn cc-btn--xs cc-btn--outline" href={`mailto:${email}`} data-testid="school-button-cc-email">✉️ Email</a>
      )}
      <button className="cc-btn cc-btn--xs cc-btn--ghost" onClick={() => copy(phone)} data-testid="school-button-cc-copy">📋 Copy</button>
    </div>
  );
}

function ProgressBar({ pct, color = '#4f46e5' }) {
  return (
    <div className="cc-progress">
      <div className="cc-progress__track">
        <div className="cc-progress__fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
      </div>
      <span className="cc-progress__label">{pct}%</span>
    </div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide = false }) {
  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  return (
    <div className="cc-modal-backdrop" role="dialog" aria-modal="true" onKeyDown={handleKey} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`cc-modal${wide ? ' cc-modal--wide' : ''}`}>
        <div className="cc-modal__header">
          <span className="cc-modal__title">{title}</span>
          <button className="cc-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="cc-modal__body">{children}</div>
      </div>
    </div>
  );
}

// ─── Modal Components ─────────────────────────────────────────────────────────

function AddContactModal({ onClose }) {
  return (
    <Modal title="Add New Contact" onClose={onClose}>
      <div className="cc-form">
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Full Name</label><input className="cc-form__input" placeholder="Contact name" data-testid="school-field-cc-contact-name" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Department</label>
            <select className="cc-form__select" data-testid="school-dropdown-cc-contact-dept">
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Phone</label><input className="cc-form__input" placeholder="+91-XXX-XXX-XXXX" data-testid="school-field-cc-contact-phone" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Email</label><input className="cc-form__input" type="email" placeholder="email@campus.edu.in" data-testid="school-field-cc-contact-email" /></div>
        </div>
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Designation</label><input className="cc-form__input" placeholder="Role / designation" data-testid="school-field-cc-contact-desig" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Extension</label><input className="cc-form__input" placeholder="Ext: 101" data-testid="school-field-cc-contact-ext" /></div>
        </div>
        <div className="cc-form__row"><label className="cc-form__label">Room / Location</label><input className="cc-form__input" placeholder="Room number or location" data-testid="school-field-cc-contact-room" /></div>
        <div className="cc-form__actions">
          <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={onClose} data-testid="school-button-cc-add-cancel">Cancel</button>
          <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-add-submit">Add Contact</button>
        </div>
      </div>
    </Modal>
  );
}

function RaiseTicketModal({ onClose }) {
  return (
    <Modal title="Raise Support Ticket" onClose={onClose}>
      <div className="cc-form">
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Your Name</label><input className="cc-form__input" placeholder="Full name" data-testid="school-field-cc-ticket-name" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Phone / Email</label><input className="cc-form__input" placeholder="Contact info" data-testid="school-field-cc-ticket-contact" /></div>
        </div>
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Department</label>
            <select className="cc-form__select" data-testid="school-dropdown-cc-ticket-dept">
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="cc-form__row"><label className="cc-form__label">Priority</label>
            <select className="cc-form__select" data-testid="school-dropdown-cc-ticket-priority">
              <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
            </select>
          </div>
        </div>
        <div className="cc-form__row"><label className="cc-form__label">Subject</label><input className="cc-form__input" placeholder="Brief subject" data-testid="school-field-cc-ticket-subject" /></div>
        <div className="cc-form__row"><label className="cc-form__label">Description</label><textarea className="cc-form__textarea" placeholder="Describe the issue..." data-testid="school-field-cc-ticket-desc" /></div>
        <div className="cc-form__actions">
          <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={onClose}>Cancel</button>
          <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-ticket-submit">Raise Ticket</button>
        </div>
      </div>
    </Modal>
  );
}

function RequestCallbackModal({ onClose }) {
  return (
    <Modal title="Request Callback" onClose={onClose}>
      <div className="cc-form">
        <div className="cc-form__row"><label className="cc-form__label">Your Name</label><input className="cc-form__input" placeholder="Full name" data-testid="school-field-cc-cb-name" /></div>
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Phone Number</label><input className="cc-form__input" placeholder="+91-XXX-XXX-XXXX" data-testid="school-field-cc-cb-phone" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Preferred Time</label><input className="cc-form__input" type="time" data-testid="school-field-cc-cb-time" /></div>
        </div>
        <div className="cc-form__row"><label className="cc-form__label">Department</label>
          <select className="cc-form__select" data-testid="school-dropdown-cc-cb-dept">
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div className="cc-form__row"><label className="cc-form__label">Message</label><textarea className="cc-form__textarea" placeholder="Briefly describe your query..." data-testid="school-field-cc-cb-msg" /></div>
        <div className="cc-form__actions">
          <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={onClose}>Cancel</button>
          <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-cb-submit">Request Callback</button>
        </div>
      </div>
    </Modal>
  );
}

function ViewStaffModal({ onClose, data }) {
  if (!data) return null;
  return (
    <Modal title="Staff Profile" onClose={onClose}>
      <div className="cc-staff-profile">
        <div className="cc-staff-profile__top">
          <Avatar initials={data.avatar} index={data.id} />
          <div>
            <div className="cc-staff-profile__name">{data.name}</div>
            <div className="cc-staff-profile__desig">{data.designation}</div>
            <span className="cc-badge cc-badge--active">{data.type}</span>
          </div>
        </div>
        {[['Employee ID', data.empId], ['Department', data.dept], ['Email', data.email], ['Extension', `Ext: ${data.ext}`], ['Room / Cabin', data.room], ['Availability', data.timing]].map(([k, v]) => (
          <div key={k} className="cc-staff-profile__row"><span>{k}</span><strong>{v}</strong></div>
        ))}
        <div className="cc-form__actions">
          <ContactCTAs phone={`Ext: ${data.ext}`} email={data.email} compact />
        </div>
      </div>
    </Modal>
  );
}

function InquiryFormModal({ onClose, formType = 'General Inquiry' }) {
  return (
    <Modal title={formType} onClose={onClose} wide>
      <div className="cc-form">
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Full Name</label><input className="cc-form__input" placeholder="Your name" data-testid="school-field-cc-inq-name" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Phone</label><input className="cc-form__input" placeholder="+91-XXX-XXX-XXXX" data-testid="school-field-cc-inq-phone" /></div>
        </div>
        <div className="cc-form__row--2col">
          <div className="cc-form__row"><label className="cc-form__label">Email</label><input className="cc-form__input" type="email" placeholder="email@example.com" data-testid="school-field-cc-inq-email" /></div>
          <div className="cc-form__row"><label className="cc-form__label">Department</label>
            <select className="cc-form__select" data-testid="school-dropdown-cc-inq-dept">
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="cc-form__row"><label className="cc-form__label">Subject</label><input className="cc-form__input" placeholder="Subject of inquiry" data-testid="school-field-cc-inq-subject" /></div>
        <div className="cc-form__row"><label className="cc-form__label">Message</label><textarea className="cc-form__textarea" placeholder="Describe your inquiry in detail..." rows={4} data-testid="school-field-cc-inq-msg" /></div>
        <div className="cc-form__actions">
          <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={onClose}>Cancel</button>
          <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-inq-submit">Submit</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────

function OverviewTab({ openModal }) {
  const [branch, setBranch] = useState(0);
  const addr = CAMPUS_BRANCHES[branch];
  return (
    <div className="cc-tab-content">
      <div className="cc-quick-actions" data-testid="school-section-cc-quick-actions">
        <button className="cc-btn cc-btn--primary cc-btn--sm" onClick={() => openModal('add-contact')} data-testid="school-button-cc-add-contact">＋ Add Contact</button>
        <button className="cc-btn cc-btn--ghost cc-btn--sm" data-testid="school-button-cc-download-dir">⬇ Download Directory</button>
        <button className="cc-btn cc-btn--outline cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-raise-ticket">🎫 Raise Support Ticket</button>
        <button className="cc-btn cc-btn--danger cc-btn--sm" data-testid="school-button-cc-emergency-help">🚨 Emergency Help</button>
      </div>

      <p className="cc-section-title">Campus Contact Numbers</p>
      <div className="cc-contact-grid" data-testid="school-grid-cc-overview">
        {OVERVIEW_CONTACTS.map(c => (
          <div key={c.id} className={`cc-contact-card cc-contact-card--${c.category}`} data-testid={`school-card-cc-contact-${c.id}`}>
            <div className="cc-contact-card__icon">{c.icon}</div>
            <div className="cc-contact-card__body">
              <div className="cc-contact-card__title">{c.title}</div>
              <div className="cc-contact-card__phone">{c.phone}</div>
              <div className="cc-contact-card__meta">Ext: {c.ext} · {c.email}</div>
            </div>
            <ContactCTAs phone={c.phone} email={c.email} compact />
          </div>
        ))}
      </div>

      <p className="cc-section-title">Campus Address</p>
      <div className="cc-address-bar">
        {CAMPUS_BRANCHES.map((b, i) => (
          <button key={b.id} className={`cc-chip-btn${branch === i ? ' cc-chip-btn--active' : ''}`} onClick={() => setBranch(i)} data-testid={`school-button-cc-branch-${b.id}`}>{b.name}</button>
        ))}
      </div>
      <div className="cc-address-section" data-testid="school-section-cc-address">
        <div className="cc-address-card">
          <div className="cc-address-card__label">{addr.type}</div>
          <div className="cc-address-card__name">{addr.name}</div>
          <div className="cc-address-card__line">{addr.address}</div>
          <div className="cc-address-card__line">{addr.city}, {addr.state} – {addr.postal}</div>
          <div className="cc-address-card__line">{addr.country}</div>
          <div className="cc-address-card__meta">Landmark: {addr.landmark}</div>
          <div className="cc-address-card__meta">GPS: {addr.coordinates}</div>
          <div className="cc-address-card__actions">
            <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-open-map">🗺 Open Map</button>
            <button className="cc-btn cc-btn--ghost cc-btn--sm" data-testid="school-button-cc-directions">🧭 Get Directions</button>
            <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={() => navigator.clipboard?.writeText(`${addr.address}, ${addr.city}`)
            } data-testid="school-button-cc-copy-address">📋 Copy Address</button>
          </div>
        </div>
        <div className="cc-map-placeholder" data-testid="school-map-cc-placeholder">
          <MapEmbed coordinates={addr.coordinates} address={`${addr.address}, ${addr.city}, ${addr.state}`} />
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Departments ─────────────────────────────────────────────────────────

function DepartmentsTab({ openModal }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filtered = useMemo(() =>
    DEPARTMENTS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.head.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <input className="cc-search" placeholder="Search departments or contacts…" value={search} onChange={e => setSearch(e.target.value)} data-testid="school-field-cc-dept-search" />
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--primary cc-btn--sm" onClick={() => openModal('add-contact')} data-testid="school-button-cc-dept-add">＋ Add Department</button>
        </div>
      </div>
      <div className="cc-dept-grid" data-testid="school-grid-cc-departments">
        {filtered.length === 0 && <div className="cc-empty-state">No departments found.</div>}
        {filtered.map(d => (
          <div key={d.id} className={`cc-dept-card${expanded === d.id ? ' cc-dept-card--open' : ''}`} data-testid={`school-card-cc-dept-${d.id}`}>
            <button className="cc-dept-card__header" onClick={() => setExpanded(expanded === d.id ? null : d.id)} data-testid={`school-button-cc-dept-toggle-${d.id}`}>
              <span className="cc-dept-card__icon">{d.icon}</span>
              <div className="cc-dept-card__info">
                <span className="cc-dept-card__name">{d.name}</span>
                <span className="cc-dept-card__head">{d.head}</span>
              </div>
              <StatusBadge status={d.status} />
              <span className="cc-dept-card__chevron">{expanded === d.id ? '▲' : '▼'}</span>
            </button>
            {expanded === d.id && (
              <div className="cc-dept-card__body">
                {[['Room', d.room], ['Extension', `Ext: ${d.ext}`], ['Email', d.email], ['Working Hours', d.hours], ['Alt. Phone', d.alt]].map(([k, v]) => (
                  <div key={k} className="cc-dept-card__row"><span>{k}</span><strong>{v}</strong></div>
                ))}
                <ContactCTAs phone={d.alt} email={d.email} compact />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Staff ───────────────────────────────────────────────────────────────

function StaffTab({ openModal }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const types = ['All', 'Teaching', 'Non-Teaching', 'Admin', 'Technical', 'Medical'];
  const depts = ['All', ...new Set(STAFF_DIRECTORY.map(s => s.dept))];
  const filtered = useMemo(() =>
    STAFF_DIRECTORY.filter(s =>
      (deptFilter === 'All' || s.dept === deptFilter) &&
      (typeFilter === 'All' || s.type === typeFilter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.designation.toLowerCase().includes(search.toLowerCase()))
    ), [search, deptFilter, typeFilter]
  );
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <input className="cc-search" placeholder="Search staff by name or designation…" value={search} onChange={e => setSearch(e.target.value)} data-testid="school-field-cc-staff-search" />
        <select className="cc-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} data-testid="school-dropdown-cc-staff-dept">
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="cc-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} data-testid="school-dropdown-cc-staff-type">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="cc-staff-grid" data-testid="school-grid-cc-staff">
        {filtered.length === 0 && <div className="cc-empty-state">No staff found.</div>}
        {filtered.map((s, i) => (
          <div key={s.id} className="cc-staff-card" data-testid={`school-card-cc-staff-${s.id}`}>
            <div className="cc-staff-card__top">
              <Avatar initials={s.avatar} index={i} />
              <div className="cc-staff-card__meta">
                <div className="cc-staff-card__name">{s.name}</div>
                <div className="cc-staff-card__desig">{s.designation}</div>
                <span className="cc-badge cc-badge--active">{s.type}</span>
              </div>
            </div>
            <div className="cc-staff-card__details">
              <span>🏢 {s.dept}</span>
              <span>📍 {s.room}</span>
              <span>🕘 {s.timing}</span>
              <span>📞 Ext: {s.ext}</span>
            </div>
            <div className="cc-staff-card__footer">
              <button className="cc-btn cc-btn--ghost cc-btn--xs" onClick={() => openModal('view-staff', s)} data-testid={`school-button-cc-staff-view-${s.id}`}>View Profile</button>
              <a className="cc-btn cc-btn--outline cc-btn--xs" href={`mailto:${s.email}`} data-testid={`school-button-cc-staff-email-${s.id}`}>✉️ Email</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Emergency ───────────────────────────────────────────────────────────

function EmergencyTab() {
  return (
    <div className="cc-tab-content">
      <div className="cc-sos-banner" data-testid="school-banner-cc-sos">
        <span className="cc-sos-banner__icon">🚨</span>
        <div className="cc-sos-banner__text">
          <strong>Campus Emergency SOS</strong>
          <span>For immediate help, call <strong>+91-484-123-4568</strong> or dial extension <strong>911</strong></span>
        </div>
        <a className="cc-btn cc-btn--danger" href="tel:+914841234568" data-testid="school-button-cc-sos-call">📞 SOS Call</a>
      </div>
      <p className="cc-section-title">Emergency Contacts</p>
      <div className="cc-emergency-grid" data-testid="school-grid-cc-emergency">
        {EMERGENCY_CONTACTS.map(ec => (
          <div key={ec.id} className="cc-emergency-card" data-testid={`school-card-cc-emergency-${ec.id}`}>
            <div className="cc-emergency-card__icon">{ec.icon}</div>
            <div className="cc-emergency-card__type">{ec.type}</div>
            <div className="cc-emergency-card__phone">{ec.phone}</div>
            <div className="cc-emergency-card__desc">{ec.desc}</div>
            <div className="cc-emergency-card__avail">🕘 {ec.available}</div>
            <div className="cc-emergency-card__esc">Escalation: {ec.escalation}</div>
            <a className="cc-btn cc-btn--danger cc-btn--sm" href={`tel:${ec.phone}`} data-testid={`school-button-cc-emergency-call-${ec.id}`}>📞 Call Now</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Transport ───────────────────────────────────────────────────────────

function TransportTab({ openModal }) {
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--outline cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-transport-complaint">📋 Raise Complaint</button>
        </div>
      </div>
      <div className="cc-generic-grid" data-testid="school-grid-cc-transport">
        {TRANSPORT_CONTACTS.map(t => (
          <div key={t.id} className="cc-generic-card" data-testid={`school-card-cc-transport-${t.id}`}>
            <div className="cc-generic-card__header">
              <span className="cc-generic-card__name">🚌 {t.name}</span>
              <span className="cc-badge cc-badge--active">{t.route}</span>
            </div>
            <div className="cc-generic-card__meta">
              <span>👤 {t.role}</span>
              <span>🚗 {t.vehicle}</span>
              {t.ext !== '—' && <span>📞 Ext: {t.ext}</span>}
            </div>
            <ContactCTAs phone={t.phone} email={t.email} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Hostel ──────────────────────────────────────────────────────────────

function HostelTab({ openModal }) {
  const [filter, setFilter] = useState('All');
  const hostels = ['All', ...new Set(HOSTEL_CONTACTS.map(h => h.hostel))];
  const filtered = useMemo(() => HOSTEL_CONTACTS.filter(h => filter === 'All' || h.hostel === filter), [filter]);
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <div className="cc-status-chips">
          {hostels.map(h => (
            <button key={h} className={`cc-chip-btn${filter === h ? ' cc-chip-btn--active' : ''}`} onClick={() => setFilter(h)} data-testid={`school-button-cc-hostel-filter-${h}`}>{h}</button>
          ))}
        </div>
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--outline cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-hostel-complaint">📋 Raise Issue</button>
        </div>
      </div>
      <div className="cc-generic-grid" data-testid="school-grid-cc-hostel">
        {filtered.map(h => (
          <div key={h.id} className="cc-generic-card" data-testid={`school-card-cc-hostel-${h.id}`}>
            <div className="cc-generic-card__header">
              <span className="cc-generic-card__name">🏠 {h.name}</span>
              <span className={`cc-badge cc-badge--${h.available ? 'active' : 'offline'}`}>{h.available ? 'Available' : 'Unavailable'}</span>
            </div>
            <div className="cc-generic-card__meta">
              <span>👤 {h.role}</span>
              <span>🏢 {h.hostel}</span>
              <span>🕘 {h.timing}</span>
              {h.ext !== '—' && <span>📞 Ext: {h.ext}</span>}
            </div>
            <ContactCTAs phone={h.phone} email="—" compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Parents ─────────────────────────────────────────────────────────────

function ParentsTab({ openModal }) {
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--primary cc-btn--sm" onClick={() => openModal('request-callback')} data-testid="school-button-cc-parent-callback">📞 Request Callback</button>
          <button className="cc-btn cc-btn--outline cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-parent-complaint">🎫 Raise Complaint</button>
        </div>
      </div>
      <div className="cc-generic-grid" data-testid="school-grid-cc-parents">
        {PARENT_SUPPORT.map(p => (
          <div key={p.id} className="cc-generic-card" data-testid={`school-card-cc-parent-${p.id}`}>
            <div className="cc-generic-card__header">
              <span className="cc-generic-card__name">{p.icon} {p.category}</span>
              <span className="cc-badge cc-badge--active">Support</span>
            </div>
            <div className="cc-generic-card__meta">
              <span>👤 {p.contact}</span>
              <span>🕘 {p.hours}</span>
            </div>
            <ContactCTAs phone={p.phone} email={p.email} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: IT Support ──────────────────────────────────────────────────────────

function ITSupportTab({ openModal }) {
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--primary cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-it-raise-ticket">🎫 Raise IT Ticket</button>
        </div>
      </div>
      <div className="cc-generic-grid" data-testid="school-grid-cc-it">
        {IT_SUPPORT_CONTACTS.map(it => (
          <div key={it.id} className="cc-generic-card" data-testid={`school-card-cc-it-${it.id}`}>
            <div className="cc-generic-card__header">
              <span className="cc-generic-card__name">{it.icon} {it.category}</span>
              <span className={`cc-badge cc-badge--${it.status.toLowerCase()}`}>{it.status}</span>
            </div>
            <div className="cc-generic-card__meta">
              <span>👤 {it.agent}</span>
              <span>🕘 {it.hours}</span>
              <span>📞 {it.phone}</span>
            </div>
            <ContactCTAs phone={it.phone} email={it.email} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Social ──────────────────────────────────────────────────────────────

function SocialTab() {
  const [prefs, setPrefs] = useState({ sms: true, email: true, whatsapp: false, emergency: true });
  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="cc-tab-content">
      <p className="cc-section-title">Official Online Presence</p>
      <div className="cc-social-grid" data-testid="school-grid-cc-social">
        {SOCIAL_MEDIA.map(s => (
          <a key={s.id} className="cc-social-card" href="#" rel="noopener noreferrer" data-testid={`school-card-cc-social-${s.id}`} style={{ '--sc': s.color }}>
            <span className="cc-social-card__icon">{s.icon}</span>
            <div>
              <div className="cc-social-card__platform">{s.platform}</div>
              <div className="cc-social-card__handle">{s.handle}</div>
            </div>
            <span className="cc-social-card__arrow">↗</span>
          </a>
        ))}
      </div>

      <p className="cc-section-title">Communication Preferences</p>
      <div className="cc-prefs" data-testid="school-section-cc-prefs">
        {[['sms', '💬 SMS Notifications'], ['email', '✉️ Email Notifications'], ['whatsapp', '📲 WhatsApp Alerts'], ['emergency', '🚨 Emergency Alerts']].map(([k, label]) => (
          <div key={k} className="cc-pref-row" data-testid={`school-pref-cc-${k}`}>
            <span className="cc-pref-row__label">{label}</span>
            <button className={`cc-toggle${prefs[k] ? ' cc-toggle--on' : ''}`} onClick={() => toggle(k)} aria-label={`Toggle ${label}`} data-testid={`school-toggle-cc-${k}`}>
              <span className="cc-toggle__thumb" />
            </button>
          </div>
        ))}
        <div className="cc-prefs__actions">
          <button className="cc-btn cc-btn--primary cc-btn--sm" data-testid="school-button-cc-prefs-save">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Inquiry ─────────────────────────────────────────────────────────────

const INQUIRY_TYPES = ['Admission Inquiry', 'General Inquiry', 'Callback Request', 'Complaint', 'Feedback'];

function InquiryTab() {
  const [formType, setFormType] = useState('General Inquiry');
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="cc-tab-content">
      <div className="cc-inquiry-sub-tabs" data-testid="school-subtabs-cc-inquiry">
        {INQUIRY_TYPES.map(t => (
          <button key={t} className={`cc-chip-btn${formType === t ? ' cc-chip-btn--active' : ''}`} onClick={() => { setFormType(t); setSubmitted(false); }} data-testid={`school-button-cc-inq-type-${t.replace(/\s/g, '-').toLowerCase()}`}>{t}</button>
        ))}
      </div>
      {submitted ? (
        <div className="cc-inquiry-success" data-testid="school-section-cc-inq-success">
          <span>✅</span>
          <strong>Submission Received!</strong>
          <p>Your <em>{formType}</em> has been submitted. Our team will get back to you within 24 hours.</p>
          <button className="cc-btn cc-btn--ghost cc-btn--sm" onClick={() => setSubmitted(false)} data-testid="school-button-cc-inq-new">Submit Another</button>
        </div>
      ) : (
        <div className="cc-inquiry-form-wrap" data-testid="school-form-cc-inquiry">
          <p className="cc-inquiry-form-wrap__title">{formType}</p>
          <div className="cc-form">
            <div className="cc-form__row--2col">
              <div className="cc-form__row"><label className="cc-form__label">Full Name *</label><input className="cc-form__input" placeholder="Your full name" data-testid="school-field-cc-form-name" /></div>
              <div className="cc-form__row"><label className="cc-form__label">Phone *</label><input className="cc-form__input" placeholder="+91-XXX-XXX-XXXX" data-testid="school-field-cc-form-phone" /></div>
            </div>
            <div className="cc-form__row--2col">
              <div className="cc-form__row"><label className="cc-form__label">Email *</label><input className="cc-form__input" type="email" placeholder="your@email.com" data-testid="school-field-cc-form-email" /></div>
              <div className="cc-form__row"><label className="cc-form__label">Department</label>
                <select className="cc-form__select" data-testid="school-dropdown-cc-form-dept">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="cc-form__row"><label className="cc-form__label">Subject *</label><input className="cc-form__input" placeholder="Subject" data-testid="school-field-cc-form-subject" /></div>
            <div className="cc-form__row"><label className="cc-form__label">Message *</label><textarea className="cc-form__textarea" rows={4} placeholder="Describe your inquiry in detail..." data-testid="school-field-cc-form-message" /></div>
            <div className="cc-form__actions">
              <button className="cc-btn cc-btn--primary" onClick={() => setSubmitted(true)} data-testid="school-button-cc-form-submit">Submit {formType}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Timings ─────────────────────────────────────────────────────────────

function TimingsTab() {
  return (
    <div className="cc-tab-content">
      <p className="cc-section-title">Campus Operating Hours</p>
      <div className="cc-timings-grid" data-testid="school-grid-cc-timings">
        {CAMPUS_TIMINGS.map(t => (
          <div key={t.id} className="cc-timing-card" data-testid={`school-card-cc-timing-${t.id}`}>
            <div className="cc-timing-card__header">
              <span className="cc-timing-card__icon">{t.icon}</span>
              <span className="cc-timing-card__area">{t.area}</span>
            </div>
            <div className="cc-timing-card__rows">
              {[['Weekdays', t.weekday], ['Saturday', t.saturday], ['Sunday', t.sunday], ['Holidays', t.holiday]].map(([d, v]) => (
                <div key={d} className="cc-timing-card__row">
                  <span>{d}</span>
                  <strong className={v === 'Closed' ? 'cc-timing--closed' : v === '24 Hours' ? 'cc-timing--always' : ''}>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Logs ────────────────────────────────────────────────────────────────

function LogsTab({ openModal }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Pending', 'Escalated'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Urgent'];
  const filtered = useMemo(() =>
    COMMUNICATION_LOGS.filter(l =>
      (statusFilter === 'All' || l.status === statusFilter) &&
      (priorityFilter === 'All' || l.priority === priorityFilter) &&
      (l.id.toLowerCase().includes(search.toLowerCase()) || l.requester.toLowerCase().includes(search.toLowerCase()) || l.issue.toLowerCase().includes(search.toLowerCase()))
    ), [search, statusFilter, priorityFilter]
  );
  return (
    <div className="cc-tab-content">
      <div className="cc-filters-bar">
        <input className="cc-search" placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)} data-testid="school-field-cc-logs-search" />
        <select className="cc-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} data-testid="school-dropdown-cc-logs-status">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="cc-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} data-testid="school-dropdown-cc-logs-priority">
          {priorities.map(p => <option key={p}>{p}</option>)}
        </select>
        <div className="cc-filters-bar__right">
          <button className="cc-btn cc-btn--primary cc-btn--sm" onClick={() => openModal('raise-ticket')} data-testid="school-button-cc-logs-new">＋ New Ticket</button>
        </div>
      </div>
      <div className="cc-table-wrap" data-testid="school-table-cc-logs">
        <table className="cc-table">
          <thead><tr>
            <th>Log ID</th><th>Requester</th><th>Department</th><th>Issue</th><th>Priority</th><th>Assigned</th><th>Status</th><th>Time</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="cc-empty-state">No logs found.</td></tr>
            ) : filtered.map(l => (
              <tr key={l.id} data-testid={`school-row-cc-log-${l.id}`}>
                <td className="cc-table__id">{l.id}</td>
                <td>{l.requester}</td>
                <td>{l.department}</td>
                <td className="cc-table__issue">{l.issue}</td>
                <td><span className={`cc-severity cc-severity--${l.priority.toLowerCase()}`}>{l.priority}</span></td>
                <td>{l.assigned}</td>
                <td><StatusBadge status={l.status} /></td>
                <td className="cc-table__time">{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  const { resolutionRate, avgResponseTime, openTickets, resolvedToday, deptWiseRequests, responseTrend, topCategories } = CONTACT_ANALYTICS;
  const maxDept = Math.max(...deptWiseRequests.map(d => d.count));
  const maxCat  = Math.max(...topCategories.map(c => c.count));
  const maxTrend = Math.max(...responseTrend.map(r => r.hours));
  return (
    <div className="cc-analytics cc-tab-content">
      <div className="cc-analytics-stats" data-testid="school-stats-cc-analytics">
        {[
          { icon: '✅', label: 'Inquiry Resolution',   value: `${resolutionRate}%`, tone: 'green'  },
          { icon: '⏱️', label: 'Avg Response Time',    value: avgResponseTime,      tone: 'blue'   },
          { icon: '🎫', label: 'Open Tickets',         value: openTickets,          tone: 'amber'  },
          { icon: '🟢', label: 'Resolved Today',       value: resolvedToday,        tone: 'teal'   },
        ].map((s, i) => (
          <div key={i} className={`cc-analytics-stat cc-analytics-stat--${s.tone}`} data-testid={`school-stat-cc-analytics-${i}`}>
            <span className="cc-analytics-stat__icon">{s.icon}</span>
            <span className="cc-analytics-stat__value">{s.value}</span>
            <span className="cc-analytics-stat__label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="cc-analytics-grid">
        <div className="cc-chart-card" data-testid="school-chart-cc-dept">
          <div className="cc-chart-card__title">Department-wise Requests</div>
          <div className="cc-hbar-chart">
            {deptWiseRequests.map(d => (
              <div key={d.dept} className="cc-hbar-chart__row">
                <span className="cc-hbar-chart__label">{d.dept}</span>
                <div className="cc-hbar-chart__track"><div className="cc-hbar-chart__fill cc-hbar-chart__fill--indigo" style={{ width: `${(d.count / maxDept) * 100}%` }} /></div>
                <span className="cc-hbar-chart__val">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-chart-card" data-testid="school-chart-cc-categories">
          <div className="cc-chart-card__title">Top Inquiry Categories</div>
          <div className="cc-hbar-chart">
            {topCategories.map(c => (
              <div key={c.label} className="cc-hbar-chart__row">
                <span className="cc-hbar-chart__label">{c.label}</span>
                <div className="cc-hbar-chart__track"><div className="cc-hbar-chart__fill cc-hbar-chart__fill--teal" style={{ width: `${(c.count / maxCat) * 100}%` }} /></div>
                <span className="cc-hbar-chart__val">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-chart-card cc-chart-card--wide" data-testid="school-chart-cc-trend">
          <div className="cc-chart-card__title">Avg Response Time Trend (hours)</div>
          <div className="cc-vbar-chart cc-vbar-chart--wide">
            {responseTrend.map(r => (
              <div key={r.month} className="cc-vbar-chart__col">
                <span className="cc-vbar-chart__val">{r.hours}h</span>
                <div className="cc-vbar-chart__bar cc-vbar-chart__bar--blue" style={{ height: `${(r.hours / maxTrend) * 100}%` }} />
                <span className="cc-vbar-chart__label">{r.month}</span>
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
  'add-contact':       (onClose)        => <AddContactModal onClose={onClose} />,
  'raise-ticket':      (onClose)        => <RaiseTicketModal onClose={onClose} />,
  'request-callback':  (onClose)        => <RequestCallbackModal onClose={onClose} />,
  'view-staff':        (onClose, data)  => <ViewStaffModal onClose={onClose} data={data} />,
  'inquiry-form':      (onClose, data)  => <InquiryFormModal onClose={onClose} formType={data?.type} />,
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Contact() {
  const [activeTab, setActiveTab]     = useState('overview');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData]     = useState(null);
  const tabBarRef = useRef(null);

  const openModal = useCallback((key, data = null) => { setActiveModal(key); setModalData(data); }, []);
  const closeModal = useCallback(() => { setActiveModal(null); setModalData(null); }, []);

  const tabContent = useMemo(() => {
    const props = { openModal };
    switch (activeTab) {
      case 'overview':    return <OverviewTab    {...props} />;
      case 'departments': return <DepartmentsTab {...props} />;
      case 'staff':       return <StaffTab       {...props} />;
      case 'emergency':   return <EmergencyTab               />;
      case 'transport':   return <TransportTab   {...props} />;
      case 'hostel':      return <HostelTab       {...props} />;
      case 'parents':     return <ParentsTab      {...props} />;
      case 'it-support':  return <ITSupportTab    {...props} />;
      case 'social':      return <SocialTab                  />;
      case 'inquiry':     return <InquiryTab                 />;
      case 'timings':     return <TimingsTab                 />;
      case 'logs':        return <LogsTab         {...props} />;
      case 'analytics':   return <AnalyticsTab               />;
      default:            return null;
    }
  }, [activeTab, openModal]);

  return (
    <div className="cc-root" data-testid="school-page-cc-contact">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Campus" },
          { label: "Contact Information" },
        ]}
        title="Campus Contact Information"
        subtitle="Centralized smart campus communication hub — directory, support & emergency contacts"
      />

      <div className="cc-tabs-wrap" data-testid="school-tabs-cc-contact">
        <div className="cc-tabs" ref={tabBarRef} role="tablist">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              className={`cc-tab${activeTab === t.id ? ' cc-tab--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              data-testid={`school-tab-cc-${t.id}`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div className="cc-tab-panel">{tabContent}</div>

      {activeModal && MODAL_REGISTRY[activeModal] && MODAL_REGISTRY[activeModal](closeModal, modalData)}
    </div>
  );
}

