import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getSummary, getList, getDetail, getComments } from "./grievances.api";

export const useGrievancesSummaryQuery = createQueryHook(
    ["grievances", "summary"],
    getSummary
);

export const useGrievancesListQuery = createQueryHook(
    ["grievances", "list"],
    getList
);

export const useGrievanceDetailQuery = createQueryHook(
    ["grievances", "detail"],
    getDetail,
    { enabled: false }
);

export const useGrievanceCommentsQuery = createQueryHook(
    ["grievances", "comments"],
    getComments,
    { enabled: false }
);

export function prefetchGrievances(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["grievances", "summary", params],
        queryFn: () => getSummary(params),
        staleTime: 5 * 60 * 1000,
    });
}
