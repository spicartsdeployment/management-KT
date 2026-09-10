import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StatusBadge from './StatusBadge';

const GRADIENTS = [
  'linear-gradient(135deg,#c97b5b,#8b4513)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#0ea5e9,#2563eb)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#d97706)',
  'linear-gradient(135deg,#ec4899,#db2777)',
];

const pickGradient = (name = '') => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

// ── Icon components ───────────────────────────────────────────
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const GradCapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10l-10-6L2 10l10 6 10-6z"/>
    <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

// ── Card sub-components ───────────────────────────────────────
const CardAvatar = ({ photo, fullName }) => (
  <div
    className="sch-alu-card-avatar"
    style={!photo ? { background: pickGradient(fullName) } : undefined}
  >
    {photo
      ? <img src={photo} alt={fullName} className="sch-alu-card-avatar-img" />
      : <span>{getInitials(fullName)}</span>
    }
  </div>
);
CardAvatar.propTypes = { photo: PropTypes.string, fullName: PropTypes.string.isRequired };
CardAvatar.defaultProps = { photo: null };

const CardInfo = ({ fullName, yearOfPassing, jobTitle, company, city, stateCountry, highestDegree, universityName }) => (
  <div className="sch-alu-card-info">
    <p className="sch-alu-card-name">{fullName}</p>
    {yearOfPassing && <p className="sch-alu-card-class">Class of {yearOfPassing}</p>}
    {(jobTitle || company) && (
      <p className="sch-alu-card-job">{[jobTitle, company].filter(Boolean).join(' at ')}</p>
    )}
    {(highestDegree || universityName) && (
      <p className="sch-alu-card-edu">
        <GradCapIcon />
        {[highestDegree, universityName].filter(Boolean).join(', ')}
      </p>
    )}
    {(city || stateCountry) && (
      <p className="sch-alu-card-location">
        <PinIcon />
        {[city, stateCountry].filter(Boolean).join(', ')}
      </p>
    )}
  </div>
);
CardInfo.propTypes = {
  fullName: PropTypes.string.isRequired,
  yearOfPassing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  jobTitle: PropTypes.string, company: PropTypes.string,
  city: PropTypes.string, stateCountry: PropTypes.string,
  highestDegree: PropTypes.string, universityName: PropTypes.string,
};
CardInfo.defaultProps = { yearOfPassing: '', jobTitle: '', company: '', city: '', stateCountry: '', highestDegree: '', universityName: '' };

const CardTags = ({ industry, mainSkill, availableForMentoring }) => (
  <div className="sch-alu-card-tags">
    {industry && <span className="sch-alu-card-chip">{industry}</span>}
    {mainSkill && <span className="sch-alu-card-chip">{mainSkill}</span>}
    {availableForMentoring && (
      <span className="sch-alu-card-chip sch-alu-card-chip--mentor">&#10003; Available for Mentoring</span>
    )}
  </div>
);
CardTags.propTypes = {
  industry: PropTypes.string, mainSkill: PropTypes.string, availableForMentoring: PropTypes.bool,
};
CardTags.defaultProps = { industry: '', mainSkill: '', availableForMentoring: false };

