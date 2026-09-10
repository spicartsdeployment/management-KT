/**
 * Returns the active session params sourced from localStorage (written by
 * the login flow). Returns null for any value absent from localStorage —
 * never substitutes fake/hardcoded IDs.
 *
 * Because this function is called at API-call time (not at module-load time),
 * it always returns the most up-to-date values.
 *
 * @returns {{ schoolId: number|null, branchId: number|null, classId: number|null, studentId: number|null }}
 */
export function getSessionParams() {
  return {
    schoolId:  Number(localStorage.getItem('schoolId'))  || null,
    branchId:  Number(localStorage.getItem('branchId'))  || null,
    classId:   Number(localStorage.getItem('classId'))   || null,
    studentId: Number(localStorage.getItem('studentId')) || null,
  };
}
