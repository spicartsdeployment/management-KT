import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useFeeOverviewSummaryQuery,
  useFeeOverviewTableQuery,
  useFeeDueSummaryQuery,
  useFeeDueTableQuery,
  useFeeTermTrackingQuery,
} from "../../services/fees.queries";
import { getSessionParams } from "../../config/sessionParams";
import { feeManagementReducer } from "../fee-management/reducer";
import { initialState } from "../fee-management/context";

export const useFeeManagement = (filters = {}) => {
  const [state, dispatch] = useReducer(feeManagementReducer, initialState);
  const params = getSessionParams();

  const overviewSummaryQuery = useFeeOverviewSummaryQuery(params);
  const overviewTableQuery = useFeeOverviewTableQuery(params, filters);
  const dueSummaryQuery = useFeeDueSummaryQuery(params);
  const dueTableQuery = useFeeDueTableQuery(params, filters);
  const termTrackingQuery = useFeeTermTrackingQuery(params, filters);

  useFeatureState(state, dispatch, {
    overviewSummaryQuery,
    overviewTableQuery,
    dueSummaryQuery,
    dueTableQuery,
    termTrackingQuery,
  });

  return { state, dispatch };
};
