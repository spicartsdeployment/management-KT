import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Attendance.scss';

// Student data by class
const allStudentsData = {
  'Class 9A - Mathematics (38 students)': [
    { rollNo: '01', name: 'Aarav Sharma', class: '9A', overallAttendance: 92, isPresent: true },
    { rollNo: '02', name: 'Aadhya Patel', class: '9A', overallAttendance: 88, isPresent: true },
    { rollNo: '03', name: 'Arjun Kumar', class: '9A', overallAttendance: 78, isPresent: false },
    { rollNo: '04', name: 'Ananya Singh', class: '9A', overallAttendance: 95, isPresent: true },
    { rollNo: '05', name: 'Advait Reddy', class: '9A', overallAttendance: 91, isPresent: true },
    { rollNo: '06', name: 'Kavya Singh', class: '9A', overallAttendance: 75, isPresent: false },
    { rollNo: '07', name: 'Lakshmi Nair', class: '9A', overallAttendance: 91, isPresent: true },
    { rollNo: '08', name: 'Aryan Joshi', class: '9A', overallAttendance: 85, isPresent: true },
    { rollNo: '09', name: 'Priya Desai', class: '9A', overallAttendance: 97, isPresent: true },
    { rollNo: '10', name: 'Rohan Mehta', class: '9A', overallAttendance: 89, isPresent: true },
    { rollNo: '11', name: 'Sanya Gupta', class: '9A', overallAttendance: 93, isPresent: true },
    { rollNo: '12', name: 'Vivaan Shah', class: '9A', overallAttendance: 82, isPresent: true },
    { rollNo: '13', name: 'Ishaan Verma', class: '9A', overallAttendance: 87, isPresent: true },
    { rollNo: '14', name: 'Aditya Rao', class: '9A', overallAttendance: 87, isPresent: true },
    { rollNo: '15', name: 'Meera Iyer', class: '9A', overallAttendance: 94, isPresent: true },
    { rollNo: '16', name: 'Dev Kapoor', class: '9A', overallAttendance: 90, isPresent: true },
    { rollNo: '17', name: 'Diya Agarwal', class: '9A', overallAttendance: 86, isPresent: true },
    { rollNo: '18', name: 'Karan Malhotra', class: '9A', overallAttendance: 84, isPresent: true },
    { rollNo: '19', name: 'Kiara Bansal', class: '9A', overallAttendance: 92, isPresent: true },
    { rollNo: '20', name: 'Ayush Saxena', class: '9A', overallAttendance: 88, isPresent: true },
    { rollNo: '21', name: 'Sara Khan', class: '9A', overallAttendance: 91, isPresent: true },
    { rollNo: '22', name: 'Vihaan Chopra', class: '9A', overallAttendance: 85, isPresent: true },
    { rollNo: '23', name: 'Riya Bhatt', class: '9A', overallAttendance: 93, isPresent: true },
    { rollNo: '24', name: 'Arjun Jain', class: '9A', overallAttendance: 87, isPresent: true },
    { rollNo: '25', name: 'Nitya Kulkarni', class: '9A', overallAttendance: 89, isPresent: true },
    { rollNo: '26', name: 'Shaurya Mishra', class: '9A', overallAttendance: 86, isPresent: true },
    { rollNo: '27', name: 'Tanya Deshmukh', class: '9A', overallAttendance: 90, isPresent: true },
    { rollNo: '28', name: 'Yash Sinha', class: '9A', overallAttendance: 84, isPresent: true },
    { rollNo: '29', name: 'Zara Ahmed', class: '9A', overallAttendance: 92, isPresent: true },
    { rollNo: '30', name: 'Kabir Sethi', class: '9A', overallAttendance: 88, isPresent: true },
    { rollNo: '31', name: 'Myra Bose', class: '9A', overallAttendance: 91, isPresent: true },
    { rollNo: '32', name: 'Navya Pillai', class: '9A', overallAttendance: 87, isPresent: true },
    { rollNo: '33', name: 'Ojas Pandey', class: '9A', overallAttendance: 85, isPresent: true },
    { rollNo: '34', name: 'Prisha Thakur', class: '9A', overallAttendance: 93, isPresent: true },
    { rollNo: '35', name: 'Reyansh Dutta', class: '9A', overallAttendance: 89, isPresent: true },
    { rollNo: '36', name: 'Saanvi Ghosh', class: '9A', overallAttendance: 90, isPresent: true },
    { rollNo: '37', name: 'Tanish Menon', class: '9A', overallAttendance: 86, isPresent: true },
    { rollNo: '38', name: 'Urvi Nambiar', class: '9A', overallAttendance: 88, isPresent: true }
  ],
  'Class 10A - Mathematics (35 students)': [
    { rollNo: '01', name: 'Abhay Kumar', class: '10A', overallAttendance: 90, isPresent: true },
    { rollNo: '02', name: 'Aditi Shah', class: '10A', overallAttendance: 87, isPresent: true },
    { rollNo: '03', name: 'Amar Singh', class: '10A', overallAttendance: 92, isPresent: true },
    { rollNo: '04', name: 'Bhavna Reddy', class: '10A', overallAttendance: 85, isPresent: true },
    { rollNo: '05', name: 'Chirag Patel', class: '10A', overallAttendance: 88, isPresent: true },
    { rollNo: '06', name: 'Divya Verma', class: '10A', overallAttendance: 91, isPresent: true },
    { rollNo: '07', name: 'Esha Gupta', class: '10A', overallAttendance: 86, isPresent: true },
    { rollNo: '08', name: 'Farhan Ali', class: '10A', overallAttendance: 89, isPresent: true },
    { rollNo: '09', name: 'Garv Joshi', class: '10A', overallAttendance: 93, isPresent: true },
    { rollNo: '10', name: 'Harini Nair', class: '10A', overallAttendance: 87, isPresent: true },
    { rollNo: '11', name: 'Ishan Mehta', class: '10A', overallAttendance: 90, isPresent: true },
    { rollNo: '12', name: 'Jiya Kapoor', class: '10A', overallAttendance: 88, isPresent: true },
    { rollNo: '13', name: 'Kush Agarwal', class: '10A', overallAttendance: 85, isPresent: true },
    { rollNo: '14', name: 'Lavanya Desai', class: '10A', overallAttendance: 92, isPresent: true },
    { rollNo: '15', name: 'Manav Bansal', class: '10A', overallAttendance: 86, isPresent: true },
    { rollNo: '16', name: 'Naina Malhotra', class: '10A', overallAttendance: 89, isPresent: true },
    { rollNo: '17', name: 'Om Saxena', class: '10A', overallAttendance: 91, isPresent: true },
    { rollNo: '18', name: 'Pari Khan', class: '10A', overallAttendance: 87, isPresent: true },
    { rollNo: '19', name: 'Raghav Chopra', class: '10A', overallAttendance: 88, isPresent: true },
    { rollNo: '20', name: 'Simran Bhatt', class: '10A', overallAttendance: 90, isPresent: true },
    { rollNo: '21', name: 'Tejas Jain', class: '10A', overallAttendance: 85, isPresent: true },
    { rollNo: '22', name: 'Uma Kulkarni', class: '10A', overallAttendance: 92, isPresent: true },
    { rollNo: '23', name: 'Varun Mishra', class: '10A', overallAttendance: 86, isPresent: true },
    { rollNo: '24', name: 'Wisha Deshmukh', class: '10A', overallAttendance: 89, isPresent: true },
    { rollNo: '25', name: 'Yuvraj Sinha', class: '10A', overallAttendance: 91, isPresent: true },
    { rollNo: '26', name: 'Zoya Ahmed', class: '10A', overallAttendance: 87, isPresent: true },
    { rollNo: '27', name: 'Aarush Sethi', class: '10A', overallAttendance: 88, isPresent: true },
    { rollNo: '28', name: 'Bhumi Bose', class: '10A', overallAttendance: 90, isPresent: true },
    { rollNo: '29', name: 'Chahak Pillai', class: '10A', overallAttendance: 85, isPresent: true },
    { rollNo: '30', name: 'Dhruv Pandey', class: '10A', overallAttendance: 92, isPresent: true },
    { rollNo: '31', name: 'Ekta Thakur', class: '10A', overallAttendance: 86, isPresent: true },
    { rollNo: '32', name: 'Falak Dutta', class: '10A', overallAttendance: 89, isPresent: false },
    { rollNo: '33', name: 'Gaurav Ghosh', class: '10A', overallAttendance: 91, isPresent: true },
    { rollNo: '34', name: 'Heer Menon', class: '10A', overallAttendance: 87, isPresent: false },
    { rollNo: '35', name: 'Ira Nambiar', class: '10A', overallAttendance: 88, isPresent: false }
  ],
  'Class 9B - Science (32 students)': [
    { rollNo: '01', name: 'Aakash Roy', class: '9B', overallAttendance: 89, isPresent: true },
    { rollNo: '02', name: 'Bindu Iyer', class: '9B', overallAttendance: 86, isPresent: true },
    { rollNo: '03', name: 'Chetan Das', class: '9B', overallAttendance: 91, isPresent: true },
    { rollNo: '04', name: 'Deepa Rao', class: '9B', overallAttendance: 84, isPresent: true },
    { rollNo: '05', name: 'Eshaan Sharma', class: '9B', overallAttendance: 87, isPresent: true },
    { rollNo: '06', name: 'Falguni Patel', class: '9B', overallAttendance: 90, isPresent: true },
    { rollNo: '07', name: 'Gautam Singh', class: '9B', overallAttendance: 85, isPresent: true },
    { rollNo: '08', name: 'Harsha Reddy', class: '9B', overallAttendance: 88, isPresent: true },
    { rollNo: '09', name: 'Indra Verma', class: '9B', overallAttendance: 92, isPresent: true },
    { rollNo: '10', name: 'Jahnavi Gupta', class: '9B', overallAttendance: 86, isPresent: true },
    { rollNo: '11', name: 'Kartik Ali', class: '9B', overallAttendance: 89, isPresent: true },
    { rollNo: '12', name: 'Leena Joshi', class: '9B', overallAttendance: 91, isPresent: true },
    { rollNo: '13', name: 'Mohit Mehta', class: '9B', overallAttendance: 84, isPresent: true },
    { rollNo: '14', name: 'Neha Nair', class: '9B', overallAttendance: 87, isPresent: true },
    { rollNo: '15', name: 'Omkar Kapoor', class: '9B', overallAttendance: 90, isPresent: true },
    { rollNo: '16', name: 'Pooja Agarwal', class: '9B', overallAttendance: 85, isPresent: true },
    { rollNo: '17', name: 'Qasim Desai', class: '9B', overallAttendance: 88, isPresent: true },
    { rollNo: '18', name: 'Ritu Bansal', class: '9B', overallAttendance: 92, isPresent: true },
    { rollNo: '19', name: 'Sahil Malhotra', class: '9B', overallAttendance: 86, isPresent: true },
    { rollNo: '20', name: 'Tina Saxena', class: '9B', overallAttendance: 89, isPresent: true },
    { rollNo: '21', name: 'Uday Khan', class: '9B', overallAttendance: 91, isPresent: true },
    { rollNo: '22', name: 'Vidya Chopra', class: '9B', overallAttendance: 84, isPresent: true },
    { rollNo: '23', name: 'Wasim Bhatt', class: '9B', overallAttendance: 87, isPresent: true },
    { rollNo: '24', name: 'Xena Jain', class: '9B', overallAttendance: 90, isPresent: true },
    { rollNo: '25', name: 'Yashika Kulkarni', class: '9B', overallAttendance: 85, isPresent: true },
    { rollNo: '26', name: 'Zain Mishra', class: '9B', overallAttendance: 88, isPresent: true },
    { rollNo: '27', name: 'Arnav Deshmukh', class: '9B', overallAttendance: 92, isPresent: true },
    { rollNo: '28', name: 'Bella Sinha', class: '9B', overallAttendance: 86, isPresent: true },
    { rollNo: '29', name: 'Chirag Ahmed', class: '9B', overallAttendance: 89, isPresent: true },
    { rollNo: '30', name: 'Danish Sethi', class: '9B', overallAttendance: 91, isPresent: false },
    { rollNo: '31', name: 'Eva Bose', class: '9B', overallAttendance: 84, isPresent: false },
    { rollNo: '32', name: 'Farhan Pillai', class: '9B', overallAttendance: 87, isPresent: true }
  ],
  'Class 11A - Physics (28 students)': [
    { rollNo: '01', name: 'Aditya Pandey', class: '11A', overallAttendance: 93, isPresent: true },
    { rollNo: '02', name: 'Bhavya Thakur', class: '11A', overallAttendance: 90, isPresent: true },
    { rollNo: '03', name: 'Chaitanya Dutta', class: '11A', overallAttendance: 87, isPresent: true },
    { rollNo: '04', name: 'Darshana Ghosh', class: '11A', overallAttendance: 91, isPresent: true },
    { rollNo: '05', name: 'Ekansh Menon', class: '11A', overallAttendance: 88, isPresent: true },
    { rollNo: '06', name: 'Freya Nambiar', class: '11A', overallAttendance: 92, isPresent: true },
    { rollNo: '07', name: 'Gopal Roy', class: '11A', overallAttendance: 86, isPresent: true },
    { rollNo: '08', name: 'Hema Iyer', class: '11A', overallAttendance: 89, isPresent: true },
    { rollNo: '09', name: 'Ivan Das', class: '11A', overallAttendance: 94, isPresent: true },
    { rollNo: '10', name: 'Jhanvi Rao', class: '11A', overallAttendance: 87, isPresent: true },
    { rollNo: '11', name: 'Keshav Sharma', class: '11A', overallAttendance: 90, isPresent: true },
    { rollNo: '12', name: 'Laksh Patel', class: '11A', overallAttendance: 88, isPresent: true },
    { rollNo: '13', name: 'Manasi Singh', class: '11A', overallAttendance: 91, isPresent: true },
    { rollNo: '14', name: 'Nakul Reddy', class: '11A', overallAttendance: 85, isPresent: true },
    { rollNo: '15', name: 'Ojasvi Verma', class: '11A', overallAttendance: 89, isPresent: true },
    { rollNo: '16', name: 'Pranav Gupta', class: '11A', overallAttendance: 92, isPresent: true },
    { rollNo: '17', name: 'Rachna Ali', class: '11A', overallAttendance: 86, isPresent: true },
    { rollNo: '18', name: 'Sarthak Joshi', class: '11A', overallAttendance: 90, isPresent: true },
    { rollNo: '19', name: 'Tanvi Mehta', class: '11A', overallAttendance: 88, isPresent: true },
    { rollNo: '20', name: 'Urvashi Nair', class: '11A', overallAttendance: 91, isPresent: true },
    { rollNo: '21', name: 'Veer Kapoor', class: '11A', overallAttendance: 87, isPresent: true },
    { rollNo: '22', name: 'Wamika Agarwal', class: '11A', overallAttendance: 89, isPresent: true },
    { rollNo: '23', name: 'Yash Desai', class: '11A', overallAttendance: 93, isPresent: true },
    { rollNo: '24', name: 'Zara Bansal', class: '11A', overallAttendance: 85, isPresent: true },
    { rollNo: '25', name: 'Aarohi Malhotra', class: '11A', overallAttendance: 90, isPresent: false },
    { rollNo: '26', name: 'Biren Saxena', class: '11A', overallAttendance: 88, isPresent: false },
    { rollNo: '27', name: 'Charvi Khan', class: '11A', overallAttendance: 91, isPresent: true },
    { rollNo: '28', name: 'Dhairya Chopra', class: '11A', overallAttendance: 86, isPresent: true }
  ]
};

