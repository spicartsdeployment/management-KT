"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { cn } from "./utils";
import "../../../Assets/styles/Toggle.scss";

const toggleVariants = cva("toggle", {
    variants: {
        variant: {
            default: "toggle--default",
            outline: "toggle--outline",
        },
        size: {
            default: "toggle--size-default",
            sm: "toggle--size-sm",
            lg: "toggle--size-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

function Toggle({ className, variant, size, ...props }) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };