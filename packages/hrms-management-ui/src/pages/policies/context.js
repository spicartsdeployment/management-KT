import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { policiesReducer } from "./reducer";

export const PoliciesContext = React.createContext();

export const initialState = createInitialState({
  leavePolicies: [],
});

export { policiesReducer as reducer };