// Dummy attendance history
const attendanceHistory = [
  { date: 'Nov 14, 2025', class: 'Class 10A - Mathematics', present: 33, absent: 2, percentage: 94 },
  { date: 'Nov 13, 2025', class: 'Class 10A - Mathematics', present: 32, absent: 3, percentage: 91 },
  { date: 'Nov 12, 2025', class: 'Class 10A - Mathematics', present: 34, absent: 1, percentage: 97 },
  { date: 'Nov 11, 2025', class: 'Class 10A - Mathematics', present: 31, absent: 4, percentage: 89 },
  { date: 'Nov 10, 2025', class: 'Class 10A - Mathematics', present: 33, absent: 2, percentage: 94 }
];

// Teacher's attendance data (last 30 days)
// Generate last 30 working days of attendance data (excluding weekends)
const generateLast30WorkingDays = () => {
  const data = [];
  const classes = ['10A', '11A', '9A', '11B', '10B', '9B'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  let workingDaysCount = 0;
  let daysBack = 0;
  
  while (workingDaysCount < 30) {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    const dayOfWeekIndex = date.getDay();
    const dayOfWeek = days[dayOfWeekIndex];
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeekIndex !== 0 && dayOfWeekIndex !== 6) {
      const periods = [];
      for (let p = 1; p <= 8; p++) {
        const isPresent = Math.random() > 0.15; // 85% attendance rate
        const isFree = Math.random() > 0.85; // 15% free periods
        periods.push({
          period: `P${p}`,
          class: isPresent && !isFree ? classes[Math.floor(Math.random() * classes.length)] : null,
          status: isFree ? 'free' : (isPresent ? 'present' : 'absent')
        });
      }
      
      data.unshift({
        date: `Dec ${date.getDate()}, 2025`,
        day: dayOfWeek,
        periods
      });
      
      workingDaysCount++;
    }
    
    daysBack++;
  }
  
  return data;
};

