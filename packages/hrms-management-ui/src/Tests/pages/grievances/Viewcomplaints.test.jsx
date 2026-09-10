import { render, screen, fireEvent } from "@testing-library/react";
import ViewComplaints from "./ViewComplaints";

jest.mock("lucide-react", () => ({
    MessageCircle: () => <svg />,
    Search: () => <svg />,
    Eye: () => <svg />,
    AlertCircle: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }) => <div className={className}>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, size, variant }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../components/ui/input", () => ({ Input: (props) => <input {...props} /> }));
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
    TableCell: ({ children, className, style }) => <td className={className} style={style}>{children}</td>,
    TableHead: ({ children }) => <th>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));

describe("ViewComplaints", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<ViewComplaints />);
        expect(screen.getByText("View Complaints")).toBeInTheDocument();
        expect(screen.getByText(/Track and manage student grievances/i)).toBeInTheDocument();
    });

    it("renders all 4 summary stat cards with correct values", () => {
        render(<ViewComplaints />);
        expect(screen.getByText("Open Complaints")).toBeInTheDocument();
        expect(screen.getByText("12")).toBeInTheDocument();
        expect(screen.getByText("In Progress")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
        expect(screen.getByText("Resolved")).toBeInTheDocument();
        expect(screen.getByText("45")).toBeInTheDocument();
        expect(screen.getByText("Total This Month")).toBeInTheDocument();
        expect(screen.getByText("65")).toBeInTheDocument();
    });

    it("renders all 5 grievance rows with student names and IDs", () => {
        render(<ViewComplaints />);
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
        expect(screen.getByText("GRV004")).toBeInTheDocument();
        expect(screen.getByText("Neha Patel")).toBeInTheDocument();
        expect(screen.getByText("Vikram Reddy")).toBeInTheDocument();
    });

    it("renders priority and status badges correctly", () => {
        render(<ViewComplaints />);
        expect(screen.getByText("Critical")).toBeInTheDocument();
        expect(screen.getByText("High", { selector: "span" })).toBeInTheDocument();
        expect(screen.getByText("In Progress")).toBeInTheDocument();
        expect(screen.getAllByText("Open").length).toBeGreaterThan(0);
    });

    it("renders filter controls", () => {
        render(<ViewComplaints />);
        expect(screen.getByPlaceholderText("Search complaints...")).toBeInTheDocument();
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Priority")).toBeInTheDocument();
    });

    it("calls alert with correct grievance ID on View button click", () => {
        render(<ViewComplaints />);
        const viewButtons = screen.getAllByText("View");
        fireEvent.click(viewButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/GRV001/));

        fireEvent.click(viewButtons[3]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/GRV004/));
    });
});