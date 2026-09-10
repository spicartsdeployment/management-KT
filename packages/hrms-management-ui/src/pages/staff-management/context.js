import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { staffManagementReducer } from "./reducer";

export const StaffManagementContext = React.createContext();

export const initialState = createInitialState({
  directory: [],
  contacts: [],
  summary: {},
  activeTab: "directory",
});

export { staffManagementReducer as reducer };
