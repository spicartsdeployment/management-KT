import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1970;
const REQUIRED_YEARS_SINCE_PASSING = 5;

const EligibilityResult = ({ eligible, passingYear }) => {
  if (eligible === null) return null;
  const yearsAgo = CURRENT_YEAR - parseInt(passingYear, 10);
  if (!eligible) return (
    <div className="sch-alu-enroll-alert sch-alu-enroll-alert--warning" data-testid="school-alert-not-eligible" role="alert">
      <span className="sch-alu-enroll-alert-emoji" aria-hidden="true">😕</span>
      <div>
        <strong>Not quite yet!</strong>
        <p>You need at least <strong>{REQUIRED_YEARS_SINCE_PASSING} years</strong> since passing 10th class. Keep in touch — you&apos;ll be eligible soon!</p>
      </div>
    </div>
  );
  return (
    <div className="sch-alu-enroll-alert sch-alu-enroll-alert--success" data-testid="school-alert-eligible" role="alert">
      <span className="sch-alu-enroll-alert-emoji" aria-hidden="true">🎉</span>
      <div>
        <strong>Woohoo! You&apos;re eligible!</strong>
        <p>That&apos;s {yearsAgo} year{yearsAgo !== 1 ? 's' : ''} of experiences. Let&apos;s get you enrolled!</p>
      </div>
    </div>
  );
};
EligibilityResult.propTypes = { eligible: PropTypes.bool, passingYear: PropTypes.string.isRequired };
EligibilityResult.defaultProps = { eligible: null };

const YearInput = ({ value, onChange }) => (
  <div className="sch-alu-enroll-eligibility-box">
    <div className="sch-alu-enroll-field-group">
      <label htmlFor="alu-passing-year" className="sch-alu-enroll-label">
        🏫 Year of Passing (10th Class) <span className="sch-alu-enroll-required">*</span>
      </label>
      <input
        id="alu-passing-year"
        type="number"
        min={MIN_YEAR}
        max={CURRENT_YEAR}
        className="sch-alu-enroll-input sch-alu-enroll-input--year"
        placeholder={`e.g. ${CURRENT_YEAR - 6}`}
        value={value}
        onChange={onChange}
        data-testid="school-input-passing-year-check"
      />
    </div>
  </div>
);
YearInput.propTypes = { value: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired };

/**
 * EligibilityCheckStep - Step 2: Verify passing year eligibility
 * @param {function} onEligible - callback when passing year is valid, receives year value
 */
const EligibilityCheckStep = ({ onEligible }) => {
  const [passingYear, setPassingYear] = useState('');
  const [checked, setChecked] = useState(false);
  const [eligible, setEligible] = useState(null);

  const handleCheck = () => {
    const year = parseInt(passingYear, 10);
    const isValid = !isNaN(year) && year >= MIN_YEAR && year <= CURRENT_YEAR;
    const meetsThreshold = isValid && (CURRENT_YEAR - year) >= REQUIRED_YEARS_SINCE_PASSING;
    setChecked(true);
    setEligible(meetsThreshold);
    if (meetsThreshold) onEligible(year);
  };

  const handleChange = (e) => { setPassingYear(e.target.value); setChecked(false); setEligible(null); };

  return (
    <div className="sch-alu-enroll-step" data-testid="school-step-eligibility">
      <h3 className="sch-alu-enroll-step-title">✅ Eligibility Check</h3>
      <p className="sch-alu-enroll-step-subtitle">
        🏫 Students who passed 10th class <strong>at least {REQUIRED_YEARS_SINCE_PASSING} years ago</strong> can join the alumni family!
      </p>
      <YearInput value={passingYear} onChange={handleChange} />
      <button type="button" className="sch-alu-enroll-eligibility-btn" onClick={handleCheck}
        disabled={!passingYear.trim()} data-testid="school-button-check-eligibility">
        {passingYear.trim() ? '🔍 Check My Eligibility' : '✏️ Enter your passing year...'}
      </button>
      {checked && <EligibilityResult eligible={eligible} passingYear={passingYear} />}
    </div>
  );
};
EligibilityCheckStep.propTypes = { onEligible: PropTypes.func.isRequired };

export default EligibilityCheckStep;
