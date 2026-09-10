import { render, screen, fireEvent } from "@testing-library/react";
import PaymentTracking from "./PaymentTracking";

jest.mock("lucide-react", () => ({
    CreditCard: () => <svg />,
    Search: () => <svg />,
    Calendar: () => <svg />,
    Download: () => <svg />,
    Receipt: () => <svg />,
    CheckCircle2: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children }) => <div>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, variant }) => (
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
    TableCell: ({ children, className, colSpan }) => <td className={className} colSpan={colSpan}>{children}</td>,
    TableHead: ({ children, className, colSpan }) => <th className={className} colSpan={colSpan}>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

describe("PaymentTracking", () => {
    it("renders page title and description", () => {
        render(<PaymentTracking />);
        expect(screen.getByText("Payment Tracking")).toBeInTheDocument();
        expect(screen.getByText(/Track term-wise payment status/i)).toBeInTheDocument();
    });

    it("renders all 4 student rows", () => {
        render(<PaymentTracking />);
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
        expect(screen.getByText("Amit Singh")).toBeInTheDocument();
        expect(screen.getByText("Neha Patel")).toBeInTheDocument();
    });

    it("renders Pending badges for unpaid terms and paid dates for completed terms", () => {
        render(<PaymentTracking />);
        // Multiple Pending badges should exist for terms with no paid date
        const pendingBadges = screen.getAllByText("Pending");
        expect(pendingBadges.length).toBeGreaterThan(0);
        // Priya Sharma has all terms paid; check one of her dates
        expect(screen.getByText("2024-04-10")).toBeInTheDocument();
        expect(screen.getByText("2024-12-20")).toBeInTheDocument();
    });

    it("renders term-wise column headers", () => {
        render(<PaymentTracking />);
        expect(screen.getByText("Term 1")).toBeInTheDocument();
        expect(screen.getByText("Term 2")).toBeInTheDocument();
        expect(screen.getByText("Term 3")).toBeInTheDocument();
        expect(screen.getByText("Term 4")).toBeInTheDocument();
        expect(screen.getAllByText("Amount").length).toBe(4);
        expect(screen.getAllByText("Paid").length).toBe(4);
    });

    it("renders filter controls with search and selects", () => {
        render(<PaymentTracking />);
        expect(screen.getByPlaceholderText("Search Student...")).toBeInTheDocument();
        expect(screen.getByText("Academic Year")).toBeInTheDocument();
        expect(screen.getByText("School")).toBeInTheDocument();
        expect(screen.getByText("Payment Status")).toBeInTheDocument();
    });

    it("renders Generate Receipt and Export Report buttons", () => {
        render(<PaymentTracking />);
        expect(screen.getByText(/Generate Receipt/i)).toBeInTheDocument();
        expect(screen.getByText(/Export Report/i)).toBeInTheDocument();
    });
});
