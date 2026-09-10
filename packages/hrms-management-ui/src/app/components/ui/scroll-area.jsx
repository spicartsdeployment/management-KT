"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import "./../../Assets/styles/ScrollArea.scss";

function ScrollArea({ className, children, ...props }) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            className={["scroll-area", className].filter(Boolean).join(" ")}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                className="scroll-area__viewport"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({ className, orientation = "vertical", ...props }) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={[
                "scroll-area__scrollbar",
                orientation === "vertical" && "scroll-area__scrollbar--vertical",
                orientation === "horizontal" && "scroll-area__scrollbar--horizontal",
                className,
            ].filter(Boolean).join(" ")}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="scroll-area__thumb"
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}

export { ScrollArea, ScrollBar };