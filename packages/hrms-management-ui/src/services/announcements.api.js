import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("announcements");

export const getSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/announcements/summary/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
        }),
    });
};

export const getList = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/announcements/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            status: filters.status,
            q: filters.q,
        }),
    });
};
