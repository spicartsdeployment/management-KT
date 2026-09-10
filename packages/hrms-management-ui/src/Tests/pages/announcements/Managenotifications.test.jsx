import { render, screen, fireEvent } from "@testing-library/react";
import ManageNotifications from "./ManageNotifications";

jest.mock("lucide-react", () => ({
    Bell: () => <svg />,
    Search: () => <svg />,
    Eye: () => <svg />,
    Edit: () => <svg />,
    Trash2: () => <svg />,
    Pin: () => <svg data-testid="icon-pin" />,
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

describe("ManageNotifications", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<ManageNotifications />);
        expect(screen.getByText("Manage Notifications")).toBeInTheDocument();
        expect(screen.getByText(/View, edit, and manage all announcements/i)).toBeInTheDocument();
    });

    it("renders all 5 announcement rows with titles and IDs", () => {
        render(<ManageNotifications />);
        expect(screen.getByText("ANN001")).toBeInTheDocument();
        expect(screen.getByText("Mid-term Exam Schedule Released")).toBeInTheDocument();
        expect(screen.getByText("Sports Day on March 15th")).toBeInTheDocument();
        expect(screen.getByText("Fee Payment Deadline")).toBeInTheDocument();
        expect(screen.getByText("Library Hours Extended")).toBeInTheDocument();
    });

    it("renders Pin icons only for pinned announcements (ANN001 and ANN002)", () => {
        render(<ManageNotifications />);
        const pinIcons = screen.getAllByTestId("icon-pin");
        expect(pinIcons.length).toBe(2);
    });

    it("renders priority and status badges correctly", () => {
        render(<ManageNotifications />);
        expect(screen.getByText("Critical")).toBeInTheDocument();
        expect(screen.getAllByText("High").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Active").length).toBe(4);
        expect(screen.getByText("Expired")).toBeInTheDocument();
    });

    it("calls alert with correct announcement ID on View and Edit clicks", () => {
        render(<ManageNotifications />);
        // 3 action buttons per row (View, Edit, Delete); first row = buttons 0,1,2
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]); // View ANN001
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/ANN001/));

        fireEvent.click(buttons[1]); // Edit ANN001
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/ANN001/));
    });

    it("calls confirm and then alert on Delete button click", () => {
        render(<ManageNotifications />);
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[2]); // Delete ANN001
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this announcement?");
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Deleted announcement: ANN001/));
    });
});