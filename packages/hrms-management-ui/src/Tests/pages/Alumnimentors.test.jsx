import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlumniMentors from '../AlumniMentors';

jest.mock('../../Assets/styles/AlumniMentors.scss', () => { });

describe('AlumniMentors', () => {
    it('renders page header and summary cards', () => {
        render(<AlumniMentors />);
        expect(screen.getByText('Alumni Mentors')).toBeInTheDocument();
        expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
        expect(screen.getByText('Active Mentors')).toBeInTheDocument();
        expect(screen.getByText('Total Applications')).toBeInTheDocument();
    });

    it('renders correct summary counts', () => {
        render(<AlumniMentors />);
        // 3 Pending, 1 Approved, 4 Total
        const values = screen.getAllByRole('paragraph').filter(el => /^\d+$/.test(el.textContent));
        expect(screen.getByText('3')).toBeInTheDocument(); // Pending
        expect(screen.getByText('1')).toBeInTheDocument(); // Approved
        expect(screen.getByText('4')).toBeInTheDocument(); // Total
    });

    it('renders all mentor cards with names and industries', () => {
        render(<AlumniMentors />);
        expect(screen.getByText('Alex Thompson')).toBeInTheDocument();
        expect(screen.getByText('Maria Garcia')).toBeInTheDocument();
        expect(screen.getByText('David Chen')).toBeInTheDocument();
        expect(screen.getByText('Sarah Williams')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Healthcare')).toBeInTheDocument();
    });

    it('shows Approve/Reject buttons only for Pending mentors', () => {
        render(<AlumniMentors />);
        const approveButtons = screen.getAllByText('Approve');
        const rejectButtons = screen.getAllByText('Reject');
        // 3 mentors are Pending
        expect(approveButtons).toHaveLength(3);
        expect(rejectButtons).toHaveLength(3);
    });

    it('shows Assign Mentorship Program only for Approved mentor', () => {
        render(<AlumniMentors />);
        const assignButtons = screen.getAllByText('Assign Mentorship Program');
        expect(assignButtons).toHaveLength(1);
    });

    it('renders LinkedIn and Contact action buttons for every mentor', () => {
        render(<AlumniMentors />);
        expect(screen.getAllByText('LinkedIn')).toHaveLength(4);
        expect(screen.getAllByText('Contact')).toHaveLength(4);
    });
});