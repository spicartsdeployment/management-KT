import { render, screen } from '@testing-library/react';
import RoleManagement from '../RoleManagement';

jest.mock('../../Assets/styles/RoleManagement.scss', () => { });

describe('RoleManagement', () => {
    it('renders page header and Create Role button', () => {
        render(<RoleManagement />);
        expect(screen.getByText('Role Management')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create role/i })).toBeInTheDocument();
    });

    it('renders correct summary counts', () => {
        render(<RoleManagement />);
        expect(screen.getByText('Total Roles')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument(); // 6 roles
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('3014')).toBeInTheDocument(); // sum of all assigned users
        expect(screen.getByText('Permission Categories')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders all 6 roles in the table', () => {
        render(<RoleManagement />);
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
        expect(screen.getByText('School Admin')).toBeInTheDocument();
        expect(screen.getByText('Branch Admin')).toBeInTheDocument();
        expect(screen.getByText('Teacher')).toBeInTheDocument();
        expect(screen.getByText('Student')).toBeInTheDocument();
        expect(screen.getByText('Alumni Mentor')).toBeInTheDocument();
    });

    it('renders Edit and Assign Users buttons for each role row', () => {
        render(<RoleManagement />);
        expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(6);
        expect(screen.getAllByRole('button', { name: /assign users/i })).toHaveLength(6);
    });

    it('renders all 3 permission categories with their permissions', () => {
        render(<RoleManagement />);
        expect(screen.getByText('User Management')).toBeInTheDocument();
        expect(screen.getByText('Academic Management')).toBeInTheDocument();
        expect(screen.getByText('Financial')).toBeInTheDocument();
        expect(screen.getByText('Create Users')).toBeInTheDocument();
        expect(screen.getByText('Manage Courses')).toBeInTheDocument();
        expect(screen.getByText('View Fees')).toBeInTheDocument();
    });
});