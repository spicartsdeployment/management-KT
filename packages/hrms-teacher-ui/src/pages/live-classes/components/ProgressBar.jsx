import React from 'react';

/**
 * @param {object} props
 * @param {number} props.present
 * @param {number} props.total
 * @param {function} props.onSubmit
 */
const ProgressBar = ({ present, total, onSubmit }) => {
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="lc-progress-bar-row" data-testid="teacher-live-progress-bar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" className="lc-progress-bar-row__icon" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <span className="lc-progress-bar-row__label">CLASS PROGRESS</span>
      <div className="lc-progress-bar-row__bar">
        <div
          className="lc-progress-bar-row__fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% attendance`}
        />
      </div>
      <span className="lc-progress-bar-row__count">{present} / {total} Present</span>
      <button
        className="lc-progress-bar-row__submit"
        onClick={onSubmit}
        data-testid="teacher-live-submit-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        Save &amp; Submit Class Data
      </button>
    </div>
  );
};

export default ProgressBar;
