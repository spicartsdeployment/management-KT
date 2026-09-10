import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";

// Main Pages
import Dashboard from "../pages/dashboard";
import StudentEnrollment from "../pages/student-enrollment";
import TeacherEnrollment from "../pages/teacher-enrollment";
import Announcements from "../pages/announcements";
import LeaveApprovals from "../pages/leave-approvals";
import AlumniMentors from "../pages/alumni-mentors";
import ScholarshipManagement from "../pages/scholarship-management";
import CommunityAnnouncements from "../pages/community-announcements";
import RoleManagement from "../pages/role-management";
import MeetingScheduler from "../pages/meeting-scheduler";
import Settings from "../pages/settings";

// Fee Management
import FeeOverview from "../pages/fee-management";
import PaymentTracking from "../pages/fee-management";
import DueManagement from "../pages/fee-management";

// Transport Management
import AssignBus from "../pages/transport";
import RoutesDrivers from "../pages/transport";
import Tracking from "../pages/transport";

// Announcements
import CreateAnnouncement from "../pages/announcements";
import ManageNotifications from "../pages/announcements";

// Grievances
import ViewComplaints from "../pages/grievances";
import AssignResolve from "../pages/grievances";

// Academic Setup
import Classes from "../pages/academic";
import Subjects from "../pages/academic";
import Branches from "../pages/academic";
import { AcademicCalendar, AttendanceRules, ExamGrading } from "../pages/academic";

// Events
import CreateEvents from "../pages/events";
import ManageParticipation from "../pages/events";

// Policies
import LeavePolicy from "../pages/policies";

// Staff Management
import StaffDirectory from "../pages/staff-management";
import Contacts from "../pages/staff-management";

// Analytics
import OperationalInsights from "../pages/analytics";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: Dashboard },

            // Fee Management
            { path: "fees/overview", Component: FeeOverview },
            { path: "fees/payment-tracking", Component: PaymentTracking },
            { path: "fees/due-management", Component: DueManagement },

            // Transport Management
            { path: "transport/assign-bus", Component: AssignBus },
            { path: "transport/routes-drivers", Component: RoutesDrivers },
            { path: "transport/tracking", Component: Tracking },

            // Announcements
            { path: "announcements/create", Component: CreateAnnouncement },
            { path: "announcements/manage", Component: ManageNotifications },

            // Grievances
            { path: "grievances/view", Component: ViewComplaints },
            { path: "grievances/assign", Component: AssignResolve },

            // Academic Setup
            { path: "academic/classes", Component: Classes },
            { path: "academic/subjects", Component: Subjects },
            { path: "academic/branches", Component: Branches },
            { path: "academic/academic-calendar", Component: AcademicCalendar },
            { path: "academic/attendance-rules", Component: AttendanceRules },
            { path: "academic/exam-grading", Component: ExamGrading },

            // Events
            { path: "events/create", Component: CreateEvents },
            { path: "events/manage", Component: ManageParticipation },

            // Policies
            { path: "policies/leave-policy", Component: LeavePolicy },

            // Staff Management
            { path: "staff/directory", Component: StaffDirectory },
            { path: "staff/contacts", Component: Contacts },

            // Analytics
            { path: "analytics/bus", Component: Tracking },
            { path: "analytics/operational", Component: OperationalInsights },

            // Legacy routes (kept for backward compatibility)
            { path: "students", Component: StudentEnrollment },
            { path: "teachers", Component: TeacherEnrollment },
            { path: "announcements", Component: Announcements },
            { path: "leave-approvals", Component: LeaveApprovals },
            { path: "alumni-mentors", Component: AlumniMentors },
            { path: "scholarships", Component: ScholarshipManagement },
            { path: "community", Component: CommunityAnnouncements },
            { path: "roles", Component: RoleManagement },
            { path: "meetings", Component: MeetingScheduler },
            { path: "settings", Component: Settings },
        ],
    },
]);
