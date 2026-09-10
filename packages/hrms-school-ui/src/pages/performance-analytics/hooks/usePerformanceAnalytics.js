import { useReducer, useEffect } from 'react';
import { initialState, reducer } from '../context';
import { subjectData } from '../constants/performanceData';
import {
  useAcademicPerformanceQuery,
  useSportsPerformanceQuery,
  useBehaviorPerformanceQuery,
  useCulturalPerformanceQuery,
} from '../../../services/performance.queries';

/**
 * Custom hook for Performance Analytics logic
 * @returns {Object} - State, dispatch, and computed data
 */
export const usePerformanceAnalytics = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check dark mode on mount and listen for changes
  useEffect(() => {
    const checkDarkMode = () => {
      dispatch({ 
        type: 'UPDATE_STATE_FIELD', 
        field: 'isDarkMode', 
        value: document.documentElement.classList.contains('dark') 
      });
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // React Query hooks — parallel fetches, auto-cached
  const { data: academicData, isLoading: loadingAcademic } = useAcademicPerformanceQuery();
  const { data: sportsData, isLoading: loadingSports } = useSportsPerformanceQuery();
  const { data: behaviorData, isLoading: loadingBehavior } = useBehaviorPerformanceQuery();
  const { data: culturalData, isLoading: loadingCultural } = useCulturalPerformanceQuery();

  const isLoading = loadingAcademic || loadingSports || loadingBehavior || loadingCultural;
  const isSlowLoading = false;

  // Compute currentSubjectData based on selected subject
  const currentSubjectData = subjectData[state.selectedSubject] || Object.values(subjectData)[0];

  return {
    state: {
      ...state,
      isLoading,
      isSlowLoading,
      academicData,
      sportsData,
      behaviorData,
      culturalData,
    },
    dispatch,
    currentSubjectData,
  };
};
