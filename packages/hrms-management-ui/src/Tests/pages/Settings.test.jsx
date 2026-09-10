import { render, screen } from '@testing-library/react';
import Settings from '../Settings';

jest.mock('../../Assets/styles/Settings.scss', () => { });

describe('Settings', () => {
    it('renders page header', () => {
        render(<Settings />);
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Manage your system preferences and configurations')).toBeInTheDocument();
    });

    it('renders all 4 settings sections', () => {
        render(<Settings />);
        expect(screen.getByText('General Settings')).toBeInTheDocument();
        expect(screen.getByText('Notification Settings')).toBeInTheDocument();
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
        expect(screen.getByText('System Preferences')).toBeInTheDocument();
    });

    it('renders general settings fields with default values', () => {
        render(<Settings />);
        expect(screen.getByLabelText(/school name/i)).toHaveValue('Excellence High School');
    });

    it('renders all 4 notification toggles', () => {
        render(<Settings />);
        expect(screen.getByText('Email Notifications')).toBeInTheDocument();
        expect(screen.getByText('Push Notifications')).toBeInTheDocument();
        expect(screen.getByText('Leave Request Alerts')).toBeInTheDocument();
        expect(screen.getByText('Meeting Reminders')).toBeInTheDocument();
    });

    it('renders security fields and 2FA toggle', () => {
        render(<Settings />);
        expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
        expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    });

    it('renders Save Changes button', () => {
        render(<Settings />);
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });
});