import React from 'react';
import PropTypes from 'prop-types';

const STAT_DEFS = [
  { id: 1, label: 'Total Alumni',     key: 'totalAlumni',     icon: 'user-group',    iconBg: 'bg-blue-100',   iconColor: 'text-white', testid: 'alumni-stat-total' },
  { id: 2, label: 'Active Members',   key: 'activeMembers',   icon: 'user-group',    iconBg: 'bg-green-100',  iconColor: 'text-white', testid: 'alumni-stat-active' },
  { id: 3, label: 'Upcoming Events',  key: 'upcomingEvents',  icon: 'calendar-days', iconBg: 'bg-purple-100', iconColor: 'text-white', testid: 'alumni-stat-events' },
  { id: 4, label: 'Mentors Available',key: 'mentorsAvailable',icon: 'briefcase',     iconBg: 'bg-red-100',    iconColor: 'text-white', testid: 'alumni-stat-mentors' },
];

/** Builds the stats array, falling back to '-' for missing values. */
function buildStats(directoryStats) {
  return STAT_DEFS.map((def) => ({ ...def, value: directoryStats[def.key] ?? '-' }));
}

function getIcon(icon, className) {
  switch (icon) {
    case 'user-group':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      );
    case 'user-check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      );
    case 'calendar-days':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4m-5 4h18" /></svg>
      );
    case 'briefcase':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
      );
    default:
      return null;
  }
}

StatsCards.propTypes = {
  directoryStats: PropTypes.object,
};

export default function StatsCards({ directoryStats = {} }) {
  const stats = buildStats(directoryStats);
  return (
    <div className="sch-alu-stats-row">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="sch-alu-stats-card"
          data-testid={stat.testid}
        >
          <div className="sch-alu-stats-card-content">
            <span className="sch-alu-stats-label">{stat.label}</span>
            <span className="sch-alu-stats-value">{stat.value}</span>
          </div>
          <div className={`sch-alu-stats-icon-bg ${stat.iconBg}`}>
            {getIcon(stat.icon, `sch-alu-stats-icon ${stat.iconColor}`)}
          </div>
        </div>
      ))}
    </div>
  );
}

