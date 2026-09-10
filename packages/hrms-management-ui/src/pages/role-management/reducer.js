import { createReducer } from "../../utils/createReducer";

const roleManagementSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_ROLES":
      return { ...state, roles: action.payload };
    case "SET_PERMISSIONS":
      return { ...state, permissions: action.payload };
    default:
      return null;
  }
};

export const roleManagementReducer = createReducer(roleManagementSpecificHandler);
