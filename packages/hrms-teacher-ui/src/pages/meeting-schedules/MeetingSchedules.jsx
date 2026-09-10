import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/MeetingSchedules.scss';

// ── Helpers ──────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

const TODAY = '2026-04-13';

const INITIAL_MEETINGS = [
  {
    id: 1,
    title: 'Exam Coordination Meeting',
    date: '2026-03-08',
    time: '2:30 PM',
    duration: '1 hour',
    mode: 'virtual',
    location: '',
    link: 'https://meet.google.com/exam-coord',
    participantsCount: 10,
    audienceType: 'Management',
    status: 'completed',
    priority: 'high',
    agenda: 'Coordinate upcoming board exam schedules and responsibilities.',
    participants: [
      { initials: 'EC', name: 'Exam Controller' },
      { initials: 'SH', name: 'Subject Heads' },
    ],
  },
  {
    id: 2,
    title: 'Monthly Faculty Review',
    date: '2026-03-10',
    time: '10:00 AM',
    duration: '2 hours',
    mode: 'in-person',
    location: 'Main Auditorium',
    link: '',
    participantsCount: 52,
    audienceType: 'Mixed',
    status: 'completed',
    priority: 'medium',
    agenda: 'Monthly review of faculty performance and course delivery.',
    participants: [
      { initials: 'PR', name: 'Principal' },
      { initials: 'VP', name: 'Vice Principal' },
    ],
  },
  {
    id: 3,
    title: 'Parent-Teacher Conference - Class 9A',
    date: '2026-03-15',
    time: '10:00 AM',
    duration: '2 hours',
    mode: 'in-person',
    location: 'Main Auditorium',
    link: '',
    participantsCount: 32,
    audienceType: 'Parents',
    status: 'upcoming',
    priority: 'high',
    agenda: 'Quarterly parent-teacher meeting to discuss student progress and upcoming exam schedule.',
    participants: [
      { initials: 'RS', name: 'Rahul Sharma' },
      { initials: 'MP', name: 'Mathematics Parents' },
    ],
  },
  {
    id: 4,
    title: 'Department Head Meeting',
    date: TODAY,
    time: '2:00 PM',
    duration: '1 hour',
    mode: 'in-person',
    location: 'Conference Room B',
    link: '',
    participantsCount: 8,
    audienceType: 'Management',
    status: 'upcoming',
    priority: 'medium',
    agenda: 'Discuss department goals and curriculum updates for Q2.',
    participants: [
      { initials: 'PR', name: 'Principal' },
      { initials: 'HD', name: 'HODs' },
    ],
  },
  {
    id: 5,
    title: 'Staff Training Workshop',
    date: '2026-04-18',
    time: '9:00 AM',
    duration: '3 hours',
    mode: 'virtual',
    location: '',
    link: 'https://meet.google.com/staff-train',
    participantsCount: 45,
    audienceType: 'Staff',
    status: 'upcoming',
    priority: 'low',
    agenda: 'New digital tools onboarding for teaching staff.',
    participants: [
      { initials: 'IT', name: 'IT Team' },
      { initials: 'ST', name: 'All Staff' },
    ],
  },
];

const priorityDot = (priority) => {
  if (priority === 'high')   return '#ef4444';
  if (priority === 'medium') return '#f59e0b';
  return '#22c55e';
};

const statusClass = (status) => {
  if (status === 'completed') return 'ms2-badge--completed';
  if (status === 'upcoming')  return 'ms2-badge--upcoming';
  return 'ms2-badge--today';
};

const formatCardDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return { mon: SHORT_MONTH_NAMES[d.getMonth()], day: d.getDate() };
};

