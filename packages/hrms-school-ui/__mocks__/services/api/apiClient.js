/**
 * Jest mock for services/api/apiClient.js
 * Avoids import.meta syntax which jest/babel-jest cannot parse in CJS mode.
 */
const axios = require('axios');

const _clientCache = new Map();

function _getClient(baseURL) {
  if (_clientCache.has(baseURL)) return _clientCache.get(baseURL);
  const client = axios.create({ baseURL, timeout: 120000 });
  _clientCache.set(baseURL, client);
  return client;
}

async function _withFallback(servers, fn) {
  const urls = Array.isArray(servers) ? servers : [servers];
  for (const url of urls) {
    try {
      return await fn(_getClient(url));
    } catch (err) {
      if (url === urls[urls.length - 1]) throw err;
    }
  }
}

function _makeClient(servers) {
  return {
    get:    (path, config)        => _withFallback(servers, (c) => c.get(path, config)),
    post:   (path, data, config)  => _withFallback(servers, (c) => c.post(path, data, config)),
    put:    (path, data, config)  => _withFallback(servers, (c) => c.put(path, data, config)),
    patch:  (path, data, config)  => _withFallback(servers, (c) => c.patch(path, data, config)),
    delete: (path, config)        => _withFallback(servers, (c) => c.delete(path, config)),
  };
}

function isNetworkFailure(err) {
  return (
    err.code === 'ECONNABORTED' ||
    err.code === 'ERR_NETWORK' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'ETIMEDOUT' ||
    (err.request && !err.response)
  );
}

function classifyError(err) {
  return {
    type: err.response ? 'HTTP_ERROR' : 'NETWORK_ERROR',
    message: err.message,
    code: err.code || err.response?.status,
    status: err.response?.status,
  };
}

function guardResponse(data, expectedFields = []) {
  if (data === null || data === undefined) {
    throw new Error('Empty response from server');
  }
  if (typeof data !== 'object') {
    throw new Error('Invalid response structure: expected object, got ' + typeof data);
  }
  if (data.success === false) {
    throw new Error(data.error || 'API error');
  }
  if (expectedFields.length > 0) {
    const missing = expectedFields.filter((f) => !(f in data));
    if (missing.length > 0) {
      console.warn('Missing response fields:', missing.join(', '));
    }
  }
  return data;
}

const apiClient = _makeClient(['http://localhost:3000']);

module.exports = {
  createClient: _makeClient,
  guardResponse,
  isNetworkFailure,
  classifyError,
  default: apiClient,
};
