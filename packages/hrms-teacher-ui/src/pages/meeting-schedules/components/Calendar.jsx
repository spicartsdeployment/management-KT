import React from 'react';

const Calendar = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="ms-card" data-testid="teacher-meetings-calendar">
      <h3 className="ms-card-title">Calendar</h3>
      <div className="ms-calendar-view">
        <p className="ms-calendar-placeholder">
          📅 Calendar view placeholder
        </p>
        <p className="ms-calendar-date">
          Selected: {selectedDate.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Calendar;
