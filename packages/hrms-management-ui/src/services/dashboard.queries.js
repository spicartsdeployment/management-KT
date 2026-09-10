import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getKpi, getPendingTasks, getAttendanceToday, getUpcomingEvents, getRecentActivities, getDashboardData } from "./dashboard.api";

export const useDashboardDataQuery = createQueryHook(
  ["dashboard", "data"],
  getDashboardData
);

export const useKpiQuery = createQueryHook(
  ["dashboard", "kpi"],
  getKpi
);

export const usePendingTasksQuery = createQueryHook(
  ["dashboard", "pending_tasks"],
  getPendingTasks
);

export const useAttendanceTodayQuery = createQueryHook(
  ["dashboard", "attendance_today"],
  getAttendanceToday
);

export const useUpcomingEventsQuery = createQueryHook(
  ["dashboard", "upcoming_events"],
  getUpcomingEvents
);

export const useRecentActivitiesQuery = createQueryHook(
  ["dashboard", "recent_activities"],
  getRecentActivities
);

export function prefetchDashboard(queryClient, params = getSessionParams()) {
  return queryClient.prefetchQuery({
    queryKey: ["dashboard", "data", params],
    queryFn: () => getDashboardData(params),
    staleTime: 5 * 60 * 1000,
  });
}
