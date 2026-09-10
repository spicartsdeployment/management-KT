import React, { useState, useCallback, useMemo, useReducer } from 'react';
import '../../Assets/styles/Announcements.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  ANNOUNCEMENT_TYPES,
  PRIORITY_LEVELS,
  DELIVERY_CHANNELS,
  AUDIENCE_SEGMENTS,
  MOCK_PUBLISHED_ANNOUNCEMENTS,
  MOCK_SCHEDULED_ANNOUNCEMENTS,
  MOCK_DRAFT_ANNOUNCEMENTS,
} from './announcementsMockData';

// ========== STATE MANAGEMENT ==========
const announcementReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTER_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };
    case 'SET_FILTER_STATUS':
      return { ...state, filters: { ...state.filters, status: action.payload } };
    case 'SET_FILTER_TYPE':
      return { ...state, filters: { ...state.filters, type: action.payload } };
    case 'SET_FILTER_PRIORITY':
      return { ...state, filters: { ...state.filters, priority: action.payload } };
    case 'SET_FILTER_AUDIENCE':
      return { ...state, filters: { ...state.filters, audience: action.payload } };
    case 'SET_FILTER_DATE_RANGE':
      return { ...state, filters: { ...state.filters, dateRange: action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: { search: '', status: null, type: null, priority: null, audience: null, dateRange: null } };
    case 'SET_SORT':
      return { ...state, sort: { field: action.payload.field, order: action.payload.order } };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SELECTED_ANNOUNCEMENTS':
      return { ...state, selectedAnnouncements: action.payload };
    case 'SET_MODAL':
      return { ...state, modal: { type: action.payload.type, data: action.payload.data } };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'UPDATE_ANNOUNCEMENT':
      return { ...state, announcements: state.announcements.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ANNOUNCEMENT':
      return { ...state, announcements: state.announcements.filter(a => a.id !== action.payload) };
    case 'ARCHIVE_ANNOUNCEMENT':
      return { ...state, announcements: state.announcements.map(a => a.id === action.payload ? { ...a, status: 'archived' } : a) };
    default:
      return state;
  }
};

const initialState = {
  announcements: [...MOCK_PUBLISHED_ANNOUNCEMENTS, ...MOCK_SCHEDULED_ANNOUNCEMENTS, ...MOCK_DRAFT_ANNOUNCEMENTS],
  filters: { search: '', status: null, type: null, priority: null, audience: null, dateRange: null },
  sort: { field: 'createdDate', order: 'desc' },
  currentPage: 1,
  selectedAnnouncements: [],
  modal: null,
  toast: null,
  loading: false,
  error: null,
};

