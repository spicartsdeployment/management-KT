/**
 * Factory to create feature reducers with standard state fields
 * 
 * USAGE EXAMPLE:
 * 
 * // Old way (40+ lines per feature):
 * const initialState = {
 *   data: null,
 *   loading: false,
 *   error: null,
 *   filters: {},
 *   // custom fields...
 * };
 * 
 * function busTrackingReducer(state, action) {
 *   switch (action.type) {
 *     case 'SET_LOADING':
 *       return { ...state, loading: true, error: null };
 *     case 'SET_ERROR':
 *       return { ...state, loading: false, error: action.payload };
 *     case 'SET_DATA':
 *       return { ...state, loading: false, data: action.payload };
 *     case 'UPDATE_LOCATION':
 *       return { ...state, currentLocation: action.payload };
 *     // ... more boilerplate
 *   }
 * }
 * 
 * // New way (3-5 lines per feature):
 * const { reducer: busTrackingReducer, initialState } = createReducer({
 *   featureName: 'busTracking',
 *   initialFeatureState: { currentLocation: null, routes: [] },
 *   handlers: {
 *     UPDATE_LOCATION: (state, action) => ({ ...state, currentLocation: action.payload }),
 *   }
 * });
 */

/**
 * Create a reducer with automatic handling of common state fields
 * Automatically handles: SET_LOADING, SET_ERROR, UPDATE_STATE_FIELD, SET_FILTERS
 * 
 * @param {object} config - Configuration object
 * @param {string} config.featureName - Name of feature (for debugging)
 * @param {object} config.initialFeatureState - Custom initial state fields
 * @param {object} config.handlers - Custom action handlers (optional)
 * 
 * @returns {object} { reducer, initialState }
 * 
 * @example
 * const { reducer, initialState } = createReducer({
 *   featureName: 'busTracking',
 *   initialFeatureState: {
 *     currentLocation: null,
 *     routes: [],
 *     eta: null,
 *   },
 *   handlers: {
 *     UPDATE_LOCATION: (state, action) => ({
 *       ...state,
 *       currentLocation: action.payload,
 *     }),
 *     SET_ETA: (state, action) => ({
 *       ...state,
 *       eta: action.payload,
 *     }),
 *   },
 * });
 */
export function createReducer({
  featureName = 'feature',
  initialFeatureState = {},
  handlers = {},
} = {}) {
  // Standard initial state for all features
  const initialState = {
    isLoading: false,
    error: null,
    filters: {},
    ...initialFeatureState,
  };

  // Standard action handlers
  const standardHandlers = {
    SET_LOADING: (state) => ({ ...state, isLoading: true, error: null }),
    SET_ERROR: (state, action) => ({ ...state, isLoading: false, error: action.payload }),
    SET_FILTERS: (state, action) => ({ ...state, filters: action.payload }),
    UPDATE_STATE_FIELD: (state, action) => ({
      ...state,
      [action.payload.field]: action.payload.value,
    }),
  };

  // Merge standard handlers with custom handlers (custom can override)
  const allHandlers = { ...standardHandlers, ...handlers };

  // Reducer function
  const reducer = (state, action) => {
    const handler = allHandlers[action.type];
    if (!handler) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[${featureName}] Unknown action type: ${action.type}`);
      }
      return state;
    }
    return handler(state, action);
  };

  return { reducer, initialState };
}

/**
 * Helper to get initial state without reducer
 * Useful if you need initialState separately from reducer
 * 
 * @param {object} initialFeatureState - Custom initial state fields
 * @returns {object} Complete initial state with standard fields
 * 
 * @example
 * const initialState = createInitialState({
 *   busData: null,
 *   routes: [],
 * });
 */
export function createInitialState(initialFeatureState = {}) {
  return {
    isLoading: false,
    error: null,
    filters: {},
    ...initialFeatureState,
  };
}
