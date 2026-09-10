import React from 'react';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {number} props.value
 * @param {number} props.max
 * @param {string} props.color - hex or CSS color
 * @param {string} props.change - e.g. '+3.2%'
 * @param {string} props.icon
 */
const PerformanceCard = ({ title, value, max = 100, color, change, icon }) => {
  const pct = Math.round((value / max) * 100);
  const isPositive = change && change.startsWith('+');

  return (
    <div className="lc-perf-card" data-testid={`teacher-live-perf-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="lc-perf-card__top">
        <span className="lc-perf-card__icon" aria-hidden="true">{icon}</span>
        {change && (
          <span className={`lc-perf-card__change ${isPositive ? 'pos' : 'neg'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <div className="lc-perf-card__title">{title}</div>
      <div className="lc-perf-card__value" style={{ color }}>{value}%</div>
      <div className="lc-perf-card__bar-bg">
        <div
          className="lc-perf-card__bar-fill"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default PerformanceCard;
