import React from 'react';
import '../../Assets/styles/AssignResolve.scss';

/**
 * AssignResolve - assign grievances to staff and track resolution
 */
export default function AssignResolve() {
  return (
    <div className="assign-resolve" data-testid="school-page-assign-resolve">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="assign-resolve__header-title">Assign &amp; Resolve</h1>
        <p className="assign-resolve__header-desc">Assign grievances to staff members and track resolution progress</p>
      </div>

      <div className="assign-resolve__main-grid">
        <div className="assign-resolve__details-col">
          <div className="assign-resolve__card" style={{ padding: '1.5rem', background: '#fff' }}>
            <div className="assign-resolve__card-header" style={{ paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div className="assign-resolve__card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>GRV001 - Academic Complaint</span>
                <span className="assign-resolve__priority-badge assign-resolve__priority-badge--high" style={{ padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem' }}>High</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              {[['Student', 'Aarav Sharma'], ['Class', 'Class 10-A'], ['Category', 'Academic'], ['Date', '01 May 2026']].map(([label, val]) => (
                <div key={label}>
                  <p className="assign-resolve__info-label">{label}</p>
                  <p className="assign-resolve__info-value">{val}</p>
                </div>
              ))}
            </div>
            <div className="assign-resolve__desc-box">
              <p style={{ fontSize: '0.875rem', color: '#374151' }}>The student reports difficulty understanding the Mathematics curriculum, particularly in Algebra and Calculus sections. Requesting additional support sessions.</p>
            </div>
          </div>

          <div className="assign-resolve__comments-card" style={{ padding: '1.5rem', background: '#fff' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Comments &amp; Activity</h3>
            <div className="assign-resolve__comment">
              <div className="assign-resolve__comment-header">
                <div className="assign-resolve__comment-user">👤 Principal Sharma</div>
                <span className="assign-resolve__comment-date" style={{ fontSize: '0.8rem', color: '#6B7280' }}>01 May 2026, 10:30 AM</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#374151' }}>Assigned to Math Department Head for follow-up.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="assign-resolve__card" style={{ padding: '1.5rem', background: '#fff' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Assign To</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <select style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-assign-staff"><option value="">Select Staff Member</option><option>Math Dept Head</option><option>Principal</option></select>
              <select style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-assign-status"><option value="open">Open</option><option value="progress">In Progress</option><option value="resolved">Resolved</option></select>
              <input type="date" style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-field-assign-deadline" />
              <button style={{ background: 'linear-gradient(90deg,#C9A962,#2C2C2C)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }} data-testid="school-button-assign-submit">Assign &amp; Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
