import { render, screen, fireEvent } from "@testing-library/react";
import Classes from "./Classes";

jest.mock("lucide-react", () => ({
    GraduationCap: () => <svg />,
    Plus: () => <svg />,
    Edit: () => <svg />,
    Trash2: () => <svg />,
    Users: () => <svg />,
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

describe("Classes", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<Classes />);
        expect(screen.getByText("Classes")).toBeInTheDocument();
        expect(screen.getByText(/Manage class sections and assign class teachers/i)).toBeInTheDocument();
    });

    it("renders all 8 class rows with IDs and teacher names", () => {
        render(<Classes />);
        ["CLS001", "CLS002", "CLS003", "CLS004", "CLS005", "CLS006", "CLS007", "CLS008"].forEach(id => {
            expect(screen.getByText(id)).toBeInTheDocument();
        });
        expect(screen.getByText("Dr. Sharma")).toBeInTheDocument();
        expect(screen.getByText("Ms. Desai")).toBeInTheDocument();
    });

    it("renders class and section badges correctly", () => {
        render(<Classes />);
        expect(screen.getAllByText(/Class 9th/).length).toBe(2);
        expect(screen.getAllByText(/Class 12th/).length).toBe(2);
        expect(screen.getAllByText(/Section A/).length).toBe(4);
        expect(screen.getAllByText(/Section B/).length).toBe(4);
    });

    it("renders student count badges", () => {
        render(<Classes />);
        expect(screen.getByText("42 students")).toBeInTheDocument();
        expect(screen.getByText("45 students")).toBeInTheDocument();
        expect(screen.getByText("33 students")).toBeInTheDocument();
    });

    it("calls alert when Add New Class button is clicked", () => {
        render(<Classes />);
        fireEvent.click(screen.getByText(/Add New Class/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new class/i));
    });

    it("calls alert on Edit and confirm+alert on Delete for first row", () => {
        render(<Classes />);
        const buttons = screen.getAllByRole("button");
        // buttons[0]=Add New, buttons[1]=Edit CLS001, buttons[2]=Delete CLS001
        fireEvent.click(buttons[1]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/CLS001/));

        fireEvent.click(buttons[2]);
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Deleted class: CLS001/));
    });
});