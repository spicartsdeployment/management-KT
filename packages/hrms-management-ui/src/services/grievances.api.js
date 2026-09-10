import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("grievances");

export const getSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/grievances/summary/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
        }),
    });
};

export const getList = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/grievances/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            status: filters.status,
            priority: filters.priority,
        }),
    });
};

export const getDetail = (grievanceId) =>
    api.get(`/grievances/${grievanceId}/`);

export const getComments = (grievanceId) =>
    api.get(`/grievances/${grievanceId}/comments/`);
