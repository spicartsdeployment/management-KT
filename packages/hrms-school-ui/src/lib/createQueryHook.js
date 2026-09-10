/**
 * Factory to create React Query hooks with standard configuration
 * 
 * USAGE EXAMPLE:
 * 
 * // Old way (10-15 lines per file, repeated 30+ times):
 * export function useAlumniListQuery(params = getSessionParams()) {
 *   return useQuery({
 *     queryKey: ['alumni', 'list', params],
 *     queryFn: () => getAlumniList(params),
 *     staleTime: 5 * 60 * 1000,
 *     gcTime: 10 * 60 * 1000,
 *     refetchOnWindowFocus: false,
 *     refetchOnReconnect: true,
 *   });
 * }
 * 
 * // New way (1-2 lines per file):
 * export const useAlumniListQuery = createQueryHook(
 *   ['alumni', 'list'],
 *   getAlumniList,
 *   { staleTime: 5 * 60 * 1000 }
 * );
 */

import { useQuery } from '@tanstack/react-query';
import { getSessionParams } from '../config/sessionParams';

const DEFAULT_OPTIONS = {
  staleTime: 2 * 60 * 1000, // 2 minutes (can override per hook)
  gcTime: 10 * 60 * 1000,   // 10 minutes (garbage collect)
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: import.meta.env?.DEV ? 0 : 3, // fail-fast in dev; resilient in prod
};

/**
 * Create a reusable React Query hook with standard options
 * 
 * @param {string|array} queryKey - Base query key (e.g., 'alumni' or ['alumni', 'list'])
 * @param {function} queryFn - API function that receives params and returns data
 * @param {object} customOptions - Override any default options (staleTime, gcTime, etc.)
 * 
 * @returns {function} A hook that accepts optional params and returns query result
 * 
 * @example
 * export const useAlumniQuery = createQueryHook(
 *   ['alumni', 'list'],
 *   getAlumniList,
 *   { staleTime: 5 * 60 * 1000 } // Override default staleTime
 * );
 * 
 * // Use in component:
 * const { data, isLoading, error } = useAlumniQuery();
 * // Or with custom params:
 * const { data } = useAlumniQuery({ classId: '10A' });
 */
export function createQueryHook(queryKey, queryFn, customOptions = {}) {
  return function useQueryHook(params = getSessionParams()) {
    // Ensure queryKey is array and includes params
    console.log("Query params:", params);

    const baseKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    const finalQueryKey = [...baseKey, params];

    // Merge custom options with defaults
    const options = { ...DEFAULT_OPTIONS, ...customOptions };

    return useQuery({
      queryKey: finalQueryKey,
      queryFn: () => queryFn(params),
      ...options,
    });
  };
}

/**
 * Create a prefetch function to load data before rendering a page
 * Useful in route loaders or navigation handlers
 * 
 * @param {object} queryClient - From useQueryClient()
 * @param {string|array} queryKey - Same as createQueryHook
 * @param {function} queryFn - Same as createQueryHook
 * @param {object} customOptions - Same as createQueryHook
 * 
 * @returns {function} Async function to prefetch data
 * 
 * @example
 * const queryClient = useQueryClient();
 * const prefetch = createPrefetchFunction(
 *   queryClient,
 *   ['alumni', 'list'],
 *   getAlumniList
 * );
 * await prefetch(); // Prefetch with default params
 * await prefetch({ classId: '10A' }); // Prefetch with custom params
 */
export function createPrefetchFunction(queryClient, queryKey, queryFn, customOptions = {}) {
  return async function prefetch(params = getSessionParams()) {
    const baseKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    const finalQueryKey = [...baseKey, params];
    const options = { ...DEFAULT_OPTIONS, ...customOptions };

    await queryClient.prefetchQuery({
      queryKey: finalQueryKey,
      queryFn: () => queryFn(params),
      ...options,
    });
  };
}
