import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoadingSpinner } from '@school-hrms/common-components'

// Lazy load components for code splitting
const SchoolLayout = React.lazy(() => import('../../packages/hrms-school-ui/src/layout/SchoolLayout'))
const TeacherLayout = React.lazy(() => import('../../packages/hrms-teacher-ui/src/layout/TeacherLayout'))
const ManagementLayout = React.lazy(() => import('../layout/ManagementLayout'))

// Teacher pages
const TeacherOverview = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/overview'))
const LiveClasses = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/live-classes'))
const MeetingSchedules = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/meeting-schedules'))
const ResourcesUploading = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/resources-uploading'))
const AssignmentsExams = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/assignments-exams'))
const StudentEvaluations = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/student-evaluations'))
const MyClasses = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/my-classes'))
const AIAssistant = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/ai-assistant'))
const Sports = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/sports'))
const StaffRequests = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/staff-requests'))
const Community = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/community'))
const Grievances = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/grievances'))
const StaffConnect = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/staff-connect'))
const TeacherAnnouncements = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/announcements'))
const TeacherLeaveManagement = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/leave-management'))
const DaySchedules = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/day-schedules'))
const TeacherAttendance = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/attendance'))
const TeacherCommunication = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/communication'))
const MySchedule = React.lazy(() => import('../../packages/hrms-teacher-ui/src/pages/my-schedule'))

// Management pages - Import from actual hrms-management-ui package
const ManagementDashboard = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/dashboard'))
const StudentEnrollment = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/student-enrollment'))
const TeacherEnrollment = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/teacher-enrollment'))
const LeaveApprovals = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/leave-approvals'))
const AlumniMentors = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/alumni-mentors'))
const ScholarshipManagement = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/scholarship-management'))
const CommunityAnnouncements = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/community-announcements'))
const RoleManagement = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/role-management'))
const ManagementMeetingScheduler = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/meeting-scheduler'))
const ManagementSettings = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/settings'))
// Fee Management - named exports, import per component
const ManagementFeeOverview = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/fee-management/FeeOverview'))
const ManagementPaymentTracking = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/fee-management/PaymentTracking'))
const ManagementDueManagement = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/fee-management/DueManagement'))
// Transport - named exports, import per component
const ManagementAssignBus = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/transport/AssignBus'))
const ManagementRoutesDrivers = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/transport/RoutesDrivers'))
const ManagementTracking = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/transport/Tracking'))
// Announcements - named exports, import per component
const ManagementAnnouncements = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/announcements/Announcements'))
const CreateAnnouncement = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/announcements/CreateAnnouncement'))
const ManageNotifications = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/announcements/ManageNotifications'))
// Grievances - unified management system
const ManagementGrievances = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/grievances'))
// Academic - named exports, import per component
const ManagementClasses = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/Classes'))
const ManagementSubjects = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/Subjects'))
const ManagementBranches = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/Branches'))
const ManagementAcademicCalendar = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/AcademicCalendar'))
const ManagementAttendanceRules = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/AttendanceRules'))
const ManagementExamGrading = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/academic/ExamGrading'))
// Events - named exports, import per component
const CreateEvents = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/events/CreateEvents'))
const ManageParticipation = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/events/ManageParticipation'))
const ManageEvents = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/events/ManageEvents'))
// Policies
const LeavePolicy = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/policies/LeavePolicy'))
const PoliciesPage = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/policies'))
// Staff
const StaffDirectory = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/staff-management/StaffDirectory'))
const StaffContacts = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/staff-management/Contacts'))
const StaffManagement = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/staff/StaffManagement'))
// Alumni
const AlumniPage = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/alumni-mentors'))
// Leave Management
const LeaveManagementPage = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/leave-management'))
// Analytics — unified
const ReportsAnalytics = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/analytics/ReportsAnalytics'))
// Campus Management
const CampusInfrastructure = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/campus/Infrastructure'))
const CampusFacilities = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/campus/Facilities'))
const CampusGallery = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/campus/Gallery'))
const CampusContact = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/campus/Contact'))
// User Management
const UsersPage = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/users/Users'))
const UsersRoles = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/users/Roles'))
const UsersAdminAccess = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/users/AdminAccess'))
// Settings sub-pages
const GeneralSettings = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/settings/GeneralSettings'))
const NotificationSettings = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/settings/NotificationSettings'))
const SystemPreferences = React.lazy(() => import('../../packages/hrms-management-ui/src/pages/settings/SystemPreferences'))

