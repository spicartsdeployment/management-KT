import React from 'react';
import PropTypes from 'prop-types';
import { sportsSchoolEvents, sportsOutsideEvents, participationHistory } from '../constants/performanceData';
import SportEventCard from './SportEventCard';
import ParticipationHistoryItem from './ParticipationHistoryItem';

/**
 * TrophySVG Component - Trophy icon
 */
const TrophySVG = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V3H6V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M6 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5C2 5.53043 2.21071 6.03914 2.58579 6.41421C2.96086 6.78929 3.46957 7 4 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5C22 5.53043 21.7893 6.03914 21.4142 6.41421C21.0391 6.78929 20.5304 7 20 7H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 21H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

TrophySVG.propTypes = {
  color: PropTypes.string.isRequired
};

/**
 * CalendarSVG Component - Calendar icon
 */
const CalendarSVG = () => (
  <svg className="sports-tab-section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: 'none' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <line x1="3" y1="9" x2="21" y2="9" stroke="#3b82f6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * ClockSVG Component - Clock icon
 */
const ClockSVG = () => (
  <svg className="sports-tab-schedule-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * BadgeSVG Component - Badge/medal icon
 */
const BadgeSVG = () => (
  <svg className="sports-tab-skills-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <path d="M12 13L9 22L12 20L15 22L12 13Z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" fill="#3b82f6" />
    <path d="M7 8L12 5L17 8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/**
 * CoachAvatarSVG Component - Coach avatar icon
 */
const CoachAvatarSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

/**
 * SportsHeader Component - Header section
 */
const SportsHeader = () => (
  <div className="sch-per-sports-wrapper">
    <div className="sch-per-sports-header-section row-3-icon" style={{ background: 'rgba(94, 223, 119, 0.12)', border: '1px solid rgba(94, 223, 119, 0.22)', boxShadow: '0 2px 8px rgba(94, 223, 119, 0.1)' }}>
      <TrophySVG color="#5edf77" />
    </div>
    <div>
      <h2 className="sports-tab-main-heading sch-per-sports-heading-text">
        Sports Performance
      </h2>
      <p className="row-3-subtitle">Detailed breakdown and insights</p>
    </div>
    <div className="row-3-badge sch-per-sports-badge-achievement">92%</div>
  </div>
);

/**
 * SchoolEventsSection Component - School events list (no sub-header; events appear directly under section header)
 */
const SchoolEventsSection = () => (
  <div className="sports-tab-school-events-section">
    <div className="sports-tab-events-list">
      {sportsSchoolEvents.map(event => (
        <SportEventCard key={event.id} event={event} isSchoolEvent={true} />
      ))}
    </div>
  </div>
);

/**
 * OutsideEventsSection Component - Outside events list
 */
const OutsideEventsSection = () => (
  <div className="sports-tab-outside-events-section">
    <div className="sports-tab-subsection-header">
      <div className="sch-perf-flex-row">
        <TrophySVG color="#ec9435ff" />
        <h4 className="sports-tab-subsection-title">Outside Events</h4>
      </div>
      <span className="sports-tab-event-count-badge badge-yellow">
        {sportsOutsideEvents.length} Events
      </span>
    </div>
    <div className="sports-tab-events-list custom-scrollbar">
      {sportsOutsideEvents.map(event => (
        <SportEventCard key={event.id} event={event} isSchoolEvent={false} />
      ))}
    </div>
  </div>
);

/**
 * HouseCard Component - House/team information
 */
const HouseCard = () => (
  <div className="sports-tab-house-card" data-testid="school-card-house">
    <div className="sports-tab-house-header">
      <div className="sports-tab-house-badge">B</div>
      <div className="sports-tab-house-info">
        <h4 className="sports-tab-house-name">Blue House</h4>
        <p className="sports-tab-house-subtitle">Sports Group</p>
      </div>
      <div className="sports-tab-dress-code">
        <span className="sports-tab-dress-code-label">Dress Code</span>
        <div className="sports-tab-dress-code-color"></div>
      </div>
    </div>
    <div className="sports-tab-period-schedule">
      <div className="sports-tab-schedule-header">
        <ClockSVG />
        <h5 className="sports-tab-schedule-title">Sports Period Schedule</h5>
      </div>
      <div className="sports-tab-schedule-days">
        <span className="sports-tab-day-badge">Monday</span>
        <span className="sports-tab-day-badge">Wednesday</span>
        <span className="sports-tab-day-badge">Friday</span>
      </div>
    </div>
    <div className="sports-tab-special-interest-section">
      <div className="sports-tab-special-interest-content">
        <span className="sports-tab-special-interest-emoji">🏀</span>
        <div className="sports-tab-special-interest-text">
          <div className="sports-tab-special-interest-header">
            <span className="sports-tab-special-interest-icon">⭐</span>
            <h5 className="sports-tab-special-interest-title">Special Interest</h5>
          </div>
          <div className="sports-tab-special-interest-name">Basketball</div>
          <div className="sports-tab-special-interest-desc">Plays exceptionally well</div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * SkillsStats Component - Skills assessment stats
 */
const SkillsStats = () => (
  <div className="sports-tab-stats-grid">
    <div className="sports-tab-stat-item sports-tab-stat-technique">
      <div className="sports-tab-stat-label">Technique</div>
      <div className="sports-tab-stat-value sch-per-sports-stat-blue">⭐ 4.5</div>
      <div className="sports-tab-stat-dots sch-per-sports-stat-blue">●●●●○</div>
    </div>
    <div className="sports-tab-stat-item sports-tab-stat-teamwork">
      <div className="sports-tab-stat-label">Teamwork</div>
      <div className="sports-tab-stat-value sch-per-sports-stat-orange">⭐ 5</div>
      <div className="sports-tab-stat-dots sch-per-sports-stat-orange">●●●●●</div>
    </div>
    <div className="sports-tab-stat-item sports-tab-stat-endurance">
      <div className="sports-tab-stat-label">Endurance</div>
      <div className="sports-tab-stat-value sch-per-sports-stat-green">⭐ 4</div>
      <div className="sports-tab-stat-dots sch-per-sports-stat-green">●●●●○</div>
    </div>
  </div>
);

/**
 * SkillsAssessment Component - Complete skills assessment card
 */
const SkillsAssessment = () => (
  <div className="sports-tab-skills-assessment" data-testid="school-card-skills">
    <div className="sports-tab-skills-header">
      <BadgeSVG />
      <h5 className="sports-tab-skills-title">Sports Skills Assessment</h5>
    </div>
    <div className="sports-tab-skills-content">
      <div className="sports-tab-coach-info">
        <div className="sports-tab-coach-avatar">
          <CoachAvatarSVG />
        </div>
        <div className="sports-tab-coach-details">
          <div className="sports-tab-coach-name">Coach Anderson</div>
          <div className="sports-tab-coach-role">Physical Education & Sports Teacher</div>
        </div>
      </div>
      <p className="sports-tab-coach-comment">
        &quot;Exceptional athletic abilities with outstanding teamwork. Shows strong leadership on the court and great sportsmanship.&quot;
      </p>
      <SkillsStats />
      <div className="sports-tab-overall-performance">
        <span className="sports-tab-performance-label">Overall Performance</span>
        <span className="sports-tab-performance-value">Excellent <span className="sports-tab-perf-emoji">⭐</span></span>
      </div>
    </div>
  </div>
);

/**
 * ParticipationHistory Component - Participation history section
 */
const ParticipationHistory = () => (
  <div className="sports-tab-participation-history">
    <div className="sports-tab-history-header">
      <div className="sports-tab-history-icon-badge">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 15V22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 22H16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h5 className="sports-tab-history-title">Participation History</h5>
    </div>
    <div className="sports-tab-history-list">
      {participationHistory.map(item => (
        <ParticipationHistoryItem key={item.id} item={item} />
      ))}
    </div>
  </div>
);

/**
 * SportsTab Component - Displays sports performance details
 * @param {Object} props - Component props (isDarkMode unused but kept for API compatibility)
 * @returns {JSX.Element}
 */
const SportsTab = ({ isDarkMode: _isDarkMode }) => {
  return (
    <div className="sports-tab-content" data-testid="school-tab-sports">
      <SportsHeader />
      <div className="perf-sports-grid">
        <div className="sports-tab-upcoming-events-container">
          <div className="sports-tab-section-header">
            <CalendarSVG />
            <h3 className="sports-tab-section-title">Upcoming Sports Events</h3>
          </div>
          <div className="sports-tab-events-wrapper">
            <SchoolEventsSection />
            <OutsideEventsSection />
          </div>
        </div>

        <div className="sports-tab-participation-container">
          <div className="sports-tab-section-header">
            <TrophySVG color="#3b82f6" />
            <h3 className="sports-tab-section-title">Sports Participation</h3>
          </div>
          <div className="sports-tab-participation-group">
            <HouseCard />
            <div className="sports-tab-group-divider" />
            <SkillsAssessment />
          </div>
          <ParticipationHistory />
        </div>
      </div>
    </div>
  );
};

SportsTab.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default SportsTab;
