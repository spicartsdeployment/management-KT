import { render, screen, fireEvent } from "@testing-library/react";
import CreateEvents from "./CreateEvents";

jest.mock("lucide-react", () => ({
    Calendar: () => <svg />,
    Send: () => <svg />,
    MapPin: () => <svg />,
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
jest.mock("../../components/ui/textarea", () => ({ Textarea: (props) => <textarea {...props} /> }));
jest.mock("../../components/ui/label", () => ({ Label: ({ children, htmlFor }) => <label htmlFor={htmlFor}>{children}</label> }));
jest.mock("../../components/ui/select", () => ({
    Select: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children, id }) => <div id={id}>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
}));

describe("CreateEvents", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<CreateEvents />);
        expect(screen.getByText("Create Event")).toBeInTheDocument();
        expect(screen.getByText(/Create and schedule school events/i)).toBeInTheDocument();
    });

    it("renders all required form input fields", () => {
        render(<CreateEvents />);
        expect(screen.getByPlaceholderText("Enter event title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter event description...")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter venue location")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter organizer name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter max participants")).toBeInTheDocument();
    });

    it("renders all form labels", () => {
        render(<CreateEvents />);
        expect(screen.getByText("Event Title *")).toBeInTheDocument();
        expect(screen.getByText("Description *")).toBeInTheDocument();
        expect(screen.getByText("Event Type *")).toBeInTheDocument();
        expect(screen.getByText("Category *")).toBeInTheDocument();
        expect(screen.getByText("Venue *")).toBeInTheDocument();
        expect(screen.getByText("Organizer *")).toBeInTheDocument();
    });

    it("renders select placeholders for Event Type, Category, and Status", () => {
        render(<CreateEvents />);
        expect(screen.getByText("Select type")).toBeInTheDocument();
        expect(screen.getByText("Select category")).toBeInTheDocument();
        expect(screen.getByText("Select status")).toBeInTheDocument();
    });

    it("calls alert when Create Event button is clicked", () => {
        render(<CreateEvents />);
        fireEvent.click(screen.getByText(/Create Event/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Creating event/i));
    });

    it("calls alert when Save as Draft button is clicked", () => {
        render(<CreateEvents />);
        fireEvent.click(screen.getByText(/Save as Draft/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Saving event as draft/i));
    });
});