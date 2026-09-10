/**
 * Factory function to create React Query hooks with standardized options
 * Eliminates duplication of query configuration across all service files
 * 
 * Default options:
 * - staleTime: 5 minutes (data remains fresh for 5 min)
 * - gcTime: 10 minutes (garbage collect unused data after 10 min)
 * - refetchOnWindowFocus: false (don't auto-refetch on window focus)
 * 
 * Usage:
 * export const useMyFeatureQuery = createQueryHook(
 *   ["myFeature", "data"],
 *   getMyFeatureData
 * );
 * 
 * With custom options:
 * export const useMyFeatureQuery = createQueryHook(
 *   ["myFeature"],
 *   getMyFeatureData,
 *   { staleTime: 1 * 60 * 1000 } // 1 minute instead of default 5
 * );
 */

import { useQuery } from "@tanstack/react-query";
import { getSessionParams } from "../config/sessionParams";

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,      // 5 minutes
  gcTime: 10 * 60 * 1000,        // 10 minutes
  refetchOnWindowFocus: false,
};

/**
 * Create a query hook with standard options
 * @param {string|array} queryKeyBase - Base for queryKey (e.g., "dashboard" or ["feature", "data"])
 * @param {function} queryFn - Async function to fetch data
 * @param {object} options - Custom options to merge with defaults
 * @returns {function} - React Query hook
 */
export const createQueryHook = (
  queryKeyBase,
  queryFn,
  options = {}
) => {
  return (params = getSessionParams(), ...args) => {
    console.log("Query params:", params);
    console.log("Query args:", args);
    const queryKey = Array.isArray(queryKeyBase)
      ? [...queryKeyBase, params, ...args]
      : [queryKeyBase, params, ...args];

    return useQuery({
      queryKey,
      queryFn: () => queryFn(params, ...args),
      ...DEFAULT_QUERY_OPTIONS,
      ...options,
    });
  };
};

/**
 * Create a prefetch function for a query hook
 * Used to preload data when user hovers over sidebar menus
 * 
 * Usage:
 * export const prefetchMyFeature = createPrefetchFunction(
 *   useMyFeatureQuery,
 *   ["myFeature"]
 * );
 */
export const createPrefetchFunction = (
  queryHookFunc,
  queryKeyBase,
  options = {}
) => {
  return
  (queryClient, params = getSessionParams(), ...args) => {
    const queryKey = Array.isArray(queryKeyBase)
      ? [...queryKeyBase, params, ...args]
      : [queryKeyBase, params, ...args];

    queryClient.prefetchQuery({
      queryKey,
      queryFn: () => queryHookFunc(params, ...args),
      ...DEFAULT_QUERY_OPTIONS,
      ...options,
    });
  };
};
