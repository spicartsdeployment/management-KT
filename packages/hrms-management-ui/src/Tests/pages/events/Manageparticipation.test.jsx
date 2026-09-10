import { render, screen, fireEvent } from "@testing-library/react";
import ManageParticipation from "./ManageParticipation";

jest.mock("lucide-react", () => ({
    Calendar: () => <svg />,
    Search: () => <svg />,
    Users: () => <svg />,
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

describe("ManageParticipation", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<ManageParticipation />);
        expect(screen.getByText("Manage Participation")).toBeInTheDocument();
        expect(screen.getByText(/Track event registrations/i)).toBeInTheDocument();
    });

    it("renders all 4 event rows with titles and IDs", () => {
        render(<ManageParticipation />);
        expect(screen.getByText("EVT001")).toBeInTheDocument();
        expect(screen.getByText("Annual Sports Day")).toBeInTheDocument();
        expect(screen.getByText("Science Exhibition")).toBeInTheDocument();
        expect(screen.getByText("Cultural Fest")).toBeInTheDocument();
        expect(screen.getByText("Coding Competition")).toBeInTheDocument();
    });

    it("renders participant counts and computed percentages", () => {
        render(<ManageParticipation />);
        expect(screen.getByText("342/500")).toBeInTheDocument();
        expect(screen.getByText("156/200")).toBeInTheDocument();
        expect(screen.getByText("68%")).toBeInTheDocument();  // 342/500
        expect(screen.getByText("78%")).toBeInTheDocument();  // 156/200
        expect(screen.getByText("96%")).toBeInTheDocument();  // 289/300 Cultural Fest
    });

    it("renders status badges correctly", () => {
        render(<ManageParticipation />);
        expect(screen.getAllByText("Published").length).toBe(3);
        expect(screen.getByText("Ongoing")).toBeInTheDocument();
    });

    it("renders filter controls with search and selects", () => {
        render(<ManageParticipation />);
        expect(screen.getByPlaceholderText("Search events...")).toBeInTheDocument();
        expect(screen.getByText("Event Type")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Date Range")).toBeInTheDocument();
    });

    it("calls alert with correct event ID on View button click", () => {
        render(<ManageParticipation />);
        const viewButtons = screen.getAllByText("View");
        fireEvent.click(viewButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/EVT001/));

        fireEvent.click(viewButtons[2]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/EVT003/));
    });
});