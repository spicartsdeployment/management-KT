import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { teacherEnrollmentReducer } from "./reducer";

export const TeacherEnrollmentContext = React.createContext();

export const initialState = createInitialState({
  teachers: [],
  dialogs: { view: false, add: false, edit: false },
  selectedTeacher: null,
});

export { teacherEnrollmentReducer as reducer };
