import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getSummary, getList } from "./announcements.api";

export const useAnnouncementsSummaryQuery = createQueryHook(
    ["announcements", "summary"],
    getSummary
);

export const useAnnouncementsListQuery = createQueryHook(
    ["announcements", "list"],
    getList
);

export function prefetchAnnouncements(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["announcements", "summary", params],
        queryFn: () => getSummary(params),
        staleTime: 5 * 60 * 1000,
    });
}
