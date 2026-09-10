import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CreditCard,
    Bus,
    Megaphone,
    MessageCircle,
    GraduationCap,
    CalendarDays,
    ScrollText,
    Users,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    UserCheck,
    Umbrella,
    Landmark,
    ShieldCheck,
    Settings,
    Bell,
    Moon,
    Sun,
    User,
    HelpCircle,
    LogOut,
    CheckCheck,
    Trash2,
    Sparkles,
    Menu,
    X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
    selectNotifications,
    removeNotification,
    clearNotifications,
    selectTheme,
    toggleTheme,
} from "../../../store/appSlice";
import { getSessionParams } from "../../../config/sessionParams";
import {
    prefetchDashboard,
    prefetchFeeOverview,
    prefetchTransport,
    prefetchGrievances,
    prefetchAnnouncements,
    prefetchEvents,
    prefetchLeavePolicies,
    prefetchStaff,
} from "../../../services";

const NOTIF_VIEWS_KEY = "erp-notif-views";
function loadViewCounts() {
    try { return JSON.parse(localStorage.getItem(NOTIF_VIEWS_KEY) || "{}"); }
    catch { return {}; }
}
function saveViewCounts(obj) {
    try { localStorage.setItem(NOTIF_VIEWS_KEY, JSON.stringify(obj)); }
    catch { /* ignore */ }
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
}

const prefetchMap = {
    Dashboard: prefetchDashboard,
    Fees: prefetchFeeOverview,
    Transport: prefetchTransport,
    Grievances: prefetchGrievances,
    Announcements: prefetchAnnouncements,
    Events: prefetchEvents,
    Policies: prefetchLeavePolicies,
    "Staff Management": prefetchStaff,
};

const navigation = [
    { name: "Dashboard", href: "/management/dashboard", icon: LayoutDashboard, iconColor: "#60a5fa" },
    {
        name: "Fees",
        icon: CreditCard,
        iconColor: "#4ade80",
        children: [
            { name: "Fee Overview", href: "/management/fees/overview" },
            { name: "Payment Tracking", href: "/management/fees/payment-tracking" },
            { name: "Due Management", href: "/management/fees/due-management" },
        ],
    },
    {
        name: "Transport",
        icon: Bus,
        iconColor: "#f59e0b",
        children: [
            { name: "Assign Bus", href: "/management/transport/assign-bus" },
            { name: "Routes & Drivers", href: "/management/transport/routes-drivers" },
            { name: "Live Tracking", href: "/management/transport/tracking" },
        ],
    },
    {
        name: "Announcements",
        icon: Megaphone,
        iconColor: "#f472b6",
        children: [
            { name: "Create Announcement", href: "/management/announcements/create" },
            { name: "Manage Announcements", href: "/management/announcements/manage" },
        ],
    },
    { name: "Grievances", href: "/management/grievances", icon: MessageCircle, iconColor: "#fb7185" },
    {
        name: "Academic Setup",
        icon: GraduationCap,
        iconColor: "#a78bfa",
        children: [
            { name: "Classes", href: "/management/academic/classes" },
            { name: "Subjects", href: "/management/academic/subjects" },
            { name: "Branches", href: "/management/academic/branches" },
            { name: "Academic Calendar", href: "/management/academic/academic-calendar" },
            { name: "Attendance Rules", href: "/management/academic/attendance-rules" },
            { name: "Exam & Grading", href: "/management/academic/exam-grading" },
        ],
    },
    {
        name: "Events",
        icon: CalendarDays,
        iconColor: "#34d399",
        children: [
            { name: "Create Events", href: "/management/events/create" },
            { name: "Manage Events", href: "/management/events/manage" },
            { name: "Participation Management", href: "/management/events/participation" },
        ],
    },
    { name: "Alumni", href: "/management/alumni", icon: UserCheck, iconColor: "#38bdf8" },
    { name: "Leave Management", href: "/management/leave-management", icon: Umbrella, iconColor: "#fbbf24" },
    { name: "Policies", href: "/management/policies", icon: ScrollText, iconColor: "#94a3b8" },
    { name: "Staff Management", href: "/management/staff-management", icon: Users, iconColor: "#c084fc" },
    {
        name: "Campus Management",
        icon: Landmark,
        iconColor: "#2dd4bf",
        children: [
            { name: "Infrastructure", href: "/management/campus/infrastructure" },
            { name: "Facilities", href: "/management/campus/facilities" },
            { name: "Gallery", href: "/management/campus/gallery" },
            { name: "Contact Information", href: "/management/campus/contact" },
        ],
    },
    {
        name: "User Management",
        icon: ShieldCheck,
        iconColor: "#fb923c",
        children: [
            { name: "Users", href: "/management/users" },
            { name: "Roles & Permissions", href: "/management/users/roles" },
            { name: "Admin Access", href: "/management/users/admin-access" },
        ],
    },
    { name: "Reports & Analytics", href: "/management/reports-analytics", icon: TrendingUp, iconColor: "#f87171" },
    {
        name: "Settings",
        icon: Settings,
        iconColor: "#64748b",
        children: [
            { name: "General Settings", href: "/management/settings/general" },
            { name: "Notifications", href: "/management/settings/notifications" },
            { name: "System Preferences", href: "/management/settings/preferences" },
        ],
    },
];

