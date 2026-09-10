import React from "react";
import CustomDropdown from "./CustomDropdown";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const views = ["Daily View", "Weekly View"];

export default function ScheduleFilters({ day, setDay, view, setView }) {
  return (
    <div className="sch-ds-filters-row">
      {view === "Daily View" && (
        <div className="sch-ds-filter-control">
          <svg className="sch-ds-filter-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
          </svg>
          <CustomDropdown
            id="schedule-day-select"
            value={day}
            onChange={setDay}
            options={days}
            testId="school-dropdown-schedule-day"
          />
        </div>
      )}
      <div className="sch-ds-filter-control">
        <svg className="sch-ds-filter-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
        </svg>
        <CustomDropdown
          id="schedule-view-select"
          value={view}
          onChange={setView}
          options={views}
          testId="school-dropdown-schedule-view"
        />
      </div>
    </div>
  );
}
