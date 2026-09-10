import { render, screen, fireEvent } from "@testing-library/react";
import DueManagement from "./DueManagement";

jest.mock("lucide-react", () => ({
    AlertCircle: () => <svg />,
    Search: () => <svg />,
    Send: () => <svg />,
    Calendar: () => <svg />,
    Bell: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }) => <div className={className}>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, variant, size }) => (
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
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

describe("DueManagement", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<DueManagement />);
        expect(screen.getByText("Due Management")).toBeInTheDocument();
        expect(screen.getByText(/Track and manage pending fee payments/i)).toBeInTheDocument();
    });

    it("renders all 3 summary cards with correct values", () => {
        render(<DueManagement />);
        expect(screen.getByText("Total Due Amount")).toBeInTheDocument();
        expect(screen.getByText("₹1,20,000")).toBeInTheDocument();
        expect(screen.getByText("Overdue Payments")).toBeInTheDocument();
        expect(screen.getByText("₹65,000")).toBeInTheDocument();
        expect(screen.getByText("Scholarship Applied")).toBeInTheDocument();
        expect(screen.getByText("₹23,000")).toBeInTheDocument();
    });

    it("renders all 5 student rows with names and balance amounts", () => {
        render(<DueManagement />);
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Amit Singh")).toBeInTheDocument();
        expect(screen.getByText("Sandeep Gupta")).toBeInTheDocument();
        expect(screen.getByText("Kavita Rao")).toBeInTheDocument();
        // Balance amounts formatted
        expect(screen.getByText("₹20,000")).toBeInTheDocument();
        expect(screen.getByText("₹35,000")).toBeInTheDocument();
    });

    it("renders overdue and on-time status badges correctly", () => {
        render(<DueManagement />);
        expect(screen.getByText("25 days overdue")).toBeInTheDocument();
        expect(screen.getByText("45 days overdue")).toBeInTheDocument();
        expect(screen.getAllByText("On Time").length).toBe(3);
    });

    it("calls alert with student name and amount on Remind button click", () => {
        render(<DueManagement />);
        const remindButtons = screen.getAllByText("Remind");
        fireEvent.click(remindButtons[0]); // Rahul Kumar, ₹12,500
        expect(window.alert).toHaveBeenCalledWith(
            expect.stringMatching(/Rahul Kumar/)
        );
    });

    it("calls alert on Send Bulk Reminders and Send Notifications", () => {
        render(<DueManagement />);
        fireEvent.click(screen.getByText(/Send Bulk Reminders/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/bulk reminders/i));

        fireEvent.click(screen.getByText(/Send Notifications/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/SMS and Email/i));
    });
});