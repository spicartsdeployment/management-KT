import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("fees");

export const getOverviewSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/fees/overview/summary/", {
        params: cleanParams({ academicYear: t.academicYear }),
    });
};

export const getOverviewTable = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/fees/overview/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            classId: filters.classId,
            status: filters.status,
            q: filters.q,
        }),
    });
};

export const getDueSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/fees/due/summary/", {
        params: cleanParams({ academicYear: t.academicYear }),
    });
};

export const getDueTable = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/fees/due/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            overdueOnly: filters.overdueOnly ? "1" : undefined,
        }),
    });
};

export const getTermTracking = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/fees/term-tracking/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            classId: filters.classId,
        }),
    });
};
