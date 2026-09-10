import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getSummary, getList } from "./events.api";

export const useEventsSummaryQuery = createQueryHook(
    ["events", "summary"],
    getSummary
);

export const useEventsListQuery = createQueryHook(
    ["events", "list"],
    getList
);

export function prefetchEvents(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["events", "summary", params],
        queryFn: () => getSummary(params),
        staleTime: 5 * 60 * 1000,
    });
}
