import { createReducer } from "../../utils/createReducer";

const leaveApprovalsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_REQUESTS":
      return { ...state, requests: action.payload };
    case "SET_SELECTED_REQUEST":
      return { ...state, selectedRequest: action.payload };
    default:
      return null;
  }
};

export const leaveApprovalsReducer = createReducer(leaveApprovalsSpecificHandler);
