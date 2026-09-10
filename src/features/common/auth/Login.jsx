import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { setCredentials } from './authSlice'
import { loginUser } from './auth.api'
import { USER_ROLES, ROLE_PORTAL_LABELS } from '@school-hrms/utility'
import { Button, Input, Card } from '@school-hrms/common-components'

/**
 * Derives the user's role from the email prefix (before the first underscore).
 * This removes the need for manual role selection in the UI — the email itself
 * encodes the role, so users only need to enter their credentials.
 *
 * Examples:
 *   stu_10011@gmail.com  → student
 *   tch_120011@gmail.com → teacher
 *   mgt_102233@gmail.com → management
 *   adm_10220@gmail.com  → admin
 */
const getRoleFromEmail = (email) => {
  const prefix = email.split('_')[0]?.toLowerCase()

  switch (prefix) {
    case 'stu':
      return USER_ROLES.STUDENT
    case 'tch':
      return USER_ROLES.TEACHER
    case 'mgt':
      // Fix 4: Use the shared enum consistently instead of a raw string
      return USER_ROLES.MANAGEMENT
    case 'adm':
      return USER_ROLES.ADMIN
    default:
      return null
  }
}

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleClearSession = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // console.log('Login attempt with email:', formData.email)
    // console.log('Login attempt with password:', formData.password ? '******' : '(empty)')
    // console.log('Deriving role from email prefix...', formData.email
    //   ? getRoleFromEmail(formData.email) || 'Unrecognized prefix'
    //   : 'No email entered'
    // )

    // Derive role from email prefix before making any API call.
    // If the prefix is unrecognised, reject early with a helpful message.
    const role = getRoleFromEmail(formData.email)
    if (!role) {
      setError('Invalid email format. Email must start with stu_, tch_, mgt_, or adm_.')
      setIsLoading(false)
      return
    }

    try {
      // console.debug('[Login] Attempting login...', { email: formData.email, role });

      const data = await loginUser({ email: formData.email, password: formData.password, role });

      console.debug('[Login] Raw API response:', data);

      // All identity fields live inside data.user (not at the top level)
      const userObj = data.user ?? {};


      // Resolve the confirmed role from API response
      const confirmedRole = (userObj.roleName?.toLowerCase() ?? data.role ?? '').trim();

      // Fix 1: Removed obsolete role-tab validation block.
      // Previously this early-returned for Teacher/Management because activeTab
      // was always "student" after the tab UI was removed. Role is now fully
      // derived from the email prefix so no cross-tab check is needed.

      const user = {
        id: userObj.userId ?? userObj.id,
        name: userObj.name ?? data.userName,
        email: userObj.email ?? data.email,
        avatar: userObj.avatar ?? null,
        phone: userObj.phone ?? null,
        status: userObj.status ?? null,
        refId: userObj.refId ?? null,
      };

      console.debug('[Login] Resolved user object:', user);

      const credentials = {
        user,
        token: data.access,
        refreshToken: data.refresh,
        // Fix 2: Fall back to email-derived `role`, not the stale `activeTab`
        role: confirmedRole || role,
        userId: userObj.userId ?? userObj.id,
        refId: userObj.refId ?? null,
        department: userObj.department ?? data.department ?? null,
        schoolId: userObj.schoolId ?? data.schoolId ?? null,
        branchId: userObj.branchId ?? data.branchId ?? null,
        classId: userObj.classId ?? data.classId ?? null,
        studentId: userObj.userId ?? data.studentId ?? null,
      };

      // Fix 5: Debug logs before dispatch and navigation
      //      

      const roleRoutes = {
        [USER_ROLES.PARENT]: '/school/dashboard',
        [USER_ROLES.STUDENT]: '/school/dashboard',
        [USER_ROLES.TEACHER]: '/teacher/overview',
        [USER_ROLES.ADMIN]: '/teacher/overview',
        [USER_ROLES.MANAGEMENT]: '/management/dashboard',
      };

      // console.log('Redirect Route:', roleRoutes[credentials.role]);

      // console.debug('[Login] SUCCESS — role:', credentials.role, '| userId:', credentials.userId);

      dispatch(setCredentials(credentials));

      // Fix 3: Fall back to email-derived `role` instead of stale `activeTab`
      const from =
        location.state?.from?.pathname ||
        roleRoutes[credentials.role] ||
        roleRoutes[role] ||
        '/';

      console.debug('[Login] Redirecting to:', from);
      navigate(from, { replace: true });

    } catch (err) {
      console.error('[Login] API error:', err?.response?.status, err?.response?.data);

      const status = err?.response?.status;
      const errDetail = err?.response?.data?.detail ?? err?.response?.data?.message ?? '';

      // Backend may return a role-mismatch message explicitly
      if (errDetail && /wrong portal|wrong role|invalid portal|use.*portal/i.test(errDetail)) {
        setError(errDetail);
      } else if (status === 401 || status === 403) {
        setError(`Invalid credentials for the portal. Please check your email and password.`);
      } else if (status >= 500) {
        setError('Server error. Please try again later.');
      } else if (!err?.response) {
        setError('Unable to reach the server. Check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg dark:dark-starfield p-4">
      <div className="w-full max-w-md">
        <Card variant="glass" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-light-accent to-light-accent-hover rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
              Welcome Back
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Sign in to your School ERP account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form — role is inferred from email prefix; no role selector needed */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email (e.g. stu_10011@school.edu)"
              variant="glass"
              fullWidth
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              variant="glass"
              fullWidth
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!formData.email || !formData.password}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Clear Session Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleClearSession}
              className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
            >
              Clear Session & Reload
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
              © 2024 School ERP Dashboard. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login