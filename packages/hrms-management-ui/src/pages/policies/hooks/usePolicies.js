import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import { useLeavePoliciesQuery } from "../../services/policies.queries";
import { getSessionParams } from "../../config/sessionParams";
import { policiesReducer } from "../policies/reducer";
import { initialState } from "../policies/context";

export const usePolicies = (filters = {}) => {
  const [state, dispatch] = useReducer(policiesReducer, initialState);
  const params = getSessionParams();

  const policiesQuery = useLeavePoliciesQuery(params, filters);

  useFeatureState(state, dispatch, {
    policiesQuery,
  });

  return { state, dispatch };
};
