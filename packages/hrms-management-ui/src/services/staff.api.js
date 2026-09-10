import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("staff");

export const getDirectory = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/staff/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            role: filters.role,
            status: filters.status,
        }),
    });
};

export const getSummary = (ctx = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/staff/summary/", {
        params: cleanParams({ schoolId: t.schoolId, branchId: t.branchId }),
    });
};

export const getContacts = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/staff/contacts/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            role: filters.role,
        }),
    });
};
