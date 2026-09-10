import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import {
    getOverviewSummary,
    getOverviewTable,
    getDueSummary,
    getDueTable,
    getTermTracking,
} from "./fees.api";

export const useFeeOverviewSummaryQuery = createQueryHook(
    ["fees", "overview_summary"],
    getOverviewSummary
);

export const useFeeOverviewTableQuery = createQueryHook(
    ["fees", "overview_table"],
    getOverviewTable
);

export const useFeeDueSummaryQuery = createQueryHook(
    ["fees", "due_summary"],
    getDueSummary
);

export const useFeeDueTableQuery = createQueryHook(
    ["fees", "due_table"],
    getDueTable
);

export const useFeeTermTrackingQuery = createQueryHook(
    ["fees", "term_tracking"],
    getTermTracking
);

export function prefetchFeeOverview(queryClient, params = getSessionParams(), filters = {}) {
    return queryClient.prefetchQuery({
        queryKey: ["fees", "overview_summary", params],
        queryFn: () => getOverviewSummary(params),
        staleTime: 5 * 60 * 1000,
    });
}
