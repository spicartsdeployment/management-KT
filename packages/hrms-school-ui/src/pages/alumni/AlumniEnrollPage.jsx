import React, { useState } from 'react';
import AlumniEnrollmentModal from './components/AlumniEnrollmentModal';
import '../../assets/scss/Alumni.scss';
import '../../assets/scss/AlumniEnrollStandalone.scss';

/**
 * AlumniEnrollPage – Public standalone page, no layout chrome.
 * Accessible at /alumni-enroll (top-level public route).
 * Opens in a new tab from the Join Alumni Network button.
 */
export default function AlumniEnrollPage() {
  const [done, setDone] = useState(false);

  return (
    <div className="alu-enroll-standalone" data-testid="school-page-alumni-enroll-standalone">
      {/* Minimal brand header */}
      <header className="alu-enroll-standalone__brand" aria-label="EduSpace HRMS">
        <div className="alu-enroll-standalone__brand-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <span className="alu-enroll-standalone__brand-name">EduSpace HRMS</span>
        <div className="alu-enroll-standalone__brand-sep" aria-hidden="true" />
        <span className="alu-enroll-standalone__brand-sub">Alumni Network</span>
      </header>

      <main className="alu-enroll-standalone__content">
        {done ? (
          <div className="alu-enroll-standalone__done" data-testid="school-panel-alumni-enroll-done">
            <div className="alu-enroll-standalone__done-icon" aria-hidden="true">🎓</div>
            <h2 className="alu-enroll-standalone__done-title">You&apos;re all set!</h2>
            <p className="alu-enroll-standalone__done-body">
              Your enrollment has been submitted. You can safely close this tab.
            </p>
            <button
              className="alu-enroll-standalone__done-btn"
              onClick={() => window.close()}
              data-testid="school-button-enroll-close-tab"
            >
              Close this tab
            </button>
          </div>
        ) : (
          <AlumniEnrollmentModal onCollapse={() => setDone(true)} />
        )}
      </main>
    </div>
  );
}
