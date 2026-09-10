import { createReducer } from "../../utils/createReducer";

const feeManagementSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_OVERVIEW_SUMMARY":
      return { ...state, overviewSummary: action.payload };
    case "SET_OVERVIEW_TABLE":
      return { ...state, overviewTable: action.payload };
    case "SET_DUE_SUMMARY":
      return { ...state, dueSummary: action.payload };
    case "SET_DUE_TABLE":
      return { ...state, dueTable: action.payload };
    case "SET_TERM_TRACKING":
      return { ...state, termTracking: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return null;
  }
};

export const feeManagementReducer = createReducer(feeManagementSpecificHandler);
