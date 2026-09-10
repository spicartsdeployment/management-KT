import { getAlumniDirectory, getAlumniEvents, getAlumniMentorship } from './alumni.api';
import { createQueryHook } from '../lib/createQueryHook';

export const useAlumniDirectoryQuery = createQueryHook(
  ['alumni', 'directory'],
  getAlumniDirectory,
  { staleTime: 5 * 60 * 1000 }
);

export const useAlumniEventsQuery = createQueryHook(
  ['alumni', 'events'],
  getAlumniEvents,
  { staleTime: 5 * 60 * 1000 }
);

export const useAlumniMentorshipQuery = createQueryHook(
  ['alumni', 'mentorship'],
  getAlumniMentorship,
  { staleTime: 5 * 60 * 1000 }
);
