import React from 'react';

/**
 * @param {object} props
 * @param {string} props.icon
 * @param {string} props.label
 * @param {number} props.value
 * @param {string} props.color - 'green'|'red'|'blue'|'orange'
 * @param {string} props.sub
 */
const MetricCard = ({ icon, label, value, color, sub }) => (
  <div className={`lc-metric-card lc-metric-card--${color}`} data-testid={`teacher-live-metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className={`lc-metric-card__icon lc-metric-card__icon--${color}`} aria-hidden="true">
      {icon}
    </div>
    <div className="lc-metric-card__body">
      <span className="lc-metric-card__label">{label}</span>
      {sub && <span className="lc-metric-card__sub">{sub}</span>}
    </div>
    <div className="lc-metric-card__value">{value}</div>
  </div>
);

export default MetricCard;
