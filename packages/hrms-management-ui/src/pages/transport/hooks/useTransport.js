import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useTransportAssignmentsQuery,
  useTransportBusesQuery,
  useTransportRoutesQuery,
  useTransportDriversQuery,
  useTransportLiveTrackingQuery,
  useTransportAnalyticsQuery,
} from "../../services/transport.queries";
import { getSessionParams } from "../../config/sessionParams";
import { transportReducer } from "../transport/reducer";
import { initialState } from "../transport/context";

export const useTransport = (filters = {}) => {
  const [state, dispatch] = useReducer(transportReducer, initialState);
  const params = getSessionParams();

  const assignmentsQuery = useTransportAssignmentsQuery(params, filters);
  const busesQuery = useTransportBusesQuery(params);
  const routesQuery = useTransportRoutesQuery(params);
  const driversQuery = useTransportDriversQuery(params, filters);
  const liveTrackingQuery = useTransportLiveTrackingQuery(params);
  const analyticsQuery = useTransportAnalyticsQuery(params);

  useFeatureState(state, dispatch, {
    assignmentsQuery,
    busesQuery,
    routesQuery,
    driversQuery,
    liveTrackingQuery,
    analyticsQuery,
  });

  return { state, dispatch };
};
