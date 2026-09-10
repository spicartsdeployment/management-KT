import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import "./../../Assets/styles/NavigationMenu.scss";

function NavigationMenu({ className, children, viewport = true, ...props }) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={["nav-menu", className].filter(Boolean).join(" ")}
            {...props}
        >
            {children}
            {viewport && <NavigationMenuViewport />}
        </NavigationMenuPrimitive.Root>
    );
}

function NavigationMenuList({ className, ...props }) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={["nav-menu__list", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function NavigationMenuItem({ className, ...props }) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={["nav-menu__item", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

const navigationMenuTriggerStyle = cva("nav-menu__trigger");

function NavigationMenuTrigger({ className, children, ...props }) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={["nav-menu__trigger", className].filter(Boolean).join(" ")}
            {...props}
        >
            {children}{" "}
            <ChevronDownIcon
                className="nav-menu__trigger-icon"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({ className, ...props }) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={["nav-menu__content", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function NavigationMenuViewport({ className, ...props }) {
    return (
        <div className="nav-menu__viewport-wrapper">
            <NavigationMenuPrimitive.Viewport
                data-slot="navigation-menu-viewport"
                className={["nav-menu__viewport", className].filter(Boolean).join(" ")}
                {...props}
            />
        </div>
    );
}

function NavigationMenuLink({ className, ...props }) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={["nav-menu__link", className].filter(Boolean).join(" ")}
            {...props}
        />
    );
}

function NavigationMenuIndicator({ className, ...props }) {
    return (
        <NavigationMenuPrimitive.Indicator
            data-slot="navigation-menu-indicator"
            className={["nav-menu__indicator", className].filter(Boolean).join(" ")}
            {...props}
        >
            <div className="nav-menu__indicator-arrow" />
        </NavigationMenuPrimitive.Indicator>
    );
}

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};