import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock all page components
jest.mock('./pages/overview', () => {
  return function MockOverview() {
    return <div data-testid="overview-page">Overview Page</div>;
  };
});

jest.mock('./pages/meeting-schedules', () => {
  return function MockMeetingSchedules() {
    return <div data-testid="meeting-schedules-page">Meeting Schedules</div>;
  };
});

jest.mock('./pages/resources-uploading', () => {
  return function MockResourcesUploading() {
    return <div data-testid="resources-uploading-page">Resources</div>;
  };
});

jest.mock('./pages/assignments-exams', () => {
  return function MockAssignmentsExams() {
    return <div data-testid="assignments-exams-page">Assignments</div>;
  };
});

jest.mock('./pages/student-evaluations', () => {
  return function MockStudentEvaluations() {
    return <div data-testid="student-evaluations-page">Evaluations</div>;
  };
});

jest.mock('./pages/my-classes', () => {
  return function MockMyClasses() {
    return <div data-testid="my-classes-page">My Classes</div>;
  };
});

jest.mock('./pages/ai-assistant', () => {
  return function MockAIAssistant() {
    return <div data-testid="ai-assistant-page">AI Assistant</div>;
  };
});

jest.mock('./pages/sports', () => {
  return function MockSports() {
    return <div data-testid="sports-page">Sports</div>;
  };
});

jest.mock('./pages/staff-requests', () => {
  return function MockStaffRequests() {
    return <div data-testid="staff-requests-page">Staff Requests</div>;
  };
});

jest.mock('./pages/community', () => {
  return function MockCommunity() {
    return <div data-testid="community-page">Community</div>;
  };
});

jest.mock('./pages/grievances', () => {
  return function MockGrievances() {
    return <div data-testid="grievances-page">Grievances</div>;
  };
});

jest.mock('./pages/staff-connect', () => {
  return function MockStaffConnect() {
    return <div data-testid="staff-connect-page">Staff Connect</div>;
  };
});

jest.mock('./pages/announcements', () => {
  return function MockAnnouncements() {
    return <div data-testid="announcements-page">Announcements</div>;
  };
});

jest.mock('./pages/leave-management', () => {
  return function MockLeaveManagement() {
    return <div data-testid="leave-management-page">Leave Management</div>;
  };
});

jest.mock('./pages/communication', () => {
  return function MockCommunication() {
    return <div data-testid="communication-page">Communication</div>;
  };
});

jest.mock('./pages/day-schedules', () => {
  return function MockDaySchedules() {
    return <div data-testid="day-schedules-page">Day Schedules</div>;
  };
});

jest.mock('./pages/attendance', () => {
  return function MockAttendance() {
    return <div data-testid="attendance-page">Attendance</div>;
  };
});

jest.mock('./layout/TeacherLayout', () => {
  return function MockTeacherLayout() {
    return <div data-testid="teacher-layout">Teacher Layout</div>;
  };
});

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('teacher-layout')).toBeInTheDocument();
  });

  it('should render router with teacher routes', () => {
    render(<App />);
    expect(screen.getByTestId('teacher-layout')).toBeInTheDocument();
  });
});
