/**
 * Bus Tracking State Reducer
 * Handles all state updates for bus tracking feature
 */

const busTrackingReducer = (state, action) => {
  switch (action.type) {
    /**
     * Update a single field in state
     * Usage: dispatch({ type: 'UPDATE_STATE_FIELD', field: 'selectedBusId', value: 'BUS001' })
     */
    case 'UPDATE_STATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };

    /**
     * Update a nested field (level 2)
     * Usage: dispatch({ type: 'UPDATE_STATE_FIELD_LV_2', parent: 'filters', field: 'status', value: 'active' })
     */
    case 'UPDATE_STATE_FIELD_LV_2':
      return {
        ...state,
        [action.parent]: {
          ...state[action.parent],
          [action.field]: action.value
        }
      };

    /**
     * Update bus locations from socket
     * Usage: dispatch({ type: 'UPDATE_BUS_LOCATIONS', payload: busesArray })
     */
    case 'UPDATE_BUS_LOCATIONS':
      return {
        ...state,
        buses: action.payload,
        lastUpdated: new Date().toISOString()
      };

    /**
     * Set selected bus
     * Usage: dispatch({ type: 'SELECT_BUS', payload: busId })
     */
    case 'SELECT_BUS':
      return {
        ...state,
        selectedBusId: action.payload
      };

    /**
     * Toggle emergency mode
     * Usage: dispatch({ type: 'TOGGLE_EMERGENCY' })
     */
    case 'TOGGLE_EMERGENCY':
      return {
        ...state,
        emergencyMode: !state.emergencyMode
      };

    /**
     * Add alert
     * Usage: dispatch({ type: 'ADD_ALERT', payload: alertObject })
     */
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts]
      };

    /**
     * Clear alerts
     * Usage: dispatch({ type: 'CLEAR_ALERTS' })
     */
    case 'CLEAR_ALERTS':
      return {
        ...state,
        alerts: []
      };

    /**
     * Set loading state
     * Usage: dispatch({ type: 'SET_LOADING', payload: true })
     */
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    /**
     * Set error
     * Usage: dispatch({ type: 'SET_ERROR', payload: 'Error message' })
     */
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    /**
     * Reset state to initial
     * Usage: dispatch({ type: 'RESET_STATE' })
     */
    case 'RESET_STATE':
      return action.payload;

    default:
      console.warn(`Unknown action type: ${action.type}`);
      return state;
  }
};

export default busTrackingReducer;
