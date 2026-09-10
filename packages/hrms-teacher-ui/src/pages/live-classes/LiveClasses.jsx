import React, { useState, useMemo, useCallback } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import MetricCard from './components/MetricCard';
import PerformanceCard from './components/PerformanceCard';
import StudentTable from './components/StudentTable';
import QuickActions from './components/QuickActions';
import NextClassPlan from './components/NextClassPlan';
import ProgressBar from './components/ProgressBar';
import '../../assets/scss/LiveClasses.scss';

// Initial student roster — 8 students, 2 on leave
const INITIAL_STUDENTS = [
  { id: "1", name: "Aarav Kumar", rollNumber: "9A01", isPresent: true, homeworkCompleted: true, comments: "", pendingHomeworkCount: 0, submissionStatus: true, pendingHomework: [] },
  { id: "2", name: "Diya Sharma", rollNumber: "9A02", isPresent: true, homeworkCompleted: true, comments: "", pendingHomeworkCount: 0, submissionStatus: true, pendingHomework: [] },
  { id: "3", name: "Rohan Patel", rollNumber: "9A03", isPresent: false, homeworkCompleted: false, comments: "", pendingHomeworkCount: 2, submissionStatus: false, pendingHomework: ["Algebra Worksheet", "Geometry Problems"] },
  { id: "4", name: "Ananya Singh", rollNumber: "9A04", isPresent: true, homeworkCompleted: false, comments: "", pendingHomeworkCount: 1, submissionStatus: false, pendingHomework: ["Chapter 5 Exercises"] },
  { id: "5", name: "Ishaan Verma", rollNumber: "9A05", isPresent: true, homeworkCompleted: true, comments: "", pendingHomeworkCount: 0, submissionStatus: true, pendingHomework: [] },
  { id: "6", name: "Priya Desai", rollNumber: "9A06", isPresent: true, homeworkCompleted: true, comments: "", pendingHomeworkCount: 0, submissionStatus: true, pendingHomework: [] },
  { id: "7", name: "Kabir Reddy", rollNumber: "9A07", isPresent: false, homeworkCompleted: false, comments: "", pendingHomeworkCount: 3, submissionStatus: false, pendingHomework: ["Algebra Worksheet", "Geometry Problems", "Trigonometry Assignment"] },
  { id: "8", name: "Saanvi Gupta", rollNumber: "9A08", isPresent: true, homeworkCompleted: true, comments: "", pendingHomeworkCount: 0, submissionStatus: true, pendingHomework: [] },
];


const PERF_METRICS = [
  { title: 'Average Grade', key: 'avgGrade', icon: '👤', color: '#3b82f6', change: '+3.2%', vsInfo: '' },
  { title: 'Weekly Progress', key: 'weeklyProg', icon: '📈', color: '#10b981', change: undefined, vsInfo: 'vs last week' },
  { title: 'Assignment Completion', key: 'assignComp', icon: '🔮', color: '#a855f7', change: '+1.5%', vsInfo: '' },
  { title: 'Class Participation', key: 'classPart', icon: '🏆', color: '#f59e0b', change: '+2.1%', vsInfo: '' },
  { title: 'Homework Submission', key: 'hwSubmit', icon: '⭐', color: '#ec4899', change: '+4.2%', vsInfo: '' },
  { title: 'Test Performance', key: 'testPerf', icon: '👤', color: '#06b6d4', change: '+2.8%', vsInfo: '' },
];

const PERF_VALUES = { avgGrade: 85, weeklyProg: 75, assignComp: 92, classPart: 88, hwSubmit: 94, testPerf: 81 };

