import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Automobile', 'Engineering',
  'Education', 'Consulting', 'Manufacturing', 'Retail / E-Commerce',
  'Marketing & Media', 'Government / Public Sector', 'Entrepreneurship / Startup',
  'Hospitality / Tourism', 'Other',
];

const DropdownTrigger = ({ value, open, hasError, onClick }) => (
  <button
    type="button"
    className={`sch-alu-enroll-dropdown-btn${hasError ? ' sch-alu-enroll-input--error' : ''}`}
    onClick={onClick}
    data-testid="school-dropdown-industry"
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span>{value || 'Select Industry'}</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>
);

DropdownTrigger.propTypes = {
  value: PropTypes.string,
  open: PropTypes.bool.isRequired,
  hasError: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
DropdownTrigger.defaultProps = { value: '', hasError: false };

const IndustryOptions = ({ value, onSelect }) => (
  <ul className="sch-alu-enroll-dropdown-menu" role="listbox" data-testid="school-list-industry-options">
    {INDUSTRIES.map(opt => (
      <li
        key={opt}
        role="option"
        aria-selected={value === opt}
        className={`sch-alu-enroll-dropdown-option${value === opt ? ' sch-alu-enroll-dropdown-option--selected' : ''}`}
        onClick={() => onSelect(opt)}
        data-testid={`school-option-industry-${opt.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      >
        {opt}
      </li>
    ))}
  </ul>
);

IndustryOptions.propTypes = {
  value: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
IndustryOptions.defaultProps = { value: '' };

/**
 * IndustryDropdown - Custom industry selector with outside-click-to-close
 * @param {string} value - current selected value
 * @param {function} onChange - selection callback
 * @param {object} error - react-hook-form error object
 * @param {boolean} required - whether the field is required
 */
const IndustryDropdown = ({ value, onChange, error, required }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (opt) => { onChange(opt); setOpen(false); };

  return (
    <div className="sch-alu-enroll-field-group sch-alu-enroll-dropdown" ref={ref}>
      <label className="sch-alu-enroll-label">
        Industry {required && <span className="sch-alu-enroll-required">*</span>}
      </label>
      <DropdownTrigger value={value} open={open} hasError={!!error} onClick={() => setOpen(o => !o)} />
      {open && <IndustryOptions value={value} onSelect={handleSelect} />}
      {error && <span className="sch-alu-enroll-error">{error.message}</span>}
    </div>
  );
};

IndustryDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
  required: PropTypes.bool,
};
IndustryDropdown.defaultProps = { value: '', error: null, required: true };

export default IndustryDropdown;
