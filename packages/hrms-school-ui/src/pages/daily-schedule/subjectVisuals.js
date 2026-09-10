/**
 * subjectVisuals.js
 * =================
 * Centralized subject → visual asset mapping for the Daily Schedule feature.
 * Single source of truth for all banner images and card background colors.
 *
 * Used by:
 *  - normalizeTimetable() in DailySchedule.jsx (subject period cards)
 *  - NoClassCard.jsx (free/empty period fallback visuals)
 *
 * Fallback priority for period cards: API value → subject map → deterministic fallback
 */

/**
 * Canonical subject name → { image URL, background color } map.
 * Only one entry per canonical subject name (aliases handled separately).
 */
const SUBJECT_VISUAL_MAP = {
  'Mathematics':        { image: 'https://images.unsplash.com/photo-1739858446889-b20d63614d73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(100, 170, 200, 0.08)' },
  'English Literature': { image: 'https://images.unsplash.com/photo-1637185612724-294227baaa49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(170, 170, 160, 0.08)' },
  'Physics':            { image: 'https://images.unsplash.com/photo-1759092912891-9f52486bb059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(20,  40,  40,  0.08)' },
  'Chemistry':          { image: 'https://images.unsplash.com/photo-1724860755552-55f1c46f763d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(0,   10,  10,  0.08)' },
  'Computer Science':   { image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(80,  70,  70,  0.08)' },
  'History':            { image: 'https://images.unsplash.com/photo-1681566715515-42b2aa04a0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(100, 170, 200, 0.08)' },
  'Art & Design':       { image: 'https://images.unsplash.com/photo-1725819242793-e83d3e08d439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(170, 170, 160, 0.08)' },
  'PE':                 { image: 'https://images.unsplash.com/photo-1704830081428-2db85de99d6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080', color: 'rgba(20,  40,  40,  0.08)' },
  'Biology':            { image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop',                                                   color: 'rgba(0,   10,  10,  0.08)' },
  'Geography':          { image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=200&fit=crop',                                                   color: 'rgba(80,  70,  70,  0.08)' },
  'Music':              { image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=200&fit=crop',                                                   color: 'rgba(100, 80,  160, 0.08)' },
  'Drama':              { image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=200&fit=crop',                                                   color: 'rgba(160, 80,  100, 0.08)' },
};

/**
 * Subject alias → canonical key in SUBJECT_VISUAL_MAP.
 * Handles abbreviations and alternate names the API might return.
 */
const SUBJECT_ALIASES = {
  'Math':    'Mathematics',
  'English': 'English Literature',
  'CS':      'Computer Science',
  'Art':     'Art & Design',
  'Science': 'Biology',
};

/**
 * Resolves a subject name (including aliases) to its visual assets.
 * @param {string} subjectName - Subject name from the API or UI
 * @returns {{ image: string, color: string } | null}
 */
export function getSubjectVisuals(subjectName) {
  if (!subjectName) return null;
  const canonical = SUBJECT_ALIASES[subjectName] || subjectName;
  return SUBJECT_VISUAL_MAP[canonical] || null;
}

/**
 * Deduplicated visual pool — one entry per unique banner image.
 * Used as the fallback pool for free/empty period slots.
 * Ordered for deterministic stride-based selection.
 */
const ALL_VISUALS = Object.values(
  Object.values(SUBJECT_VISUAL_MAP).reduce((acc, v) => {
    acc[v.image] = v;
    return acc;
  }, {})
);

/**
 * Returns a deterministic visual fallback for a free/empty period slot.
 *
 * Uses a stride-7 spread over the 12-entry visual pool so that consecutive
 * period numbers always resolve to visually distinct image/color pairs.
 * With 12 unique entries and 8 periods, all 8 periods map to different visuals.
 * Stable across re-renders — pure function, no Math.random().
 *
 * @param {number} periodNumber - 1-based period number (1–8)
 * @returns {{ image: string, color: string }}
 */
export function getFallbackVisual(periodNumber) {
  const idx = ((Math.max(1, periodNumber || 1) - 1) * 7) % ALL_VISUALS.length;
  return ALL_VISUALS[idx];
}
