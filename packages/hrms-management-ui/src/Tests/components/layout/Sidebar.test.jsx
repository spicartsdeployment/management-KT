import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Sidebar } from "../../../app/components/layout/Sidebar";

jest.mock("lucide-react", () => ({
    LayoutDashboard: () => <svg />,
    DollarSign: () => <svg />,
    Bus: () => <svg />,
    Megaphone: () => <svg />,
    MessageCircle: () => <svg />,
    GraduationCap: () => <svg />,
    Calendar: () => <svg />,
    FileText: () => <svg />,
    Users: () => <svg />,
    BarChart3: () => <svg />,
    ChevronLeft: () => <svg />,
    ChevronRight: () => <svg />,
    ChevronDown: () => <svg />,
    ChevronUp: () => <svg />,
    UserCheck: () => <svg />,
    ClipboardList: () => <svg />,
    Building2: () => <svg />,
    UserCog: () => <svg />,
    Settings: () => <svg />,
}));

jest.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({}),
}));

jest.mock("../../../config/sessionParams", () => ({
    getSessionParams: () => ({}),
}));

jest.mock("../../../services", () => ({}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    Link: ({ children, to, className, title }) => (
        <a href={to} className={className} title={title}>{children}</a>
    ),
}));

const renderSidebar = (props = {}) =>
    render(
        <MemoryRouter initialEntries={["/management/dashboard"]}>
            <Sidebar collapsed={false} {...props} />
        </MemoryRouter>
    );

describe("Sidebar", () => {
    it("renders all top-level navigation menu items", () => {
        renderSidebar();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Fees")).toBeInTheDocument();
        expect(screen.getByText("Transport")).toBeInTheDocument();
        expect(screen.getByText("Announcements")).toBeInTheDocument();
        expect(screen.getByText("Grievances")).toBeInTheDocument();
        expect(screen.getByText("Academic Setup")).toBeInTheDocument();
        expect(screen.getByText("Events")).toBeInTheDocument();
        expect(screen.getByText("Reports & Analytics")).toBeInTheDocument();
    });

    it("expands submenu and shows children when a parent menu is clicked", () => {
        renderSidebar();
        fireEvent.click(screen.getByText("Fees"));
        expect(screen.getByText("Fee Overview")).toBeInTheDocument();
        expect(screen.getByText("Payment Tracking")).toBeInTheDocument();
        expect(screen.getByText("Due Management")).toBeInTheDocument();
    });

    it("collapses submenu when the same parent is clicked twice", () => {
        renderSidebar();
        fireEvent.click(screen.getByText("Transport"));
        expect(screen.getByText("Assign Bus")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Transport"));
        expect(screen.queryByText("Assign Bus")).not.toBeInTheDocument();
    });

    it("does not expand submenu labels when sidebar is collapsed", () => {
        renderSidebar({ collapsed: true });
        fireEvent.click(screen.getByTitle("Fees"));
        expect(screen.queryByText("Fee Overview")).not.toBeInTheDocument();
    });
});
