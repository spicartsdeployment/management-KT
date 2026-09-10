import React from "react";
import "../../assets/scss/PageLoader.scss";

/**
 * Generic PageLoader Component
 * Attractive loading screen with animated spinner
 * @param {Object} props - Component props
 * @param {string} props.title - Loading title text (default: "Loading...")
 * @param {string} props.subtitle - Loading subtitle text (default: "Please wait a moment...")
 * @param {string} props.icon - Emoji icon to display (default: "📚")
 * @returns {JSX.Element} Loading UI
 */
export default function PageLoader({ 
  title = "Loading...", 
  subtitle = "Please wait a moment...", 
  icon = "📚" 
}) {
  return (
    <div className="sch-page-loader" data-testid="school-loader-page">
      <div className="sch-page-loader__content">
        <div className="sch-page-loader__spinner-container">
          <svg className="sch-page-loader__spinner" viewBox="0 0 100 100">
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
              className="sch-page-loader__spinner-track" 
              cx="50" 
              cy="50" 
              r="45"
            />
            <circle 
              className="sch-page-loader__spinner-progress" 
              cx="50" 
              cy="50" 
              r="45"
            />
          </svg>
          <div className="sch-page-loader__icon">{icon}</div>
        </div>
        
        <div className="sch-page-loader__text">
          <h3 className="sch-page-loader__title">{title}</h3>
          <p className="sch-page-loader__subtitle">{subtitle}</p>
        </div>
        
        <div className="sch-page-loader__dots">
          <span className="sch-page-loader__dot"></span>
          <span className="sch-page-loader__dot"></span>
          <span className="sch-page-loader__dot"></span>
        </div>
      </div>
    </div>
  );
}
