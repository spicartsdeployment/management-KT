import React from 'react';
import '../../Assets/styles/ViewComplaints.scss';

const summary = [
  { label: 'Open', value: 12, variant: 'open' },
  { label: 'In Progress', value: 7, variant: 'progress' },
  { label: 'Resolved', value: 43, variant: 'resolved' },
  { label: 'Total', value: 62, variant: 'total' },
];

const complaints = [
  { id: 'GRV001', student: 'Aarav Sharma', category: 'Academic', priority: 'High', status: 'open', date: '01 May 2026' },
  { id: 'GRV002', student: 'Priya Nair', category: 'Facilities', priority: 'Medium', status: 'progress', date: '28 Apr 2026' },
  { id: 'GRV003', student: 'Rohan Mehta', category: 'Transport', priority: 'Low', status: 'resolved', date: '25 Apr 2026' },
];

/**
 * ViewComplaints - view all submitted grievances and complaints
 */
export default function ViewComplaints() {
  return (
    <div className="view-complaints" data-testid="school-page-view-complaints">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="view-complaints__header-title">View Complaints</h1>
        <p className="view-complaints__header-desc">Review all submitted grievances and complaints</p>
      </div>

      <div className="view-complaints__summary-grid">
        {summary.map((s) => (
          <div key={s.label} className={`view-complaints__summary-card view-complaints__summary-card--${s.variant}`}>
            <div className="view-complaints__summary-content">
              <div>
                <p className="view-complaints__summary-label">{s.label}</p>
                <p className="view-complaints__summary-value">{s.value}</p>
              </div>
              <div className={`view-complaints__summary-icon view-complaints__summary-icon--${s.variant}`}>
                {s.variant === 'open' ? '🔴' : s.variant === 'progress' ? '⏳' : s.variant === 'resolved' ? '✅' : '📊'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="view-complaints__filters-card">
        <div className="view-complaints__filters-content">
          <div className="view-complaints__filters-grid">
            <div className="view-complaints__search">
              <span className="view-complaints__search-icon">🔍</span>
              <input placeholder="Search complaints..." style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-field-complaint-search" />
            </div>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-complaint-category"><option value="">All Categories</option></select>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-complaint-priority"><option value="">All Priorities</option></select>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-complaint-status"><option value="">All Status</option></select>
            <input type="date" style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-field-complaint-date" />
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['ID', 'Student', 'Category', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{c.student}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{c.category}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: c.priority === 'High' ? 'rgba(239,68,68,0.1)' : c.priority === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: c.priority === 'High' ? '#EF4444' : c.priority === 'Medium' ? '#F59E0B' : '#22C55E', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem' }}>{c.priority}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: c.status === 'open' ? 'rgba(239,68,68,0.1)' : c.status === 'progress' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', color: c.status === 'open' ? '#EF4444' : c.status === 'progress' ? '#F59E0B' : '#22C55E', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                    {c.status === 'progress' ? 'In Progress' : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#6B7280' }}>{c.date}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', border: '1px solid #4F46E5', borderRadius: '0.4rem', color: '#4F46E5', background: 'transparent', cursor: 'pointer' }} data-testid="school-button-complaint-view">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
