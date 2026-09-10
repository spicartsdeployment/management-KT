import { useSelector, useDispatch } from 'react-redux'
import { 
  selectCurrentUser, 
  selectCurrentToken, 
  selectCurrentRole, 
  selectCurrentUserId,
  selectCurrentDepartment,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  logout as logoutAction
} from '../features/common/auth/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const role = useSelector(selectCurrentRole)
  const userId = useSelector(selectCurrentUserId)
  const department = useSelector(selectCurrentDepartment)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const logout = () => {
    dispatch(logoutAction())
  }

  // Determine staff type from role (userId may be numeric from API)
  const isTeachingStaff = role === 'teacher'
  const isNonTeachingStaff = role === 'staff'

  return {
    user,
    token,
    role,
    userId,
    department,
    isAuthenticated,
    isLoading,
    error,
    logout,
    // Helper methods
    isParent: role === 'parent',
    isStudent: role === 'student',
    isTeacher: role === 'teacher',
    isAdmin: role === 'admin',
    isTeachingStaff,
    isNonTeachingStaff,
  }
}