import React from 'react';
import '../../Assets/styles/StaffDirectory.scss';

const staff = [
  { name: 'Mrs. Priya Sharma', role: 'Math Teacher', shift: 'Morning', email: 'priya@school.edu', phone: '+91 98001 00001', status: 'Active' },
  { name: 'Mr. Anil Patel', role: 'Science Teacher', shift: 'Morning', email: 'anil@school.edu', phone: '+91 98001 00002', status: 'Active' },
  { name: 'Ms. Kavya Nair', role: 'English Teacher', shift: 'Afternoon', email: 'kavya@school.edu', phone: '+91 98001 00003', status: 'Active' },
  { name: 'Mr. Suresh Kumar', role: 'Admin Staff', shift: 'Morning', email: 'suresh@school.edu', phone: '+91 98001 00004', status: 'On Leave' },
];

/**
 * StaffDirectory - browse and search all staff members
 */
export default function StaffDirectory() {
  return (
    <div className="staff-directory" data-testid="school-page-staff-directory">
      <div className="staff-directory__header">
        <div>
          <h1 className="staff-directory__header-title">Staff Directory</h1>
          <p className="staff-directory__header-desc">Browse and search all school staff members</p>
        </div>
        <button className="staff-directory__add-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }} data-testid="school-button-staff-add">+ Add Staff</button>
      </div>

      <div className="staff-directory__filters-card">
        <div className="staff-directory__filters-content">
          <div className="staff-directory__filters-grid">
            <div className="staff-directory__search">
              <span className="staff-directory__search-icon">🔍</span>
              <input placeholder="Search staff..." style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-field-staff-search" />
            </div>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-staff-role"><option value="">All Roles</option><option>Teacher</option><option>Admin</option></select>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-staff-shift"><option value="">All Shifts</option><option>Morning</option><option>Afternoon</option></select>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-staff-status"><option value="">All Status</option><option>Active</option><option>On Leave</option></select>
          </div>
        </div>
      </div>

      <div className="staff-directory__table-card" style={{ background: '#fff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['Name', 'Role', 'Shift', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.name} className="staff-directory__table-row">
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{s.role}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="staff-directory__shift-badge" style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem' }}>{s.shift}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: '#6B7280' }}>{s.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div className="staff-directory__contact">
                    <span className="staff-directory__phone-icon">📞</span>
                    <a href={`tel:${s.phone}`}>{s.phone}</a>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className={s.status === 'Active' ? 'staff-directory__status-badge' : undefined} style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem', background: s.status !== 'Active' ? 'rgba(245,158,11,0.1)' : undefined, color: s.status !== 'Active' ? '#F59E0B' : undefined }}>{s.status}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div className="staff-directory__actions">
                    <button style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', border: '1px solid #C9A962', borderRadius: '0.4rem', color: '#C9A962', background: 'transparent', cursor: 'pointer' }} data-testid="school-button-staff-edit">Edit</button>
                    <button style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', border: '1px solid #4F46E5', borderRadius: '0.4rem', color: '#4F46E5', background: 'transparent', cursor: 'pointer' }} data-testid="school-button-staff-view">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
