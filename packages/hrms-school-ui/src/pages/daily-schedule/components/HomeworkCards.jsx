import React from "react";

/**
 * HomeworkCards Component - Picture 2 Design
 * Displays yesterday's, today's, pending (last 10 days), and upcoming homework
 * @param {Object} props - Component props
 * @param {Array} props.yesterdayHomework - Yesterday's homework list
 * @param {Array} props.todayHomework - Today's homework list
 * @param {Array} props.pendingHomework - Pending homework from last 10 days (optional)
 * @param {Array} props.upcomingHomework - Upcoming homework (due date > today) (optional)
 * @returns {JSX.Element} Homework cards UI
 */
export default function HomeworkCards({ yesterdayHomework, todayHomework, pendingHomework = [], upcomingHomework = [] }) {
  // Motivational messages for when there's no upcoming homework
  const MOTIVATIONAL_MESSAGES = [
    { emoji: '🎉', text: 'All finished! Great work!' },
    { emoji: '⭐', text: 'No upcoming homework. Keep it up!' },
    { emoji: '🏆', text: 'You\'re on top of your work!' },
    { emoji: '✨', text: 'Amazing! All tasks completed.' },
    { emoji: '🚀', text: 'You\'re ahead of schedule. Awesome!' },
    { emoji: '😊', text: 'You\'re doing great. No pending work!' },
    { emoji: '💪', text: 'Keep up the good work!' },
    { emoji: '🌟', text: 'Perfect! No homework yet.' },
  ];

  // Select a random motivational message
  const getRandomMessage = () => {
    return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
  };

  // Map API homework data to UI shape for yesterdayHomework
  const mappedYesterdayHomework = (yesterdayHomework || []).map(hw => ({
    subject: hw.subjectName,
    topic: hw.assignmentTitle,
    submitted: hw.submissionStatus === "Submitted",
    timestamp: hw.statusMessage
  }));

  const subjectIcons = {
    "Mathematics": "➗",
    "Math": "➗",
    "Physics": "🧪",
    "Chemistry": "⚗️",
    "English": "📘",
    "History": "📜",
    "CS": "💻",
    "PE": "⚽",
    "Art & Design": "🎨",
    "Art": "🎨",
    "Biology": "🔬",
    "Geography": "🌍",
    "Science": "🔬"
  };

  // Subject colors for pastel backgrounds
  const subjectColors = {
    "Mathematics": { bg: "#fef3c7", border: "#f59e0b" },
    "Math": { bg: "#fef3c7", border: "#f59e0b" },
    "Physics": { bg: "#e0f2fe", border: "#0ea5e9" },
    "Chemistry": { bg: "#f3e8ff", border: "#a855f7" },
    "English": { bg: "#dbeafe", border: "#3b82f6" },
    "History": { bg: "#fce7f3", border: "#ec4899" },
    "CS": { bg: "#d1fae5", border: "#10b981" },
    "PE": { bg: "#fee2e2", border: "#ef4444" },
    "Art & Design": { bg: "#fae8ff", border: "#d946ef" },
    "Art": { bg: "#fae8ff", border: "#d946ef" },
    "Biology": { bg: "#dcfce7", border: "#22c55e" },
    "Geography": { bg: "#cffafe", border: "#06b6d4" },
    "Science": { bg: "#dcfce7", border: "#22c55e" }
  };

  // Filter unsubmitted homework from yesterday
  const unsubmittedYesterday = mappedYesterdayHomework.filter(hw => !hw.submitted);
  // Only show NOT submitted homework from yesterday (previous pending homework)
  const yesterdayNotSubmitted = mappedYesterdayHomework.filter(hw => !hw.submitted);
  // Combine pending homework from last 10 days with yesterday's not submitted
  const allPreviousPending = [
    ...yesterdayNotSubmitted,
    ...pendingHomework.filter(hw => !hw.submitted)
  ];
  // Combine unsubmitted yesterday homework with today's homework
  const combinedTodayHomework = [
    ...unsubmittedYesterday.map(hw => ({
      ...hw,
      fromYesterday: true,
      dueTime: hw.timestamp
    })),
    ...todayHomework
  ];

  const renderHomeworkItem = (hw, index, isYesterday) => {
    const icon = subjectIcons[hw.subject] || "📚";
    
    // Determine status for chip and card state
    let statusText = '';
    let statusClass = '';
    let cardStateClass = '';
    let statusIcon = '';
    let timeColor = '';
    
    if (isYesterday) {
      statusText = hw.submitted ? "Submitted" : "Not Submitted";
      statusClass = hw.submitted ? 'sch-ds-homework-chip--success' : 'sch-ds-homework-chip--error';
      cardStateClass = hw.submitted ? 'submitted' : 'not-submitted';
      statusIcon = hw.submitted ? '✓' : '✕';
      timeColor = hw.submitted ? '#15803d' : '#b91c1c';
    } else {
      if (hw.fromYesterday) {
        statusText = "Overdue";
        statusClass = 'sch-ds-homework-chip--error';
        cardStateClass = 'due';
        statusIcon = '✕';
        timeColor = '#b91c1c';
      } else {
        statusText = hw.submitted ? "Submitted" : "Pending";
        statusClass = hw.submitted ? 'sch-ds-homework-chip--success' : 'sch-ds-homework-chip--warning';
        cardStateClass = hw.submitted ? 'submitted' : 'pending';
        statusIcon = hw.submitted ? '✓' : '⏱';
        timeColor = hw.submitted ? '#15803d' : '#d97706';
      }
    }
    
    return (
      <div 
        key={index} 
        className={`sch-ds-homework-item-card ${cardStateClass}`}
        data-testid={`school-homework-${isYesterday ? 'yesterday' : 'today'}-${index}`}
      >
        {/* Subject Icon */}
        <div className="sch-ds-homework-item-card__icon">
          {icon}
        </div>
        
        {/* Header - Right of Icon */}
        <div className="sch-ds-homework-item-card__header">
          <h4 className="sch-ds-homework-item-card__subject">{hw.subject}</h4>
          {hw.fromYesterday && (
            <span className="sch-ds-homework-chip sch-ds-homework-chip--overdue">
              Not submitted yesterday
            </span>
          )}
        </div>
        
        {/* Details - Below Icon */}
        <div className="sch-ds-homework-item-card__details">
          <p className="sch-ds-homework-item-card__chapter">{hw.topic}</p>
          <span className="sch-ds-homework-item-card__time" style={{ color: timeColor }}>
            {isYesterday ? hw.timestamp : hw.dueTime}
          </span>
        </div>
        
        {/* Status Chip */}
        <div className="sch-ds-homework-item-card__status">
          <span className={statusClass}>
            {statusIcon} {statusText}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="sch-ds-homework-section" data-testid="school-container-homework-cards">
      {/* Previous Homework Panel */}
      <div className="sch-ds-homework-panel sch-ds-homework-panel--yesterday" data-testid="school-card-yesterday-homework">
        <div className="sch-ds-homework-panel__header">
          <div className="sch-ds-homework-panel__icon sch-ds-homework-panel__icon--yesterday">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="sch-ds-homework-panel__title-group">
            <h3 className="sch-ds-homework-panel__title">Previous Homework</h3>
            <p className="sch-ds-homework-panel__subtitle">Pending Submissions</p>
          </div>
          {/* <div className="sch-ds-homework-panel__count">
            {allPreviousPending.length} Pending
          </div> */}
        </div>
        <div className="sch-ds-homework-panel__content">
          {allPreviousPending.length > 0 ? (
            allPreviousPending.map((hw, idx) => renderHomeworkItem(hw, idx, true))
          ) : (
            <div className="sch-ds-homework-panel__empty">
              <span>✅</span>
              <p>No pending homework</p>
            </div>
          )}
        </div>
      </div>

      {/* Today's Homework Panel */}
      <div className="sch-ds-homework-panel sch-ds-homework-panel--today" data-testid="school-card-today-homework">
        <div className="sch-ds-homework-panel__header">
          <div className="sch-ds-homework-panel__icon sch-ds-homework-panel__icon--today">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="sch-ds-homework-panel__title-group">
            <h3 className="sch-ds-homework-panel__title">Today&apos;s Homework</h3>
            <p className="sch-ds-homework-panel__subtitle">Due by End of Day</p>
          </div>
          {/* <div className="sch-ds-homework-panel__count">
            {combinedTodayHomework.filter(hw => hw.submitted).length}/{combinedTodayHomework.length} Done
          </div> */}
        </div>
        <div className="sch-ds-homework-panel__content">
          {combinedTodayHomework.length > 0 ? (
            combinedTodayHomework.map((hw, idx) => renderHomeworkItem(hw, idx, false))
          ) : (
            <div className="sch-ds-homework-panel__empty">
              <span>🎉</span>
              <p>No homework for today!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Homework Panel (Full Width) */}
      <div 
        className="sch-ds-homework-panel sch-ds-homework-panel--upcoming" 
        data-testid="school-card-upcoming-homework"
        style={{ gridColumn: '1 / -1' }}
      >
        <div className="sch-ds-homework-panel__header">
          <div className="sch-ds-homework-panel__icon sch-ds-homework-panel__icon--upcoming" style={{ background: '#f0fdf4' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect x="3" y="4" width="18" height="18" rx="2"></rect>
              <path d="M3 10h18"></path>
              <path d="M10 16l2 2 4-4"></path>
            </svg>
          </div>
          <div className="sch-ds-homework-panel__title-group">
            <h3 className="sch-ds-homework-panel__title">Upcoming Homework</h3>
            <p className="sch-ds-homework-panel__subtitle">Due after today</p>
          </div>
          {/* <div className="sch-ds-homework-panel__count">
              {upcomingHomework.length} Assignment{upcomingHomework.length !== 1 ? 's' : ''}
            </div> */}
          </div>
          <div className="sch-ds-homework-panel__content">
            {upcomingHomework.length > 0 ? (
              upcomingHomework.map((hw, idx) => (
                <div 
                  key={`upcoming-${idx}`}
                  className="sch-ds-homework-item-card pending"
                  data-testid={`school-homework-upcoming-${idx}`}
                >
                  {/* Subject Icon */}
                  <div className="sch-ds-homework-item-card__icon">
                    {subjectIcons[hw.subject] || "📚"}
                  </div>
                  
                  {/* Header - Right of Icon */}
                  <div className="sch-ds-homework-item-card__header">
                    <h4 className="sch-ds-homework-item-card__subject">{hw.subject}</h4>
                  </div>
                  
                  {/* Details - Below Icon */}
                  <div className="sch-ds-homework-item-card__details">
                    <p className="sch-ds-homework-item-card__chapter">
                      {hw.topic || hw.description || "No description provided"}
                    </p>
                    <span className="sch-ds-homework-item-card__time" style={{ color: '#10b981' }}>
                     Due: {hw.dueDate || hw.lastDate || hw.dueTime}
                    </span>
                  </div>
                  
                  {/* Status Chip */}
                  <div className="sch-ds-homework-item-card__status">
                    <span className="sch-ds-homework-chip--upcoming">
                      📅 Upcoming
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="sch-ds-homework-panel__empty">
                <span>{getRandomMessage().emoji}</span>
                <p>{getRandomMessage().text}</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