const CardActions = ({ linkedIn, email, phone }) => (
  <div className="sch-alu-card-actions">
    <a
      href={linkedIn || (email ? `mailto:${email}` : '#')}
      target={linkedIn ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="sch-alu-card-connect-btn"
      data-testid="school-button-card-connect"
    >
      <LinkedInIcon /> Connect
    </a>
    {email && (
      <a href={`mailto:${email}`} className="sch-alu-card-icon-btn" aria-label="Email" data-testid="school-button-card-email">
        <MailIcon />
      </a>
    )}
    {phone && (
      <a
        href={`https://wa.me/${phone.replace(/\D/g, '')}`}
        target="_blank" rel="noopener noreferrer"
        className="sch-alu-card-icon-btn sch-alu-card-icon-btn--whatsapp"
        aria-label="WhatsApp" data-testid="school-button-card-whatsapp"
      >
        <ChatIcon />
      </a>
    )}
  </div>
);
CardActions.propTypes = { linkedIn: PropTypes.string, email: PropTypes.string, phone: PropTypes.string };
CardActions.defaultProps = { linkedIn: '', email: '', phone: '' };

// ── Delete confirmation modal ─────────────────────────────────
const TrashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const DeleteModalButtons = ({ onConfirm, onCancel }) => (
  <div className="sch-alu-delete-actions">
    <button className="sch-alu-delete-btn-cancel" onClick={onCancel} data-testid="school-button-delete-cancel">
      Cancel
    </button>
    <button className="sch-alu-delete-btn-confirm" onClick={onConfirm} data-testid="school-button-delete-confirm">
      Yes, Delete
    </button>
  </div>
);
DeleteModalButtons.propTypes = { onConfirm: PropTypes.func.isRequired, onCancel: PropTypes.func.isRequired };

const DeleteConfirmModal = ({ fullName, onConfirm, onCancel }) => (
  <div
    className="sch-alu-delete-overlay"
    role="dialog" aria-modal="true" aria-label="Confirm deletion"
    data-testid="school-modal-delete-confirm"
    onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
  >
    <div className="sch-alu-delete-modal">
      <div className="sch-alu-delete-icon" aria-hidden="true"><TrashIcon /></div>
      <h4 className="sch-alu-delete-title">Delete Enrollment?</h4>
      <p className="sch-alu-delete-body">
        Are you sure you want to delete the enrollment for <strong>{fullName}</strong>? This action cannot be undone.
      </p>
      <DeleteModalButtons onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  </div>
);
DeleteConfirmModal.propTypes = {
  fullName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const CardFooter = ({ status, alumni, onEdit, onRequestDelete, testId }) => (
  <div className="sch-alu-card-footer">
    <StatusBadge status={status} />
    {status !== 'approved' && (
      <div className="sch-alu-card-footer-btns">
        <button
          className="sch-alu-card-btn-edit"
          onClick={() => onEdit(alumni)}
          data-testid={`school-button-edit-${testId}`}
        >
          ✏️ Edit
        </button>
        <button
          className="sch-alu-card-btn-delete"
          onClick={onRequestDelete}
          data-testid={`school-button-delete-${testId}`}
        >
          🗑️ Delete
        </button>
      </div>
    )}
  </div>
);
CardFooter.propTypes = {
  status: PropTypes.string.isRequired,
  alumni: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  testId: PropTypes.string,
};
CardFooter.defaultProps = { testId: '' };

/**
 * EnrolledAlumniCard – Alumni profile card matching the directory design.
 * Shows gradient avatar, chips, connect actions, status badge, edit/delete.
 * @param {object} alumni - enrollment record
 * @param {function} onEdit - edit callback
 * @param {function} onDelete - delete callback
 */
const EnrolledAlumniCard = ({ alumni, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { photo, fullName, yearOfPassing, jobTitle, company, city, stateCountry,
    industry, mainSkill, availableForMentoring, linkedIn, email, phone, studentId, status,
    highestDegree, universityName } = alumni;
  const testId = studentId || fullName;
  return (
    <div className="sch-alu-enroll-card" data-testid={`school-card-enrolled-${testId}`}>
      <div className="sch-alu-card-top">
        <CardAvatar photo={photo} fullName={fullName} />
        <CardInfo fullName={fullName} yearOfPassing={yearOfPassing}
          jobTitle={jobTitle} company={company} city={city} stateCountry={stateCountry}
          highestDegree={highestDegree} universityName={universityName} />
      </div>
      <CardTags industry={industry} mainSkill={mainSkill} availableForMentoring={availableForMentoring} />
      <CardActions linkedIn={linkedIn} email={email} phone={phone} />
      <CardFooter status={status} alumni={alumni} onEdit={onEdit}
        onRequestDelete={() => setShowConfirm(true)} testId={testId} />
      {showConfirm && (
        <DeleteConfirmModal fullName={fullName}
          onConfirm={() => { setShowConfirm(false); onDelete(alumni); }}
          onCancel={() => setShowConfirm(false)} />
      )}
    </div>
  );
};
EnrolledAlumniCard.propTypes = {
  alumni: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EnrolledAlumniCard;
