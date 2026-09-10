import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { announcementsReducer } from "./reducer";

export const AnnouncementsContext = React.createContext();

export const initialState = createInitialState({
  summary: {},
  list: [],
  createForm: { title: "", content: "", category: "", priority: "" },
});

export { announcementsReducer as reducer };

export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_LIST":
      return { ...state, list: action.payload };
    case "SET_CREATE_FORM":
      return { ...state, createForm: { ...state.createForm, ...action.payload } };
    case "RESET_CREATE_FORM":
      return { ...state, createForm: initialState.createForm };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "UPDATE_STATE_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};
