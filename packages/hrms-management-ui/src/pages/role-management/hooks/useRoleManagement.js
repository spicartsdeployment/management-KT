import { useReducer } from "react";
import { roleManagementReducer } from "../role-management/reducer";
import { initialState } from "../role-management/context";

export const useRoleManagement = () => {
  const [state, dispatch] = useReducer(roleManagementReducer, initialState);
  return { state, dispatch };
};
