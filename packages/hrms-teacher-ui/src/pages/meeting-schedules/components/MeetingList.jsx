import React from 'react';

const MeetingList = ({ meetings }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="ms-card" data-testid="teacher-meetings-list">
      <h3 className="ms-card-title">Today's Meetings</h3>
      <div className="ms-items">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="ms-item" data-testid={`teacher-meeting-${meeting.id}`}>
            <div className="ms-item-main">
              <h4 className="ms-item-title">{meeting.title}</h4>
              <div className="ms-item-details">
                <span>⏰ {meeting.time}</span>
                <span>👥 {meeting.attendees} attendees</span>
              </div>
            </div>
            <span className={`ms-badge ms-badge--${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingList;
