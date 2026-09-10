import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getDirectory, getSummary, getContacts } from "./staff.api";

export const useStaffDirectoryQuery = createQueryHook(
    ["staff", "directory"],
    getDirectory
);

export const useStaffSummaryQuery = createQueryHook(
    ["staff", "summary"],
    getSummary
);

export const useStaffContactsQuery = createQueryHook(
    ["staff", "contacts"],
    getContacts
);

export function prefetchStaff(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["staff", "directory", params, {}],
        queryFn: () => getDirectory(params),
        staleTime: 5 * 60 * 1000,
    });
}
