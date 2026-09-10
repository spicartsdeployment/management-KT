import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { analyticsReducer } from "./reducer";

export const AnalyticsContext = React.createContext();

export const initialState = createInitialState({
  metrics: {},
  charts: {},
});

export { analyticsReducer as reducer };
