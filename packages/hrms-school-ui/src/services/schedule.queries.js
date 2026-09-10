import { getDailySchedule, getWeeklySchedule } from './schedule.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';
import { useQueryClient } from '@tanstack/react-query';

export const useDailyScheduleQuery = createQueryHook(
  ['schedule', 'daily'],
  getDailySchedule
);

export function useDailySchedulePrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['schedule', 'daily'], getDailySchedule);
}

/**
 * Standalone prefetch function for daily schedule
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchDailySchedule(queryClient) {
  return createPrefetchFunction(queryClient, ['schedule', 'daily'], getDailySchedule)();
}

export const useWeeklyScheduleQuery = createQueryHook(
  ['schedule', 'weekly'],
  getWeeklySchedule
);
