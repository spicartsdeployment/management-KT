import React from 'react';
import PropTypes from 'prop-types';
import EnrolledAlumniCard from './EnrolledAlumniCard';

const EmptyState = () => (
  <div className="sch-alu-enroll-empty" data-testid="school-container-enrollments-empty">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
    <p className="sch-alu-enroll-empty-title">No Enrollments Yet</p>
    <p className="sch-alu-enroll-empty-desc">Complete the onboarding above to submit your first alumni enrollment.</p>
  </div>
);

const CountBadges = ({ counts, total }) => (
  <div className="sch-alu-enroll-list-counts">
    <span className="sch-alu-enroll-count-badge sch-alu-enroll-count-badge--total">{total} Total</span>
    {counts.pending  && <span className="sch-alu-enroll-count-badge sch-alu-enroll-count-badge--pending">{counts.pending} Pending</span>}
    {counts.approved && <span className="sch-alu-enroll-count-badge sch-alu-enroll-count-badge--approved">{counts.approved} Approved</span>}
    {counts.rejected && <span className="sch-alu-enroll-count-badge sch-alu-enroll-count-badge--rejected">{counts.rejected} Rejected</span>}
  </div>
);
CountBadges.propTypes = { counts: PropTypes.object.isRequired, total: PropTypes.number.isRequired };

/**
 * EnrolledAlumniList – Dashboard showing all submitted enrollments
 * @param {Array} enrollments - list of enrollment records
 * @param {function} onEdit - edit callback
 * @param {function} onDelete - delete callback
 */
const EnrolledAlumniList = ({ enrollments, onEdit, onDelete }) => {
  if (enrollments.length === 0) return <EmptyState />;
  const counts = enrollments.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="sch-alu-enroll-list-section" data-testid="school-container-enrollments-list">
      <div className="sch-alu-enroll-list-header">
        <h3 className="sch-alu-enroll-list-title">My Enrollments</h3>
        <CountBadges counts={counts} total={enrollments.length} />
      </div>
      <div className="sch-alu-enroll-cards-grid">
        {enrollments.map((enrollment, idx) => (
          <EnrolledAlumniCard key={enrollment.studentId || idx} alumni={enrollment} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
EnrolledAlumniList.propTypes = {
  enrollments: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
EnrolledAlumniList.defaultProps = { enrollments: [] };

export default EnrolledAlumniList;

