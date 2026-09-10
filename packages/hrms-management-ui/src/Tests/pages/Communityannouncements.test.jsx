import { render, screen } from '@testing-library/react';
import CommunityAnnouncements from '../CommunityAnnouncements';

jest.mock('../../Assets/styles/CommunityAnnouncements.scss', () => { });

describe('CommunityAnnouncements', () => {
    it('renders header and Create Post button', () => {
        render(<CommunityAnnouncements />);
        expect(screen.getByText('Community Announcements')).toBeInTheDocument();
        expect(screen.getByText('Share updates and engage with the school community')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
    });

    it('renders all 5 community posts with titles', () => {
        render(<CommunityAnnouncements />);
        expect(screen.getByText('Welcome New Students!')).toBeInTheDocument();
        expect(screen.getByText('Alumni Success Stories')).toBeInTheDocument();
        expect(screen.getByText('Community Service Opportunity')).toBeInTheDocument();
        expect(screen.getByText('Parent Workshop on Digital Learning')).toBeInTheDocument();
        expect(screen.getByText('School Garden Project Launch')).toBeInTheDocument();
    });

    it('renders post metadata: author, audience, likes, and comments', () => {
        render(<CommunityAnnouncements />);
        expect(screen.getByText('Principal Office')).toBeInTheDocument();
        expect(screen.getByText('45 likes')).toBeInTheDocument();
        expect(screen.getByText('12 comments')).toBeInTheDocument();
    });

    it('renders attachment badges only for posts that have attachments', () => {
        render(<CommunityAnnouncements />);
        expect(screen.getByText('orientation-schedule.pdf')).toBeInTheDocument();
        expect(screen.getByText('service-program-details.pdf')).toBeInTheDocument();
        // Alumni Success Stories has no attachments — only that post has no badge
        const attachmentBadges = screen.getAllByText(/.pdf$/);
        expect(attachmentBadges.length).toBeGreaterThan(0);
    });

    it('renders Like, Comment, Share buttons for every post', () => {
        render(<CommunityAnnouncements />);
        expect(screen.getAllByRole('button', { name: /like/i })).toHaveLength(5);
        expect(screen.getAllByRole('button', { name: /comment/i })).toHaveLength(5);
        expect(screen.getAllByRole('button', { name: /share/i })).toHaveLength(5);
    });
});