import { createApiClient } from '@school-hrms/utility';
import { ALUMNI_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(ALUMNI_SERVERS);

// Fetch alumni directory data (stats + list)
export async function getAlumniDirectory(params = getSessionParams()) {
  const response = await apiClient.get('/alumni/directory/', { params });
  return response.data;
}

// Fetch alumni events list
export async function getAlumniEvents(params = getSessionParams()) {
  const response = await apiClient.get('/alumni/events/', { params });
  return response.data;
}

// Fetch alumni mentorship list
export async function getAlumniMentorship(params = getSessionParams()) {
  const response = await apiClient.get('/alumni/mentorship/', { params });
  return response.data;
}
