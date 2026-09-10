import React from "react";

/**
 * LunchBreakCard Component - Picture 2 Design
 * Displays break cards (morning, lunch, evening) with centered icon and duration
 * @param {Object} props - Component props
 * @param {string} props.from - Start time
 * @param {string} props.to - End time
 * @param {string} props.type - Break type: 'lunch', 'morning', or 'evening'
 * @param {string} props.label - Custom label for break
 * @param {string} props.duration - Duration text
 * @returns {JSX.Element} Break card UI
 */
export default function LunchBreakCard({ from, to, type = "lunch", label, duration }) {
  const isLunch = type === "lunch";
  const isMorning = type === "morning";
  const isEvening = type === "evening";
  const displayLabel = label || (isLunch ? "Lunch Break" : isMorning ? "Morning Break" : "Evening Break");
  const displayDuration = duration || `${from} – ${to}`;
  const lunchDetail = `${from} – ${to} • Cafeteria • Enjoy your meal!`;
  
  // Get appropriate icon and styling based on break type
  const getBreakIcon = () => {
    if (isLunch) {
      return <span className="sch-ds-break-card__emoji">🍱</span>;
    } else if (isMorning) {
      return (
        <svg className="sch-ds-break-card__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      );
    } else {
      return (
        <svg className="sch-ds-break-card__icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 8a3 3 0 01-6 0m3-3v3m0 0v3"/>
        </svg>
      );
    }
  };
  
  return (
    <div 
      className={`sch-ds-break-card sch-ds-break-card--${type}`} 
      data-testid="school-card-lunch-break"
    >
      {/* Icon Container */}
      <div className="sch-ds-break-card__icon-container">
        {getBreakIcon()}
      </div>
      
      {/* Content */}
      <div className="sch-ds-break-card__content">
        <span className="sch-ds-break-card__label">{displayLabel}</span>
        {isLunch ? (
          <span className="sch-ds-break-card__duration">{lunchDetail}</span>
        ) : (
          <span className="sch-ds-break-card__duration">{displayDuration}</span>
        )}
      </div>
    </div>
  );
}
