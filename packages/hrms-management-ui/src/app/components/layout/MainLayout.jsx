
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import Header from "./Header";
import { Button } from "../ui/Button";
import { selectSidebarCollapsed, toggleSidebar } from "../../../store/appSlice";
import "../../../Assets/styles/MainLayout.scss";

export function MainLayout() {
    const dispatch = useDispatch();
    const sidebarCollapsed = useSelector(selectSidebarCollapsed);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    const handleOpenMobileDrawer = () => setMobileDrawerOpen(true);
    const handleCloseMobileDrawer = () => setMobileDrawerOpen(false);

    return (
        <div className="main-layout">
            <div className="main-layout__navbar">
                <Header
                    mobileTrigger={(
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleOpenMobileDrawer}
                            className="navbar__hamburger-btn"
                            aria-label="Open navigation menu"
                            data-testid="school-button-mobile-menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                />
            </div>

            {/* Backdrop overlay — rendered only when drawer is open */}
            {mobileDrawerOpen && (
                <div
                    className="main-layout__backdrop"
                    onClick={handleCloseMobileDrawer}
                    aria-hidden="true"
                    data-testid="school-overlay-mobile-backdrop"
                />
            )}

            <div className="main-layout__body">
                {/* Sidebar: desktop card + mobile off-canvas drawer (single source) */}
                <div
                    className={[
                        "main-layout__sidebar",
                        sidebarCollapsed
                            ? "main-layout__sidebar--collapsed"
                            : "main-layout__sidebar--expanded",
                        mobileDrawerOpen ? "main-layout__sidebar--mobile-open" : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    <div className="main-layout__sidebar-card">
                        <Sidebar
                            collapsed={sidebarCollapsed}
                            onToggle={handleToggleSidebar}
                            onMobileClose={mobileDrawerOpen ? handleCloseMobileDrawer : undefined}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="main-layout__main">
                    <div className="main-layout__content-card">
                        <main className="main-layout__main-content">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}