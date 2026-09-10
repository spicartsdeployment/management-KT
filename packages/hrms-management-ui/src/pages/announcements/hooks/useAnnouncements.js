import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useAnnouncementsSummaryQuery,
  useAnnouncementsListQuery,
} from "../../services/announcements.queries";
import { getSessionParams } from "../../config/sessionParams";
import { announcementsReducer } from "../announcements/reducer";
import { initialState } from "../announcements/context";

export const useAnnouncements = (filters = {}) => {
  const [state, dispatch] = useReducer(announcementsReducer, initialState);
  const params = getSessionParams();

  const summaryQuery = useAnnouncementsSummaryQuery(params);
  const listQuery = useAnnouncementsListQuery(params, filters);

  useFeatureState(state, dispatch, {
    summaryQuery,
    listQuery,
  });

  return { state, dispatch };
};
