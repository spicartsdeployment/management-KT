import React from 'react';
import PropTypes from 'prop-types';

/**
 * Gets icon config based on activity type
 */
const getIconConfig = (activity) => {
  const iconMap = {
    'Basketball Tournament': { icon: '🏀', color: '#f97316', bg: '#ffedd5', border: '#fed7aa' },
    'Football Match': { icon: '⚽', color: '#22c55e', bg: '#e0f2fe', border: '#bae6fd' },
    'Swimming': { icon: '🏊', color: '#3b82f6', bg: '#fef9c3', border: '#fde68a' }
  };
  return iconMap[activity] || { icon: '🏆', color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' };
};

/**
 * Gets badge styling based on status
 */
const getBadgeStyles = (status) => {
  const badgeStyles = {
    'Champion':   { bg: '#fef3c7', color: '#92400e', border: '#fde68a', prefix: '🏆' },
    'Runner-up':  { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe', prefix: '🏆' },
    'Participated': { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', prefix: '✓' }
  };
  return badgeStyles[status] || badgeStyles['Participated'];
};

/**
 * CalendarSVG Component - Calendar icon
 */
const CalendarSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6b7280" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="#6b7280" strokeWidth="2" />
  </svg>
);

/**
 * PersonSVG Component - Person icon
 */
const PersonSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * ActivityIcon Component - Activity icon with styling
 */
const ActivityIcon = ({ itemIcon }) => (
  <div className="sports-tab-history-activity-icon" style={{
    background: itemIcon.bg,
    border: `1px solid ${itemIcon.border}`
  }}>
    {itemIcon.icon}
  </div>
);

ActivityIcon.propTypes = {
  itemIcon: PropTypes.object.isRequired
};

/**
 * EventHeader Component - Event name and status badge
 */
const EventHeader = ({ eventName, status, statusStyle }) => (
  <div className="sports-tab-history-header-row">
    <h6 className="sports-tab-history-event-name">{eventName}</h6>
    <span className="sports-tab-history-status-badge" style={{
      background: statusStyle.bg,
      color: statusStyle.color,
      border: `1px solid ${statusStyle.border}`
    }}>
      <span className="sports-tab-history-badge-prefix">{statusStyle.prefix}</span>{status}
    </span>
  </div>
);

EventHeader.propTypes = {
  eventName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  statusStyle: PropTypes.object.isRequired
};

/**
 * DateDisplay Component - Date with calendar icon
 */
const DateDisplay = ({ date }) => (
  <div className="sports-tab-history-date-row">
    <CalendarSVG />
    <div className="sports-tab-history-date-value">{date}</div>
  </div>
);

DateDisplay.propTypes = {
  date: PropTypes.string.isRequired
};

/**
 * CoachReview Component - Coach's review section
 */
const CoachReview = ({ review }) => (
  <div className="sports-tab-history-review-container">
    <div className="sports-tab-history-review-header">
      <PersonSVG />
      <span className="sports-tab-history-review-label">Coach&apos;s Review</span>
    </div>
    <p className="sports-tab-history-review-text">{review}</p>
  </div>
);

CoachReview.propTypes = {
  review: PropTypes.string.isRequired
};

/**
 * ParticipationHistoryItem Component - Displays a single participation history item
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const ParticipationHistoryItem = ({ item }) => {
  const itemIcon = getIconConfig(item.activity);
  const statusStyle = getBadgeStyles(item.status);

  return (
    <div className="sports-tab-history-item" data-testid={`school-history-${item.id}`}>
      <div className="sports-tab-history-top-row">
        <ActivityIcon itemIcon={itemIcon} />
        <div className="sports-tab-history-details">
          <EventHeader
            eventName={item.eventName}
            status={item.status}
            statusStyle={statusStyle}
          />
          <p className="sports-tab-history-activity-name">{item.activity}</p>
          <DateDisplay date={item.date} />
        </div>
      </div>
      <CoachReview review={item.review} />
    </div>
  );
};

ParticipationHistoryItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    eventName: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    review: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusColor: PropTypes.string
  }).isRequired
};

export default ParticipationHistoryItem;
