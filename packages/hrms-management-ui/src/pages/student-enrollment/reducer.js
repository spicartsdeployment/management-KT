import { createReducer } from "../../utils/createReducer";

const studentEnrollmentSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_STUDENTS":
      return { ...state, students: action.payload };
    case "OPEN_DIALOG":
      return { ...state, dialogs: { ...state.dialogs, [action.dialog]: true } };
    case "CLOSE_DIALOG":
      return { ...state, dialogs: { ...state.dialogs, [action.dialog]: false } };
    case "SET_SELECTED_STUDENT":
      return { ...state, selectedStudent: action.payload };
    default:
      return null;
  }
};

export const studentEnrollmentReducer = createReducer(studentEnrollmentSpecificHandler);
