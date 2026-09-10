import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMeetingDashboard,
  getCompletedMeetings,
  getTeacherAvailability,
  scheduleMeeting,
} from './meetingScheduler.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';

export const useMeetingDashboardQuery = createQueryHook(
  ['meeting', 'dashboard'],
  getMeetingDashboard
);

export const useCompletedMeetingsQuery = createQueryHook(
  ['meeting', 'completed'],
  getCompletedMeetings
);

export const useTeacherAvailabilityQuery = createQueryHook(
  ['meeting', 'availability'],
  getTeacherAvailability,
  { staleTime: 5 * 60 * 1000 }
);

export function useMeetingDashboardPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['meeting', 'dashboard'], getMeetingDashboard);
}

/**
 * Standalone prefetch function for meeting dashboard
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchMeetingDashboard(queryClient) {
  return createPrefetchFunction(queryClient, ['meeting', 'dashboard'], getMeetingDashboard)();
}

// Mutation hook for scheduling a new meeting
export function useScheduleMeetingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => scheduleMeeting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', 'completed'] });
    },
  });
}
