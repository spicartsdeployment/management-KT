import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useEventsSummaryQuery,
  useEventsListQuery,
} from "../../services/events.queries";
import { getSessionParams } from "../../config/sessionParams";
import { eventsReducer } from "../events/reducer";
import { initialState } from "../events/context";

export const useEvents = (filters = {}) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);
  const params = getSessionParams();

  const summaryQuery = useEventsSummaryQuery(params);
  const listQuery = useEventsListQuery(params, filters);

  useFeatureState(state, dispatch, {
    summaryQuery,
    listQuery,
  });

  return { state, dispatch };
};
