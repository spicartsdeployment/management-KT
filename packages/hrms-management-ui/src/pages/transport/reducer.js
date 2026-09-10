import { createReducer } from "../../utils/createReducer";

const transportSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_ASSIGNMENTS":
      return { ...state, assignments: action.payload };
    case "SET_BUSES":
      return { ...state, buses: action.payload };
    case "SET_ROUTES":
      return { ...state, routes: action.payload };
    case "SET_DRIVERS":
      return { ...state, drivers: action.payload };
    case "SET_ROUTE_STOPS":
      return { ...state, routeStops: action.payload };
    case "SET_LIVE_TRACKING":
      return { ...state, liveTracking: action.payload };
    case "SET_ANALYTICS":
      return { ...state, analytics: action.payload };
    case "SET_FLEET_OVERVIEW":
      return { ...state, fleetOverview: action.payload };
    case "SET_TODAY_SUMMARY":
      return { ...state, todaySummary: action.payload };
    case "SET_SELECTED_ASSIGNMENT":
      return { ...state, selectedAssignment: action.payload };
    default:
      return null;
  }
};

export const transportReducer = createReducer(transportSpecificHandler);
