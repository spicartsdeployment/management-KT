import React from 'react';

/**
 * StatusBadge - Displays enrollment status with color coding
 * @param {string} status - 'pending' | 'approved' | 'rejected'
 */
const StatusBadge = ({ status = 'pending' }) => {
  const config = {
    pending:  { label: 'Pending',  bg: '#fef9c3', color: '#a16207', border: '#fde047' },
    approved: { label: 'Approved', bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    rejected: { label: 'Rejected', bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
  };

  const { label, bg, color, border } = config[status] || config.pending;

  return (
    <span
      className="sch-alu-enroll-status-badge"
      data-testid={`school-badge-status-${status}`}
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      {status === 'pending'  && '⏳ '}
      {status === 'approved' && '✅ '}
      {status === 'rejected' && '❌ '}
      {label}
    </span>
  );
};

export default StatusBadge;
