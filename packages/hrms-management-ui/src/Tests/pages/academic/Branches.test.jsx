import { render, screen, fireEvent } from "@testing-library/react";
import Branches from "./Branches";

jest.mock("lucide-react", () => ({
    MapPin: () => <svg />,
    Plus: () => <svg />,
    Edit: () => <svg />,
    Trash2: () => <svg />,
    Phone: () => <svg />,
    Mail: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }) => <div className={className}>{children}</div>,
    CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className, size, variant }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));

describe("Branches", () => {
    beforeEach(() => {
        jest.spyOn(window, "alert").mockImplementation(() => { });
        jest.spyOn(window, "confirm").mockImplementation(() => true);
    });
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<Branches />);
        expect(screen.getByText("Branches")).toBeInTheDocument();
        expect(screen.getByText(/Manage school branches and locations/i)).toBeInTheDocument();
    });

    it("renders all 4 branch cards with names and IDs", () => {
        render(<Branches />);
        expect(screen.getByText("Main Campus")).toBeInTheDocument();
        expect(screen.getByText("North Branch")).toBeInTheDocument();
        expect(screen.getByText("East Branch")).toBeInTheDocument();
        expect(screen.getByText("South Branch")).toBeInTheDocument();
        expect(screen.getByText("BRN001")).toBeInTheDocument();
        expect(screen.getByText("BRN004")).toBeInTheDocument();
    });

    it("renders contact links with correct href attributes", () => {
        render(<Branches />);
        const phoneLink = screen.getByText("+91 11 2345 6789");
        expect(phoneLink.closest("a")).toHaveAttribute("href", "tel:+91 11 2345 6789");
        const emailLink = screen.getByText("main@school.edu");
        expect(emailLink.closest("a")).toHaveAttribute("href", "mailto:main@school.edu");
    });

    it("renders address and city/state for each branch", () => {
        render(<Branches />);
        expect(screen.getByText("Sector 15, Connaught Place")).toBeInTheDocument();
        expect(screen.getAllByText("New Delhi, Delhi").length).toBe(4);
        expect(screen.getByText("Mayur Vihar Phase 2")).toBeInTheDocument();
    });

    it("calls alert when Add New Branch button is clicked", () => {
        render(<Branches />);
        fireEvent.click(screen.getByText(/Add New Branch/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new branch/i));
    });

    it("calls alert on Edit and confirm+alert on Delete", () => {
        render(<Branches />);
        const buttons = screen.getAllByRole("button");
        // buttons[0]=Add New, buttons[1]=Edit BRN001, buttons[2]=Delete BRN001
        fireEvent.click(buttons[1]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/BRN001/));

        fireEvent.click(buttons[2]);
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Deleted branch: BRN001/));
    });
});