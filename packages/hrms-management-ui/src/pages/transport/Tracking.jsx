import React, { useState, useMemo, useCallback } from 'react';
import '../../Assets/styles/Tracking.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import { MOCK_LIVE_BUSES, MOCK_ALERTS, MOCK_ANALYTICS, BUS_STATUSES, ALERT_TYPES } from './liveTrackingMockData';

// ── Helper Functions ──────────────────────────────────────────────────────────

const fmtTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const fmtDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

const fmtDistance = (km) => {
  return km ? `${km.toFixed(1)} km` : '—';
};

const getStatusConfig = (status) => {
  const configs = {
    'Moving': { label: '✓ Moving', color: '#16a34a', icon: '🚗' },
    'At Stop': { label: '⊘ At Stop', color: '#d97706', icon: '🛑' },
    'Delayed': { label: '⏱ Delayed', color: '#dc2626', icon: '⏰' },
    'Maintenance': { label: '🔧 Maintenance', color: '#2563eb', icon: '⚙️' },
    'GPS Offline': { label: '📡 GPS Offline', color: '#6b7280', icon: '⚠️' },
    'Deviated': { label: '🔄 Deviated', color: '#d97706', icon: '↗️' },
    'Completed': { label: '✓ Completed', color: '#16a34a', icon: '✓' },
  };
  return configs[status] || { label: status, color: '#6b7280', icon: '•' };
};

const getAlertSeverityClass = (severity) => {
  return {
    'Critical': 'critical',
    'High': 'high',
    'Medium': 'medium',
    'Low': 'low',
  }[severity] || 'low';
};

const calcETA = (minutes) => {
  if (minutes <= 0) return 'Now';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getOccupancyStatus = (current, capacity) => {
  const pct = capacity ? (current / capacity) * 100 : 0;
  return pct >= 90 ? 'full' : pct >= 75 ? 'high' : 'ok';
};

const filterBuses = (buses, search, filters) => {
  return buses.filter((b) => {
    const matchSearch = !search || b.number.includes(search) || b.route.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filters.status || b.status === filters.status;
    const matchRoute = !filters.route || b.route === filters.route;
    const matchUrgency = !filters.urgency || (filters.urgency === 'high' && b.alerts?.length > 0) || (filters.urgency === 'normal');
    return matchSearch && matchStatus && matchRoute && matchUrgency;
  });
};

// ── UI Primitives ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <span className={`lt-badge lt-badge--${status?.toLowerCase().replace(/\s+/g, '-')}`} data-testid="school-badge-lt-status" style={{ background: `${cfg.color}22`, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const AlertBadge = ({ severity }) => (
  <span className={`lt-badge lt-badge--${getAlertSeverityClass(severity)}`} data-testid="school-badge-lt-severity">
    {severity === 'Critical' && '⛔'} {severity === 'High' && '⚠️'} {severity === 'Medium' && '⚡'} {severity === 'Low' && 'ⓘ'} {severity}
  </span>
);

