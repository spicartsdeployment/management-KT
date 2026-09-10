import { cn } from "./utils";

function Skeleton({ className = "", ...props }) {
    return (
        <div
            data-slot="skeleton"
            className={`skeleton ${className}`}
            {...props}
        />
    );
}

export { Skeleton };