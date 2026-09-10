import { createReducer } from "../../utils/createReducer";

const alumniMentorsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_MENTORS":
      return { ...state, mentors: action.payload };
    default:
      return null;
  }
};

export const alumniMentorsReducer = createReducer(alumniMentorsSpecificHandler);
