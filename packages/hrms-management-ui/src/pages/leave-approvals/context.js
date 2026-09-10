import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { leaveApprovalsReducer } from "./reducer";

export const LeaveApprovalsContext = React.createContext();

export const initialState = createInitialState({
  requests: [],
  selectedRequest: null,
});

export { leaveApprovalsReducer as reducer };
