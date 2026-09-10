import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { academicReducer } from "./reducer";

export const AcademicContext = React.createContext();

export const initialState = createInitialState({
  classes: [],
  subjects: [],
  branches: [],
  activeTab: "classes",
  selectedClass: null,
});

export { academicReducer as reducer };
