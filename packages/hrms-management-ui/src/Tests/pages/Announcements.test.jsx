import { render, screen } from '@testing-library/react';
import Announcements from '../Announcements';

describe('Announcements', () => {
    it('renders page header and Create button', () => {
        render(<Announcements />);
        expect(screen.getByText('Announcements')).toBeInTheDocument();
        expect(screen.getByText('Create and manage school announcements')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create announcement/i })).toBeInTheDocument();
    });

    it('renders all 5 announcement cards', () => {
        render(<Announcements />);
        expect(screen.getByText('Mid-Term Examination Schedule Released')).toBeInTheDocument();
        expect(screen.getByText('Annual Sports Day - March 20, 2026')).toBeInTheDocument();
        expect(screen.getByText('Parent-Teacher Meeting')).toBeInTheDocument();
        expect(screen.getByText('New Library Books Available')).toBeInTheDocument();
        expect(screen.getByText('Science Fair 2026')).toBeInTheDocument();
    });

    it('renders category badges for each announcement', () => {
        render(<Announcements />);
        expect(screen.getAllByText('Academic')).toHaveLength(2);
        expect(screen.getAllByText('Events')).toHaveLength(2);
        expect(screen.getByText('Community')).toBeInTheDocument();
    });

    it('renders target audience and posted by metadata', () => {
        render(<Announcements />);
        expect(screen.getAllByText(/target:/i)).toHaveLength(5);
        expect(screen.getAllByText(/posted by:/i)).toHaveLength(5);
        expect(screen.getByText('Dr. Sarah Mitchell')).toBeInTheDocument();
        expect(screen.getByText('Sports Department')).toBeInTheDocument();
    });

    it('renders View Details and Edit buttons for each card', () => {
        render(<Announcements />);
        expect(screen.getAllByRole('button', { name: /view details/i })).toHaveLength(5);
        expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(5);
    });
});