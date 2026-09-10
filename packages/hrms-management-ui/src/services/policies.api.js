import { client, cleanParams, tenantDefaults } from "./apiClient";

const api = client("policies");

export const getLeavePolicies = (ctx = {}, filters = {}) => {
    const t = { ...tenantDefaults(), ...ctx };
    return api.get("/policies/leave/", {
        params: cleanParams({
            schoolId: t.schoolId,
            branchId: t.branchId,
            academicYear: t.academicYear,
            role: filters.role,
        }),
    });
};
