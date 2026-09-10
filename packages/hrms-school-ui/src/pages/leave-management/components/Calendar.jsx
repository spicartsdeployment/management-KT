
import React, { useState } from "react";
import PropTypes from "prop-types";

const MONTH_NAMES_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getPastDays(firstDayOfMonth, prevMonthYear, prevMonthIndex) {
  const daysInPrevMonth = new Date(prevMonthYear, prevMonthIndex + 1, 0).getDate();
  const days = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push(
      <div key={`prev-${day}`} className="sch-lm-calendar-day sch-lm-other-month" data-testid={`school-calendar-day-prev-${day}`}>
        {day}
      </div>
    );
  }
  return days;
}

function getLeaveStatuses(dateStr, currentDateObj, holidayDates, history) {
  const statuses = [];
  if (holidayDates.includes(dateStr)) statuses.push('holiday');
  const approvedLeave = history.find(leave => {
    const from = new Date(leave.from);
    const to = new Date(leave.to);
    return leave.status === 'approved' && currentDateObj >= from && currentDateObj <= to;
  });
  if (approvedLeave) statuses.push('approved');
  const pendingLeave = history.find(leave => {
    const from = new Date(leave.from);
    const to = new Date(leave.to);
    return leave.status === 'pending' && currentDateObj >= from && currentDateObj <= to;
  });
  if (pendingLeave) statuses.push('pending');
  return statuses;
}

function isInRange(currentDateObj, selectedRange) {
  if (selectedRange.start && selectedRange.end) {
    return currentDateObj >= selectedRange.start && currentDateObj <= selectedRange.end;
  }
  if (selectedRange.start && !selectedRange.end) {
    return currentDateObj.getTime() === selectedRange.start.getTime();
  }
  return false;
}

function getSelectionStatuses(currentDateObj, selectedRange) {
  const statuses = [];
  if (isInRange(currentDateObj, selectedRange)) statuses.push('selected');
  if (selectedRange.start && currentDateObj.getTime() === selectedRange.start.getTime()) {
    statuses.push('selected-start');
  }
  if (selectedRange.end && currentDateObj.getTime() === selectedRange.end.getTime()) {
    statuses.push('selected-end');
  }
  return statuses;
}

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// HolidayItem now receives the full holiday object { name, date, daysRemaining } from API
function HolidayItem({ holiday, index }) {
  const date = new Date(holiday.date);
  return (
    <div className="sch-lm-holiday-item" data-testid={`school-holiday-${index}`}>
      <div className="sch-lm-holiday-info">
        <div className="sch-lm-holiday-name">{holiday.name}</div>
        <div className="sch-lm-holiday-full-date">
          {MONTH_NAMES_SHORT[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </div>
      </div>
      <div className="sch-lm-days-left-badge">{holiday.daysRemaining}</div>
    </div>
  );
}

HolidayItem.propTypes = {
  holiday: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    daysRemaining: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

function getDayClassNames(year, month, day, selectedRange, holidayDates, history) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const currentDateObj = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isPast = currentDateObj < today;
  const classNames = ["sch-lm-calendar-day"];
  if (isPast) classNames.push("sch-lm-past");
  if (currentDateObj.toDateString() === today.toDateString()) classNames.push("sch-lm-today");
  [...getLeaveStatuses(dateStr, currentDateObj, holidayDates, history), ...getSelectionStatuses(currentDateObj, selectedRange)]
    .forEach(s => classNames.push(`sch-lm-${s}`));
  return { classNames, isPast };
}

function buildCalendarDays({ year, month, daysInMonth, firstDayOfMonth, selectedRange, handleDateClick, holidayDates, history }) {
  const prevMonthYear = month === 0 ? year - 1 : year;
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const days = getPastDays(firstDayOfMonth, prevMonthYear, prevMonthIndex);
  for (let day = 1; day <= daysInMonth; day++) {
    const { classNames, isPast } = getDayClassNames(year, month, day, selectedRange, holidayDates, history);
    days.push(
      <div key={day} className={classNames.join(" ")} onClick={() => !isPast && handleDateClick(day)} data-testid={`school-calendar-day-${day}`}>
        {day}
      </div>
    );
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(
      <div key={`next-${i}`} className="sch-lm-calendar-day sch-lm-other-month" data-testid={`school-calendar-day-next-${i}`}>{i}</div>
    );
  }
  return days;
}

function CalendarNavigation({ month, year, prevMonth, nextMonth }) {
  return (
    <div className="sch-lm-calendar-navigation">
      <button onClick={prevMonth} className="sch-lm-nav-button" data-testid="school-button-prev-month">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="sch-lm-calendar-month-year">{MONTH_NAMES_LONG[month]} {year}</div>
      <button onClick={nextMonth} className="sch-lm-nav-button" data-testid="school-button-next-month">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

CalendarNavigation.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  prevMonth: PropTypes.func.isRequired,
  nextMonth: PropTypes.func.isRequired,
};

function CalendarWithLegend({ month, year, prevMonth, nextMonth, renderCalendarDays }) {
  return (
    <div className="sch-lm-calendar-outer-container" data-testid="school-container-calendar-with-legend">
      <h3 className="sch-lm-calendar-main-heading">Leave Calendar</h3>
      <div className="sch-lm-calendar-container">
        <CalendarNavigation month={month} year={year} prevMonth={prevMonth} nextMonth={nextMonth} />
        <div className="sch-lm-calendar-weekdays">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="sch-lm-weekday">{day}</div>
          ))}
        </div>
        <div className="sch-lm-calendar-grid">{renderCalendarDays()}</div>
      </div>
      <div className="sch-lm-calendar-legend">
        <div className="sch-lm-legend-item"><span className="sch-lm-legend-dot approved"></span><span>Approved</span></div>
        <div className="sch-lm-legend-item"><span className="sch-lm-legend-dot pending"></span><span>Pending</span></div>
        <div className="sch-lm-legend-item"><span className="sch-lm-legend-dot holiday"></span><span>Holiday</span></div>
      </div>
    </div>
  );
}

