import { createApiClient } from '@school-hrms/utility';

export const API_BASE_URL =
  import.meta.env.VITE_API_TEACHER_SERVER ||
  import.meta.env.VITE_API_DEV ||
  '';

export const API_ENDPOINTS = {
  // Teacher endpoints
  TEACHER_PROFILE: '/api/teacher/profile',
  CLASSES: '/api/teacher/classes',
  STUDENTS: '/api/teacher/students',
  ASSIGNMENTS: '/api/teacher/assignments',
  EXAMS: '/api/teacher/exams',
  ATTENDANCE: '/api/teacher/attendance',
  RESOURCES: '/api/teacher/resources',
  MEETINGS: '/api/teacher/meetings',
  EVALUATIONS: '/api/teacher/evaluations',
  ANNOUNCEMENTS: '/api/teacher/announcements',
  LEAVE: '/api/teacher/leave',
  GRIEVANCES: '/api/teacher/grievances',
  SPORTS: '/api/teacher/sports',
  COMMUNICATION: '/api/teacher/communication',
};

const _client = createApiClient([API_BASE_URL]);

export const ApiService = {
  async get(endpoint) {
    return _client.get(endpoint);
  },
  async post(endpoint, data) {
    return _client.post(endpoint, data);
  },
  async put(endpoint, data) {
    return _client.put(endpoint, data);
  },
  async delete(endpoint) {
    return _client.delete(endpoint);
  },
};

