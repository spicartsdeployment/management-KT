import { render, screen, fireEvent } from "@testing-library/react";
import StaffDirectory from "./StaffDirectory";

jest.mock("lucide-react", () => ({
    Users: () => <svg />,
    Search: () => <svg />,
    Plus: () => <svg />,
    Phone: () => <svg />,
    Mail: () => <svg />,
    Edit: () => <svg />,
    Eye: () => <svg />,
}));

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
    TableCell: ({ children, className }) => <td className={className}>{children}</td>,
    TableHead: ({ children }) => <th>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));

describe("StaffDirectory", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<StaffDirectory />);
        expect(screen.getByText("Staff Directory")).toBeInTheDocument();
        expect(screen.getByText(/Manage support staff/i)).toBeInTheDocument();
    });

    it("renders all 6 staff members", () => {
        render(<StaffDirectory />);
        expect(screen.getByText("Rajesh Kumar")).toBeInTheDocument();
        expect(screen.getByText("Sunita Sharma")).toBeInTheDocument();
        expect(screen.getByText("Vikram Singh")).toBeInTheDocument();
        expect(screen.getByText("Meena Patel")).toBeInTheDocument();
        expect(screen.getByText("Amit Gupta")).toBeInTheDocument();
        expect(screen.getByText("Priya Reddy")).toBeInTheDocument();
    });

    it("renders role badges and shift badges", () => {
        render(<StaffDirectory />);
        expect(screen.getByText("Security Guard")).toBeInTheDocument();
        expect(screen.getByText("Librarian")).toBeInTheDocument();
        expect(screen.getByText("Morning")).toBeInTheDocument();
        expect(screen.getByText("Evening")).toBeInTheDocument();
    });

    it("calls alert on Add New Staff click", () => {
        render(<StaffDirectory />);
        fireEvent.click(screen.getByText(/Add New Staff/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new staff/i));
    });

    it("calls alert with correct staff ID on View and Edit clicks", () => {
        render(<StaffDirectory />);
        // Eye and Edit icons are SVGs — buttons are ghost; query by role
        const buttons = screen.getAllByRole("button");
        // First non-"Add New Staff" buttons are View/Edit pairs per row
        // View button for STF001 is buttons[1], Edit is buttons[2]
        fireEvent.click(buttons[1]); // View STF001
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/STF001/));

        fireEvent.click(buttons[2]); // Edit STF001
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/STF001/));
    });

    it("renders search input and filter selects", () => {
        render(<StaffDirectory />);
        expect(screen.getByPlaceholderText("Search staff...")).toBeInTheDocument();
        expect(screen.getByText("Role")).toBeInTheDocument();
        expect(screen.getByText("Shift")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });
});