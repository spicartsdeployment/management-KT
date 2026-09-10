import { render, screen, fireEvent } from "@testing-library/react";
import LeavePolicy from "./LeavePolicy";

jest.mock("lucide-react", () => ({
    FileText: () => <svg />,
    Plus: () => <svg />,
    Edit: () => <svg />,
    Trash2: () => <svg />,
    CheckCircle2: ({ className }) => <svg data-testid="icon-check" className={className} />,
    XCircle: ({ className }) => <svg data-testid="icon-xcircle" className={className} />,
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

describe("LeavePolicy", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<LeavePolicy />);
        expect(screen.getByText("Leave Policy")).toBeInTheDocument();
        expect(screen.getByText(/Define and manage leave policies/i)).toBeInTheDocument();
    });

    it("renders all 5 policy rows with correct IDs and leave types", () => {
        render(<LeavePolicy />);
        ["POL001", "POL002", "POL003", "POL004", "POL005"].forEach((id) => {
            expect(screen.getByText(id)).toBeInTheDocument();
        });
        expect(screen.getAllByText("Sick Leave").length).toBe(2);
        expect(screen.getAllByText("Casual Leave").length).toBe(2);
        expect(screen.getByText("Maternity Leave")).toBeInTheDocument();
    });

    it("renders Paid badges and correct total days", () => {
        render(<LeavePolicy />);
        expect(screen.getAllByText("Paid").length).toBe(5);
        expect(screen.getByText("90 days")).toBeInTheDocument();
        expect(screen.getByText("12 days")).toBeInTheDocument();
    });

    it("renders CheckCircle2 and XCircle icons for allow_half_day and requires_approval", () => {
        render(<LeavePolicy />);
        // POL003 has allow_half_day=false → XCircle; all others have it true → CheckCircle2
        const checkIcons = screen.getAllByTestId("icon-check");
        const xIcons = screen.getAllByTestId("icon-xcircle");
        expect(checkIcons.length).toBeGreaterThan(0);
        expect(xIcons.length).toBeGreaterThan(0);
    });

    it("calls alert when Add New Policy button is clicked", () => {
        render(<LeavePolicy />);
        fireEvent.click(screen.getByText(/Add New Policy/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new leave policy/i));
    });

    it("calls alert on Edit and confirm+delete on Delete buttons", () => {
        render(<LeavePolicy />);
        const buttons = screen.getAllByRole("button");
        // buttons[0] = Add New Policy, buttons[1] = Edit POL001, buttons[2] = Delete POL001
        fireEvent.click(buttons[1]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/POL001/));

        fireEvent.click(buttons[2]);
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Deleted leave policy: POL001/));
    });
});
