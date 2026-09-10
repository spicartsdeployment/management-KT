// =============================================================================
// PageState — tiny inline placeholders for loading + error states used across
// every page that fetches from the Management API.
// =============================================================================

import { AlertCircle, Loader2 } from "lucide-react";

export const LoadingState = ({ label = "Loading…" }) => (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {label}
    </div>
);

export const ErrorState = ({ error, onRetry, label = "Failed to load." }) => (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="flex items-center gap-2 text-sm text-[#EF4444]">
            <AlertCircle className="w-4 h-4" />
            {label}
        </div>
        {error?.message && (
            <p className="text-xs text-muted-foreground max-w-md text-center">
                {error.message}
            </p>
        )}
        {onRetry && (
            <button
                onClick={onRetry}
                className="text-xs px-3 py-1.5 rounded-md bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20"
            >
                Retry
            </button>
        )}
    </div>
);

export const EmptyState = ({ label = "No data to display." }) => (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        {label}
    </div>
);
