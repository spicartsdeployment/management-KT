import { createApiClient } from '@school-hrms/utility';
import { MEETINGS_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(MEETINGS_SERVERS);

// Fetch meeting dashboard (upcoming meetings + summary stats)
export async function getMeetingDashboard(params = getSessionParams()) {
  const response = await apiClient.get(
    `/schedule_meetings/dashboard/?studentId=${params.studentId}&schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}

// Fetch completed/past meetings
export async function getCompletedMeetings(params = getSessionParams()) {
  const response = await apiClient.get(
    `/schedule_meetings/completed_meetings?studentId=${params.studentId}&schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}

// Fetch teacher availability for a school/branch
export async function getTeacherAvailability(params = getSessionParams()) {
  const response = await apiClient.get(
    `/schedule_meetings/teacher-availability?schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}

// Schedule a new meeting
export async function scheduleMeeting(payload) {
  const response = await apiClient.post('/schedule_meetings/schedule_meeting/', payload);
  return response.data;
}
