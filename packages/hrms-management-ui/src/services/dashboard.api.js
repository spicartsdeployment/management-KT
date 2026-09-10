import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("dashboard");

export const getKpi = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/dashboard/kpi/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId, academicYear: t.academicYear }),
    });
};

export const getPendingTasks = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/dashboard/pending-tasks/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getAttendanceToday = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/dashboard/attendance-today/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getUpcomingEvents = (ctx = {}, limit = 10) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/dashboard/upcoming-events/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId, limit }),
    });
};

export const getRecentActivities = (ctx = {}, hours = 72) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/dashboard/recent-activities/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId, hours }),
    });
};

export const getDashboardData = async (ctx = {}) => {
    const [kpi, tasks, attendance, events, activities] = await Promise.all([
        getKpi(ctx).catch(() => ({})),
        getPendingTasks(ctx).catch(() => []),
        getAttendanceToday(ctx).catch(() => []),
        getUpcomingEvents(ctx).catch(() => []),
        getRecentActivities(ctx).catch(() => []),
    ]);
    return {
        kpiCards: kpiToCards(kpi),
        pendingTasks: (tasks || []).map((t) => ({
            id: t.task_key,
            title: `${t.task_count ?? 0} ${t.task_title}`,
            priority: t.priority,
            color: t.color,
        })),
        attendanceData: (attendance || []).map((a) => ({
            department: a.department || `Class ${a.class_id ?? "—"}`,
            class_id: a.class_id,
            present: Number(a.present || 0),
            total: Number(a.total || 0),
            percentage: Number(a.percentage || 0),
        })),
        upcomingEvents: (events || []).map((e) => ({
            id: e.event_id,
            title: e.title,
            date: e.date || "—",
            time: e.time || "",
            type: e.type || "event",
            venue: e.venue,
            registered: e.registered ?? 0,
            capacity: e.capacity ?? 0,
        })),
        recentActivities: (activities || []).map((a) => ({
            id: `${a.event_at || ""}|${a.title || ""}`,
            type: a.type,
            title: a.title,
            description: a.description,
            time: relativeTime(a.event_at),
        })),
        quickActions: QUICK_ACTIONS,
    };
};

const QUICK_ACTIONS = [
    { type: "student", label: "Add New Student", href: "/students", description: "Enroll a new student" },
    { type: "teacher", label: "Add New Teacher", href: "/teachers", description: "Register staff member" },
    { type: "announcement", label: "Create Announcement", href: "/announcements", description: "Broadcast to all users" },
    { type: "meeting", label: "Schedule Meeting", href: "/meetings", description: "Plan a new meeting" },
    { type: "leave", label: "Approve Leaves", href: "/leave-approvals", description: "Review pending requests" },
    { type: "scholarship", label: "Manage Scholarships", href: "/scholarships", description: "Financial aid programs" },
];

function kpiToCards(k) {
    if (!k || typeof k !== "object") k = {};
    return [
        { type: "students", title: "Total Students", value: format(k.total_students), trend: "+0%", trendUp: true },
        { type: "teachers", title: "Total Teachers", value: format(k.total_teachers), trend: "+0%", trendUp: true },
        { type: "leave", title: "Pending Leave Approvals", value: format(k.pending_leave_approvals), trend: "0%", trendUp: false },
        { type: "scholarships", title: "Active Scholarships", value: format(k.active_scholarships), trend: "+0%", trendUp: true },
        { type: "mentors", title: "Alumni Mentors Pending", value: format(k.alumni_mentors_pending), trend: "+0%", trendUp: true },
        { type: "meetings", title: "Upcoming Meetings", value: format(k.upcoming_meetings), trend: "0%", trendUp: true },
    ];
}

const format = (n) => new Intl.NumberFormat().format(Number.isFinite(Number(n)) ? Number(n) : 0);

function relativeTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const diffSec = (Date.now() - d.getTime()) / 1000;
    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    return `${Math.floor(diffSec / 86400)} days ago`;
}
