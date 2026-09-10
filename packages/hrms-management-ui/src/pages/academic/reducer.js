import { createReducer } from "../../utils/createReducer";

const academicSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_CLASSES":
      return { ...state, classes: action.payload };
    case "SET_SUBJECTS":
      return { ...state, subjects: action.payload };
    case "SET_BRANCHES":
      return { ...state, branches: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return null;
  }
};

export const academicReducer = createReducer(academicSpecificHandler);
