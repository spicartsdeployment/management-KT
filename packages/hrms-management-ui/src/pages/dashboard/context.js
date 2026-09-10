import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { dashboardReducer } from "./reducer";

export const DashboardContext = React.createContext();

export const initialState = createInitialState({
  kpiCards: [],
  pendingTasks: [],
  attendanceData: [],
  upcomingEvents: [],
  recentActivities: [],
  quickActions: [],
});

export { dashboardReducer as reducer };
