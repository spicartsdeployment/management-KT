import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { feeManagementReducer } from "./reducer";

export const FeeManagementContext = React.createContext();

export const initialState = createInitialState({
  overviewSummary: {},
  overviewTable: [],
  dueSummary: {},
  dueTable: [],
  termTracking: [],
  activeTab: "overview",
});

export { feeManagementReducer as reducer };
