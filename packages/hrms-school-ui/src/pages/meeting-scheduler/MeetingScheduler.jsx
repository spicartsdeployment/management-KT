import React, { useState, useRef, useEffect } from 'react';
import '../../assets/scss/MeetingScheduler.scss';
import CustomDropdown from './components/CustomDropdown';
import PageLoader from '../../components/PageLoader';
import { useMeetingDashboardQuery, useCompletedMeetingsQuery, useTeacherAvailabilityQuery } from '../../services/meetingScheduler.queries';
import { useScheduleMeetingMutation } from '../../services/meetingScheduler.queries';

/**
 * MeetingScheduler page component
 * @returns {JSX.Element} Meeting scheduler UI
 */
const MeetingScheduler = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    teacher: '',
    type: '',
    purpose: ''
  });

  const { data: dashboardData, isLoading: loadingDashboard } = useMeetingDashboardQuery();
  const { data: completedData, isLoading: loadingCompleted } = useCompletedMeetingsQuery();
  const { data: availabilityData, isLoading: loadingAvailability } = useTeacherAvailabilityQuery();
  const scheduleMutation = useScheduleMeetingMutation();

  const isPageLoading = loadingDashboard || loadingCompleted || loadingAvailability;
  const dashboardStats = dashboardData?.stats ?? { totalMeetings: 0, pendingRequests: 0, upcomingThisWeek: 0, completedLastMonth: 0 };
  const upcomingMeetings = dashboardData?.meetings ?? [];
  const historyMeetings = completedData ?? [];
  const teachers = availabilityData ?? [];

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  /**
   * Generate calendar cells with exactly 5 rows (35 cells)
   * Date 1 always appears in row 1 at its correct weekday position
   * Overflow dates maintain their weekday positions in row 1
   */
  const generateCalendarCells = (date) => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(date);
    const totalCells = 35; // 5 rows � 7 columns
    const cells = [];
    
    // Calculate how many dates would overflow into 6th row
    const totalDaysNeeded = startingDayOfWeek + daysInMonth;
    const overflowDates = totalDaysNeeded > totalCells ? totalDaysNeeded - totalCells : 0;
    
    // Calculate weekday positions for overflow dates
    const wrappedDatePositions = new Map();
    if (overflowDates > 0) {
      for (let i = 0; i < overflowDates; i++) {
        const dateNum = daysInMonth - overflowDates + i + 1;
        const dayOffset = dateNum - 1; // days from date 1
        const weekdayPos = (startingDayOfWeek + dayOffset) % 7;
        wrappedDatePositions.set(weekdayPos, dateNum);
      }
    }
    
    // Fill cells - date 1 always at startingDayOfWeek position in row 1
    for (let i = 0; i < totalCells; i++) {
      if (i < startingDayOfWeek) {
        // Before month starts in row 1 - check if wrapped date belongs here
        if (wrappedDatePositions.has(i)) {
          cells.push({ day: wrappedDatePositions.get(i), type: 'wrapped' });
        } else {
          cells.push({ day: null, type: 'empty' });
        }
      } else {
        // Month dates starting from position startingDayOfWeek
        const dayNumber = i - startingDayOfWeek + 1;
        if (dayNumber <= daysInMonth - overflowDates) {
          cells.push({ day: dayNumber, type: 'current' });
        } else {
          // After the month ends (remaining cells)
          cells.push({ day: null, type: 'empty' });
        }
      }
    }
    
    return cells;
  };

  const calendarCells = generateCalendarCells(currentMonth);
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const hasMeetingOnDate = (date) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return upcomingMeetings.some(m => m.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Generate hours and minutes arrays
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    if (selectedMinute) {
      handleFormChange('time', `${hour}:${selectedMinute}`);
    }
  };

  const handleMinuteClick = (minute) => {
    setSelectedMinute(minute);
    if (selectedHour) {
      handleFormChange('time', `${selectedHour}:${minute}`);
      setShowTimePicker(false);
    }
  };

  // Time picker ref for click-outside detection
  const timePickerRef = useRef(null);

  // Close time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimePicker]);

  const handleRequestMeeting = () => {
    scheduleMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ title: '', teacher: '', type: '', purpose: '' });
        alert('Meeting request submitted successfully!');
      },
      onError: (err) => {
        console.error('? Schedule meeting error:', err);
        alert('Failed to submit meeting request. Please try again.');
      },
    });
  };

  const handleBookTeacher = (teacher) => {
    setFormData({ ...formData, teacher: teacher.name });
    setActiveTab('request');
  };

  const handleMeetingAction = (meeting, action) => {
    console.log(`Meeting ${action}:`, meeting);
    setShowConfirmModal(false);
    setSelectedMeeting(null);
    alert(`Meeting ${action}ed successfully!`);
  };



  // Check if all required fields are filled
  const isFormValid = formData.title.trim() !== '' &&
    formData.teacher.trim() !== '' &&
    formData.type.trim() !== '' &&
    formData.purpose.trim() !== '';

  return (
    <div className="sch-sm-scheduler" data-testid="school-container-meeting-scheduler">
      {isPageLoading ? (
        <PageLoader
          title="Loading Meetings"
          subtitle="Fetching your scheduled appointments..."
          icon="⏰"
        />
      ) : (
        <>
          <div className="sch-sm-scheduler-header">
            <h1 className="sch-sm-scheduler-title">Schedule Meeting</h1>
            <p className="sch-sm-scheduler-subtitle">Book and manage meetings with teachers and staff</p>
          </div>

          <div className="sch-sm-scheduler-layout">
            {/* LEFT SECTION - 30% */}
            <div className="sch-sm-scheduler-left">
              {/* Upcoming Meetings Card */}
              <div className="sch-sm-stat-card sch-sm-upcoming-card" data-testid="school-card-upcoming-stats">
                <div className="sch-sm-stat-content">
                  <span className="sch-sm-stat-label">UPCOMING MEETINGS</span>
                  <div className="sch-sm-stat-value">{dashboardStats.upcomingMeetings}</div>
                  <span className="sch-sm-stat-sublabel">Next 30 days</span>
                </div>
                <div className="sch-sm-stat-icon">
                  <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Confirmed Meetings Card */}
              <div className="sch-sm-stat-card sch-sm-confirmed-card" data-testid="school-card-confirmed-stats">
                <div className="sch-sm-stat-content">
                  <span className="sch-sm-stat-label">CONFIRMED MEETINGS</span>
                  <div className="sch-sm-stat-value">{dashboardStats.confirmedMeetings}</div>
                  <span className="sch-sm-stat-sublabel">Ready to attend</span>
                </div>
                <div className="sch-sm-stat-icon">
                  <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Available Teachers Card */}
              <div className="sch-sm-stat-card sch-sm-teachers-card" data-testid="school-card-teachers-stats">
                <div className="sch-sm-stat-content">
                  <span className="sch-sm-stat-label">AVAILABLE TEACHERS</span>
                  <div className="sch-sm-stat-value">{dashboardStats.availableTeachers}</div>
                  <span className="sch-sm-stat-sublabel">Can be contacted</span>
                </div>
                <div className="sch-sm-stat-icon">
                  <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Calendar Card */}
              <div className="sch-sm-calendar-card" data-testid="school-card-calendar">
                <div className="sch-sm-calendar-header">
                  <span className="sch-sm-calendar-month-label">SELECT DATE</span>
                </div>
                <div className="sch-sm-calendar-navigation">
                  <button className="sch-sm-nav-btn" onClick={handlePrevMonth} data-testid="school-button-prev-month">
                    <svg className="sch-sm-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="sch-sm-month-year">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button className="sch-sm-nav-btn" onClick={handleNextMonth} data-testid="school-button-next-month">
                    <svg className="sch-sm-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="sch-sm-calendar-grid">
                  <div className="sch-sm-weekday-header">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="sch-sm-weekday">{day}</div>
                    ))}
                  </div>
                  <div className="sch-sm-days-grid">
                    {calendarCells.map((cell, index) => {
                      if (cell.type === 'empty') {
                        return <div key={`empty-${index}`} className="sch-sm-calendar-day empty"></div>;
                      }
                      
                      const day = cell.day;
                      const hasMeeting = hasMeetingOnDate(day);
                      const isToday = new Date().getDate() === day &&
                        new Date().getMonth() === currentMonth.getMonth() &&
                        new Date().getFullYear() === currentMonth.getFullYear();
                      const isWrapped = cell.type === 'wrapped';
                      
                      return (
                        <div
                          key={`${cell.type}-${day}-${index}`}
                          className={`sch-sm-calendar-day ${isToday ? 'today' : ''} ${hasMeeting ? 'has-meeting' : ''} ${isWrapped ? 'wrapped' : ''}`}
                          data-testid={`school-calendar-day-${day}`}
                        >
                          {day}
                          {hasMeeting && <div className="sch-sm-dot"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - 70% */}
            <div className="sch-sm-scheduler-right">
              {/* Tab Navigation */}
              <div className="sch-sm-tab-navigation">
                <button
                  className={`sch-sm-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                  data-testid="school-tab-upcoming"
                >
                  Upcoming
                </button>
                <button
                  className={`sch-sm-tab-btn ${activeTab === 'request' ? 'active' : ''}`}
                  onClick={() => setActiveTab('request')}
                  data-testid="school-tab-request"
                >
                  Request New
                </button>
                <button
                  className={`sch-sm-tab-btn ${activeTab === 'teachers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('teachers')}
                  data-testid="school-tab-teachers"
                >
                  Teachers
                </button>
                <button
                  className={`sch-sm-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                  data-testid="school-tab-history"
                >
                  History
                </button>
              </div>

              {/* Tab Content */}
              <div className="sch-sm-tab-content">
                {/* UPCOMING TAB */}
                {activeTab === 'upcoming' && (
                  <div className="sch-sm-upcoming-content">
                    {upcomingMeetings.map(meeting => (
                      <div key={meeting.id} className="sch-sm-card" data-testid={`school-card-meeting-${meeting.id}`}>
                        <div className="sch-sm-header">
                          <div className={`sch-sm-icon ${meeting.venue.includes('Zoom') || meeting.venue.includes('Google') ? 'sch-sm-video-icon' : 'sch-sm-location-icon'}`}>
                            {meeting.venue.includes('Zoom') || meeting.venue.includes('Google') ? (
                              <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                          </div>
                          <div className="sch-sm-info">
                            <h3 className="sch-sm-title">{meeting.title}</h3>
                            <p className="sch-sm-teacher">{meeting.teacher} � {meeting.subject}</p>
                          </div>
                          <div className={`sch-sm-status-badge ${meeting.status}`} data-testid={`school-badge-status-${meeting.id}`}>
                            {meeting.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </div>
                        </div>
                        <div className="sch-sm-details">
                          <div className="sch-sm-detail-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{meeting.date}</span>
                          </div>
                          <div className="sch-sm-detail-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{meeting.time}</span>
                          </div>
                          <div className="sch-sm-detail-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>{meeting.duration}</span>
                          </div>
                          <div className="sch-sm-detail-item">
                            {meeting.venue.includes('Zoom') || meeting.venue.includes('Google') ? (
                              <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                            ) : (
                              <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            )}
                            <span>{meeting.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* REQUEST NEW TAB */}
                {activeTab === 'request' && (
                  <div className="sch-sm-request-content">
                    <h2 className="sch-sm-section-title">Request New Meeting</h2>
                    <div className="sch-sm-request-form">
                      <div className="sch-sm-form-row">
                        <div className="sch-sm-form-group">
                          <label htmlFor="meeting-title">MEETING TITLE</label>
                          <input
                            id="meeting-title"
                            type="text"
                            placeholder="Enter meeting title..."
                            value={formData.title}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            data-testid="school-field-meeting-title"
                          />
                        </div>
                        <div className="sch-sm-form-group">
                          <label htmlFor="teacher-select">TEACHER</label>
                          <CustomDropdown
                            id="teacher-select"
                            value={formData.teacher}
                            onChange={(value) => handleFormChange('teacher', value)}
                            options={teachers.map(t => t.name)}
                            placeholder="Select teacher..."
                            testId="school-dropdown-teacher"
                          />
                        </div>
                      </div>
                      <div className="sch-sm-form-row">
                        <div className="sch-sm-form-group">
                          <label htmlFor="meeting-type">MEETING TYPE</label>
                          <CustomDropdown
                            id="meeting-type"
                            value={formData.type}
                            onChange={(value) => handleFormChange('type', value)}
                            options={['Counseling', 'Academic', 'Progress Review', 'Parent Meeting']}
                            placeholder="Select type..."
                            testId="school-dropdown-meeting-type"
                          />
                        </div>
                      </div>
                      <div className="sch-sm-form-group full-width">
                        <label htmlFor="meeting-purpose">MEETING PURPOSE</label>
                        <textarea
                          id="meeting-purpose"
                          placeholder="Describe the purpose of this meeting..."
                          rows="4"
                          value={formData.purpose}
                          onChange={(e) => handleFormChange('purpose', e.target.value)}
                          data-testid="school-field-meeting-purpose"
                        ></textarea>
                      </div>
                      <div className="sch-sm-form-actions">
                        <button
                          className="sch-sm-btn-secondary"
                          onClick={() => setFormData({ title: '', teacher: '', type: '', time: '', purpose: '' })}
                          data-testid="school-button-cancel"
                        >
                          Cancel
                        </button>
                        <button
                          className="sch-sm-btn-primary"
                          onClick={handleRequestMeeting}
                          disabled={!isFormValid}
                          data-testid="school-button-request-meeting"
                        >
                          Request Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEACHERS TAB */}
                {activeTab === 'teachers' && (
                  <div className="sch-sm-teachers-content">
                    {teachers.map(teacher => (
                      <div key={teacher.id} className="sch-sm-teacher-card" data-testid={`school-card-teacher-${teacher.id}`}>
                        <div className="sch-sm-teacher-header">
                          <div className="sch-sm-teacher-avatar">
                            <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="sch-sm-teacher-info">
                            <h3 className="sch-sm-teacher-name">{teacher.name}</h3>
                            <p className="sch-sm-teacher-subject">{teacher.subject}</p>
                          </div>
                        </div>
                        <div className="sch-sm-teacher-contact">
                          <div className="sch-sm-contact-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{teacher.email}</span>
                          </div>
                          <div className="sch-sm-contact-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{teacher.phone}</span>
                          </div>
                          <div className="sch-sm-contact-item">
                            <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{teacher.availability}</span>
                          </div>
                        </div>
                        <button
                          className="sch-sm-book-btn"
                          onClick={() => handleBookTeacher(teacher)}
                          data-testid={`school-button-book-${teacher.id}`}
                        >
                          <svg className="sch-sm-icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Book Meeting
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                  <div className="sch-sm-history-content">
                    <div className="sch-sm-history-header">
                      <h2 className="sch-sm-section-title">Past Meetings</h2>
                      <span className="sch-sm-history-count">{historyMeetings.length} Completed</span>
                    </div>
                    {historyMeetings.map(meeting => (
                      <div key={meeting.id} className="sch-sm-history-card-wrapper" data-testid={`school-card-history-${meeting.id}`}>
                        <div className="sch-sm-history-icon">
                          <svg className="sch-sm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="sch-sm-history-card">
                          <div className="sch-sm-history-info">
                            <div className="sch-sm-history-title-row">
                              <h3 className="sch-sm-history-title">{meeting.title}</h3>
                              <span className="sch-sm-history-date">{meeting.date}</span>
                            </div>
                            <p className="sch-sm-history-teacher">
                              <span>With {meeting.teacher}</span>
                            </p>
                            <div className="sch-sm-history-outcome">{meeting.outcome}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && selectedMeeting && (
            <div className="sch-sm-modal-overlay" onClick={() => setShowConfirmModal(false)} data-testid="school-modal-confirm">
              <div className="sch-sm-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Confirm Meeting</h3>
                <p>Are you sure you want to accept this meeting?</p>
                <div className="modal-actions">
                  <button
                    className="sch-sm-btn-secondary"
                    onClick={() => setShowConfirmModal(false)}
                    data-testid="school-button-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    className="sch-sm-btn-primary"
                    onClick={() => handleMeetingAction(selectedMeeting, 'accept')}
                    data-testid="school-button-modal-confirm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MeetingScheduler;



