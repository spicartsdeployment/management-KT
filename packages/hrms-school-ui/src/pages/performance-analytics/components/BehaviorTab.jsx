import React from 'react';
import PropTypes from 'prop-types';
import { behaviorMetrics, teacherReviews } from '../constants/performanceData';

/**
 * Gets color configuration for a metric
 */
const getColorConfig = (color) => {
  const colorMap = {
    green: { main: '#10b981', light: '#d1fae5', border: '#a7f3d0' },
    blue: { main: '#3b82f6', light: '#dbeafe', border: '#bfdbfe' },
    purple: { main: '#8b5cf6', light: '#ede9fe', border: '#ddd6fe' },
    orange: { main: '#f97316', light: '#ffedd5', border: '#fed7aa' },
    red: { main: '#ef4444', light: '#fee2e2', border: '#fecaca' },
    indigo: { main: '#6366f1', light: '#e0e7ff', border: '#c7d2fe' }
  };
  return colorMap[color] || colorMap.blue;
};

/**
 * Gets avatar colors based on index
 */
const getAvatarColors = (index) => {
  const avatarColors = [
    { bg: '#fef3c7', icon: '#f59e0b', border: '#fde68a' },
    { bg: '#dbeafe', icon: '#3b82f6', border: '#bfdbfe' },
    { bg: '#d1fae5', icon: '#10b981', border: '#a7f3d0' }
  ];
  return avatarColors[index % 3];
};

/**
 * GoldStar Component - Single gold SVG star
 */
const GoldStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/**
 * Gets icon for metric based on label
 */
const getMetricIcon = (label, color, size = 22) => {
  const icons = {
    'Punctuality': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'Participation': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'Team skills': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Leadership': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    'Discipline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    'Obedience': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
      </svg>
    )
  };
  return icons[label] || icons['Punctuality'];
};

/**
 * BehaviorMetricCard Component - Displays a single behavior metric with circular SVG ring
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const BehaviorMetricCard = ({ metric }) => {
  const colors = getColorConfig(metric.color);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - metric.percentage / 100);
  const status = metric.percentage >= 90 ? 'Excellent' : 'Good';

  return (
    <div
      className="behavior-tab-metric-card"
      data-testid={`school-metric-${metric.label.toLowerCase().replace(' ', '-')}`}
    >
      <div className="behavior-tab-circle-wrapper">
        <svg width="110" height="110" viewBox="0 0 110 110" className="behavior-tab-circle-svg">
          <circle cx="55" cy="55" r={r} stroke={colors.light} strokeWidth="9" fill="none" />
          <circle cx="55" cy="55" r={r} stroke={colors.main} strokeWidth="9" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={offset}
            transform="rotate(-90 55 55)"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
        </svg>
        <div className="behavior-tab-circle-inner">
          {getMetricIcon(metric.label, colors.main, 20)}
          <span className="behavior-tab-circle-value" style={{ color: colors.main }}>{metric.percentage}%</span>
        </div>
      </div>
      <h4 className="behavior-tab-metric-label">{metric.label}</h4>
      <p className="behavior-tab-metric-description">{metric.description}</p>
      <span className="behavior-tab-metric-badge" style={{ background: colors.light, color: colors.main, border: `1px solid ${colors.border}` }}>{status}</span>
    </div>
  );
};

BehaviorMetricCard.propTypes = {
  metric: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

/**
 * ReviewHeader Component - Header with teacher info, date and star rating
 */
const ReviewHeader = ({ review, colors }) => (
  <div className="behavior-tab-review-header">
    <div className="behavior-tab-teacher-info">
      <div className="behavior-tab-teacher-avatar" style={{ background: colors.bg, border: `1.5px solid ${colors.border}` }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke={colors.icon} strokeWidth="2" />
          <path d="M4 20C4 16.69 6.69 14 10 14H14C17.31 14 20 16.69 20 20" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="behavior-tab-teacher-details">
        <h5 className="behavior-tab-teacher-name">{review.teacher}</h5>
        <p className="behavior-tab-teacher-role">{review.role}</p>
        <div className="behavior-tab-review-date-row">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="2" fill="none" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="#94a3b8" strokeWidth="2" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{review.date}</span>
        </div>
      </div>
    </div>
    <div className="behavior-tab-rating-stars">
      {[...Array(review.rating)].map((_, i) => (
        <GoldStar key={i} />
      ))}
    </div>
  </div>
);

ReviewHeader.propTypes = {
  review: PropTypes.object.isRequired,
  colors: PropTypes.object.isRequired
};



/**
 * TeacherReviewCard Component - Displays a single teacher review
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const TeacherReviewCard = ({ review, index }) => {
  const colors = getAvatarColors(index);

  return (
    <div
      className="behavior-tab-review-card"
      data-testid={`school-review-${index}`}
    >
      <ReviewHeader review={review} colors={colors} />
      <p className="behavior-tab-review-text">
        &quot;{review.review}&quot;
      </p>
    </div>
  );
};

TeacherReviewCard.propTypes = {
  review: PropTypes.shape({
    teacher: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    review: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

/**
 * BehaviorHeader Component - Header section
 */
const BehaviorHeader = () => (
  <div className="behavior-tab-header">
    <div className="behavior-tab-icon-wrapper">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#a29bfe" />
      </svg>
    </div>
    <div>
      <h2 className="behavior-tab-title">Behavior Performance</h2>
      <p className="behavior-tab-subtitle">Detailed breakdown and insights</p>
    </div>
    <div className="behavior-tab-badge">96%</div>
  </div>
);

/**
 * MetricsSection Component - Metrics section with header and grid
 */
const MetricsSection = () => (
  <div className="behavior-tab-metrics-section">
    <div className="behavior-tab-metrics-container">
      <div className="behavior-tab-section-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2v2m6-2v2M9 18v2m6-2v2M2 9h2M2 15h2m16-6h2m-2 6h2M6 6h12v12H6z" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h3 className="behavior-tab-section-title">Behavior Metrics</h3>
      </div>
      <div className="behavior-tab-metrics-list">
        {behaviorMetrics.map((metric, index) => (
          <BehaviorMetricCard key={index} metric={metric} index={index} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * ReviewsSection Component - Reviews section with header and grid
 */
const ReviewsSection = () => (
  <div className="behavior-tab-feedback-section">
    <div className="behavior-tab-reviews-container">
      <div className="behavior-tab-feedback-header">
        <div className="behavior-tab-feedback-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="behavior-tab-feedback-title">Teacher Feedback &amp; Reviews</h3>
        </div>
        <div className="behavior-tab-overall-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Excellent Overall
        </div>
      </div>
      <div className="behavior-tab-reviews-list">
        {teacherReviews.slice(0, 3).map((review, idx) => (
          <TeacherReviewCard key={idx} review={review} index={idx} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * BehaviorTab Component - Displays behavior performance details
 * @returns {JSX.Element}
 */
const BehaviorTab = () => {
  return (
    <div className="behavior-tab-wrapper" data-testid="school-tab-behavior">
      <div className="behavior-tab-container">
        <BehaviorHeader />
        <div className="behavior-tab-content">
          <h2 className="behavior-tab-assessment-heading">Behavior Assessment &amp; Teacher Feedback</h2>
          <MetricsSection />
          <ReviewsSection />
        </div>
      </div>
    </div>
  );
};

BehaviorTab.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default BehaviorTab;
