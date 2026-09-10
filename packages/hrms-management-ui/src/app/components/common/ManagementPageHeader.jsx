import React from 'react';
import '../../../Assets/styles/ManagementPageHeader.scss';

const formatToday = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/**
 * Reusable premium management header for page-level consistency.
 */
export default function ManagementPageHeader({
  breadcrumbs = [],
  breadcrumbContent = null,
  title,
  subtitle,
  actions = null,
  academicYear = 'AY 2025-26',
  liveLabel = 'Live',
  className = '',
}) {
  return (
    <div className={`management-page-header ${className}`.trim()}>
      <div className="management-page-header__left">
        {breadcrumbContent || (breadcrumbs.length > 0 && (
          <nav className="management-page-breadcrumb" aria-label="breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const key = `${crumb.label}-${idx}`;
              return (
                <React.Fragment key={key}>
                  {idx > 0 && <span className="management-page-breadcrumb__sep">›</span>}
                  <span className={isLast ? 'management-page-breadcrumb__active' : ''}>{crumb.label}</span>
                </React.Fragment>
              );
            })}
          </nav>
        ))}
        <h1 className="management-page-title">{title}</h1>
        {subtitle && <p className="management-page-subtitle">{subtitle}</p>}
      </div>

      <div className="management-page-header__right">
        {actions && <div className="management-page-header__actions">{actions}</div>}
        <div className="management-page-header__pills">
          <div className="management-status-pill management-status-pill--live">● {liveLabel}</div>
          <div className="management-status-pill management-status-pill--year">{academicYear}</div>
          <div className="management-status-pill management-status-pill--date">{formatToday()}</div>
        </div>
      </div>
    </div>
  );
}
