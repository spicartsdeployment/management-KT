import { render, screen, fireEvent } from "@testing-library/react";
import CreateAnnouncement from "./CreateAnnouncement";

jest.mock("lucide-react", () => ({
    Megaphone: () => <svg />,
    Users: () => <svg />,
    Calendar: () => <svg />,
    Upload: () => <svg />,
    Send: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, style }) => <div style={style}>{children}</div>,
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
jest.mock("../../components/ui/badge", () => ({ Badge: ({ children, className }) => <span className={className}>{children}</span> }));
jest.mock("../../components/ui/switch", () => ({
    Switch: ({ id, defaultChecked }) => <input type="checkbox" id={id} defaultChecked={defaultChecked} />,
}));
jest.mock("../../components/ui/select", () => ({
    Select: ({ children }) => <div>{children}</div>,
    SelectContent: ({ children }) => <div>{children}</div>,
    SelectItem: ({ children, value }) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children, id }) => <div id={id}>{children}</div>,
    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
}));

describe("CreateAnnouncement", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<CreateAnnouncement />);
        expect(screen.getByText("Create Announcement")).toBeInTheDocument();
        expect(screen.getByText(/Broadcast important information/i)).toBeInTheDocument();
    });

    it("renders all required form input fields and labels", () => {
        render(<CreateAnnouncement />);
        expect(screen.getByPlaceholderText("Enter announcement title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter detailed announcement content...")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("e.g., exam, grade-10, science")).toBeInTheDocument();
        expect(screen.getByText("Title *")).toBeInTheDocument();
        expect(screen.getByText("Content *")).toBeInTheDocument();
        expect(screen.getByText("Category *")).toBeInTheDocument();
        expect(screen.getByText("Priority *")).toBeInTheDocument();
    });

    it("renders sidebar cards with Target Audience and Schedule sections", () => {
        render(<CreateAnnouncement />);
        expect(screen.getByText("Target Audience")).toBeInTheDocument();
        expect(screen.getByText("User Type *")).toBeInTheDocument();
        expect(screen.getByText("Specific Audience")).toBeInTheDocument();
        expect(screen.getByText("Schedule & Status")).toBeInTheDocument();
        expect(screen.getByText("Pin Announcement")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders upload section with file type info", () => {
        render(<CreateAnnouncement />);
        expect(screen.getByText(/Click to upload or drag and drop/i)).toBeInTheDocument();
        expect(screen.getByText(/PDF, DOC, DOCX, JPG, PNG/i)).toBeInTheDocument();
    });

    it("calls alert when Publish Announcement button is clicked", () => {
        render(<CreateAnnouncement />);
        fireEvent.click(screen.getByText(/Publish Announcement/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Publishing announcement/i));
    });

    it("calls alert when Save as Draft button is clicked", () => {
        render(<CreateAnnouncement />);
        fireEvent.click(screen.getByText(/Save as Draft/i));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Saving announcement as draft/i));
    });
});