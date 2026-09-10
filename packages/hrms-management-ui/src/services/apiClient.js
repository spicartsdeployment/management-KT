// =============================================================================
// apiClient.js — Shared axios clients for every Management microservice.
// -----------------------------------------------------------------------------
// One client per Django microservice. Each client:
//   • Has its own baseURL (per-service VITE_MGMT_*_API env var, falls back to
//     VITE_MGMT_API_BASE).
//   • Auto-attaches the JWT from localStorage on every request
//     (key = VITE_AUTH_TOKEN_KEY, default "edgiant_token").
//   • Unwraps the `{ success, data, error }` envelope so callers receive
//     just `data` on success, or a thrown Error on failure.
//
// Default localhost mapping (matches backend/Management/<service>/manage.py):
//
//   service           default URL                      Django URL prefix
//   ─────────────────────────────────────────────────────────────────────
//   dashboard         http://localhost:8001            /dashboard/
//   fees              http://localhost:8002            /fees/
//   transport         http://localhost:8003            /transport/
//   grievances        http://localhost:8004            /grievances/
//   announcements     http://localhost:8005            /announcements/
//   events            http://localhost:8006            /events/
//   policies          http://localhost:8007            /policies/
//   staff             http://localhost:8008            /staff/
//
// Auth (Students/Auth service)               http://localhost:8000
//   POST  /authentication/auth/login/        body: { email, password }
//   GET   /authentication/auth/verify/       header: Authorization: Bearer ...
//
// All other URLs are documented in src/services/Pages/<x>Service.js.
// =============================================================================

import axios from "axios";

const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || "edgiant_token";
const FALLBACK  = import.meta.env.VITE_MGMT_API_BASE  || "http://localhost:8000";

// Per-service base URLs. The defaults below match the localhost mapping above
// so the app works with `npm run dev` against locally-running services.
const SERVICE_URLS = {
    dashboard:     import.meta.env.VITE_MGMT_DASHBOARD_API     || "http://localhost:8001",
    fees:          import.meta.env.VITE_MGMT_FEES_API          || "http://localhost:8002",
    transport:     import.meta.env.VITE_MGMT_TRANSPORT_API     || "http://localhost:8003",
    grievances:    import.meta.env.VITE_MGMT_GRIEVANCES_API    || "http://localhost:8004",
    announcements: import.meta.env.VITE_MGMT_ANNOUNCEMENTS_API || "http://localhost:8005",
    events:        import.meta.env.VITE_MGMT_EVENTS_API        || "http://localhost:8006",
    policies:      import.meta.env.VITE_MGMT_POLICIES_API      || "http://localhost:8007",
    staff:         import.meta.env.VITE_MGMT_STAFF_API         || "http://localhost:8008",
};

// Tenant context — sent as schoolId / branchId / academicYear query params.
// Pages can override via the `ctx` argument on any service function.
export const tenantDefaults = () => ({
    schoolId:     Number(import.meta.env.VITE_DEFAULT_SCHOOL_ID || 1),
    branchId:     Number(import.meta.env.VITE_DEFAULT_BRANCH_ID || 1),
    academicYear: import.meta.env.VITE_DEFAULT_ACADEMIC_YEAR    || "2025-26",
});

// Lazy-built, memoised. One axios instance per service.
const clients = {};

function buildClient(service) {
    const baseURL = SERVICE_URLS[service] || FALLBACK;

    const instance = axios.create({
        baseURL,
        timeout: 20_000,
        headers: { "Content-Type": "application/json" },
    });

    // ---- request: attach JWT --------------------------------------------------
    instance.interceptors.request.use((config) => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch {
            // localStorage can throw in some sandboxed iframes — ignore silently
        }
        return config;
    });

    // ---- response: unwrap { success, data, error } ----------------------------
    instance.interceptors.response.use(
        (resp) => {
            const body = resp.data;
            if (body && typeof body === "object" && "success" in body) {
                if (body.success) return body.data;
                const err = new Error(body.error || "Request failed");
                err.payload = body;
                err.status  = resp.status;
                throw err;
            }
            return body;
        },
        (error) => {
            // Normalise axios errors so pages get a single shape:
            //   Error { message, status, payload }
            const status = error.response?.status;
            const payload = error.response?.data;
            const msg =
                payload?.error ||
                (status === 401 ? "Session expired — please sign in again." :
                 status === 403 ? "You don't have permission to view this." :
                 status === 404 ? "Resource not found." :
                 status >= 500  ? "Server error — please try again." :
                 error.message  || "Network error");
            const wrapped = new Error(msg);
            wrapped.status  = status;
            wrapped.payload = payload;
            throw wrapped;
        }
    );

    return instance;
}

/** Get a service's axios client (lazy-built and memoised). */
export function client(service) {
    if (!SERVICE_URLS[service]) {
        throw new Error(
            `Unknown management service: "${service}". ` +
            `Known services: ${Object.keys(SERVICE_URLS).join(", ")}`
        );
    }
    if (!clients[service]) {
        clients[service] = buildClient(service);
    }
    return clients[service];
}

/** Strip undefined / null / empty-string params before serialising. */
export function cleanParams(params = {}) {
    const out = {};
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") out[k] = v;
    }
    return out;
}

/** localStorage key the JWT is stored under. */
export const TOKEN_STORAGE_KEY = TOKEN_KEY;

/** For tests / dev tools that want to inspect the resolved config. */
export const __DEBUG_SERVICE_URLS = SERVICE_URLS;
