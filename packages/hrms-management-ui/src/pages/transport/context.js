import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { transportReducer } from "./reducer";

export const TransportContext = React.createContext();

export const initialState = createInitialState({
  assignments: [],
  buses: [],
  routes: [],
  drivers: [],
  routeStops: [],
  liveTracking: null,
  analytics: {},
  fleetOverview: {},
  todaySummary: {},
  selectedAssignment: null,
});

export { transportReducer as reducer };
