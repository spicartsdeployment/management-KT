import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGrievanceStatistics,
  getGrievanceHistory,
  getGrievanceGuidelines,
  submitGrievance,
} from './grievance.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';

export const useGrievanceStatsQuery = createQueryHook(
  ['grievance', 'stats'],
  getGrievanceStatistics
);

export const useGrievanceHistoryQuery = createQueryHook(
  ['grievance', 'history'],
  getGrievanceHistory
);

export const useGrievanceGuidelinesQuery = createQueryHook(
  ['grievance', 'guidelines'],
  getGrievanceGuidelines,
  { staleTime: 10 * 60 * 1000 }
);

export function useGrievanceStatsPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['grievance', 'stats'], getGrievanceStatistics);
}

/**
 * Standalone prefetch function for grievance stats
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchGrievanceStats(queryClient) {
  return createPrefetchFunction(queryClient, ['grievance', 'stats'], getGrievanceStatistics)();
}

// Mutation hook for submitting a new grievance
export function useSubmitGrievanceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => submitGrievance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grievance', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['grievance', 'history'] });
    },
  });
}
