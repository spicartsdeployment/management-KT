/**
 * Custom hook to reduce boilerplate in feature-specific hooks
 * Automatically dispatches loading/error state from React Query hooks
 * 
 * USAGE EXAMPLE:
 * 
 * // Old way (40+ lines of useEffect boilerplate):
 * export const useBusTracking = () => {
 *   const [state, dispatch] = useReducer(busTrackingReducer, initialState);
 *   const busQuery = useBusInfoQuery();
 *   const routeQuery = useRouteQuery();
 *   
 *   // Manual loading state
 *   useEffect(() => {
 *     if (busQuery.isLoading || routeQuery.isLoading) {
 *       dispatch({ type: 'SET_LOADING' });
 *     }
 *   }, [busQuery.isLoading, routeQuery.isLoading]);
 *   
 *   // Manual error state
 *   useEffect(() => {
 *     const error = busQuery.error || routeQuery.error;
 *     if (error) {
 *       dispatch({ type: 'SET_ERROR', payload: error });
 *     }
 *   }, [busQuery.error, routeQuery.error]);
 *   
 *   // Manual data dispatch
 *   useEffect(() => {
 *     if (busQuery.data) {
 *       dispatch({ type: 'SET_BUS_INFO', payload: busQuery.data });
 *     }
 *   }, [busQuery.data]);
 *   
 *   // ... more useEffect blocks
 *   return { state, dispatch };
 * };
 * 
 * // New way (1 line):
 * export const useBusTracking = () => {
 *   const [state, dispatch] = useReducer(busTrackingReducer, initialState);
 *   const queries = { busQuery: useBusInfoQuery(), routeQuery: useRouteQuery() };
 *   useFeatureState(state, dispatch, queries);
 *   return { state, dispatch };
 * };
 */

import { useEffect, useMemo } from 'react';

/**
 * Automatically dispatch loading/error/data changes from query hooks
 * 
 * @param {object} state - Current state from useReducer
 * @param {function} dispatch - Dispatch function from useReducer
 * @param {object} queries - Object of React Query hooks
 * 
 * NAMING CONVENTION:
 * Query names are converted to action types automatically:
 * - busQuery → SET_BUS (extracts 'bus' from 'busQuery')
 * - routeQuery → SET_ROUTE
 * - dataQuery → SET_DATA
 * 
 * So if busQuery.data changes, it dispatches:
 * dispatch({ type: 'SET_BUS', payload: busQuery.data })
 * 
 * @example
 * export const useBusTracking = () => {
 *   const [state, dispatch] = useReducer(busTrackingReducer, initialState);
 *   const queries = {
 *     busQuery: useBusInfoQuery(),
 *     routeQuery: useRouteQuery(),
 *   };
 *   useFeatureState(state, dispatch, queries);
 *   return { state, dispatch };
 * };
 */
export function useFeatureState(state, dispatch, queries) {
  // Validate queries parameter
  if (!queries || typeof queries !== 'object') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useFeatureState: queries parameter must be an object');
    }
    return;
  }

  // Compute isLoading and error as stable values (via useMemo)
  // This prevents unnecessary re-renders and makes dependency arrays stable
  const isLoading = useMemo(
    () => Object.values(queries).some((query) => query?.isLoading),
    [queries]
  );

  const error = useMemo(() => {
    for (const query of Object.values(queries)) {
      if (query?.error) return query.error;
    }
    return null;
  }, [queries]);

  // Dispatch loading state when any query is loading
  useEffect(() => {
    dispatch({ type: 'SET_LOADING' });
  }, [isLoading, dispatch]);

  // Dispatch error state when any query has an error
  useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  }, [error, dispatch]);

  // Dispatch data for each query using naming convention
  // busQuery → SET_BUS, routeQuery → SET_ROUTE, etc.
  useEffect(() => {
    for (const [queryName, query] of Object.entries(queries)) {
      if (query?.data) {
        // Convert queryName: 'busQuery' → 'BUS', 'routeQuery' → 'ROUTE'
        const actionName = queryName
          .replace(/Query$/, '') // Remove 'Query' suffix
          .replace(/([A-Z])/g, '_$1') // Add underscore before capitals
          .toUpperCase()
          .replace(/^_/, ''); // Remove leading underscore

        dispatch({
          type: `SET_${actionName}`,
          payload: query.data,
        });
      }
    }
  }, [queries, dispatch]);
}

export default useFeatureState;
