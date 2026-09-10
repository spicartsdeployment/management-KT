import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeetingScheduler from '../MeetingScheduler';

jest.mock('../../Assets/styles/MeetingScheduler.scss', () => { });

describe('MeetingScheduler', () => {
    it('renders page header and Schedule Meeting button', () => {
        render(<MeetingScheduler />);
        expect(screen.getByText('Meeting Scheduler')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /schedule meeting/i })).toBeInTheDocument();
    });

    it('renders calendar section with week indicators', () => {
        render(<MeetingScheduler />);
        expect(screen.getByText('Calendar')).toBeInTheDocument();
        expect(screen.getByText(/today's meetings/i)).toBeInTheDocument();
        expect(screen.getByText(/this week/i)).toBeInTheDocument();
    });

    it('renders upcoming meetings summary (max 4 scheduled)', () => {
        render(<MeetingScheduler />);
        expect(screen.getByText('Upcoming This Week')).toBeInTheDocument();
        expect(screen.getByText('Faculty Board Meeting')).toBeInTheDocument();
        expect(screen.getByText('Parent-Teacher Conference')).toBeInTheDocument();
    });

    it('renders all 5 meetings in the full table', () => {
        render(<MeetingScheduler />);
        expect(screen.getAllByText('Faculty Board Meeting').length).toBeGreaterThan(0);
        expect(screen.getByText('Alumni Mentorship Program Kickoff')).toBeInTheDocument();
        expect(screen.getByText('Scholarship Committee Meeting')).toBeInTheDocument();
        expect(screen.getByText('Department Heads Meeting')).toBeInTheDocument();
    });

    it('shows Online/Offline type badges and correct status badges', () => {
        render(<MeetingScheduler />);
        const onlineBadges = screen.getAllByText('Online');
        const offlineBadges = screen.getAllByText('Offline');
        expect(onlineBadges.length).toBeGreaterThanOrEqual(2);
        expect(offlineBadges.length).toBeGreaterThanOrEqual(2);
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('renders View button for all rows and Edit only for Scheduled', () => {
        render(<MeetingScheduler />);
        expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(5);
        // 4 Scheduled meetings get Edit button
        expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(4);
    });
});