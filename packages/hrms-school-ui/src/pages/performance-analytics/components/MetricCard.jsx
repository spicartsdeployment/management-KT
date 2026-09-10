import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../../schoolSlice';

// Icon components for each metric type
const AcademicIcon = ({ color }) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="5" stroke={color} strokeWidth="2" />
    <path d="M9 15L9 19L12 17L15 19L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

AcademicIcon.propTypes = { color: PropTypes.string.isRequired };

const SportsIcon = ({ color }) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V3H6V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5C2 5.53043 2.21071 6.03914 2.58579 6.41421C2.96086 6.78929 3.46957 7 4 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5C22 5.53043 21.7893 6.03914 21.4142 6.41421C21.0391 6.78929 20.5304 7 20 7H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

SportsIcon.propTypes = { color: PropTypes.string.isRequired };

const BehaviorIcon = ({ color }) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
  </svg>
);

BehaviorIcon.propTypes = { color: PropTypes.string.isRequired };

const CulturalIcon = ({ color }) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="10" rx="3" stroke={color} strokeWidth="2" />
    <line x1="12" y1="12" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 17C8 17 8 19 12 19C16 19 16 17 16 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

CulturalIcon.propTypes = { color: PropTypes.string.isRequired };

/**
 * Renders appropriate icon based on metric key
 */
const MetricIcon = ({ metricKey, color }) => {
  const icons = {
    academic: <AcademicIcon color={color} />,
    sports: <SportsIcon color={color} />,
    behavior: <BehaviorIcon color={color} />,
    cultural: <CulturalIcon color={color} />,
  };
  return icons[metricKey] || null;
};

MetricIcon.propTypes = {
  metricKey: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const DARK_ICON_BG = {
  academic: 'rgb(46 73 108 / 50%)',
  sports:   'rgb(38 100 59 / 50%)',
  behavior: 'rgb(40 29 85 / 50%)',
  cultural: 'rgb(94 81 31 / 50%)',
};

/**
 * Computes inline card styles based on active state and theme
 */
const useCardStyles = (metric, isActive, isDark) => {
  const inactiveBg = isDark
    ? 'linear-gradient(135deg, rgba(15,17,26,0.6) 0%, rgba(100,149,237,0.08) 100%)'
    : 'rgba(255,255,255,0.9)';
  const inactiveBorder = isDark ? '1px solid rgba(100,149,237,0.25)' : '1px solid rgba(0,0,0,0.08)';
  const inactiveShadow = isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 8px -2px rgba(0,0,0,0.08)';

  return {
    border: isActive ? `0.5px solid ${metric.color}` : inactiveBorder,
    boxShadow: isActive
      ? `0 12px 32px -4px ${metric.color}40, 0 4px 16px -2px ${metric.color}30, inset 0 -12px 24px -8px ${metric.color}20`
      : inactiveShadow,
    background: isActive
      ? `linear-gradient(135deg, ${metric.color}05 0%, ${metric.color}10 100%)`
      : inactiveBg,
  };
};

/**
 * Circular SVG progress ring for a metric
 */
const MetricProgress = ({ metric }) => {
  const radius = 34;
  const stroke = 6;
  const circ = 2 * Math.PI * radius * 0.75;
  const offset = circ * (1 - metric.percent / 100);

  return (
    <div className="school-per-progress-wrapper">
      <span className="school-per-progress-value" style={{ color: metric.color }}>
        {metric.percent}%
      </span>
      <svg width="80" height="80" viewBox="0 0 80 80" className="school-per-progress-svg">
        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" strokeLinecap="round" transform="rotate(135 40 40)" strokeDasharray={`${circ} ${2 * Math.PI * radius}`} />
        <circle cx="40" cy="40" r={radius} stroke={metric.color} strokeWidth={stroke} fill="none" strokeLinecap="round" transform="rotate(135 40 40)" strokeDasharray={`${circ} ${2 * Math.PI * radius}`} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
    </div>
  );
};

MetricProgress.propTypes = {
  metric: PropTypes.object.isRequired,
};

/**
 * MetricCard Component - Displays a single performance metric with circular progress
 */
const MetricCard = ({ metric, selectedTab, onTabClick }) => {
  const isActive = selectedTab === metric.key;
  const isDark = useSelector(selectTheme) === 'dark';
  const cardStyle = useCardStyles(metric, isActive, isDark);

  return (
    <div
      className={`school-per-metric-card ${isActive ? 'active' : ''}`}
      onClick={() => onTabClick(metric.key)}
      style={cardStyle}
      data-testid={`school-card-metric-${metric.key}`}
    >
      <div className="school-per-metric-content">
        <div
          className={`school-per-metric-icon-wrapper ${metric.key}`}
          style={{ background: isDark ? DARK_ICON_BG[metric.key] : metric.iconBg }}
        >
          <MetricIcon metricKey={metric.key} color={metric.color} />
        </div>
        <span className="school-per-metric-label" style={{ color: metric.color }}>
          {metric.label}
        </span>
      </div>
      <MetricProgress metric={metric} />
      {isActive && <div className="school-per-metric-pointer" style={{ borderTopColor: metric.color }} />}
    </div>
  );
};

MetricCard.propTypes = {
  metric: PropTypes.shape({
    key: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    iconBg: PropTypes.string.isRequired,
  }).isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
};

export default MetricCard;