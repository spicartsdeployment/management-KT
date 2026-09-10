import { createApiClient } from '@school-hrms/utility';
import { ANNOUNCEMENTS_SERVER } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(ANNOUNCEMENTS_SERVER);

// Fetch global announcements for a school/branch
export async function getAnnouncements(params = getSessionParams()) {
  const response = await apiClient.get(
    `/global_announcements/dashboard?schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}
