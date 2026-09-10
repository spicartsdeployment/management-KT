/**
 * Dashboard Static Data Constants
 * This file contains all static/mock data for the student dashboard.
 * Backend team should return data in these exact formats.
 * 
 * NOTE: Today's Schedule data must match the schedule in DailySchedule component
 * (src/pages/daily-schedule/scheduleData.js - Monday schedule)
 * Structure: 2 periods + morning break + 2 periods + lunch + 2 periods + evening break + 2 periods = 11 cards total
 */

// Student Profile Information
export const studentProfile = {
  name: 'Ananya Sharma',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  grade: 'Grade 11-A',
  rollNumber: '2024-11A-007',
};

// Overall Performance Chart Data (Line Chart)
// Mapped from API: studentMonthlyPerformance → { monthName, attendancePercentage, gradesPercentage, assignmentsPercentage }
// Empty string API values are mapped to 0.
export const performanceData = [
  { month: 'Jan', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Feb', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Mar', Attendance: 73.33, Grades: 84.58, Assignments: 0 },
  { month: 'Apr', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'May', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Jun', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Jul', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Aug', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Sep', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Oct', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Nov', Attendance: 0,     Grades: 0,     Assignments: 0 },
  { month: 'Dec', Attendance: 0,     Grades: 0,     Assignments: 0 },
];


// Performance Legend Configuration
export const performanceLegend = [
  { key: 'Attendance', color: '#fb923c', label: 'Attendance' },
  { key: 'Grades', color: '#a78bfa', label: 'Grades' },
  { key: 'Assignments', color: '#06b6d4', label: 'Assignments' },
];

// Stat Cards - Quick metrics display
// Expected format: Array of stat objects with label, value, color gradient, icon, and optional subtitle
// colorFrom/colorTo match the SCSS gradient in sch-ov-dashboard-stat-card-{id}
// Mapped from API: attendancePercentage, studentDueAssignments, studentLatestExamGrade,
// classStudentRank, studentDailyStudyHours, studentFinalExamAverage
export const statCards = [
  { 
    id: 1,
    label: 'Attendance', 
    value: '73.33%', 
    colorFrom: '#ffb47b',
    colorTo: '#ff914d',
    icon: '↑' 
  },
  { 
    id: 2,
    label: 'Assignments', 
    value: '10 Due', 
    colorFrom: '#5ce1e6',
    colorTo: '#a0e7e5',
    icon: '📋' 
  },
  { 
    id: 3,
    label: 'Grade', 
    value: 'A', 
    colorFrom: '#7fe89a',
    colorTo: '#a7f3d0',
    icon: '⭐' 
  },
  { 
    id: 4,
    label: 'Class Rank', 
    value: '2nd', 
    colorFrom: '#ffa6c1',
    colorTo: '#ffd4e5',
    icon: '🏆' 
  },
  { 
    id: 5,
    label: 'Study Hours', 
    value: '0 hrs', 
    colorFrom: '#6c91ff',
    colorTo: '#a8c0ff',
    icon: '📚', 
    subtitle: "Today's Focus Time" 
  },
  { 
    id: 6,
    label: 'Test Scores', 
    value: '82%', 
    colorFrom: '#ffd88a',
    colorTo: '#ffe8b3',
    icon: '📈', 
    subtitle: 'Average Score' 
  },
];

// Quick Alerts/Notifications
// Expected format: Array of alert objects with text and color indicator
export const quickAlerts = {
  title: 'Quick Alerts',
  icon: '🔔',
  count: 2,
  alerts: [
    { id: 1, text: 'Math assignment due tomorrow', color: '#4ade80' },
    { id: 2, text: 'Parent-teacher meeting on Friday', color: '#fbbf24' },
  ],
};

