import { useReducer } from "react";
import { academicReducer } from "../academic/reducer";
import { initialState } from "../academic/context";

export const useAcademic = () => {
  const [state, dispatch] = useReducer(academicReducer, initialState);
  return { state, dispatch };
};
