/**
 * Session parameters read from localStorage with environment defaults
 * Called at API call time (not module load), ensuring fresh values
 */

const DEFAULTS = {
  schoolId: Number(import.meta.env.VITE_DEFAULT_SCHOOL_ID || 1),
  branchId: Number(import.meta.env.VITE_DEFAULT_BRANCH_ID || 1),
  academicYear: import.meta.env.VITE_DEFAULT_ACADEMIC_YEAR || '2025-26',
};

// Cached params - session params don't change during a page visit
// This ensures stable object reference for React Query keys
let _cachedParams = null;

/**
 * Returns session parameters from localStorage, with fallback to env defaults.
 * Returns a stable object reference (same object between renders) so React Query
 * doesn't treat the same params as a new query key on every render.
 * @returns {{ schoolId: number, branchId: number, academicYear: string }}
 */
export function getSessionParams() {
  const schoolId = Number(localStorage.getItem('schoolId')) || DEFAULTS.schoolId;
  const branchId = Number(localStorage.getItem('branchId')) || DEFAULTS.branchId;
  const academicYear = localStorage.getItem('academicYear') || DEFAULTS.academicYear;

  // Return cached object if values haven't changed
  if (
    _cachedParams &&
    _cachedParams.schoolId === schoolId &&
    _cachedParams.branchId === branchId &&
    _cachedParams.academicYear === academicYear
  ) {
    return _cachedParams;
  }

  _cachedParams = { schoolId, branchId, academicYear };
  return _cachedParams;
}
