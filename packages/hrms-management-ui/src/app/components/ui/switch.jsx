"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import "../../../Assets/styles/Switch.scss";

function Switch({ className = "", ...props }) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={`switch ${className}`}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="switch__thumb"
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };