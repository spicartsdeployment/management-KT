import React from 'react';
import PropTypes from 'prop-types';

/**
 * Determines badge CSS class based on color
 */
const getBadgeClass = (badgeColor) => {
  if (badgeColor === '#10b981') return 'badge-green';
  if (badgeColor === '#3b82f6') return 'badge-blue';
  return 'badge-yellow';
};

/**
 * Determines border CSS class based on badge color
 */
const getBorderClass = (badgeColor) => {
  if (badgeColor === '#10b981') return 'sch-per-sports-event-border-green';
  if (badgeColor === '#3b82f6') return 'sch-per-sports-event-border-blue';
  return 'sch-per-sports-event-border-orange';
};

/**
 * Returns tint CSS class matching badge/tag color for all info containers
 */
const getEventTintClass = (badgeColor) => {
  if (badgeColor === '#10b981') return 'event-tint-green';
  if (badgeColor === '#3b82f6') return 'event-tint-blue';
  return 'event-tint-orange';
};

/**
 * DateIcon Component - Calendar SVG
 */
const DateIcon = ({ color }) => (
  <svg className="sports-tab-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="15" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M3 10H21" stroke={color} strokeWidth="2" />
    <path d="M8 3V7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 3V7" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

DateIcon.propTypes = {
  color: PropTypes.string.isRequired
};

/**
 * TimeIcon Component - Clock SVG
 */
const TimeIcon = ({ color }) => (
  <svg className="sports-tab-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

TimeIcon.propTypes = {
  color: PropTypes.string.isRequired
};

/**
 * VenueIcon Component - Location pin SVG
 */
const VenueIcon = ({ color }) => (
  <svg className="sports-tab-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

VenueIcon.propTypes = {
  color: PropTypes.string.isRequired
};

/**
 * ContactIcon Component - Person SVG
 */
const ContactIcon = ({ color }) => (
  <svg className="sports-tab-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
    <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

ContactIcon.propTypes = {
  color: PropTypes.string.isRequired
};

/**
 * DateTimeInfoCard Component - Single container with Date and Time side by side
 */
const DateTimeInfoCard = ({ event }) => (
  <div className={`sports-tab-datetime-combined ${getEventTintClass(event.badgeColor)}`}>
    <div className="sports-tab-datetime-section">
      <div className="sports-tab-dt-icon-wrap sports-tab-dt-icon-blue">
        <DateIcon color="#3b82f6" />
      </div>
      <div className="sports-tab-info-content">
        <div className="sports-tab-info-label">EVENT DATE</div>
        <div className="sports-tab-info-value">{event.date}</div>
      </div>
    </div>
    <div className="sports-tab-datetime-section">
      <div className="sports-tab-dt-icon-wrap sports-tab-dt-icon-teal">
        <TimeIcon color="#0d9488" />
      </div>
      <div className="sports-tab-info-content">
        <div className="sports-tab-info-label">TIME</div>
        <div className="sports-tab-info-value">{event.time}</div>
      </div>
    </div>
  </div>
);

/**
 * VenueInfoCard Component - Displays venue information (flat, no bg/border)
 */
const VenueInfoCard = ({ event }) => (
  <div className={`sports-tab-info-tile ${getEventTintClass(event.badgeColor)}`}>
    <div className="sports-tab-icon-bare">
      <VenueIcon color="#6366f1" />
    </div>
    <div className="sports-tab-info-content">
      <div className="sports-tab-info-label">VENUE</div>
      <div className="sports-tab-info-value">{event.venue}</div>
    </div>
  </div>
);

VenueInfoCard.propTypes = {
  event: PropTypes.object.isRequired
};

/**
 * ContactInfoCard Component - Displays contact information (flat, no bg/border)
 */
const ContactInfoCard = ({ event }) => (
  <div className={`sports-tab-info-tile ${getEventTintClass(event.badgeColor)}`}>
    <div className="sports-tab-icon-bare">
      <ContactIcon color="#6366f1" />
    </div>
    <div className="sports-tab-info-content">
      <div className="sports-tab-info-label">CONTACT</div>
      <div className="sports-tab-info-value">{event.contact}</div>
      <div className="sports-tab-info-role">{event.contactRole}</div>
    </div>
  </div>
);

ContactInfoCard.propTypes = {
  event: PropTypes.object.isRequired
};

/**
 * SportEventCard Component - Displays a single sport event card
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const SportEventCard = ({ event, isSchoolEvent: _isSchoolEvent }) => {
  const badgeClass = getBadgeClass(event.badgeColor);
  const borderClass = getBorderClass(event.badgeColor);

  return (
    <div
      className={`sports-tab-event-card sch-per-sports-event-left-border ${borderClass}`}
      data-testid={`school-event-${event.id}`}
    >
      <div className="sports-tab-event-header">
        <h5 className="sports-tab-event-name">{event.name}</h5>
        <span className={`sports-tab-event-badge ${badgeClass}`}>
          {event.badge}
        </span>
      </div>

      <p className="sports-tab-event-description">
        {event.description}
      </p>

      <DateTimeInfoCard event={event} />

      <div className="sports-tab-flat-info-row">
        <VenueInfoCard event={event} />
        <ContactInfoCard event={event} />
      </div>
    </div>
  );
};

SportEventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    contactRole: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    badgeColor: PropTypes.string.isRequired
  }).isRequired,
  isSchoolEvent: PropTypes.bool
};

export default SportEventCard;
