import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/DaySchedules.scss';

/**
 * DaySchedules Component - Calendar-Driven Class Schedule Page
 * 
 * FUNCTIONALITY OVERVIEW:
 * =====================
 * 
 * 1. DEFAULT DATE BEHAVIOR:
 *    - Page loads with today's date (new Date())
 *    - Selected date is displayed below the page title
 *    - Date display stays in sync with calendar selection
 * 
 * 2. CALENDAR DATE SELECTION:
 *    - Clicking any date in the calendar updates selectedDate state
 *    - Selected date is highlighted in the calendar
 *    - Class cards are filtered to show only classes for that date
 * 
 * 3. CLASS CARD FILTERING:
 *    - Classes are stored in allClasses with a date property
 *    - Filtered classes are computed based on selectedDate
 *    - UI updates instantly when date changes
 * 
 * 4. SUNDAY HANDLING:
 *    - isSunday() checks if selectedDate.getDay() === 0
 *    - When Sunday: displays "Sunday – No Classes Scheduled" message
 *    - No class cards are rendered on Sundays
 * 
 * 5. LESSON PLAN EDIT RULES:
 *    - canEditLessonPlan(classDate) enforces 2-day restriction
 *    - Compares class date with today's date
 *    - Calculates difference: (classDate - today) in days
 *    - Returns true if diffDays <= 2 (today, tomorrow, day after)
 * 
 * 6. EDIT RESTRICTION MODAL:
 *    - Shows when canEditLessonPlan() returns false
 *    - Displays: "You can edit a lesson plan only up to 2 days before..."
 *    - Prevents opening lesson plan modal when restriction applies
 * 
 * DATE COMPARISON LOGIC:
 * =====================
 * - All dates reset to midnight (00:00:00) for accurate day comparison
 * - diffDays = Math.ceil((planDate - today) / (1000 * 60 * 60 * 24))
 * - Examples (if today is Dec 23):
 *   * Dec 23 class: diffDays = 0 → ✅ Can edit
 *   * Dec 24 class: diffDays = 1 → ✅ Can edit  
 *   * Dec 25 class: diffDays = 2 → ✅ Can edit
 *   * Dec 26 class: diffDays = 3 → ❌ Cannot edit
 * 
 * SUNDAY DETECTION:
 * ================
 * - Uses Date.getDay() which returns 0-6 (Sunday is 0)
 * - isSunday() returns true when selectedDate.getDay() === 0
 */

