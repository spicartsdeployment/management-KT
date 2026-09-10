import axios from 'axios';

const REQUEST_TIMEOUT_MS = 120000;

const _instanceCache = new Map();

// ─── Refresh token state ────────────────────────────────────────────────────
// Callbacks provided by the app shell via configureAuthRefresh()
let _refreshConfig = null;

// Prevent multiple concurrent refresh calls
let _isRefreshing = false;

// Requests that arrived while a refresh was in-flight
let _failedQueue = [];

/**
 * Resolve or reject all queued requests with the new token (or an error).
 * @param {string|null} token  - new access token on success, null on failure
 * @param {Error|null}  error  - error on failure, null on success
 */
function _flushQueue(token, error) {
  _failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  _failedQueue = [];
}

/**
 * Configure the refresh-token callback used by the 401 interceptor.
 * Call this once at app startup (e.g., inside App.jsx).
 *
 * @param {object} config
 * @param {() => Promise<string>} config.getRefreshToken
 *   Async function that reads the refresh token, calls your refresh endpoint,
 *   persists the new access token, and returns it.
 * @param {(newToken: string) => void} [config.onTokenRefreshed]
 *   Optional callback called after a successful silent refresh (e.g., to
 *   sync Redux state if needed beyond what getRefreshToken already does).
 * @param {() => void} config.onAuthFailure
 *   Called when the refresh itself fails — clear auth state + redirect here.
 */
export function configureAuthRefresh({ getRefreshToken, onTokenRefreshed, onAuthFailure }) {
  _refreshConfig = { getRefreshToken, onTokenRefreshed, onAuthFailure };
}

// ─── Instance factory ───────────────────────────────────────────────────────

// Returns (or creates) a cached axios instance for a given base URL
function _getInstance(baseURL) {
  if (_instanceCache.has(baseURL)) return _instanceCache.get(baseURL);

  const instance = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

  // ── Request interceptor: attach access token ─────────────────────────────
  instance.interceptors.request.use(
    (config) => {
      const token =
        typeof localStorage !== 'undefined' && localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
        config.headers['Content-Type'] =
          config.headers['Content-Type'] || 'application/json';
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response interceptor: handle 401 with silent token refresh ───────────
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only intercept 401s that haven't been retried yet and when refresh
      // is configured (not on auth endpoints themselves).
      if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        !_refreshConfig
      ) {
        return Promise.reject(error);
      }

      // Mark so we don't retry endlessly
      originalRequest._retry = true;

      if (_isRefreshing) {
        // Another request already kicked off a refresh — queue this one
        return new Promise((resolve, reject) => {
          _failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        });
      }

      // We are the first 401 — start the refresh
      _isRefreshing = true;
      try {
        const newToken = await _refreshConfig.getRefreshToken();
        _refreshConfig.onTokenRefreshed?.(newToken);
        _flushQueue(newToken, null);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        _flushQueue(null, refreshError);
        _refreshConfig.onAuthFailure?.();
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }
  );

  _instanceCache.set(baseURL, instance);
  return instance;
}

// Returns true for network-level errors that should trigger server fallback
export function isNetworkFailure(err) {
  return (
    err.code === 'ECONNABORTED' ||
    err.code === 'ERR_NETWORK' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'ETIMEDOUT' ||
    (!!err.request && !err.response)
  );
}

// Tries each server URL in order; falls back only on network-level failures
async function _withFallback(servers, fn) {
  let lastError;
  for (let i = 0; i < servers.length; i++) {
    try {
      return await fn(_getInstance(servers[i]));
    } catch (err) {
      lastError = err;
      if (isNetworkFailure(err) && i < servers.length - 1) continue;
      throw err;
    }
  }
  throw lastError ?? new Error('No API servers configured');
}

// Creates an axios-compatible client that falls back across the given server URLs
export function createApiClient(servers) {
  const list = Array.isArray(servers) ? servers : [servers];
  return {
    get:    (path, config)        => _withFallback(list, (c) => c.get(path, config)),
    post:   (path, data, config)  => _withFallback(list, (c) => c.post(path, data, config)),
    put:    (path, data, config)  => _withFallback(list, (c) => c.put(path, data, config)),
    patch:  (path, data, config)  => _withFallback(list, (c) => c.patch(path, data, config)),
    delete: (path, config)        => _withFallback(list, (c) => c.delete(path, config)),
  };
}
