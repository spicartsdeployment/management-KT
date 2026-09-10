import React from 'react';
import PropTypes from 'prop-types';
import AlumniCard from './AlumniCard';

/** CTA shown when no mentors are available or as an always-visible footer. */
function MentorCta({ onBrowseMentors, onJoinMentor }) {
  return (
    <div className="sch-alu-mentorship-grid">
      <div className="sch-alu-mentorship-card">
        <span className="sch-alu-mentorship-title">Mentorship Program</span>
        <span className="sch-alu-mentorship-desc">Connect with experienced alumni for career guidance and professional development</span>
        <span className="sch-alu-mentorship-subtitle">Find a Mentor</span>
        <span className="sch-alu-mentorship-desc">Browse available mentors in your field of interest</span>
        <button className="sch-alu-mentorship-btn" onClick={onBrowseMentors} data-testid="alumni-button-browse-mentors">
          Browse Mentors
        </button>
      </div>
      <div className="sch-alu-mentorship-card">
        <span className="sch-alu-mentorship-title">Become a Mentor</span>
        <span className="sch-alu-mentorship-desc">Share your experience and help current students succeed</span>
        <button className="sch-alu-mentorship-btn-secondary" onClick={onJoinMentor} data-testid="alumni-button-join-mentor">
          Join as Mentor
        </button>
      </div>
    </div>
  );
}

MentorshipTab.propTypes = {
  mentors: PropTypes.arrayOf(PropTypes.object),
  onBrowseMentors: PropTypes.func,
  onJoinMentor: PropTypes.func,
};

MentorCta.propTypes = {
  onBrowseMentors: PropTypes.func,
  onJoinMentor: PropTypes.func,
};

export default function MentorshipTab({ mentors = [], onBrowseMentors, onJoinMentor }) {
  return (
    <div>
      {mentors.length > 0 && (
        <div className="sch-alu-directory-grid">
          {mentors.map((mentor) => (
            <AlumniCard key={mentor.id} alumni={mentor} />
          ))}
        </div>
      )}
      <MentorCta onBrowseMentors={onBrowseMentors} onJoinMentor={onJoinMentor} />
    </div>
  );
}

