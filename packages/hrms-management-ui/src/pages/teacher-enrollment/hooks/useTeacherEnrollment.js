import { useReducer } from "react";
import { teacherEnrollmentReducer } from "../teacher-enrollment/reducer";
import { initialState } from "../teacher-enrollment/context";

export const useTeacherEnrollment = () => {
  const [state, dispatch] = useReducer(teacherEnrollmentReducer, initialState);
  return { state, dispatch };
};