// ========== HELPER FUNCTIONS ==========
const getTypeConfig = (typeId) => ANNOUNCEMENT_TYPES.find(t => t.id === typeId) || {};
const getPriorityConfig = (priorityId) => PRIORITY_LEVELS.find(p => p.id === priorityId) || {};
const getStatusColor = (status) => {
  const colors = {
    published: '#16a34a',
    scheduled: '#2563eb',
    draft: '#6b7280',
    expired: '#dc2626',
    archived: '#9ca3af',
    failed: '#dc2626',
  };
  return colors[status] || '#6b7280';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const calculateReadRate = (announcement) => {
  if (!announcement.views || announcement.views === 0) return 0;
  return Math.round((announcement.views / announcement.totalRecipients) * 100) || 0;
};

// ========== UI COMPONENTS ==========
const Toast = ({ message, type = 'success' }) => (
  <div className={`an-toast an-toast--${type}`} data-testid="school-toast-announcement">
    {type === 'success' && '✓ '}
    {type === 'error' && '✕ '}
    {type === 'warning' && '⚠ '}
    {message}
  </div>);
// ========== ACTION MODALS ==========
const EditAnnouncementModal = ({ announcement, onClose, onConfirm, dispatch }) => {
  const [title, setTitle] = useState(announcement.title);
  const [summary, setSummary] = useState(announcement.summary);

  const handleConfirm = () => {
    dispatch({ type: 'UPDATE_ANNOUNCEMENT', payload: { ...announcement, title, summary } });
    dispatch({ type: 'SET_TOAST', payload: { message: 'Announcement updated successfully!', type: 'success' } });
    onClose();
  };

  return (
    <>
      <div className="an-modal-backdrop" onClick={onClose} />
      <div className="an-modal" data-testid="school-modal-edit-announcement">
        <div className="an-modal__header">
          <h2 className="an-modal__title">Edit Announcement</h2>
          <button className="an-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="an-modal__body">
          <div className="an-field an-field--spaced">
            <label className="an-field__label">Title</label>
            <input
              className="an-field__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="school-input-edit-title"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label">Summary</label>
            <textarea
              className="an-field__textarea"
              rows="4"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              data-testid="school-input-edit-summary"
            />
          </div>
        </div>
        <div className="an-modal__footer">
          <button className="an-btn an-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="an-btn an-btn--primary" onClick={handleConfirm} data-testid="school-button-confirm">Save Changes</button>
        </div>
      </div>
    </>
  );
};

const DeleteAnnouncementModal = ({ announcement, onClose, onConfirm, dispatch }) => {
  return (
    <>
      <div className="an-modal-backdrop" onClick={onClose} />
      <div className="an-modal" data-testid="school-modal-delete-announcement">
        <div className="an-modal__header">
          <h2 className="an-modal__title">Delete Announcement</h2>
          <button className="an-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="an-modal__body">
          <p className="an-text--muted">
            Are you sure you want to delete <strong>{announcement.title}</strong>? This action cannot be undone.
          </p>
          <div className="an-warning-box">
            <span>⚠️</span>
            <div>
              <strong>Warning:</strong> This announcement has been sent to {announcement.totalRecipients} recipients. Deleting it will remove all records.
            </div>
          </div>
        </div>
        <div className="an-modal__footer">
          <button className="an-btn an-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="an-btn an-btn--danger" onClick={onConfirm} data-testid="school-button-confirm">Delete</button>
        </div>
      </div>
    </>
  );
};

const ArchiveAnnouncementModal = ({ announcement, onClose, onConfirm, dispatch }) => {
  return (
    <>
      <div className="an-modal-backdrop" onClick={onClose} />
      <div className="an-modal" data-testid="school-modal-archive-announcement">
        <div className="an-modal__header">
          <h2 className="an-modal__title">Archive Announcement</h2>
          <button className="an-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="an-modal__body">
          <p>Archive <strong>{announcement.title}</strong>? It will remain in records but be hidden from active list.</p>
        </div>
        <div className="an-modal__footer">
          <button className="an-btn an-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="an-btn an-btn--primary" onClick={onConfirm} data-testid="school-button-confirm">Archive</button>
        </div>
      </div>
    </>
  );
};

// ========== MAIN COMPONENT ==========
export default function Announcements() {
  const [state, dispatch] = useReducer(announcementReducer, initialState);

  // Filter & Sort
  const filteredAnnouncements = useMemo(() => {
    let result = state.announcements.filter(a => {
      if (state.filters.search && !a.title.toLowerCase().includes(state.filters.search.toLowerCase())) return false;
      if (state.filters.status && a.status !== state.filters.status) return false;
      if (state.filters.type && a.category !== state.filters.type) return false;
      if (state.filters.priority && a.priority !== state.filters.priority) return false;
      return true;
    });

    result.sort((a, b) => {
      const aVal = a[state.sort.field];
      const bVal = b[state.sort.field];
      if (aVal < bVal) return state.sort.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return state.sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [state.announcements, state.filters, state.sort]);

  const pageSize = 10;
  const paginatedAnnouncements = useMemo(
    () => filteredAnnouncements.slice((state.currentPage - 1) * pageSize, state.currentPage * pageSize),
    [filteredAnnouncements, state.currentPage]
  );

  // Metrics
  const metrics = useMemo(() => {
    const published = state.announcements.filter(a => a.status === 'published').length;
    const scheduled = state.announcements.filter(a => a.status === 'scheduled').length;
    const drafts = state.announcements.filter(a => a.status === 'draft').length;
    const avgReadRate = Math.round(
      state.announcements.filter(a => a.status === 'published').reduce((acc, a) => acc + calculateReadRate(a), 0) /
      Math.max(published, 1)
    );
    const failedDeliveries = state.announcements.filter(a => a.status === 'failed').length;

    return { total: state.announcements.length, published, scheduled, drafts, avgReadRate, failedDeliveries };
  }, [state.announcements]);

  // Handlers
  const showToast = useCallback((message, type = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, type } });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 3000);
  }, []);

  const handleSort = useCallback((field) => {
    if (state.sort.field === field) {
      dispatch({ type: 'SET_SORT', payload: { field, order: state.sort.order === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_SORT', payload: { field, order: 'desc' } });
    }
  }, [state.sort]);

  const toggleSelectAll = useCallback(() => {
    if (state.selectedAnnouncements.length === paginatedAnnouncements.length) {
      dispatch({ type: 'SET_SELECTED_ANNOUNCEMENTS', payload: [] });
    } else {
      dispatch({ type: 'SET_SELECTED_ANNOUNCEMENTS', payload: paginatedAnnouncements.map(a => a.id) });
    }
  }, [state.selectedAnnouncements, paginatedAnnouncements]);

  const toggleSelectAnnouncement = useCallback((id) => {
    dispatch({
      type: 'SET_SELECTED_ANNOUNCEMENTS',
      payload: state.selectedAnnouncements.includes(id)
        ? state.selectedAnnouncements.filter(s => s !== id)
        : [...state.selectedAnnouncements, id],
    });
  }, [state.selectedAnnouncements]);

  return (
    <div className="an-root" data-testid="school-page-announcements-management">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Communications" },
          { label: "Manage Announcements" },
        ]}
        title="Manage Announcements"
        subtitle="Track, manage, and monitor all school communications and announcements"
        actions={(
          <button
            className="an-btn an-btn--primary"
            onClick={() => window.location.href = '/management/announcements/create'}
            data-testid="school-button-create-announcement"
          >
            + Create Announcement
          </button>
        )}
      />

      {/* Metrics Grid */}
      <div className="an-metrics-grid" data-testid="school-metrics-grid">
        <div className="an-metric-card" data-testid="school-metric-total-announcements">
          <div className="an-metric-card__icon">📢</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.total}</div>
            <div className="an-metric-card__label">Total Announcements</div>
          </div>
        </div>
        <div className="an-metric-card" data-testid="school-metric-published">
          <div className="an-metric-card__icon">✓</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.published}</div>
            <div className="an-metric-card__label">Published</div>
          </div>
        </div>
        <div className="an-metric-card" data-testid="school-metric-scheduled">
          <div className="an-metric-card__icon">📅</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.scheduled}</div>
            <div className="an-metric-card__label">Scheduled</div>
          </div>
        </div>
        <div className="an-metric-card" data-testid="school-metric-drafts">
          <div className="an-metric-card__icon">📝</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.drafts}</div>
            <div className="an-metric-card__label">Drafts</div>
          </div>
        </div>
        <div className="an-metric-card" data-testid="school-metric-read-rate">
          <div className="an-metric-card__icon">👁️</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.avgReadRate}%</div>
            <div className="an-metric-card__label">Avg Read Rate</div>
          </div>
        </div>
        <div className="an-metric-card" data-testid="school-metric-failed">
          <div className="an-metric-card__icon">⚠️</div>
          <div className="an-metric-card__content">
            <div className="an-metric-card__value">{metrics.failedDeliveries}</div>
            <div className="an-metric-card__label">Failed Deliveries</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="an-toolbar" data-testid="school-toolbar-announcements">
        <div className="an-toolbar__search">
          <input
            type="text"
            placeholder="Search announcements..."
            value={state.filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTER_SEARCH', payload: e.target.value })}
            className="an-toolbar__input"
            data-testid="school-input-search-announcements"
          />
        </div>

        <div className="an-toolbar__filters">
          <select
            value={state.filters.status || ''}
            onChange={(e) => dispatch({ type: 'SET_FILTER_STATUS', payload: e.target.value || null })}
            className="an-toolbar__select"
            data-testid="school-select-status-filter"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Drafts</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={state.filters.type || ''}
            onChange={(e) => dispatch({ type: 'SET_FILTER_TYPE', payload: e.target.value || null })}
            className="an-toolbar__select"
            data-testid="school-select-type-filter"
          >
            <option value="">All Types</option>
            {ANNOUNCEMENT_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          <select
            value={state.filters.priority || ''}
            onChange={(e) => dispatch({ type: 'SET_FILTER_PRIORITY', payload: e.target.value || null })}
            className="an-toolbar__select"
            data-testid="school-select-priority-filter"
          >
            <option value="">All Priority</option>
            {PRIORITY_LEVELS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {Object.values(state.filters).some(f => f !== null && f !== '') && (
          <button
            className="an-btn an-btn--ghost an-btn--sm"
            onClick={() => dispatch({ type: 'CLEAR_FILTERS', payload: null })}
            data-testid="school-button-clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {state.selectedAnnouncements.length > 0 && (
        <div className="an-bulk-actions" data-testid="school-bulk-actions">
          <span>{state.selectedAnnouncements.length} selected</span>
          <div className="an-flex-row-gap-sm">
            <button
              className="an-btn an-btn--sm an-btn--primary"
              onClick={() => showToast('Publish action not implemented yet', 'warning')}
              data-testid="school-button-bulk-publish"
            >
              Publish
            </button>
            <button
              className="an-btn an-btn--sm an-btn--ghost"
              onClick={() => showToast('Archive action not implemented yet', 'warning')}
              data-testid="school-button-bulk-archive"
            >
              Archive
            </button>
            <button
              className="an-btn an-btn--sm an-btn--danger"
              onClick={() => showToast('Delete action not implemented yet', 'warning')}
              data-testid="school-button-bulk-delete"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="an-table-container" data-testid="school-table-announcements">
        <table className="an-table">
          <thead>
            <tr>
              <th className="an-table__cell-width-sm">
                <input
                  type="checkbox"
                  checked={state.selectedAnnouncements.length === paginatedAnnouncements.length && paginatedAnnouncements.length > 0}
                  onChange={toggleSelectAll}
                  data-testid="school-checkbox-select-all"
                />
              </th>
              <th onClick={() => handleSort('title')} className="an-table__header-sortable" data-testid="school-header-title">
                Title {state.sort.field === 'title' && (state.sort.order === 'asc' ? '↑' : '↓')}
              </th>
              <th data-testid="school-header-category">Category</th>
              <th data-testid="school-header-status">Status</th>
              <th data-testid="school-header-priority">Priority</th>
              <th data-testid="school-header-audience">Audience</th>
              <th data-testid="school-header-created">Created By</th>
              <th data-testid="school-header-publish-date">Publish Date</th>
              <th data-testid="school-header-read-rate">Read Rate</th>
              <th className="an-table__cell-width-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAnnouncements.map(announcement => (
              <tr key={announcement.id} className="an-table__row" data-testid={`school-row-announcement-${announcement.id}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={state.selectedAnnouncements.includes(announcement.id)}
                    onChange={() => toggleSelectAnnouncement(announcement.id)}
                    data-testid={`school-checkbox-announcement-${announcement.id}`}
                  />
                </td>
                <td className="an-table__cell-title">{announcement.title}</td>
                <td>
                  <span className="an-category-chip">{getTypeConfig(announcement.category).icon} {getTypeConfig(announcement.category).label}</span>
                </td>
                <td>
                  <span
                    className="an-status-chip--dynamic"
                    data-testid={`school-chip-status-${announcement.status}`}
                    style={{ backgroundColor: `${getStatusColor(announcement.status)}20`, color: getStatusColor(announcement.status) }}
                  >
                    {announcement.status}
                  </span>
                </td>
                <td>
                  <span className={`an-priority-badge an-priority-badge--${announcement.priority}`} data-testid={`school-badge-priority-${announcement.priority}`}>
                    {getPriorityConfig(announcement.priority).icon} {getPriorityConfig(announcement.priority).label}
                  </span>
                </td>
                <td>{announcement.totalRecipients}</td>
                <td>{announcement.createdBy}</td>
                <td>{formatDate(announcement.publishDate)}</td>
                <td>
                  <div className="an-read-rate-bar">
                    <div className="an-read-rate-bar--dynamic" style={{ width: `${calculateReadRate(announcement)}%` }} />
                    <span className="an-read-rate-bar__text">{calculateReadRate(announcement)}%</span>
                  </div>
                </td>
                <td className="an-table__actions">
                  <button
                    className="an-btn an-btn--ghost an-btn--sm"
                    onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'edit', data: announcement } })}
                    title="Edit"
                    data-testid="school-button-action-edit"
                  >
                    ✎
                  </button>
                  <button
                    className="an-btn an-btn--ghost an-btn--sm"
                    onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'duplicate', data: announcement } })}
                    title="Duplicate"
                    data-testid="school-button-action-duplicate"
                  >
                    ⊕
                  </button>
                  <button
                    className="an-btn an-btn--ghost an-btn--sm"
                    onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'archive', data: announcement } })}
                    title="Archive"
                    data-testid="school-button-action-archive"
                  >
                    📋
                  </button>
                  <button
                    className="an-btn an-btn--ghost an-btn--sm"
                    onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'delete', data: announcement } })}
                    title="Delete"
                    data-testid="school-button-action-delete"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="an-pagination" data-testid="school-pagination">
        <button
          className="an-btn an-btn--sm an-btn--ghost"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: state.currentPage - 1 })}
          disabled={state.currentPage === 1}
          data-testid="school-button-prev-page"
        >
          ← Previous
        </button>
        <span>Page {state.currentPage} of {Math.ceil(filteredAnnouncements.length / pageSize)}</span>
        <button
          className="an-btn an-btn--sm an-btn--ghost"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: state.currentPage + 1 })}
          disabled={state.currentPage >= Math.ceil(filteredAnnouncements.length / pageSize)}
          data-testid="school-button-next-page"
        >
          Next →
        </button>
      </div>

      {/* Analytics Section */}
      <div className="an-analytics-section" data-testid="school-section-analytics">
        <h3 className="an-section__title">📊 Engagement Analytics</h3>
        <div className="an-analytics-grid">
          <div className="an-analytics-card">
            <div className="an-analytics-card__label">Total Views</div>
            <div className="an-analytics-card__value">{state.announcements.reduce((acc, a) => acc + (a.views || 0), 0)}</div>
          </div>
          <div className="an-analytics-card">
            <div className="an-analytics-card__label">Avg Read Rate</div>
            <div className="an-analytics-card__value">{metrics.avgReadRate}%</div>
          </div>
          <div className="an-analytics-card">
            <div className="an-analytics-card__label">Total Clicks</div>
            <div className="an-analytics-card__value">{state.announcements.reduce((acc, a) => acc + (a.clicks || 0), 0)}</div>
          </div>
          <div className="an-analytics-card">
            <div className="an-analytics-card__label">Delivery Success</div>
            <div className="an-analytics-card__value">{Math.round((state.announcements.filter(a => a.status !== 'failed').length / state.announcements.length) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Scheduled Queue */}
      <div className="an-scheduled-section" data-testid="school-section-scheduled">
        <h3 className="an-section__title">📅 Scheduled Queue</h3>
        <div className="an-scheduled-list">
          {state.announcements.filter(a => a.status === 'scheduled').slice(0, 5).map(ann => (
            <div key={ann.id} className="an-scheduled-item" data-testid={`school-item-scheduled-${ann.id}`}>
              <div className="an-scheduled-item__info">
                <div className="an-scheduled-item__title">{ann.title}</div>
                <div className="an-scheduled-item__date">Scheduled for {formatDate(ann.scheduledDate)}</div>
              </div>
              <span className="an-status-chip--dynamic" style={{ backgroundColor: '#2563eb20', color: '#2563eb' }}>{ann.status}</span>
            </div>
          ))}
          {state.announcements.filter(a => a.status === 'scheduled').length === 0 && (
            <p className="an-text-muted">No scheduled announcements</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {state.modal?.type === 'edit' && (
        <EditAnnouncementModal
          announcement={state.modal.data}
          onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
          onConfirm={() => {
            dispatch({ type: 'SET_MODAL', payload: null });
            showToast('Announcement updated!', 'success');
          }}
          dispatch={dispatch}
        />
      )}
      {state.modal?.type === 'delete' && (
        <DeleteAnnouncementModal
          announcement={state.modal.data}
          onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
          onConfirm={() => {
            dispatch({ type: 'DELETE_ANNOUNCEMENT', payload: state.modal.data.id });
            dispatch({ type: 'SET_MODAL', payload: null });
            showToast('Announcement deleted!', 'success');
          }}
          dispatch={dispatch}
        />
      )}
      {state.modal?.type === 'archive' && (
        <ArchiveAnnouncementModal
          announcement={state.modal.data}
          onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
          onConfirm={() => {
            dispatch({ type: 'ARCHIVE_ANNOUNCEMENT', payload: state.modal.data.id });
            dispatch({ type: 'SET_MODAL', payload: null });
            showToast('Announcement archived!', 'success');
          }}
          dispatch={dispatch}
        />
      )}
      {state.modal?.type === 'duplicate' && (
        <>
          <div className="an-modal-backdrop" onClick={() => dispatch({ type: 'SET_MODAL', payload: null })} />
          <div className="an-modal" data-testid="school-modal-duplicate-announcement">
            <div className="an-modal__header">
              <h2 className="an-modal__title">Duplicate Announcement</h2>
              <button className="an-modal__close" onClick={() => dispatch({ type: 'SET_MODAL', payload: null })}>×</button>
            </div>
            <div className="an-modal__body">
              <p>Duplicate <strong>{state.modal.data.title}</strong>? The copy will be saved as a draft.</p>
            </div>
            <div className="an-modal__footer">
              <button className="an-btn an-btn--ghost" onClick={() => dispatch({ type: 'SET_MODAL', payload: null })}>Cancel</button>
              <button
                className="an-btn an-btn--primary"
                onClick={() => {
                  const newAnnouncement = {
                    ...state.modal.data,
                    id: Date.now(),
                    title: `${state.modal.data.title} (Copy)`,
                    status: 'draft',
                    createdDate: new Date(),
                  };
                  dispatch({ type: 'UPDATE_ANNOUNCEMENT', payload: newAnnouncement });
                  dispatch({ type: 'SET_MODAL', payload: null });
                  showToast('Announcement duplicated!', 'success');
                }}
                data-testid="school-button-confirm"
              >
                Duplicate
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {state.toast && <Toast message={state.toast.message} type={state.toast.type} />}
    </div>
  );
}
