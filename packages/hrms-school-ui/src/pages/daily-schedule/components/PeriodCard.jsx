import React from "react";

/**
 * PeriodCard Component - Picture 2 Design
 * Layout: Top (Tag, Subject, Chapter) → Middle (Image) → Bottom (Footer)
 * @param {Object} props - Component props
 * @param {number} props.period - Period number
 * @param {string} props.subject - Subject name
 * @param {string} props.topic - Topic/chapter name
 * @param {string} props.teacher - Teacher name
 * @param {string} props.from - Start time
 * @param {string} props.to - End time
 * @param {string} props.color - Theme color for class tag
 * @param {string} props.image - Image URL for subject
 * @returns {JSX.Element} Period card UI
 */
export default function PeriodCard({ period, subject, topic, teacher, from, to, color, image, status }) {
  const displayStatus = status || null;
  
  // Generate darker version of rgba color for tag background
  const getDarkerTagColor = (rgbaColor) => {
    if (!rgbaColor) return 'rgba(55, 65, 81, 0.2)';
    
    // Parse rgba values
    const rgbaMatch = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      const a = parseFloat(rgbaMatch[4] || 1);
      
      // Make darker by reducing RGB values and increasing alpha
      const darkerR = Math.round(r * 0.7);
      const darkerG = Math.round(g * 0.7);
      const darkerB = Math.round(b * 0.7);
      const darkerA = Math.min(a * 3, 0.5); // Increase opacity significantly
      
      return `rgba(${darkerR}, ${darkerG}, ${darkerB}, ${darkerA})`;
    }
    
    return 'rgba(55, 65, 81, 0.2)';
  };
  
  return (
    <div 
      className={`sch-ds-period-card ${displayStatus || ''}`}
      data-testid="school-card-period"
      data-subject={subject}
      data-period={period}
      style={{
        backgroundColor: color || 'white'
      }}
    >
      {/* Top Section: Tag, Subject, Chapter */}
      <div className="sch-ds-period-card__header" style={{ backgroundColor: color || 'white' }}>
        <span 
          className="sch-ds-period-card__tag" 
          style={{ 
            backgroundColor: getDarkerTagColor(color)
          }}
          data-testid="school-label-period"
        >
          Class {period}
        </span>
        
        <h3 className="sch-ds-period-card__subject" data-testid="school-text-subject">
          {subject}
        </h3>
        
        <p className="sch-ds-period-card__chapter" data-testid="school-text-topic">
          {topic}
        </p>
        
        {/* Status Badges - positioned absolute in header */}
        {displayStatus === 'live' && (
          <span className="sch-ds-period-card__live-badge">
            <span className="sch-ds-period-card__live-dot"></span>
            Live
          </span>
        )}
        
        {displayStatus === 'completed' && (
          <span className="sch-ds-period-card__completed-badge">
            <svg className="sch-ds-period-card__check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
            </svg>
          </span>
        )}
      </div>
      
      {/* Middle Section: Image */}
      <div className="sch-ds-period-card__image-area">
        {image ? (
          <img 
            src={image} 
            alt={subject} 
            className="sch-ds-period-card__image" 
            loading="lazy"
          />
        ) : (
          <div className="sch-ds-period-card__image-placeholder">
            <span className="sch-ds-period-card__image-icon">📚</span>
          </div>
        )}
      </div>
      
      {/* Bottom Section: Footer */}
      <div className="sch-ds-period-card__footer" style={{ backgroundColor: color || 'white' }}>
        <div className="sch-ds-period-card__teacher" data-testid="school-text-teacher">
          <svg className="sch-ds-period-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" strokeWidth="2" />
            <path strokeWidth="2" d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
          </svg>
          <span>{teacher}</span>
        </div>
        <div className="sch-ds-period-card__time" data-testid="school-text-time">
          <svg className="sch-ds-period-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
          <span>{from} – {to}</span>
        </div>
      </div>
    </div>
  );
}
