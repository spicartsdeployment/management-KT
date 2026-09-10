import { useReducer } from "react";
import { scholarshipManagementReducer } from "../scholarship-management/reducer";
import { initialState } from "../scholarship-management/context";

export const useScholarshipManagement = () => {
  const [state, dispatch] = useReducer(scholarshipManagementReducer, initialState);
  return { state, dispatch };
};
