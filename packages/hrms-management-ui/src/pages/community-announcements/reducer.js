import { createReducer } from "../../utils/createReducer";

const communityAnnouncementsSpecificHandler = (state, action) => {
  switch (action.type) {
    case "SET_ANNOUNCEMENTS":
      return { ...state, announcements: action.payload };
    default:
      return null;
  }
};

export const communityAnnouncementsReducer = createReducer(communityAnnouncementsSpecificHandler);
