import { useReducer } from "react";
import { useFeatureState } from "../../../hooks/useFeatureState";
import {
  useStaffDirectoryQuery,
  useStaffContactsQuery,
  useStaffSummaryQuery,
} from "../../services/staff.queries";
import { getSessionParams } from "../../config/sessionParams";
import { staffManagementReducer } from "../staff-management/reducer";
import { initialState } from "../staff-management/context";

export const useStaffManagement = (filters = {}) => {
  const [state, dispatch] = useReducer(staffManagementReducer, initialState);
  const params = getSessionParams();

  const directoryQuery = useStaffDirectoryQuery(params, filters);
  const contactsQuery = useStaffContactsQuery(params, filters);
  const summaryQuery = useStaffSummaryQuery(params);

  useFeatureState(state, dispatch, {
    directoryQuery,
    contactsQuery,
    summaryQuery,
  });

  return { state, dispatch };
};
