import { render, screen, fireEvent } from "@testing-library/react";
import RoutesDrivers from "./RoutesDrivers";

jest.mock("lucide-react", () => ({
    Bus: () => <svg data-testid="icon-bus" />,
    Search: () => <svg />,
    Plus: () => <svg />,
    MapPin: () => <svg />,
    User: () => <svg />,
    Route: () => <svg />,
    Clock: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children }) => <div>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/button", () => ({
    Button: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>{children}</button>
    ),
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className, variant }) => <span className={className}>{children}</span>,
}));
jest.mock("../../components/ui/table", () => ({
    Table: ({ children }) => <table>{children}</table>,
    TableBody: ({ children }) => <tbody>{children}</tbody>,
    TableCell: ({ children, className }) => <td className={className}>{children}</td>,
    TableHead: ({ children }) => <th>{children}</th>,
    TableHeader: ({ children }) => <thead>{children}</thead>,
    TableRow: ({ children, className }) => <tr className={className}>{children}</tr>,
}));
jest.mock("../../components/ui/tabs", () => ({
    Tabs: ({ children, defaultValue }) => <div data-default={defaultValue}>{children}</div>,
    TabsList: ({ children, className }) => <div className={className}>{children}</div>,
    TabsTrigger: ({ children, value }) => <button data-value={value}>{children}</button>,
    TabsContent: ({ children, value }) => <div data-tab={value}>{children}</div>,
}));

describe("RoutesDrivers", () => {
    beforeEach(() => jest.spyOn(window, "alert").mockImplementation(() => { }));
    afterEach(() => jest.restoreAllMocks());

    it("renders page title and description", () => {
        render(<RoutesDrivers />);
        expect(screen.getByText("Routes & Drivers")).toBeInTheDocument();
        expect(screen.getByText(/Manage buses, routes, and driver information/i)).toBeInTheDocument();
    });

    it("renders all three tab triggers", () => {
        render(<RoutesDrivers />);
        expect(screen.getByText("Buses")).toBeInTheDocument();
        expect(screen.getByText("Routes")).toBeInTheDocument();
        expect(screen.getByText("Drivers")).toBeInTheDocument();
    });

    it("renders bus fleet data correctly", () => {
        render(<RoutesDrivers />);
        expect(screen.getByText("BUS101")).toBeInTheDocument();
        expect(screen.getByText("DL-1234")).toBeInTheDocument();
        expect(screen.getByText("Rajesh Kumar")).toBeInTheDocument();
    });

    it("renders route data correctly", () => {
        render(<RoutesDrivers />);
        expect(screen.getByText("Connaught Place - School")).toBeInTheDocument();
        expect(screen.getByText("12.5 km")).toBeInTheDocument();
        expect(screen.getByText("35 mins")).toBeInTheDocument();
    });

    it("renders driver data correctly", () => {
        render(<RoutesDrivers />);
        expect(screen.getByText("DRV001")).toBeInTheDocument();
        expect(screen.getByText("DL07-20150012345")).toBeInTheDocument();
        expect(screen.getByText("+91 98765 43210")).toBeInTheDocument();
    });

    it("calls alert on Add New, Edit, and Map button clicks", () => {
        render(<RoutesDrivers />);
        fireEvent.click(screen.getByText("Add New"));
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/add new/i));

        const editButtons = screen.getAllByText("Edit");
        fireEvent.click(editButtons[0]);
        expect(window.alert).toHaveBeenCalled();

        const mapButtons = screen.getAllByText("Map");
        fireEvent.click(mapButtons[0]);
        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/map view/i));
    });
});