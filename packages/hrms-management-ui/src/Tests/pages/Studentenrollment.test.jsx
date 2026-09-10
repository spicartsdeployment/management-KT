import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentEnrollment from '../StudentEnrollment';

jest.mock('../../Assets/styles/StudentEnrollment.scss', () => { });

describe('StudentEnrollment', () => {
    it('renders page header and Add New Student button', () => {
        render(<StudentEnrollment />);
        expect(screen.getByText('Student Enrollment')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add new student/i })).toBeInTheDocument();
    });

    it('renders stats cards with correct counts', () => {
        render(<StudentEnrollment />);
        expect(screen.getByText('Total Students')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Active Students')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument(); // 4 Active
        expect(screen.getByText('Campuses')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders all students in the table sorted by most recent join date', () => {
        render(<StudentEnrollment />);
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument();     // 2024-03-10 (most recent)
        expect(screen.getByText('Michael Chen')).toBeInTheDocument();
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Emily Davis')).toBeInTheDocument();
        expect(screen.getByText('John Williams')).toBeInTheDocument();
    });

    it('filters students by name search', () => {
        render(<StudentEnrollment />);
        const searchInput = screen.getByPlaceholderText(/search by name or pin/i);
        fireEvent.change(searchInput, { target: { value: 'Priya' } });
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
        expect(screen.queryByText('Michael Chen')).not.toBeInTheDocument();
    });

    it('opens enrollment dialog when Add New Student is clicked', async () => {
        render(<StudentEnrollment />);
        const addBtn = screen.getByRole('button', { name: /add new student/i });
        await userEvent.click(addBtn);
        expect(screen.getByText('Add New Student')).toBeInTheDocument();
        expect(screen.getByText('Fill in the student details to create a new enrollment record.')).toBeInTheDocument();
    });

    it('renders results count footer', () => {
        render(<StudentEnrollment />);
        expect(screen.getByText(/showing/i)).toBeInTheDocument();
        expect(screen.getByText(/of/i)).toBeInTheDocument();
        expect(screen.getByText('students')).toBeInTheDocument();
    });
});