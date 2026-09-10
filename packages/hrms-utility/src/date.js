/**
 * Date and Time Utilities
 * Helper functions for date/time formatting and calculations
 */

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string}
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to compare
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
};

/**
 * Check if date is today
 * @param {Date|string|number} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export default {
  formatDate,
  getRelativeTime,
  isToday
};
