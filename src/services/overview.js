import api from './api';

/**
 * Fetch student overview data
 * @param {Object} params - { schoolId, branchId, classId, studentId }
 * @returns {Promise<Object>} Overview API response
 */
export const fetchStudentOverview = async (params) => {
  const { schoolId, branchId, classId, studentId } = params;
  const response = await api.get(
    'https://edgiantoverviewcontainerapp.orangeflower-ec7149d5.centralindia.azurecontainerapps.io/std_overview/overview',
    {
      params: { schoolId, branchId, classId, studentId },
    }
  );
  return response.data;
};