const OccupancyBar = ({ current, total }) => {
  const status = getOccupancyStatus(current, total);
  const pct = total ? (current / total) * 100 : 0;
  return <div className={`lt-occ-bar lt-occ-bar--${status}`}><div className={`lt-occ-bar__fill lt-occ-bar__fill--${status}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>;
};

const Toast = ({ message, type = 'success' }) => (
  <div className={`lt-toast lt-toast--${type}`} data-testid="school-toast-notification">
    {type === 'success' && '✓ '}{type === 'error' && '✕ '}{type === 'warning' && '⚠️ '}{type === 'info' && 'ⓘ '}
    {message}
  </div>
);

// ── Modal Components ──────────────────────────────────────────────────────────

const BusDetailsModal = ({ bus, onClose }) => (
  <div className="lt-modal-backdrop" data-testid="school-modal-lt-bus-details">
    <div className="lt-modal lt-modal--lg">
      <div className="lt-modal__body">
        <div className="lt-modal-info-grid">
          <div className="lt-modal-info-block">
            <p className="lt-modal-info-label">Current Stop</p>
            <p className="lt-modal-info-value">{bus?.currentStop}</p>
          </div>
          <div className="lt-modal-info-block">
            <p className="lt-modal-info-label">Driver</p>
            <p className="lt-modal-info-value">{bus?.driver}</p>
          </div>
          <div className="lt-modal-info-block">
            <p className="lt-modal-info-label">Speed</p>
            <p className="lt-modal-info-value">{bus?.speed} km/h</p>
          </div>
          <div className="lt-modal-info-block">
            <p className="lt-modal-info-label">ETA</p>
            <p className="lt-modal-info-value">{calcETA(bus?.etaMinutes)}</p>
          </div>
        </div>
        <h3 className="lt-modal__section-title">Route Progress</h3>
        <div className="lt-timeline" data-testid="school-list-stops">
          {bus?.routeProgress?.map((stop, idx) => (
            <div key={stop.id} className="lt-timeline-item">
              <div className={`lt-timeline-item__dot ${stop.completed ? 'lt-timeline-item__dot--completed' : stop.current ? 'lt-timeline-item__dot--active' : ''}`} />
              <h4 className="lt-timeline-item__name">{stop.name}</h4>
              <div className="lt-timeline-item__meta"><span className="lt-timeline-item__meta-chip">⏰ {stop.time}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="lt-modal__footer">
        <button className="lt-btn lt-btn--ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const AlertViewModal = ({ alert, onClose }) => (
  <div className="lt-modal-backdrop" data-testid="school-modal-lt-alert-view">
    <div className="lt-modal">
      <div className="lt-modal__header">
        <h2 className="lt-modal__title">Alert Details</h2>
        <button className="lt-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="lt-modal__body">
        <div className="lt-modal__badge-wrapper"><AlertBadge severity={alert?.severity} /></div>
        <p className="lt-modal__detail-text"><strong>Type:</strong> {alert?.type}</p>
        <p className="lt-modal__detail-text"><strong>Message:</strong> {alert?.message}</p>
        <p className="lt-modal__detail-text"><strong>Time:</strong> {fmtTime(alert?.timestamp)}</p>
        <p className="lt-modal__detail-text lt-modal__detail-text--last"><strong>Status:</strong> {alert?.status}</p>
      </div>
      <div className="lt-modal__footer">
        <button className="lt-btn lt-btn--primary" onClick={onClose}>Acknowledge</button>
      </div>
    </div>
  </div>
);

const ContactDriverModal = ({ bus, onClose }) => (
  <div className="lt-modal-backdrop" data-testid="school-modal-lt-contact-driver">
    <div className="lt-modal">
      <div className="lt-modal__header">
        <h2 className="lt-modal__title">Contact Driver</h2>
        <button className="lt-modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="lt-modal__body">
        <div className="lt-form-grid lt-form-grid__full">
          <div className="lt-field">
            <label className="lt-field__label">Driver: {bus?.driver}</label>
            <p className="lt-field__hint">Phone: {bus?.driverPhone}</p>
          </div>
          <div className="lt-field lt-field--spaced">
            <label className="lt-field__label">Message</label>
            <textarea className="lt-field__textarea" placeholder="Send a message to the driver..." data-testid="school-field-lt-message" />
          </div>
        </div>
      </div>
      <div className="lt-modal__footer">
        <button className="lt-btn lt-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="lt-btn lt-btn--primary" onClick={onClose} data-testid="school-button-send-message">Send Message</button>
      </div>
    </div>
  </div>
);

// ── Overview View Component ──────────────────────────────────────────────────

const OverviewView = ({ buses, onSelectBus, onOpenModal, filters, setFilters, search, setSearch }) => {
  const filteredBuses = useMemo(() => filterBuses(buses, search, filters), [buses, search, filters]);
  const activeBuses = buses.filter(b => b.status === 'Moving').length;
  const stoppedBuses = buses.filter(b => b.status === 'At Stop').length;
  const alertBuses = buses.filter(b => (b.alerts || []).length > 0).length;

  return (
    <div className="lt-root" data-testid="school-view-lt-overview">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Transport' },
          { label: 'Live Tracking' },
        ]}
        title="Live Tracking"
        subtitle="Real-time monitoring of bus fleet and operational status"
      />

      {/* Summary Chips */}
      <div className="lt-chips" data-testid="school-chips-summary">
        <div className="lt-chip lt-chip--moving"><span>🚗 Moving</span><strong>{activeBuses}</strong></div>
        <div className="lt-chip lt-chip--stopped"><span>🛑 At Stop</span><strong>{stoppedBuses}</strong></div>
        <div className="lt-chip lt-chip--delayed"><span>⚠️ Alerts</span><strong>{alertBuses}</strong></div>
        <div className="lt-chip"><span>📍 Total</span><strong>{buses.length}</strong></div>
      </div>

      {/* Toolbar */}
      <div className="lt-toolbar">
        <div className="lt-search">
          <span className="lt-search__icon">🔍</span>
          <input className="lt-search__input" placeholder="Search buses by number or route..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="school-input-lt-search" />
        </div>
        <select className="lt-filter" value={filters.status || ''} onChange={(e) => setFilters({ ...filters, status: e.target.value })} data-testid="school-dropdown-lt-status">
          <option value="">All Status</option>
          <option value="Moving">Moving</option>
          <option value="At Stop">At Stop</option>
          <option value="Delayed">Delayed</option>
        </select>
        <select className="lt-filter" value={filters.urgency || ''} onChange={(e) => setFilters({ ...filters, urgency: e.target.value })} data-testid="school-dropdown-lt-urgency">
          <option value="">All Urgency</option>
          <option value="high">High Priority</option>
          <option value="normal">Normal</option>
        </select>
        <span className="lt-toolbar__count" data-testid="school-text-lt-count">{filteredBuses.length} buses</span>
      </div>

      {/* Buses Grid */}
      {filteredBuses.length > 0 ? (
        <div className="lt-buses-grid" data-testid="school-grid-lt-buses">
          {filteredBuses.map((bus) => (
            <div key={bus.id} className={`lt-bus-card lt-bus-card--${bus.status?.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => onSelectBus(bus)} data-testid={`school-card-bus-lt-${bus.id}`}>
              <div className="lt-bus-card__head">
                <div>
                  <h3 className="lt-bus-card__name">{bus.number}</h3>
                  <p className="lt-bus-card__code">{bus.route}</p>
                </div>
                <StatusBadge status={bus.status} />
              </div>
              <div className="lt-bus-card__body">
                <div className="lt-bus-card__stat">
                  <span className="lt-bus-card__stat-label">Current Stop</span>
                  <span className="lt-bus-card__stat-value lt-bus-card__stat-value--small">{bus.currentStop}</span>
                </div>
                <div className="lt-bus-card__stat">
                  <span className="lt-bus-card__stat-label">ETA</span>
                  <span className="lt-bus-card__stat-value">{calcETA(bus.etaMinutes)}</span>
                </div>
                <div className="lt-bus-card__stat">
                  <span className="lt-bus-card__stat-label">Speed</span>
                  <span className="lt-bus-card__stat-value">{bus.speed} km/h</span>
                </div>
                <div className="lt-bus-card__stat">
                  <span className="lt-bus-card__stat-label">Occupancy</span>
                  <OccupancyBar current={bus.occupancyCurrent} total={bus.occupancyCapacity} />
                </div>
              </div>
              <div className="lt-bus-card__footer">
                <div className="lt-bus-card__meta">
                  <div className="lt-bus-card__meta-item"><span className="lt-bus-card__meta-item__icon">👤</span><span className="lt-bus-card__meta-item__text">{bus.driver}</span></div>
                  <div className="lt-bus-card__meta-item"><span className="lt-bus-card__meta-item__icon">📡</span><span className="lt-bus-card__meta-item__text">{bus.gpsStatus}</span></div>
                </div>
                <button className="lt-bus-card__action" onClick={(e) => { e.stopPropagation(); onOpenModal('BUS_DETAILS', bus); }} data-testid="school-button-lt-view-bus">View</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="lt-empty"><div className="lt-empty__icon">📍</div><h3 className="lt-empty__title">No buses found</h3><p className="lt-empty__desc">Try adjusting your search or filters</p></div>
      )}
    </div>
  );
};

