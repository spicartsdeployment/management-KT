import React, { useState, useMemo, useCallback } from 'react';
import '../../Assets/styles/RoutesDrivers.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import { MOCK_ROUTES, MOCK_DRIVERS, ROUTE_STATUSES, DRIVER_ROLES, COMPLIANCE_ITEMS } from './routesDriversMockData';

// ── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Format date to readable format
 * @param {string} date - ISO date string
 * @returns {string} Formatted date
 */
const fmtDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Get route status config
 * @param {string} status - Status ID
 * @returns {object} Status config with label, icon, color
 */
const getRouteStatusConfig = (status) => {
  const configs = {
    ACTIVE: { label: '✓ Active', color: '#16a34a' },
    IDLE: { label: '⊘ Idle', color: '#f59e0b' },
    BREAKDOWN: { label: '✕ Breakdown', color: '#dc2626' },
    PLANNED: { label: '◑ Planned', color: '#2563eb' },
  };
  return configs[status] || { label: status, color: '#6b7280' };
};

/**
 * Get compliance status class
 * @param {string} status - Compliance status (OK, WARNING, EXPIRED)
 * @returns {string} CSS class suffix
 */
const getComplianceClass = (status) => {
  return {
    OK: 'ok',
    WARNING: 'warning',
    EXPIRED: 'expired',
  }[status] || 'ok';
};

/**
 * Calculate occupancy percentage
 * @param {number} current - Current occupancy
 * @param {number} total - Total capacity
 * @returns {object} Occupancy data with percentage and status
 */
const calcOccupancy = (current, total) => {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return {
    percentage: pct,
    status: pct >= 90 ? 'FULL' : pct >= 75 ? 'HIGH' : 'OK',
  };
};

/**
 * Filter routes by search and filters
 * @param {array} routes - Routes array
 * @param {string} search - Search query
 * @param {object} filters - Active filters
 * @returns {array} Filtered routes
 */
const filterRoutes = (routes, search, filters) => {
  return routes.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.includes(search);
    const matchStatus = !filters.status || r.status === filters.status;
    const matchArea = !filters.area || r.area === filters.area;
    const matchOccupancy = !filters.occupancy || calcOccupancy(r.totalStudents + r.totalTeachers, r.busesCount * 40).status === filters.occupancy;
    return matchSearch && matchStatus && matchArea && matchOccupancy;
  });
};