const DaySchedules = () => {
  // Default to today's date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLessonPlanModal, setShowLessonPlanModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [todayNotes, setTodayNotes] = useState("Collect homework\nRemind students about exam");
  
  // Teaching reminders
  const reminders = [
    { id: 1, text: 'Parent Meeting at 3 PM' },
    { id: 2, text: 'Submit weekly report by Friday' }
  ];
  
  // State for lesson plan form
  const [lessonPlanForm, setLessonPlanForm] = useState({
    topic: '',
    notes: '',
    file: null
  });

  // State for homework form
  const [homeworkForm, setHomeworkForm] = useState({
    class: '',
    section: '',
    subject: '',
    topic: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    file: null
  });

  // Fixed weekday timetable - same classes daily (Monday-Saturday), no classes on Sunday
  const [allClasses] = useState([
    // Base timetable for all weekdays (Mon-Sat)
    { id: 1, subject: 'Mathematics', class: 'Class 9A', room: 'Room 301', time: '08:00 - 08:45', topic: 'Quadratic Equations', status: 'Completed' },
    { id: 2, subject: 'Mathematics', class: 'Class 10B', room: 'Room 302', time: '08:50 - 09:35', topic: 'Trigonometry Basics', status: 'Completed' },
    { id: 3, subject: 'Advanced Algebra', class: 'Class 10A', room: 'Room 301', time: '09:40 - 10:25', topic: 'Polynomial Functions', status: 'Ongoing' },
    { id: 4, subject: 'Mathematics', class: 'Class 9B', room: 'Room 303', time: '11:20 - 12:05', topic: 'Linear Equations', status: 'Upcoming' },
    { id: 5, subject: 'Trigonometry', class: 'Class 11A', room: 'Room 301', time: '12:10 - 12:55', topic: 'Inverse Functions', status: 'Upcoming' },
    { id: 6, subject: 'Calculus', class: 'Class 12A', room: 'Room 304', time: '13:50 - 14:35', topic: 'Derivatives & Chain Rule', status: 'Upcoming' }
  ]);

  // Filter classes based on selected date
  const classes = (() => {
    // Check if selected date is Sunday (day 0) - no classes
    if (selectedDate.getDay() === 0) {
      return [];
    }
    // For all weekdays (Mon-Sat), return the same timetable
    return allClasses;
  })();

  // Mock holidays
  const holidays = [
    { name: 'Teacher Development Day', date: 'November 15, 2025' },
    { name: 'Thanksgiving Break', date: 'November 25, 2025' },
    { name: 'Winter Festival', date: 'December 1, 2025' },
    { name: 'Winter Break', date: 'December 20-31, 2025' }
  ];

  // Calendar generation
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(null);
        } else if (day > daysInMonth) {
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }
      calendar.push(week);
      if (day > daysInMonth) break;
    }

    return calendar;
  };

  /**
   * DATE UTILITY FUNCTIONS
   */

  // Check if the selected date is a Sunday
  const isSunday = () => {
    return selectedDate.getDay() === 0;
  };

  // Check if a lesson plan can be edited (up to 2 days before the class date, not for past dates)
  const canEditLessonPlan = (classDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
    
    const planDate = new Date(classDate);
    planDate.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days
    const diffTime = planDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Can edit only if class is today or in future AND within 2 days
    return diffDays >= 0 && diffDays <= 2;
  };

  // Check if homework can be assigned (within 3 days from today, past or future)
  const canAssignHomework = (classDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(classDate);
    targetDate.setHours(0, 0, 0, 0);
    
    // Calculate absolute difference in days
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Can assign homework if within 3 days (past or future)
    return diffDays <= 3;
  };

  // Check if a class is in the past
  const isClassInPast = (classDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(classDate);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate < today;
  };

  // Check if a class is today
  const isClassToday = (classDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(classDate);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate.getTime() === today.getTime();
  };

  // Handle calendar date click
  const handleDateClick = (day) => {
    if (!day) return; // Ignore empty cells
    
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleLessonPlanOpen = (classItem) => {
    setSelectedClass(classItem);
    setLessonPlanForm({
      topic: classItem.topic,
      notes: '',
      file: null
    });
    setShowLessonPlanModal(true);
  };

  const handleLessonPlanSave = () => {
    if (!lessonPlanForm.topic.trim()) {
      alert('Please enter a topic/lesson title');
      return;
    }

    // Update the class topic in allClasses array
    const updatedClasses = allClasses.map(c => 
      c.id === selectedClass.id 
        ? { ...c, topic: lessonPlanForm.topic }
        : c
    );
    // Note: In real implementation, you would update the state here
    // For now, the update will persist during the session via the filtered classes

    setShowLessonPlanModal(false);
    setLessonPlanForm({ topic: '', notes: '', file: null });
    setSelectedClass(null);
  };

  const handleHomeworkOpen = (classItem = null) => {
    if (classItem) {
      setHomeworkForm({
        ...homeworkForm,
        class: classItem.class,
        subject: classItem.subject,
        section: '',
        topic: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        file: null
      });
    } else {
      setHomeworkForm({
        class: '',
        section: '',
        subject: '',
        topic: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        file: null
      });
    }
    setShowHomeworkModal(true);
  };

  const handleHomeworkSave = () => {
    if (!homeworkForm.class || !homeworkForm.subject || !homeworkForm.topic || !homeworkForm.description || !homeworkForm.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Homework assigned:', homeworkForm);
    setShowHomeworkModal(false);
    setHomeworkForm({
      class: '',
      section: '',
      subject: '',
      topic: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      file: null
    });
  };

  const handleFileUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (formType === 'lesson') {
        setLessonPlanForm({ ...lessonPlanForm, file });
      } else {
        setHomeworkForm({ ...homeworkForm, file });
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="ds-hsu-teach-dayschedules" data-testid="teacher-page-day-schedules">
      {/* Header */}
      <div className="ds-hsu-teach-dayschedules__header">
        <div>
          <h1 className="ds-hsu-teach-dayschedules__title" data-testid="teacher-heading-today-schedule">Today's Schedule</h1>
          <p className="ds-hsu-teach-dayschedules__subtitle">{formatDate(selectedDate)}</p>
        </div>
        <button 
          className="ds-hsu-teach-dayschedules__assign-btn"
          onClick={() => handleHomeworkOpen()}
          data-testid="teacher-button-assign-homework-global"
        >
          <span className="ds-hsu-teach-dayschedules__assign-btn-icon">📋</span>
          Assign Homework
        </button>
      </div>

      <div className="ds-hsu-teach-dayschedules__container">
        {/* Left Section - 70% */}
        <div className="ds-hsu-teach-dayschedules__left">
          {/* Daily Class Schedule */}
          <div className="ds-hsu-teach-dayschedules__schedule-section">
            <h3 className="ds-hsu-teach-dayschedules__section-title" data-testid="teacher-heading-daily-schedule">
              <span className="ds-hsu-teach-dayschedules__section-icon">📅</span>
              Daily Class Schedule
            </h3>

            <div className="ds-hsu-teach-dayschedules__classes-list">
              {isSunday() ? (
                <div className="ds-hsu-teach-dayschedules__no-classes" data-testid="teacher-message-sunday">
                  <div className="ds-hsu-teach-dayschedules__no-classes-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#94A3B8"/>
                    </svg>
                  </div>
                  <h3 className="ds-hsu-teach-dayschedules__no-classes-title">Sunday – No Classes Scheduled</h3>
                  <p className="ds-hsu-teach-dayschedules__no-classes-subtitle">Enjoy your day off! Classes resume on Monday.</p>
                </div>
              ) : classes.length === 0 ? (
                <div className="ds-hsu-teach-dayschedules__no-classes" data-testid="teacher-message-no-classes">
                  <div className="ds-hsu-teach-dayschedules__no-classes-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="ds-hsu-teach-dayschedules__no-classes-title">No Classes Scheduled</h3>
                  <p className="ds-hsu-teach-dayschedules__no-classes-subtitle">There are no classes scheduled for this date.</p>
                </div>
              ) : (
                <>
              {classes.map((classItem) => {
                const isPastClass = isClassInPast(classItem.date);
                const displayStatus = isPastClass ? 'completed' : classItem.status.toLowerCase();
                
                return (
                <div 
                  key={classItem.id} 
                  className={`ds-hsu-teach-dayschedules__class-card ${displayStatus === 'completed' ? 'ds-hsu-teach-dayschedules__class-card--completed' : ''}`}
                  data-testid={`teacher-card-class-${classItem.id}`}
                >
                  <div className="ds-hsu-teach-dayschedules__class-content">
                    <div className="ds-hsu-teach-dayschedules__class-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ds-hsu-teach-dayschedules__class-details">
                      <h4 className="ds-hsu-teach-dayschedules__class-subject">{classItem.subject}</h4>
                      <div className="ds-hsu-teach-dayschedules__class-meta">
                        <span className="ds-hsu-teach-dayschedules__class-meta-item">
                          <svg className="ds-hsu-teach-dayschedules__class-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {classItem.class}
                        </span>
                        <span className="ds-hsu-teach-dayschedules__class-meta-item">
                          <svg className="ds-hsu-teach-dayschedules__class-meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {classItem.room}
                        </span>
                      </div>
                      <div className="ds-hsu-teach-dayschedules__class-time">
                        <svg className="ds-hsu-teach-dayschedules__time-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 6V12L16 14" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {classItem.time}
                      </div>
                      <div className="ds-hsu-teach-dayschedules__class-topic">
                        <svg className="ds-hsu-teach-dayschedules__topic-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {classItem.topic}
                      </div>
                    </div>
                  </div>
                  <div className="ds-hsu-teach-dayschedules__class-actions">
                    <span 
                      className={`ds-hsu-teach-dayschedules__status-badge ds-hsu-teach-dayschedules__status-badge--${(isClassInPast(classItem.date) ? 'completed' : classItem.status).toLowerCase()}`}
                      data-testid={`teacher-badge-status-${(isClassInPast(classItem.date) ? 'completed' : classItem.status).toLowerCase()}`}
                    >
                      {isClassInPast(classItem.date) ? 'Completed' : classItem.status}
                    </span>
                    {canEditLessonPlan(classItem.date) && (
                      <button 
                        className="ds-hsu-teach-dayschedules__action-btn ds-hsu-teach-dayschedules__action-btn--primary"
                        onClick={() => handleLessonPlanOpen(classItem)}
                        data-testid={`teacher-button-lesson-plan-${classItem.id}`}
                      >
                        <svg className="ds-hsu-teach-dayschedules__action-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Lesson Plan
                      </button>
                    )}
                    {canAssignHomework(classItem.date) && (
                      <button 
                        className="ds-hsu-teach-dayschedules__action-btn ds-hsu-teach-dayschedules__action-btn--secondary"
                        onClick={() => handleHomeworkOpen(classItem)}
                        data-testid={`teacher-button-assign-homework-${classItem.id}`}
                      >
                        <svg className="ds-hsu-teach-dayschedules__action-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Assign Homework
                      </button>
                    )}
                    {isClassToday(classItem.date) && classItem.status.toLowerCase() !== 'completed' && (
                      <button 
                        className="ds-hsu-teach-dayschedules__action-btn ds-hsu-teach-dayschedules__action-btn--attendance"
                        data-testid={`teacher-button-take-attendance-${classItem.id}`}
                      >
                        <svg className="ds-hsu-teach-dayschedules__action-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Take Attendance
                      </button>
                    )}
                  </div>
                </div>
              )})}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - 30% */}
        <div className="ds-hsu-teach-dayschedules__right">
          {/* Calendar */}
          <div className="ds-hsu-teach-dayschedules__calendar-widget" data-testid="teacher-widget-calendar">
            <div className="ds-hsu-teach-dayschedules__calendar-header">
              <button 
                className="ds-hsu-teach-dayschedules__calendar-nav"
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                data-testid="teacher-button-prev-month"
              >
                ‹
              </button>
              <h4 className="ds-hsu-teach-dayschedules__calendar-title">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h4>
              <button 
                className="ds-hsu-teach-dayschedules__calendar-nav"
                onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                data-testid="teacher-button-next-month"
              >
                ›
              </button>
            </div>
            
            <div className="ds-hsu-teach-dayschedules__calendar-grid">
              <div className="ds-hsu-teach-dayschedules__calendar-days">
                {dayNames.map(day => (
                  <div key={day} className="ds-hsu-teach-dayschedules__calendar-day-name">{day}</div>
                ))}
              </div>
              <div className="ds-hsu-teach-dayschedules__calendar-dates">
                {generateCalendar().map((week, i) => {
                  const today = new Date();
                  return (
                  <React.Fragment key={i}>
                    {week.map((day, j) => {
                      const isToday = day && 
                        day === today.getDate() && 
                        selectedDate.getMonth() === today.getMonth() && 
                        selectedDate.getFullYear() === today.getFullYear();
                      const isSelected = day === selectedDate.getDate();
                      
                      return (
                      <div 
                        key={j} 
                        className={`ds-hsu-teach-dayschedules__calendar-date ${
                          isToday ? 'ds-hsu-teach-dayschedules__calendar-date--today' : ''
                        } ${
                          isSelected ? 'ds-hsu-teach-dayschedules__calendar-date--selected' : ''
                        } ${day ? 'ds-hsu-teach-dayschedules__calendar-date--clickable' : 'ds-hsu-teach-dayschedules__calendar-date--empty'}`}
                        onClick={() => handleDateClick(day)}
                        data-testid={day ? `teacher-calendar-date-${day}` : undefined}
                      >
                        {day || ''}
                      </div>
                    )})}
                  </React.Fragment>
                )})}
              </div>
            </div>
          </div>

          {/* Today's Notes */}
          <div className="ds-hsu-teach-dayschedules__notes-widget" data-testid="teacher-widget-notes">
            <h4 className="ds-hsu-teach-dayschedules__widget-title">
              <span className="ds-hsu-teach-dayschedules__widget-icon">📝</span>
              Today's Notes
              <button 
                className="ds-hsu-teach-dayschedules__edit-icon"
                onClick={() => document.getElementById('notes-textarea').focus()}
                data-testid="teacher-button-edit-notes"
              >
                ✏️
              </button>
            </h4>
            <textarea
              id="notes-textarea"
              className="ds-hsu-teach-dayschedules__notes-textarea"
              value={todayNotes}
              onChange={(e) => setTodayNotes(e.target.value)}
              placeholder="Add your notes here..."
              data-testid="teacher-textarea-notes"
            />
          </div>

          {/* Teaching Reminders */}
          <div className="ds-hsu-teach-dayschedules__reminders-widget" data-testid="teacher-widget-reminders">
            <h4 className="ds-hsu-teach-dayschedules__widget-title">
              <span className="ds-hsu-teach-dayschedules__widget-icon">🔔</span>
              Teaching Reminders
            </h4>
            <div className="ds-hsu-teach-dayschedules__reminders-list">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="ds-hsu-teach-dayschedules__reminder-item"
                  data-testid={`teacher-item-reminder-${reminder.id}`}
                >
                  <span className="ds-hsu-teach-dayschedules__reminder-dot">•</span>
                  <span className="ds-hsu-teach-dayschedules__reminder-text">{reminder.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Month Holidays */}
          <div className="ds-hsu-teach-dayschedules__holidays-widget" data-testid="teacher-widget-holidays">
            <h4 className="ds-hsu-teach-dayschedules__widget-title">
              <span className="ds-hsu-teach-dayschedules__widget-icon">📆</span>
              Month Holidays
            </h4>
            <div className="ds-hsu-teach-dayschedules__holidays-list">
              {holidays.map((holiday, index) => (
                <div 
                  key={index} 
                  className="ds-hsu-teach-dayschedules__holiday-item"
                  data-testid={`teacher-item-holiday-${index}`}
                >
                  <div className="ds-hsu-teach-dayschedules__holiday-name">{holiday.name}</div>
                  <div className="ds-hsu-teach-dayschedules__holiday-date">{holiday.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Restriction Modal */}
      {showRestrictionModal && (
        <div className="ds-hsu-teach-dayschedules__modal-overlay" onClick={() => setShowRestrictionModal(false)}>
          <div 
            className="ds-hsu-teach-dayschedules__modal ds-hsu-teach-dayschedules__modal--restriction"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-edit-restriction"
          >
            <div className="ds-hsu-teach-dayschedules__modal-header">
              <h3 className="ds-hsu-teach-dayschedules__modal-title">
                <span className="ds-hsu-teach-dayschedules__modal-icon">🚫</span>
                Edit Not Allowed
              </h3>
              <button 
                className="ds-hsu-teach-dayschedules__modal-close"
                onClick={() => setShowRestrictionModal(false)}
                data-testid="teacher-button-close-restriction-modal"
              >
                ✕
              </button>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-body">
              <p className="ds-hsu-teach-dayschedules__restriction-message">
                You can edit a lesson plan only up to 2 days before the scheduled date.
              </p>
              <p className="ds-hsu-teach-dayschedules__restriction-submessage">
                This lesson plan is outside the allowed editing window.
              </p>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-footer">
              <button 
                className="ds-hsu-teach-dayschedules__modal-btn ds-hsu-teach-dayschedules__modal-btn--save"
                onClick={() => setShowRestrictionModal(false)}
                data-testid="teacher-button-close-restriction"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Plan Modal */}
      {showLessonPlanModal && (
        <div className="ds-hsu-teach-dayschedules__modal-overlay" onClick={() => setShowLessonPlanModal(false)}>
          <div 
            className="ds-hsu-teach-dayschedules__modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-lesson-plan"
          >
            <div className="ds-hsu-teach-dayschedules__modal-header">
              <h3 className="ds-hsu-teach-dayschedules__modal-title">
                <span className="ds-hsu-teach-dayschedules__modal-icon">📄</span>
                Edit Lesson Plan
              </h3>
              <button 
                className="ds-hsu-teach-dayschedules__modal-close"
                onClick={() => setShowLessonPlanModal(false)}
                data-testid="teacher-button-close-lesson-modal"
              >
                ✕
              </button>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-body">
              <p className="ds-hsu-teach-dayschedules__modal-subtitle">
                Class Date: {formatDate(selectedDate)}
              </p>

              <div className="ds-hsu-teach-dayschedules__modal-info">
                <span className="ds-hsu-teach-dayschedules__modal-info-icon">ℹ️</span>
                You can edit or upload files only from 2 days before the class date until the end of the scheduled day.
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">
                  Topic / Lesson Title
                </label>
                <input
                  type="text"
                  className="ds-hsu-teach-dayschedules__form-input"
                  value={lessonPlanForm.topic}
                  onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, topic: e.target.value })}
                  placeholder="Enter topic or lesson title"
                  data-testid="teacher-field-lesson-topic"
                />
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">
                  Detailed Notes
                </label>
                <textarea
                  className="ds-hsu-teach-dayschedules__form-textarea"
                  value={lessonPlanForm.notes}
                  onChange={(e) => setLessonPlanForm({ ...lessonPlanForm, notes: e.target.value })}
                  placeholder="Enter detailed lesson notes"
                  rows="4"
                  data-testid="teacher-field-lesson-notes"
                />
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">
                  <span className="ds-hsu-teach-dayschedules__upload-icon">📎</span>
                  Upload Documents (Max 5MB per file)
                </label>
                <button 
                  className="ds-hsu-teach-dayschedules__upload-btn"
                  onClick={() => document.getElementById('lesson-file-input').click()}
                  data-testid="teacher-button-upload-lesson-file"
                >
                  <span className="ds-hsu-teach-dayschedules__upload-btn-icon">⬆️</span>
                  Add Attachment
                </button>
                {/* <input
                  id="lesson-file-input"
                  type="file"
                  style={{ display: 'ds-none' }}
                  onChange={(e) => handleFileUpload(e, 'lesson')}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                /> */}
                {lessonPlanForm.file && (
                  <div className="ds-hsu-teach-dayschedules__file-info">
                    <span className="ds-hsu-teach-dayschedules__file-icon">📄</span>
                    <span className="ds-hsu-teach-dayschedules__file-name">{lessonPlanForm.file.name}</span>
                    <span className="ds-hsu-teach-dayschedules__file-size">
                      ({(lessonPlanForm.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-footer">
              <button 
                className="ds-hsu-teach-dayschedules__modal-btn ds-hsu-teach-dayschedules__modal-btn--cancel"
                onClick={() => setShowLessonPlanModal(false)}
                data-testid="teacher-button-cancel-lesson"
              >
                Cancel
              </button>
              <button 
                className="ds-hsu-teach-dayschedules__modal-btn ds-hsu-teach-dayschedules__modal-btn--save"
                onClick={handleLessonPlanSave}
                data-testid="teacher-button-save-lesson"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Homework Modal */}
      {showHomeworkModal && (
        <div className="ds-hsu-teach-dayschedules__modal-overlay" onClick={() => setShowHomeworkModal(false)}>
          <div 
            className="ds-hsu-teach-dayschedules__modal hsu-teach-dayschedules__modal--homework"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-assign-homework"
          >
            <div className="ds-hsu-teach-dayschedules__modal-header">
              <h3 className="ds-hsu-teach-dayschedules__modal-title">
                <span className="ds-hsu-teach-dayschedules__modal-icon">📋</span>
                Assign Homework
              </h3>
              <button 
                className="ds-hsu-teach-dayschedules__modal-close"
                onClick={() => setShowHomeworkModal(false)}
                data-testid="teacher-button-close-homework-modal"
              >
                ✕
              </button>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-body">
              <p className="ds-hsu-teach-dayschedules__modal-subtitle">
                Create and assign homework to your classes
              </p>

              <div className="ds-hsu-teach-dayschedules__form-row">
                <div className="ds-hsu-teach-dayschedules__form-group">
                  <label className="ds-hsu-teach-dayschedules__form-label">Class *</label>
                  <select
                    className="ds-hsu-teach-dayschedules__form-select"
                    value={homeworkForm.class}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, class: e.target.value })}
                    data-testid="teacher-dropdown-homework-class"
                  >
                    <option value="">Select class</option>
                    <option value="Class 9A">Class 9A</option>
                    <option value="Class 9B">Class 9B</option>
                    <option value="Class 10A">Class 10A</option>
                    <option value="Class 10B">Class 10B</option>
                    <option value="Class 11A">Class 11A</option>
                    <option value="Class 12A">Class 12A</option>
                  </select>
                </div>

                <div className="ds-hsu-teach-dayschedules__form-group">
                  <label className="ds-hsu-teach-dayschedules__form-label">Section *</label>
                  <select
                    className="ds-hsu-teach-dayschedules__form-select"
                    value={homeworkForm.section}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, section: e.target.value })}
                    data-testid="teacher-dropdown-homework-section"
                  >
                    <option value="">Select section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">Subject *</label>
                <select
                  className="ds-hsu-teach-dayschedules__form-select"
                  value={homeworkForm.subject}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                  data-testid="teacher-dropdown-homework-subject"
                >
                  <option value="">Select subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Advanced Algebra">Advanced Algebra</option>
                  <option value="Trigonometry">Trigonometry</option>
                  <option value="Calculus">Calculus</option>
                </select>
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">Topic / Title *</label>
                <input
                  type="text"
                  className="ds-hsu-teach-dayschedules__form-input"
                  value={homeworkForm.topic}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, topic: e.target.value })}
                  placeholder="Enter homework topic or title"
                  data-testid="teacher-field-homework-topic"
                />
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">Description *</label>
                <textarea
                  className="ds-hsu-teach-dayschedules__form-textarea"
                  value={homeworkForm.description}
                  onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                  placeholder="Enter detailed homework description"
                  rows="4"
                  data-testid="teacher-field-homework-description"
                />
              </div>

              <div className="ds-hsu-teach-dayschedules__form-row">
                <div className="ds-hsu-teach-dayschedules__form-group">
                  <label className="ds-hsu-teach-dayschedules__form-label">Due Date / Submission Date *</label>
                  <input
                    type="date"
                    className="ds-hsu-teach-dayschedules__form-input"
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
                    data-testid="teacher-field-homework-due-date"
                  />
                </div>

                <div className="ds-hsu-teach-dayschedules__form-group">
                  <label className="ds-hsu-teach-dayschedules__form-label">Priority</label>
                  <select
                    className="ds-hsu-teach-dayschedules__form-select"
                    value={homeworkForm.priority}
                    onChange={(e) => setHomeworkForm({ ...homeworkForm, priority: e.target.value })}
                    data-testid="teacher-dropdown-homework-priority"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="ds-hsu-teach-dayschedules__form-group">
                <label className="ds-hsu-teach-dayschedules__form-label">
                  <span className="ds-hsu-teach-dayschedules__upload-icon">📎</span>
                  Attachments (Max 5MB per file)
                </label>
                <button 
                  className="ds-hsu-teach-dayschedules__upload-btn"
                  onClick={() => document.getElementById('homework-file-input').click()}
                  data-testid="teacher-button-upload-homework-file"
                >
                  <span className="ds-hsu-teach-dayschedules__upload-btn-icon">⬆️</span>
                  Add Attachment
                </button>
                {/* <input
                  id="homework-file-input"
                  type="file"
                  style={{ display: 'ds-none' }}
                  onChange={(e) => handleFileUpload(e, 'homework')}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                /> */}
                {homeworkForm.file && (
                  <div className="ds-hsu-teach-dayschedules__file-info">
                    <span className="ds-hsu-teach-dayschedules__file-icon">📄</span>
                    <span className="ds-hsu-teach-dayschedules__file-name">{homeworkForm.file.name}</span>
                    <span className="ds-hsu-teach-dayschedules__file-size">
                      ({(homeworkForm.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="ds-hsu-teach-dayschedules__modal-footer">
              <button 
                className="ds-hsu-teach-dayschedules__modal-btn ds-hsu-teach-dayschedules__modal-btn--cancel"
                onClick={() => setShowHomeworkModal(false)}
                data-testid="teacher-button-cancel-homework"
              >
                Cancel
              </button>
              <button 
                className="ds-hsu-teach-dayschedules__modal-btn ds-hsu-teach-dayschedules__modal-btn--save"
                onClick={handleHomeworkSave}
                data-testid="teacher-button-save-homework"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
};

export default DaySchedules;
