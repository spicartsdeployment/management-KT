// Array utilities
export const uniqueBy = (array, key) => {
  const seen = new Set()
  return array.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const value = typeof key === 'function' ? key(item) : item[key]
    groups[value] = groups[value] || []
    groups[value].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key]
    const bValue = typeof key === 'function' ? key(b) : b[key]
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === '' || value === null || value === undefined) return true
      
      const itemValue = item[key]
      
      if (typeof value === 'string') {
        return itemValue?.toString().toLowerCase().includes(value.toLowerCase())
      }
      
      if (Array.isArray(value)) {
        return value.includes(itemValue)
      }
      
      return itemValue === value
    })
  })
}

// Object utilities
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = (obj, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}

export const isEmpty = (value) => {
  if (value == null) return true
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// String utilities
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const randomNum = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}${randomNum}`
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const searchInText = (text, query) => {
  if (!text || !query) return false
  return text.toLowerCase().includes(query.toLowerCase())
}

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error)
    return false
  }
}

export const clearStorage = () => {
  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

// URL utilities
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value)
    }
  })
  return url.toString()
}

export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

// Number utilities
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

export const round = (value, decimals = 0) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

// Date utilities
export const getDateRange = (days = 7) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  return { start, end }
}

export const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Performance utilities
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const generateAvatarColor = (name) => {
  const colors = [
    '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}