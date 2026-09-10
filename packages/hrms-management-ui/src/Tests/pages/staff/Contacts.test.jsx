import { render, screen, fireEvent } from "@testing-library/react";
import Contacts from "./Contacts";

jest.mock("lucide-react", () => ({
    Phone: () => <svg />,
    Search: () => <svg />,
    Plus: () => <svg />,
    Mail: () => <svg />,
    Edit: () => <svg />,
    Eye: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, style }) => <div style={style}>{children}</div>,
    CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className }) => (
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
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));

describe("Contacts", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<Contacts />);
        expect(screen.getByText("Contacts")).toBeInTheDocument();
        expect(screen.getByText(/Internal contact directory/i)).toBeInTheDocument();
    });

    it("renders all 6 contact cards with names and roles", () => {
        render(<Contacts />);
        expect(screen.getByText("Principal Dr. Verma")).toBeInTheDocument();
        expect(screen.getByText("Vice Principal Mrs. Singh")).toBeInTheDocument();
        expect(screen.getByText("Admission Office")).toBeInTheDocument();
        expect(screen.getByText("Accounts Department")).toBeInTheDocument();
        expect(screen.getByText("Transport Coordinator")).toBeInTheDocument();
        expect(screen.getByText("School Counselor")).toBeInTheDocument();
    });

    it("renders email and phone links correctly", () => {
        render(<Contacts />);
        const emailLink = screen.getByText("principal@school.edu");
        expect(emailLink.closest("a")).toHaveAttribute("href", "mailto:principal@school.edu");

        const phoneLink = screen.getByText("+91 11 2345 6789");
        expect(phoneLink.closest("a")).toHaveAttribute("href", "tel:+91 11 2345 6789");
    });

    it("calls alert on Add New Contact click", () => {
        render(<Contacts />);
        fireEvent.click(screen.getByText(/Add New Contact/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new contact/i));
    });

    it("calls alert with correct contact ID on View and Edit", () => {
        render(<Contacts />);
        const viewButtons = screen.getAllByText("View");
        fireEvent.click(viewButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/CNT001/));

        const editButtons = screen.getAllByText("Edit");
        fireEvent.click(editButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/CNT001/));
    });

    it("renders filter controls with search and selects", () => {
        render(<Contacts />);
        expect(screen.getByPlaceholderText("Search contacts...")).toBeInTheDocument();
        expect(screen.getByText("Department/Role")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });
});