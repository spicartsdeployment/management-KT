import React from 'react';
import PropTypes from 'prop-types';

const STEPS = [
  { id: 1, label: 'Enrollment Type', emoji: '🎯' },
  { id: 2, label: 'Eligibility Check', emoji: '✅' },
  { id: 3, label: 'Alumni Details',   emoji: '🎓' },
];

const StepCircle = ({ isDone, isActive, emoji }) => (
  <div className={`sch-alu-enroll-stepper-circle ${isDone ? 'sch-alu-enroll-stepper-circle--done' : ''} ${isActive ? 'sch-alu-enroll-stepper-circle--active' : ''}`}>
    {isDone ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : isActive ? (
      <span className="sch-alu-enroll-stepper-emoji sch-alu-enroll-stepper-emoji--active">{emoji}</span>
    ) : (
      <span className="sch-alu-enroll-stepper-emoji sch-alu-enroll-stepper-emoji--pending">{emoji}</span>
    )}
  </div>
);
StepCircle.propTypes = { isDone: PropTypes.bool.isRequired, isActive: PropTypes.bool.isRequired, emoji: PropTypes.string.isRequired };

const StepItem = ({ step, isDone, isActive }) => (
  <div
    className={`sch-alu-enroll-stepper-step ${isDone ? 'sch-alu-enroll-stepper-step--done' : ''} ${isActive ? 'sch-alu-enroll-stepper-step--active' : ''}`}
    role="listitem"
    aria-current={isActive ? 'step' : undefined}
    data-testid={`school-step-indicator-${step.id}`}
  >
    <StepCircle isDone={isDone} isActive={isActive} emoji={step.emoji} />
    <span className={`sch-alu-enroll-stepper-label ${isDone ? 'sch-alu-enroll-stepper-label--done' : ''} ${isActive ? 'sch-alu-enroll-stepper-label--active' : ''}`}>
      {step.label}
    </span>
  </div>
);
StepItem.propTypes = {
  step: PropTypes.shape({ id: PropTypes.number, label: PropTypes.string, emoji: PropTypes.string }).isRequired,
  isDone: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

/**
 * EnrollmentStepper – Visual progress indicator for the 3-step wizard
 * @param {number} currentStep - 1 | 2 | 3
 */
const EnrollmentStepper = ({ currentStep }) => (
  <div className="sch-alu-enroll-stepper" data-testid="school-stepper-enrollment" role="list" aria-label="Enrollment steps">
    {STEPS.map((step, idx) => (
      <React.Fragment key={step.id}>
        <StepItem step={step} isDone={currentStep > step.id} isActive={currentStep === step.id} />
        {idx < STEPS.length - 1 && (
          <div className={`sch-alu-enroll-stepper-connector ${currentStep > step.id ? 'sch-alu-enroll-stepper-connector--done' : ''}`} aria-hidden="true" />
        )}
      </React.Fragment>
    ))}
  </div>
);
EnrollmentStepper.propTypes = { currentStep: PropTypes.number.isRequired };

export default EnrollmentStepper;
