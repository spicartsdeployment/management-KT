import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeaveStatistics, submitLeaveRequest } from './leave.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';

export const useLeaveStatisticsQuery = createQueryHook(
  ['leave', 'stats'],
  getLeaveStatistics
);

export function useLeaveStatisticsPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['leave', 'stats'], getLeaveStatistics);
}

/**
 * Standalone prefetch function for leave statistics
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchLeaveStatistics(queryClient) {
  return createPrefetchFunction(queryClient, ['leave', 'stats'], getLeaveStatistics)();
}




// Mutation hook for submitting a leave request
export function useSubmitLeaveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => submitLeaveRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave', 'stats'] });
    },
  });
}
