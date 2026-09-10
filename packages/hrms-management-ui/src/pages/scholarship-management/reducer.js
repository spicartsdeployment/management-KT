import { createReducer } from "../../utils/createReducer";

const scholarshipManagementSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_SCHOLARSHIPS":
      return { ...state, scholarships: action.payload };
    default:
      return null;
  }
};

export const scholarshipManagementReducer = createReducer(scholarshipManagementSpecificHandler);
