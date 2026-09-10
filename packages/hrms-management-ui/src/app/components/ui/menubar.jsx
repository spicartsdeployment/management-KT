"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import "./../../Assets/styles/Menubar.scss";

function Menubar({ className, ...props }) {
    return (
        <MenubarPrimitive.Root
            data-slot="menubar"
            className={["menubar", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarMenu({ ...props }) {
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({ ...props }) {
    return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({ ...props }) {
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({ ...props }) {
    return (
        <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
    );
}

function MenubarTrigger({ className, ...props }) {
    return (
        <MenubarPrimitive.Trigger
            data-slot="menubar-trigger"
            className={["menubar__trigger", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarContent({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }) {
    return (
        <MenubarPortal>
            <MenubarPrimitive.Content
                data-slot="menubar-content"
                align={align}
                alignOffset={alignOffset}
                sideOffset={sideOffset}
                className={["menubar__content", className].filter(Boolean).join(" ")}
                {...props}
            />
        </MenubarPortal>
    );
}

function MenubarItem({ className, inset, variant = "default", ...props }) {
    return (
        <MenubarPrimitive.Item
            data-slot="menubar-item"
            data-inset={inset}
            data-variant={variant}
            className={["menubar__item", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarCheckboxItem({ className, children, checked, ...props }) {
    return (
        <MenubarPrimitive.CheckboxItem
            data-slot="menubar-checkbox-item"
            className={["menubar__checkbox-item", className].filter(Boolean).join(" ")}
            checked={checked}
            {...props}
        >
            <span className="menubar__item-indicator">
                <MenubarPrimitive.ItemIndicator>
                    <CheckIcon className="menubar__icon" />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.CheckboxItem>
    );
}

function MenubarRadioItem({ className, children, ...props }) {
    return (
        <MenubarPrimitive.RadioItem
            data-slot="menubar-radio-item"
            className={["menubar__radio-item", className].filter(Boolean).join(" ")}
            {...props}
        >
            <span className="menubar__item-indicator">
                <MenubarPrimitive.ItemIndicator>
                    <CircleIcon className="menubar__icon menubar__icon--radio" />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.RadioItem>
    );
}

function MenubarLabel({ className, inset, ...props }) {
    return (
        <MenubarPrimitive.Label
            data-slot="menubar-label"
            data-inset={inset}
            className={["menubar__label", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarSeparator({ className, ...props }) {
    return (
        <MenubarPrimitive.Separator
            data-slot="menubar-separator"
            className={["menubar__separator", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarShortcut({ className, ...props }) {
    return (
        <span
            data-slot="menubar-shortcut"
            className={["menubar__shortcut", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function MenubarSub({ ...props }) {
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({ className, inset, children, ...props }) {
    return (
        <MenubarPrimitive.SubTrigger
            data-slot="menubar-sub-trigger"
            data-inset={inset}
            className={["menubar__sub-trigger", className].filter(Boolean).join(" ")}
            {...props}
        >
            {children}
            <ChevronRightIcon className="menubar__sub-trigger-icon" />
        </MenubarPrimitive.SubTrigger>
    );
}

function MenubarSubContent({ className, ...props }) {
    return (
        <MenubarPrimitive.SubContent
            data-slot="menubar-sub-content"
            className={["menubar__sub-content", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

export {
    Menubar,
    MenubarPortal,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarGroup,
    MenubarSeparator,
    MenubarLabel,
    MenubarItem,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
};