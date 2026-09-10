import React from 'react';
import '../../Assets/styles/Contacts.scss';

const contacts = [
  { name: 'Mrs. Priya Sharma', role: 'Math Teacher', department: 'Academic', phone: '+91 98001 00001', email: 'priya@school.edu', type: 'Teacher' },
  { name: 'Mr. Anil Patel', role: 'Science Teacher', department: 'Academic', phone: '+91 98001 00002', email: 'anil@school.edu', type: 'Teacher' },
  { name: 'Mr. Suresh Kumar', role: 'Admin Staff', department: 'Administration', phone: '+91 98001 00003', email: 'suresh@school.edu', type: 'Admin' },
];

/**
 * Contacts - manage staff contact information
 */
export default function Contacts() {
  return (
    <div className="contacts" data-testid="school-page-contacts">
      <div className="contacts__header">
        <div>
          <h1 className="contacts__header-title">Contacts</h1>
          <p className="contacts__header-desc">Manage and update staff contact information</p>
        </div>
        <button className="contacts__add-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }} data-testid="school-button-contacts-add">+ Add Contact</button>
      </div>

      <div className="contacts__filters-card" style={{ padding: '1rem', background: '#fff', borderRadius: '1rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="contacts__filters-content">
          <div className="contacts__filters-grid">
            <div className="contacts__search">
              <span className="contacts__search-icon">🔍</span>
              <input placeholder="Search contacts..." style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-field-contacts-search" />
            </div>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-contacts-type"><option value="">All Types</option><option>Teacher</option><option>Admin</option></select>
            <select style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-contacts-dept"><option value="">All Departments</option><option>Academic</option><option>Administration</option></select>
          </div>
        </div>
      </div>

      <div className="contacts__grid">
        {contacts.map((c) => (
          <div key={c.email} style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(135deg,#C9A962,#2C2C2C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                {c.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{c.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{c.role}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>🏛 {c.department}</p>
              <p style={{ fontSize: '0.875rem' }}>📞 <a href={`tel:${c.phone}`} style={{ color: '#22C55E' }}>{c.phone}</a></p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>✉️ {c.email}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
              <button style={{ flex: 1, padding: '0.35rem', fontSize: '0.8rem', border: '1px solid #C9A962', borderRadius: '0.4rem', color: '#C9A962', background: 'transparent', cursor: 'pointer' }} data-testid="school-button-contact-edit">Edit</button>
              <button style={{ flex: 1, padding: '0.35rem', fontSize: '0.8rem', border: '1px solid #4F46E5', borderRadius: '0.4rem', color: '#4F46E5', background: 'transparent', cursor: 'pointer' }} data-testid="school-button-contact-view">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
