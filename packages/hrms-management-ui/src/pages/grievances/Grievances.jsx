import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { initialState, grievancesReducer } from './context';
import { MOCK_GRIEVANCES, computeMetrics } from './grievancesMockData';
import { useGrievanceFilters } from './hooks/useGrievanceFilters';
import { useGrievanceModals, useGrievanceDrawer, useGrievanceToast, useGrievanceActions } from './hooks/useGrievanceModals';
import '../../Assets/styles/Grievances.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

// ─────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────

const GrievanceMetrics = ({ metrics }) => {
  const metricCards = [
    { label: 'Open', value: metrics?.openCount || 0, className: 'gr-metric-card--open' },
    { label: 'In Progress', value: metrics?.inProgressCount || 0, className: 'gr-metric-card--progress' },
    { label: 'Escalated', value: metrics?.escalatedCount || 0, className: 'gr-metric-card--escalated' },
    { label: 'Resolved', value: metrics?.resolvedCount || 0, className: 'gr-metric-card--resolved' },
    { label: 'Critical', value: metrics?.criticalCount || 0, className: 'gr-metric-card--critical' },
    { label: 'Total', value: metrics?.totalCount || 0, className: 'gr-metric-card--total' },
  ];

  return (
    <div className="gr-metrics-grid">
      {metricCards.map((card, idx) => (
        <div key={idx} className={`gr-metric-card ${card.className}`} data-testid={`school-metric-grievance-${card.label.toLowerCase().replace(/\s/g, '-')}`}>
          <div className="gr-metric-card__value">{card.value}</div>
          <div className="gr-metric-card__label">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

const GrievanceToolbar = ({ filters, onFilterChange, onClearFilters }) => (
  <div className="gr-toolbar">
    <div className="gr-toolbar__search">
      <input
        type="text"
        placeholder="Search grievances..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange.search(e.target.value)}
        className="gr-form-input"
        data-testid="school-field-grievance-search"
      />
    </div>
    <div className="gr-toolbar__filters">
      <select
        value={filters.complainantType || ''}
        onChange={(e) => onFilterChange.complainantType(e.target.value || null)}
        className="gr-form-select"
        data-testid="school-dropdown-grievance-complainant-type"
      >
        <option value="">All Complainants</option>
        <option value="Student">Student</option>
        <option value="Teacher">Teacher</option>
        <option value="Parent">Parent</option>
        <option value="Non-Teaching Staff">Non-Teaching Staff</option>
      </select>
      <select
        value={filters.category || ''}
        onChange={(e) => onFilterChange.category(e.target.value || null)}
        className="gr-form-select"
        data-testid="school-dropdown-grievance-category"
      >
        <option value="">All Categories</option>
        <option value="Academic">Academic</option>
        <option value="Discipline">Discipline</option>
        <option value="Transport">Transport</option>
        <option value="Hostel">Hostel</option>
        <option value="Fees">Fees</option>
      </select>
      <select
        value={filters.priority || ''}
        onChange={(e) => onFilterChange.priority(e.target.value || null)}
        className="gr-form-select"
        data-testid="school-dropdown-grievance-priority"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange.status(e.target.value || null)}
        className="gr-form-select"
        data-testid="school-dropdown-grievance-status"
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="Assigned">Assigned</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
      <button
        onClick={onClearFilters}
        className="gr-btn gr-btn--sm gr-btn--secondary"
        data-testid="school-button-grievance-clear-filters"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

const GrievanceTable = ({ grievances, onRowClick, expandedId, onSelectGrievance, onSelectAll, selectedIds, onAssign, onEscalate }) => {
  return (
    <div className="gr-table-wrapper">
      <div style={{ padding: '1rem', backgroundColor: 'var(--gr-muted)', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--gr-text)' }} data-testid="school-helper-text-grievances">
        💡 <strong>Tip:</strong> Click on a grievance row to see more details and internal notes.
      </div>
      <table className="gr-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                data-testid="school-checkbox-grievance-select-all"
              />
            </th>
            <th>ID</th>
            <th>Complainant</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Date Raised</th>
            <th style={{ width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grievances && grievances.length > 0 ? (
            grievances.map((g) => (
              <React.Fragment key={g.id}>
                <tr className="gr-table__row" onClick={() => onRowClick(g.id)}>
                  <td style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(g.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onSelectGrievance(g.id);
                      }}
                      data-testid={`school-checkbox-grievance-${g.id}`}
                    />
                  </td>
                  <td className="gr-table__cell--id">{g.id}</td>
                  <td className="gr-table__cell--complainant">{g.complainantName}</td>
                  <td className="gr-table__cell--category">
                    <span className={`gr-badge gr-badge--category gr-badge--category-${g.category.toLowerCase().replace(/\s/g, '-')}`}>
                      {g.category}
                    </span>
                  </td>
                  <td className="gr-table__cell--priority">
                    <span className={`gr-badge gr-badge--priority-${g.priority.toLowerCase()}`}>
                      {g.priority}
                    </span>
                  </td>
                  <td className="gr-table__cell--status">
                    <span className={`gr-badge gr-badge--status-${g.status.toLowerCase().replace(/[\s_]/g, '-')}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="gr-table__cell--assigned">{g.assignedTo || '-'}</td>
                  <td className="gr-table__cell--date">{new Date(g.createdDate).toLocaleDateString()}</td>
                  <td className="gr-table__cell--actions" onClick={(e) => e.stopPropagation()}>
                    <div className="gr-table__actions-horizontal">
                      <button
                        className="gr-btn gr-btn--xs gr-btn--info"
                        onClick={() => onRowClick(g.id)}
                        data-testid={`school-button-grievance-view-${g.id}`}
                        title="View Details"
                      >
                        View
                      </button>
                      {!g.assignedTo ? (
                        <button
                          className="gr-btn gr-btn--xs gr-btn--success"
                          onClick={() => onAssign(g.id)}
                          data-testid={`school-button-grievance-assign-${g.id}`}
                          title="Assign Grievance"
                        >
                          Assign
                        </button>
                      ) : (
                        <button
                          className="gr-btn gr-btn--xs gr-btn--primary"
                          onClick={() => onAssign(g.id)}
                          data-testid={`school-button-grievance-reassign-${g.id}`}
                          title="Reassign Grievance"
                        >
                          Reassign
                        </button>
                      )}
                      {g.status !== 'escalated' && (
                        <button
                          className="gr-btn gr-btn--xs gr-btn--warning"
                          onClick={() => onEscalate(g.id)}
                          data-testid={`school-button-grievance-escalate-${g.id}`}
                          title="Escalate Grievance"
                        >
                          Escalate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Row - Details */}
                {expandedId === g.id && (
                  <tr className="gr-table__row--expanded">
                    <td colSpan="9" className="gr-table__cell--details">
                      <div className="gr-table__expanded-content">
                        <div className="gr-details-grid">
                          <div className="gr-details-column">
                            <h4>Complaint Details</h4>
                            <p>
                              <strong>Title:</strong> {g.title}
                            </p>
                            <p>
                              <strong>Description:</strong> {g.description}
                            </p>
                            <p>
                              <strong>Type:</strong> {g.complainantType}
                            </p>
                          </div>

                          <div className="gr-details-column">
                            <h4>Contact Information</h4>
                            <p>
                              <strong>Email:</strong> {g.contactEmail}
                            </p>
                            <p>
                              <strong>Phone:</strong> {g.contactPhone}
                            </p>
                            {g.class && (
                              <p>
                                <strong>Class:</strong> {g.class}
                              </p>
                            )}
                          </div>

                          <div className="gr-details-column">
                            <h4>Resolution Info</h4>
                            <p>
                              <strong>Assigned To:</strong> {g.assignedTo || 'Unassigned'}
                            </p>
                            <p>
                              <strong>SLA Status:</strong>
                              <span className={`gr-sla-badge gr-sla-badge--${g.slaStatus?.toLowerCase() || 'pending'}`}>
                                {g.slaStatus || 'Pending'}
                              </span>
                            </p>
                            <p>
                              <strong>Deadline:</strong> {new Date(g.deadline).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="gr-details-column">
                            <h4>Timestamps</h4>
                            <p>
                              <strong>Created:</strong> {new Date(g.createdDate).toLocaleString()}
                            </p>
                            <p>
                              <strong>Updated:</strong> {new Date(g.lastUpdated).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Internal Notes */}
                        {g.internalNotes && g.internalNotes.length > 0 && (
                          <div className="gr-internal-notes">
                            <h4>Internal Notes ({g.internalNotes.length})</h4>
                            <div className="gr-notes-list">
                              {g.internalNotes.map((note, idx) => (
                                <div key={idx} className="gr-note-item">
                                  <p className="gr-note-author">{note.author}</p>
                                  <p className="gr-note-text">{note.text}</p>
                                  <p className="gr-note-date">{new Date(note.timestamp).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="gr-table__cell--empty">
                No grievances found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return toast && (
    <div className={`gr-toast gr-toast--${toast.type}`} data-testid={`school-toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={onClose} className="gr-toast__close">✕</button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// MODAL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────

const ViewDetailsModal = ({ isOpen, grievanceId, grievances, onClose }) => {
  if (!isOpen) return null;

  const grievance = grievances?.find((g) => g.id === grievanceId);
  if (!grievance) return null;

  return (
    <div className="gr-modal-backdrop" data-testid={`school-modal-grievance-view-${grievanceId}`}>
      <div className="gr-modal" style={{ maxWidth: '700px' }}>
        <div className="gr-modal__header">
          <h2 className="gr-modal__title">Grievance Details - {grievance.id}</h2>
          <button className="gr-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="gr-modal__body">
          <div className="gr-details-grid">
            <div className="gr-details-column">
              <h4>Complaint Details</h4>
              <p><strong>ID:</strong> {grievance.id}</p>
              <p><strong>Title:</strong> {grievance.title}</p>
              <p><strong>Description:</strong> {grievance.description}</p>
              <p><strong>Category:</strong> {grievance.category}</p>
              <p><strong>Priority:</strong> {grievance.priority}</p>
              <p><strong>Status:</strong> {grievance.status}</p>
            </div>

            <div className="gr-details-column">
              <h4>Complainant Information</h4>
              <p><strong>Name:</strong> {grievance.complainantName}</p>
              <p><strong>Type:</strong> {grievance.complainantType}</p>
              <p><strong>Email:</strong> {grievance.contactEmail}</p>
              <p><strong>Phone:</strong> {grievance.contactPhone}</p>
              {grievance.class && <p><strong>Class:</strong> {grievance.class}</p>}
            </div>

            <div className="gr-details-column">
              <h4>Resolution Info</h4>
              <p><strong>Assigned To:</strong> {grievance.assignedTo || 'Unassigned'}</p>
              <p>
                <strong>SLA Status:</strong>
                <span className={`gr-sla-badge gr-sla-badge--${grievance.slaStatus?.toLowerCase() || 'pending'}`}>
                  {grievance.slaStatus || 'Pending'}
                </span>
              </p>
              <p><strong>Deadline:</strong> {new Date(grievance.deadline).toLocaleDateString()}</p>
            </div>

            <div className="gr-details-column">
              <h4>Timestamps</h4>
              <p><strong>Created:</strong> {new Date(grievance.createdDate).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(grievance.lastUpdated).toLocaleString()}</p>
            </div>
          </div>

          {grievance.internalNotes && grievance.internalNotes.length > 0 && (
            <div className="gr-internal-notes">
              <h4>Internal Notes ({grievance.internalNotes.length})</h4>
              <div className="gr-notes-list">
                {grievance.internalNotes.map((note, idx) => (
                  <div key={idx} className="gr-note-item">
                    <p className="gr-note-author">{note.author}</p>
                    <p className="gr-note-text">{note.text}</p>
                    <p className="gr-note-date">{new Date(note.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignModal = ({ isOpen, grievanceId, grievances, onClose, onAssign }) => {
  if (!isOpen) return null;

  const grievance = grievances?.find((g) => g.id === grievanceId);
  if (!grievance) return null;

  const [selectedRole, setSelectedRole] = React.useState('');
  const [note, setNote] = React.useState('');

  const ROLES = ['Principal', 'HR Manager', 'Accounts Team', 'Transport Manager', 'Hostel Warden', 'Maintenance Team', 'Discipline Committee', 'Coordinator', 'Teacher'];

  const handleSubmit = () => {
    if (!selectedRole) {
      alert('Please select a role to assign');
      return;
    }
    onAssign({ grievanceId, assignedTo: selectedRole, note });
    setSelectedRole('');
    setNote('');
    onClose();
  };

  return (
    <div className="gr-modal-backdrop" data-testid={`school-modal-grievance-assign-${grievanceId}`}>
      <div className="gr-modal">
        <div className="gr-modal__header">
          <h2 className="gr-modal__title">Assign Grievance</h2>
          <button className="gr-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="gr-modal__body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Grievance: {grievance.id}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gr-muted)' }}>{grievance.title}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Assign To Role <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="gr-form-select"
              data-testid="school-dropdown-assign-role"
              style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--gr-line)', borderRadius: '0.5rem' }}
            >
              <option value="">Select a role...</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Add Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal note about this assignment..."
              className="gr-form-textarea"
              data-testid="school-field-assign-note"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid var(--gr-line)',
                borderRadius: '0.5rem',
                minHeight: '100px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
        <div className="gr-modal__footer">
          <button
            className="gr-btn gr-btn--secondary"
            onClick={onClose}
            data-testid="school-button-modal-cancel"
          >
            Cancel
          </button>
          <button
            className="gr-btn gr-btn--primary"
            onClick={handleSubmit}
            data-testid="school-button-modal-assign-submit"
          >
            Assign Grievance
          </button>
        </div>
      </div>
    </div>
  );
};

const ReassignModal = ({ isOpen, grievanceId, grievances, onClose, onReassign }) => {
  if (!isOpen) return null;

  const grievance = grievances?.find((g) => g.id === grievanceId);
  if (!grievance) return null;

  const [selectedRole, setSelectedRole] = React.useState(grievance.assignedTo || '');
  const [note, setNote] = React.useState('');

  const ROLES = ['Principal', 'HR Manager', 'Accounts Team', 'Transport Manager', 'Hostel Warden', 'Maintenance Team', 'Discipline Committee', 'Coordinator', 'Teacher'];

  const handleSubmit = () => {
    if (!selectedRole) {
      alert('Please select a role to reassign');
      return;
    }
    onReassign({ grievanceId, assignedTo: selectedRole, note });
    setSelectedRole('');
    setNote('');
    onClose();
  };

  return (
    <div className="gr-modal-backdrop" data-testid={`school-modal-grievance-reassign-${grievanceId}`}>
      <div className="gr-modal">
        <div className="gr-modal__header">
          <h2 className="gr-modal__title">Reassign Grievance</h2>
          <button className="gr-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="gr-modal__body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Grievance: {grievance.id}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gr-muted)' }}>{grievance.title}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <strong>Currently Assigned To:</strong> {grievance.assignedTo}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Reassign To Role <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="gr-form-select"
              data-testid="school-dropdown-reassign-role"
              style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--gr-line)', borderRadius: '0.5rem' }}
            >
              <option value="">Select a role...</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Reason for Reassignment <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why this grievance is being reassigned..."
              className="gr-form-textarea"
              data-testid="school-field-reassign-note"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid var(--gr-line)',
                borderRadius: '0.5rem',
                minHeight: '100px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
        <div className="gr-modal__footer">
          <button
            className="gr-btn gr-btn--secondary"
            onClick={onClose}
            data-testid="school-button-modal-cancel"
          >
            Cancel
          </button>
          <button
            className="gr-btn gr-btn--primary"
            onClick={handleSubmit}
            data-testid="school-button-modal-reassign-submit"
          >
            Reassign Grievance
          </button>
        </div>
      </div>
    </div>
  );
};

const EscalateModal = ({ isOpen, grievanceId, grievances, onClose, onEscalate }) => {
  if (!isOpen) return null;

  const grievance = grievances?.find((g) => g.id === grievanceId);
  if (!grievance) return null;

  const [escalationReason, setEscalationReason] = React.useState('');
  const [newPriority, setNewPriority] = React.useState(grievance.priority);

  const handleSubmit = () => {
    if (!escalationReason) {
      alert('Please provide a reason for escalation');
      return;
    }
    onEscalate({ grievanceId, reason: escalationReason, newPriority });
    setEscalationReason('');
    onClose();
  };

  return (
    <div className="gr-modal-backdrop" data-testid={`school-modal-grievance-escalate-${grievanceId}`}>
      <div className="gr-modal">
        <div className="gr-modal__header">
          <h2 className="gr-modal__title">Escalate Grievance</h2>
          <button className="gr-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="gr-modal__body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Grievance: {grievance.id}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gr-muted)' }}>{grievance.title}</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <strong>Current Priority:</strong> {grievance.priority}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              New Priority <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="gr-form-select"
              data-testid="school-dropdown-escalate-priority"
              style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--gr-line)', borderRadius: '0.5rem' }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Escalation Reason <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Explain why this grievance needs to be escalated..."
              className="gr-form-textarea"
              data-testid="school-field-escalate-reason"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid var(--gr-line)',
                borderRadius: '0.5rem',
                minHeight: '100px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
        <div className="gr-modal__footer">
          <button
            className="gr-btn gr-btn--secondary"
            onClick={onClose}
            data-testid="school-button-modal-cancel"
          >
            Cancel
          </button>
          <button
            className="gr-btn gr-btn--warning"
            onClick={handleSubmit}
            data-testid="school-button-modal-escalate-submit"
          >
            Escalate Grievance
          </button>
        </div>
      </div>
    </div>
  );
};

const AddNoteModal = ({ isOpen, grievanceId, grievances, onClose, onAddNote }) => {
  if (!isOpen) return null;

  const grievance = grievances?.find((g) => g.id === grievanceId);
  if (!grievance) return null;

  const [noteText, setNoteText] = React.useState('');

  const handleSubmit = () => {
    if (!noteText.trim()) {
      alert('Please enter a note');
      return;
    }
    onAddNote({ grievanceId, note: noteText });
    setNoteText('');
    onClose();
  };

  return (
    <div className="gr-modal-backdrop" data-testid={`school-modal-grievance-note-${grievanceId}`}>
      <div className="gr-modal">
        <div className="gr-modal__header">
          <h2 className="gr-modal__title">Add Internal Note</h2>
          <button className="gr-modal__close" onClick={onClose} data-testid="school-button-modal-close">✕</button>
        </div>
        <div className="gr-modal__body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Grievance: {grievance.id}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gr-muted)' }}>{grievance.title}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
              Note <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add your internal note here..."
              className="gr-form-textarea"
              data-testid="school-field-note-text"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid var(--gr-line)',
                borderRadius: '0.5rem',
                minHeight: '150px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
        <div className="gr-modal__footer">
          <button
            className="gr-btn gr-btn--secondary"
            onClick={onClose}
            data-testid="school-button-modal-cancel"
          >
            Cancel
          </button>
          <button
            className="gr-btn gr-btn--success"
            onClick={handleSubmit}
            data-testid="school-button-modal-note-submit"
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Grievances - Unified Grievance Management System
 * Main page combining all grievance viewing, assignment, and resolution functionality
 */
export default function Grievances() {
  const [state, dispatch] = useReducer(grievancesReducer, initialState);
  const [openModals, setOpenModals] = React.useState({
    view: null,
    assign: null,
    reassign: null,
    escalate: null,
    note: null,
  });
  
  // Initialize grievances on mount
  useEffect(() => {
    dispatch({ type: 'SET_GRIEVANCES', payload: MOCK_GRIEVANCES });
  }, []);

  // Custom hooks for various operations
  const { showToast } = useGrievanceToast(dispatch);
  const { assignGrievance, escalateGrievance, resolveGrievance } = useGrievanceActions(dispatch);

  // Apply filters and sorting
  const { data: paginatedGrievances, total, totalPages } = useGrievanceFilters(
    state.grievances,
    state.filters,
    state.sort,
    state.currentPage,
    state.pageSize
  );

  // Filter handlers
  const handleSearchChange = useCallback((searchTerm) => {
    dispatch({ type: 'SET_FILTER_SEARCH', payload: searchTerm });
  }, []);

  const handleCategoryFilter = useCallback((category) => {
    dispatch({ type: 'SET_FILTER_CATEGORY', payload: category });
  }, []);

  const handlePriorityFilter = useCallback((priority) => {
    dispatch({ type: 'SET_FILTER_PRIORITY', payload: priority });
  }, []);

  const handleStatusFilter = useCallback((status) => {
    dispatch({ type: 'SET_FILTER_STATUS', payload: status });
  }, []);

  const handleAssignedToFilter = useCallback((assignedTo) => {
    dispatch({ type: 'SET_FILTER_ASSIGNED_TO', payload: assignedTo });
  }, []);

  const handleComplainantTypeFilter = useCallback((complainantType) => {
    dispatch({ type: 'SET_FILTER_COMPLAINANT_TYPE', payload: complainantType });
  }, []);

  const handleClearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Selection handlers for bulk operations
  const handleSelectGrievance = useCallback((grievanceId) => {
    dispatch({ type: 'TOGGLE_GRIEVANCE_SELECT', payload: grievanceId });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    dispatch({ type: 'SELECT_ALL_GRIEVANCES', payload: checked });
  }, []);

  const handleClearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  // Pagination handler
  const handlePageChange = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  // Modal handlers
  const openModal = useCallback((modalType, grievanceId) => {
    setOpenModals((prev) => ({ ...prev, [modalType]: grievanceId }));
  }, []);

  const closeModal = useCallback((modalType) => {
    setOpenModals((prev) => ({ ...prev, [modalType]: null }));
  }, []);

  // Action handlers
  const [expandedId, setExpandedId] = React.useState(null);

  const handleViewDetails = useCallback((grievanceId) => {
    setExpandedId((prev) => (prev === grievanceId ? null : grievanceId));
  }, []);

  const handleAssign = useCallback((grievanceId) => {
    const grievance = state.grievances.find((g) => g.id === grievanceId);
    if (grievance?.assignedTo) {
      openModal('reassign', grievanceId);
    } else {
      openModal('assign', grievanceId);
    }
  }, [state.grievances, openModal]);

  const handleEscalate = useCallback((grievanceId) => {
    openModal('escalate', grievanceId);
  }, [openModal]);

  const handleAddNote = useCallback((grievanceId) => {
    openModal('note', grievanceId);
  }, [openModal]);

  const handleAssignSubmit = useCallback(({ grievanceId, assignedTo, note }) => {
    dispatch({ type: 'UPDATE_GRIEVANCE', payload: { id: grievanceId, data: { assignedTo, status: 'Assigned' } } });
    if (note) {
      dispatch({
        type: 'ADD_INTERNAL_NOTE',
        payload: {
          grievanceId,
          note: { author: 'Admin', text: note, timestamp: new Date().toISOString() },
        },
      });
    }
    showToast(`Grievance assigned to ${assignedTo}`, 'success');
    closeModal('assign');
  }, [dispatch, showToast, closeModal]);

  const handleReassignSubmit = useCallback(({ grievanceId, assignedTo, note }) => {
    dispatch({ type: 'UPDATE_GRIEVANCE', payload: { id: grievanceId, data: { assignedTo } } });
    if (note) {
      dispatch({
        type: 'ADD_INTERNAL_NOTE',
        payload: {
          grievanceId,
          note: { author: 'Admin', text: `Reassigned: ${note}`, timestamp: new Date().toISOString() },
        },
      });
    }
    showToast(`Grievance reassigned to ${assignedTo}`, 'success');
    closeModal('reassign');
  }, [dispatch, showToast, closeModal]);

  const handleEscalateSubmit = useCallback(({ grievanceId, reason, newPriority }) => {
    dispatch({
      type: 'UPDATE_GRIEVANCE',
      payload: {
        id: grievanceId,
        data: { priority: newPriority, status: 'Escalated' },
      },
    });
    dispatch({
      type: 'ADD_INTERNAL_NOTE',
      payload: {
        grievanceId,
        note: { author: 'Admin', text: `Escalated: ${reason}`, timestamp: new Date().toISOString() },
      },
    });
    showToast('Grievance escalated', 'success');
    closeModal('escalate');
  }, [dispatch, showToast, closeModal]);

  const handleAddNoteSubmit = useCallback(({ grievanceId, note }) => {
    dispatch({
      type: 'ADD_INTERNAL_NOTE',
      payload: {
        grievanceId,
        note: { author: 'Admin', text: note, timestamp: new Date().toISOString() },
      },
    });
    showToast('Note added successfully', 'success');
    closeModal('note');
  }, [dispatch, showToast, closeModal]);

  const handleBulkAction = useCallback(() => {
    if (state.selectedGrievances.length === 0) {
      showToast('Please select grievances first', 'warning');
      return;
    }
    showToast('Bulk action feature coming soon', 'info');
  }, [state.selectedGrievances.length, showToast]);

  return (
    <div className="gr-root" data-testid="school-page-grievances">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Grievances' },
        ]}
        title="Grievance Management"
        subtitle="View, assign, and resolve grievances from students, parents, and staff members"
      />

      {/* Metrics Section */}
      <div className="gr-section">
        <GrievanceMetrics metrics={state.metrics} />
      </div>

      {/* Toolbar Section */}
      <div className="gr-section">
        <GrievanceToolbar
          filters={state.filters}
          onFilterChange={{
            search: handleSearchChange,
            category: handleCategoryFilter,
            priority: handlePriorityFilter,
            status: handleStatusFilter,
            assignedTo: handleAssignedToFilter,
            complainantType: handleComplainantTypeFilter,
          }}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Bulk Action Bar - Only show if grievances are selected */}
      {state.selectedGrievances.length > 0 && (
        <div className="gr-bulk-bar">
          <span className="gr-bulk-bar__count">
            {state.selectedGrievances.length} grievance(s) selected
          </span>
          <div className="gr-bulk-bar__actions">
            <button
              className="gr-btn gr-btn--sm gr-btn--secondary"
              onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
              data-testid="school-button-grievance-clear-selection"
            >
              Clear Selection
            </button>
            <button
              className="gr-btn gr-btn--sm gr-btn--primary"
              onClick={handleBulkAction}
              data-testid="school-button-grievance-bulk-action"
            >
              Bulk Actions
            </button>
          </div>
        </div>
      )}

      {/* Grievance Table */}
      <div className="gr-section">
        <GrievanceTable
          grievances={paginatedGrievances}
          expandedId={expandedId}
          onRowClick={handleViewDetails}
          onSelectGrievance={handleSelectGrievance}
          onSelectAll={handleSelectAll}
          selectedIds={state.selectedGrievances}
          onAssign={handleAssign}
          onEscalate={handleEscalate}
          data-testid="school-table-grievances"
        />

        {/* Case Count */}
        <div style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gr-muted)' }} data-testid="school-text-case-count">
          Showing <strong>{paginatedGrievances?.length || 0}</strong> of <strong>{total || 0}</strong> cases
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="gr-pagination">
            <button
              disabled={state.currentPage === 1}
              onClick={() => handlePageChange(state.currentPage - 1)}
              data-testid="school-button-pagination-prev"
            >
              Previous
            </button>
            <span>
              Page {state.currentPage} of {totalPages}
            </span>
            <button
              disabled={state.currentPage === totalPages}
              onClick={() => handlePageChange(state.currentPage + 1)}
              data-testid="school-button-pagination-next"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Details Drawer */}

      {/* Toast Notifications */}
      <Toast toast={state.toast} onClose={() => dispatch({ type: 'CLEAR_TOAST' })} />

      {/* Action Modals */}
      <AssignModal
        isOpen={openModals.assign !== null}
        grievanceId={openModals.assign}
        grievances={state.grievances}
        onClose={() => closeModal('assign')}
        onAssign={handleAssignSubmit}
      />

      <ReassignModal
        isOpen={openModals.reassign !== null}
        grievanceId={openModals.reassign}
        grievances={state.grievances}
        onClose={() => closeModal('reassign')}
        onReassign={handleReassignSubmit}
      />

      <EscalateModal
        isOpen={openModals.escalate !== null}
        grievanceId={openModals.escalate}
        grievances={state.grievances}
        onClose={() => closeModal('escalate')}
        onEscalate={handleEscalateSubmit}
      />

      <AddNoteModal
        isOpen={openModals.note !== null}
        grievanceId={openModals.note}
        grievances={state.grievances}
        onClose={() => closeModal('note')}
        onAddNote={handleAddNoteSubmit}
      />
    </div>
  );
}