// Level Progress Data (Pie Chart - Reading/Listening split)
// Expected format: Array of objects with name, value (percentage), and color
export const levelData = {
  overallPercentage: 0,
  breakdown: [
    { name: 'Reading', value: 70, color: '#34d399', activeColor: '#10b981' },   // emerald-400
    { name: 'Listening', value: 30, color: '#d1fae5', activeColor: '#1094b9' }, // emerald-100
  ],
};

// Level Legend Configuration
export const levelLegend = [
  { key: 'Reading', color: '#34d399', activeColor: '#10b981', label: 'Reading' },   // emerald-400
  { key: 'Listening', color: '#d1fae5', activeColor: '#1094b9', label: 'Listening' }, // emerald-100
];

// Subject Overview Data (Bar Chart)
// Expected format: Array of subject objects with name and percentage value
// Mapped from API: subjectSubjectPerformance → { subjectName, performancePercentage }
// Subjects not returned by the API retain their previous placeholder values.
export const subjectOverview = [
  { id: 1, subject: 'Math', value: 83.78, color: '#df6b4f' },
  { id: 2, subject: 'Sci',  value: 85,    color: '#4bb3b3' },
  { id: 3, subject: 'Eng',  value: 91,    color: '#7b6fc7' },
  { id: 4, subject: 'Hist', value: 88,    color: '#5fc18c' },
  { id: 5, subject: 'Art',  value: 95,    color: '#e89ca7' },
  { id: 6, subject: 'PE',   value: 90,    color: '#d6a05a' },
];

// Today's Schedule - Matching DailySchedule Component (Monday)
// Expected format: Object with total count and array of schedule items
// Structure: 2 periods + morning break + 2 periods + lunch + 2 periods + evening break + 2 periods = 11 total
export const todaySchedule = {
  totalClasses: 8,
  schedule: [
    // Period 1
    { 
      id: 1, 
      time: '08:00', 
      subject: 'Mathematics', 
      topic: 'Calculus Integration',
      teacher: 'Ms. Johnson',
      room: 'Room 101',
      status: 'completed',
      type: 'class'
    },
    // Period 2
    { 
      id: 2, 
      time: '08:50', 
      subject: 'English Literature', 
      topic: 'Shakespeare Analysis',
      teacher: 'Mrs. Davis',
      room: 'Room 202',
      status: 'completed',
      type: 'class'
    },
    // Morning Break
    { 
      id: 3, 
      time: '09:35',
      subject: 'Morning Break',
      duration: '5 min',
      status: 'completed',
      type: 'break'
    },
    // Period 3
    { 
      id: 4, 
      time: '09:40', 
      subject: 'Physics', 
      topic: 'Electromagnetic Waves',
      teacher: 'Mr. Smith',
      room: 'Lab 1',
      status: 'current',
      type: 'class'
    },
    // Period 4
    { 
      id: 5, 
      time: '10:30', 
      subject: 'Chemistry', 
      topic: 'Organic Compounds',
      teacher: 'Dr. Brown',
      room: 'Lab 2',
      status: 'upcoming',
      type: 'class'
    },
    // Lunch Break
    { 
      id: 6, 
      time: '11:15',
      subject: 'Lunch Break',
      duration: '45 min',
      status: 'upcoming',
      type: 'break'
    },
    // Period 5
    { 
      id: 7, 
      time: '12:00', 
      subject: 'CS', 
      topic: 'Data Structures',
      teacher: 'Mr. Wilson',
      room: 'Room 303',
      status: 'upcoming',
      type: 'class'
    },
    // Period 6
    { 
      id: 8, 
      time: '12:50', 
      subject: 'History', 
      topic: 'World War II',
      teacher: 'Mrs. Anderson',
      room: 'Room 305',
      status: 'upcoming',
      type: 'class'
    },
    // Evening Break
    { 
      id: 9, 
      time: '13:35',
      subject: 'Evening Break',
      duration: '5 min',
      status: 'upcoming',
      type: 'break'
    },
    // Period 7
    { 
      id: 10, 
      time: '13:40', 
      subject: 'Art & Design', 
      topic: 'Color Theory',
      teacher: 'Ms. Taylor',
      room: 'Art Room',
      status: 'upcoming',
      type: 'class'
    },
    // Period 8
    { 
      id: 11, 
      time: '14:30', 
      subject: 'PE', 
      topic: 'Basketball Practice',
      teacher: 'Coach Roberts',
      room: 'Gym',
      status: 'upcoming',
      type: 'class'
    },
  ],
};

