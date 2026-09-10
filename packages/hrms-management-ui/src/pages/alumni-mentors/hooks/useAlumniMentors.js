import { useReducer } from "react";
import { alumniMentorsReducer } from "../alumni-mentors/reducer";
import { initialState } from "../alumni-mentors/context";

export const useAlumniMentors = () => {
  const [state, dispatch] = useReducer(alumniMentorsReducer, initialState);
  return { state, dispatch };
};
