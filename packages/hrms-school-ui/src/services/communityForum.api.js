import { createApiClient } from '@school-hrms/utility';
import { COMMUNITY_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(COMMUNITY_SERVERS);

// Fetch community forum dashboard data
export async function getCommunityForum(params = getSessionParams()) {
  const response = await apiClient.get(
    `/community_forum/dashboard?schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}
