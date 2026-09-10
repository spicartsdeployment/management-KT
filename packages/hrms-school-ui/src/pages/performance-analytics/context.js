import React from 'react';

/**
 * Context for Performance Analytics state management
 */
export const PerformanceAnalyticsContext = React.createContext();

/**
 * Initial state for Performance Analytics
 */
export const initialState = {
  selectedYear: '2025',
  selectedSubject: 'Mathematics',
  selectedTerm: 'Mid-Term Examination 2024',
  selectedTab: 'academic',
  isDarkMode: false,
  isLoading: true,
  isSlowLoading: false,
  academicData: null,
  sportsData: null,
  behaviorData: null,
  culturalData: null,
};

/**
 * Reducer for Performance Analytics state management
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} - New state
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      return state;
  }
};