// ── UI Primitives ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status, size = 'md' }) => {
  const cfg = getRouteStatusConfig(status);
  return (
    <span
      className={`rd-badge rd-badge--${status?.toLowerCase()}`}
      data-testid="school-badge-route-status"
      style={{ background: `${cfg.color}22`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

const ComplianceBadge = ({ status, label }) => (
  <div className={`rd-compliance-item rd-compliance-item--${getComplianceClass(status)}`} data-testid="school-badge-compliance">
    <span className="rd-compliance-item__label">{label}</span>
    <span className={`rd-compliance-item__status rd-compliance-item__status--${getComplianceClass(status)}`}>
      {status === 'OK' ? '✓ OK' : status === 'WARNING' ? '⚠️ Warning' : '✕ Expired'}
    </span>
  </div>
);

const OccBar = ({ current, total }) => {
  const occ = calcOccupancy(current, total);
  return (
    <div className={`rd-occ-bar rd-occ-bar--${occ.status.toLowerCase()}`} data-testid="school-bar-occupancy">
      <div className={`rd-occ-bar__fill rd-occ-bar__fill--${occ.status.toLowerCase()}`} style={{ width: `${occ.percentage}%` }} />
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`rd-toast rd-toast--${type}`} data-testid="school-toast-notification">
    {type === 'success' && '✓ '}{type === 'error' && '✕ '}{type === 'warning' && '⚠️ '}{type === 'info' && 'ⓘ '}
    {message}
  </div>
);

// ── Modal Components ──────────────────────────────────────────────────────────

const AddRouteModal = ({ onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-add-route">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Add New Route</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field">
            <label className="rd-field__label">Route Name</label>
            <input className="rd-field__input" placeholder="e.g., North Route" data-testid="school-field-route-name" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Route Code</label>
            <input className="rd-field__input" placeholder="e.g., NR-001" data-testid="school-field-route-code" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Area</label>
            <input className="rd-field__input" placeholder="e.g., North Delhi" data-testid="school-field-route-area" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Distance (km)</label>
            <input type="number" className="rd-field__input" placeholder="e.g., 24.5" data-testid="school-field-route-distance" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Start Time</label>
            <input type="time" className="rd-field__input" data-testid="school-field-route-start-time" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">End Time</label>
            <input type="time" className="rd-field__input" data-testid="school-field-route-end-time" />
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Status</label>
            <select className="rd-field__select" data-testid="school-dropdown-route-status">
              <option>Select Status</option>
              <option>ACTIVE</option>
              <option>IDLE</option>
              <option>PLANNED</option>
            </select>
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-save-route">Save Route</button>
      </div>
    </div>
  </div>
);

const EditRouteModal = ({ route, onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-edit-route">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Edit Route: {route?.name}</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field">
            <label className="rd-field__label">Route Name</label>
            <input className="rd-field__input" defaultValue={route?.name} data-testid="school-field-route-name-edit" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Distance (km)</label>
            <input type="number" className="rd-field__input" defaultValue={route?.distance} data-testid="school-field-route-distance-edit" />
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Status</label>
            <select className="rd-field__select" defaultValue={route?.status} data-testid="school-dropdown-route-status-edit">
              <option>ACTIVE</option>
              <option>IDLE</option>
              <option>BREAKDOWN</option>
              <option>PLANNED</option>
            </select>
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-save-edit">Save Changes</button>
      </div>
    </div>
  </div>
);

const AllocateBusModal = ({ route, onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-allocate-bus">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Allocate Bus to Route</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Select Bus</label>
            <select className="rd-field__select" data-testid="school-dropdown-bus-select">
              <option>Choose a bus...</option>
              <option>KA-01-AB-1234 (Non-AC, 40 seats)</option>
              <option>KA-01-CD-5678 (AC, 35 seats)</option>
            </select>
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Assign Driver</label>
            <select className="rd-field__select" data-testid="school-dropdown-driver-select">
              <option>Choose a driver...</option>
              <option>Rajesh Kumar (Exp: 12 yrs)</option>
              <option>Mohammad Hassan (Exp: 15 yrs)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-allocate-bus">Allocate Bus</button>
      </div>
    </div>
  </div>
);

const AddStopModal = ({ onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-add-stop">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Add Stop to Route</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Stop Name</label>
            <input className="rd-field__input" placeholder="e.g., Civil Lines Junction" data-testid="school-field-stop-name" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Stop Type</label>
            <select className="rd-field__select" data-testid="school-dropdown-stop-type">
              <option>STOP</option>
              <option>SCHOOL</option>
            </select>
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Arrival Time</label>
            <input type="time" className="rd-field__input" data-testid="school-field-stop-time" />
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Sequence</label>
            <input type="number" className="rd-field__input" placeholder="e.g., 2" data-testid="school-field-stop-sequence" />
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-add-stop">Add Stop</button>
      </div>
    </div>
  </div>
);

const AddDriverModal = ({ onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-add-driver">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Add Driver/Staff Member</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field">
            <label className="rd-field__label">Full Name</label>
            <input className="rd-field__input" placeholder="e.g., Rajesh Kumar" data-testid="school-field-driver-name" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">Role</label>
            <select className="rd-field__select" data-testid="school-dropdown-driver-role">
              <option>DRIVER</option>
              <option>BACKUP</option>
              <option>CLEANER</option>
              <option>INCHARGE</option>
            </select>
          </div>
          <div className="rd-field">
            <label className="rd-field__label">License Number</label>
            <input className="rd-field__input" placeholder="e.g., KA-05-DL-20240315" data-testid="school-field-license-number" />
          </div>
          <div className="rd-field">
            <label className="rd-field__label">License Expiry</label>
            <input type="date" className="rd-field__input" data-testid="school-field-license-expiry" />
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Phone Number</label>
            <input type="tel" className="rd-field__input" placeholder="+91-XXXXX-XXXXX" data-testid="school-field-driver-phone" />
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-add-driver">Add Member</button>
      </div>
    </div>
  </div>
);

const AssignStudentModal = ({ route, onClose, onSave }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-assign-student">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Assign Student to Route</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-form-grid">
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Select Student</label>
            <select className="rd-field__select" data-testid="school-dropdown-student-select">
              <option>Choose student...</option>
              <option>Aditya Kumar (Class 5A)</option>
              <option>Priya Singh (Class 6B)</option>
            </select>
          </div>
          <div className="rd-field rd-form-grid__full">
            <label className="rd-field__label">Preferred Stop</label>
            <select className="rd-field__select" data-testid="school-dropdown-stop-select">
              <option>Choose stop...</option>
              {route?.stops?.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--primary" onClick={onSave} data-testid="school-button-assign-student">Assign Student</button>
      </div>
    </div>
  </div>
);

const ViewScheduleModal = ({ route, onClose }) => (
  <div className="rd-modal-backdrop rd-modal--lg" data-testid="school-modal-view-schedule">
    <div className="rd-modal rd-modal--lg">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Route Schedule: {route?.name}</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-stop-timeline" data-testid="school-list-stops">
          {route?.stops?.map((stop, idx) => (
            <div key={stop.id} className="rd-stop-item">
              <div className={`rd-stop-item__dot ${stop.type === 'SCHOOL' ? 'rd-stop-item__dot--school' : ''}`}>
                {stop.type === 'SCHOOL' ? '🏫' : '⊙'}
              </div>
              <h4 className="rd-stop-item__name">{stop.name}</h4>
              <div className="rd-stop-item__meta">
                <span className="rd-stop-item__meta-chip">⏰ {stop.time}</span>
                <span className="rd-stop-item__meta-chip">📍 Stop #{stop.sequence}</span>
                <span className="rd-stop-item__meta-chip">👥 {stop.students} students</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-close">Close</button>
      </div>
    </div>
  </div>
);

const ViewComplianceModal = ({ route, onClose }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-view-compliance">
    <div className="rd-modal">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Compliance Status: {route?.name}</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <div className="rd-compliance-grid" data-testid="school-grid-compliance">
          {Object.entries(route?.compliance || {}).map(([item, data]) => (
            <ComplianceBadge key={item} status={data.status} label={item} />
          ))}
        </div>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-close">Close</button>
      </div>
    </div>
  </div>
);

const DeleteRouteModal = ({ route, onClose, onConfirm }) => (
  <div className="rd-modal-backdrop" data-testid="school-modal-delete-route">
    <div className="rd-modal rd-modal--sm">
      <div className="rd-modal__header">
        <h2 className="rd-modal__title">Delete Route</h2>
        <button className="rd-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
      </div>
      <div className="rd-modal__body">
        <p>Are you sure you want to delete <strong>{route?.name}</strong>? This action cannot be undone.</p>
      </div>
      <div className="rd-modal__footer">
        <button className="rd-btn rd-btn--ghost" onClick={onClose} data-testid="school-button-cancel">Cancel</button>
        <button className="rd-btn rd-btn--danger" onClick={onConfirm} data-testid="school-button-confirm-delete">Delete Route</button>
      </div>
    </div>
  </div>
);

// ── Route Overview Component ──────────────────────────────────────────────────

const RoutesOverview = ({ routes, onSelectRoute, onOpenModal, filters, setFilters, search, setSearch }) => {
  const filteredRoutes = useMemo(() => filterRoutes(routes, search, filters), [routes, search, filters]);

  return (
    <div className="rd-root" data-testid="school-view-routes-overview">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Transport' },
          { label: 'Routes & Drivers' },
        ]}
        title="Routes & Drivers"
        subtitle="Manage transport routes, bus allocation, drivers, and compliance"
        actions={(
          <button className="rd-btn rd-btn--primary" onClick={() => onOpenModal('ADD_ROUTE')} data-testid="school-button-add-route">
            + Add Route
          </button>
        )}
      />

      {/* Summary Chips */}
      <div className="rd-chips" data-testid="school-chips-summary">
        <div className="rd-chip rd-chip--active">
          <span>✓ Active Routes</span>
          <strong>{routes.filter(r => r.status === 'ACTIVE').length}</strong>
        </div>
        <div className="rd-chip rd-chip--breakdown">
          <span>⚠️ Requiring Attention</span>
          <strong>{routes.filter(r => r.status === 'BREAKDOWN').length}</strong>
        </div>
        <div className="rd-chip">
          <span>📍 Total Routes</span>
          <strong>{routes.length}</strong>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rd-toolbar" data-testid="school-toolbar">
        <div className="rd-search">
          <span className="rd-search__icon">🔍</span>
          <input
            className="rd-search__input"
            placeholder="Search routes by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="school-input-search"
          />
        </div>
        <select
          className="rd-filter"
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          data-testid="school-dropdown-filter-status"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="IDLE">Idle</option>
          <option value="BREAKDOWN">Breakdown</option>
        </select>
        <select
          className="rd-filter"
          value={filters.area || ''}
          onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          data-testid="school-dropdown-filter-area"
        >
          <option value="">All Areas</option>
          <option value="North Delhi">North Delhi</option>
          <option value="South Delhi">South Delhi</option>
          <option value="East Delhi">East Delhi</option>
          <option value="West Delhi">West Delhi</option>
          <option value="Central Delhi">Central Delhi</option>
        </select>
        <span className="rd-toolbar__count" data-testid="school-text-results-count">
          {filteredRoutes.length} result{filteredRoutes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Routes Grid */}
      {filteredRoutes.length > 0 ? (
        <div className="rd-routes-grid" data-testid="school-grid-routes">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className={`rd-route-card rd-route-card--${route.status.toLowerCase()}`}
              onClick={() => onSelectRoute(route)}
              data-testid={`school-card-route-${route.id}`}
            >
              <div className="rd-route-card__head">
                <div>
                  <h3 className="rd-route-card__name">{route.name}</h3>
                  <p className="rd-route-card__code">{route.code}</p>
                </div>
                <StatusBadge status={route.status} />
              </div>

              <div className="rd-route-card__body">
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Distance</span>
                  <span className="rd-route-card__stat-value">{route.distance} km</span>
                </div>
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Time</span>
                  <span className="rd-route-card__stat-value">{route.startTime}–{route.endTime}</span>
                </div>
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Buses</span>
                  <span className="rd-route-card__stat-value">{route.busesCount}</span>
                </div>
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Stops</span>
                  <span className="rd-route-card__stat-value">{route.stopsCount}</span>
                </div>
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Occupancy</span>
                  <OccBar current={route.totalStudents + route.totalTeachers} total={route.busesCount * 40} />
                </div>
                <div className="rd-route-card__stat">
                  <span className="rd-route-card__stat-label">Compliance</span>
                  <span className="rd-route-card__stat-value">
                    {Object.values(route.compliance).filter(c => c.status === 'OK').length}/{Object.keys(route.compliance).length} ✓
                  </span>
                </div>
              </div>

              <div className="rd-route-card__footer">
                <div className="rd-route-card__meta">
                  <div className="rd-route-card__meta-item">
                    <span className="rd-route-card__meta-item__icon">👥</span>
                    <span className="rd-route-card__meta-item__text">{route.totalStudents} students</span>
                  </div>
                  <div className="rd-route-card__meta-item">
                    <span className="rd-route-card__meta-item__icon">👨‍🏫</span>
                    <span className="rd-route-card__meta-item__text">{route.totalTeachers} teachers</span>
                  </div>
                </div>
                <button
                  className="rd-route-card__action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoute(route);
                  }}
                  data-testid="school-button-view-route"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rd-empty" data-testid="school-empty-state">
          <div className="rd-empty__icon">📍</div>
          <h3 className="rd-empty__title">No routes found</h3>
          <p className="rd-empty__desc">Try adjusting your search or filters to find routes</p>
        </div>
      )}
    </div>
  );
};

// ── Route Detail Component ────────────────────────────────────────────────────

const RouteDetailView = ({ route, drivers, onBack, onOpenModal }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const routeDrivers = drivers.filter(d => d.assignedRoute === route.id);
  const routeBuses = route.buses || [];

  return (
    <div className="rd-root" data-testid="school-view-route-detail">
      {/* Breadcrumb */}
      <div className="rd-breadcrumb" data-testid="school-breadcrumb">
        <button className="rd-breadcrumb__back" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rd-muted)', textDecoration: 'underline' }}>
          Transport
        </button>
        <span className="rd-breadcrumb__sep">/</span>
        <button className="rd-breadcrumb__back" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rd-muted)', textDecoration: 'underline' }}>
          Routes & Drivers
        </button>
        <span className="rd-breadcrumb__sep">/</span>
        <span className="rd-breadcrumb__active">{route.name}</span>
      </div>

      {/* Detail Header */}
      <div className="rd-detail-header">
        <div className="rd-detail-header__meta">
          <h1 className="rd-detail-header__name">{route.name}</h1>
          <p className="rd-detail-header__code">{route.code}</p>
          <div className="rd-detail-header__badges">
            <StatusBadge status={route.status} />
          </div>
        </div>
        <div className="rd-detail-header__actions">
          <button className="rd-btn rd-btn--sm rd-btn--ghost" onClick={() => onOpenModal('EDIT_ROUTE', route)} data-testid="school-button-edit-route">
            Edit
          </button>
          <button className="rd-btn rd-btn--sm rd-btn--ghost" onClick={() => onOpenModal('VIEW_SCHEDULE', route)} data-testid="school-button-view-schedule">
            Schedule
          </button>
          <button className="rd-btn rd-btn--sm rd-btn--ghost" onClick={() => onOpenModal('VIEW_COMPLIANCE', route)} data-testid="school-button-view-compliance">
            Compliance
          </button>
          <button className="rd-btn rd-btn--sm rd-btn--ghost rd-btn--danger" onClick={() => onOpenModal('DELETE_ROUTE', route)} data-testid="school-button-delete-route">
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="rd-tabs" data-testid="school-tabs-route">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'BUSES', label: 'Buses' },
          { id: 'DRIVERS', label: 'Drivers & Staff' },
          { id: 'STOPS', label: 'Stops & Timing' },
          { id: 'COMPLIANCE', label: 'Compliance' },
          { id: 'ALERTS', label: 'Alerts' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`rd-tab ${activeTab === tab.id ? 'rd-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`school-tab-route-${tab.id.toLowerCase()}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div data-testid="school-panel-tab-content">
        {activeTab === 'OVERVIEW' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: '.625rem' }}>
              <p style={{ fontSize: '.875rem', color: 'var(--rd-muted)', margin: '0 0 .5rem 0' }}>Distance</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{route.distance} km</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: '.625rem' }}>
              <p style={{ fontSize: '.875rem', color: 'var(--rd-muted)', margin: '0 0 .5rem 0' }}>Buses</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{route.busesCount}</p>
            </div>
            <div style={{ padding: '1rem', background: 'var(--rd-surface)', border: '1px solid var(--rd-line)', borderRadius: '.625rem' }}>
              <p style={{ fontSize: '.875rem', color: 'var(--rd-muted)', margin: '0 0 .5rem 0' }}>Stops</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{route.stopsCount}</p>
            </div>
          </div>
        )}

        {activeTab === 'BUSES' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <button className="rd-btn rd-btn--sm rd-btn--primary" onClick={() => onOpenModal('ALLOCATE_BUS', route)} data-testid="school-button-allocate-bus">
                + Allocate Bus
              </button>
            </div>
            <div className="rd-buses-grid" data-testid="school-grid-buses">
              {routeBuses.map(busId => (
                <div key={busId} className="rd-bus-card rd-bus-card--active">
                  <div className="rd-bus-card__head">
                    <div>
                      <p className="rd-bus-card__number">{busId}</p>
                      <p className="rd-bus-card__model">Tata Starbus Ultra 40</p>
                    </div>
                  </div>
                  <div className="rd-bus-card__body">
                    <div className="rd-bus-card__row">
                      <span className="rd-bus-card__row__label">Capacity</span>
                      <span className="rd-bus-card__row__value">40 seats</span>
                    </div>
                    <div className="rd-bus-card__row">
                      <span className="rd-bus-card__row__label">Occupancy</span>
                      <span className="rd-bus-card__row__value">24/40</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'DRIVERS' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <button className="rd-btn rd-btn--sm rd-btn--primary" onClick={() => onOpenModal('ADD_DRIVER', route)} data-testid="school-button-add-driver">
                + Add Driver/Staff
              </button>
            </div>
            <div className="rd-drivers-grid" data-testid="school-grid-drivers">
              {routeDrivers.map(driver => (
                <div key={driver.id} className={`rd-driver-card rd-driver-card--${driver.role.toLowerCase()}`} data-testid={`school-card-driver-${driver.id}`}>
                  <div className="rd-driver-card__head">
                    <div className="rd-driver-card__avatar">{driver.name.charAt(0)}</div>
                    <div>
                      <p className="rd-driver-card__name">{driver.name}</p>
                      <p className="rd-driver-card__role">{driver.role}</p>
                    </div>
                  </div>
                  <div className="rd-driver-card__body">
                    <div className="rd-driver-card__field">
                      <span className="rd-driver-card__field__label">License</span>
                      <span className="rd-driver-card__field__value">{driver.license}</span>
                    </div>
                    <div className="rd-driver-card__field">
                      <span className="rd-driver-card__field__label">Expiry</span>
                      <span className="rd-driver-card__field__value">{fmtDate(driver.licenseExpiry)}</span>
                    </div>
                    <div className="rd-driver-card__field">
                      <span className="rd-driver-card__field__label">Experience</span>
                      <span className="rd-driver-card__field__value">{driver.experience} yrs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'STOPS' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <button className="rd-btn rd-btn--sm rd-btn--primary" onClick={() => onOpenModal('ADD_STOP', route)} data-testid="school-button-add-stop">
                + Add Stop
              </button>
            </div>
            <div className="rd-stop-timeline" data-testid="school-list-stops">
              {route.stops.map((stop, idx) => (
                <div key={stop.id} className="rd-stop-item">
                  <div className={`rd-stop-item__dot ${stop.type === 'SCHOOL' ? 'rd-stop-item__dot--school' : ''}`}>
                    {stop.type === 'SCHOOL' ? '🏫' : '⊙'}
                  </div>
                  <h4 className="rd-stop-item__name">{stop.name}</h4>
                  <div className="rd-stop-item__meta">
                    <span className="rd-stop-item__meta-chip">⏰ {stop.time}</span>
                    <span className="rd-stop-item__meta-chip">📍 Stop #{stop.sequence}</span>
                    <span className="rd-stop-item__meta-chip">👥 {stop.students} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'COMPLIANCE' && (
          <div className="rd-compliance-grid" data-testid="school-grid-compliance">
            {Object.entries(route.compliance).map(([item, data]) => (
              <ComplianceBadge key={item} status={data.status} label={`${item}: ${fmtDate(data.expiry)}`} />
            ))}
          </div>
        )}

        {activeTab === 'ALERTS' && (
          <div className="rd-alert-list" data-testid="school-list-alerts">
            {route.alerts && route.alerts.length > 0 ? (
              route.alerts.map(alert => (
                <div key={alert.id} className={`rd-alert-row rd-alert-row--${alert.severity.toLowerCase()}`} data-testid={`school-alert-${alert.id}`}>
                  <div className="rd-alert-row__icon">
                    {alert.severity === 'CRITICAL' && '⛔'}
                    {alert.severity === 'HIGH' && '⚠️'}
                    {alert.severity === 'MEDIUM' && '⚠️'}
                    {alert.severity === 'LOW' && 'ⓘ'}
                  </div>
                  <div className="rd-alert-row__body">
                    <div className="rd-alert-row__type">{alert.type}</div>
                    <div className="rd-alert-row__msg">{alert.message}</div>
                  </div>
                  <span className={`rd-alert-resolved ${alert.resolved ? 'rd-alert-resolved--open' : ''}`}>
                    {alert.resolved ? 'RESOLVED' : 'OPEN'}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--rd-muted)', textAlign: 'center' }}>No alerts for this route</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * RoutesDrivers - Premium enterprise routes & drivers management
 * Two-view pattern: Overview grid + Detail view with 6 tabs
 * Features: Route CRUD, bus allocation, driver management, compliance tracking
 * @returns {JSX.Element} Routes & Drivers management interface
 */
export default function RoutesDrivers() {
  const [view, setView] = useState('OVERVIEW');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', area: '', occupancy: '' });

  const openModal = useCallback((type, data = null) => {
    setModal({ type, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = useCallback((modalType) => {
    showToast(`✓ Operation completed successfully`);
    closeModal();
  }, [closeModal, showToast]);

  return (
    <>
      {view === 'OVERVIEW' ? (
        <RoutesOverview
          routes={MOCK_ROUTES}
          onSelectRoute={(route) => {
            setSelectedRoute(route);
            setView('DETAIL');
          }}
          onOpenModal={openModal}
          filters={filters}
          setFilters={setFilters}
          search={search}
          setSearch={setSearch}
        />
      ) : (
        <RouteDetailView
          route={selectedRoute}
          drivers={MOCK_DRIVERS}
          onBack={() => setView('OVERVIEW')}
          onOpenModal={openModal}
        />
      )}

      {/* Modals */}
      {modal?.type === 'ADD_ROUTE' && <AddRouteModal onClose={closeModal} onSave={() => handleSave('ADD_ROUTE')} />}
      {modal?.type === 'EDIT_ROUTE' && <EditRouteModal route={modal.data} onClose={closeModal} onSave={() => handleSave('EDIT_ROUTE')} />}
      {modal?.type === 'DELETE_ROUTE' && <DeleteRouteModal route={modal.data} onClose={closeModal} onConfirm={() => handleSave('DELETE_ROUTE')} />}
      {modal?.type === 'ALLOCATE_BUS' && <AllocateBusModal route={modal.data} onClose={closeModal} onSave={() => handleSave('ALLOCATE_BUS')} />}
      {modal?.type === 'ADD_STOP' && <AddStopModal onClose={closeModal} onSave={() => handleSave('ADD_STOP')} />}
      {modal?.type === 'ADD_DRIVER' && <AddDriverModal onClose={closeModal} onSave={() => handleSave('ADD_DRIVER')} />}
      {modal?.type === 'ASSIGN_STUDENT' && <AssignStudentModal route={modal.data} onClose={closeModal} onSave={() => handleSave('ASSIGN_STUDENT')} />}
      {modal?.type === 'VIEW_SCHEDULE' && <ViewScheduleModal route={modal.data} onClose={closeModal} />}
      {modal?.type === 'VIEW_COMPLIANCE' && <ViewComplianceModal route={modal.data} onClose={closeModal} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
