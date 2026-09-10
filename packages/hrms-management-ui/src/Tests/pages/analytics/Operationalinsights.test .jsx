import { render, screen } from "@testing-library/react";
import OperationalInsights from "./OperationalInsights";

jest.mock("lucide-react", () => ({
    BarChart3: () => <svg />,
    TrendingUp: () => <svg />,
    Users: () => <svg />,
    GraduationCap: () => <svg />,
    DollarSign: () => <svg />,
    Calendar: () => <svg />,
    Award: () => <svg />,
    AlertCircle: () => <svg />,
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

describe("OperationalInsights", () => {
    it("renders page title and description", () => {
        render(<OperationalInsights />);
        expect(screen.getByText("Operational Insights")).toBeInTheDocument();
        expect(screen.getByText(/Comprehensive analytics and operational metrics/i)).toBeInTheDocument();
    });

    it("renders all 4 key metric cards with correct values and trends", () => {
        render(<OperationalInsights />);
        expect(screen.getByText("Total Enrollment")).toBeInTheDocument();
        expect(screen.getByText("2,987")).toBeInTheDocument();
        expect(screen.getByText("+12.5%")).toBeInTheDocument();
        expect(screen.getByText("Faculty Members")).toBeInTheDocument();
        expect(screen.getByText("142")).toBeInTheDocument();
        expect(screen.getByText("Revenue (Monthly)")).toBeInTheDocument();
        expect(screen.getByText("₹54.5L")).toBeInTheDocument();
        expect(screen.getByText("Active Events")).toBeInTheDocument();
        expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("renders all 3 departmental performance cards with stats and badges", () => {
        render(<OperationalInsights />);
        expect(screen.getByText("Science Department")).toBeInTheDocument();
        expect(screen.getByText("Excellent")).toBeInTheDocument();
        expect(screen.getByText("92%")).toBeInTheDocument();
        expect(screen.getByText("Commerce Department")).toBeInTheDocument();
        expect(screen.getByText("Good")).toBeInTheDocument();
        expect(screen.getByText("Arts Department")).toBeInTheDocument();
        expect(screen.getByText("Average")).toBeInTheDocument();
        expect(screen.getByText("79%")).toBeInTheDocument();
    });

    it("renders Recent Achievements section with all 3 items", () => {
        render(<OperationalInsights />);
        expect(screen.getByText("Recent Achievements")).toBeInTheDocument();
        expect(screen.getByText("Top 10 School Ranking")).toBeInTheDocument();
        expect(screen.getByText(/National Education Rankings 2024/i)).toBeInTheDocument();
        expect(screen.getByText("100% Board Exam Pass Rate")).toBeInTheDocument();
        expect(screen.getByText("Sports Excellence Award")).toBeInTheDocument();
    });

    it("renders Action Items section with all 3 pending items", () => {
        render(<OperationalInsights />);
        expect(screen.getByText("Action Items")).toBeInTheDocument();
        expect(screen.getByText("23 Leave Approvals Pending")).toBeInTheDocument();
        expect(screen.getByText(/immediate attention/i)).toBeInTheDocument();
        expect(screen.getByText("12 Alumni Mentor Approvals")).toBeInTheDocument();
        expect(screen.getByText("8 Grievance Cases Open")).toBeInTheDocument();
    });
});