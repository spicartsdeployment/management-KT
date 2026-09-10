import React from 'react';

/**
 * Get initials from a name (e.g., "Raj Kumar" → "RK")
 */
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get random background color for initials based on name
 */
const getAvatarColor = (name) => {
  const colors = ['#6C5CE7', '#00B894', '#0984E3', '#E17055', '#F39C12', '#8E44AD'];
  const index = name ? name.length % colors.length : 0;
  return colors[index];
};

export default function AlumniCard({ alumni, onConnect, onMessage, onCall }) {
  const initials = alumni.profilePic ? '' : (alumni.initials || getInitials(alumni.name));
  const avatarBg = alumni.profilePic ? 'transparent' : getAvatarColor(alumni.name);

  return (
    <div
      className="sch-alu-card"
      data-testid="alumni-card"
    >
      {/* Avatar left */}
      <div className="sch-alu-card-avatar" style={{ backgroundColor: avatarBg }}>
        {alumni.profilePic ? (
          <img 
            src={alumni.profilePic} 
            alt={alumni.name}
            className="sch-alu-card-avatar-img"
          />
        ) : (
          <span className="sch-alu-card-avatar-initials">{initials}</span>
        )}
      </div>
      {/* Info right */}
      <div className="sch-alu-card-content">
        <span className="sch-alu-card-name">{alumni.name}</span>
        <span className="sch-alu-card-year">Class of {alumni.year}</span>
        <span className="sch-alu-card-title">{alumni.title} at {alumni.company}</span>
        <div className="sch-alu-card-location">
          <svg className="sch-alu-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1111.314-11.314l-4.243 4.243z" /></svg>
          {alumni.location}
        </div>
      </div>
      {/* Tags at the bottom left of the card */}
      <div className="sch-alu-card-tags-wrapper">
        <div className="sch-alu-card-tags">
          {alumni.tags.filter(tag => tag.label !== 'Available for Mentoring').map((tag, idx) => (
            <span key={idx} className="sch-alu-card-tag sch-alu-tag-blue">
              {tag.label}
            </span>
          ))}
        </div>
        {alumni.tags.some(tag => tag.label === 'Available for Mentoring') && (
          <div className="sch-alu-card-mentor-wrapper">
            <span className="sch-alu-card-tag sch-alu-tag-green">
              Available for Mentoring
            </span>
          </div>
        )}
      </div>
      {/* Actions below tags */}
      <div className="sch-alu-card-actions">
        <button
          className="sch-alu-card-btn-connect"
          onClick={() => {
            window.open(`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(alumni.name)}`, '_blank');
          }}
          data-testid="alumni-button-connect"
        >
          <svg className="sch-alu-icon-linkedin" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          Connect
        </button>
        <button
          className="sch-alu-card-btn-icon"
          onClick={() => {
            window.open(`mailto:${alumni.email || ''}`);
          }}
          data-testid="alumni-button-message"
        >
          {/* Mail icon */}
          <svg className="sch-alu-icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          className="sch-alu-card-btn-icon"
          onClick={() => {
            window.open(`https://wa.me/${alumni.phone || ''}`);
          }}
          data-testid="alumni-button-call"
        >
          {/* WhatsApp icon */}
          <svg className="sch-alu-icon-sm sch-alu-icon-green" fill="currentColor" viewBox="0 0 32 32">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.661 1.934 6.661L4 29l7.523-1.927A12.96 12.96 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.982 0-3.917-.521-5.609-1.507l-.401-.232-4.471 1.146 1.195-4.364-.26-.424C6.521 19.02 6 17.045 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.255-7.255c-.287-.144-1.697-.838-1.96-.934-.263-.096-.454-.144-.646.144-.192.287-.741.934-.909 1.127-.168.192-.336.216-.623.072-.287-.144-1.213-.447-2.312-1.425-.855-.762-1.432-1.701-1.601-1.988-.168-.287-.018-.443.126-.587.13-.13.287-.336.431-.504.144-.168.192-.287.287-.479.096-.192.048-.359-.024-.504-.072-.144-.646-1.561-.885-2.137-.233-.561-.47-.484-.646-.493-.168-.007-.359-.009-.551-.009-.192 0-.504.072-.768.359-.263.287-1.01.987-1.01 2.404 0 1.417 1.036 2.785 1.181 2.978.144.192 2.04 3.116 4.941 4.244.691.298 1.229.476 1.648.609.692.221 1.322.19 1.82.115.555-.082 1.697-.693 1.938-1.363.24-.67.24-1.244.168-1.363-.072-.119-.263-.192-.55-.336z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

