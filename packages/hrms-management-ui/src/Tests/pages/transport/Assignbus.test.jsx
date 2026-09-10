import { render, screen, fireEvent } from "@testing-library/react";
import AssignBus from "./AssignBus";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
    Bus: () => <svg data-testid="icon-bus" />,
    Search: () => <svg data-testid="icon-search" />,
    UserPlus: () => <svg data-testid="icon-userplus" />,
    MapPin: () => <svg data-testid="icon-mappin" />,
    Calendar: () => <svg data-testid="icon-calendar" />,
}));

// Mock UI components
jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children }) => <div>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, size, variant }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../components/ui/input", () => ({
    Input: (props) => <input {...props} />,
}));
jest.mock("../../components/ui/select", () => ({
    Select: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children }) => <div>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
}));
jest.mock("../../components/ui/table", () => ({
    Table: ({ children }) => <table>{children}</table>,
    TableBody: ({ children }) => <tbody>{children}</tbody>,
    TableCell: ({ children, className }) => <td className={className}>{children}</td>,
    TableHead: ({ children }) => <th>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

describe("AssignBus", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<AssignBus />);
        expect(screen.getByText("Assign Bus")).toBeInTheDocument();
        expect(screen.getByText(/Manage student-bus assignments/i)).toBeInTheDocument();
    });

    it("renders all assignment rows with correct data", () => {
        render(<AssignBus />);
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
        expect(screen.getByText("Amit Singh")).toBeInTheDocument();
        expect(screen.getByText("Neha Patel")).toBeInTheDocument();
    });

    it("renders Active and Inactive badges correctly", () => {
        render(<AssignBus />);
        const activeBadges = screen.getAllByText("Active");
        const inactiveBadges = screen.getAllByText("Inactive");
        expect(activeBadges.length).toBe(3);
        expect(inactiveBadges.length).toBe(1);
    });

    it("calls alert when Assign New Student button is clicked", () => {
        render(<AssignBus />);
        fireEvent.click(screen.getByText(/Assign New Student/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/assign new student/i));
    });

    it("calls alert on Edit and confirm+alert on Remove", () => {
        render(<AssignBus />);
        const editButtons = screen.getAllByText("Edit");
        fireEvent.click(editButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Edit assignment for Rahul Kumar/i));

        const removeButtons = screen.getAllByText("Remove");
        fireEvent.click(removeButtons[0]);
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Removed Rahul Kumar/i));
    });

    it("renders filter controls including search input and selects", () => {
        render(<AssignBus />);
        expect(screen.getByPlaceholderText("Search Student...")).toBeInTheDocument();
        expect(screen.getByText("Academic Year")).toBeInTheDocument();
        expect(screen.getByText("Bus")).toBeInTheDocument();
        expect(screen.getByText("Route")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });
});