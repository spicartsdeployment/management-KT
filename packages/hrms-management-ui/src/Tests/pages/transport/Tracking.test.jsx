import { render, screen } from "@testing-library/react";
import Tracking from "./Tracking";

jest.mock("lucide-react", () => ({
    Bus: () => <svg />,
    MapPin: () => <svg />,
    Clock: () => <svg />,
    TrendingUp: () => <svg />,
    Gauge: () => <svg />,
}));

jest.mock("../../components/ui/card", () => ({
    Card: ({ children, className }) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }) => <div className={className}>{children}</div>,
    CardHeader: ({ children }) => <div>{children}</div>,
    CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));
jest.mock("../../components/ui/badge", () => ({
    Badge: ({ children, className }) => <span className={className}>{children}</span>,
}));

describe("Tracking", () => {
    it("renders page title and description", () => {
        render(<Tracking />);
        expect(screen.getByText("Bus Tracking & Analytics")).toBeInTheDocument();
        expect(screen.getByText(/Real-time location tracking/i)).toBeInTheDocument();
    });

    it("renders all live tracking bus cards with correct data", () => {
        render(<Tracking />);
        expect(screen.getByText("DL-1234")).toBeInTheDocument();
        expect(screen.getByText("DL-5678")).toBeInTheDocument();
        expect(screen.getByText("DL-9012")).toBeInTheDocument();
        expect(screen.getByText("India Gate")).toBeInTheDocument();
        expect(screen.getByText("Rajendra Place")).toBeInTheDocument();
    });

    it("renders correct statuses for buses", () => {
        render(<Tracking />);
        const inTransit = screen.getAllByText("In Transit");
        const atStop = screen.getAllByText("At Stop");
        expect(inTransit.length).toBe(2);
        expect(atStop.length).toBe(1);
    });

    it("renders analytics section with all bus IDs", () => {
        render(<Tracking />);
        expect(screen.getByText("BUS101")).toBeInTheDocument();
        expect(screen.getByText("BUS102")).toBeInTheDocument();
        expect(screen.getByText("BUS103")).toBeInTheDocument();
        expect(screen.getAllByText("Last 7 Days Performance").length).toBe(3);
    });

    it("renders efficiency badges correctly", () => {
        render(<Tracking />);
        expect(screen.getByText("92% Efficient")).toBeInTheDocument();
        expect(screen.getByText("88% Efficient")).toBeInTheDocument();
        expect(screen.getByText("94% Efficient")).toBeInTheDocument();
    });

    it("renders GPS coordinates and speed for live buses", () => {
        render(<Tracking />);
        expect(screen.getByText("28.6139, 77.2090")).toBeInTheDocument();
        expect(screen.getByText("35 km/h")).toBeInTheDocument();
        expect(screen.getByText("0 km/h")).toBeInTheDocument();
    });
});