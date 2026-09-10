import React from 'react';

export const SKILL_OPTIONS = [
  'Technology', 'Product', 'Marketing', 'Finance', 'Design',
  'Engineering', 'Data Science', 'Management',
];

/**
 * SkillsMultiSelect - Tag-based multi-select for skills
 * @param {string[]} value - array of selected skills
 * @param {function} onChange - callback with updated array
 */
const SkillsMultiSelect = ({ value = [], onChange, error }) => {
  const toggle = (skill) => {
    if (value.includes(skill)) {
      onChange(value.filter(s => s !== skill));
    } else {
      onChange([...value, skill]);
    }
  };

  return (
    <div className="sch-alu-enroll-field-group">
      <label className="sch-alu-enroll-label">Skills</label>
      <div className="sch-alu-enroll-skills-grid" data-testid="school-group-skills">
        {SKILL_OPTIONS.map(skill => (
          <button
            key={skill}
            type="button"
            className={`sch-alu-enroll-skill-tag ${value.includes(skill) ? 'sch-alu-enroll-skill-tag--selected' : ''}`}
            onClick={() => toggle(skill)}
            data-testid={`school-tag-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
            aria-pressed={value.includes(skill)}
          >
            {value.includes(skill) && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {skill}
          </button>
        ))}
      </div>
      {value.length > 0 && (
        <p className="sch-alu-enroll-skills-selected">{value.length} skill{value.length > 1 ? 's' : ''} selected</p>
      )}
      {error && <span className="sch-alu-enroll-error">{error.message}</span>}
    </div>
  );
};

export default SkillsMultiSelect;
