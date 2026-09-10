import { getAnnouncements } from './announcements.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';
import { useQueryClient } from '@tanstack/react-query';

export const useAnnouncementsQuery = createQueryHook(
  ['announcements'],
  getAnnouncements
);

export function useAnnouncementsPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['announcements'], getAnnouncements);
}

/**
 * Standalone prefetch function for announcements
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchAnnouncements(queryClient) {
  return createPrefetchFunction(queryClient, ['announcements'], getAnnouncements)();
}