// Learning Progress by Subject
// Expected format: Array of subjects with name, percentage, and color scheme
// Mapped from API: subjectProgress → { subjectName, progressPercentage }
export const learningProgress = [
  { 
    id: 1, 
    subject: 'Mathematics', 
    progress: 70, 
    bgColor: '#fff7ed',     // orange-50
    textColor: '#c2410c',   // orange-700
    barBgColor: '#fed7aa',  // orange-200
    barFillColor: '#fb923c', // orange-400
  },
  { 
    id: 2, 
    subject: 'Science', 
    progress: 50,
    bgColor: '#eff6ff',     // blue-50
    textColor: '#1d4ed8',   // blue-700
    barBgColor: '#bfdbfe',  // blue-200
    barFillColor: '#3b82f6', // blue-500
  },
  { 
    id: 3, 
    subject: 'English', 
    progress: 90,
    bgColor: '#f0fdf4',     // green-50
    textColor: '#15803d',   // green-700
    barBgColor: '#bbf7d0',  // green-200
    barFillColor: '#22c55e', // green-500
  },
  { 
    id: 4, 
    subject: 'Computer', 
    progress: 65,
    bgColor: '#faf5ff',     // purple-50
    textColor: '#7e22ce',   // purple-700
    barBgColor: '#e9d5ff',  // purple-200
    barFillColor: '#a855f7', // purple-500
  },
];

// Recent Achievements
// Expected format: Array of achievement objects with title, description, icon, and color scheme
export const recentAchievements = [
  {
    id: 1,
    title: 'Fast Learner',
    description: 'Completed 5 modules this week',
    icon: '⭐',
    iconColor: '#eab308',  // yellow-500
    bgColor: '#ffedd5',    // orange-100
    textColor: '#c2410c',  // orange-700
  },
  {
    id: 2,
    title: 'Perfect Score',
    description: '100% in Mathematics Quiz',
    icon: '🎯',
    iconColor: '#ec4899',  // pink-500
    bgColor: '#fce7f3',    // pink-100
    textColor: '#be185d',  // pink-700
  },
  {
    id: 3,
    title: 'Consistent Learner',
    description: '7 day learning streak',
    icon: '🔥',
    iconColor: '#ca8a04',  // yellow-600
    bgColor: '#fef9c3',    // yellow-100
    textColor: '#a16207',  // yellow-700
  },
  {
    id: 4,
    title: 'Top Performer',
    description: 'Ranked 1 in class',
    icon: '🏆',
    iconColor: '#a855f7',  // purple-500
    bgColor: '#f3e8ff',    // purple-100
    textColor: '#7e22ce',  // purple-700
  },
];

// Chart Configuration Constants
export const CHART_CONFIG = {
  performanceChart: {
    height: 288, // h-72 = 288px
    domain: [0, 100],
    strokeWidth: 3,
    dotRadius: 5,
    margin: { top: 10, right: 20, left: 0, bottom: 0 },
  },
  levelPieChart: {
    width: 160,
    height: 160,
    innerRadius: 55,
    outerRadius: 75,
    startAngle: 90,
    endAngle: -270,
  },
  subjectBarChart: {
    height: 120,
    minBarHeight: 40,
    maxBarHeight: 100,
  },
};

// Spacing Constants (0.5em consistent throughout)
export const SPACING = {
  gap: '0.5em',
  padding: '0.5em',
  margin: '0.5em',
};
