import { createQueryHook } from "../lib/createQueryHook";
import { getSessionParams } from "../config/sessionParams";
import { getLeavePolicies } from "./policies.api";

export const useLeavePoliciesQuery = createQueryHook(
    ["policies", "leave"],
    getLeavePolicies
);

export function prefetchLeavePolicies(queryClient, params = getSessionParams()) {
    return queryClient.prefetchQuery({
        queryKey: ["policies", "leave", params, {}],
        queryFn: () => getLeavePolicies(params),
        staleTime: 5 * 60 * 1000,
    });
}
