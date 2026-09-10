import React from 'react';
import PropTypes from 'prop-types';
import CustomDropdown from './CustomDropdown';

const industries = [
  'All Industries',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Automotive',
];

export default function Filters({ industry, onIndustryChange }) {
  return (
    <div className="sch-alu-filters-row">
      <CustomDropdown
        id="alumni-industry-select"
        value={industry}
        onChange={onIndustryChange}
        options={industries}
        testId="alumni-dropdown-industry"
        data-testid="school-dropdown-alumni-industry"
      />
    </div>
  );
}

Filters.propTypes = {
  industry: PropTypes.string.isRequired,
  onIndustryChange: PropTypes.func.isRequired,
};

