/**
 * Grievance System Constants
 * Centralized configuration for form options and UI elements
 */

/**
 * Grievance categories - populated from API guidelines or fallback to standard categories
 * These are used in the form submission step 1
 */
export const GRIEVANCE_CATEGORIES = [
  'Academic',
  'Behavioral',
  'Safety',
  'Transportation',
  'Facilities',
  'Communication',
  'Discrimination',
  'Others'
];

/**
 * Priority levels - standard options for grievance severity
 * Used in form submission step 1
 */
export const GRIEVANCE_PRIORITIES = ['Low', 'Medium', 'High'];

/**
 * SVG icon paths for guideline cards
 * 4 icons for visual representation of different guideline types
 */
export const GUIDELINE_ICONS = [
  'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
];
