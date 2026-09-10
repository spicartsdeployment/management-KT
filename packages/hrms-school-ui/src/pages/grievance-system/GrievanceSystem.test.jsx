import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrievanceSystem from './GrievanceSystem';

jest.mock('../../services/grievance.queries', () => {
  const activeCases = [
    {
      id: 1,
      grievanceId: 'GRV-2026-031',
      title: 'Escalated Mathematics Issue',
      category: 'Academic',
      priority: 'Medium',
      status: 'Escalated',
      assignedTo: 'Academic Coordinator',
      date: '2026-03-01',
      description: 'Issue with math grade',
    },
    {
      id: 2,
      grievanceId: 'GRV-2026-030',
      title: 'Cafeteria Complaint',
      category: 'Facilities',
      priority: 'Low',
      status: 'Escalated',
      assignedTo: 'Facilities Manager',
      date: '2026-03-02',
      description: 'Issue with cafeteria',
    },
  ];
  const historyItems = [
    {
      id: 1,
      grievanceId: 'GRV-2025-001',
      title: 'Difficulty understanding Mathematics',
      category: 'Academic',
      date: '2025-12-01',
      resolution: 'Resolved by teacher',
    },
  ];
  const guidelines = [
    { id: 1, title: 'Be Specific', description: 'Provide detailed information about your grievance.' },
    { id: 2, title: 'Confidentiality', description: 'Your grievance will be handled confidentially.' },
    { id: 3, title: 'Response Time', description: 'Expect a response within 5-7 business days.' },
    { id: 4, title: 'Documentation', description: 'Attach any supporting documents as evidence.' },
  ];
  return {
    useGrievanceStatsQuery: () => ({
      data: {
        stats: { totalGrievances: 4, activeCases: 1, resolvedThisMonth: 1, monthLabel: 'March 2026' },
        activeCases,
      },
      isLoading: false,
    }),
    useGrievanceHistoryQuery: () => ({
      data: { historyItems, resolvedCount: 15 },
      isLoading: false,
    }),
    useGrievanceGuidelinesQuery: () => ({
      data: guidelines,
      isLoading: false,
    }),
    useSubmitGrievanceMutation: () => ({
      mutate: jest.fn(),
      isLoading: false,
      isSuccess: false,
      isError: false,
    }),
  };
});

