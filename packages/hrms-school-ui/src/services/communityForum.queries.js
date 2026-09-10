import { getCommunityForum } from './communityForum.api';
import { createQueryHook, createPrefetchFunction } from '../lib/createQueryHook';
import { useQueryClient } from '@tanstack/react-query';

export const useCommunityForumQuery = createQueryHook(
  ['communityForum'],
  getCommunityForum
);

export function useCommunityForumPrefetch() {
  const queryClient = useQueryClient();
  return createPrefetchFunction(queryClient, ['communityForum'], getCommunityForum);
}

/**
 * Standalone prefetch function for community forum
 * @param {object} queryClient - React Query client instance
 * @returns {Promise<void>}
 */
export function prefetchCommunityForum(queryClient) {
  return createPrefetchFunction(queryClient, ['communityForum'], getCommunityForum)();
}
