import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Overview.scss';

// ─── Static Data ──────────────────────────────────

// Get today's date formatted string
const getTodayLabel = () => {
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[today.getMonth()]} ${today.getDate()} · ${days[today.getDay()]}`;
};

const TODAY_LABEL = getTodayLabel();

// Generate TODAY_CLASSES based on weekday (no classes on Sunday)
const generateTodayClasses = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (dayOfWeek === 0) {
    // Sunday - No classes
    return [];
  }

  // 6 classes daily (except Sunday)
  const classesMap = [
    [
      { id: 1, time: '08:00', label: 'Mathematics – 9A', status: 'completed', subject: 'Mathematics', room: 'Room 301', duration: '45 min' },
      { id: 2, time: '08:50', label: 'Mathematics – 10B', status: 'completed', subject: 'Advanced Algebra', room: 'Room 302', duration: '45 min' },
      { id: 3, time: '09:40', label: 'Advanced Algebra – 10A', status: 'live', subject: 'Algebra', attendance: 87, present: 28, room: 'Room 301', duration: '45 min' },
      { id: 4, time: '11:20', label: 'Mathematics – 9B', status: 'upcoming', subject: 'Linear Equations', room: 'Room 303', duration: '45 min' },
      { id: 5, time: '12:10', label: 'Trigonometry – 11A', status: 'upcoming', subject: 'Trigonometry', room: 'Room 401', duration: '45 min' },
      { id: 6, time: '13:50', label: 'Calculus – 12A', status: 'upcoming', subject: 'Calculus', room: 'Room 304', duration: '45 min' },
    ],
    // Monday - same pattern repeats
    [
      { id: 1, time: '08:00', label: 'Mathematics – Class 9A', status: 'completed', subject: 'Mathematics', room: 'Room 301', duration: '45 min' },
      { id: 2, time: '08:50', label: 'Computer Science – Class 12B', status: 'completed', subject: 'Data Structures', room: 'Room 801', duration: '45 min' },
      { id: 3, time: '09:40', label: 'Geography – Class 9A', status: 'live', subject: 'Climate Zones', attendance: 85, present: 26, room: 'Room 701', duration: '45 min' },
      { id: 4, time: '10:30', label: 'Art – Class 10A', status: 'upcoming', subject: 'Oil Painting', room: 'Room 901', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Music – Class 11A', status: 'upcoming', subject: 'Classical Music', room: 'Room 1001', duration: '45 min' },
      { id: 6, time: '12:10', label: 'Physics – Class 10B', status: 'upcoming', subject: 'Energy and Work', room: 'Room 201', duration: '45 min' },
    ],
    // Tuesday
    [
      { id: 1, time: '08:00', label: 'Chemistry – Class 11A', status: 'completed', subject: 'Chemical Reactions', room: 'Room 401', duration: '45 min' },
      { id: 2, time: '08:50', label: 'Biology – Class 12A', status: 'completed', subject: 'Cell Division', room: 'Room 501', duration: '45 min' },
      { id: 3, time: '09:40', label: 'English – Class 10A', status: 'live', subject: 'Poetry Analysis', attendance: 90, present: 29, room: 'Room 101', duration: '45 min' },
      { id: 4, time: '10:30', label: 'History – Class 11B', status: 'upcoming', subject: 'Industrial Revolution', room: 'Room 601', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Mathematics – Class 9A', status: 'upcoming', subject: 'Geometry', room: 'Room 301', duration: '45 min' },
      { id: 6, time: '12:10', label: 'Computer Science – Class 12B', status: 'upcoming', subject: 'Algorithms', room: 'Room 801', duration: '45 min' },
    ],
    // Wednesday
    [
      // { id: 1, time: '08:00', label: 'Geography – Class 9A', status: 'completed', subject: 'Rivers and Valleys', room: 'Room 701', duration: '45 min' },
      { id: 2, time: '08:50', label: 'Art – Class 10A', status: 'completed', subject: 'Watercolor Techniques', room: 'Room 901', duration: '45 min' },
      { id: 3, time: '09:40', label: 'Music – Class 11A', status: 'live', subject: 'Music Theory', attendance: 88, present: 27, room: 'Room 1001', duration: '45 min' },
      { id: 4, time: '10:30', label: 'Physics – Class 10B', status: 'upcoming', subject: 'Electricity Basics', room: 'Room 201', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Chemistry – Class 11A', status: 'upcoming', subject: 'Acids and Bases', room: 'Room 401', duration: '45 min' },
      // { id: 6, time: '12:10', label: 'Biology – Class 12A', status: 'upcoming', subject: 'Genetics', room: 'Room 501', duration: '45 min' },
    ],
    // Thursday
    [
      { id: 1, time: '08:00', label: 'Mathematics – Class 9B', status: 'completed', subject: 'Probability Basics', room: 'Room 303', duration: '45 min' },
      { id: 2, time: '08:50', label: 'English – Class 10A', status: 'completed', subject: 'Grammar Rules', room: 'Room 101', duration: '45 min' },
      { id: 3, time: '09:40', label: 'History – Class 11B', status: 'live', subject: 'Ancient Civilizations', attendance: 92, present: 30, room: 'Room 601', duration: '45 min' },
      { id: 4, time: '10:30', label: 'Computer Science – Class 12B', status: 'upcoming', subject: 'Database Management', room: 'Room 801', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Geography – Class 9A', status: 'upcoming', subject: 'Mountain Formation', room: 'Room 701', duration: '45 min' },
      { id: 6, time: '12:10', label: 'Art – Class 10A', status: 'upcoming', subject: 'Sculpture Basics', room: 'Room 901', duration: '45 min' },
    ],
    // Friday
    [
      { id: 1, time: '08:00', label: 'Music – Class 11A', status: 'completed', subject: 'Rhythm and Tempo', room: 'Room 1001', duration: '45 min' },
      { id: 2, time: '08:50', label: 'Physics – Class 10B', status: 'completed', subject: 'Magnetism', room: 'Room 201', duration: '45 min' },
      { id: 3, time: '09:40', label: 'Chemistry – Class 11A', status: 'live', subject: 'Organic Chemistry', attendance: 86, present: 25, room: 'Room 401', duration: '45 min' },
      { id: 4, time: '10:30', label: 'Biology – Class 12A', status: 'upcoming', subject: 'Evolution Theory', room: 'Room 501', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Mathematics – Class 9A', status: 'upcoming', subject: 'Statistics', room: 'Room 301', duration: '45 min' },
      { id: 6, time: '12:10', label: 'English – Class 10A', status: 'upcoming', subject: 'Creative Writing', room: 'Room 101', duration: '45 min' },
    ],
    // Saturday
    [
      { id: 1, time: '08:00', label: 'Computer Science – Class 12B', status: 'completed', subject: 'Web Development', room: 'Room 801', duration: '45 min' },
      { id: 2, time: '08:50', label: 'English – Class 10A', status: 'completed', subject: 'Comprehension Skills', room: 'Room 101', duration: '45 min' },
      { id: 3, time: '09:40', label: 'History – Class 11B', status: 'live', subject: 'Renaissance Period', attendance: 84, present: 24, room: 'Room 601', duration: '45 min' },
      { id: 4, time: '10:30', label: 'Geography – Class 9A', status: 'upcoming', subject: 'Weather Patterns', room: 'Room 701', duration: '45 min' },
      { id: 5, time: '11:20', label: 'Art – Class 10A', status: 'upcoming', subject: 'Abstract Art', room: 'Room 901', duration: '45 min' },
      { id: 6, time: '12:10', label: 'Music – Class 11A', status: 'upcoming', subject: 'Music Composition', room: 'Room 1001', duration: '45 min' },
    ],
  ];

  return classesMap[dayOfWeek] || [];
};

const TODAY_CLASSES = generateTodayClasses();

const STUDENT_ALERTS = [
  { id: 1, type: 'error', icon: '⊙', title: 'Continuous Absences', desc: 'Arjun Kumar – 3 consecutive days | Priya Desai – 4 consecutive days', time: 'Updated 10 min ago' },
  { id: 2, type: 'warning', icon: '↘', title: 'Low Performers', desc: 'Rohan Patel (45% avg) | Sneha Singh (48% avg) – Academic support needed', time: 'Updated 30 min ago' },
  { id: 3, type: 'purple', icon: '🎂', title: 'Birthdays This Week', desc: 'Aarav Sharma (Nov 20) | Diya Singh (Nov 22) – Celebrate with your students', time: 'This week' },
  { id: 4, type: 'success', icon: '👤+', title: 'New Admissions', desc: 'Karan Mehta joined Class 10A – Science section', time: '1 hour ago' },
  { id: 5, type: 'info', icon: '👤', title: 'Attendance Pending', desc: 'Class 11B attendance not submitted – Submission deadline approaching', time: '2 hours ago' },
];

const ANNOUNCEMENTS = [
  { id: 1, dot: 'orange', title: 'Submit Attendance Today!', sub: 'Due by 5:00 PM', subColor: '#ef4444' },
  { id: 2, dot: 'gray', title: 'Parent Meeting – Feb 18', sub: 'Upcoming', subColor: '#6b7280' },
  { id: 3, dot: 'blue', title: 'New Syllabus Updated', sub: 'View topics', subColor: '#3b82f6' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'error', icon: '⊙', title: 'Attendance Deadline', desc: 'Class 9A attendance must be submitted by 2:00 PM today', time: '15 min ago' },
  { id: 2, type: 'info', icon: 'ℹ', title: 'New Assignment Posted', desc: 'Principal has shared a new assignment for Class 11A', time: '1 hour ago' },
  { id: 3, type: 'purple', icon: '💬', title: 'Parent Meeting Request', desc: 'Mrs. Sharma requested a meeting about student progress', time: '2 hours ago' },
];

const INITIAL_TASKS = [
  { id: 1, title: 'Grade Math Exam Papers (Class 10A)', category: 'Grading', due: 'Nov 22, 2024', priority: 'HIGH', status: 'overdue', badge: '2d overdue', done: false },
  { id: 2, title: 'Submit Attendance Report', category: 'Administration', due: 'Nov 24, 2024', priority: 'HIGH', status: 'today', badge: 'Due Today', done: false },
  { id: 3, title: 'Complete Mid-Term Assessment Entry', category: 'Assessment', due: 'Nov 25, 2024', priority: 'HIGH', status: 'today', badge: '1d left', done: false },
  { id: 4, title: 'Review Student Assignment Submissions', category: 'Grading', due: 'Nov 26, 2024', priority: 'HIGH', status: 'urgent', badge: '2d left', done: false },
  { id: 5, title: 'Prepare Parent-Teacher Meeting Notes', category: 'Meetings', due: 'Nov 27, 2024', priority: 'HIGH', status: 'urgent', badge: '3d left', done: false },
  { id: 6, title: 'Update Lesson Plan for Chapter 6', category: 'Planning', due: 'Nov 28, 2024', priority: 'HIGH', status: 'urgent', badge: '4d left', done: false },
  { id: 7, title: 'Coordinate Sports Day Activities', category: 'Events', due: 'Nov 29, 2024', priority: 'HIGH', status: 'urgent', badge: '5d left', done: false },
  { id: 8, title: 'Review Resource Library Upload', category: 'Resources', due: 'Nov 30, 2024', priority: 'HIGH', status: 'urgent', badge: '6d left', done: false },
  { id: 9, title: 'Submit Leave Application', category: 'Administration', due: 'Dec 1, 2024', priority: 'HIGH', status: 'urgent', badge: '7d left', done: false },
  { id: 10, title: 'Schedule Department Meeting', category: 'Meetings', due: 'Dec 2, 2024', priority: 'HIGH', status: 'urgent', badge: '8d left', done: false },
  { id: 11, title: 'Review Class 9A Evaluations', category: 'Assessment', due: 'Dec 3, 2024', priority: 'HIGH', status: 'urgent', badge: '9d left', done: false },
  { id: 12, title: 'Prepare Semester Report', category: 'Administration', due: 'Dec 4, 2024', priority: 'HIGH', status: 'urgent', badge: '10d left', done: false },
];

const NOTICE_BOARD = [
  { id: 1, tags: [], icon: '⚠', iconBg: '#ef4444', title: 'System Maintenance – Sunday 2:00 AM', desc: 'Portal will be unavailable for 2 hours. Please save all work and sync attendance records before Saturday.', subTags: ['ALERT'], time: 'Today, 8:15 AM', read: false },
  { id: 2, tags: [], icon: '⚠', iconBg: '#ef4444', title: 'System Maintenance – Sunday 2:00 AM', desc: 'Portal will be unavailable for 2 hours. Please save all work and sync attendance records before Saturday.', subTags: ['ALERT'], time: 'Yesterday', read: false },
  { id: 3, tags: [], icon: '🏆', iconBg: '#f59e0b', title: 'Excellence Awards Nomination Open', desc: 'Nominate outstanding students for quarterly awards. Deadline: November 28. Submit via Community page.', subTags: ['OPPORTUNITY'], time: '2 days ago', read: false },
  { id: 4, tags: [], icon: '📈', iconBg: '#22c55e', title: 'New Digital Library Resources Added', desc: '500+ e-books and research papers now available. Share catalog links with students for project work.', subTags: ['UPDATE'], time: '3 days ago', read: false },
  { id: 5, tags: [], icon: '🏆', iconBg: '#f59e0b', title: 'Professional Development Workshop', desc: 'AI in Education: Register for the upcoming workshop on December 5. Limited seats available.', subTags: ['OPPORTUNITY'], time: '3 days ago', read: false },
];

const PERF_METRICS = [
  { id: 1, label: 'CLASS AVARAGE', value: '82%', delta: '+12%', icon: '⊙', color: '#6366f1', bg: '#eef2ff' },
  { id: 2, label: 'ASSIGNMENT RATE', value: '91%', delta: '+5%', icon: '✓', color: '#22c55e', bg: '#f0fdf4' },
  { id: 3, label: 'TOP PERFOMERS', value: '12', delta: '+8%', icon: '〜', color: '#06b6d4', bg: '#ecfeff' },
  { id: 4, label: 'NEED ATTENTION', value: '4', delta: '-2', icon: '⏱', color: '#f59e0b', bg: '#fffbeb' },
];

const AI_RECS = [
  { id: 1, priority: 'HIGH', color: '#ef4444', bg: '#f0fdf4', borderColor: '#a7f3d0', icon: '🏅', title: 'Outstanding Progress in Calculus', desc: 'Class 9A shows 15% improvement with visual teaching methods. Continue this approach for optimal results.', action: 'Maintain strategy', actionColor: '#22c55e' },
  { id: 2, priority: 'HIGH', color: '#ef4444', bg: '#fff7ed', borderColor: '#fde68a', icon: '⏱', title: 'Geometry Needs Attention', desc: '45% of Class 10A struggling with 3D concepts. Score dropped from 82% to 72%. Schedule revision session.', action: 'Plan intervention', actionColor: '#f59e0b' },
  { id: 3, priority: 'MEDIUM', color: '#f59e0b', bg: '#f5f3ff', borderColor: '#ddd6fe', icon: '⚡', title: 'Peak Engagement: 2-4 PM', desc: 'Data shows 30% higher engagement in afternoon sessions for advanced topics. Optimize schedule accordingly.', action: 'Adjust timing', actionColor: '#8b5cf6' },
];

const TOP_PERFORMERS = [
  { rank: 1, name: 'Arjun Sharma', cls: 'Class 9A', score: '95%', delta: '+8%' },
  { rank: 2, name: 'Priya Patel', cls: 'Class 10A', score: '93%', delta: '+12%' },
  { rank: 3, name: 'Rahul Kumar', cls: 'Class 11A', score: '91%', delta: '+5%' },
];

const NEEDS_ATTENTION = [
  { name: 'Ankit Singh', cls: 'Class 10A', score: '62%', delta: '-15%' },
  { name: 'Sneha Reddy', cls: 'Class 9A', score: '65%', delta: '-8%' },
  { name: 'Vikram Joshi', cls: 'Class 11A', score: '68%', delta: '-5%' },
];

const PERFORMANCE_TREND_DATA = [
  { month: 'Aug', score: 70 },
  { month: 'Sep', score: 73 },
  { month: 'Oct', score: 77 },
  { month: 'Nov', score: 81 }
];

const WEEKLY_DATA = [
  { day: 'Mon', participation: 82, homework: 87, attendance: 91 },
  { day: 'Tue', participation: 85, homework: 83, attendance: 90 },
  { day: 'Wed', participation: 78, homework: 92, attendance: 96 },
  { day: 'Thu', participation: 88, homework: 81, attendance: 93 },
  { day: 'Fri', participation: 84, homework: 86, attendance: 90 },
];

const TREND_DATA = [
  { month: 'Aug', c9a: 68, c10a: 65, avg: 67 },
  { month: 'Sep', c9a: 72, c10a: 70, avg: 71 },
  { month: 'Oct', c9a: 76, c10a: 73, avg: 74 },
  { month: 'Nov', c9a: 80, c10a: 77, avg: 78 },
];

// ─── Mini SVG bar chart (no deps) ─────────────────
const MiniBarChart = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  const maxVal = 100;
  const barW = 16;
  const gap = 6;
  const groupW = barW * 3 + gap * 2;
  const groupGap = 28;
  const chartH = 100;
  const svgW = data.length * (groupW + groupGap);

  return (
    <div className="ov-bar-chart" style={{ overflowX: 'auto' }}>
      <svg width={svgW} height={chartH + 40} style={{ display: 'block' }}>
        {/* Y axis labels */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <text x={0} y={chartH - (v / maxVal) * chartH + 4} fontSize="9" fill="#94a3b8">{v}</text>
            <line x1={20} y1={chartH - (v / maxVal) * chartH} x2={svgW} y2={chartH - (v / maxVal) * chartH} stroke="#e2e8f0" strokeDasharray="3 3" />
          </g>
        ))}
        {data.map((d, gi) => {
          const x0 = 24 + gi * (groupW + groupGap);
          const bars = [
            { val: d.participation, color: '#6366f1' },
            { val: d.homework, color: '#22c55e' },
            { val: d.attendance, color: '#a78bfa' },
          ];
          return (
            <g key={d.day}
              onMouseEnter={() => setTooltip({ gi, d })}
              onMouseLeave={() => setTooltip(null)}
            >
              {tooltip?.gi === gi && (
                <rect x={x0 - 6} y={0} width={groupW + 12} height={chartH + 8} fill="rgba(0,0,0,0.04)" rx={4} />
              )}
              {bars.map((b, bi) => {
                const bx = x0 + bi * (barW + gap);
                const bh = (b.val / maxVal) * chartH;
                return (
                  <rect key={bi} x={bx} y={chartH - bh} width={barW} height={bh} fill={b.color} rx={3} />
                );
              })}
              <text x={x0 + groupW / 2} y={chartH + 16} textAnchor="middle" fontSize="11" fill="#64748b">{d.day}</text>
              {tooltip?.gi === gi && (
                <g>
                  <rect x={x0 - 4} y={chartH / 2 - 30} width={90} height={60} fill="white" stroke="#e2e8f0" strokeWidth={1} rx={6} />
                  <text x={x0} y={chartH / 2 - 16} fontSize="10" fontWeight="bold" fill="#1e293b">{d.day}</text>
                  <text x={x0} y={chartH / 2 - 4} fontSize="9" fill="#6366f1">Participation % : {d.participation}</text>
                  <text x={x0} y={chartH / 2 + 8} fontSize="9" fill="#22c55e">Homework % : {d.homework}</text>
                  <text x={x0} y={chartH / 2 + 20} fontSize="9" fill="#a78bfa">Attendance % : {d.attendance}</text>
                </g>
              )}
            </g>
          );
        })}
        {/* Legend */}
        {[{ color: '#6366f1', label: 'Participation %' }, { color: '#22c55e', label: 'Homework %' }, { color: '#a78bfa', label: 'Attendance %' }].map((l, i) => (
          <g key={i} transform={`translate(${24 + i * 110}, ${chartH + 28})`}>
            <rect width={10} height={10} fill={l.color} rx={2} />
            <text x={14} y={9} fontSize="9" fill="#64748b">{l.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Performance Trend Bar Chart ──────────────────
// ─── Performance Trend Bar Chart ──────────────────
const PerformanceTrendChart = ({ data, onMonthClick }) => {
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  const maxVal = 100;
  const viewBoxWidth = 800;
  const viewBoxHeight = 280;

  const padLeft = 1;
  const padRight = 1;
  const padTop = 16;
  const padBottom = 48;

  const chartWidth = viewBoxWidth - padLeft - padRight;
  const chartAreaHeight = viewBoxHeight - padTop - padBottom;

  const numBars = data.length;
  const sectionWidth = chartWidth / numBars;
  const barWidth = sectionWidth * 0.55;

  // ── Detect which bar the mouse is over using container-level mousemove ──
  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const svgEl = container.querySelector('svg');
    const svgRect = svgEl.getBoundingClientRect();

    // Mouse position relative to SVG top-left, in SVG coords
    const scale = viewBoxWidth / svgRect.width;
    const mouseX = (e.clientX - svgRect.left) * scale;
    const mouseY = (e.clientY - svgRect.top) * scale;

    // Check if mouse is within chart area vertically
    if (mouseY < padTop || mouseY > padTop + chartAreaHeight) {
      setTooltip(null);
      return;
    }

    // Find which section the mouse is in
    const relX = mouseX - padLeft;
    const sectionIndex = Math.floor(relX / sectionWidth);

    if (sectionIndex < 0 || sectionIndex >= data.length) {
      setTooltip(null);
      return;
    }

    const d = data[sectionIndex];
    const containerRect = container.getBoundingClientRect();
    const barCenterSVG = padLeft + sectionIndex * sectionWidth + sectionWidth / 2;
    const scaleInv = svgRect.width / viewBoxWidth;
    const left = svgRect.left - containerRect.left + barCenterSVG * scaleInv;
    const top = svgRect.top - containerRect.top + padTop * scaleInv - 4;

    setTooltip({ i: sectionIndex, d, left, top });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div
      className="ov-performance-chart"
      ref={containerRef}
      data-testid="teacher-chart-performance-trend"
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {data.map((_, i) => (
            <linearGradient key={`grad-${i}`} id={`barGradient-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          ))}
          {data.map((_, i) => (
            <linearGradient key={`grad-h-${i}`} id={`barGradientHover-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          ))}
        </defs>

        {/* Y-axis grid lines + labels */}
        {[0, 25, 50, 75, 100].map((val) => {
          const yPos = padTop + chartAreaHeight - (val / maxVal) * chartAreaHeight;
          return (
            <g key={`y-${val}`}>
              <text
                x={padLeft - 8}
                y={yPos + 4}
                fontSize="11"
                fontWeight="500"
                fill="#94a3b8"
                textAnchor="end"
              >
                {val}
              </text>
              <line
                x1={padLeft}
                y1={yPos}
                x2={viewBoxWidth - padRight}
                y2={yPos}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const sectionX = padLeft + i * sectionWidth;
          const barX = sectionX + (sectionWidth - barWidth) / 2;
          const barHeight = (d.score / maxVal) * chartAreaHeight;
          const barY = padTop + chartAreaHeight - barHeight;
          const isHovered = tooltip?.i === i;

          return (
            <g key={d.month}>
              {/* Hover highlight */}
              {isHovered && (
                <rect
                  x={sectionX + 4}
                  y={padTop}
                  width={sectionWidth - 8}
                  height={chartAreaHeight}
                  fill="#f1f5f9"
                  rx="6"
                />
              )}

              {/* Bar */}
              <rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={isHovered ? `url(#barGradientHover-${i})` : `url(#barGradient-${i})`}
                rx="7"
                style={{ cursor: 'pointer', transition: 'fill 120ms ease' }}
                onClick={() => onMonthClick && onMonthClick(d.month, d.score)}
              />

              {/* Month label */}
              <text
                x={sectionX + sectionWidth / 2}
                y={viewBoxHeight - 14}
                fontSize="13"
                fontWeight="600"
                fill="#64748b"
                textAnchor="middle"
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* DOM tooltip — stable, never flickers */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.left,
            top: tooltip.top,
            transform: 'translateX(-50%) translateY(-100%)',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '10px 16px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            pointerEvents: 'none',   // ← critical: tooltip never steals mouse events
            zIndex: 20,
            minWidth: '130px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
            {tooltip.d.month}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>
            Average Score
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#6366f1' }}>
            % : {tooltip.d.score}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Mini Line Chart ───────────────────────────────
const MiniLineChart = ({ data }) => {
  const W = 340, H = 120;
  const padL = 28, padR = 10, padT = 10, padB = 30;
  const cW = W - padL - padR, cH = H - padT - padB;
  const toX = (i) => padL + (i / (data.length - 1)) * cW;
  const toY = (v) => padT + cH - ((v - 60) / 40) * cH;
  const path = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d[key])}`).join(' ');
  const area = (key) => `${path(key)} L${toX(data.length - 1)},${padT + cH} L${padL},${padT + cH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {[60, 70, 80, 90, 100].map(v => (
        <g key={v}>
          <text x={padL - 4} y={toY(v) + 4} textAnchor="end" fontSize="8" fill="#94a3b8">{v}</text>
          <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="#e2e8f0" />
        </g>
      ))}
      <defs>
        <linearGradient id="g9a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" /></linearGradient>
        <linearGradient id="gavg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" /><stop offset="100%" stopColor="#22c55e" stopOpacity="0" /></linearGradient>
      </defs>
      <path d={area('c9a')} fill="url(#g9a)" />
      <path d={path('c9a')} fill="none" stroke="#06b6d4" strokeWidth="2" />
      <path d={path('c10a')} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={path('avg')} fill="url(#gavg)" />
      <path d={path('avg')} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3" />
      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.month}</text>
      ))}
      {[{ color: '#06b6d4', label: '→ Class 9A' }, { color: '#06b6d4', label: '← Class 10A' }, { color: '#22c55e', label: '← Average' }].map((l, i) => (
        <g key={i} transform={`translate(${padL + i * 90}, ${H + 8})`}>
          <line x1={0} y1={5} x2={14} y2={5} stroke={l.color} strokeWidth="2" />
          <text x={18} y={9} fontSize="8" fill="#64748b">{l.label}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── Simple Radar/Pentagon ─────────────────────────
const RadarChart = () => {
  const labels = ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'];
  const values = [0.85, 0.65, 0.80, 0.72, 0.78];
  const cx = 110, cy = 100, r = 70;
  const pts = labels.map((_, i) => {
    const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
    return { lx: cx + Math.cos(angle) * (r + 18), ly: cy + Math.sin(angle) * (r + 18), x: (v) => cx + Math.cos(angle) * r * v, y: (v) => cy + Math.sin(angle) * r * v };
  });
  const poly = values.map((v, i) => `${pts[i].x(v)},${pts[i].y(v)}`).join(' ');
  const axes = [0.25, 0.5, 0.75, 1].map(v => pts.map(p => `${p.x(v)},${p.y(v)}`).join(' '));

  return (
    <svg width="100%" viewBox="0 0 220 200">
      {axes.map((a, i) => <polygon key={i} points={a} fill="none" stroke="#e2e8f0" strokeWidth="1" />)}
      {pts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x(1)} y2={p.y(1)} stroke="#e2e8f0" strokeWidth="1" />)}
      <polygon points={poly} fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="2" />
      {labels.map((l, i) => <text key={i} x={pts[i].lx} y={pts[i].ly} textAnchor="middle" fontSize="9" fill="#64748b" dominantBaseline="middle">{l}</text>)}
    </svg>
  );
};

// ─── Task Filter Tabs ──────────────────────────────
const TASK_FILTERS = [
  { key: 'All', count: 12, color: 'default' },
  { key: 'Urgent', count: 4, color: 'red' },
  { key: 'Overdue', count: 4, color: 'red' },
  { key: 'Today', count: 1, color: 'default' },
];

const tagColor = (tag) => {
  if (tag === 'IMPORTANT') return 'ov-tag--red';
  if (tag === 'ALERT') return 'ov-tag--orange';
  if (tag === 'INFO') return 'ov-tag--blue';
  if (tag === 'UPDATE') return 'ov-tag--teal';
  if (tag === 'OPPORTUNITY') return 'ov-tag--amber';
  if (tag === 'FYI') return 'ov-tag--gray';
  return '';
};

// ─── Overview Component ────────────────────────────
const Overview = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [taskFilter, setTaskFilter] = useState('All');
  const [notices, setNotices] = useState(NOTICE_BOARD);
  const [showAnnNew, setShowAnnNew] = useState(false);
  const [newAnn, setNewAnn] = useState('');
  const [localAnns, setLocalAnns] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'All') return tasks;
    if (taskFilter === 'Urgent') return tasks.filter(t => t.status === 'urgent');
    if (taskFilter === 'Overdue') return tasks.filter(t => t.status === 'overdue');
    if (taskFilter === 'Today') return tasks.filter(t => t.status === 'today');
    return tasks;
  }, [tasks, taskFilter]);

  const completedCount = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const progressPct = useMemo(() => Math.round((completedCount / tasks.length) * 100), [completedCount, tasks.length]);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const markNoticeRead = useCallback((id) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleAddAnn = () => {
    if (!newAnn.trim()) return;
    setLocalAnns(prev => [{ id: Date.now(), dot: 'blue', title: newAnn, sub: 'Just now', subColor: '#6b7280' }, ...prev]);
    setNewAnn('');
    setShowAnnNew(false);
  };

  const handleMonthClick = (month, score) => {
    setSelectedMonth(month);
    setSelectedScore(score);
    // Log the clicked data for reference
    console.log(`Performance Report for ${month}: ${score}%`);
  };

  return (
    <div className="ov-page" data-testid="teacher-page-overview">
      {/* ── Greeting Row ── */}
      <div className="ov-greeting-row">
        <div>
          <h1 className="ov-greeting__title">{getGreeting()}, Rahul 👋</h1>
          <p className="ov-greeting__sub">Here&rsquo;s what&rsquo;s happening with your classes today</p>
        </div>
        <div className="ov-greeting__date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          Tuesday, March 10, 2026
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="ov-grid">
        <div className="ov-left-col">
          {/* ── LEFT 50%: TODAY'S CLASSES ── */}

          <div className="ov-panel" data-testid="teacher-section-todays-classes">
            <div className="ov-panel__head">
              <div>
                <h2 className="ov-panel__title">TODAY&rsquo;S CLASSES</h2>
                <p className="ov-panel__sub">{TODAY_LABEL}</p>
              </div>
              <div className="ov-panel__head-right">
                <a
                  className="ov-link-footer"
                  href="javascript:void(0)"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/teacher/day-schedules');
                  }}
                  data-testid="teacher-link-full-schedule"
                >
                  View Full Schedule
                </a>
              </div>
            </div>
            <div className="ov-class-list">
              {TODAY_CLASSES.map(c => {
                // Determine if this is a break
                const isBreak = c.isBreak || c.label?.toLowerCase().includes('break');
                // Format: Class 9A – Mathematics
                let className = c.label;
                if (c.label && c.label.includes('–')) {
                  const parts = c.label.split('–').map(s => s.trim());
                  if (parts.length === 2) className = `Class ${parts[1]} – ${parts[0]}`;
                }
                return (
                  <div key={c.id} className={`ov-class-item ov-class-item--${c.status}${c.status === 'completed' ? ' ov-class-item--disabled' : ''}`} data-testid={`teacher-class-item-${c.id}`}>
                    <span className="ov-class-item__time">{c.time}</span>
                    <span className={`ov-class-item__dot ov-class-item__dot--${c.status}`} />
                    <div className="ov-class-item__content">
                      <div className="ov-class-item__name">{className}</div>
                      {c.status === 'live' && (
                        <div className="ov-class-item__live-detail">
                          <span className="ov-att-pct">{c.attendance}%</span>
                          <span className="ov-att-sub"> · {c.present} Present</span>
                          <div className="ov-class-item__room">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            {c.room} · {c.duration}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ov-class-item__right">
                      {c.status === 'completed' && <span className="ov-badge ov-badge--done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="11" height="11"><polyline points="20 6 9 17 4 12" /></svg> Done</span>}
                      {c.status === 'live' && <><span className="ov-badge ov-badge--live">● LIVE NOW</span>
                        <button className="ov-btn-mark" data-testid="teacher-button-mark-attendance"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/teacher/live-classes');
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                          Mark Attendance
                        </button></>}
                      {/* No upcoming badge for breaks */}
                      {c.status === 'upcoming' && !isBreak && <span className="ov-badge ov-badge--upcoming">Upcoming</span>}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>



          {/* ── LEFT 50%: STUDENT ALERTS ── */}
          <div className="ov-panel ov-alerts-panel" data-testid="teacher-section-student-alerts">
            <div className="ov-panel__head-row">
              <div className="ov-panel__head-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                Student Alerts
              </div>
              <span className="ov-badge ov-badge--count-red">8 Active</span>
            </div>
            {STUDENT_ALERTS.map(a => (
              <div key={a.id} className={`ov-alert-card ov-alert-card--${a.type}`} data-testid={`teacher-alert-${a.id}`}>
                <span className="ov-alert-card__icon">{a.icon}</span>
                <div>
                  <div className="ov-alert-card__title">{a.title}</div>
                  <div className="ov-alert-card__desc">{a.desc}</div>
                  <div className="ov-alert-card__time">{a.time}</div>
                </div>
              </div>
            ))}
            {/* <a className="ov-link-footer ov-link-footer--center" href="#" data-testid="teacher-link-view-all-alerts">View All</a> */}
          </div>

          {/* ── RIGHT 50%: NOTICE BOARD ── */}
          <div className="ov-panel ov-notice-panel" data-testid="teacher-section-notice-board">
            <div className="ov-panel__head-row">
              <div className="ov-tasks-title-group">
                <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" /></svg></div>
                <div>
                  <div className="ov-tasks-panel__title">Notice Board</div>
                  <div className="ov-tasks-panel__sub">Latest updates &amp; announcements</div>
                </div>
              </div>
              <span className="ov-badge ov-badge--count-gray">12 New</span>
            </div>

            <div className="ov-notice-list">
              {notices.map(n => (
                <div key={n.id} className={`ov-notice-item${n.read ? ' read' : ''}`} data-testid={`teacher-notice-${n.id}`}>
                  <div className="ov-notice-item__left">
                    <div className="ov-notice-item__icon" style={{ background: n.iconBg }}>{n.icon}</div>
                  </div>
                  <div className="ov-notice-item__right">
                    <div className="ov-notice-item__header">
                      <div className="ov-notice-item__title">{n.title}</div>

                      {n.read ? (
                        <span className="ov-read-badge" data-testid={`teacher-notice-read-badge-${n.id}`}>
                          {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> */}
                          READ
                        </span>
                      ) : (
                        <button className="ov-mark-read-btn" onClick={() => markNoticeRead(n.id)} data-testid={`teacher-notice-mark-read-${n.id}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

                        </button>
                      )}
                    </div>
                    <div className="ov-notice-item__body">

                      <div className="ov-notice-item__content">

                        <div className="ov-notice-item__desc">{n.desc}</div>
                      </div>
                      <div className="ov-notice-item__meta">
                        <div className="ov-notice-item__maintags">{n.date}
                          {n.tags.map(t => <span key={t} className={`ov-tag ${tagColor(t)}`}>{t}</span>)}
                          {n.subTags.map(t => <span key={t} className={`ov-tag ${tagColor(t)}`}>{t}</span>)}
                        </div>
                        <div>
                          <span className="ov-notice-item__time">{n.time}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="ov-btn-submit-tasks" data-testid="teacher-button-submit-notice">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Submit Notice Acknowledgment ✓
            </button>
          </div>
        </div>
        <div className="ov-right-col">

          {/* ── RIGHT 50%: Today's Summary + Your Work + Compliance ── */}
          <div className="ov-right-col">
            {/* Today's Summary */}
            <div className="ov-panel ov-summary-panel" data-testid="teacher-section-todays-summary">
              <h2 className="ov-panel__title">Today&rsquo;s Summary</h2>
              <div className="ov-summary-cards ov-summary-cards--fullwidth">
                <div className="ov-summary-card">
                  <div className="ov-summary-card__icon ov-summary-card__icon--blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
                  <div><span className="ov-summary-card__num">5</span><span className="ov-summary-card__lbl">Classes</span></div>
                </div>
                <div className="ov-summary-card">
                  <div className="ov-summary-card__icon ov-summary-card__icon--purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                  <div><span className="ov-summary-card__num">2</span><span className="ov-summary-card__lbl">Meetings</span></div>
                </div>
                <div className="ov-summary-card">
                  <div className="ov-summary-card__icon ov-summary-card__icon--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
                  <div><span className="ov-summary-card__num">12</span><span className="ov-summary-card__lbl">Assignments</span></div>
                </div>
              </div>
            </div>

            {/* Your Work + Compliance side by side */}
            <div className="ov-work-compliance-row">
              {/* Your Work */}
              <div className="ov-panel ov-work-panel" data-testid="teacher-section-your-work">
                <h2 className="ov-panel__title">Your Work</h2>
                <div className="ov-work__row">
                  <span>Assignments to Review</span>
                  <span className="ov-work__count">9 </span>
                </div>
                <button
                  className="ov-btn-review" data-testid="teacher-button-review-now"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/teacher/my-classes');
                  }}
                >Review Now →</button>
                <div className="ov-work__actions">
                  <button className="ov-work__action-btn" data-testid="teacher-button-upload-resource"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/teacher/my-classes');
                    }}>
                    <div className="ov-work__action-icon ov-work__action-icon--blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg></div>
                    Upload Resource
                  </button>
                  <button
                    className="ov-work__action-btn" data-testid="teacher-button-create-assignment"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/teacher/my-classes');
                    }}>
                    <div className="ov-work__action-icon ov-work__action-icon--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg></div>
                    Create Assignment
                  </button>
                </div>
              </div>

              {/* Compliance Overview */}
              {/* <div className="ov-panel ov-compliance-panel" data-testid="teacher-section-compliance">
              <div className="ov-panel__head-row">
                <h2 className="ov-panel__title">Compliance Overview</h2>
                <a className="ov-link-sm" href="#">View Details &rsaquo;</a>
              </div>
              <div className="ov-compliance-item">
                <div className="ov-compliance-item__header">
                  <div className="ov-compliance-item__icon ov-compliance-item__icon--blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /></svg></div>
                  <span>Resource Submissions</span>
                  <span className="ov-compliance-item__pct">85%</span>
                </div>
                <p className="ov-compliance-item__sub">+3 today · 85% compliant</p>
                <div className="ov-progress-bar"><div className="ov-progress-bar__fill ov-progress-bar__fill--green" style={{ width: '85%' }} /></div>
              </div>
              <div className="ov-compliance-item">
                <div className="ov-compliance-item__header">
                  <div className="ov-compliance-item__icon ov-compliance-item__icon--purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg></div>
                  <span>Student Evaluations</span>
                  <span className="ov-compliance-item__pct">92%</span>
                </div>
                <p className="ov-compliance-item__sub">+2 today · 92% completed</p>
                <div className="ov-progress-bar"><div className="ov-progress-bar__fill ov-progress-bar__fill--green" style={{ width: '92%' }} /></div>
              </div>
            </div> */}
            </div>
          </div>


          {/* ── RIGHT 50%: ANNOUNCEMENTS + NOTIFICATIONS ── */}
          <div className="ov-right-col ov-right-col--stack">
            {/* Announcements */}
            <div className="ov-panel" data-testid="teacher-section-announcements">
              <div className="ov-panel__head-row">
                <h2 className="ov-panel__title">Announcements</h2>
                {/* <button className="ov-link-sm" onClick={() => setShowAnnNew(p => !p)} data-testid="teacher-button-new-announcement">+ New</button> */}
              </div>
              {showAnnNew && (
                <div className="ov-ann-new">
                  <input className="ov-ann-new__input" placeholder="Type announcement..." value={newAnn} onChange={e => setNewAnn(e.target.value)} data-testid="teacher-input-new-announcement" />
                  <button className="ov-ann-new__save" onClick={handleAddAnn} data-testid="teacher-button-save-announcement">Add</button>
                </div>
              )}
              {[...localAnns, ...ANNOUNCEMENTS].map((a, idx) => (
                <div
                  key={a.id}
                  className={`ov-alert-card ov-alert-card--${a.type || (idx % 5 === 0 ? 'error' : idx % 5 === 1 ? 'warning' : idx % 5 === 2 ? 'purple' : idx % 5 === 3 ? 'success' : 'info')}`}
                  data-testid={`teacher-announcement-${a.id}`}
                >
                  <span className="ov-alert-card__icon">{a.icon || ''}</span>
                  <div>
                    <div className="ov-alert-card__title">{a.title}</div>
                    <div className="ov-alert-card__desc" style={{ color: a.subColor }}>{a.sub}</div>
                  </div>
                </div>
              ))}
              <button className="ov-link-footer ov-link-footer--center" href="#" data-testid="teacher-link-view-all-anns"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/teacher/community');
                }}>View All</button>
            </div>

            {/* Notifications */}
            {/* <div className="ov-panel" data-testid="teacher-section-notifications">
            <div className="ov-panel__head-row">
              <h2 className="ov-panel__title">🔔 Notifications</h2>
              <span className="ov-badge ov-badge--count-red">3 New</span>
            </div>
            {NOTIFICATIONS.map(n => (
              <div key={n.id} className={`ov-alert-card ov-alert-card--${n.type}`} data-testid={`teacher-notification-${n.id}`}>
                <span className="ov-alert-card__icon">{n.icon}</span>
                <div>
                  <div className="ov-alert-card__title">{n.title}</div>
                  <div className="ov-alert-card__desc">{n.desc}</div>
                  <div className="ov-alert-card__time">{n.time}</div>
                </div>
              </div>
            ))}
            <a className="ov-link-footer ov-link-footer--center" href="#" data-testid="teacher-link-view-all-notifications">View All</a>
          </div> */}


          </div>

          {/* ── LEFT 50%: YOUR TASKS ── */}
          <div className="ov-panel ov-tasks-panel" data-testid="teacher-section-your-tasks">
            <div className="ov-panel__head-row ov-tasks-panel__header">
              <div className="ov-tasks-title-group">
                <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                <div>
                  <div className="ov-tasks-panel__title">Your Tasks</div>
                  <div className="ov-tasks-panel__sub">Manage your daily workflow</div>
                </div>
              </div>
              <div className="ov-tasks-progress-label">
                <span>COMPLETED</span>
                <span className="ov-tasks-progress-pct">{progressPct}%</span>
              </div>
            </div>

            {/* <div className="ov-tasks-filter-row" data-testid="teacher-tasks-filter-row">
              <span className="ov-tasks-filter-label">FILTER BY:</span>
              <span className="ov-tasks-count">{filteredTasks.length} tasks</span>
              <div className="ov-tasks-filters ov-tasks-filters--fullwidth">
                {TASK_FILTERS.map(f => (
                  <button
                    key={f.key}
                    className={`ov-task-filter-btn${taskFilter === f.key ? ' active' : ''}${f.color === 'red' ? ' red' : ''}`}
                    onClick={() => setTaskFilter(f.key)}
                    data-testid={`teacher-task-filter-${f.key.toLowerCase()}`}
                    style={{ flex: 1 }}
                  >
                    <span className="ov-task-filter-label">{f.key}</span>
                    <span className="ov-task-filter-badge">{
                      f.key === 'All' ? tasks.length :
                        f.key === 'Urgent' ? tasks.filter(t => t.status === 'urgent').length :
                          f.key === 'Overdue' ? tasks.filter(t => t.status === 'overdue').length :
                            f.key === 'Today' ? tasks.filter(t => t.status === 'today').length : 0
                    }</span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* <div className="ov-task-list" data-testid="teacher-task-list">
              { {filteredTasks.map(t => {
                let bg = '', border = '';
                if (t.status === 'overdue') {
                  bg = '#fef2f2'; border = '#fecaca';
                } else if (t.status === 'urgent') {
                  bg = '#fff7ed'; border = '#fde68a';
                } else if (t.status === 'today') {
                  bg = '#dbeafe'; border = '#93c5fd';
                } else {
                  bg = '#f8fafc'; border = '#e2e8f0';
                }
                return (
                  <div key={t.id} className={`ov-task-item${t.done ? ' done' : ''}`} data-testid={`teacher-task-${t.id}`}
                    style={{ background: bg, border: `2px solid ${border}` }}> }
              return (
              <div
                key={t.id}
                className={`ov-task-item${t.done ? ' done' : ''}`}
              >
                <span
                  className={`ov-task-check${t.done ? ' checked' : ''}`}
                  onClick={() => toggleTask(t.id)}
                  data-testid={`teacher-task-check-${t.id}`}
                >
                  {t.done && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" style={{ background: '#22c55e', borderRadius: '50%' }}><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </span>
                <div className="ov-task-body">
                  <div className="ov-task-title">{t.title}</div>
                  <div className="ov-task-meta">
                    <span className="ov-task-cat">{t.category}</span>
                    <span className="ov-task-due"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> {t.due}</span>
                    <span className="ov-task-priority-badge">{t.priority}</span>
                    <span className={`ov-task-badge-time ov-task-badge-time--${t.status}`}>{t.badge}</span>
                  </div>
                </div>
              </div>
              );
              })}
            </div> */}

            <div className="ov-task-list" data-testid="teacher-task-list">
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`ov-task-item${t.done ? ' done' : ''}`}
                  data-testid={`teacher-task-${t.id}`}
                >
                  <span
                    className={`ov-task-check${t.done ? ' checked' : ''}`}
                    onClick={() => toggleTask(t.id)}
                    data-testid={`teacher-task-check-${t.id}`}
                  >
                    {t.done && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="22"
                        height="22"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>

                  <div className="ov-task-body">
                    <div className="ov-task-title">{t.title}</div>

                    <div className="ov-task-meta">
                      <span className="ov-task-cat">{t.category}</span>

                      <span className="ov-task-due">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="10"
                          height="10"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {t.due}
                      </span>

                      <span className="ov-task-priority-badge">
                        {t.priority}
                      </span>

                      <span
                        className={`ov-task-badge-time ov-task-badge-time--${t.status}`}
                      >
                        {t.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ov-task-progress-section">
              <div className="ov-task-progress-label">
                <span>OVERALL PROGRESS</span>
                <span>{completedCount} of {tasks.length}</span>
              </div>
              <div className="ov-progress-bar"><div className="ov-progress-bar__fill ov-progress-bar__fill--blue" style={{ width: `${progressPct}%` }} /></div>
            </div>
            <button className="ov-btn-submit-tasks" data-testid="teacher-button-submit-tasks">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Submit Completed Tasks ✓
            </button>
          </div>





        </div>
        {/* ── FULL WIDTH: PERFORMANCE ANALYTICS ── */}

      </div>

      <div className="ov-panel ov-perf-panel ov-full-width  ov-panel-analytics" data-testid="teacher-section-performance">
        <div className="ov-perf-header">
          <div className="ov-tasks-title-group">
            <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
            <div>
              <div className="ov-tasks-panel__title">Performance Analytics</div>
              <div className="ov-perf-live-dot"><span className="ov-dot--green" /> AI-Powered Real-time Insights</div>
            </div>
          </div>
          <button className="ov-btn-live" data-testid="teacher-button-live-analysis">
            {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M12 2L2 7l10 5 10-5-10-5z" /></svg>
            Live Analysis */}
            Last Month
          </button>
        </div>

        {/* Metric cards */}
        <div className="ov-perf-metrics">
          {PERF_METRICS.map(m => (
            <div key={m.id} className="ov-perf-metric" data-testid={`teacher-metric-${m.id}`}>
              <div className="ov-perf-metric__top">
                <div className="ov-perf-metric__icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <span className="ov-perf-metric__delta ov-perf-metric__delta--green">{m.delta}</span>
              </div>
              <div className="ov-perf-metric__value" style={{ color: m.color }}>{m.value}</div>
              <div className="ov-perf-metric__label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        {/* <div className="ov-ai-recs-section">
            <div className="ov-ai-recs-title">
              <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
              AI Recommendations
            </div>
            <div className="ov-ai-recs-grid">
              {AI_RECS.map(r => (
                <div key={r.id} className="ov-ai-rec" style={{ background: r.bg, borderColor: r.borderColor }} data-testid={`teacher-ai-rec-${r.id}`}>
                  <div className="ov-ai-rec__head">
                    <span className="ov-ai-rec__icon">{r.icon}</span>
                    <span className="ov-ai-rec__priority" style={{ background: r.priority === 'HIGH' ? '#ef4444' : '#f59e0b' }}>{r.priority}</span>
                  </div>
                  <div className="ov-ai-rec__title">{r.title}</div>
                  <div className="ov-ai-rec__desc">{r.desc}</div>
                  <button className="ov-ai-rec__action" style={{ color: r.actionColor }} data-testid={`teacher-ai-action-${r.id}`}>● {r.action}</button>
                </div>
              ))}
            </div>
          </div> */}

        {/* Charts row */}
        {/* <div className="ov-charts-row">
            <div className="ov-chart-panel">
              <div className="ov-chart-panel__head">
                <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg></div>
                Class Performance Trend
              </div>
              <MiniLineChart data={TREND_DATA} />
            </div>
            <div className="ov-chart-panel">
              <div className="ov-chart-panel__head">
                <div className="ov-tasks-title-icon ov-tasks-title-icon--purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
                Subject Performance
              </div>
              <RadarChart />
            </div>
          </div> */}

        {/* Weekly Engagement */}
        {/* <div className="ov-chart-panel ov-chart-panel--full">
            <div className="ov-chart-panel__head">
              <div className="ov-tasks-title-icon ov-tasks-title-icon--green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
              Weekly Engagement Metrics
            </div>
            <MiniBarChart data={WEEKLY_DATA} />
          </div> */}

        <div className="ov-performance-trend-panel" data-testid="teacher-section-performance-trend">
          <div className="ov-chart-panel__head">
            <div className="ov-tasks-title-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
            Performance Trend
          </div>
          <PerformanceTrendChart data={PERFORMANCE_TREND_DATA} onMonthClick={handleMonthClick} />
        </div>

        {/* Top performers + Needs attention */}
        <div className="ov-performers-row ov-performers-row--with-trend">
          <div className="ov-performer-panel ov-performer-panel--green">
            <div className="ov-chart-panel__head">
              <div className="ov-tasks-title-icon ov-tasks-title-icon--green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg></div>
              Top Performers
            </div>
            {TOP_PERFORMERS.map(p => (
              <div key={p.rank} className="ov-performer-row" data-testid={`teacher-top-performer-${p.rank}`}>
                {/* <span className="ov-performer-rank ov-performer-rank--green">{p.rank}</span> */}
                <div className="ov-performer-info"><div className="ov-performer-name">{p.name}</div><div className="ov-performer-cls">{p.cls}</div></div>
                <div className="ov-performer-score"><span className="green">{p.score}</span><span className="green small">↗ {p.delta}</span></div>
              </div>
            ))}
          </div>
          <div className="ov-performer-panel ov-performer-panel--orange">
            <div className="ov-chart-panel__head">
              <div className="ov-tasks-title-icon ov-tasks-title-icon--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg></div>
              Needs Attention
            </div>
            {NEEDS_ATTENTION.map((p, i) => (
              <div key={i} className="ov-performer-row" data-testid={`teacher-attention-${i}`}>
                {/* <div className="ov-performer-icon-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div> */}
                <div className="ov-performer-info"><div className="ov-performer-name">{p.name}</div><div className="ov-performer-cls">{p.cls}</div></div>
                <div className="ov-performer-score"><span className="red">{p.score}</span><span className="red small">↘ {p.delta}</span></div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <FloatingAIAssistant />
    </div>
  );
};

export default Overview;

