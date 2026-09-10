import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../../store/appSlice";

jest.mock("../../../config/sessionParams", () => ({
    getSessionParams: () => ({}),
}));

jest.mock("../../../services", () => ({}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({}),
}));

jest.mock("react-router-dom", () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useLocation: () => ({ pathname: "/management/dashboard" }),
}));

import { SidebarHeader } from "../../../app/components/layout/Sidebar";

jest.mock("lucide-react", () => ({
    Search: () => <svg data-testid="icon-search" />,
    Bell: () => <svg data-testid="icon-bell" />,
    Moon: () => <svg data-testid="icon-moon" />,
    Sun: () => <svg data-testid="icon-sun" />,
    ChevronDown: () => <svg />,
    ChevronLeft: () => <svg />,
    ChevronRight: () => <svg />,
    GraduationCap: () => <svg />,
}));

jest.mock("../../../app/components/ui/input", () => ({ Input: (props) => <input {...props} /> }));
jest.mock("../../../app/components/ui/Button", () => ({
    Button: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../../app/components/ui/avatar", () => ({
    Avatar: ({ children, className }) => <div className={className}>{children}</div>,
    AvatarImage: ({ src }) => <img src={src} alt="" />,
    AvatarFallback: ({ children, className }) => <span className={className}>{children}</span>,
}));
jest.mock("../../../app/components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));
jest.mock("../../../app/components/ui/dropdown-menu", () => ({
    DropdownMenu: ({ children }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }) => <div>{children}</div>,
    DropdownMenuContent: ({ children, className }) => <div className={className}>{children}</div>,
    DropdownMenuLabel: ({ children, className }) => <div className={className}>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
    DropdownMenuItem: ({ children, className }) => <div className={className}>{children}</div>,
}));

const mockStore = configureStore({
    reducer: { managementApp: appReducer },
});

const renderHeader = () =>
    render(
        <Provider store={mockStore}>
            <SidebarHeader collapsed={false} />
        </Provider>
    );

describe("SidebarHeader", () => {
    it("renders search input with correct placeholder", () => {
        renderHeader();
        expect(screen.getByPlaceholderText(/Search students, teachers, or records/i)).toBeInTheDocument();
    });

    it("renders notification badge count and notification items", () => {
        renderHeader();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("Fee Payment Overdue")).toBeInTheDocument();
        expect(screen.getByText("New Staff Application")).toBeInTheDocument();
        expect(screen.getByText("Attendance Alert")).toBeInTheDocument();
    });

    it("renders notification descriptions and timestamps", () => {
        renderHeader();
        expect(screen.getByText(/12 students have pending fee payments/i)).toBeInTheDocument();
        expect(screen.getByText(/new application has been submitted/i)).toBeInTheDocument();
        expect(screen.getByText("2 min ago")).toBeInTheDocument();
        expect(screen.getByText("18 min ago")).toBeInTheDocument();
    });

    it("renders profile section with user name, role and avatar fallback", () => {
        renderHeader();
        expect(screen.getByText("Admin User")).toBeInTheDocument();
        expect(screen.getByText("Super Admin")).toBeInTheDocument();
        expect(screen.getByText("AD")).toBeInTheDocument();
    });

    it("renders profile dropdown menu items", () => {
        renderHeader();
        expect(screen.getByText("My Account")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Help & Support")).toBeInTheDocument();
        expect(screen.getByText("Log out")).toBeInTheDocument();
    });
});
