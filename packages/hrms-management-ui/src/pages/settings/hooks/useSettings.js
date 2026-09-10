import { useReducer } from "react";
import { settingsReducer } from "../settings/reducer";
import { initialState } from "../settings/context";

export const useSettings = () => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  return { state, dispatch };
};