// School pages - all from packages/hrms-school-ui
const Dashboard = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/dashboard'))
const BusTracking = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/bus-tracking'))
const DailySchedule = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/daily-schedule'))
const FeeManagement = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/fee-management'))
const AlumniNetwork = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/alumni'))
const LeaveManagement = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/leave-management'))
const PerformanceAnalytics = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/performance-analytics'))
const HealthUpdates = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/health-updates'))
const CommunicationHub = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/communication-hub'))
const MeetingScheduler = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/meeting-scheduler'))
const GrievanceSystem = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/grievance-system'))
const CommunityForum = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/community-forum'))
const GlobalAnnouncements = React.lazy(() => import('../../packages/hrms-school-ui/src/pages/global-announcements'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Open the app directly on the management dashboard */}
        <Route path="/" element={<Navigate to="/management/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/management/dashboard" replace />} />
        <Route path="/unauthorized" element={<Navigate to="/management/dashboard" replace />} />

        {/* School Routes - no auth gate */}
        <Route
          path="/school/*"
          element={<SchoolLayout />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bus-tracking" element={<BusTracking />} />
          <Route path="daily-schedule" element={<DailySchedule />} />
          <Route path="fee-management" element={<FeeManagement />} />
          <Route path="alumni-network" element={<AlumniNetwork />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="performance-analytics" element={<PerformanceAnalytics />} />
          <Route path="health-updates" element={<HealthUpdates />} />
          <Route path="communication-hub" element={<CommunicationHub />} />
          <Route path="meeting-scheduler" element={<MeetingScheduler />} />
          <Route path="grievance-system" element={<GrievanceSystem />} />
          <Route path="community-forum" element={<CommunityForum />} />
          <Route path="global-announcements" element={<GlobalAnnouncements />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Teacher Routes - no auth gate */}
        <Route
          path="/teacher"
          element={<TeacherLayout />}
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<TeacherOverview />} />
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
          <Route path="announcements" element={<TeacherAnnouncements />} />
          <Route path="leave-management" element={<TeacherLeaveManagement />} />
          <Route path="communication" element={<TeacherCommunication />} />
          <Route path="day-schedules" element={<DaySchedules />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="my-schedule" element={<MySchedule />} />
        </Route>

        {/* Management Routes - no auth gate */}
        <Route
          path="/management/*"
          element={<ManagementLayout />}
        >
          <Route path="dashboard" element={<ManagementDashboard />} />
          <Route path="students" element={<StudentEnrollment />} />
          <Route path="teachers" element={<TeacherEnrollment />} />
          <Route path="announcements" element={<ManagementAnnouncements />} />
          <Route path="leave-approvals" element={<LeaveApprovals />} />
          <Route path="alumni-mentors" element={<AlumniMentors />} />
          <Route path="scholarships" element={<ScholarshipManagement />} />
          <Route path="community" element={<CommunityAnnouncements />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="meetings" element={<ManagementMeetingScheduler />} />
          <Route path="settings" element={<ManagementSettings />} />
          <Route path="fees/overview" element={<ManagementFeeOverview />} />
          <Route path="fees/payment-tracking" element={<ManagementPaymentTracking />} />
          <Route path="fees/due-management" element={<ManagementDueManagement />} />
          <Route path="transport/assign-bus" element={<ManagementAssignBus />} />
          <Route path="transport/routes-drivers" element={<ManagementRoutesDrivers />} />
          <Route path="transport/tracking" element={<ManagementTracking />} />
          <Route path="announcements/create" element={<CreateAnnouncement />} />
          <Route path="announcements/manage" element={<ManageNotifications />} />
          <Route path="grievances" element={<ManagementGrievances />} />
          <Route path="academic/classes" element={<ManagementClasses />} />
          <Route path="academic/subjects" element={<ManagementSubjects />} />
          <Route path="academic/branches" element={<ManagementBranches />} />
          <Route path="academic/academic-calendar" element={<ManagementAcademicCalendar />} />
          <Route path="academic/attendance-rules" element={<ManagementAttendanceRules />} />
          <Route path="academic/exam-grading" element={<ManagementExamGrading />} />
          <Route path="events/create" element={<CreateEvents />} />
          <Route path="events/manage" element={<ManageEvents />} />
          <Route path="events/all" element={<ManageEvents />} />
          <Route path="events/participation" element={<ManageParticipation />} />
          <Route path="policies/leave-policy" element={<LeavePolicy />} />
          <Route path="policies" element={<PoliciesPage />} />
          <Route path="staff/directory" element={<StaffDirectory />} />
          <Route path="staff/contacts" element={<StaffContacts />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="reports-analytics" element={<ReportsAnalytics />} />
          <Route path="campus/infrastructure" element={<CampusInfrastructure />} />
          <Route path="campus/facilities" element={<CampusFacilities />} />
          <Route path="campus/gallery" element={<CampusGallery />} />
          <Route path="campus/contact" element={<CampusContact />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/roles" element={<UsersRoles />} />
          <Route path="users/admin-access" element={<UsersAdminAccess />} />
          <Route path="settings/general" element={<GeneralSettings />} />
          <Route path="settings/notifications" element={<NotificationSettings />} />
          <Route path="settings/preferences" element={<SystemPreferences />} />
          <Route path="alumni" element={<AlumniPage />} />
          <Route path="leave-management" element={<LeaveManagementPage />} />
          <Route path="fees/payments" element={<ManagementFeeOverview />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Fallback for undefined routes - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes