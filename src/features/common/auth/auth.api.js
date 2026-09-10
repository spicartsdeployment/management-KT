/**
 * Auth API — plain Axios instance with NO auth interceptors.
 * Must stay interceptor-free to prevent infinite refresh loops.
 */
import axios from 'axios';

// ── URL resolution ───────────────────────────────────────────────────────
// ONLY use VITE_API_AUTH_SERVER (dedicated auth container) or the hardcoded
// Azure fallback. General API servers (LOCAL/CLOUD/DEV) must NOT be used
// here — they point to different microservices and cause ERR_NAME_NOT_RESOLVED.
const ENV_AUTH = import.meta.env.VITE_API_AUTH_SERVER;

// Hardcoded Azure auth container — always used as final runtime fallback.
const AZURE_AUTH_URL = 'https://edgiantauthcontainerapp.orangeflower-ec7149d5.centralindia.azurecontainerapps.io/authentication';

const AUTH_BASE_URL = ENV_AUTH || AZURE_AUTH_URL;

if (import.meta.env.DEV) {
  console.group('[auth.api] URL Resolution');
  console.log('VITE_API_AUTH_SERVER     :', ENV_AUTH ?? '(not set — using hardcoded Azure fallback)');
  console.log('AZURE_AUTH_URL (fallback):', AZURE_AUTH_URL);
  console.log('Resolved AUTH_BASE_URL   :', AUTH_BASE_URL);
  console.log('Full login endpoint      :', AUTH_BASE_URL + '/auth/login/');
  console.groupEnd();
}

const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Fallback instance — always points to Azure, used when primary DNS fails.
const fallbackAxios = axios.create({
  baseURL: AZURE_AUTH_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Log in a user with email + password + role.
 * Includes automatic runtime fallback to AZURE_AUTH_URL if the primary URL
 * fails with a network/DNS error (ERR_NAME_NOT_RESOLVED etc.).
 * Does NOT fall back on 4xx/5xx — those are valid server responses.
 * @param {{ email: string, password: string, role: string }} credentials
 * @returns {Promise<object>} Login response data
 */
export async function loginUser({ email, password, role }) {
  const path = '/auth/login/';
  // Trim email to prevent whitespace from causing "Wrong Credentials".
  const sanitizedEmail = email?.trim();

  if (import.meta.env.DEV) {
    console.log('[auth.api] loginUser → URL:', AUTH_BASE_URL + path, '| email:', sanitizedEmail, '| role:', role);
  }

  try {
    const response = await authAxios.post(path, { email: sanitizedEmail, password, role });
    return response.data;
  } catch (primaryErr) {
    // Only fall back on network/DNS failures — NOT on 4xx/5xx (valid server responses).
    if (primaryErr.response) throw primaryErr;

    console.warn('[auth.api] Primary URL failed (network/DNS) —', primaryErr.message);
    console.warn('[auth.api] Retrying with Azure fallback:', AZURE_AUTH_URL + path);

    const response = await fallbackAxios.post(path, { email: sanitizedEmail, password, role });
    return response.data;
  }
}

/**
 * Exchange a refresh token for a new access token.
 * Expected response: { access }
 * @param {string} refreshToken
 * @returns {Promise<{ access: string }>}
 */
export async function refreshAccessToken(refreshToken) {
  const path = '/auth/token/refresh/';
  try {
    const response = await authAxios.post(path, { refresh: refreshToken });
    return response.data;
  } catch (err) {
    // Retry with Azure fallback on network/DNS failures only.
    if (err.response) throw err;
    const response = await fallbackAxios.post(path, { refresh: refreshToken });
    return response.data;
  }
}
