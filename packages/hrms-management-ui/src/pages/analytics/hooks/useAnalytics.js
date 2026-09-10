import { useReducer } from "react";
import { analyticsReducer } from "../analytics/reducer";
import { initialState } from "../analytics/context";

export const useAnalytics = () => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);
  return { state, dispatch };
};