const LiveClasses = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [nextTopic, setNextTopic] = useState('');
  const [homework, setHomework] = useState('');
  const [noHomework, setNoHomework] = useState(false);

  // Derived metrics (only non-leave students count)
  const activeStudents = useMemo(() => students.filter(s => !s.onLeave), [students]);
  const presentCount = useMemo(() => activeStudents.filter(s => s.isPresent).length, [activeStudents]);
  const absentCount = useMemo(() => activeStudents.filter(s => !s.isPresent).length, [activeStudents]);
  const hwDoneCount = useMemo(() => activeStudents.filter(s => s.homeworkSubmitted).length, [activeStudents]);
  const hwPendCount = useMemo(() => activeStudents.filter(s => !s.homeworkSubmitted).length, [activeStudents]);
  const totalActive = activeStudents.length;
  const bothCount = useMemo(() => activeStudents.filter(s => s.isPresent && s.homeworkSubmitted).length, [activeStudents]);

  const attendancePct = totalActive ? Math.round((presentCount / totalActive) * 100) : 0;
  const hwPct = totalActive ? Math.round((hwDoneCount / totalActive) * 100) : 0;

  const toggleAttendance = useCallback((id) => {
    setStudents(prev => prev.map(s =>
      s.id === id && !s.onLeave ? { ...s, isPresent: !s.isPresent } : s
    ));
  }, []);

  const toggleHomework = useCallback((id) => {
    setStudents(prev => prev.map(s =>
      s.id === id && !s.onLeave ? { ...s, homeworkSubmitted: !s.homeworkSubmitted } : s
    ));
  }, []);

  const toggleSubmissionStatus = useCallback((id) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id && !s.onLeave
          ? { ...s, submissionStatus: !s.submissionStatus }
          : s
      )
    );
  }, []);

  const updateNote = useCallback((id, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, notes: value } : s));
  }, []);

  const markAllPresent = useCallback(() => {
    setStudents(prev => prev.map(s => s.onLeave ? s : { ...s, isPresent: true }));
  }, []);

  const markAllAbsent = useCallback(() => {
    setStudents(prev => prev.map(s => s.onLeave ? s : { ...s, isPresent: false }));
  }, []);

  const handleSubmit = useCallback(() => {
    window.alert(`Class data saved!\nPresent: ${presentCount}/${totalActive}\nHW Submitted: ${hwDoneCount}/${totalActive}`);
  }, [presentCount, totalActive, hwDoneCount]);

  return (
    <div className="lc-live-classes" data-testid="teacher-page-live-classes">
      {/* ── Header ─────────────────────────────────── */}
      <div className="lc-header">
        <div className="lc-header__left">
          <h1 className="lc-header__title" data-testid="teacher-live-title">Live Classes</h1>
          <span className="lc-badge lc-badge--live">● LIVE NOW</span>
        </div>
        <div className="lc-header__right">
          <span className="lc-header__session">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Session Active
          </span>
        </div>
        <p className="lc-header__subtitle">Real-time class monitoring and student engagement tracking</p>
      </div>

      {/* ── Class Info Card with Metric Cards ──────── */}
      <div className="lc-class-card" data-testid="teacher-live-class-card">
        <div className="lc-class-card__info">
          <div className="lc-class-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </div>
          <div>
            <div className="lc-class-card__name">9A – Mathematics</div>
            <div className="lc-class-card__meta">
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Period 3rd Period
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                {students.length} Students
              </span>
            </div>
          </div>
        </div>

        <div className="lc-metric-cards">
          <MetricCard icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12" /></svg>
          } label="PRESENT" sub="75% attendance rate" value={presentCount} color="green" />
          <MetricCard icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" y1="11" x2="22" y2="11" /></svg>
          } label="ABSENT" sub="Students not present" value={absentCount} color="red" />
          <MetricCard icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          } label="HW DONE" sub="Assignments submitted" value={hwDoneCount} color="blue" />
          <MetricCard icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          } label="HW PENDING" sub="Need to submit" value={hwPendCount} color="orange" />
        </div>

        <QuickActions onMarkAllPresent={markAllPresent} onMarkAllAbsent={markAllAbsent} />
      </div>

      {/* ── Class Performance Metrics ───────────────── */}
      <div className="lc-perf-section" data-testid="teacher-live-performance-section">
        <div className="lc-perf-section__header">
          <div className="lc-perf-section__title-block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="lc-perf-section__icon" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            <div>
              <div className="lc-perf-section__title">Class Performance Metrics</div>
              <div className="lc-perf-section__sub">Real-time performance tracking</div>
            </div>
          </div>
          <span className="lc-badge lc-badge--live-data">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" aria-hidden="true"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Live Data
          </span>
        </div>
        <div className="lc-perf-grid">
          {PERF_METRICS.map(m => (
            <PerformanceCard
              key={m.key}
              title={m.title}
              value={PERF_VALUES[m.key]}
              color={m.color}
              change={m.change}
              icon={m.icon}
            />
          ))}
        </div>
      </div>

      {/* ── Student Roster ──────────────────────────── */}
      <div className="lc-roster-section" data-testid="teacher-live-roster-section">
        <div className="lc-roster-section__header">
          <div className="lc-roster-section__title-block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="lc-roster-section__icon" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            <div>
              <div className="lc-roster-section__title">Student Roster</div>
              <div className="lc-roster-section__sub">Track attendance and homework status</div>
            </div>
          </div>
          <span className="lc-badge lc-badge--count">{students.length} Students</span>
        </div>

        <StudentTable
          students={students}
          onToggleAttendance={toggleAttendance}
          onToggleHomework={toggleHomework}
          onToggleSubmissionStatus={toggleSubmissionStatus}
          onNoteChange={updateNote}
        />
        {/* Plan for Next Class */}
        <NextClassPlan
          nextTopic={nextTopic}
          onTopicChange={setNextTopic}
          homework={homework}
          onHomeworkChange={setHomework}
          noHomework={noHomework}
          onNoHomeworkToggle={() => setNoHomework(p => !p)}
        />

        {/* Progress Bar */}
        <ProgressBar present={presentCount} total={totalActive} onSubmit={handleSubmit} />
      </div>

      {/* ── Bottom Summary Metrics ──────────────────── */}
      {/* <div className="lc-summary" data-testid="teacher-live-summary">
        <div className="lc-summary__card lc-summary__card--green">
          <div className="lc-summary__value">{attendancePct}%</div>
          <div className="lc-summary__label">ATTENDANCE RATE</div>
        </div>
        <div className="lc-summary__card lc-summary__card--purple">
          <div className="lc-summary__value">{hwPct}%</div>
          <div className="lc-summary__label">HOMEWORK RATE</div>
        </div>
        <div className="lc-summary__card lc-summary__card--pink">
          <div className="lc-summary__value">{bothCount}</div>
          <div className="lc-summary__label">ALL COMPLETE</div>
        </div>
      </div> */}

      <FloatingAIAssistant />
    </div>
  );
};

export default LiveClasses;
