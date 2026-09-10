import React, { useState, useRef, useEffect } from "react";

/**
 * DatePicker Component
 * Custom date picker with theme support for Grievance System
 */
export default function DatePicker({ value, onChange, id, testId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const pickerRef = useRef(null);
  const dropdownRef = useRef(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isOpen && pickerRef.current && dropdownRef.current) {
      const pickerRect = pickerRef.current.getBoundingClientRect();
      const dropdownHeight = 400; // Approximate height of dropdown
      const spaceBelow = window.innerHeight - pickerRect.bottom;
      const spaceAbove = pickerRect.top;

      // Prefer opening above, but open below if there's not enough space above
      if (spaceAbove >= dropdownHeight || spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    onChange(formattedDate);
    setCurrentDate(today);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const isToday = (day) => {
    const dateObj = new Date(year, month, day);
    const today = new Date();
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!value) return false;
    const [selectedYear, selectedMonth, selectedDay] = value.split('-').map(Number);
    return selectedYear === year && selectedMonth === month + 1 && selectedDay === day;
  };

  const formatDisplayDate = () => {
    if (!value) return 'dd-mm-yyyy';
    const [year, month, day] = value.split('-');
    return `${day}-${month}-${year}`;
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month days (grayed out)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="sch-gr-date-day sch-gr-date-empty"></div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isTodayDate = isToday(day);
      const isSelectedDate = isSelected(day);

      let className = "sch-gr-date-day";
      if (isTodayDate) className += " sch-gr-date-today";
      if (isSelectedDate) className += " sch-gr-date-selected";

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="sch-gr-datepicker" ref={pickerRef}>
      <button
        type="button"
        id={id}
        className="sch-gr-datepicker-input"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={testId}
      >
        <span className="sch-gr-datepicker-value">{formatDisplayDate()}</span>
        <svg className="sch-gr-datepicker-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`sch-gr-datepicker-dropdown ${dropdownPosition === 'top' ? 'sch-gr-datepicker-dropdown-top' : ''}`}
        >
          <div className="sch-gr-date-header">
            <button type="button" className="sch-gr-date-nav" onClick={prevMonth}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="sch-gr-date-month">{monthNames[month]}, {year}</div>
            <button type="button" className="sch-gr-date-nav" onClick={nextMonth}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="sch-gr-date-weekdays">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="sch-gr-date-weekday">{day}</div>
            ))}
          </div>

          <div className="sch-gr-date-grid">
            {renderCalendarDays()}
          </div>

          {/* <div className="sch-gr-date-actions">
            <button type="button" className="sch-gr-date-action-btn" onClick={handleClear}>Clear</button>
            <button type="button" className="sch-gr-date-action-btn sch-gr-date-action-primary" onClick={handleToday}>Today</button>
          </div> */}
        </div>
      )}
    </div>
  );
}
