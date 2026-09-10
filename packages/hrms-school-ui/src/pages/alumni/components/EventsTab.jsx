import React from 'react';
import PropTypes from 'prop-types';

/**
 * EventCard component - Renders individual event details
 * @param {Object} event - Event data
 * @param {Function} onRegister - Callback for register button
 * @param {Function} onLearnMore - Callback for learn more button
 * @returns {JSX.Element}
 */
function EventCard({ event, onRegister, onLearnMore }) {
  return (
    <div
      key={event.id}
      className="sch-alu-event-card"
      data-testid="alumni-event-card"
    >
      <div className="sch-alu-event-header">
        <div>
          <span className="sch-alu-event-title">{event.title}</span>
          <span className="sch-alu-event-date">{event.dateTime}</span>
          <EventLocation location={event.location} />
          <EventAttendees attendees={event.attendees} />
        </div>
        <span className={`sch-alu-event-tag ${event.tagColor}`}>{event.tag}</span>
      </div>
      <EventActions event={event} onRegister={onRegister} onLearnMore={onLearnMore} />
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dateTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    attendees: PropTypes.number.isRequired,
    tag: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
  }).isRequired,
  onRegister: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired,
};

/**
 * EventLocation component - Displays event location
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
function EventLocation({ location }) {
  return (
    <div className="sch-alu-event-location">
      <svg className="sch-alu-event-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1111.314-11.314l-4.243 4.243z" /></svg>
      {location}
    </div>
  );
}

EventLocation.propTypes = {
  location: PropTypes.string.isRequired,
};

/**
 * EventAttendees component - Displays attendee count
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
function EventAttendees({ attendees }) {
  return (
    <div className="sch-alu-event-attendees">
      <svg className="sch-alu-event-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4" /></svg>
      {attendees} attendees
    </div>
  );
}

EventAttendees.propTypes = {
  attendees: PropTypes.number.isRequired,
};

/**
 * EventActions component - Renders event action buttons
 * @param {Object} event - Event data
 * @param {Function} onRegister - Callback for register button
 * @param {Function} onLearnMore - Callback for learn more button
 * @returns {JSX.Element}
 */
function EventActions({ event, onRegister, onLearnMore }) {
  return (
    <div className="sch-alu-event-actions">
      <button
        className="sch-alu-event-btn-register"
        onClick={() => onRegister(event)}
        data-testid="alumni-button-register"
      >
        Register
      </button>
      <button
        className="sch-alu-event-btn-learnmore"
        onClick={() => onLearnMore(event)}
        data-testid="alumni-button-learnmore"
      >
        Learn More
      </button>
    </div>
  );
}

EventActions.propTypes = {
  event: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired,
};

/**
 * EventsTab component - Renders list of events
 * @param {Array} events - Array of event objects
 * @param {Function} onRegister - Callback for register button
 * @param {Function} onLearnMore - Callback for learn more button
 * @returns {JSX.Element}
 */
function EventsTab({ events, onRegister, onLearnMore }) {
  return (
    <div className="sch-alu-events-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={onRegister}
          onLearnMore={onLearnMore}
        />
      ))}
    </div>
  );
}

EventsTab.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRegister: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired,
};

export default EventsTab;

