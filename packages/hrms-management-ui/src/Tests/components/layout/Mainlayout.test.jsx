import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router";
import { MainLayout } from "../../../app/components/layout/MainLayout";
import appReducer from "../../../store/appSlice";

jest.mock("lucide-react", () => ({
    ChevronLeft: () => <svg data-testid="icon-chevron-left" />,
    ChevronRight: () => <svg data-testid="icon-chevron-right" />,
}));

jest.mock("../../../app/components/layout/Sidebar", () => ({
    Sidebar: ({ collapsed }) => (
        <div data-testid="sidebar" data-collapsed={String(collapsed)} />
    ),
    SidebarHeader: () => <div data-testid="sidebar-header">Sidebar Header</div>,
}));

jest.mock("../../../app/components/ui/Button", () => ({
    Button: ({ children, onClick, className, "aria-label": ariaLabel }) => (
        <button
            onClick={onClick}
            className={className}
            aria-label={ariaLabel}
            data-testid={className?.includes("sidebar-toggle") ? "sidebar-toggle" : undefined}
        >
            {children}
        </button>
    ),
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    Outlet: () => <div data-testid="outlet">Page Content</div>,
}));

const renderLayout = () => {
    const store = configureStore({
        reducer: { managementApp: appReducer },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        </Provider>
    );
};

describe("MainLayout", () => {
    it("renders SidebarHeader, Sidebar, and Outlet", () => {
        renderLayout();
        expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
        expect(screen.getByTestId("outlet")).toBeInTheDocument();
        expect(screen.getByText("Page Content")).toBeInTheDocument();
    });

    it("renders a single sidebar toggle inside the sidebar card", () => {
        const { container } = renderLayout();
        const sidebarCard = container.querySelector(".main-layout__sidebar-card");
        expect(sidebarCard).toBeInTheDocument();
        expect(sidebarCard.querySelectorAll(".main-layout__sidebar-toggle")).toHaveLength(1);
        expect(screen.getAllByTestId("sidebar-toggle")).toHaveLength(1);
    });

    it("renders sidebar in expanded state by default", () => {
        renderLayout();
        expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "false");
    });

    it("collapses sidebar when toggle is clicked", () => {
        renderLayout();
        fireEvent.click(screen.getByTestId("sidebar-toggle"));
        expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "true");
    });

    it("expands sidebar again after second toggle click", () => {
        renderLayout();
        fireEvent.click(screen.getByTestId("sidebar-toggle"));
        fireEvent.click(screen.getByTestId("sidebar-toggle"));
        expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "false");
    });

    it("applies expanded CSS class to sidebar container by default", () => {
        const { container } = renderLayout();
        const sidebarWrapper = container.querySelector(".main-layout__sidebar");
        expect(sidebarWrapper).toHaveClass("main-layout__sidebar--expanded");
        fireEvent.click(screen.getByTestId("sidebar-toggle"));
        expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "true");
    });
});
