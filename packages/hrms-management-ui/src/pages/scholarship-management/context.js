import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { scholarshipManagementReducer } from "./reducer";

export const ScholarshipManagementContext = React.createContext();

export const initialState = createInitialState({
  scholarships: [],
});

export { scholarshipManagementReducer as reducer };
