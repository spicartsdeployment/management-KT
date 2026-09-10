// Date and time formatting utilities
// Note: Uses native Intl API instead of date-fns to avoid conflicts

export const formatDateDisplay = (date, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(dateObj);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDateDisplay(dateObj);
};

// Number formatting utilities
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return `${currency}0`
  return `${currency}${amount.toLocaleString('en-IN')}`
}

export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%'
  return `${value.toFixed(decimals)}%`
}

export const formatGPA = (gpa, maxGPA = 10) => {
  if (typeof gpa !== 'number') return '0.0'
  return `${gpa.toFixed(1)}/${maxGPA}`
}

// Text formatting utilities  
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return ''
  if (!lastName) return firstName
  if (!firstName) return lastName
  return `${firstName} ${lastName}`
}

// Grade formatting utilities
export const getGradeColor = (grade) => {
  const gradeColors = {
    'A+': 'text-green-600 dark:text-green-400',
    'A': 'text-green-500 dark:text-green-300', 
    'B+': 'text-blue-600 dark:text-blue-400',
    'B': 'text-blue-500 dark:text-blue-300',
    'C+': 'text-yellow-600 dark:text-yellow-400',
    'C': 'text-yellow-500 dark:text-yellow-300',
    'D': 'text-orange-600 dark:text-orange-400',
    'F': 'text-red-600 dark:text-red-400'
  }
  return gradeColors[grade] || 'text-gray-600 dark:text-gray-400'
}

export const formatAttendance = (present, total) => {
  if (!total || total === 0) return '0%'
  const percentage = (present / total) * 100
  return `${percentage.toFixed(1)}%`
}

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Format Indian phone numbers
  if (cleaned.length === 10) {
    return `+91-${cleaned.substring(0, 5)}-${cleaned.substring(5)}`
  }
  
  return phoneNumber
}