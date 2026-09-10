import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layout/TeacherLayout';

// Pages
import Overview from './pages/overview';
import LiveClasses from './pages/live-classes';
import MeetingSchedules from './pages/meeting-schedules';
import ResourcesUploading from './pages/resources-uploading';
import AssignmentsExams from './pages/assignments-exams';
import StudentEvaluations from './pages/student-evaluations';
import MyClasses from './pages/my-classes';
import AIAssistant from './pages/ai-assistant';
import Sports from './pages/sports';
import StaffRequests from './pages/staff-requests';
import Community from './pages/community';
import Grievances from './pages/grievances';
import StaffConnect from './pages/staff-connect';
import Announcements from './pages/announcements';
import LeaveManagement from './pages/leave-management';
import Communication from './pages/communication';
import DaySchedules from './pages/day-schedules';
import Attendance from './pages/attendance';
import MySchedule from './pages/my-schedule';
// Import theme
import './assets/scss/theme.scss';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="meeting-schedules" element={<MeetingSchedules />} />
          <Route path="resources-uploading" element={<ResourcesUploading />} />
          <Route path="assignments-exams" element={<AssignmentsExams />} />
          <Route path="student-evaluations" element={<StudentEvaluations />} />
          <Route path="my-classes" element={<MyClasses />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="sports" element={<Sports />} />
          <Route path="staff-requests" element={<StaffRequests />} />
          <Route path="community" element={<Community />} />
          <Route path="grievances" element={<Grievances />} />
          <Route path="staff-connect" element={<StaffConnect />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="communication" element={<Communication />} />
          <Route path="day-schedules" element={<DaySchedules />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="my-schedule" element={<MySchedule />} />
        </Route>
        <Route path="*" element={<Navigate to="/teacher/overview" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
