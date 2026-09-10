import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/common/auth/authSlice'
import schoolReducer from '../../packages/hrms-school-ui/src/schoolSlice'
import busReducer from '../../packages/hrms-school-ui/src/slices/busSlice'
import managementAppReducer from '../../packages/hrms-management-ui/src/store/appSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    bus: busReducer,
    managementApp: managementAppReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
})

export const RootState = store.getState
export const AppDispatch = store.dispatch