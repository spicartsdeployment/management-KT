import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useGrievancesSummaryQuery,
  useGrievancesListQuery,
} from "../../services/grievances.queries";
import { getSessionParams } from "../../config/sessionParams";
import { grievancesReducer } from "../grievances/reducer";
import { initialState } from "../grievances/context";

export const useGrievances = (filters = {}) => {
  const [state, dispatch] = useReducer(grievancesReducer, initialState);
  const params = getSessionParams();

  const summaryQuery = useGrievancesSummaryQuery(params);
  const listQuery = useGrievancesListQuery(params, filters);

  useFeatureState(state, dispatch, {
    summaryQuery,
    listQuery,
  });

  return { state, dispatch };
};
