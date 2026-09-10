import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import '../../assets/scss/CustomDatePicker.scss';


/**
 * CustomDatePicker - A reusable date picker component with custom calendar popup
 * Replaces browser-native date picker with a modern, dark-mode compatible UI
 * 
 * @param {Object} props
 * @param {string} props.id - Input element ID
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Selected date value (YYYY-MM-DD format)
 * @param {function} props.onChange - Change handler (receives synthetic event-like object)
 * @param {string} props.min - Minimum selectable date (YYYY-MM-DD)
 * @param {string} props.max - Maximum selectable date (YYYY-MM-DD)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {string} props.testId - Data-testid attribute
 * @param {string} props.className - Additional CSS classes
 */
const CustomDatePicker = ({
  id,
  name,
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  testId,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Parse value to display
  const displayValue = value ? formatDateForDisplay(value) : '';

  function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatDateForValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Initialize current view to selected date or today
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      setCurrentDate(new Date(year, month - 1, 1));
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = formatDateForValue(selectedDate);

    // Create synthetic event to match native input behavior
    const syntheticEvent = {
      target: {
        name,
        value: formattedDate,
        type: 'date'
      }
    };

    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };

  const nextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = formatDateForValue(date);

    if (min && dateStr < min) return true;
    if (max && dateStr > max) return true;

    return false;
  };

  const isDateSelected = (day) => {
    if (!value) return false;
    const dateStr = formatDateForValue(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return dateStr === value;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="cdp-calendar-day cdp-other-month"
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);
      const today = isToday(day);

      let classNames = ['cdp-calendar-day'];
      if (disabled) classNames.push('cdp-disabled');
      if (selected) classNames.push('cdp-selected');
      if (today) classNames.push('cdp-today');

      days.push(
        <div
          key={day}
          className={classNames.join(' ')}
          onClick={() => !disabled && handleDateSelect(day)}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label={`${day} ${monthNames[month]} ${year}`}
          aria-disabled={disabled}
          aria-selected={selected}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              handleDateSelect(day);
            }
          }}
        >
          {day}
        </div>
      );
    }

    // Next month days to fill remaining cells
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="cdp-calendar-day cdp-other-month"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      ref={containerRef}
      className={`cdp-container ${className}`}
      data-testid={testId ? `${testId}-container` : undefined}
    >
      <div
        className={`cdp-input-wrapper ${disabled ? 'cdp-disabled' : ''} ${isOpen ? 'cdp-open' : ''}`}
        onClick={handleInputClick}
      >
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={displayValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly
          className="cdp-input"
          data-testid={testId}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        {!displayValue && (
          <span className="cdp-placeholder">{placeholder}</span>
        )}
        <span className="cdp-calendar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div
          className="cdp-popup"
          role="dialog"
          aria-label="Date picker"
          aria-modal="true"
        >
          <div className="cdp-header">
            <button
              type="button"
              className="cdp-nav-btn cdp-prev-year"
              onClick={prevYear}
              aria-label="Previous year"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
            <button
              type="button"
              className="cdp-nav-btn cdp-prev-month"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="cdp-month-year">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              type="button"
              className="cdp-nav-btn cdp-next-month"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              type="button"
              className="cdp-nav-btn cdp-next-year"
              onClick={nextYear}
              aria-label="Next year"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>

          <div className="cdp-weekdays">
            {weekDays.map((day) => (
              <div key={day} className="cdp-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="cdp-days-grid">
            {renderCalendarDays()}
          </div>

          {/* <div className="cdp-footer">
            { <button
              type="button"
              className="cdp-today-btn"
              onClick={() => {
                const today = new Date();
                setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                if (!isDateDisabled(today.getDate())) {
                  handleDateSelect(today.getDate());
                }
              }}
            >
              Today
            </button> }
            <button
              type="button"
              className="cdp-clear-btn"
              onClick={() => {
                onChange({ target: { name, value: '', type: 'date' } });
                setIsOpen(false);
              }}
            >
              Clear
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
