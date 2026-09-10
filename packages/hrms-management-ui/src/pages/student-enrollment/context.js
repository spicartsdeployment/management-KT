import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { studentEnrollmentReducer } from "./reducer";

export const StudentEnrollmentContext = React.createContext();

export const initialState = createInitialState({
  students: [],
  dialogs: { view: false, add: false, edit: false, bulkUpload: false },
  selectedStudent: null,
});

export { studentEnrollmentReducer as reducer };
