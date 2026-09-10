/**
 * Factory function to create standard feature reducers
 * Eliminates duplication of common reducer logic across all feature folders
 * 
 * All reducers share: SET_LOADING, SET_ERROR, SET_FILTERS, UPDATE_STATE_FIELD
 * Features only need to implement their specific cases
 * 
 * Usage:
 * const customHandler = (state, action) => {
 *   switch(action.type) {
 *     case "SET_DATA": return { ...state, data: action.payload };
 *     default: return null; // Let base reducer handle
 *   }
 * };
 * export const myReducer = createReducer(customHandler);
 */
export const createReducer = (featureSpecificHandler = null) => {
  return (state, action) => {
    switch (action.type) {
      // ===== Common cases all reducers share =====
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "SET_FILTERS":
        return { ...state, filters: { ...state.filters, ...action.payload } };
      case "UPDATE_STATE_FIELD":
        return { ...state, [action.field]: action.value };
      
      // ===== Feature-specific cases =====
      default:
        if (featureSpecificHandler) {
          const result = featureSpecificHandler(state, action);
          if (result !== null && result !== undefined) {
            return result;
          }
        }
        return state;
    }
  };
};

/**
 * Create initial state with common fields
 * Pass feature-specific state as parameter
 * 
 * Usage:
 * export const initialState = createInitialState({
 *   data: [],
 *   summary: {},
 *   createForm: { ... }
 * });
 */
export const createInitialState = (featureState = {}) => ({
  isLoading: false,
  error: null,
  filters: {},
  ...featureState,
});
