import { render, screen } from '@testing-library/react';
import LeaveApprovals from '../LeaveApprovals';

jest.mock('../../Assets/styles/LeaveApprovals.scss', () => { });

describe('LeaveApprovals', () => {
    it('renders page header', () => {
        render(<LeaveApprovals />);
        expect(screen.getByText('Leave Approvals')).toBeInTheDocument();
        expect(screen.getByText('Review and approve leave requests from staff members')).toBeInTheDocument();
    });

    it('renders correct summary card counts', () => {
        render(<LeaveApprovals />);
        // 3 Pending, 2 Approved, 1 Rejected
        expect(screen.getByText('Pending Requests')).toBeInTheDocument();
        expect(screen.getByText('Approved This Month')).toBeInTheDocument();
        expect(screen.getByText('Rejected This Month')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders all 6 leave requests in the table', () => {
        render(<LeaveApprovals />);
        expect(screen.getByText('Dr. Robert Anderson')).toBeInTheDocument();
        expect(screen.getByText('Ms. Jennifer Lee')).toBeInTheDocument();
        expect(screen.getByText('Prof. David Kumar')).toBeInTheDocument();
        expect(screen.getByText('Ms. Emily Brown')).toBeInTheDocument();
        expect(screen.getByText('Mr. James Wilson')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Martinez')).toBeInTheDocument();
    });

    it('shows Approve and Reject buttons only for Pending requests', () => {
        render(<LeaveApprovals />);
        expect(screen.getAllByRole('button', { name: /approve/i })).toHaveLength(3);
        expect(screen.getAllByRole('button', { name: /reject/i })).toHaveLength(3);
    });

    it('shows correct status labels for non-pending rows', () => {
        render(<LeaveApprovals />);
        // 2 Approved rows show "Approved" text, 1 Rejected shows "Rejected" text
        const approvedLabels = screen.getAllByText('Approved');
        expect(approvedLabels.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

    it('renders results count footer', () => {
        render(<LeaveApprovals />);
        expect(screen.getByText(/showing/i)).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });
});