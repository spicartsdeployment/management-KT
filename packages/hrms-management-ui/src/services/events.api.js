import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("events");

export const getSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/events/summary/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getList = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/events/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            status: filters.status,
        }),
    });
};
