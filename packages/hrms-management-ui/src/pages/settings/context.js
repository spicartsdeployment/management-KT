import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { settingsReducer } from "./reducer";

export const SettingsContext = React.createContext();

export const initialState = createInitialState({
  settings: { theme: "light", language: "en", notifications: true },
});

export { settingsReducer as reducer };
