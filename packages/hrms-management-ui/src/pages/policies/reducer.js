import { createReducer } from "../../utils/createReducer";

const policiesSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_LEAVE_POLICIES":
      return { ...state, leavePolicies: action.payload };
    default:
      return null;
  }
};

export const policiesReducer = createReducer(policiesSpecificHandler);
