import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("transport");

// ---------- READS -----------------------------------------------------------

export const getAssignments = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/assignments/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            isActive: filters.isActive,
        }),
    });
};

export const getBuses = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/buses/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getRoutes = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/routes/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getDrivers = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/drivers/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            status: filters.status,
        }),
    });
};

export const getRouteStops = (routeId) =>
    api.get("/transport/route-stops/", { params: cleanParams({ routeId }) });

export const getLiveTracking = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/tracking/live/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getAnalytics = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/tracking/analytics/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getFleetOverview = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/fleet/overview/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getTodaySummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/transport/today-summary/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

// ---------- WRITES ----------------------------------------------------------

export const createBus = (body) => api.post("/transport/buses/create/", body);
export const updateBus = (busId, body) => api.put(`/transport/buses/${busId}/`, body);
export const deleteBus = (busId) => api.delete(`/transport/buses/${busId}/delete/`);

export const createRoute = (body) => api.post("/transport/routes/create/", body);
export const updateRoute = (routeId, body) => api.put(`/transport/routes/${routeId}/`, body);
export const deleteRoute = (routeId) => api.delete(`/transport/routes/${routeId}/delete/`);

export const createRouteStop = (body) => api.post("/transport/route-stops/create/", body);
export const updateRouteStop = (stopId, body) => api.put(`/transport/route-stops/${stopId}/`, body);
export const deleteRouteStop = (stopId) => api.delete(`/transport/route-stops/${stopId}/delete/`);

export const createAssignment = (body) => api.post("/transport/assignments/create/", body);
export const updateAssignment = (mappingId, body) => api.put(`/transport/assignments/${mappingId}/`, body);
export const deleteAssignment = (mappingId, { hard = false } = {}) =>
    api.delete(`/transport/assignments/${mappingId}/delete/`, {
        params: cleanParams({ hard: hard ? "1" : undefined }),
    });
