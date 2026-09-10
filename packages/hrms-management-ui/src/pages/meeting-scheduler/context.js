import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { meetingSchedulerReducer } from "./reducer";

export const MeetingSchedulerContext = React.createContext();

export const initialState = createInitialState({
  meetings: [],
  schedule: [],
  createForm: { title: "", startDate: "", endDate: "", participants: [] },
});

export { meetingSchedulerReducer as reducer };