// ── Details Modal ─────────────────────────────────
const DetailsModal = ({ meeting, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    if (modalRef.current) modalRef.current.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="ms2-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Meeting details">
      <div className="ms2-modal" onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1} data-testid="teacher-meeting-detail-modal">
        <button className="ms2-modal__close" onClick={onClose} aria-label="Close modal">×</button>
        <h2 className="ms2-modal__title">{meeting.title}</h2>
        <p className="ms2-modal__subtitle">View complete meeting details and information</p>

        <div className="ms2-modal__badges">
          <span className={`ms2-badge ${statusClass(meeting.status)}`}>{meeting.status}</span>
          <span className="ms2-badge ms2-badge--mode">
            {meeting.mode === 'virtual' ? (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>{' '}virtual</>
            ) : (
              <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{' '}in-person</>
            )}
          </span>
          <span className={`ms2-badge ms2-badge--priority-${meeting.priority}`}>{meeting.priority} priority</span>
        </div>

        <div className="ms2-modal__info-grid">
          <div className="ms2-modal__info-box ms2-modal__info-box--blue">
            <label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Date</label>
            <span>{new Date(meeting.date + 'T00:00:00').toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}</span>
          </div>
          <div className="ms2-modal__info-box ms2-modal__info-box--purple">
            <label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Time</label>
            <span>{meeting.time} ({meeting.duration})</span>
          </div>
          <div className="ms2-modal__info-box ms2-modal__info-box--orange">
            <label><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Participants</label>
            <span>{meeting.participantsCount} people</span>
          </div>
        </div>

        {meeting.agenda && (
          <div className="ms2-modal__agenda">
            <label>Agenda</label>
            <p>{meeting.agenda}</p>
          </div>
        )}

        {meeting.participants && meeting.participants.length > 0 && (
          <div className="ms2-modal__participants">
            <label>Participants ({meeting.audienceType})</label>
            <div className="ms2-modal__participants-list">
              {meeting.participants.map((p, i) => (
                <div key={i} className="ms2-modal__participant-chip">
                  <span className="ms2-modal__participant-avatar">{p.initials}</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ms2-modal__actions">
          {meeting.status === 'completed' && (
            <button className="ms2-modal__btn ms2-modal__btn--download" data-testid="teacher-meeting-download-summary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Summary
            </button>
          )}
          {meeting.status === 'upcoming' && (
            <>
              <button className="ms2-modal__btn ms2-modal__btn--reschedule" data-testid="teacher-meeting-reschedule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                Reschedule
              </button>
              {meeting.mode === 'virtual' && (
                <button className="ms2-modal__btn ms2-modal__btn--join" data-testid="teacher-meeting-join">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  Join Meeting
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Schedule New Meeting Modal ────────────────────
const ScheduleModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ title:'', date:'', time:'', duration:'1 hour', priority:'Medium', meetingType:'', participantType:'', description:'' });
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    if (modalRef.current) modalRef.current.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = useCallback((field, val) => setForm(p => ({ ...p, [field]: val })), []);

  const handleSave = () => {
    if (!form.title || !form.date || !form.time || !form.meetingType) {
      alert('Please fill all required fields');
      return;
    }
    onSave({
      id: Date.now(),
      title: form.title,
      date: form.date,
      time: form.time,
      duration: form.duration,
      mode: form.meetingType === 'Virtual' ? 'virtual' : 'in-person',
      location: form.meetingType !== 'Virtual' ? 'TBD' : '',
      link: form.meetingType === 'Virtual' ? '#' : '',
      participantsCount: 0,
      audienceType: form.participantType || 'Staff',
      status: 'upcoming',
      priority: form.priority.toLowerCase(),
      agenda: form.description,
      participants: [],
    });
    onClose();
  };

  return (
    <div className="ms2-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Schedule new meeting">
      <div className="ms2-modal ms2-modal--form" onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1} data-testid="teacher-schedule-meeting-modal">
        <button className="ms2-modal__close" onClick={onClose} aria-label="Close">×</button>
        <h2 className="ms2-modal__title">Schedule New Meeting</h2>
        <p className="ms2-modal__subtitle">Fill in the details below to schedule a new meeting</p>

        <div className="ms2-form">
          <div className="ms2-form__group">
            <label>Meeting Title <span className="ms2-req">*</span></label>
            <input type="text" placeholder="e.g., Parent-Teacher Conference" value={form.title} onChange={(e) => set('title', e.target.value)} data-testid="teacher-meeting-title-input" />
          </div>
          <div className="ms2-form__row">
            <div className="ms2-form__group">
              <label>Date <span className="ms2-req">*</span></label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} data-testid="teacher-meeting-date-input" />
            </div>
            <div className="ms2-form__group">
              <label>Time <span className="ms2-req">*</span></label>
              <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} data-testid="teacher-meeting-time-input" />
            </div>
          </div>
          <div className="ms2-form__row">
            <div className="ms2-form__group">
              <label>Duration</label>
              <select value={form.duration} onChange={(e) => set('duration', e.target.value)} data-testid="teacher-meeting-duration-select">
                <option>30 minutes</option><option>1 hour</option><option>1.5 hours</option><option>2 hours</option><option>3 hours</option>
              </select>
            </div>
            <div className="ms2-form__group">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)} data-testid="teacher-meeting-priority-select">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>
          <div className="ms2-form__row">
            <div className="ms2-form__group">
              <label>Meeting Type <span className="ms2-req">*</span></label>
              <select value={form.meetingType} onChange={(e) => set('meetingType', e.target.value)} data-testid="teacher-meeting-type-select">
                <option value="">Select type</option><option>Virtual</option><option>In-Person</option><option>Hybrid</option>
              </select>
            </div>
            <div className="ms2-form__group">
              <label>Participant Type</label>
              <select value={form.participantType} onChange={(e) => set('participantType', e.target.value)} data-testid="teacher-meeting-participants-select">
                <option value="">Select participants</option><option>Staff</option><option>Management</option><option>Students</option><option>Parents</option><option>Mixed</option>
              </select>
            </div>
          </div>
          <div className="ms2-form__group">
            <label>Description</label>
            <textarea placeholder="Add meeting description, agenda, or notes..." value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} data-testid="teacher-meeting-description-textarea" />
          </div>
        </div>

        <div className="ms2-form__footer">
          <button className="ms2-form__cancel" onClick={onClose} data-testid="teacher-meeting-cancel-btn">Cancel</button>
          <button className="ms2-form__submit" onClick={handleSave} data-testid="teacher-meeting-submit-btn">+ Schedule Meeting</button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────
const MeetingSchedules = () => {
  const [meetings, setMeetings]         = useState(INITIAL_MEETINGS);
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3, 1));
  const [detailMeeting, setDetailMeeting] = useState(null);
  const [showSchedule, setShowSchedule]   = useState(false);

  const todayMeetings = useMemo(() => meetings.filter(m => m.date === TODAY), [meetings]);

  const filteredMeetings = useMemo(() => {
    let list = meetings;
    if (activeFilter === 'Today')      list = list.filter(m => m.date === TODAY);
    else if (activeFilter === 'Upcoming')   list = list.filter(m => m.status === 'upcoming');
    else if (activeFilter === 'Completed')  list = list.filter(m => m.status === 'completed');
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(m => m.title.toLowerCase().includes(q) || m.audienceType.toLowerCase().includes(q));
    }
    if (selectedDate) list = list.filter(m => m.date === selectedDate);
    return list.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [meetings, activeFilter, searchTerm, selectedDate]);

  const todayCount       = useMemo(() => meetings.filter(m => m.date === TODAY).length, [meetings]);
  const upcomingCount    = useMemo(() => meetings.filter(m => m.status === 'upcoming').length, [meetings]);
  const totalParticipants = useMemo(() => meetings.reduce((s, m) => s + m.participantsCount, 0), [meetings]);

  const navigateMonth = useCallback((dir) => {
    setCurrentMonth(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + dir); return d; });
  }, []);

  const renderCalendar = () => {
    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const meetingDates = new Set(meetings.map(m => m.date));
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e${i}`} className="ms2-cal__day ms2-cal__day--empty" />);

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const hasMeeting = meetingDates.has(ds);
      const isToday    = ds === TODAY;
      const isSel      = selectedDate === ds;
      days.push(
        <div
          key={d}
          className={`ms2-cal__day${hasMeeting ? ' has-meeting':''}${isToday ? ' is-today':''}${isSel ? ' is-selected':''}`}
          onClick={() => setSelectedDate(isSel ? null : ds)}
          role="button"
          tabIndex={0}
          aria-label={`${d} ${MONTH_NAMES[month]}`}
          onKeyDown={(e) => { if (e.key === 'Enter') setSelectedDate(isSel ? null : ds); }}
        >{d}</div>
      );
    }

    return (
      <div className="ms2-cal">
        <div className="ms2-cal__nav">
          <button onClick={() => navigateMonth(-1)} aria-label="Previous month" data-testid="teacher-meeting-prev-month">‹</button>
          <span className="ms2-cal__month">{MONTH_NAMES[month]} {year}</span>
          <button onClick={() => navigateMonth(1)} aria-label="Next month" data-testid="teacher-meeting-next-month">›</button>
        </div>
        <div className="ms2-cal__weekdays">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="ms2-cal__grid">{days}</div>
      </div>
    );
  };

  const handleSaveMeeting = useCallback((meeting) => {
    setMeetings(prev => [...prev, meeting]);
  }, []);

  return (
    <div className="ms2-page" data-testid="teacher-page-meeting-schedules">
      {/* Hero Header */}
      <div className="ms2-hero" data-testid="teacher-meeting-header">
        <div className="ms2-hero__left">
          <div className="ms2-hero__icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h1 className="ms2-hero__title">Meeting Schedules</h1>
            <p className="ms2-hero__sub">Manage all your meetings in one powerful dashboard</p>
          </div>
        </div>
        <div className="ms2-hero__stats">
          <div className="ms2-hero__stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{todayCount}</span><small>Today</small>
          </div>
          <div className="ms2-hero__stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <span>{upcomingCount}</span><small>Upcoming</small>
          </div>
          <div className="ms2-hero__stat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>{totalParticipants}</span><small>Participants</small>
          </div>
        </div>
        <button className="ms2-hero__cta" onClick={() => setShowSchedule(true)} data-testid="teacher-meeting-schedule-btn">
          + Schedule New Meeting
        </button>
      </div>

      {/* Body */}
      <div className="ms2-body">
        {/* Left: Calendar + Today */}
        <aside className="ms2-left" data-testid="teacher-meeting-left-panel">
          <div className="ms2-panel">
            <h2 className="ms2-panel__title">Calendar</h2>
            {renderCalendar()}
          </div>
          <div className="ms2-panel ms2-today-panel">
            <div className="ms2-today-panel__header">
              <h2 className="ms2-panel__title">Today</h2>
              <span className="ms2-badge ms2-badge--count">{todayMeetings.length} meetings</span>
            </div>
            {todayMeetings.length === 0 ? (
              <p className="ms2-today-panel__empty">No meetings today</p>
            ) : (
              todayMeetings.map(m => (
                <div key={m.id} className="ms2-today-item" data-testid={`teacher-today-meeting-${m.id}`}>
                  <div className="ms2-today-item__dot" />
                  <div>
                    <div className="ms2-today-item__title">{m.title}</div>
                    <div className="ms2-today-item__time">{m.time}</div>
                    <span className="ms2-badge ms2-badge--mode">{m.mode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Right: Search + Cards */}
        <main className="ms2-right" data-testid="teacher-meeting-right-panel">
          <div className="ms2-controls">
            <div className="ms2-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" className="ms2-search__icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search meetings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="ms2-search__input" data-testid="teacher-meeting-search" />
            </div>
            <div className="ms2-filters" role="tablist">
              {['All','Today','Upcoming','Completed'].map(f => (
                <button key={f} className={`ms2-filter-tab${activeFilter === f ? ' active':''}`} onClick={() => setActiveFilter(f)} role="tab" aria-selected={activeFilter === f} data-testid={`teacher-meeting-filter-${f.toLowerCase()}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="ms2-cards">
            {filteredMeetings.length === 0 ? (
              <div className="ms2-empty">No meetings found</div>
            ) : (
              filteredMeetings.map(m => {
                const { mon, day } = formatCardDate(m.date);
                return (
                  <div key={m.id} className="ms2-card" data-testid={`teacher-meeting-card-${m.id}`}>
                    <div className="ms2-card__priority-dot" style={{ background: priorityDot(m.priority) }} />
                    <div className="ms2-card__date">
                      <span className="ms2-card__date-mon">{mon}</span>
                      <span className="ms2-card__date-day">{day}</span>
                    </div>
                    <div className="ms2-card__content">
                      <div className="ms2-card__title">{m.title}</div>
                      <div className="ms2-card__meta">
                        <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {m.time} · {m.duration}</span>
                        {m.mode === 'in-person' && m.location && (
                          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {m.location}</span>
                        )}
                      </div>
                      {m.agenda && <p className="ms2-card__desc">{m.agenda}</p>}
                      <div className="ms2-card__tags">
                        <span className="ms2-badge ms2-badge--mode">{m.mode}</span>
                        <span className="ms2-badge ms2-badge--audience">{m.audienceType}</span>
                        <span className="ms2-badge ms2-badge--participants"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> {m.participantsCount}</span>
                        <span className={`ms2-badge ${statusClass(m.status)}`}>{m.status}</span>
                      </div>
                    </div>
                    <button className="ms2-card__details-btn" onClick={() => setDetailMeeting(m)} data-testid={`teacher-meeting-details-${m.id}`}>
                      Details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {detailMeeting && <DetailsModal meeting={detailMeeting} onClose={() => setDetailMeeting(null)} />}
      {showSchedule  && <ScheduleModal onClose={() => setShowSchedule(false)} onSave={handleSaveMeeting} />}

      <FloatingAIAssistant />
    </div>
  );
};

export default MeetingSchedules;
