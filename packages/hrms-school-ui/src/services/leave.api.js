import { createApiClient } from '@school-hrms/utility';
import { LEAVE_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(LEAVE_SERVERS);

// Fetch leave statistics for a student
export async function getLeaveStatistics(params = getSessionParams()) {
  const response = await apiClient.get(
    `/leaves/statistics?studentId=${params.studentId}&branchId=${params.branchId}&schoolId=${params.schoolId}`
  );
  return response.data;
}

// Submit a leave request
export async function submitLeaveRequest(payload) {
  const response = await apiClient.post('/leaves/submit/', payload);
  return response.data;
}
