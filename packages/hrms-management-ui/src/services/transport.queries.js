import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import {
    getAssignments,
    getBuses,
    getRoutes,
    getDrivers,
    getRouteStops,
    getLiveTracking,
    getAnalytics,
    getFleetOverview,
    getTodaySummary,
} from "./transport.api";

export const useTransportAssignmentsQuery = createQueryHook(
    ["transport", "assignments"],
    getAssignments
);

export const useTransportBusesQuery = createQueryHook(
    ["transport", "buses"],
    getBuses
);

export const useTransportRoutesQuery = createQueryHook(
    ["transport", "routes"],
    getRoutes
);

export const useTransportDriversQuery = createQueryHook(
    ["transport", "drivers"],
    getDrivers
);

export const useTransportRouteStopsQuery = createQueryHook(
    ["transport", "route_stops"],
    getRouteStops,
    { enabled: false }
);

export const useTransportLiveTrackingQuery = createQueryHook(
    ["transport", "live_tracking"],
    getLiveTracking,
    { staleTime: 1 * 60 * 1000 }
);

export const useTransportAnalyticsQuery = createQueryHook(
    ["transport", "analytics"],
    getAnalytics
);

export const useTransportFleetOverviewQuery = createQueryHook(
    ["transport", "fleet_overview"],
    getFleetOverview
);

export const useTransportTodaySummaryQuery = createQueryHook(
    ["transport", "today_summary"],
    getTodaySummary
);

export function prefetchTransport(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["transport", "assignments", params, {}],
        queryFn: () => getAssignments(params),
        staleTime: 5 * 60 * 1000,
    });
}
