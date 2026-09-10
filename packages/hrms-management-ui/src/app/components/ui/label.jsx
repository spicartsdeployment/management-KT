"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "../../../Assets/styles/label.scss";
// import "@/Assets/styles/base/label.scss";

const Label = React.forwardRef(
    ({ className = "", disabled, ...props }, ref) => {
        return (
            <LabelPrimitive.Root
                ref={ref}
                className={`label ${disabled ? "label--disabled" : ""} ${className}`}
                {...props}
            />
        );
    }
);

Label.displayName = "Label";

export { Label };