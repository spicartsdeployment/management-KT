import React from 'react';
import PropTypes from 'prop-types';
import { culturalRoles, culturalUpcomingEvents, culturalPastParticipation } from '../constants/performanceData';

/**
 * DramaSVG Component - Drama/theater icon
 */
const DramaSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * MusicSVG Component - Music note icon
 */
const MusicSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18V5l12-2v13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="18" r="3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="18" cy="16" r="3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * MicSVG Component - Microphone icon
 */
const MicSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Gets role icon SVG components
 */
const getRoleIconSVGs = () => [<DramaSVG key="drama" />, <MusicSVG key="music" />, <MicSVG key="mic" />];

/**
 * Gets icon backgrounds
 */
const getIconBackgrounds = () => ['#fff7ed', '#eff6ff', '#f0fdf4'];

/**
 * Gets icon colors
 */
const getIconColors = () => ['#f97316', '#3b82f6', '#22c55e'];

/**
 * Gets event badge styling by badge text
 */
const getEventBadgeColors = () => ({
  'Major Event':   { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  'Competition':   { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  'Performance':   { bg: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' },
  'Exhibition':    { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
  'Workshop':      { bg: '#fce7f3', color: '#9f1239', border: '#fbcfe8' },
  'Recital':       { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
  'Festival':      { bg: '#fef9c3', color: '#78350f', border: '#fef08a' },
  'Small Event':   { bg: '#dcfce7', color: '#14532d', border: '#bbf7d0' },
});

/**
 * Gets participation card icon background per index
 */
const getParticipationIconBg = (index) => [
  '#fed7aa', '#bfdbfe', '#bbf7d0', '#e9d5ff', '#fecaca', '#fde68a', '#c7d2fe', '#99f6e4'
][index % 8];

/**
 * Gets achievement badge style
 */
const getAchievementStyle = (achievement) => {
  const map = {
    'Best Performance':  { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    'Winner':            { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    'Outstanding':       { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    'Excellent Hosting': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
    'Best Group':        { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    'Finalist':          { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    '2nd Prize':         { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'Participated':      { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  };
  return map[achievement] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

/**
 * Gets role badge styling
 */
const getRoleStyle = (role) => {
  const map = {
    'Lead Performer': { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    'Support Member':  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    'Announcer':       { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  };
  return map[role] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

/**
 * RoleIcon Component - Icon badge for cultural role
 */
const RoleIcon = ({ index, role, isDarkMode }) => {
  const iconSvgs = getRoleIconSVGs();
  const iconBgs = getIconBackgrounds();

  return (
    <div className="cultural-tab-role-icon-badge" style={{
      background: isDarkMode ? 'transparent' : iconBgs[index],
      border: `2px solid ${role.borderColor}`
    }}>
      {iconSvgs[index]}
    </div>
  );
};

RoleIcon.propTypes = {
  index: PropTypes.number.isRequired,
  role: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

/**
 * RoleRating Component - Rating display for role
 */
const RoleRating = ({ role, index }) => {
  const iconColors = getIconColors();

  return (
    <div className="cultural-tab-role-rating">
      <span className="cultural-tab-rating-label">Overall Rating</span>
      <div className="cultural-tab-rating-value">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={iconColors[index]} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="cultural-tab-rating-number" style={{ color: iconColors[index] }}>
          {role.rating}
        </span>
      </div>
    </div>
  );
};

RoleRating.propTypes = {
  role: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

/**
 * CulturalRoleCard Component - Displays a single cultural role
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const CulturalRoleCard = ({ role, index, isDarkMode }) => {
  return (
    <div key={index} className="cultural-tab-role-card" data-testid={`school-role-${index}`}>
      <div className="cultural-tab-role-content">
        <RoleIcon index={index} role={role} isDarkMode={isDarkMode} />
        <div className="cultural-tab-role-info">
          <h4 className="cultural-tab-role-title">{role.title}</h4>
          <p className="cultural-tab-role-subtitle">{role.subtitle}</p>
          <p className="cultural-tab-role-description">{role.description}</p>
        </div>
      </div>
      <RoleRating role={role} index={index} />
    </div>
  );
};

CulturalRoleCard.propTypes = {
  role: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

/**
 * EventInfoIcon Component - Generic icon for event info
 */
const EventInfoIcon = ({ type, color }) => {
  if (type === 'date') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
      </svg>
    );
  }
  if (type === 'time') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'venue') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

EventInfoIcon.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

/**
 * EventInfoItem Component - Single info item in event card
 */
const EventInfoItem = ({ type, label, value, iconBg, color }) => (
  <div className="cultural-tab-info-item">
    <div className="cultural-tab-info-icon-circle" style={{ background: iconBg }}>
      <EventInfoIcon type={type} color={color} />
    </div>
    <div className="cultural-tab-info-content">
      <div className="cultural-tab-info-label">{label}</div>
      <div className="cultural-tab-info-value">{value}</div>
    </div>
  </div>
);

EventInfoItem.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

/**
 * CulturalEventCard Component - Displays a single cultural event
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const CulturalEventCard = ({ event, index }) => {
  const badgeMap = getEventBadgeColors();
  const colorSet = badgeMap[event.badge] || badgeMap['Major Event'];

  return (
    <div
      className="cultural-tab-event-card"
      style={{ animationDelay: `${index * 0.08}s`, background: colorSet.bg, borderColor: colorSet.border }}
      data-testid={`school-cultural-event-${event.id}`}
    >
      <div className="cultural-tab-event-header">
        <h4 className="cultural-tab-event-name">{event.name}</h4>
        <span className="cultural-tab-event-badge" style={{
          background: colorSet.border,
          color: colorSet.color,
          border: `1px solid ${colorSet.border}`
        }}>
          {event.badge}
        </span>
      </div>
      <p className="cultural-tab-event-description">{event.description}</p>
      <div className="cultural-tab-event-info-grid">
        <EventInfoItem type="date" label="Date" value={event.date} iconBg={colorSet.bg} color={colorSet.color} />
        <EventInfoItem type="time" label="Time" value={event.time} iconBg={colorSet.bg} color={colorSet.color} />
        <EventInfoItem type="venue" label="Venue" value={event.venue} iconBg={colorSet.bg} color={colorSet.color} />
        <EventInfoItem type="contact" label="Contact" value={event.contact} iconBg={colorSet.bg} color={colorSet.color} />
      </div>
    </div>
  );
};

CulturalEventCard.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

/**
 * CalendarSmallSVG - tiny calendar for inline date
 */
const CalendarSmallSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#94a3b8" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="#94a3b8" strokeWidth="2" />
  </svg>
);

/**
 * StarSVG - filled star for rating
 */
const StarSVG = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

StarSVG.propTypes = { color: PropTypes.string.isRequired };

/**
 * CulturalParticipationCard - rebuilt to match screenshot layout
 */
const CulturalParticipationCard = ({ item, index }) => {
  const iconBg = getParticipationIconBg(index);
  const roleStyle = getRoleStyle(item.role);
  const achievementStyle = getAchievementStyle(item.achievement);
  const starColor = achievementStyle.color;

  return (
    <div
      className="cultural-tab-participation-card"
      data-testid={`school-participation-${item.id}`}
    >
      {/* Top row: icon + info + rating */}
      <div className="cpc-top-row">
        <div className="cpc-icon" style={{ background: iconBg }}>
          {item.emoji}
        </div>
        <div className="cpc-info">
          <h4 className="cpc-title">{item.title}</h4>
          <p className="cpc-subtitle">{item.subtitle}</p>
          <div className="cpc-meta-row">
            <span className="cpc-role-badge" style={{
              background: roleStyle.bg,
              color: roleStyle.color,
              border: `1px solid ${roleStyle.border}`
            }}>{item.role}</span>
            <span className="cpc-date">
              <CalendarSmallSVG />
              {item.date}
            </span>
          </div>
        </div>
        <div className="cpc-rating-pill" style={{ borderColor: achievementStyle.border }}>
          <StarSVG color={starColor} />
          <span className="cpc-rating-score" style={{ color: starColor }}>{item.rating}</span>
          <span className="cpc-rating-max">/5.0</span>
        </div>
      </div>
      {/* Bottom: achievement badge */}
      <div className="cpc-achievement-row">
        <span className="cpc-achievement-badge" style={{
          background: achievementStyle.bg,
          color: achievementStyle.color,
          border: `1px solid ${achievementStyle.border}`
        }}>{item.achievement}</span>
      </div>
    </div>
  );
};

CulturalParticipationCard.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

/**
 * CulturalHeader Component - Main header section
 */
const CulturalHeader = () => (
  <div className="sch-per-cultural-header-container">
    <div className="sch-per-cultural-header-icon-wrapper row-3-icon" style={{ background: 'rgba(249, 182, 111, 0.12)', border: '1px solid rgba(249, 182, 111, 0.22)', boxShadow: '0 2px 8px rgba(249, 182, 111, 0.10)' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="2" width="6" height="10" rx="3" stroke="#f9b66f" strokeWidth="2" />
        <line x1="12" y1="12" x2="12" y2="17" stroke="#f9b66f" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 17C8 17 8 19 12 19C16 19 16 17 16 17" stroke="#f9b66f" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="#f9b66f" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <div>
      <h2 className="cultural-tab-main-heading sch-per-cultural-main-heading-text">
        Cultural Performance
      </h2>
      <p className="row-3-subtitle">Detailed breakdown and insights</p>
    </div>
    <div className="row-3-badge sch-per-cultural-badge-participation">91%</div>
  </div>
);

/**
 * ProfileSection Component - Cultural profile section
 */
const ProfileSection = ({ isDarkMode }) => (
  <div className="cultural-tab-profile-section">
    <div className="cultural-tab-section-header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: 'none' }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="cultural-tab-section-title">Cultural Profile & Specialities</h3>
    </div>
    <div className="cultural-tab-roles-grid">
      {culturalRoles.map((role, index) => (
        <CulturalRoleCard key={index} role={role} index={index} isDarkMode={isDarkMode} />
      ))}
    </div>
  </div>
);

ProfileSection.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

/**
 * UpcomingEventsSection Component - Upcoming events section
 */
const UpcomingEventsSection = () => (
  <div className="cultural-tab-upcoming-events-section">
    <div className="cultural-tab-events-list-container">
      <div className="cultural-tab-subsection-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="#60a5fa" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="2" x2="8" y2="6" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="#60a5fa" strokeWidth="2" />
        </svg>
        <h3 className="cultural-tab-subsection-title">Upcoming School Cultural Events</h3>
      </div>
      <div className="cultural-tab-events-list">
        {culturalUpcomingEvents.map((event, index) => (
          <CulturalEventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * PastParticipationSection Component - Past participation section
 */
const PastParticipationSection = () => (
  <div className="cultural-tab-past-participation-section">
    <div className="cultural-tab-participation-list-container">
      <div className="sch-per-cultural-participation-subsection-header">
        <span className="sch-per-cultural-participation-icon-emoji">🏆</span>
        <h3 className="sch-per-cultural-participation-subsection-title">Past Cultural Participation & Ratings</h3>
      </div>
      <div className="cultural-tab-participation-list">
        {culturalPastParticipation.map((item, index) => (
          <CulturalParticipationCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * CulturalTab Component - Displays cultural performance details
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const CulturalTab = ({ isDarkMode }) => {
  return (
    <div className="cultural-tab-wrapper" data-testid="school-tab-cultural">
      <CulturalHeader />
      <ProfileSection isDarkMode={isDarkMode} />
      <div className="cultural-tab-events-grid">
        <UpcomingEventsSection />
        <PastParticipationSection />
      </div>
    </div>
  );
};

CulturalTab.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default CulturalTab;
