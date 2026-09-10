import React from 'react';
import '../../Assets/styles/LeavePolicy.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';

const policies = [
  { role: 'Teacher', type: 'Casual Leave', days: 12, paid: true, carryover: true, period: 'Jan - Dec' },
  { role: 'Teacher', type: 'Medical Leave', days: 15, paid: true, carryover: false, period: 'Jan - Dec' },
  { role: 'Admin Staff', type: 'Casual Leave', days: 10, paid: true, carryover: true, period: 'Jan - Dec' },
  { role: 'Admin Staff', type: 'Unpaid Leave', days: 30, paid: false, carryover: false, period: 'Jan - Dec' },
  { role: 'Support Staff', type: 'Annual Leave', days: 20, paid: true, carryover: true, period: 'Jan - Dec' },
];

/**
 * LeavePolicy - view and configure staff leave policies
 */
export default function LeavePolicy() {
  return (
    <div className="leave-policy" data-testid="school-page-leave-policy">
      <ManagementPageHeader
        breadcrumbs={[
          { label: "Management" },
          { label: "Policies" },
          { label: "Leave Policy" },
        ]}
        title="Leave Policy"
        subtitle="Configure and manage staff leave entitlements and policies"
        actions={(
          <button className="leave-policy__add-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }} data-testid="school-button-policy-add">+ Add Policy</button>
        )}
      />

      <div className="leave-policy__table-card" style={{ background: '#fff', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {['Role', 'Leave Type', 'Days Allowed', 'Paid', 'Carry Over', 'Valid Period', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6B7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policies.map((p, i) => (
              <tr key={i} className="leave-policy__table-row">
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="leave-policy__role-badge" style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem' }}>{p.role}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{p.type}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="leave-policy__days-badge" style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem' }}>{p.days} days</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <span className={p.paid ? 'leave-policy__paid-badge' : 'leave-policy__unpaid-badge'} style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem' }}>{p.paid ? 'Paid' : 'Unpaid'}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <span className={p.carryover ? 'leave-policy__icon-true' : 'leave-policy__icon-false'}>
                    {p.carryover ? '✅' : '❌'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="leave-policy__valid-period">{p.period}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="leave-policy__edit-btn" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderRadius: '0.4rem', cursor: 'pointer', background: 'transparent' }} data-testid="school-button-policy-edit">Edit</button>
                    <button className="leave-policy__delete-btn" style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem', borderRadius: '0.4rem', cursor: 'pointer', background: 'transparent' }} data-testid="school-button-policy-delete">Delete</button>
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
