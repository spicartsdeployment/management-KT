/**
 * Centralized environment configuration.
 *
 * All API and WebSocket server lists are defined here.
 * The fallback clients (apiClient, socketClient) consume these arrays and
 * try each URL in order — local → Edgiant → dev — until one succeeds.
 *
 * To change server addresses, update the corresponding VITE_ variables in .env
 * and restart the dev server. No other files need to change.
 */

/**
 * Ordered list of HTTP/REST API base URLs.
 * Undefined entries (unset env vars) are automatically filtered out by the clients.
 * @type {string[]}
 */
export const API_SERVERS = [
  import.meta.env.VITE_API_LOCAL_SERVER, // 1️⃣ Local network server (primary)
  import.meta.env.VITE_API_DEV,          // 2️⃣ Localhost dev server (fallback)
].filter(Boolean);

/**
 * Ordered list of WebSocket base URLs.
 * @type {string[]}
 */
export const SOCKET_SERVERS = [
  import.meta.env.VITE_WS_LOCAL,   // 1️⃣ Local network WebSocket
  import.meta.env.VITE_WS_SERVER,  // 2️⃣ Edgiant WebSocket server
  import.meta.env.VITE_WS_DEV,     // 3️⃣ Localhost WebSocket
].filter(Boolean);
