/**
 * Tests for API Caching Utility
 * 
 * @jest-environment jsdom
 */

import {
  fetchWithCache,
  generateCacheKey,
  invalidateCache,
  clearAllCache,
  getCacheStats,
  DEFAULT_CACHE_TTL,
} from '../src/services/cache/apiCache';

describe('apiCache', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearAllCache();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('generateCacheKey', () => {
    it('should generate key without params', () => {
      const key = generateCacheKey('overview');
      expect(key).toBe('overview');
    });

    it('should generate key with params', () => {
      const key = generateCacheKey('overview', { studentId: 123, classId: 456 });
      expect(key).toBe('overview:classId=456&studentId=123');
    });

    it('should generate key with sorted params', () => {
      const key1 = generateCacheKey('test', { b: 2, a: 1 });
      const key2 = generateCacheKey('test', { a: 1, b: 2 });
      expect(key1).toBe(key2);
    });

    it('should handle empty params object', () => {
      const key = generateCacheKey('overview', {});
      expect(key).toBe('overview');
    });
  });

  describe('fetchWithCache', () => {
    it('should fetch and cache data on first call', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test-data' });
      
      const result = await fetchWithCache('test-key', fetchFn);
      
      expect(result).toEqual({ data: 'test-data' });
      expect(fetchFn).toHaveBeenCalledTimes(1);
      
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);
    });

    it('should return cached data on subsequent calls within TTL', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test-data' });
      
      const result1 = await fetchWithCache('test-key', fetchFn);
      const result2 = await fetchWithCache('test-key', fetchFn);
      
      expect(result1).toEqual(result2);
      expect(fetchFn).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should refetch when forceRefresh is true', async () => {
      const fetchFn = jest.fn()
        .mockResolvedValueOnce({ data: 'first' })
        .mockResolvedValueOnce({ data: 'second' });
      
      const result1 = await fetchWithCache('test-key', fetchFn);
      const result2 = await fetchWithCache('test-key', fetchFn, { forceRefresh: true });
      
      expect(result1).toEqual({ data: 'first' });
      expect(result2).toEqual({ data: 'second' });
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should handle fetch errors', async () => {
      const fetchFn = jest.fn().mockRejectedValue(new Error('Network error'));
      
      await expect(fetchWithCache('test-key', fetchFn)).rejects.toThrow('Network error');
      
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });

    it('should deduplicate simultaneous requests', async () => {
      let resolveCount = 0;
      const fetchFn = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolveCount++;
            resolve({ data: `result-${resolveCount}` });
          }, 100);
        });
      });
      
      // Start multiple requests simultaneously
      const promises = [
        fetchWithCache('test-key', fetchFn),
        fetchWithCache('test-key', fetchFn),
        fetchWithCache('test-key', fetchFn),
      ];
      
      const results = await Promise.all(promises);
      
      // All should return the same result
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);
      
      // Fetch function should only be called once
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('should use custom TTL', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test' });
      
      await fetchWithCache('test-key', fetchFn, { ttl: 1000 }); // 1 second TTL
      
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(1);
    });
  });

  describe('invalidateCache', () => {
    it('should invalidate specific cache entry', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test' });
      
      await fetchWithCache('test-key', fetchFn);
      
      const deleted = invalidateCache('test-key');
      expect(deleted).toBe(true);
      
      const stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });

    it('should return false for non-existent key', () => {
      const deleted = invalidateCache('non-existent');
      expect(deleted).toBe(false);
    });

    it('should refetch after invalidation', async () => {
      const fetchFn = jest.fn()
        .mockResolvedValueOnce({ data: 'first' })
        .mockResolvedValueOnce({ data: 'second' });
      
      await fetchWithCache('test-key', fetchFn);
      invalidateCache('test-key');
      const result = await fetchWithCache('test-key', fetchFn);
      
      expect(result).toEqual({ data: 'second' });
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearAllCache', () => {
    it('should clear all cache entries', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test' });
      
      await fetchWithCache('key1', fetchFn);
      await fetchWithCache('key2', fetchFn);
      await fetchWithCache('key3', fetchFn);
      
      let stats = getCacheStats();
      expect(stats.totalEntries).toBe(3);
      
      clearAllCache();
      
      stats = getCacheStats();
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return correct stats', async () => {
      const fetchFn = jest.fn().mockResolvedValue({ data: 'test' });
      
      await fetchWithCache('key1', fetchFn);
      await fetchWithCache('key2', fetchFn);
      
      const stats = getCacheStats();
      
      expect(stats.totalEntries).toBe(2);
      expect(stats.pendingRequests).toBe(0);
      expect(stats.entries).toHaveLength(2);
      expect(stats.entries[0]).toHaveProperty('key');
      expect(stats.entries[0]).toHaveProperty('age');
      expect(stats.entries[0]).toHaveProperty('ageString');
    });

    it('should show pending requests', async () => {
      const fetchFn = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => setTimeout(() => resolve({ data: 'test' }), 1000));
      });
      
      // Start request but don't await
      fetchWithCache('test-key', fetchFn);
      
      const stats = getCacheStats();
      expect(stats.pendingRequests).toBe(1);
    });
  });

  describe('DEFAULT_CACHE_TTL', () => {
    it('should be 5 minutes', () => {
      expect(DEFAULT_CACHE_TTL).toBe(5 * 60 * 1000);
    });
  });
});