jest.mock('./components/CustomDropdown', () => ({
  __esModule: true,
  default: function MockCustomDropdown({ id, value, onChange, options, testId }) {
    return (
      <select
        id={id}
        data-testid={testId}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  },
}));

jest.mock('./components/DatePicker', () => ({
  __esModule: true,
  default: function MockDatePicker({ value, onChange, id, testId }) {
    return (
      <input
        type="text"
        id={id}
        data-testid={testId}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },
}));

/**
 * Test suite for GrievanceSystem component
 * Target: 80%+ code coverage
 */
describe('GrievanceSystem', () => {
  describe('Component Rendering', () => {
    test('renders grievance system container with correct data-testid', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-container-grievance-system')).toBeInTheDocument();
    });

    test('renders header with title and subtitle', () => {
      render(<GrievanceSystem />);
      expect(screen.getByText('Grievance System')).toBeInTheDocument();
      expect(screen.getByText('Submit and track formal complaints and concerns')).toBeInTheDocument();
    });

    test('renders all three summary cards', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-card-total-grievances')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-active-cases')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-resolved-month')).toBeInTheDocument();
    });

    test('renders all four tab buttons', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-tab-active-cases')).toBeInTheDocument();
      expect(screen.getByTestId('school-tab-submit-new')).toBeInTheDocument();
      expect(screen.getByTestId('school-tab-history')).toBeInTheDocument();
      expect(screen.getByTestId('school-tab-guidelines')).toBeInTheDocument();
    });
  });

  describe('Summary Cards', () => {
    test('displays correct total grievances count', () => {
      render(<GrievanceSystem />);
      const totalCard = screen.getByTestId('school-card-total-grievances');
      expect(totalCard).toHaveTextContent('Total Grievances');
      expect(totalCard).toHaveTextContent('4');
      expect(totalCard).toHaveTextContent('All time');
    });

    test('displays correct active cases count', () => {
      render(<GrievanceSystem />);
      const activeCard = screen.getByTestId('school-card-active-cases');
      expect(activeCard).toHaveTextContent('Active Cases');
      expect(activeCard).toHaveTextContent('1');
      expect(activeCard).toHaveTextContent('Currently open');
    });

    test('displays correct resolved this month count', () => {
      render(<GrievanceSystem />);
      const resolvedCard = screen.getByTestId('school-card-resolved-month');
      expect(resolvedCard).toHaveTextContent('Resolved This Month');
      expect(resolvedCard).toHaveTextContent('1');
      expect(resolvedCard).toHaveTextContent('March 2026');
    });
  });

  describe('Tab Navigation', () => {
    test('active cases tab is active by default', () => {
      render(<GrievanceSystem />);
      const activeTab = screen.getByTestId('school-tab-active-cases');
      expect(activeTab).toHaveClass('active');
    });

    test('switches to submit new tab when clicked', () => {
      render(<GrievanceSystem />);
      const submitTab = screen.getByTestId('school-tab-submit-new');
      fireEvent.click(submitTab);
      expect(submitTab).toHaveClass('active');
    });

    test('switches to history tab when clicked', () => {
      render(<GrievanceSystem />);
      const historyTab = screen.getByTestId('school-tab-history');
      fireEvent.click(historyTab);
      expect(historyTab).toHaveClass('active');
    });

    test('switches to guidelines tab when clicked', () => {
      render(<GrievanceSystem />);
      const guidelinesTab = screen.getByTestId('school-tab-guidelines');
      fireEvent.click(guidelinesTab);
      expect(guidelinesTab).toHaveClass('active');
    });
  });

  describe('Active Cases Tab', () => {
    test('renders active cases content', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-content-active-cases')).toBeInTheDocument();
    });

    test('displays case rows', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-row-case-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-row-case-2')).toBeInTheDocument();
    });

    test('displays case information correctly', () => {
      render(<GrievanceSystem />);
      expect(screen.getByText('Escalated Mathematics Issue')).toBeInTheDocument();
      expect(screen.getByText(/GRV-2026-031/)).toBeInTheDocument();
      expect(screen.getAllByText('Academic Coordinator')[0]).toBeInTheDocument();
    });

    test('displays category pills', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-pill-category-1')).toHaveTextContent('Academic');
    });

    test('displays priority pills with correct styling', () => {
      render(<GrievanceSystem />);
      const priorityPill = screen.getByTestId('school-pill-priority-1');
      expect(priorityPill).toHaveTextContent('Medium');
    });

    test('displays status pills', () => {
      render(<GrievanceSystem />);
      expect(screen.getByTestId('school-pill-status-1')).toHaveTextContent('Escalated');
      expect(screen.getByTestId('school-pill-status-2')).toHaveTextContent('Escalated');
    });
  });

  describe('Submit New Tab - Step Navigation', () => {
    beforeEach(() => {
      render(<GrievanceSystem />);
      const submitTab = screen.getByTestId('school-tab-submit-new');
      fireEvent.click(submitTab);
    });

    test('renders submit new content', () => {
      expect(screen.getByTestId('school-content-submit-new')).toBeInTheDocument();
    });

    test('shows step 1 (Basic Information) by default', () => {
      expect(screen.getByTestId('school-step-basic-info')).toBeInTheDocument();
      expect(screen.getAllByText('Basic Information').length).toBeGreaterThan(0);
    });

    test('renders all form fields in step 1', () => {
      expect(screen.getByTestId('school-field-title')).toBeInTheDocument();
      expect(screen.getByTestId('school-dropdown-category')).toBeInTheDocument();
      expect(screen.getByTestId('school-dropdown-priority')).toBeInTheDocument();
      expect(screen.getByTestId('school-field-date')).toBeInTheDocument();
      expect(screen.getByTestId('school-field-description')).toBeInTheDocument();
    });

    test('updates title field value', () => {
      const titleInput = screen.getByTestId('school-field-title');
      fireEvent.change(titleInput, { target: { value: 'Test Grievance' } });
      expect(titleInput).toHaveValue('Test Grievance');
    });

    test('updates category dropdown value', () => {
      const categorySelect = screen.getByTestId('school-dropdown-category');
      fireEvent.change(categorySelect, { target: { value: 'Academic' } });
      expect(categorySelect).toHaveValue('Academic');
    });

    test('updates priority dropdown value', () => {
      const prioritySelect = screen.getByTestId('school-dropdown-priority');
      fireEvent.change(prioritySelect, { target: { value: 'High' } });
      expect(prioritySelect).toHaveValue('High');
    });

    test('continue button is disabled when form is incomplete', () => {
      const continueBtn = screen.getByTestId('school-button-continue');
      expect(continueBtn).toBeDisabled();
    });

    test('continue button is enabled when all fields are filled', () => {
      fireEvent.change(screen.getByTestId('school-field-title'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('school-dropdown-category'), { target: { value: 'Academic' } });
      fireEvent.change(screen.getByTestId('school-dropdown-priority'), { target: { value: 'Medium' } });
      fireEvent.change(screen.getByTestId('school-field-date'), { target: { value: '01-01-2024' } });
      fireEvent.change(screen.getByTestId('school-field-description'), { target: { value: 'Description' } });
      
      const continueBtn = screen.getByTestId('school-button-continue');
      expect(continueBtn).not.toBeDisabled();
    });

    test('cancel button clears form', () => {
      const titleInput = screen.getByTestId('school-field-title');
      fireEvent.change(titleInput, { target: { value: 'Test Grievance' } });
      
      const cancelBtn = screen.getByTestId('school-button-cancel');
      fireEvent.click(cancelBtn);
      
      expect(titleInput).toHaveValue('');
    });
  });

  describe('Submit New Tab - Multi-Step Form', () => {
    test('navigates to step 2 after completing step 1', () => {
      render(<GrievanceSystem />);
      fireEvent.click(screen.getByTestId('school-tab-submit-new'));

      // Fill step 1
      fireEvent.change(screen.getByTestId('school-field-title'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('school-dropdown-category'), { target: { value: 'Safety' } });
      fireEvent.change(screen.getByTestId('school-dropdown-priority'), { target: { value: 'High' } });
      fireEvent.change(screen.getByTestId('school-field-date'), { target: { value: '01-01-2024' } });
      fireEvent.change(screen.getByTestId('school-field-description'), { target: { value: 'Test description' } });
      
      fireEvent.click(screen.getByTestId('school-button-continue'));
      
      expect(screen.getByTestId('school-step-incident-details')).toBeInTheDocument();
    });

    test('shows back button in step 2', () => {
      render(<GrievanceSystem />);
      fireEvent.click(screen.getByTestId('school-tab-submit-new'));

      // Complete step 1
      fireEvent.change(screen.getByTestId('school-field-title'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByTestId('school-dropdown-category'), { target: { value: 'Safety' } });
      fireEvent.change(screen.getByTestId('school-dropdown-priority'), { target: { value: 'High' } });
      fireEvent.change(screen.getByTestId('school-field-date'), { target: { value: '01-01-2024' } });
      fireEvent.change(screen.getByTestId('school-field-description'), { target: { value: 'Description' } });
      fireEvent.click(screen.getByTestId('school-button-continue'));

      expect(screen.getByTestId('school-button-back')).toBeInTheDocument();
    });
  });

  describe('History Tab', () => {
    beforeEach(() => {
      render(<GrievanceSystem />);
      const historyTab = screen.getByTestId('school-tab-history');
      fireEvent.click(historyTab);
    });

    test('renders history content', () => {
      expect(screen.getByTestId('school-content-history')).toBeInTheDocument();
    });

    test('displays history header with count', () => {
      expect(screen.getByText('Grievance History')).toBeInTheDocument();
      expect(screen.getByText('15 Resolved')).toBeInTheDocument();
    });

    test('displays history items', () => {
      expect(screen.getByTestId('school-item-history-1')).toBeInTheDocument();
    });

    test('displays history information correctly', () => {
      expect(screen.getByText('Difficulty understanding Mathematics')).toBeInTheDocument();
      expect(screen.getByText(/GRV-2025-001/)).toBeInTheDocument();
    });
  });

  describe('Guidelines Tab', () => {
    beforeEach(() => {
      render(<GrievanceSystem />);
      const guidelinesTab = screen.getByTestId('school-tab-guidelines');
      fireEvent.click(guidelinesTab);
    });

    test('renders guidelines content', () => {
      expect(screen.getByTestId('school-content-guidelines')).toBeInTheDocument();
    });

    test('displays all guideline cards', () => {
      expect(screen.getByTestId('school-card-guideline-1')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-guideline-2')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-guideline-3')).toBeInTheDocument();
      expect(screen.getByTestId('school-card-guideline-4')).toBeInTheDocument();
    });

    test('displays guideline titles correctly', () => {
      expect(screen.getByText('Be Specific')).toBeInTheDocument();
      expect(screen.getByText('Confidentiality')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('all form inputs have associated labels', () => {
      render(<GrievanceSystem />);
      fireEvent.click(screen.getByTestId('school-tab-submit-new'));

      expect(screen.getByLabelText(/Grievance Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority Level/i)).toBeInTheDocument();
    });

    test('buttons are keyboard accessible', () => {
      render(<GrievanceSystem />);
      const submitTab = screen.getByTestId('school-tab-submit-new');
      
      submitTab.focus();
      expect(document.activeElement).toBe(submitTab);
    });
  });
});
