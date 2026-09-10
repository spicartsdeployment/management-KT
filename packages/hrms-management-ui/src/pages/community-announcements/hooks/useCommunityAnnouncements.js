import { useReducer } from "react";
import { communityAnnouncementsReducer } from "../community-announcements/reducer";
import { initialState } from "../community-announcements/context";

export const useCommunityAnnouncements = () => {
  const [state, dispatch] = useReducer(communityAnnouncementsReducer, initialState);
  return { state, dispatch };
};
