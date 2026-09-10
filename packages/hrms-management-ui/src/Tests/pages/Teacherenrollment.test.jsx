import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeacherEnrollment from '../TeacherEnrollment';

jest.mock('../../Assets/styles/TeacherEnrollment.scss', () => { });

describe('TeacherEnrollment', () => {
    it('renders page header and Add New Teacher button', () => {
        render(<TeacherEnrollment />);
        expect(screen.getByText('Teacher Enrollment')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add new teacher/i })).toBeInTheDocument();
    });

    it('renders stats cards with correct counts', () => {
        render(<TeacherEnrollment />);
        expect(screen.getByText('Total Teachers')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('Active Teachers')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument(); // 4 Active
        expect(screen.getByText('Departments')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders all 5 teachers in the table', () => {
        render(<TeacherEnrollment />);
        expect(screen.getByText('Dr. Robert Anderson')).toBeInTheDocument();
        expect(screen.getByText('Ms. Jennifer Lee')).toBeInTheDocument();
        expect(screen.getByText('Prof. David Kumar')).toBeInTheDocument();
        expect(screen.getByText('Ms. Emily Brown')).toBeInTheDocument();
        expect(screen.getByText('Mr. James Wilson')).toBeInTheDocument();
    });

    it('filters teachers by name search', () => {
        render(<TeacherEnrollment />);
        const searchInput = screen.getByPlaceholderText(/search by name or employee id/i);
        fireEvent.change(searchInput, { target: { value: 'Jennifer' } });
        expect(screen.getByText('Ms. Jennifer Lee')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Robert Anderson')).not.toBeInTheDocument();
    });

    it('opens enrollment dialog when Add New Teacher is clicked', async () => {
        render(<TeacherEnrollment />);
        const addBtn = screen.getByRole('button', { name: /add new teacher/i });
        await userEvent.click(addBtn);
        expect(screen.getByText('Add New Teacher')).toBeInTheDocument();
        expect(screen.getByText('Fill in the teacher details to create a new enrollment record.')).toBeInTheDocument();
    });

    it('renders results count footer with correct numbers', () => {
        render(<TeacherEnrollment />);
        expect(screen.getByText(/showing/i)).toBeInTheDocument();
        // Both counts visible
        const fiveEls = screen.getAllByText('5');
        expect(fiveEls.length).toBeGreaterThanOrEqual(2); // filteredTeachers + total teachers
    });
});