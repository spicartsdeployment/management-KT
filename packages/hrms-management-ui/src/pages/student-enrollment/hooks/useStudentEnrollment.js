import { useReducer } from "react";
import { studentEnrollmentReducer } from "../student-enrollment/reducer";
import { initialState } from "../student-enrollment/context";

export const useStudentEnrollment = () => {
  const [state, dispatch] = useReducer(studentEnrollmentReducer, initialState);
  return { state, dispatch };
};
