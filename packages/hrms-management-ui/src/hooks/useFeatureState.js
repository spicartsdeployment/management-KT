/**
 * Custom hook to reduce boilerplate in feature-specific hooks
 * Automatically handles:
 * - Aggregating loading state from multiple queries
 * - Dispatching loading/error state changes
 * - Auto-dispatching data changes with naming convention
 * 
 * Usage in a feature hook (e.g., useDashboard):
 * 
 * export const useDashboard = () => {
 *   const [state, dispatch] = useReducer(dashboardReducer, initialState);
 *   const queries = {
 *     dataQuery: useDashboardDataQuery(),
 *     kpiQuery: useKpiQuery(),
 *   };
 *   useFeatureState(state, dispatch, queries);
 *   return { state, dispatch };
 * };
 * 
 * This automatically:
 * - Dispatches SET_LOADING when any query is loading
 * - Dispatches SET_ERROR when any query has an error
 * - Dispatches SET_DATA when dataQuery updates
 * - Dispatches SET_KPI when kpiQuery updates
 * (naming converts: dataQuery -> SET_DATA, kpiQuery -> SET_KPI)
 * 
 * @param {object} state - Current state from useReducer
 * @param {function} dispatch - Dispatch function from useReducer
 * @param {object} queries - Object of query hooks (e.g., { summaryQuery, listQuery })
 */

import { useEffect, useMemo, useRef } from "react";
export const useFeatureState = (state, dispatch, queries) => {
  // Development-time validation
  if (!queries || typeof queries !== "object") {
    console.warn("useFeatureState: queries must be an object of query hooks", { received: typeof queries });
  }

  // Aggregate loading state from all queries using useMemo to stabilize reference
  const isLoading = useMemo(
    () => queries && Object.values(queries).some(q => q?.isLoading),
    [queries]
  );

  // Track previous isLoading to avoid dispatching when value hasn't changed
  const prevIsLoadingRef = useRef(null);

  // Dispatch loading state change only when the value actually changes
  useEffect(() => {
    if (isLoading !== prevIsLoadingRef.current) {
      prevIsLoadingRef.current = isLoading;
      dispatch({ type: "SET_LOADING", payload: isLoading });
    }
  }, [isLoading, dispatch]);

  // Find first error from any query using useMemo to stabilize reference
  const error = useMemo(
    () => queries && Object.values(queries).find(q => q?.error)?.error,
    [queries]
  );

  // Dispatch error state change
  useEffect(() => {
    if (error) {
      dispatch({ type: "SET_ERROR", payload: error?.message || String(error) });
    }
  }, [error, dispatch]);

  // Track which query data has already been dispatched to avoid infinite loops.
  // We compare by query data reference (React Query provides stable references),
  // NOT by state field name (which may not match the hookName convention).
  const dispatchedDataRef = useRef({});

  // Auto-dispatch data updates with naming convention
  // Converts: dashboardQuery -> SET_DASHBOARD, dataQuery -> SET_DATA, kpiQuery -> SET_KPI
  useEffect(() => {
    if (!queries) return;
    
    Object.entries(queries).forEach(([hookName, query]) => {
      if (query?.data && query.data !== dispatchedDataRef.current[hookName]) {
        const actionType = "SET_" + deriveActionName(hookName);
        dispatch({ type: actionType, payload: query.data });
        dispatchedDataRef.current[hookName] = query.data;
      }
    });
  }, [queries, dispatch]);
};

/**
 * Convert hook name to action type
 * dashboardQuery -> DASHBOARD
 * feeOverviewSummaryQuery -> FEE_OVERVIEW_SUMMARY
 * listQuery -> LIST
 */
const deriveActionName = (hookName) => {
  return hookName
    .replace(/Query$/, "")  // Remove "Query" suffix
    .replace(/([A-Z])/g, "_$1") // Add underscore before capitals
    .toUpperCase()
    .replace(/^_/, "");  // Remove leading underscore
};

/**
 * Convert hook name to state field name
 * dashboardQuery -> dashboard
 * feeOverviewSummaryQuery -> feeOverviewSummary
 * listQuery -> list
 */
const deriveFieldName = (hookName) => {
  return hookName.replace(/Query$/, ""); // Remove "Query" suffix
};
