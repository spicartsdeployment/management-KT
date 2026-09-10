import { createReducer } from "../../utils/createReducer";

const staffManagementSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_DIRECTORY":
      return { ...state, directory: action.payload };
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return null;
  }
};

export const staffManagementReducer = createReducer(staffManagementSpecificHandler);
