import { createApiClient } from '@school-hrms/utility';
import { SCHEDULE_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(SCHEDULE_SERVERS);

// Fetch student daily schedule (periods, breaks, homework)
export async function getDailySchedule(params = getSessionParams()) {
  const response = await apiClient.get('/std_schedule/daily', { params });
  return response.data;
}

// Fetch student weekly schedule (timetable grid)
export async function getWeeklySchedule(params = getSessionParams()) {
  const response = await apiClient.get('/std_schedule/weekly', { params });
  return response.data;
}
