/**
 * Validation Utilities
 * Comprehensive input validation and sanitization helpers for School HRMS
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Alias for consistency
export const isValidEmail = validateEmail;

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^[+]?[91]?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

// Alias for consistency
export const isValidPhoneNumber = validatePhone;

/**
 * Password validation with detailed errors
 * @param {string} password - Password to validate
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @returns {boolean}
 */
export const isValidName = (name) => {
  if (!name || name.trim().length < 2) return false;
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name.trim());
};

/**
 * Student ID validation (Format: STU followed by 3-6 digits)
 * @param {string} studentId - Student ID to validate
 * @returns {boolean}
 */
export const isValidStudentId = (studentId) => {
  if (!studentId) return false;
  const studentIdRegex = /^STU\d{3,6}$/;
  return studentIdRegex.test(studentId);
};

/**
 * Roll number validation (1-4 digits)
 * @param {string} rollNumber - Roll number to validate
 * @returns {boolean}
 */
export const isValidRollNumber = (rollNumber) => {
  if (!rollNumber) return false;
  const rollNumberRegex = /^\d{1,4}$/;
  return rollNumberRegex.test(rollNumber);
};

/**
 * GPA validation
 * @param {number|string} gpa - GPA to validate
 * @param {number} maxGPA - Maximum GPA (default: 10)
 * @returns {boolean}
 */
export const isValidGPA = (gpa, maxGPA = 10) => {
  const numGPA = parseFloat(gpa);
  return !isNaN(numGPA) && numGPA >= 0 && numGPA <= maxGPA;
};

/**
 * Date validation
 * @param {string|Date} date - Date to validate
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Future date validation
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Past date validation
 * @param {string|Date} date - Date to check
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Age validation
 * @param {string|Date} birthDate - Birth date
 * @param {number} minAge - Minimum age (default: 3)
 * @param {number} maxAge - Maximum age (default: 25)
 * @returns {boolean}
 */
export const isValidAge = (birthDate, minAge = 3, maxAge = 25) => {
  if (!isValidDate(birthDate)) return false;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

/**
 * Fee amount validation
 * @param {number|string} amount - Fee amount
 * @returns {boolean}
 */
export const isValidFeeAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000000;
};

/**
 * File type validation
 * @param {File} file - File object
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file || !allowedTypes.length) return false;
  return allowedTypes.includes(file.type);
};

/**
 * File size validation
 * @param {File} file - File object
 * @param {number} maxSizeInMB - Maximum size in MB (default: 5)
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Class section validation (Single letter A-Z)
 * @param {string} section - Section to validate
 * @returns {boolean}
 */
export const isValidSection = (section) => {
  if (!section) return false;
  const sectionRegex = /^[A-Z]$/;
  return sectionRegex.test(section.toUpperCase());
};

/**
 * Class validation (Format: Grade 1-12 followed by optional section)
 * @param {string} className - Class name to validate
 * @returns {boolean}
 */
export const isValidClass = (className) => {
  if (!className) return false;
  const classRegex = /^(?:1[0-2]|[1-9])(-[A-Z])?$/;
  return classRegex.test(className);
};

/**
 * Attendance percentage validation
 * @param {number|string} percentage - Percentage to validate
 * @returns {boolean}
 */
export const isValidAttendancePercentage = (percentage) => {
  const numPercentage = parseFloat(percentage);
  return !isNaN(numPercentage) && numPercentage >= 0 && numPercentage <= 100;
};

/**
 * Subject code validation (3-6 uppercase letters/numbers)
 * @param {string} code - Subject code to validate
 * @returns {boolean}
 */
export const isValidSubjectCode = (code) => {
  if (!code) return false;
  const codeRegex = /^[A-Z0-9]{3,6}$/;
  return codeRegex.test(code.toUpperCase());
};

/**
 * Sanitize string input (remove HTML tags and trim)
 * @param {string} input - String to sanitize
 * @returns {string}
 */
export const sanitizeString = (input) => {
  if (!input) return '';
  return input.trim().replace(/<[^>]*>/g, '');
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate number within range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Form validation helper
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} {isValid: boolean, errors: Object}
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Required validation
    if (fieldRules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${fieldRules.label || field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value) return;
    
    // Type-specific validations
    if (fieldRules.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
    } else if (fieldRules.type === 'phone' && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
    } else if (fieldRules.type === 'name' && !isValidName(value)) {
      errors[field] = 'Please enter a valid name';
    } else if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
    } else if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must not exceed ${fieldRules.maxLength} characters`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  isValidEmail,
  validatePhone,
  isValidPhoneNumber,
  validatePassword,
  isValidName,
  isValidStudentId,
  isValidRollNumber,
  isValidGPA,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidAge,
  isValidFeeAmount,
  isValidFileType,
  isValidFileSize,
  isValidSection,
  isValidClass,
  isValidAttendancePercentage,
  isValidSubjectCode,
  sanitizeString,
  isRequired,
  isInRange,
  validateForm
};
