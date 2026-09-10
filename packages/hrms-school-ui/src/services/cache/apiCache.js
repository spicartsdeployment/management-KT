/**
 * API Caching Utility
 * Provides in-memory caching with TTL, deduplication of in-flight requests,
 * and cache invalidation helpers.
 */

/** Default TTL: 5 minutes in milliseconds */
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/** @type {Map<string, { data: *, timestamp: number }>} */
const cache = new Map();

/** @type {Map<string, Promise<*>>} */
const pending = new Map();

/**
 * Generates a deterministic cache key from an endpoint and params object.
 * Params are sorted alphabetically so key order doesn't matter.
 *
 * @param {string} endpoint - API endpoint or identifier
 * @param {Record<string, *>} [params] - Query parameters
 * @returns {string} Cache key
 */
export function generateCacheKey(endpoint, params) {
  if (!params || Object.keys(params).length === 0) {

    return endpoint;
  }
  const query = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return `${endpoint}:${query}`;
}

/**
 * Fetches data using the provided function and caches the result.
 * Deduplicates simultaneous requests for the same key.
 *
 * @param {string} key - Cache key
 * @param {() => Promise<*>} fetchFn - Function that performs the actual fetch
 * @param {{ ttl?: number, forceRefresh?: boolean }} [options]
 * @returns {Promise<*>} Resolved data
 */
export async function fetchWithCache(key, fetchFn, options = {}) {
  const { ttl = DEFAULT_CACHE_TTL, forceRefresh = false } = options;

  if (!forceRefresh) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
  }

  // Deduplicate in-flight requests
  if (!forceRefresh && pending.has(key)) {
    return pending.get(key);
  }

  const promise = fetchFn()
    .then((data) => {
      cache.set(key, { data, timestamp: Date.now() });
      pending.delete(key);
      return data;
    })
    .catch((err) => {
      pending.delete(key);
      throw err;
    });

  pending.set(key, promise);
  return promise;
}

/**
 * Removes a specific entry from the cache.
 *
 * @param {string} key - Cache key to invalidate
 * @returns {boolean} true if the entry existed and was removed, false otherwise
 */
export function invalidateCache(key) {
  return cache.delete(key);
}

/**
 * Removes all entries from the cache and clears pending requests map.
 */
export function clearAllCache() {
  cache.clear();
  pending.clear();
}

/**
 * Returns statistics about the current cache state.
 *
 * @returns {{ totalEntries: number, pendingRequests: number, entries: Array<{ key: string, age: number, ageString: string }> }}
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(cache.entries()).map(([key, { timestamp }]) => {
    const age = now - timestamp;
    const seconds = Math.floor(age / 1000);
    const ageString = seconds < 60 ? `${seconds}s ago` : `${Math.floor(seconds / 60)}m ago`;
    return { key, age, ageString };
  });

  return {
    totalEntries: cache.size,
    pendingRequests: pending.size,
    entries,
  };
}
