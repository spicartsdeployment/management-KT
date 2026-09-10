import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="sch-ov-card" data-testid="teacher-overview-activity">
      <h3 className="sch-ov-card-title">Recent Activity</h3>
      <div className="sch-ov-activity-list">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="sch-ov-activity-item"
            data-testid={`teacher-activity-${activity.id}`}
          >
            <div className="sch-ov-activity-icon">
              {activity.type === 'assignment' && '📝'}
              {activity.type === 'grade' && '⭐'}
              {activity.type === 'announcement' && '📣'}
            </div>
            <div className="sch-ov-activity-content">
              <div className="sch-ov-activity-message">{activity.message}</div>
              <div className="sch-ov-activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
