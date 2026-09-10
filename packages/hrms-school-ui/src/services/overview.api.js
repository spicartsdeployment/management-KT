import { createApiClient } from '@school-hrms/utility';
import { OVERVIEW_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(OVERVIEW_SERVERS);

// Fetch student overview data
export async function getOverview(params = getSessionParams()) {
  console.log("Overview Request Params:", params);
  const response = await apiClient.get('/std_overview/overview', { params });
  return response.data;
}
