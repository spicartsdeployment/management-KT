import { createReducer } from "../../utils/createReducer";

const dashboardSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_DASHBOARD_DATA":
      return {
        ...state,
        kpiCards: action.payload.kpiCards || [],
        pendingTasks: action.payload.pendingTasks || [],
        attendanceData: action.payload.attendanceData || [],
        upcomingEvents: action.payload.upcomingEvents || [],
        recentActivities: action.payload.recentActivities || [],
        quickActions: action.payload.quickActions || [],
      };
    default:
      return null;
  }
};

export const dashboardReducer = createReducer(dashboardSpecificHandler);