CalendarWithLegend.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  prevMonth: PropTypes.func.isRequired,
  nextMonth: PropTypes.func.isRequired,
  renderCalendarDays: PropTypes.func.isRequired,
};

function LeaveSummaryCards({ approvedCount, pendingCount }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div className="sch-lm-summary-card approved-summary" data-testid="school-card-approved-summary">
        <div className="sch-lm-summary-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="sch-lm-summary-content">
          <div className="sch-lm-summary-number">{approvedCount}</div>
          <div className="sch-lm-summary-label">Approved Leaves</div>
        </div>
      </div>
      <div className="sch-lm-summary-card pending-summary" data-testid="school-card-pending-summary">
        <div className="sch-lm-summary-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="sch-lm-summary-content">
          <div className="sch-lm-summary-number">{pendingCount}</div>
          <div className="sch-lm-summary-label">Pending Leaves</div>
        </div>
      </div>
    </div>
  );
}

LeaveSummaryCards.propTypes = {
  approvedCount: PropTypes.number.isRequired,
  pendingCount: PropTypes.number.isRequired,
};

function FutureHolidaysList({ holidays = [] }) {
  const today = new Date();
  const futureHolidays = (holidays || [])
    .filter(h => new Date(h.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log('futureHolidays:..............................etrdf ', futureHolidays);
  return (
    <div className="sch-lm-future-holidays-container" data-testid="school-section-future-holidays">
      <h4 className="sch-lm-holidays-title">Future Holidays</h4>
      <div className="sch-lm-holidays-content">
        {futureHolidays.map((holiday, index) => (
          <HolidayItem key={holiday.date} holiday={holiday} index={index} />
        ))}
      </div>
    </div>
  );
}

FutureHolidaysList.propTypes = {
  holidays: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, date: PropTypes.string, daysRemaining: PropTypes.string })),
};

function handleDateSelection({ clickedDate, startDate, setStartDate, setSelectedRange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (clickedDate < today) return;
  if (!startDate || clickedDate < startDate) {
    setStartDate(clickedDate);
    setSelectedRange({ start: clickedDate, end: null });
    return;
  }
  setSelectedRange({ start: startDate, end: clickedDate });
  setStartDate(null);
}

function computeLeaveCounts(leaveHistory) {
  const approved = (leaveHistory || []).filter(l => l.status === 'approved')
    .reduce((sum, l) => sum + (l.days || 0), 0);
  const pending = (leaveHistory || []).filter(l => l.status === 'pending')
    .reduce((sum, l) => sum + (l.days || 0), 0);
  return { approvedCount: approved, pendingCount: pending };
}

export default function Calendar({ selectedRange, setSelectedRange, holidays = [], leaveHistory = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(selectedRange?.start || null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const holidayDates = (holidays || []).map(h => h.date);
  const { approvedCount, pendingCount } = computeLeaveCounts(leaveHistory);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    handleDateSelection({ clickedDate, startDate, setStartDate, setSelectedRange });
  };

  const renderCalendarDays = () => buildCalendarDays({
    year, month, daysInMonth, firstDayOfMonth, selectedRange, handleDateClick, holidayDates, history: leaveHistory || [],
  });

  return (
    <div className="sch-lm-calendar-wrapper" data-testid="school-container-calendar">
      <CalendarWithLegend month={month} year={year} prevMonth={prevMonth} nextMonth={nextMonth}
        renderCalendarDays={renderCalendarDays} />
      <LeaveSummaryCards approvedCount={approvedCount} pendingCount={pendingCount} />
      <FutureHolidaysList holidays={holidays} />
    </div>
  );
}

Calendar.propTypes = {
  selectedRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
  setSelectedRange: PropTypes.func.isRequired,
  holidays: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, date: PropTypes.string, daysRemaining: PropTypes.string })),
  leaveHistory: PropTypes.arrayOf(PropTypes.shape({ status: PropTypes.string, days: PropTypes.number, from: PropTypes.string, to: PropTypes.string })),
};