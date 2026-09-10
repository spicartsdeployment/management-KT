/**
 * WebSocket client with automatic server fallback.
 *
 * Usage:
 *   import { getWorkingSocketUrl, createSocket } from '@/services/socket/socketClient';
 *
 *   // Just get the URL (e.g. to pass to useSocket):
 *   const url = await getWorkingSocketUrl('/ws/bus-tracking/');
 *
 *   // Or get a ready WebSocket instance:
 *   const ws = await createSocket('/ws/bus-tracking/');
 *   ws.onmessage = (e) => console.log(e.data);
 *
 * Probes each SOCKET_SERVERS entry in order (local → cloud → dev) and returns
 * the first one that successfully opens a connection within the probe timeout.
 */

import { SOCKET_SERVERS } from '@/config/env';

/** Milliseconds to wait for a WebSocket handshake before trying the next server. */
const PROBE_TIMEOUT_MS = 3000;

/**
 * Builds a full WebSocket URL from a base and a path.
 * @param {string} base   e.g. "ws://192.168.1.10:8000/ws"
 * @param {string} path   e.g. "/bus-tracking/" or "bus-tracking/"
 * @returns {string}
 */
function buildWsUrl(base, path) {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Probes a single WebSocket URL.
 * Resolves with the URL string on successful open, rejects on error or timeout.
 * @param {string} url
 * @returns {Promise<string>}
 */
function probeSocket(url) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ws.close();
      reject(new Error(`WebSocket probe timed out: ${url}`));
    }, PROBE_TIMEOUT_MS);

    const ws = new WebSocket(url);

    ws.addEventListener('open', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      ws.close(); // probe only — caller opens the real connection
      resolve(url);
    });

    ws.addEventListener('error', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(`WebSocket connection failed: ${url}`));
    });
  });
}

/**
 * Returns the first reachable WebSocket URL for `path`, trying each server in
 * SOCKET_SERVERS order (local → cloud → dev).
 *
 * @param {string} [path='/']  Socket path, e.g. "/ws/bus-tracking/"
 * @returns {Promise<string>}  The full WebSocket URL that connected
 * @throws {Error}             If no server is reachable
 */
async function getWorkingSocketUrl(path = '/') {
  let lastError = new Error('No WebSocket servers configured');

  for (const base of SOCKET_SERVERS) {
    const url = buildWsUrl(base, path);
    try {
      return await probeSocket(url);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`All WebSocket servers unreachable. Last error: ${lastError.message}`);
}

/**
 * Opens a WebSocket connection to the first reachable server for `path`.
 *
 * @param {string} [path='/']   Socket path, e.g. "/ws/bus-tracking/"
 * @param {string[]} [protocols]  Optional WebSocket sub-protocols
 * @returns {Promise<WebSocket>}
 */
async function createSocket(path = '/', protocols) {
  const url = await getWorkingSocketUrl(path);
  return protocols ? new WebSocket(url, protocols) : new WebSocket(url);
}

export { getWorkingSocketUrl, createSocket };
