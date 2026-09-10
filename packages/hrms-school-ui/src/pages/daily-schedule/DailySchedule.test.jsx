import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailySchedule from './DailySchedule';

const MOCK_PERIODS = [
  { id: 1, periodNumber: 1, subjectName: 'Mathematics', topic: 'Algebra', teacherName: 'Mr. Smith', startTime: '08:00', endTime: '08:45', color: 'blue', image: '', scheduleType: 'Class' },
  { id: 2, periodNumber: 2, subjectName: 'Science', topic: 'Physics', teacherName: 'Ms. Jones', startTime: '08:45', endTime: '09:30', color: 'green', image: '', scheduleType: 'Class' },
  { id: 3, scheduleType: 'Break', subjectName: 'Lunch Break', startTime: '12:00', endTime: '12:45', periodNumber: 0, topic: '', teacherName: '', color: '', image: '' },
  { id: 4, periodNumber: 3, subjectName: 'English', topic: 'Grammar', teacherName: 'Mrs. Brown', startTime: '12:45', endTime: '13:30', color: 'red', image: '', scheduleType: 'Class' },
];

jest.mock('../../services/schedule.queries', () => ({
  useDailyScheduleQuery: () => ({
    data: {
      dailySchedule: MOCK_PERIODS,
      previousHomework: [],
      todayHomework: [],
      upcomingHomework: [],
      holidayType: null,
    },
    isLoading: false,
    isError: false,
  }),

  useWeeklyScheduleQuery: () => ({
    data: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
    isLoading: false,
    isError: false,
  }),
}));

describe('DailySchedule', () => {
  it('renders daily schedule with periods', () => {
    render(<DailySchedule />);
    expect(screen.getByTestId('school-container-daily-schedule')).toBeInTheDocument();
    expect(screen.getByText('Daily Schedule')).toBeInTheDocument();
  });

  it('renders lunch break card', () => {
    render(<DailySchedule defaultDay="Monday" />);
    const breakCards = screen.getAllByTestId('school-card-lunch-break');
    // At least one break card should have the label 'Lunch Break'
    expect(breakCards.some(card => card.textContent.includes('Lunch Break'))).toBe(true);
  });

  it('switches between Daily and Weekly views', () => {
    render(<DailySchedule />);
    const viewDropdown = screen.getByTestId('school-dropdown-schedule-view');
    // Open the dropdown
    fireEvent.click(viewDropdown);
    // Click the 'Weekly View' option
    const weeklyOption = screen.getByText('Weekly View');
    fireEvent.click(weeklyOption);
    // Now check for the weekly view content
    expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();
  });

  it('changes day selection', () => {
    render(<DailySchedule />);
    const dayDropdown = screen.getByTestId('school-dropdown-schedule-day');
    fireEvent.change(dayDropdown, { target: { value: 'Tuesday' } });
    expect(dayDropdown.value).toBe('Tuesday');
  });

  it('renders all period cards', () => {
    render(<DailySchedule />);
    const periodCards = screen.getAllByTestId('school-card-period');
    expect(periodCards.length).toBeGreaterThan(0);
  });
});
