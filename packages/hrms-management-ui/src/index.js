/**
 * ERP Management Package
 * Main export file for @school-hrms/erp-management
 */

// Export factories for use in other packages
export { createReducer, createInitialState } from './utils/createReducer';
export { createQueryHook, createPrefetchFunction } from './lib/createQueryHook';
export { useFeatureState } from './hooks/useFeatureState';

// Export hooks
export { useAuth } from './hooks/useAuth';
export { useSocket } from './hooks/useSocket';
export { useTheme } from './hooks/useTheme';

// Export store
export { store } from './store';

// Export config
export { getSessionParams } from './config/sessionParams';

// Export queries and APIs for each feature
export * from './services/index';
