// Teacher-domain specific utilities
// Generic utilities (debounce, throttle, groupBy, sortBy, etc.) are available
// from @school-hrms/utility

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Staff type detection based on userId prefix
 */
export const isTeachingStaff = (userId) => {
  return userId?.startsWith('TEACH-') || false;
};

export const isNonTeachingStaff = (userId) => {
  return userId?.startsWith('STAFF-') || false;
};

export const getStaffLabel = (userId) => {
  if (isTeachingStaff(userId)) return 'Teaching Staff';
  if (isNonTeachingStaff(userId)) return 'Non-Teaching Staff';
  return 'Staff';
};
