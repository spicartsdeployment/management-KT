import React from "react";

/**
 * PageLoader Component
 * Attractive loading screen with animated spinner
 * @returns {JSX.Element} Loading UI
 */
export default function PageLoader() {
  return (
    <div className="sch-ds-page-loader" data-testid="school-loader-page">
      <div className="sch-ds-page-loader__content">
        <div className="sch-ds-page-loader__spinner-container">
          <svg className="sch-ds-page-loader__spinner" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="loaderGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <circle 
              className="sch-ds-page-loader__spinner-track" 
              cx="50" 
              cy="50" 
              r="45"
            />
            <circle 
              className="sch-ds-page-loader__spinner-progress" 
              cx="50" 
              cy="50" 
              r="45"
            />
          </svg>
          <div className="sch-ds-page-loader__icon">📚</div>
        </div>
        
        <div className="sch-ds-page-loader__text">
          <h3 className="sch-ds-page-loader__title">Loading Your Schedule</h3>
          <p className="sch-ds-page-loader__subtitle">Please wait a moment...</p>
        </div>
        
        <div className="sch-ds-page-loader__dots">
          <span className="sch-ds-page-loader__dot"></span>
          <span className="sch-ds-page-loader__dot"></span>
          <span className="sch-ds-page-loader__dot"></span>
        </div>
      </div>
    </div>
  );
}
