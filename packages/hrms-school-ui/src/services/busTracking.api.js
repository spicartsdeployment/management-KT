import { createApiClient } from '@school-hrms/utility';
import { BUS_TRACKING_SERVERS } from '../config/env';
import { getSessionParams } from '../config/sessionParams';

const apiClient = createApiClient(BUS_TRACKING_SERVERS);

// Fetch full bus info (status, driver, schedule, analytics)
export async function getBusInfo(params = getSessionParams()) {
  const response = await apiClient.get(
    `/bus/info?schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch live bus location
export async function getBusLocation(params = { ...getSessionParams(), busNumber: 'KA01-1001' }) {
  const response = await apiClient.get(
    `/bus-location?bus=${params.busNumber}&schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch bus route information
export async function getBusRoute(params = { ...getSessionParams(), busNumber: 'KA01-1001' }) {
  const response = await apiClient.get(
    `/bus-route?bus=${params.busNumber}&schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Fetch driver information
export async function getDriverInfo(params = { ...getSessionParams(), busNumber: 'KA01-1001' }) {
  const response = await apiClient.get(
    `/bus-driver?bus=${params.busNumber}&schoolId=${params.schoolId}&branchId=${params.branchId}&studentId=${params.studentId}`
  );
  return response.data;
}

// Send emergency SOS alert
export async function postEmergencySOS(busNumber, location) {
  const response = await apiClient.post('/emergency-sos', {
    bus: busNumber,
    location,
    timestamp: Date.now(),
  });
  return response.data;
}
