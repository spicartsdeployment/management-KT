import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { eventsReducer } from "./reducer";

export const EventsContext = React.createContext();

export const initialState = createInitialState({
  summary: {},
  list: [],
  createForm: { title: "", description: "", startDate: "", endDate: "", venue: "" },
});

export { eventsReducer as reducer };
