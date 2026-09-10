import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/MySchedule.scss';
import {
    Calendar,
    Clock,
    BookOpen,
    Users,
    Video,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Plus,
    Download,
    CalendarDays,
    Coffee,
    Bell,
    Edit,
    Trash2
} from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MySchedule = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [currentWeek, setCurrentWeek] = useState(0);
    const [showAddMeetingDialog, setShowAddMeetingDialog] = useState(false);
    const [meetingMode, setMeetingMode] = useState('offline');
    const [activeTab, setActiveTab] = useState('classes');

    const [schedules, setSchedules] = useState({
        Monday: [
            { id: 1, class: 'Class 9A', subject: 'Mathematics', time: '08:00 AM', duration: '45 min', room: 'Room 301', type: 'lecture' },
            { id: 2, class: 'Class 10A', subject: 'Mathematics', time: '09:00 AM', duration: '45 min', room: 'Room 302', type: 'lecture' },
            { id: 3, class: 'Class 9A', subject: 'Mathematics Lab', time: '11:00 AM', duration: '60 min', room: 'Lab 2', type: 'practical' },
            { id: 4, class: 'Class 11A', subject: 'Mathematics', time: '01:00 PM', duration: '45 min', room: 'Room 305', type: 'lecture' },
            { id: 5, class: 'Class 10A', subject: 'Doubt Clearing', time: '02:30 PM', duration: '30 min', room: 'Room 302', type: 'tutorial' },
        ],
        Tuesday: [
            { id: 6, class: 'Class 9A', subject: 'Mathematics', time: '08:00 AM', duration: '45 min', room: 'Room 301', type: 'lecture' },
            { id: 7, class: 'Class 11A', subject: 'Mathematics', time: '10:00 AM', duration: '45 min', room: 'Room 305', type: 'lecture' },
            { id: 8, class: 'Class 10A', subject: 'Mathematics', time: '01:00 PM', duration: '45 min', room: 'Room 302', type: 'lecture' },
            { id: 9, class: 'Class 11A', subject: 'Advanced Math', time: '02:30 PM', duration: '60 min', room: 'Room 305', type: 'tutorial' },
        ],
        Wednesday: [
            { id: 10, class: 'Class 10A', subject: 'Mathematics', time: '08:00 AM', duration: '45 min', room: 'Room 302', type: 'lecture' },
            { id: 11, class: 'Class 9A', subject: 'Mathematics', time: '09:30 AM', duration: '45 min', room: 'Room 301', type: 'lecture' },
            { id: 12, class: 'Class 11A', subject: 'Mathematics', time: '11:30 AM', duration: '45 min', room: 'Room 305', type: 'lecture' },
        ],
        Thursday: [
            { id: 13, class: 'Class 9A', subject: 'Mathematics', time: '08:00 AM', duration: '45 min', room: 'Room 301', type: 'lecture' },
            { id: 14, class: 'Class 10A', subject: 'Mathematics', time: '10:00 AM', duration: '45 min', room: 'Room 302', type: 'lecture' },
            { id: 15, class: 'Class 11A', subject: 'Mathematics Lab', time: '01:00 PM', duration: '60 min', room: 'Lab 2', type: 'practical' },
        ],
        Friday: [
            { id: 16, class: 'Class 11A', subject: 'Mathematics', time: '08:00 AM', duration: '45 min', room: 'Room 305', type: 'lecture' },
            { id: 17, class: 'Class 9A', subject: 'Mathematics', time: '09:30 AM', duration: '45 min', room: 'Room 301', type: 'lecture' },
            { id: 18, class: 'Class 10A', subject: 'Mathematics', time: '11:00 AM', duration: '45 min', room: 'Room 302', type: 'lecture' },
        ],
        Saturday: [
            { id: 19, class: 'Class 9A', subject: 'Extra Classes', time: '08:00 AM', duration: '60 min', room: 'Room 301', type: 'tutorial' },
            { id: 20, class: 'Class 10A', subject: 'Test Preparation', time: '10:00 AM', duration: '90 min', room: 'Room 302', type: 'tutorial' },
        ],
    });




    const [meetings, setMeetings] = useState([
        { id: 1, title: 'Parent-Teacher Meeting', type: 'PTM', time: '10:00 AM', duration: '2 hrs', location: 'Conference Hall A', attendees: 35, status: 'upcoming', isOnline: false, description: 'Quarterly PTM to discuss student progress', createdBy: 'teacher' },
        { id: 2, title: 'Department Meeting', type: 'Staff', time: '02:00 PM', duration: '1 hr', location: 'Staff Room', attendees: 12, status: 'upcoming', isOnline: false, description: 'Monthly departmental review', createdBy: 'teacher' },
        { id: 3, title: 'Online Faculty Training', type: 'Training', time: '04:00 PM', duration: '90 min', location: 'https://meet.google.com/abc-def-xyz', attendees: 45, status: 'upcoming', isOnline: true, description: 'Digital teaching tools workshop', createdBy: 'teacher' },
    ]);

    const managementMeetings = [
        { id: 4, title: 'Annual Day Preparation', type: 'Staff Meeting', time: '03:00 PM', duration: '1.5 hrs', location: 'Main Auditorium', attendees: 50, status: 'upcoming', isOnline: false, description: 'Planning and coordination for Annual Day event', createdBy: 'management' },
        { id: 5, title: 'Curriculum Review Session', type: 'Academic', time: '11:00 AM', duration: '2 hrs', location: 'https://zoom.us/j/123456789', attendees: 25, status: 'upcoming', isOnline: true, description: 'Quarterly curriculum review and updates', createdBy: 'management' },
        { id: 6, title: 'Safety and Security Briefing', type: 'Staff Meeting', time: '09:00 AM', duration: '1 hr', location: 'Conference Room B', attendees: 30, status: 'upcoming', isOnline: false, description: 'Important safety protocols and emergency procedures', createdBy: 'management' },
    ];

    const currentDaySchedule = schedules[selectedDay] || [];
    const totalClassesToday = currentDaySchedule.length;
    const totalHoursToday = currentDaySchedule.reduce((sum, cls) => sum + parseInt(cls.duration), 0) / 60;
    const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').length;

    const scheduleStats = [
        {
            label: 'Classes Today',
            value: totalClassesToday,
            icon: BookOpen,
            variant: 'blue',
            testId: 'teacher-card-stats-classes',
        },
        {
            label: 'Teaching Hours',
            value: totalHoursToday.toFixed(1),
            icon: Clock,
            variant: 'emerald',
            testId: 'teacher-card-stats-hours',
        },
        {
            label: 'Meetings',
            value: upcomingMeetings,
            icon: Users,
            variant: 'violet',
            testId: 'teacher-card-stats-meetings',
        },
        {
            label: 'Free Periods',
            value: 3,
            icon: Coffee,
            variant: 'amber',
            testId: 'teacher-card-stats-free',
        },
    ];

    const handleExportSchedule = () => {
        alert('Schedule exported successfully! Your weekly schedule has been downloaded as PDF.');
    };

    const handleDeleteMeeting = (id) => {
        setMeetings(meetings.filter(m => m.id !== id));
        alert('Meeting deleted successfully');
    };

    const handleEditMeeting = (id) => {
        alert('Edit meeting functionality - Opening meeting editor...');
    };

    const handleAddMeeting = () => {
        alert('Meeting scheduled successfully!');
        setShowAddMeetingDialog(false);
    };

    const getTypeColor = (type) => {
        if (type === 'lecture') return 'mys-hsu-teach-schedule__type-badge--lecture';
        if (type === 'practical') return 'mys-hsu-teach-schedule__type-badge--practical';
        return 'mys-hsu-teach-schedule__type-badge--tutorial';
    };

    const getStatusColor = (status) => {
        if (status === 'upcoming') return 'mys-hsu-teach-schedule__status-badge--upcoming';
        if (status === 'ongoing') return 'mys-hsu-teach-schedule__status-badge--ongoing';
        return 'mys-hsu-teach-schedule__status-badge--completed';
    };

    return (
        <div className="mys-hsu-teach-schedule" data-testid="teacher-page-my-schedule">
            {/* Header */}
            <div className="mys-hsu-teach-schedule__header">
                <div className="mys-hsu-teach-schedule__header-content">
                    <div className="mys-hsu-teach-schedule__header-icon">
                        <CalendarDays className="mys-hsu-teach-schedule__icon" />
                    </div>
                    <div>
                        <h1 className="mys-hsu-teach-schedule__title" data-testid="teacher-heading-my-schedule">My Schedule</h1>
                        <p className="mys-hsu-teach-schedule__subtitle">Manage your classes and meetings</p>
                    </div>
                </div>

                <button
                    className="mys-hsu-teach-schedule__export-btn"
                    onClick={handleExportSchedule}
                    data-testid="teacher-button-export-schedule"
                >
                    <Download className="mys-hsu-teach-schedule__btn-icon" />
                    Export
                </button>
            </div>

            {/* Week & Day Selector */}
            <div className="mys-hsu-teach-schedule__week-selector">
                <div className="mys-hsu-teach-schedule__week-nav">
                    <button
                        className="mys-hsu-teach-schedule__nav-btn"
                        onClick={() => setCurrentWeek(currentWeek - 1)}
                        data-testid="teacher-button-prev-week"
                    >
                        <ChevronLeft className="mys-hsu-teach-schedule__icon" />
                    </button>
                    <div className="mys-hsu-teach-schedule__week-info">
                        <p className="mys-hsu-teach-schedule__week-title">Week {Math.abs(currentWeek) + 1}</p>
                        <p className="mys-hsu-teach-schedule__week-date">Jan 15 - Jan 21, 2024</p>
                    </div>
                    <button
                        className="mys-hsu-teach-schedule__nav-btn"
                        onClick={() => setCurrentWeek(currentWeek + 1)}
                        data-testid="teacher-button-next-week"
                    >
                        <ChevronRight className="mys-hsu-teach-schedule__icon" />
                    </button>
                </div>

                <div className="mys-hsu-teach-schedule__day-buttons">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`mys-hsu-teach-schedule__day-btn ${selectedDay === day ? 'mys-hsu-teach-schedule__day-btn--active' : ''}`}
                            data-testid={`teacher-button-day-${day.toLowerCase()}`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="mys-hsu-teach-schedule__stats-grid">
                {scheduleStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className={`mys-hsu-teach-schedule__stat-card mys-hsu-teach-schedule__stat-card--${stat.variant}`}
                            data-testid={stat.testId}
                        >
                            <div className="mys-hsu-teach-schedule__stat-content">
                                <div>
                                    <p className="mys-hsu-teach-schedule__stat-label">
                                        {stat.label}
                                    </p>

                                    <p className="mys-hsu-teach-schedule__stat-value">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="mys-hsu-teach-schedule__stat-icon">
                                    <Icon className="mys-hsu-teach-schedule__icon" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs */}
            <div className="mys-hsu-teach-schedule__tabs">
                <div className="mys-hsu-teach-schedule__tab-list">
                    <button
                        className={`mys-hsu-teach-schedule__tab ${activeTab === 'classes' ? 'mys-hsu-teach-schedule__tab--active' : ''}`}
                        onClick={() => setActiveTab('classes')}
                        data-testid="teacher-tab-classes"
                    >
                        <BookOpen className="mys-hsu-teach-schedule__tab-icon" />
                        Class Schedule
                    </button>
                    <button
                        className={`mys-hsu-teach-schedule__tab ${activeTab === 'meetings' ? 'mys-hsu-teach-schedule__tab--active' : ''}`}
                        onClick={() => setActiveTab('meetings')}
                        data-testid="teacher-tab-meetings"
                    >
                        <Users className="mys-hsu-teach-schedule__tab-icon" />
                        Meetings
                    </button>
                </div>

                {/* Class Schedule Tab */}
                {activeTab === 'classes' && (
                    <div className="mys-hsu-teach-schedule__tab-content" data-testid="teacher-panel-classes">
                        <div className="mys-hsu-teach-schedule__schedule-card">
                            <div className="mys-hsu-teach-schedule__schedule-header">
                                <h3 className="mys-hsu-teach-schedule__schedule-title">{selectedDay}'s Schedule</h3>
                                <span className="mys-hsu-teach-schedule__schedule-count">{currentDaySchedule.length} Classes</span>
                            </div>

                            <div className="mys-hsu-teach-schedule__classes-list">
                                {currentDaySchedule.length === 0 ? (
                                    <div className="mys-hsu-teach-schedule__empty-state" data-testid="teacher-message-no-classes">
                                        <Calendar className="mys-hsu-teach-schedule__empty-icon" />
                                        <p className="mys-hsu-teach-schedule__empty-text">No classes scheduled for {selectedDay}</p>
                                    </div>
                                ) : (
                                    currentDaySchedule.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="mys-hsu-teach-schedule__class-card"
                                            data-testid={`teacher-card-class-${schedule.id}`}
                                        >
                                            <div className={`mys-hsu-teach-schedule__class-time-box mys-hsu-teach-schedule__class-time-box--${schedule.type}`}>
                                                <div className="mys-hsu-teach-schedule__class-time-label">Start</div>
                                                <div className="mys-hsu-teach-schedule__class-time-value">{schedule.time.split(' ')[0]}</div>
                                            </div>

                                            <div className="mys-hsu-teach-schedule__class-info">
                                                <div className="mys-hsu-teach-schedule__class-header">
                                                    <h3 className="mys-hsu-teach-schedule__class-subject">{schedule.subject}</h3>
                                                    <span className={`mys-hsu-teach-schedule__type-badge ${getTypeColor(schedule.type)}`}>
                                                        {schedule.type}
                                                    </span>
                                                </div>
                                                <div className="mys-hsu-teach-schedule__class-meta">
                                                    <span className="mys-hsu-teach-schedule__class-meta-item">
                                                        <BookOpen className="mys-hsu-teach-schedule__meta-icon" />
                                                        {schedule.class}
                                                    </span>
                                                    <span className="mys-hsu-teach-schedule__class-meta-item">
                                                        <Clock className="mys-hsu-teach-schedule__meta-icon" />
                                                        {schedule.duration}
                                                    </span>
                                                    <span className="mys-hsu-teach-schedule__class-meta-item">
                                                        <MapPin className="mys-hsu-teach-schedule__meta-icon" />
                                                        {schedule.room}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Meetings Tab */}
                {activeTab === 'meetings' && (
                    <div className="mys-hsu-teach-schedule__tab-content" data-testid="teacher-panel-meetings">
                        {/* Teacher Meetings */}
                        <div className="mys-hsu-teach-schedule__meeting-card">
                            <div className="mys-hsu-teach-schedule__meeting-header">
                                <h3 className="mys-hsu-teach-schedule__meeting-title">My Meetings</h3>
                                <button
                                    className="mys-hsu-teach-schedule__add-btn"
                                    onClick={() => setShowAddMeetingDialog(true)}
                                    data-testid="teacher-button-add-meeting"
                                >
                                    <Plus className="mys-hsu-teach-schedule__btn-icon" />
                                    Add Meeting
                                </button>
                            </div>

                            <div className="mys-hsu-teach-schedule__meetings-list">
                                {meetings.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="mys-hsu-teach-schedule__meeting-item"
                                        data-testid={`teacher-card-meeting-${meeting.id}`}
                                    >
                                        <div className="mys-hsu-teach-schedule__meeting-icon">
                                            {meeting.isOnline ? <Video className="mys-hsu-teach-schedule__icon" /> : <Users className="mys-hsu-teach-schedule__icon" />}
                                        </div>

                                        <div className="mys-hsu-teach-schedule__meeting-info">
                                            <div className="mys-hsu-teach-schedule__meeting-header-row">
                                                <h4 className="mys-hsu-teach-schedule__meeting-name">{meeting.title}</h4>
                                                <span className={`mys-hsu-teach-schedule__status-badge ${getStatusColor(meeting.status)}`}>
                                                    {meeting.status}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__type-badge">
                                                    {meeting.type}
                                                </span>
                                            </div>
                                            <div className="mys-hsu-teach-schedule__meeting-meta">
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <Clock className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.time} • {meeting.duration}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <MapPin className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.location}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <Users className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.attendees} attendees
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mys-hsu-teach-schedule__meeting-actions">
                                            {meeting.isOnline && meeting.status === 'upcoming' && (
                                                <button
                                                    className="mys-hsu-teach-schedule__action-btn mys-hsu-teach-schedule__action-btn--join"
                                                    onClick={() => alert('Joining meeting...')}
                                                    data-testid={`teacher-button-join-meeting-${meeting.id}`}
                                                >
                                                    <Video className="mys-hsu-teach-schedule__btn-icon" />
                                                    Join
                                                </button>
                                            )}
                                            <button
                                                className="mys-hsu-teach-schedule__action-btn mys-hsu-teach-schedule__action-btn--delete"
                                                onClick={() => handleDeleteMeeting(meeting.id)}
                                                data-testid={`teacher-button-delete-meeting-${meeting.id}`}
                                            >
                                                <Trash2 className="mys-hsu-teach-schedule__btn-icon" />
                                                Delete
                                            </button>
                                            <button
                                                className="mys-hsu-teach-schedule__action-btn mys-hsu-teach-schedule__action-btn--edit"
                                                onClick={() => handleEditMeeting(meeting.id)}
                                                data-testid={`teacher-button-edit-meeting-${meeting.id}`}
                                            >
                                                <Edit className="mys-hsu-teach-schedule__btn-icon" />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Management Meetings */}
                        <div className="mys-hsu-teach-schedule__meeting-card mys-hsu-teach-schedule__meeting-card--management">
                            <div className="mys-hsu-teach-schedule__meeting-header">
                                <div className="mys-hsu-teach-schedule__header-with-icon">
                                    <Bell className="mys-hsu-teach-schedule__header-bell-icon" />
                                    <h3 className="mys-hsu-teach-schedule__meeting-title">Management Meetings</h3>
                                </div>
                                <span className="mys-hsu-teach-schedule__mandatory-badge">
                                    {managementMeetings.length} Mandatory
                                </span>
                            </div>

                            <div className="mys-hsu-teach-schedule__meetings-list">
                                {managementMeetings.map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        className="mys-hsu-teach-schedule__meeting-item mys-hsu-teach-schedule__meeting-item--mandatory"
                                        data-testid={`teacher-card-management-meeting-${meeting.id}`}
                                    >
                                        <div className="mys-hsu-teach-schedule__meeting-icon">
                                            {meeting.isOnline ? <Video className="mys-hsu-teach-schedule__icon" /> : <Bell className="mys-hsu-teach-schedule__icon" />}
                                        </div>

                                        <div className="mys-hsu-teach-schedule__meeting-info">
                                            <div className="mys-hsu-teach-schedule__meeting-header-row">
                                                <h4 className="mys-hsu-teach-schedule__meeting-name">{meeting.title}</h4>
                                                <span className="mys-hsu-teach-schedule__type-badge mys-hsu-teach-schedule__type-badge--management">
                                                    {meeting.type}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__mandatory-badge-small">
                                                    Mandatory
                                                </span>
                                            </div>
                                            <div className="mys-hsu-teach-schedule__meeting-meta">
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <Clock className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.time} • {meeting.duration}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <MapPin className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.location}
                                                </span>
                                                <span className="mys-hsu-teach-schedule__meeting-meta-item">
                                                    <Users className="mys-hsu-teach-schedule__meta-icon" />
                                                    {meeting.attendees} attendees
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mys-hsu-teach-schedule__meeting-actions">
                                            {meeting.isOnline && (
                                                <button
                                                    className="mys-hsu-teach-schedule__action-btn mys-hsu-teach-schedule__action-btn--join"
                                                    onClick={() => alert('Joining meeting...')}
                                                    data-testid={`teacher-button-join-mgmt-meeting-${meeting.id}`}
                                                >
                                                    <Video className="mys-hsu-teach-schedule__btn-icon" />
                                                    Join
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Meeting Dialog */}
            {showAddMeetingDialog && (
                <div className="mys-hsu-teach-schedule__modal-overlay" onClick={() => setShowAddMeetingDialog(false)}>
                    <div
                        className="mys-hsu-teach-schedule__modal"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="teacher-modal-add-meeting"
                    >
                        <div className="mys-hsu-teach-schedule__modal-header">
                            <h3 className="mys-hsu-teach-schedule__modal-title">Schedule Meeting</h3>
                            <button
                                className="mys-hsu-teach-schedule__modal-close"
                                onClick={() => setShowAddMeetingDialog(false)}
                                data-testid="teacher-button-close-meeting-modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mys-hsu-teach-schedule__modal-body">
                            <div className="mys-hsu-teach-schedule__form-group">
                                <label className="mys-hsu-teach-schedule__form-label">Meeting Title</label>
                                <input
                                    type="text"
                                    className="mys-hsu-teach-schedule__form-input"
                                    placeholder="Enter meeting title"
                                    data-testid="teacher-field-meeting-title"
                                />
                            </div>

                            <div className="mys-hsu-teach-schedule__form-row">
                                <div className="mys-hsu-teach-schedule__form-group">
                                    <label className="mys-hsu-teach-schedule__form-label">Type</label>
                                    <select className="mys-hsu-teach-schedule__form-select" data-testid="teacher-dropdown-meeting-type">
                                        <option value="">Select type</option>
                                        <option value="ptm">PTM</option>
                                        <option value="staff">Staff Meeting</option>
                                        <option value="training">Training</option>
                                    </select>
                                </div>

                                <div className="mys-hsu-teach-schedule__form-group">
                                    <label className="mys-hsu-teach-schedule__form-label">Mode</label>
                                    <select
                                        className="mys-hsu-teach-schedule__form-select"
                                        value={meetingMode}
                                        onChange={(e) => setMeetingMode(e.target.value)}
                                        data-testid="teacher-dropdown-meeting-mode"
                                    >
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mys-hsu-teach-schedule__form-group">
                                <label className="mys-hsu-teach-schedule__form-label">Date</label>
                                <input
                                    type="date"
                                    className="mys-hsu-teach-schedule__form-input"
                                    data-testid="teacher-field-meeting-date"
                                />
                            </div>

                            <div className="mys-hsu-teach-schedule__form-row">
                                <div className="mys-hsu-teach-schedule__form-group">
                                    <label className="mys-hsu-teach-schedule__form-label">Time</label>
                                    <input
                                        type="time"
                                        className="mys-hsu-teach-schedule__form-input"
                                        data-testid="teacher-field-meeting-time"
                                    />
                                </div>

                                <div className="mys-hsu-teach-schedule__form-group">
                                    <label className="mys-hsu-teach-schedule__form-label">Duration</label>
                                    <input
                                        type="text"
                                        className="mys-hsu-teach-schedule__form-input"
                                        placeholder="e.g., 1 hr"
                                        data-testid="teacher-field-meeting-duration"
                                    />
                                </div>
                            </div>

                            <div className="mys-hsu-teach-schedule__form-group">
                                <label className="mys-hsu-teach-schedule__form-label">
                                    {meetingMode === 'online' ? 'Meeting Link' : 'Location'}
                                </label>
                                <input
                                    type="text"
                                    className="mys-hsu-teach-schedule__form-input"
                                    placeholder={meetingMode === 'online' ? 'https://meet.google.com/...' : 'Room number or venue'}
                                    data-testid="teacher-field-meeting-location"
                                />
                            </div>

                            <div className="mys-hsu-teach-schedule__form-group">
                                <label className="mys-hsu-teach-schedule__form-label">Description</label>
                                <textarea
                                    className="mys-hsu-teach-schedule__form-textarea"
                                    placeholder="Meeting agenda..."
                                    rows="3"
                                    data-testid="teacher-field-meeting-description"
                                />
                            </div>
                        </div>

                        <div className="mys-hsu-teach-schedule__modal-footer">
                            <button
                                className="mys-hsu-teach-schedule__modal-btn mys-hsu-teach-schedule__modal-btn--cancel"
                                onClick={() => setShowAddMeetingDialog(false)}
                                data-testid="teacher-button-cancel-meeting"
                            >
                                Cancel
                            </button>
                            <button
                                className="mys-hsu-teach-schedule__modal-btn mys-hsu-teach-schedule__modal-btn--save"
                                onClick={handleAddMeeting}
                                data-testid="teacher-button-save-meeting"
                            >
                                Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FloatingAIAssistant />
        </div>
    );
};

export default MySchedule;