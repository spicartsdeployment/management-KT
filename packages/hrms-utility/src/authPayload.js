/**
 * Centralized auth payload helper — for use in API service functions
 * that cannot use React hooks (e.g. plain JS modules, service files).
 *
 * Values are written to localStorage by the Redux authSlice after a
 * successful login. All fields return null when the user is not logged in.
 *
 * Usage:
 *   import { getAuthPayload } from '@school-hrms/utility';
 *   const { schoolId, branchId, classId, studentId } = getAuthPayload();
 *   await api.post('/leave/apply', { ...getAuthPayload(), ...formData });
 */

/**
 * @typedef {Object} AuthPayload
 * @property {number|null} schoolId  - School ID of the logged-in user
 * @property {number|null} branchId  - Branch ID of the logged-in user
 * @property {number|null} classId   - Class ID (for student/parent roles)
 * @property {number|null} studentId - Student's user ID (mirrors userId for student role)
 * @property {string|null} userId    - Raw user ID string from auth
 * @property {number|null} refId     - Reference/secondary ID returned by the auth API
 * @property {string|null} role      - Normalised role string ('student', 'teacher', etc.)
 */

/**
 * Returns auth context fields from localStorage.
 * Never returns hardcoded fallback values — returns null for absent fields.
 *
 * @returns {AuthPayload}
 */
export function getAuthPayload() {
  return {
    schoolId:  Number(localStorage.getItem('schoolId'))  || null,
    branchId:  Number(localStorage.getItem('branchId'))  || null,
    classId:   Number(localStorage.getItem('classId'))   || null,
    studentId: Number(localStorage.getItem('studentId')) || null,
    userId:    localStorage.getItem('userId')            || null,
    refId:     Number(localStorage.getItem('refId'))     || null,
    role:      localStorage.getItem('role')              || null,
  };
}
