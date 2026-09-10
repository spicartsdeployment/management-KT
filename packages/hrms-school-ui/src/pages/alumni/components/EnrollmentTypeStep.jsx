import React from 'react';

/**
 * EnrollmentTypeStep - Step 1: Choose to enroll self or someone else
 * @param {string} selected - 'self' | 'other' | null
 * @param {function} onSelect - callback with type
 * @param {boolean} hasSelfEnrollment - whether user already enrolled themselves
 */
const EnrollmentTypeStep = ({ selected, onSelect, hasSelfEnrollment }) => {
  const options = [
    {
      type: 'self',
      icon: '🎓',
      tagline: 'My alumni journey',
      title: 'Enroll Myself',
      description: 'Jump in and rejoin your school roots!',
      disabled: hasSelfEnrollment,
      disabledNote: 'You have already enrolled yourself.',
    },
    {
      type: 'other',
      icon: '🤗',
      tagline: 'Nominate a friend',
      title: 'Enroll Someone I Know',
      description: 'Know someone awesome? Bring them along!',
      disabled: false,
      disabledNote: null,
    },
  ];

  return (
    <div className="sch-alu-enroll-step" data-testid="school-step-enrollment-type">
      <h3 className="sch-alu-enroll-step-title">Who are you enrolling? 🎉</h3>
      <p className="sch-alu-enroll-step-subtitle">Pick your path and let&#39;s make it happen!</p>

      <div className="sch-alu-enroll-type-cards">
        {options.map(({ type, icon, tagline, title, description, disabled, disabledNote }) => (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect(type)}
            className={`sch-alu-enroll-type-card sch-alu-enroll-type-card--${type}
              ${selected === type ? 'sch-alu-enroll-type-card--selected' : ''}
              ${disabled ? 'sch-alu-enroll-type-card--disabled' : ''}
            `}
            data-testid={`school-card-enroll-type-${type}`}
            aria-pressed={selected === type}
          >
            <span className="sch-alu-enroll-type-icon">{icon}</span>
            <span className="sch-alu-enroll-type-tagline">{tagline}</span>
            <span className="sch-alu-enroll-type-name">{title}</span>
            <span className="sch-alu-enroll-type-desc">
              {disabled && disabledNote ? disabledNote : description}
            </span>
            {selected === type && (
              <span className="sch-alu-enroll-type-check" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentTypeStep;
