import { render, screen, fireEvent } from '@testing-library/react';
import ScholarshipManagement from '../ScholarshipManagement';

describe('ScholarshipManagement', () => {
    it('renders page header and summary cards', () => {
        render(<ScholarshipManagement />);
        expect(screen.getByText('Scholarship Management')).toBeInTheDocument();
        expect(screen.getByText('Total Applications')).toBeInTheDocument();
        expect(screen.getByText('Pending Review')).toBeInTheDocument();
        expect(screen.getByText('Approved')).toBeInTheDocument();
        expect(screen.getByText('Total Amount')).toBeInTheDocument();
    });

    it('renders correct summary counts', () => {
        render(<ScholarshipManagement />);
        expect(screen.getByText('5')).toBeInTheDocument();  // total
        expect(screen.getByText('3')).toBeInTheDocument();  // pending
        expect(screen.getByText('2')).toBeInTheDocument();  // approved
        expect(screen.getByText('$20K')).toBeInTheDocument();
    });

    it('renders all 5 scholarship rows by default', () => {
        render(<ScholarshipManagement />);
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.getByText('Michael Chen')).toBeInTheDocument();
        expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
        expect(screen.getByText('John Williams')).toBeInTheDocument();
        expect(screen.getByText('Emily Davis')).toBeInTheDocument();
    });

    it('filters rows by student name search', () => {
        render(<ScholarshipManagement />);
        const input = screen.getByPlaceholderText(/search by student name/i);
        fireEvent.change(input, { target: { value: 'Sarah' } });
        expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
        expect(screen.queryByText('Michael Chen')).not.toBeInTheDocument();
    });

    it('shows Approve and Review buttons only for Pending rows', () => {
        render(<ScholarshipManagement />);
        expect(screen.getAllByRole('button', { name: /approve/i })).toHaveLength(3);
        expect(screen.getAllByRole('button', { name: /review/i })).toHaveLength(3);
        // Approved rows get View Details
        expect(screen.getAllByRole('button', { name: /view details/i })).toHaveLength(2);
    });
});