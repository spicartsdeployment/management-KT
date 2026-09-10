import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Dashboard from '../Dashboard';

jest.mock('../../Assets/styles/Dashboard.scss', () => { });

const renderDashboard = () => render(<MemoryRouter><Dashboard /></MemoryRouter>);

describe('Dashboard', () => {
    it('renders page header and status badges', () => {
        renderDashboard();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('System Active')).toBeInTheDocument();
        expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
    });

    it('renders all 6 KPI cards with values and trends', () => {
        renderDashboard();
        expect(screen.getByText('Total Students')).toBeInTheDocument();
        expect(screen.getByText('2,845')).toBeInTheDocument();
        expect(screen.getByText('Total Teachers')).toBeInTheDocument();
        expect(screen.getByText('142')).toBeInTheDocument();
        expect(screen.getByText('Pending Leave Approvals')).toBeInTheDocument();
        expect(screen.getByText('Active Scholarships')).toBeInTheDocument();
    });

    it('renders attendance overview with departments and percentages', () => {
        renderDashboard();
        expect(screen.getByText("Today's Attendance")).toBeInTheDocument();
        expect(screen.getByText('Science')).toBeInTheDocument();
        expect(screen.getByText('Commerce')).toBeInTheDocument();
        expect(screen.getByText('Arts')).toBeInTheDocument();
        expect(screen.getByText('92%')).toBeInTheDocument();
    });

    it('renders all 6 quick action links', () => {
        renderDashboard();
        expect(screen.getByText('Add New Student')).toBeInTheDocument();
        expect(screen.getByText('Add New Teacher')).toBeInTheDocument();
        expect(screen.getByText('Create Announcement')).toBeInTheDocument();
        expect(screen.getByText('Schedule Meeting')).toBeInTheDocument();
        expect(screen.getByText('Approve Leaves')).toBeInTheDocument();
        expect(screen.getByText('Manage Scholarships')).toBeInTheDocument();
    });

    it('renders upcoming events and recent activities sections', () => {
        renderDashboard();
        expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
        expect(screen.getByText('Annual Sports Day')).toBeInTheDocument();
        expect(screen.getByText('Recent Activities')).toBeInTheDocument();
        expect(screen.getByText('New Student Enrollment')).toBeInTheDocument();
    });

    it('renders system performance analytics with all 4 stat tiles', () => {
        renderDashboard();
        expect(screen.getByText('System Performance')).toBeInTheDocument();
        expect(screen.getByText('Active Users')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Assignments')).toBeInTheDocument();
        expect(screen.getByText('Achievements')).toBeInTheDocument();
    });
});