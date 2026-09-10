"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

// import "./../../Assets/styles/Progress.scss";
import "../../../Assets/styles/Progress.scss";

function Progress({ className, value, ...props }) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={["progress", className].filter(Boolean).join(" ")}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="progress__indicator"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };