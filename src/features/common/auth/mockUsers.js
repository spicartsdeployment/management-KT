// Mock user credentials for development/demo login
// In production, authentication would use a real backend
export const MOCK_USERS = [
  {
    userId: 'TEACH-MATH-001',
    userName: 'Rahul Sharma',
    email: 'rahul.sharma@school.edu',
    password: 'teacher123',
    role: 'teacher',
    department: 'Mathematics'
  },
  {
    userId: 'STAFF-SPORTS-001',
    userName: 'Priya Kumar',
    email: 'priya.kumar@school.edu',
    password: 'sports123',
    role: 'teacher',
    department: 'Sports & Physical Education'
  },
  {
    userId: 'PAR-001',
    userName: 'John Doe',
    email: 'demo@school.com',
    password: 'demo123',
    role: 'parent',
    department: null
  },
  {
    userId: 'STU-001',
    userName: 'Alex Johnson',
    email: 'student@school.com',
    password: 'student123',
    role: 'student',
    department: null
  },
  {
    userId: 'MGMT-ADMIN-001',
    userName: 'Admin User',
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'management',
    department: 'Administration'
  },
  {
    userId: 'MGMT-PRIN-001',
    userName: 'Principal',
    email: 'principal@school.edu',
    password: 'principal123',
    role: 'management',
    department: 'Administration'
  }
]
