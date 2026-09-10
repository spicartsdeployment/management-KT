import { useReducer } from "react";
import { leaveApprovalsReducer } from "../leave-approvals/reducer";
import { initialState } from "../leave-approvals/context";

export const useLeaveApprovals = () => {
  const [state, dispatch] = useReducer(leaveApprovalsReducer, initialState);
  return { state, dispatch };
};
