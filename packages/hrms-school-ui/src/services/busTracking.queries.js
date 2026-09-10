import { getBusInfo } from './busTracking.api';
import { createQueryHook } from '../lib/createQueryHook';

export const useBusInfoQuery = createQueryHook(
  ['bus', 'info'],
  getBusInfo,
  { staleTime: 2 * 60 * 1000 }
);
