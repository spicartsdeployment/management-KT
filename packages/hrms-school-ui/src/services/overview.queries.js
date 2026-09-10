import { getOverview } from './overview.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';
import { useQueryClient } from '@tanstack/react-query';

export const useOverviewQuery = createQueryHook(
  ['overview'],
  getOverview
);



export function useOverviewPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['overview'], getOverview);
}

/**
 * Standalone prefetch function for overview
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchOverview(queryClient) {
  return createPrefetchFunction(queryClient, ['overview'], getOverview)();
}
