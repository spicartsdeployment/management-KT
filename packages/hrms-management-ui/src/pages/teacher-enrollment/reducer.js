import { createReducer } from "../../utils/createReducer";

const teacherEnrollmentSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_TEACHERS":
      return { ...state, teachers: action.payload };
    case "OPEN_DIALOG":
      return { ...state, dialogs: { ...state.dialogs, [action.dialog]: true } };
    case "CLOSE_DIALOG":
      return { ...state, dialogs: { ...state.dialogs, [action.dialog]: false } };
    case "SET_SELECTED_TEACHER":
      return { ...state, selectedTeacher: action.payload };
    default:
      return null;
  }
};

export const teacherEnrollmentReducer = createReducer(teacherEnrollmentSpecificHandler);
