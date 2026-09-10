import React from 'react';

const StatsCards = ({ stats }) => {
  const cards = [
    { label: 'Total Classes', value: stats.totalClasses, icon: '📚', color: 'blue' },
    { label: "Today's Classes", value: stats.todayClasses, icon: '📅', color: 'green' },
    { label: 'Pending Assignments', value: stats.pendingAssignments, icon: '📝', color: 'orange' },
    { label: 'Total Students', value: stats.studentsTotal, icon: '👥', color: 'purple' },
  ];

  return (
    <div className="sch-ov-stats" data-testid="teacher-overview-stats">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`ov-stat-card ov-stat-card--${card.color}`}
          data-testid={`teacher-stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="sch-ov-stat-icon">{card.icon}</div>
          <div className="sch-ov-stat-content">
            <div className="sch-ov-stat-value">{card.value}</div>
            <div className="sch-ov-stat-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