const teacherAttendanceData = generateLast30WorkingDays();

// Calculate total working hours
const calculateTotalHours = () => {
  let totalClasses = 0;
  teacherAttendanceData.forEach(record => {
    record.periods.forEach(period => {
      if (period.status === 'present') totalClasses++;
    });
  });
  return totalClasses * 0.75; // 45 minutes per class = 0.75 hours
};

const Attendance = () => {
  // View toggle state
  const [viewMode, setViewMode] = useState('student'); // 'student' or 'teacher'
  
  // Tab state
  const [activeTab, setActiveTab] = useState('mark'); // 'mark', 'history', 'analytics'
  
  // Student attendance state
  const [selectedClass, setSelectedClass] = useState('Class 9A - Mathematics (38 students)');
  const [students, setStudents] = useState(allStudentsData['Class 9A - Mathematics (38 students)']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('present'); // 'all', 'present', 'absent'
  
  // Handle class change
  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setStudents(allStudentsData[newClass]);
  };
  
  // Modal state
  const [isRaiseRequestModalOpen, setIsRaiseRequestModalOpen] = useState(false);
  const [raiseRequestForm, setRaiseRequestForm] = useState({
    date: '',
    period: '',
    class: '',
    reason: ''
  });
  
  // Calculate metrics
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = totalStudents - presentCount;
  const attendancePercentage = Math.round((presentCount / totalStudents) * 100);
  
  // Students at risk (attendance < 80%)
  const studentsAtRisk = students.filter(s => s.overallAttendance < 80);
  
  // Handle toggle attendance
  const toggleAttendance = (rollNo) => {
    setStudents(prev => prev.map(student => 
      student.rollNo === rollNo 
        ? { ...student, isPresent: !student.isPresent }
        : student
    ));
  };
  
  // Handle save attendance
  const handleSaveAttendance = () => {
    alert('Attendance saved successfully!');
    console.log('Saved attendance:', students);
  };
  
  // Handle raise request
  const handleRaiseRequest = (e) => {
    e.preventDefault();
    console.log('Raise request submitted:', raiseRequestForm);
    alert('Request submitted successfully!');
    setIsRaiseRequestModalOpen(false);
    setRaiseRequestForm({ date: '', period: '', class: '', reason: '' });
  };
  
  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.rollNo.includes(searchQuery);
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'present' && student.isPresent) ||
                           (filterStatus === 'absent' && !student.isPresent);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo));
  
  return (
    <div className="att-attendance-container" data-testid="teacher-page-attendance">
      {/* Header - No Container */}
      <div className="att-attendance-header">
        <h1>{viewMode === 'student' ? 'Student Attendance' : 'My Attendance'}</h1>
        <button
          className="att-btn-toggle-view"
          onClick={() => setViewMode(viewMode === 'student' ? 'teacher' : 'student')}
          data-testid="school-button-toggle-view"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {viewMode === 'student' ? 'My Attendance' : 'Students Attendance'}
        </button>
      </div>
      <p className="att-header-subtitle">
        {viewMode === 'student' 
          ? 'Mark and track attendance for your classes'
          : 'View your attendance record for the last month'}
      </p>
      
      {/* STUDENT ATTENDANCE VIEW */}
      {viewMode === 'student' && (
        <>
          {/* Filter Row */}
          <div className="att-filter-row">
            <div className="att-filter-group">
              <div className="att-class-selector">
                <label>Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  data-testid="school-dropdown-select-class"
                >
                  <option value="Class 9A - Mathematics (38 students)">Class 9A - Mathematics (38 students)</option>
                  <option value="Class 10A - Mathematics (35 students)">Class 10A - Mathematics (35 students)</option>
                  <option value="Class 9B - Science (32 students)">Class 9B - Science (32 students)</option>
                  <option value="Class 11A - Physics (28 students)">Class 11A - Physics (28 students)</option>
                </select>
              </div>
              
              <div className="att-date-selector">
                <label>Date</label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  min={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                  data-testid="school-input-attendance-date"
                />
              </div>
            </div>
            
            <div className="att-today-summary">
              <div className="att-summary-content">
                <span className="att-summary-label">Today's Attendance</span>
                <span className="att-summary-value">{attendancePercentage}%</span>
                <div className="att-summary-detail">
                {presentCount} Present, {absentCount} Absent
              </div>
              </div>
              <div className="att-summary-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
            </div>
          </div>
          
          {/* Metrics Row */}
          <div className="att-metrics-row">
            <div className="att-metric-card">
              <div className="att-metric-label">Total Students</div>
              <div className="att-metric-value">{totalStudents}</div>
              <div className="att-metric-info">In {selectedClass.split(' - ')[0]}</div>
              <div className="att-metric-icon att-blue">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="att-metric-card">
              <div className="att-metric-label">Present Today</div>
              <div className="att-metric-value">{presentCount}</div>
              <div className="att-metric-info">{attendancePercentage}% attendance</div>
              <div className="att-metric-icon att-green">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="att-metric-card">
              <div className="att-metric-label">Absent Today</div>
              <div className="att-metric-value">{absentCount}</div>
              <div className="att-metric-info">{Math.round((absentCount / totalStudents) * 100)}% absent</div>
              <div className="att-metric-icon att-red">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Toggle Tabs */}
          <div className="att-attendance-tabs">
            <button
              className={`att-tab-button ${activeTab === 'mark' ? 'att-active' : ''}`}
              onClick={() => setActiveTab('mark')}
              data-testid="school-button-tab-mark"
            >
              Mark Attendance
            </button>
            <button
              className={`att-tab-button ${activeTab === 'history' ? 'att-active' : ''}`}
              onClick={() => setActiveTab('history')}
              data-testid="school-button-tab-history"
            >
              Attendance History
            </button>
            <button
              className={`att-tab-button ${activeTab === 'analytics' ? 'att-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
              data-testid="school-button-tab-analytics"
            >
              Analytics
            </button>
          </div>
          
          {/* Mark Attendance Tab */}
          {activeTab === 'mark' && (
            <div className="att-mark-attendance-section">
              <div className="att-section-header">
                <h2>{selectedClass.replace(/\s*\(\d+\s+students\)/, '')}</h2>
                <div className="att-header-actions">
                  <div className="att-filter-dropdown">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      data-testid="school-dropdown-filter"
                    >
                      <option value="all">All Students</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                  <div className="att-search-box">
                    <input
                      type="text"
                      placeholder="🔍 Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="school-field-search"
                    />
                  </div>
                  <button
                    className="att-btn-save-attendance"
                    onClick={handleSaveAttendance}
                    data-testid="school-button-save-attendance"
                  >
                    Save Attendance
                  </button>
                </div>
              </div>
              
              <div className="att-students-table-container">
                {filteredStudents.length === 0 ? (
                  <div className="att-no-results">
                    <p>No match found</p>
                  </div>
                ) : (
                  <table className="att-students-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Overall Attendance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.rollNo}>
                          <td>
                            <div className="att-roll-no-badge">{student.rollNo}</div>
                          </td>
                          <td>{student.name}</td>
                          <td>
                            <div className="att-attendance-bar-container">
                              <div className="att-attendance-percentage">{student.overallAttendance}%</div>
                              <div className="att-attendance-bar">
                                <div
                                  className="att-attendance-fill"
                                  style={{ width: `${student.overallAttendance}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <label className="att-toggle-switch">
                              <input
                                type="checkbox"
                                checked={student.isPresent}
                                onChange={() => toggleAttendance(student.rollNo)}
                              />
                              <span className="att-toggle-slider"></span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          
          {/* Attendance History Tab */}
          {activeTab === 'history' && (
            <div className="att-attendance-history-section">
              <h2>Attendance History</h2>
              
              <div className="att-history-list">
                {attendanceHistory.map((record, index) => (
                  <div key={index} className="att-history-card">
                    <div className="att-history-left">
                      <div className="att-history-date">{record.date}</div>
                      <div className="att-history-class">{record.class}</div>
                    </div>
                    <div className="att-history-right">
                      <div className="att-stat-item">
                        <span className="att-stat-number att-green">{record.present}</span>
                        <span className="att-stat-label">Present</span>
                      </div>
                      <div className="att-stat-item">
                        <span className="att-stat-number att-red">{record.absent}</span>
                        <span className="att-stat-label">Absent</span>
                      </div>
                      <div className="att-stat-item">
                        <span className="att-percentage-badge">{record.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="att-analytics-section">
              <h2>Class Attendance Analytics</h2>
              
              <div className="att-analytics-stats">
                <div className="att-overall-stats">
                  <h3>Overall Statistics</h3>
                  <div className="att-stats-row">
                    <div className="att-stat-item">
                      <div className="att-stat-label">Average Attendance</div>
                      <div className="att-stat-value">92%</div>
                    </div>
                    <div className="att-stat-item">
                      <div className="att-stat-label">Best Day</div>
                      <div className="att-stat-value">97% (Nov 12)</div>
                    </div>
                    <div className="att-stat-item">
                      <div className="att-stat-label">Students at Risk</div>
                      <div className="att-stat-value att-risk">{studentsAtRisk.length} students</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="att-students-at-risk">
                <h3>Students with Low Attendance</h3>
                {studentsAtRisk.map(student => (
                  <div key={student.rollNo} className="att-risk-card">
                    <div className="att-risk-student">
                      <strong>{student.name}</strong>
                      <span className="att-risk-roll">Roll No: {student.rollNo}</span>
                    </div>
                    <div className="att-risk-attendance">
                      <span className="att-risk-percentage">{student.overallAttendance}%</span>
                      <span className="att-risk-label">Needs attention</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* MY ATTENDANCE VIEW */}
      {viewMode === 'teacher' && (
        <div className="att-my-attendance-section">
          <div className="att-my-attendance-header">
            <h2>👤 Attendance Matrix - Last 30 Days</h2>
            <button
              className="att-btn-raise-request"
              onClick={() => setIsRaiseRequestModalOpen(true)}
              data-testid="school-button-raise-request"
            >
              ⓘ Raise Request
            </button>
          </div>
          
          <div className="att-attendance-matrix">
            <table className="att-matrix-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>P4</th>
                  <th>P5</th>
                  <th>P6</th>
                  <th>P7</th>
                  <th>P8</th>
                </tr>
              </thead>
              <tbody>
                {teacherAttendanceData.map((record, index) => (
                  <tr key={index}>
                    <td className="att-date-cell">
                      <strong>{record.date}</strong>
                      <span className="att-day-label">{record.day}</span>
                    </td>
                    {record.periods.map((period, pIndex) => (
                      <td key={pIndex} className="att-period-cell">
                        {period.status === 'present' ? (
                          <div className="att-status-present">
                            <span className="att-status-icon">✓</span>
                            <span className="att-class-label">{period.class}</span>
                          </div>
                        ) : period.status === 'free' ? (
                          <div className="att-status-free">—</div>
                        ) : (
                          <div className="att-status-absent">✕</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="att-attendance-footer">
            <div className="att-legend">
              <span className="att-legend-item">
                <span className="att-legend-icon att-present">✓</span> Present
              </span>
              <span className="att-legend-item">
                <span className="att-legend-icon att-absent">✕</span> Absent
              </span>
              <span className="att-legend-item">
                <span className="att-legend-icon att-free">—</span> Free Period
              </span>
            </div>
            <div className="att-total-hours">
              <strong>Total Hours Taken:</strong>
              <span className="att-hours-value">{calculateTotalHours()} hrs</span>
              <span className="att-hours-note">(1 class = 45 min)</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Raise Request Modal */}
      {isRaiseRequestModalOpen && (
        <div className="att-modal-overlay" onClick={() => setIsRaiseRequestModalOpen(false)}>
          <div className="att-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="att-modal-header">
              <h2>ⓘ Raise Attendance Request</h2>
              <button
                className="att-btn-close"
                onClick={() => setIsRaiseRequestModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <p className="att-modal-subtitle">
              Report if you attended a class but were not marked present
            </p>
            
            <div className="att-modal-info">
              ⓘ Use this form to report if you took a class but were not marked as present.
            </div>
            
            <form onSubmit={handleRaiseRequest} className="att-modal-body">
              <div className="att-form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={raiseRequestForm.date}
                  onChange={(e) => setRaiseRequestForm(prev => ({ ...prev, date: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  data-testid="school-field-date"
                />
              </div>
              
              <div className="att-form-group">
                <label>Period *</label>
                <select
                  value={raiseRequestForm.period}
                  onChange={(e) => setRaiseRequestForm(prev => ({ ...prev, period: e.target.value }))}
                  required
                  data-testid="school-dropdown-period"
                >
                  <option value="">Select period</option>
                  <option value="P1">Period 1</option>
                  <option value="P2">Period 2</option>
                  <option value="P3">Period 3</option>
                  <option value="P4">Period 4</option>
                  <option value="P5">Period 5</option>
                  <option value="P6">Period 6</option>
                  <option value="P7">Period 7</option>
                  <option value="P8">Period 8</option>
                </select>
              </div>
              
              <div className="att-form-group">
                <label>Class *</label>
                <select
                  value={raiseRequestForm.class}
                  onChange={(e) => setRaiseRequestForm(prev => ({ ...prev, class: e.target.value }))}
                  required
                  data-testid="school-dropdown-class"
                >
                  <option value="">Select class</option>
                  <option value="9A">Class 9A</option>
                  <option value="9B">Class 9B</option>
                  <option value="10A">Class 10A</option>
                  <option value="10B">Class 10B</option>
                  <option value="11A">Class 11A</option>
                  <option value="11B">Class 11B</option>
                </select>
              </div>
              
              <div className="att-form-group">
                <label>Reason *</label>
                <textarea
                  value={raiseRequestForm.reason}
                  onChange={(e) => setRaiseRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Explain the discrepancy..."
                  rows={4}
                  required
                  data-testid="school-field-reason"
                />
              </div>
              
              <div className="att-modal-footer">
                <button
                  type="button"
                  className="att-btn-cancel"
                  onClick={() => setIsRaiseRequestModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="att-btn-submit"
                  data-testid="school-button-submit-request"
                >
                  ✈️ Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
};

export default Attendance;
