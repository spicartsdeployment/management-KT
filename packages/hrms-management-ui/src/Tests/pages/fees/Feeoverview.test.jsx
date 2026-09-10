import { render, screen, fireEvent } from "@testing-library/react";
import FeeOverview from "./FeeOverview";

jest.mock("lucide-react", () => ({
    DollarSign: () => <svg />,
    Search: () => <svg />,
    Filter: () => <svg />,
    Download: () => <svg />,
    TrendingUp: () => <svg />,
    Users: () => <svg />,
    CreditCard: () => <svg />,
    AlertCircle: () => <svg />,
    Eye: () => <svg />,
    Edit: () => <svg />,
    X: () => <svg />,
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
    TableCell: ({ children, className, style }) => <td className={className} style={style}>{children}</td>,
    TableHead: ({ children }) => <th>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));
jest.mock("../../components/ui/dialog", () => ({
    Dialog: ({ children, open }) => open ? <div data-testid="dialog">{children}</div> : null,
    DialogContent: ({ children, className }) => <div className={className}>{children}</div>,
    DialogHeader: ({ children }) => <div>{children}</div>,
    DialogTitle: ({ children, className }) => <h3 className={className}>{children}</h3>,
    DialogDescription: ({ children }) => <p>{children}</p>,
    DialogTrigger: ({ children }) => <>{children}</>,
}));

describe("FeeOverview", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<FeeOverview />);
        expect(screen.getByText("Fee Overview")).toBeInTheDocument();
        expect(screen.getByText(/Comprehensive view of all student fee details/i)).toBeInTheDocument();
    });

    it("renders all 4 summary stat cards with values", () => {
        render(<FeeOverview />);
        expect(screen.getByText("Total Collected")).toBeInTheDocument();
        expect(screen.getByText("₹21,50,000")).toBeInTheDocument();
        expect(screen.getByText("Pending Amount")).toBeInTheDocument();
        expect(screen.getByText("₹8,75,000")).toBeInTheDocument();
        expect(screen.getByText("Active Students")).toBeInTheDocument();
        expect(screen.getByText("Collections This Month")).toBeInTheDocument();
    });

    it("renders all 5 student fee rows with payment statuses", () => {
        render(<FeeOverview />);
        expect(screen.getByText("Rahul Kumar")).toBeInTheDocument();
        expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
        expect(screen.getByText("Amit Singh")).toBeInTheDocument();
        expect(screen.getAllByText("Completed").length).toBe(2);
        expect(screen.getAllByText("Partial").length).toBe(2);
        expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("opens dialog with correct student details on View click", () => {
        render(<FeeOverview />);
        const viewButtons = screen.getAllByText("View");
        fireEvent.click(viewButtons[0]); // Rahul Kumar
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByText(/FEE001/)).toBeInTheDocument();
        expect(screen.getAllByText("Rahul Kumar").length).toBeGreaterThan(0);
    });

    it("calls alert on Edit button click", () => {
        render(<FeeOverview />);
        const editButtons = screen.getAllByText("Edit");
        fireEvent.click(editButtons[1]); // Priya Sharma FEE002
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Priya Sharma/));
    });

    it("calls alert on Export Report click and renders filter controls", () => {
        render(<FeeOverview />);
        fireEvent.click(screen.getByText(/Export Report/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Downloading/i));
        expect(screen.getByPlaceholderText(/Search by Student ID/i)).toBeInTheDocument();
        expect(screen.getByText("Select School")).toBeInTheDocument();
        expect(screen.getByText("Select Class")).toBeInTheDocument();
    });
});