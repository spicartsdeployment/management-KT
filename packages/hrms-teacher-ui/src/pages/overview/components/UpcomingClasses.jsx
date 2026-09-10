import React from 'react';

const UpcomingClasses = ({ classes }) => {
  return (
    <div className="sch-ov-card" data-testid="teacher-overview-classes">
      <h3 className="sch-ov-card-title">Upcoming Classes</h3>
      <div className="sch-ov-classes-list">
        {classes.map((cls) => (
          <div 
            key={cls.id} 
            className="sch-ov-class-item"
            data-testid={`teacher-class-${cls.id}`}
          >
            <div className="sch-ov-class-info">
              <div className="sch-ov-class-name">{cls.class}</div>
              <div className="sch-ov-class-room">{cls.room}</div>
            </div>
            <div className="sch-ov-class-time">{cls.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
