import { useReducer, useMemo } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useDashboardDataQuery,
  useKpiQuery,
  usePendingTasksQuery,
  useAttendanceTodayQuery,
  useUpcomingEventsQuery,
  useRecentActivitiesQuery,
} from "../../../services/dashboard.queries";
import { getSessionParams } from "../../../config/sessionParams";
import { dashboardReducer } from "../reducer";
import { initialState } from "../context";

export const useDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const params = getSessionParams();

  const dashboardDataQuery = useDashboardDataQuery(params);
  const kpiQuery = useKpiQuery(params);
  const pendingTasksQuery = usePendingTasksQuery(params);
  const attendanceTodayQuery = useAttendanceTodayQuery(params);
  const upcomingEventsQuery = useUpcomingEventsQuery(params, 10);
  const recentActivitiesQuery = useRecentActivitiesQuery(params, 72);

  // Memoize queries object to prevent new reference on every render
  const queries = useMemo(() => ({
    dashboardDataQuery,
    kpiQuery,
    pendingTasksQuery,
    attendanceTodayQuery,
    upcomingEventsQuery,
    recentActivitiesQuery,
  }), [
    dashboardDataQuery,
    kpiQuery,
    pendingTasksQuery,
    attendanceTodayQuery,
    upcomingEventsQuery,
    recentActivitiesQuery,
  ]);

  useFeatureState(state, dispatch, queries);

  return { state, dispatch };
};
