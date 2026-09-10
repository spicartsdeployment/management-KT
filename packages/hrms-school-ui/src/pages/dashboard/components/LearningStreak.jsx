import React from 'react';
import './LearningStreak.scss';

/**
 * @component LearningStreak
 * @param {Object} props
 * @param {number} props.currentStreak - Current streak value
 * @param {number} props.bestRecord - Best record value
 * @param {Array<'teal'|'orange'|'gray'>} props.weeklyProgress - Array of 7 values for week progress
 */
const COLORS = {
  teal: '#4CAF9A',
  orange: '#F2994A',
  gray: '#E5E7EB',
};

function getDayLabel(idx) {
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx];
}

export default function LearningStreak({
  currentStreak = 6,
  bestRecord = 18,
  weeklyProgress = ['teal', 'teal', 'teal', 'teal', 'orange', 'teal', 'gray'],
}) {
  // Larger circle for streak
  const radius = 54;
  const stroke = 13;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const percent = Math.min(currentStreak / bestRecord, 1);
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <div className="learning-streak" data-testid="school-card-learning-streak">
      <div className="learning-streak__header">
        <span role="img" aria-label="fire" className="learning-streak__icon">🔥</span>
        <span className="learning-streak__title">Learning Streak</span>
      </div>
      <div className="learning-streak__main">
        {/* LEFT: Large Circular Progress */}
        <div className="learning-streak__circle">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke={COLORS.gray}
              strokeWidth={stroke}
            />
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke={COLORS.teal}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s' }}
            />
          </svg>
          <div className="learning-streak__circle-text">
            <span className="learning-streak__circle-value">{currentStreak}</span>
            <span className="learning-streak__circle-label">Days</span>
          </div>
        </div>
        {/* RIGHT: All other content stacked */}
        <div className="learning-streak__right">
          <div className="learning-streak__stats-row">
            <div className="learning-streak__stats">
              <div className="learning-streak__stats-label">Best Record</div>
              <div className="learning-streak__stats-value" data-testid="school-value-best-record">
                {bestRecord} <span>Days</span>
              </div>
            </div>
            <div className="learning-streak__stats">
              <div className="learning-streak__stats-label">Current Streak</div>
              <div className="learning-streak__stats-value" data-testid="school-value-current-streak">
                {currentStreak} <span>Days</span>
              </div>
            </div>
          </div>
          <div className="learning-streak__banner" data-testid="school-banner-streak">
            <span className="learning-streak__banner-icon">💡</span>
            <span className="learning-streak__banner-text">
              Keep going! {bestRecord - currentStreak} more days to beat your record
            </span>
          </div>
          <div className="learning-streak__week">
            <div className="learning-streak__week-label">This Week</div>
            <div className="learning-streak__week-bars">
              {weeklyProgress.map((color, idx) => (
                <span
                  key={idx}
                  className={`learning-streak__week-bar learning-streak__week-bar--${color}`}
                  style={{ background: COLORS[color] }}
                  data-testid={`school-bar-week-${idx}`}
                />
              ))}
            </div>
            <div className="learning-streak__week-days">
              {weeklyProgress.map((_, idx) => (
                <span key={idx} className="learning-streak__week-day">{getDayLabel(idx)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
