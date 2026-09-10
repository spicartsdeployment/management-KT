import React from 'react';

/**
 * @param {object} props
 * @param {function} props.onMarkAllPresent
 * @param {function} props.onMarkAllAbsent
 */
const QuickActions = ({ onMarkAllPresent, onMarkAllAbsent }) => (
  <div className="lc-quick-actions" data-testid="teacher-live-quick-actions">
    <span className="lc-quick-actions__label">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
      QUICK ACTIONS
    </span>
    <div className="lc-quick-actions__btns">
      <button
        className="lc-quick-actions__btn lc-quick-actions__btn--present"
        onClick={onMarkAllPresent}
        data-testid="teacher-live-mark-all-present"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Mark All Present
      </button>
      <button
        className="lc-quick-actions__btn lc-quick-actions__btn--absent"
        onClick={onMarkAllAbsent}
        data-testid="teacher-live-mark-all-absent"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        Mark All Absent
      </button>
    </div>
  </div>
);

export default QuickActions;
