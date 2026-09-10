import { formatDateDisplay, formatTime, formatDateTime, formatRelativeTime, formatCurrency, formatPercentage, formatGPA } from './formatters';

describe('formatters', () => {
  it('formats date display', () => {
    expect(formatDateDisplay('2024-03-30')).toMatch(/Mar|Apr|May/);
  });

  it('formats time', () => {
    expect(formatTime('2024-03-30T15:45:00')).toMatch(/\d{2}:\d{2}/);
  });

  it('formats date and time', () => {
    expect(formatDateTime('2024-03-30T15:45:00')).toMatch(/\d{2}:\d{2}/);
  });

  it('formats relative time', () => {
    expect(['just now', 'minutes ago', 'hours ago', 'days ago']).toContain(formatRelativeTime(new Date()));
  });

  it('formats currency', () => {
    expect(formatCurrency(1234)).toBe('₹1,234');
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats percentage', () => {
    expect(formatPercentage(0.1234, 2)).toBe('0.12%');
  });

  it('formats GPA', () => {
    expect(formatGPA(8.5)).toBe('8.5/10');
  });
});