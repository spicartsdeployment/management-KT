"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

import "./src/Assets/styles/Sidebar_styles.scss";
import "../../../Assets/styles/Sidebar_styles.scss";


const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
}

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value) => {
            const openState = typeof value === "function" ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        },
        [setOpenProp, open],
    );

    const toggleSidebar = React.useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="sidebar-wrapper"
                    className={cn("sidebar-wrapper", className)}
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    );
}

function Sidebar({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
}) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
        return (
            <div
                data-slot="sidebar"
                className={cn("sidebar sidebar--static", className)}
                {...props}
            >
                {children}
            </div>
        );
    }

    if (isMobile) {
        return (
            <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
                <SheetContent
                    data-sidebar="sidebar"
                    data-slot="sidebar"
                    data-mobile="true"
                    className="sidebar sidebar--mobile"
                    side={side}
                >
                    <SheetHeader className="sidebar__sheet-header--sr-only">
                        <SheetTitle>Sidebar</SheetTitle>
                        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                    </SheetHeader>
                    <div className="sidebar__mobile-inner">{children}</div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div
            className={cn("sidebar__peer", className)}
            data-state={state}
            data-collapsible={state === "collapsed" ? collapsible : ""}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
        >
            <div data-slot="sidebar-gap" className="sidebar__gap" />
            <div
                data-slot="sidebar-container"
                className={cn(
                    "sidebar__container",
                    side === "left" ? "sidebar__container--left" : "sidebar__container--right",
                    (variant === "floating" || variant === "inset") && "sidebar__container--floating",
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className="sidebar__inner"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

function SidebarTrigger({ className, onClick, ...props }) {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon"
            className={cn("sidebar__trigger", className)}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            <PanelLeftIcon />
            <span className="sidebar__trigger-label--sr-only">Toggle Sidebar</span>
        </Button>
    );
}

function SidebarRail({ className, ...props }) {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            title="Toggle Sidebar"
            className={cn("sidebar__rail", className)}
            {...props}
        />
    );
}

function SidebarInset({ className, ...props }) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn("sidebar__inset", className)}
            {...props}
        />
    );
}

function SidebarInput({ className, ...props }) {
    return (
        <Input
            data-slot="sidebar-input"
            data-sidebar="input"
            className={cn("sidebar__input", className)}
            {...props}
        />
    );
}

function SidebarHeader({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            className={cn("sidebar__header", className)}
            {...props}
        />
    );
}

function SidebarFooter({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-footer"
            data-sidebar="footer"
            className={cn("sidebar__footer", className)}
            {...props}
        />
    );
}

function SidebarSeparator({ className, ...props }) {
    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            className={cn("sidebar__separator", className)}
            {...props}
        />
    );
}

function SidebarContent({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn("sidebar__content", className)}
            {...props}
        />
    );
}

function SidebarGroup({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-group"
            data-sidebar="group"
            className={cn("sidebar__group", className)}
            {...props}
        />
    );
}

function SidebarGroupLabel({ className, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "div";

    return (
        <Comp
            data-slot="sidebar-group-label"
            data-sidebar="group-label"
            className={cn("sidebar__group-label", className)}
            {...props}
        />
    );
}

function SidebarGroupAction({ className, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="sidebar-group-action"
            data-sidebar="group-action"
            className={cn("sidebar__group-action", className)}
            {...props}
        />
    );
}

function SidebarGroupContent({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            className={cn("sidebar__group-content", className)}
            {...props}
        />
    );
}

function SidebarMenu({ className, ...props }) {
    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            className={cn("sidebar__menu", className)}
            {...props}
        />
    );
}

function SidebarMenuItem({ className, ...props }) {
    return (
        <li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            className={cn("sidebar__menu-item", className)}
            {...props}
        />
    );
}

const sidebarMenuButtonVariants = cva("sidebar__menu-button", {
    variants: {
        variant: {
            default: "sidebar__menu-button--default",
            outline: "sidebar__menu-button--outline",
        },
        size: {
            default: "sidebar__menu-button--size-default",
            sm: "sidebar__menu-button--size-sm",
            lg: "sidebar__menu-button--size-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

function SidebarMenuButton({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
}) {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
        <Comp
            data-slot="sidebar-menu-button"
            data-sidebar="menu-button"
            data-size={size}
            data-active={isActive}
            className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
            {...props}
        />
    );

    if (!tooltip) return button;

    if (typeof tooltip === "string") {
        tooltip = { children: tooltip };
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
                side="right"
                align="center"
                hidden={state !== "collapsed" || isMobile}
                {...tooltip}
            />
        </Tooltip>
    );
}

function SidebarMenuAction({
    className,
    asChild = false,
    showOnHover = false,
    ...props
}) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="sidebar-menu-action"
            data-sidebar="menu-action"
            className={cn(
                "sidebar__menu-action",
                showOnHover && "sidebar__menu-action--show-on-hover",
                className,
            )}
            {...props}
        />
    );
}

function SidebarMenuBadge({ className, ...props }) {
    return (
        <div
            data-slot="sidebar-menu-badge"
            data-sidebar="menu-badge"
            className={cn("sidebar__menu-badge", className)}
            {...props}
        />
    );
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
    const width = React.useMemo(() => {
        return `${Math.floor(Math.random() * 40) + 50}%`;
    }, []);

    return (
        <div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            className={cn("sidebar__menu-skeleton", className)}
            {...props}
        >
            {showIcon && (
                <Skeleton
                    className="sidebar__menu-skeleton-icon"
                    data-sidebar="menu-skeleton-icon"
                />
            )}
            <Skeleton
                className="sidebar__menu-skeleton-text"
                data-sidebar="menu-skeleton-text"
                style={{ "--skeleton-width": width }}
            />
        </div>
    );
}

function SidebarMenuSub({ className, ...props }) {
    return (
        <ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            className={cn("sidebar__menu-sub", className)}
            {...props}
        />
    );
}

function SidebarMenuSubItem({ className, ...props }) {
    return (
        <li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            className={cn("sidebar__menu-sub-item", className)}
            {...props}
        />
    );
}

function SidebarMenuSubButton({
    asChild = false,
    size = "md",
    isActive = false,
    className,
    ...props
}) {
    const Comp = asChild ? Slot : "a";

    return (
        <Comp
            data-slot="sidebar-menu-sub-button"
            data-sidebar="menu-sub-button"
            data-size={size}
            data-active={isActive}
            className={cn(
                "sidebar__menu-sub-button",
                size === "sm" && "sidebar__menu-sub-button--sm",
                size === "md" && "sidebar__menu-sub-button--md",
                className,
            )}
            {...props}
        />
    );
}

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
};