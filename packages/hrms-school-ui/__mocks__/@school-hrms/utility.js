/**
 * Manual Jest mock for @school-hrms/utility
 * Prevents the real axios-based createApiClient from running during tests.
 */

const createApiClient = jest.fn(() => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
}));

const isNetworkFailure = jest.fn(() => false);

module.exports = { createApiClient, isNetworkFailure };
