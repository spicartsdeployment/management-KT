import { render, screen, fireEvent } from "@testing-library/react";
import Subjects from "./Subjects";

jest.mock("lucide-react", () => ({
    BookOpen: () => <svg />,
    Plus: () => <svg />,
    Edit: () => <svg />,
    Trash2: () => <svg />,
    User: () => <svg />,
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
    TableRow: ({ children }) => <tr>{children}</tr>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));

describe("Subjects", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<Subjects />);
        expect(screen.getByText("Subjects")).toBeInTheDocument();
        expect(screen.getByText(/Manage subjects and assign teachers/i)).toBeInTheDocument();
    });

    it("renders all 8 subject rows with IDs and names", () => {
        render(<Subjects />);
        ["SUB001", "SUB002", "SUB003", "SUB004", "SUB005", "SUB006", "SUB007", "SUB008"].forEach(id => {
            expect(screen.getByText(id)).toBeInTheDocument();
        });
        expect(screen.getAllByText("Mathematics").length).toBe(3);
        expect(screen.getByText("Computer Science")).toBeInTheDocument();
        expect(screen.getByText("Chemistry")).toBeInTheDocument();
    });

    it("renders subject codes and class badges", () => {
        render(<Subjects />);
        expect(screen.getByText("MATH9A")).toBeInTheDocument();
        expect(screen.getByText("CS12A")).toBeInTheDocument();
        expect(screen.getByText("9th A")).toBeInTheDocument();
        expect(screen.getByText("12th A")).toBeInTheDocument();
    });

    it("renders assigned teacher names", () => {
        render(<Subjects />);
        expect(screen.getByText("Dr. Sharma")).toBeInTheDocument();
        expect(screen.getByText("Mrs. Gupta")).toBeInTheDocument();
        expect(screen.getByText("Dr. Singh")).toBeInTheDocument();
        expect(screen.getByText("Ms. Desai")).toBeInTheDocument();
    });

    it("calls alert when Add New Subject is clicked", () => {
        render(<Subjects />);
        fireEvent.click(screen.getByText(/Add New Subject/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new subject/i));
    });

    it("calls alert on Edit and confirm+alert on Delete for first row", () => {
        render(<Subjects />);
        const buttons = screen.getAllByRole("button");
        // buttons[0]=Add New, buttons[1]=Edit SUB001, buttons[2]=Delete SUB001
        fireEvent.click(buttons[1]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/SUB001/));

        fireEvent.click(buttons[2]);
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Deleted subject: SUB001/));
    });
});