export function SidebarHeader({ mobileTrigger, onLogout }) {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const theme = useSelector(selectTheme);
    const [viewCounts, setViewCounts] = useState(loadViewCounts);

    const unreadCount = notifications.filter(
        (n) => !viewCounts[n.id] || viewCounts[n.id] < 1
    ).length;

    const handleNotifClick = useCallback(
        (id) => {
            setViewCounts((prev) => {
                const next = { ...prev, [id]: (prev[id] || 0) + 1 };
                saveViewCounts(next);
                if (next[id] >= 2) {
                    dispatch(removeNotification(id));
                }
                return next;
            });
        },
        [dispatch]
    );

    const handleMarkAllRead = () => {
        dispatch(clearNotifications());
        setViewCounts({});
        saveViewCounts({});
    };

    const handleClearAll = () => {
        dispatch(clearNotifications());
        setViewCounts({});
        saveViewCounts({});
    };

    return (
        <div className="navbar" data-testid="school-navbar-main">
            <div className="navbar__accent" />

            <div className="navbar__left">
                {mobileTrigger && (
                    <div className="navbar__mobile-trigger">{mobileTrigger}</div>
                )}
                <div className="navbar__brand">
                    <div className="navbar__brand-icon">
                        <GraduationCap className="navbar__brand-icon-svg" />
                    </div>
                    <div className="navbar__brand-text">
                        <span className="navbar__brand-name">School ERP</span>
                    </div>
                </div>
            </div>

            <div className="navbar__center">
                <div className="navbar__greeting">
                    <Sparkles className="navbar__greeting-sparkle" />
                    <div className="navbar__greeting-body">
                        <span className="navbar__greeting-title">{getGreeting()}, Admin!</span>
                        <span className="navbar__greeting-sub">Ready to manage today's operations?</span>
                    </div>
                </div>
            </div>

            <div className="navbar__right">
                <Button
                    variant="ghost"
                    size="icon"
                    className="navbar__icon-btn"
                    onClick={() => dispatch(toggleTheme())}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    data-testid="school-button-theme-toggle"
                >
                    {theme === "dark" ? (
                        <Sun className="navbar__icon-btn-svg" />
                    ) : (
                        <Moon className="navbar__icon-btn-svg" />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="navbar__icon-btn navbar__icon-btn--notif"
                            aria-label="Notifications"
                            data-testid="school-button-notifications"
                        >
                            <Bell className="navbar__icon-btn-svg" />
                            {unreadCount > 0 && (
                                <span className="navbar__notif-badge">{unreadCount}</span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        side="bottom"
                        sideOffset={10}
                        collisionPadding={12}
                        className="navbar__notif-dropdown"
                        data-testid="school-dropdown-notifications"
                    >
                        <div className="navbar__notif-header">
                            <div className="navbar__notif-header-left">
                                <Bell className="navbar__notif-header-icon" />
                                <span className="navbar__notif-header-title">Notifications</span>
                                {unreadCount > 0 && (
                                    <Badge className="navbar__notif-count-badge">{unreadCount} new</Badge>
                                )}
                            </div>
                            <div className="navbar__notif-header-actions">
                                {notifications.length > 0 && (
                                    <>
                                        <button
                                            className="navbar__notif-action-btn"
                                            onClick={handleMarkAllRead}
                                            title="Mark all as read"
                                        >
                                            <CheckCheck className="navbar__notif-action-icon" />
                                            Mark all read
                                        </button>
                                        <button
                                            className="navbar__notif-action-btn navbar__notif-action-btn--danger"
                                            onClick={handleClearAll}
                                            title="Clear all"
                                        >
                                            <Trash2 className="navbar__notif-action-icon" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <div className="navbar__notif-list">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => {
                                    const isRead = viewCounts[notif.id] >= 1;
                                    return (
                                        <DropdownMenuItem
                                            key={notif.id}
                                            className={`navbar__notif-item navbar__notif-item--${notif.type} ${isRead ? "navbar__notif-item--read" : ""}`}
                                            onClick={() => handleNotifClick(notif.id)}
                                            data-testid={`school-notif-item-${notif.id}`}
                                        >
                                            <div className="navbar__notif-item-dot-col">
                                                <span className={`navbar__notif-dot ${isRead ? "navbar__notif-dot--read" : "navbar__notif-dot--unread"}`} />
                                            </div>
                                            <div className="navbar__notif-item-body">
                                                <div className="navbar__notif-item-row">
                                                    <span className="navbar__notif-item-title">{notif.title}</span>
                                                    {notif.type === "new" && !isRead && (
                                                        <Badge className="navbar__notif-new-badge">New</Badge>
                                                    )}
                                                </div>
                                                <span className="navbar__notif-item-desc">{notif.message}</span>
                                                {notif.timestamp && (
                                                    <span className="navbar__notif-item-time">{notif.timestamp}</span>
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })
                            ) : (
                                <div className="navbar__notif-empty">
                                    <Bell className="navbar__notif-empty-icon" />
                                    <span>All caught up!</span>
                                </div>
                            )}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="navbar__profile-btn"
                            data-testid="school-button-profile"
                        >
                            <Avatar className="navbar__avatar">
                                <AvatarImage src="" />
                                <AvatarFallback className="navbar__avatar-fallback">AD</AvatarFallback>
                            </Avatar>
                            <div className="navbar__profile-info">
                                <span className="navbar__profile-name">Admin User</span>
                                <span className="navbar__profile-role">Super Admin</span>
                            </div>
                            <ChevronDown className="navbar__profile-chevron" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        side="bottom"
                        sideOffset={10}
                        collisionPadding={12}
                        className="navbar__profile-dropdown"
                        data-testid="school-dropdown-profile"
                    >
                        <DropdownMenuLabel className="navbar__profile-dropdown-label">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="navbar__profile-dropdown-item" data-testid="school-menu-profile">
                            <User className="navbar__profile-dropdown-icon" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="navbar__profile-dropdown-item" data-testid="school-menu-settings">
                            <Settings className="navbar__profile-dropdown-icon" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="navbar__profile-dropdown-item" data-testid="school-menu-help">
                            <HelpCircle className="navbar__profile-dropdown-icon" /> Help & Support
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="navbar__profile-dropdown-item navbar__profile-dropdown-item--danger"
                            onClick={onLogout}
                            data-testid="school-button-logout"
                        >
                            <LogOut className="navbar__profile-dropdown-icon" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export function Sidebar({ collapsed, onToggle, onMobileClose }) {
    // In mobile drawer context always render fully expanded
    const effectiveCollapsed = onMobileClose ? false : collapsed;

    const location = useLocation();
    const queryClient = useQueryClient();
    const [expandedMenus, setExpandedMenus] = useState([]);

    useEffect(() => {
        const toExpand = [];
        navigation.forEach((item) => {
            if (item.children) {
                const hasActiveChild = item.children.some(
                    (child) => location.pathname === child.href
                );
                if (hasActiveChild) toExpand.push(item.name);
            }
        });
        if (toExpand.length > 0) {
            setExpandedMenus((prev) => [...new Set([...prev, ...toExpand])]);
        }
    }, [location.pathname]);

    const toggleMenu = (menuName) => {
        setExpandedMenus((prev) =>
            prev.includes(menuName)
                ? prev.filter((n) => n !== menuName)
                : [...prev, menuName]
        );
    };

    const handleMenuMouseEnter = (menuName) => {
        const prefetchFn = prefetchMap[menuName];
        if (prefetchFn) {
            const params = getSessionParams();
            prefetchFn(queryClient, params);
        }
    };

    const isPathActive = (item) => {
        if (item.href) return location.pathname === item.href;
        if (item.children) return item.children.some((c) => location.pathname === c.href);
        return false;
    };

    return (
        <aside
            className={`sidebar ${effectiveCollapsed ? "sidebar--collapsed" : "sidebar--expanded"}`}
            data-testid="school-sidebar-main"
        >
            <div className="sidebar__gradient" />

            <nav className="sidebar__nav">
                {onMobileClose ? (
                    <button
                        className="sidebar__collapse-btn"
                        onClick={onMobileClose}
                        aria-label="Close navigation menu"
                        data-testid="school-button-close-drawer"
                        title="Close"
                    >
                        <X className="sidebar__collapse-icon" />
                    </button>
                ) : (
                    <button
                        className="sidebar__collapse-btn"
                        onClick={onToggle}
                        aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        data-testid="school-button-sidebar-toggle"
                        title={effectiveCollapsed ? "Expand" : "Collapse"}
                    >
                        {effectiveCollapsed ? (
                            <ChevronRight className="sidebar__collapse-icon" />
                        ) : (
                            <ChevronLeft className="sidebar__collapse-icon" />
                        )}
                    </button>
                )}
                {navigation.map((item) => {
                    const isActive = isPathActive(item);
                    const Icon = item.icon;
                    const isExpanded = expandedMenus.includes(item.name);
                    const iconStyle = { color: item.iconColor || "currentColor" };

                    if (item.children) {
                        return (
                            <div
                                key={item.name}
                                className="sidebar__nav-group"
                                onMouseEnter={() => !effectiveCollapsed && handleMenuMouseEnter(item.name)}
                            >
                                <button
                                    onClick={() => !effectiveCollapsed && toggleMenu(item.name)}
                                    className={`sidebar__nav-btn ${isActive ? "sidebar__nav-btn--active" : "sidebar__nav-btn--inactive"}`}
                                    title={effectiveCollapsed ? item.name : undefined}
                                    data-testid={`school-nav-btn-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                                >
                                    {isActive && <div className="sidebar__nav-btn__pulse" />}
                                    <Icon className="sidebar__nav-btn__icon" style={iconStyle} />
                                    {!effectiveCollapsed && (
                                        <>
                                            <span className="sidebar__nav-btn__label">{item.name}</span>
                                            {isExpanded ? (
                                                <ChevronUp className="sidebar__nav-btn__chevron" />
                                            ) : (
                                                <ChevronDown className="sidebar__nav-btn__chevron" />
                                            )}
                                        </>
                                    )}
                                </button>

                                {!effectiveCollapsed && isExpanded && (
                                    <div className="sidebar__submenu">
                                        {item.children.map((child) => {
                                            const isChildActive = location.pathname === child.href;
                                            return (
                                                <Link
                                                    key={child.name}
                                                    to={child.href}
                                                    className={`sidebar__submenu-link ${isChildActive ? "sidebar__submenu-link--active" : "sidebar__submenu-link--inactive"}`}
                                                    data-testid={`school-nav-link-${child.name.toLowerCase().replace(/\s+/g, "-")}`}
                                                    onClick={onMobileClose}
                                                >
                                                    {child.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`sidebar__nav-btn ${isActive ? "sidebar__nav-btn--active" : "sidebar__nav-btn--inactive"}`}
                            title={effectiveCollapsed ? item.name : undefined}
                            data-testid={`school-nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                            onClick={onMobileClose}
                        >
                            {isActive && <div className="sidebar__nav-btn__pulse" />}
                            <Icon className="sidebar__nav-btn__icon" style={iconStyle} />
                            {!effectiveCollapsed && <span className="sidebar__nav-btn__label">{item.name}</span>}
                            {isActive && !effectiveCollapsed && <div className="sidebar__nav-btn__dot" />}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export function MobileSidebarTrigger({ onClick }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="sidebar__mobile-trigger"
            aria-label="Open navigation menu"
            data-testid="school-button-mobile-sidebar"
        >
            <Menu className="h-5 w-5" />
        </Button>
    );
}

export default Sidebar;
