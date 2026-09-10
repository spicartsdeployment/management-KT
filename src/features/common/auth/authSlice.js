import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('role') || null, // 'parent', 'student', 'teacher', 'admin'
  userId: localStorage.getItem('userId') ? String(localStorage.getItem('userId')) : null,
  department: localStorage.getItem('department') || null,
  schoolId: Number(localStorage.getItem('schoolId')) || null,
  branchId: Number(localStorage.getItem('branchId')) || null,
  classId: Number(localStorage.getItem('classId')) || null,
  studentId: Number(localStorage.getItem('studentId')) || null,
  refId: Number(localStorage.getItem('refId')) || null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken, role, userId, refId, department, schoolId, branchId, classId, studentId } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken ?? state.refreshToken
      state.role = role
      state.userId = userId != null ? String(userId) : null
      state.department = department
      state.isAuthenticated = true
      state.error = null

      if (schoolId != null)  { state.schoolId = schoolId;   localStorage.setItem('schoolId', schoolId) }
      if (branchId != null)  { state.branchId = branchId;   localStorage.setItem('branchId', branchId) }
      if (classId != null)   { state.classId = classId;     localStorage.setItem('classId', classId) }
      if (studentId != null) { state.studentId = studentId; localStorage.setItem('studentId', studentId) }
      if (refId != null)     { state.refId = refId;         localStorage.setItem('refId', refId) }

      // Persist to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      if (userId != null) localStorage.setItem('userId', String(userId))
      localStorage.setItem('department', department || '')
      localStorage.setItem('user', JSON.stringify(user))
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
    },

    // Silently swap the access token (called by 401 refresh interceptor)
    setAccessToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      state.userId = null
      state.department = null
      state.schoolId = null
      state.branchId = null
      state.classId = null
      state.studentId = null
      state.refId = null
      state.isAuthenticated = false
      state.error = null
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      localStorage.removeItem('department')
      localStorage.removeItem('user')
      localStorage.removeItem('schoolId')
      localStorage.removeItem('branchId')
      localStorage.removeItem('classId')
      localStorage.removeItem('studentId')
      localStorage.removeItem('refId')
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const {
  setCredentials,
  setAccessToken,
  logout,
  setLoading,
  setError,
  clearError,
  updateProfile,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentRole = (state) => state.auth.role
export const selectCurrentUserId = (state) => state.auth.userId
export const selectCurrentDepartment = (state) => state.auth.department
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectSchoolId = (state) => state.auth.schoolId
export const selectBranchId = (state) => state.auth.branchId
export const selectClassId = (state) => state.auth.classId
export const selectStudentId = (state) => state.auth.studentId
export const selectRefId = (state) => state.auth.refId
export const selectSessionParams = (state) => ({
  schoolId: state.auth.schoolId,
  branchId: state.auth.branchId,
  classId: state.auth.classId,
  studentId: state.auth.studentId,
})