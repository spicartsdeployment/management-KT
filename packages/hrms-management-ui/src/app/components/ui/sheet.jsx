"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";
import "../../../Assets/styles/Sheet.scss";

function Sheet(props) {
    return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props) {
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props) {
    return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal(props) {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
    return (
        <SheetPrimitive.Overlay
            data-slot="sheet-overlay"
            className={cn("sheet__overlay", className)}
            {...props}
        />
    );
}

function SheetContent({ className, children, side = "right", ...props }) {
    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                data-slot="sheet-content"
                className={cn(
                    "sheet__content",
                    side === "right" && "sheet__content--right",
                    side === "left" && "sheet__content--left",
                    side === "top" && "sheet__content--top",
                    side === "bottom" && "sheet__content--bottom",
                    className,
                )}
                {...props}
            >
                {children}
                <SheetPrimitive.Close className="sheet__close-button">
                    <XIcon className="sheet__close-icon" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
            </SheetPrimitive.Content>
        </SheetPortal>
    );
}

function SheetHeader({ className, ...props }) {
    return (
        <div
            data-slot="sheet-header"
            className={cn("sheet__header", className)}
            {...props}
        />
    );
}

function SheetFooter({ className, ...props }) {
    return (
        <div
            data-slot="sheet-footer"
            className={cn("sheet__footer", className)}
            {...props}
        />
    );
}

function SheetTitle({ className, ...props }) {
    return (
        <SheetPrimitive.Title
            data-slot="sheet-title"
            className={cn("sheet__title", className)}
            {...props}
        />
    );
}

function SheetDescription({ className, ...props }) {
    return (
        <SheetPrimitive.Description
            data-slot="sheet-description"
            className={cn("sheet__description", className)}
            {...props}
        />
    );
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
};