/**
 * Factory function to create standardized API functions
 * Eliminates duplication of tenant context handling across all .api.js files
 * 
 * Automatically:
 * - Merges tenantDefaults with provided context
 * - Includes specified tenant parameters (schoolId, branchId, academicYear)
 * - Cleans params before sending to API
 * 
 * Usage:
 * 
 * // Simple GET with tenant context
 * export const getKpi = createApiFunction(
 *   "dashboard",           // service name
 *   "/dashboard/kpi/"      // endpoint
 * );
 * 
 * // GET without academicYear
 * export const getPendingTasks = createApiFunction(
 *   "dashboard",
 *   "/dashboard/pending-tasks/",
 *   "get",
 *   ["schoolId", "branchId"]  // Only these params
 * );
 * 
 * // POST with body
 * export const createAnnouncement = createApiFunction(
 *   "announcements",
 *   "/announcements/",
 *   "post"
 * );
 */

import { client, cleanParams, tenantDefaults } from "../services/apiClient";

/**
 * Create an API function with automatic tenant context
 * @param {string} serviceName - Service name (passed to client())
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (get, post, put, delete, patch)
 * @param {array} paramFields - Which tenant fields to include in params (default: all)
 * @returns {function} - API function (ctx, ...args) => Promise
 */
export const createApiFunction = (
  serviceName,
  endpoint,
  method = "get",
  paramFields = ["schoolId", "branchId", "academicYear"]
) => {
  const api = client(serviceName);

  return (ctx = {}, ...args) => {
    // Merge defaults with provided context
    const t = { ...tenantDefaults(), ...ctx };

    // Build params object with only specified fields
    const params = {};
    paramFields.forEach(field => {
      if (field in t) {
        params[field] = t[field];
      }
    });

    // Call API with cleaned params
    const config = {
      params: cleanParams(params),
    };

    // For POST/PUT/PATCH, data comes from args[0]
    if (["post", "put", "patch"].includes(method.toLowerCase()) && args[0]) {
      return api[method](endpoint, args[0], config);
    }

    return api[method](endpoint, config);
  };
};

/**
 * Create a batch API function that calls multiple endpoints
 * Useful for aggregated data fetches
 * 
 * Usage:
 * export const getDashboardData = createBatchApiFunction([
 *   { fn: getKpi, name: "kpi" },
 *   { fn: getPendingTasks, name: "tasks" },
 * ]);
 */
export const createBatchApiFunction = (apiDefinitions) => {
  return async (ctx = {}) => {
    const results = {};

    const promises = apiDefinitions.map(async ({ fn, name }) => {
      try {
        const data = await fn(ctx);
        results[name] = data;
      } catch (error) {
        results[name] = null;
        console.error(`Error fetching ${name}:`, error);
      }
    });

    await Promise.all(promises);
    return results;
  };
};
