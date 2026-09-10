import { createReducer } from "../../utils/createReducer";
import { initialState } from "./context";

const announcementsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_LIST":
      return { ...state, list: action.payload };
    case "SET_CREATE_FORM":
      return { ...state, createForm: { ...state.createForm, ...action.payload } };
    case "RESET_CREATE_FORM":
      return { ...state, createForm: initialState.createForm };
    default:
      return null;
  }
};

export const announcementsReducer = createReducer(announcementsSpecificHandler);
