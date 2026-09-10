# HRMS Utility Package

Shared utilities and helper functions for School HRMS micro-frontends.

## 📦 Utilities Included

### Host Integration (`host.js`)
- `getAuthToken()` - Get current auth token
- `hasPermission(permission)` - Check user permissions
- `getCurrentUser()` - Get logged-in user
- `navigate(path)` - Navigate to routes
- `logout()` - Logout user

### Validation (`validation.js`)
- `validateEmail(email)` - Email validation
- `validatePhone(phone)` - Phone validation
- `sanitizeString(input)` - String sanitization
- `isRequired(value)` - Required field check
- `isInRange(value, min, max)` - Number range validation

### Date/Time (`date.js`)
- `formatDate(date, format)` - Format dates
- `getRelativeTime(date)` - Relative time (e.g., "2 hours ago")
- `isToday(date)` - Check if date is today

## 🚀 Usage

```javascript
import { 
  getAuthToken, 
  hasPermission, 
  validateEmail,
  formatDate 
} from '@school-hrms/utility';

// Check permissions
if (hasPermission('view_students')) {
  // Show content
}

// Validate email
if (validateEmail(email)) {
  // Process
}

// Format date
const formatted = formatDate(new Date(), 'long');
```

## 📝 Development

```bash
# Build
yarn build

# Watch mode
yarn watch

# Run tests
yarn test

# Lint
yarn lint
```

## 📚 License

MIT
