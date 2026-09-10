import { createApiClient } from '@school-hrms/utility';
import { PERFORMANCE_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(PERFORMANCE_SERVERS);

// Fetch academic performance data
export async function getAcademicPerformance(params = getSessionParams()) {
  const response = await apiClient.get(
    `/performance/academic/?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch sports performance data
export async function getSportsPerformance(params = getSessionParams()) {
  const response = await apiClient.get(
    `/performance/sports?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch behavior performance data
export async function getBehaviorPerformance(params = getSessionParams()) {
  const response = await apiClient.get(
    `/performance/behavior/?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch cultural performance data
export async function getCulturalPerformance(params = getSessionParams()) {
  const response = await apiClient.get(
    `/performance/cultural/?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch all performance categories in parallel
export async function getAllPerformance(params = getSessionParams()) {
  const [academic, sports, behavior, cultural] = await Promise.all([
    getAcademicPerformance(params),
    getSportsPerformance(params),
    getBehaviorPerformance(params),
    getCulturalPerformance(params),
  ]);
  return { academic, sports, behavior, cultural };
}
