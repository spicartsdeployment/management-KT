import { createApiClient } from '@school-hrms/utility';
import { GRIEVANCE_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(GRIEVANCE_SERVERS);

// Fetch grievance statistics for a student
export async function getGrievanceStatistics(params = getSessionParams()) {
  const response = await apiClient.get(
    `/grievance_system/statistics/?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch grievance history for a student
export async function getGrievanceHistory(params = getSessionParams()) {
  const response = await apiClient.get(
    `/grievance_system/history/?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch grievance submission guidelines
export async function getGrievanceGuidelines(params = getSessionParams()) {
  const response = await apiClient.get(
    `/grievance_system/guidelines/?schoolId=${params.schoolId}&branchId=${params.branchId}`
  );
  return response.data;
}

// Submit a new grievance
export async function submitGrievance(payload) {
  const response = await apiClient.post('/grievance_system/submit/', payload);
  return response.data;
}
