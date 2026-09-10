import { render, screen, fireEvent } from "@testing-library/react";
import AssignResolve from "./AssignResolve";

jest.mock("lucide-react", () => ({
    MessageCircle: () => <svg />,
    Send: () => <svg />,
    User: () => <svg />,
    Calendar: () => <svg />,
    MessageSquare: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, style }) => <div style={style}>{children}</div>,
    CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, variant }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../components/ui/textarea", () => ({
    Textarea: (props) => <textarea {...props} />,
}));
jest.mock("../../components/ui/select", () => ({
    Select: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children, style }) => <div style={style}>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
}));
jest.mock("../../components/ui/label", () => ({
    Label: ({ children, className }) => <label className={className}>{children}</label>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

describe("AssignResolve", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and grievance ID", () => {
        render(<AssignResolve />);
        expect(screen.getByText("Assign & Resolve Grievance")).toBeInTheDocument();
        expect(screen.getByText(/GRV004/)).toBeInTheDocument();
    });

    it("renders grievance details: student info, category, subject, description", () => {
        render(<AssignResolve />);
        expect(screen.getByText("Neha Patel")).toBeInTheDocument();
        expect(screen.getByText("STU2024004")).toBeInTheDocument();
        expect(screen.getByText("Harassment")).toBeInTheDocument();
        expect(screen.getByText("Bullying Complaint")).toBeInTheDocument();
        expect(screen.getByText(/continuous bullying/i)).toBeInTheDocument();
    });

    it("renders priority badge and current status", () => {
        render(<AssignResolve />);
        expect(screen.getByText("Critical")).toBeInTheDocument();
        expect(screen.getByText("Open")).toBeInTheDocument();
        expect(screen.getByText("Principal")).toBeInTheDocument();
    });

    it("renders both existing comments with commenter names and status badges", () => {
        render(<AssignResolve />);
        expect(screen.getByText("Principal")).toBeInTheDocument();
        expect(screen.getByText("Class Teacher")).toBeInTheDocument();
        expect(screen.getByText("Noted")).toBeInTheDocument();
        expect(screen.getByText("Update")).toBeInTheDocument();
    });

    it("calls alert when Post Comment button is clicked", () => {
        render(<AssignResolve />);
        fireEvent.click(screen.getByText(/Post Comment/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Posting comment/i));
    });

    it("calls alert on Update Grievance and confirm+alert on Mark as Resolved", () => {
        render(<AssignResolve />);
        fireEvent.click(screen.getByText("Update Grievance"));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Updating grievance/i));

        fireEvent.click(screen.getByText("Mark as Resolved"));
        expect(window.confirm).toHaveBeenCalledWith("Mark this grievance as resolved?");
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/marked as resolved/i));
    });
});