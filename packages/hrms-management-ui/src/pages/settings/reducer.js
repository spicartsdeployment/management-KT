import { createReducer } from "../../utils/createReducer";

const settingsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "UPDATE_SETTING":
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };
    default:
      return null;
  }
};

export const settingsReducer = createReducer(settingsSpecificHandler);
