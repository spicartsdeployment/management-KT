import React from "react";
import { createInitialState } from "../../utils/createReducer";
import { communityAnnouncementsReducer } from "./reducer";

export const CommunityAnnouncementsContext = React.createContext();

export const initialState = createInitialState({
  announcements: [],
});

export { communityAnnouncementsReducer as reducer };
