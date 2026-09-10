import React from 'react';

export const Context = React.createContext();

export const initialState = {
  selectedBus: null,
  buses: [],
  currentStatus: null,
  driverInfo: null,
  supportStaff: [],
  transportIncharge: null,
  emergencyContact: null,
  dailyPerformance: null,
  safetyAlerts: [],
  weeklyAnalytics: null,
  routeSchedule: [],
  liveTracking: null,
  isLoading: false,
  error: null,
  notificationSent: false,
  // Live tracking fields
  busLocation: null,
  prevBusLocation: null,
  distance: null,
  eta: null,
  statusMessage: '',
  busStatus: 'moving',
  pickupLocation: null
};

/**
 * Bus Tracking State Reducer
 * Handles all state updates for the bus tracking feature
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };

    case 'UPDATE_STATE_FIELD_LV_2':
      return {
        ...state,
        [action.parent]: {
          ...state[action.parent],
          [action.field]: action.value
        }
      };

    case 'SET_BUSES':
      return {
        ...state,
        buses: action.value
      };

    case 'UPDATE_BUS':
      return {
        ...state,
        buses: state.buses.map(bus =>
          bus.id === action.value.id ? { ...bus, ...action.value } : bus
        )
      };

    case 'SET_SELECTED_BUS':
      return {
        ...state,
        selectedBus: action.value
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.value
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.value,
        isLoading: false
      };

    case 'INIT_DATA':
      return {
        ...state,
        currentStatus: action.payload.currentStatus,
        driverInfo: action.payload.driverInfo,
        supportStaff: action.payload.supportStaff,
        transportIncharge: action.payload.transportIncharge,
        emergencyContact: action.payload.emergencyContact,
        dailyPerformance: action.payload.dailyPerformance,
        safetyAlerts: action.payload.safetyAlerts,
        weeklyAnalytics: action.payload.weeklyAnalytics,
        routeSchedule: action.payload.routeSchedule,
        liveTracking: action.payload.liveTracking,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};
