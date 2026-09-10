import {
  getAcademicPerformance,
  getSportsPerformance,
  getBehaviorPerformance,
  getCulturalPerformance,
  getAllPerformance,
} from './performance.api';
import { createQueryHook } from '../lib/createQueryHook';

export const useAcademicPerformanceQuery = createQueryHook(
  ['performance', 'academic'],
  getAcademicPerformance,
  { staleTime: 10 * 60 * 1000 }
);

export const useSportsPerformanceQuery = createQueryHook(
  ['performance', 'sports'],
  getSportsPerformance,
  { staleTime: 10 * 60 * 1000 }
);

export const useBehaviorPerformanceQuery = createQueryHook(
  ['performance', 'behavior'],
  getBehaviorPerformance,
  { staleTime: 10 * 60 * 1000 }
);

export const useCulturalPerformanceQuery = createQueryHook(
  ['performance', 'cultural'],
  getCulturalPerformance,
  { staleTime: 10 * 60 * 1000 }
);

export const usePerformanceDashboardQuery = createQueryHook(
  ['performance', 'dashboard'],
  getAllPerformance,
  { staleTime: 2 * 60 * 1000 }
);
