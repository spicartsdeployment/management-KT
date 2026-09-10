// dashboardConfig.js
// Holds ALL UI configuration (icons, colors) for the Dashboard.
// Maps "type" keys from dashboardService data → icon components + color values.

import {
    Users,
    GraduationCap,
    FileCheck,
    DollarSign,
    Award,
    Calendar,
    UserPlus,
    Megaphone,
    CalendarPlus,
} from "lucide-react";

// Maps kpiCards[].type → { icon, color }
export const KPI_CONFIG = {
    students: { icon: Users, color: "#C9A962" },
    teachers: { icon: GraduationCap, color: "#2C2C2C" },
    leave: { icon: FileCheck, color: "#F59E0B" },
    scholarships: { icon: DollarSign, color: "#C9A962" },
    mentors: { icon: Award, color: "#6B7280" },
    meetings: { icon: Calendar, color: "#2C2C2C" },
};

// Maps quickActions[].type → { icon, color }
export const ACTION_CONFIG = {
    student: { icon: UserPlus, color: "#C9A962" },
    teacher: { icon: GraduationCap, color: "#2C2C2C" },
    announcement: { icon: Megaphone, color: "#F59E0B" },
    meeting: { icon: CalendarPlus, color: "#6B7280" },
    leave: { icon: FileCheck, color: "#EF4444" },
    scholarship: { icon: DollarSign, color: "#22C55E" },
};

// Maps recentActivities[].type → Tailwind class strings for icon wrapper
export const ACTIVITY_CONFIG = {
    success: "bg-[#22C55E]/20 text-[#22C55E]",
    warning: "bg-[#F59E0B]/20 text-[#F59E0B]",
    error: "bg-[#EF4444]/20 text-[#EF4444]",
    info: "bg-[#4F46E5]/20 text-[#4F46E5]",
};