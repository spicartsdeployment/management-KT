import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { alumniMentorsReducer } from "./reducer";

export const AlumniMentorsContext = React.createContext();

export const initialState = createInitialState({
  mentors: [],
});

export { alumniMentorsReducer as reducer };