// ── Detail View Component ────────────────────────────────────────────────────

const DetailView = ({ bus, alerts, onBack, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const busAlerts = alerts.filter(a => a.busId === bus?.id) || [];

  return (
    <div className="lt-root">
      <div className="lt-breadcrumb"><button className="lt-breadcrumb__back" onClick={onBack}>Live Tracking</button><span className="lt-breadcrumb__sep">/</span><span className="lt-breadcrumb__active">{bus?.number}</span></div>
      <div className="lt-detail-header">
        <div className="lt-detail-header__meta">
          <h1 className="lt-detail-header__name">{bus?.number}</h1>
          <p className="lt-detail-header__code">{bus?.route}</p>
          <div className="lt-detail-header__badges"><StatusBadge status={bus?.status} /></div>
        </div>
        <div className="lt-detail-header__actions">
          <button className="lt-btn lt-btn--sm lt-btn--ghost" onClick={() => onOpenModal('CONTACT_DRIVER', bus)}>📞 Contact Driver</button>
          <button className="lt-btn lt-btn--sm lt-btn--ghost" onClick={() => onOpenModal('ALERT_VIEW', busAlerts[0])}>📢 Send Alert</button>
          <button className="lt-btn lt-btn--sm lt-btn--ghost" onClick={onBack}>← Back</button>
        </div>
      </div>
      <div className="lt-tabs">
        {['OVERVIEW', 'ROUTE', 'STOPS', 'DRIVER', 'ALERTS', 'HISTORY'].map(tab => (
          <button key={tab} className={`lt-tab ${activeTab === tab ? 'lt-tab--active' : ''}`} onClick={() => setActiveTab(tab)} data-testid={`school-tab-tracking-${tab.toLowerCase()}`}>{tab.replace('_', ' ')}</button>
        ))}
      </div>
      <div className="lt-tab-panel" data-testid="school-panel-lt-tab">
        {activeTab === 'OVERVIEW' && <div><p className="lt-tab-panel__paragraph"><strong>Current Stop:</strong> {bus?.currentStop}</p><p className="lt-tab-panel__paragraph"><strong>Driver:</strong> {bus?.driver}</p><p className="lt-tab-panel__paragraph"><strong>Speed:</strong> {bus?.speed} km/h</p><p className="lt-tab-panel__paragraph"><strong>ETA:</strong> {calcETA(bus?.etaMinutes)}</p><p className="lt-tab-panel__paragraph"><strong>Occupancy:</strong> {bus?.occupancyCurrent}/{bus?.occupancyCapacity}</p></div>}
        {activeTab === 'ROUTE' && <div><p className="lt-tab-panel__paragraph"><strong>Route:</strong> {bus?.route}</p><p className="lt-tab-panel__paragraph"><strong>Total Distance:</strong> {fmtDistance(bus?.routeDistance)}</p><p className="lt-tab-panel__paragraph"><strong>Completed:</strong> {bus?.routeProgress?.filter(s => s.completed).length}/{bus?.routeProgress?.length} stops</p></div>}
        {activeTab === 'STOPS' && <div className="lt-timeline">{bus?.routeProgress?.map(s => <div key={s.id} className="lt-timeline-item"><div className={`lt-timeline-item__dot ${s.completed ? 'lt-timeline-item__dot--completed' : ''}`} /><h4 className="lt-timeline-item__name">{s.name}</h4><div className="lt-timeline-item__meta"><span className="lt-timeline-item__meta-chip">⏰ {s.time}</span></div></div>)}</div>}
        {activeTab === 'DRIVER' && <div><p className="lt-tab-panel__paragraph"><strong>Name:</strong> {bus?.driver}</p><p className="lt-tab-panel__paragraph"><strong>Phone:</strong> {bus?.driverPhone}</p><p className="lt-tab-panel__paragraph"><strong>Experience:</strong> {bus?.driverExp} years</p><p className="lt-tab-panel__paragraph"><strong>License Expiry:</strong> {fmtDate(bus?.driverLicenseExpiry)}</p></div>}
        {activeTab === 'ALERTS' && <div className="lt-alert-list" data-testid="school-list-lt-alerts">{busAlerts.length > 0 ? busAlerts.map(a => <div key={a.id} className={`lt-alert-row lt-alert-row--${getAlertSeverityClass(a.severity)}`}><div className="lt-alert-row__icon">{a.severity === 'Critical' && '⛔'}{a.severity === 'High' && '⚠️'}{a.severity === 'Medium' && '⚡'}{a.severity === 'Low' && 'ⓘ'}</div><div className="lt-alert-row__body"><div className="lt-alert-row__type">{a.type}</div><div className="lt-alert-row__msg">{a.message}</div><div className="lt-alert-row__ts">{fmtTime(a.timestamp)}</div></div></div>) : <p className="lt-empty-state__text">No active alerts</p>}</div>}
        {activeTab === 'HISTORY' && <div><p className="lt-tab-panel__paragraph">Historical tracking data</p></div>}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function Tracking() {
  const [view, setView] = useState('OVERVIEW');
  const [selectedBus, setSelectedBus] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', route: '', urgency: '' });

  const openModal = useCallback((type, data = null) => setModal({ type, data }), []);
  const closeModal = useCallback(() => setModal(null), []);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <>
      {view === 'OVERVIEW' ? (
        <OverviewView buses={MOCK_LIVE_BUSES} onSelectBus={(bus) => { setSelectedBus(bus); setView('DETAIL'); }} onOpenModal={openModal} filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />
      ) : (
        <DetailView bus={selectedBus} alerts={MOCK_ALERTS} onBack={() => setView('OVERVIEW')} onOpenModal={openModal} />
      )}

      {modal?.type === 'BUS_DETAILS' && <BusDetailsModal bus={modal.data} onClose={closeModal} />}
      {modal?.type === 'ALERT_VIEW' && <AlertViewModal alert={modal.data} onClose={closeModal} />}
      {modal?.type === 'CONTACT_DRIVER' && <ContactDriverModal bus={modal.data} onClose={closeModal} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
