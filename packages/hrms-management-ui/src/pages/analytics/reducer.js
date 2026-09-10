import { createReducer } from "../../utils/createReducer";

const analyticsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_METRICS":
      return { ...state, metrics: action.payload };
    case "SET_CHARTS":
      return { ...state, charts: action.payload };
    default:
      return null;
  }
};

export const analyticsReducer = createReducer(analyticsSpecificHandler);
