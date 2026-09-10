
import "../../../assets/scss/WeeklyGrid.scss";
import "../../../assets/scss/WeeklyGrid.custom.scss";
import React from "react";
import PropTypes from "prop-types";

/**
 * Fixed timetable skeleton — ensures grid ALWAYS renders all 11 rows
 * (8 periods + 3 breaks) regardless of API completeness.
 */
const TIMETABLE_SKELETON = [
  { slot: "period", period: 1, from: "08:00", to: "08:45" },
  { slot: "period", period: 2, from: "08:50", to: "09:35" },
  { slot: "break",  type: "morning", from: "09:35", to: "09:40", label: "Morning Break" },
  { slot: "period", period: 3, from: "09:40", to: "10:25" },
  { slot: "period", period: 4, from: "10:30", to: "11:15" },
  { slot: "break",  type: "lunch",   from: "11:15", to: "12:00", label: "Lunch Break" },
  { slot: "period", period: 5, from: "12:00", to: "12:45" },
  { slot: "period", period: 6, from: "12:50", to: "13:35" },
  { slot: "break",  type: "evening", from: "13:35", to: "13:40", label: "Evening Break" },
  { slot: "period", period: 7, from: "13:40", to: "14:25" },
  { slot: "period", period: 8, from: "14:30", to: "15:15" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SUBJECT_ICONS = {
  "Mathematics": "➗",
  "Math": "➗",
  "Physics": "🧪",
  "Chemistry": "⚗️",
  "English": "📘",
  "English Literature": "📘",
  "History": "📜",
  "CS": "💻",
  "Computer Science": "💻",
  "PE": "⚽",
  "Art & Design": "🎨",
  "Art": "🎨",
  "Biology": "🔬",
  "Geography": "🌍",
  "Science": "🔭",
  "Music": "🎵",
  "Drama": "🎭",
  "Languages": "💬",
};

/**
 * Normalises raw weekly schedule data into a reliable day → slots[] map.
 * Handles three input shapes:
 *   A) Day-keyed object with { period, subject, from, to } shape
 *   B) Day-keyed object with { periodNumber, subjectName, startTime, endTime } shape
 *   C) Empty/null/flat array → all cells become free periods
 *
 * ALWAYS returns a complete structure with all skeleton slots filled,
 * using fallback "Free Period" for any missing data.
 *
 * @param {object|Array|null} rawData - Raw API or scheduleData.js format
 * @returns {object} - { [day]: [11 normalized slots] }
 */
function normalizeWeeklySchedule(rawData = {}) {
  // Handle null/undefined/array inputs
  const dayKeyed = (typeof rawData === "object" && !Array.isArray(rawData)) ? rawData : {};

  const result = {};

  DAYS.forEach((day) => {
    const dayItems = dayKeyed[day] || [];

    // Build period map — normalize both API shapes (period/periodNumber, subject/subjectName)
    const periodMap = {};
    dayItems.forEach((item) => {
      const periodNum = item.period || item.periodNumber;
      const isBreak = !!item.break || item.scheduleType === "Break";

      if (periodNum && !isBreak) {
        periodMap[periodNum] = {
          subject: item.subject || item.subjectName || null,
          teacher: item.teacher || item.teacherName || null,
        };
      }
    });

    // Map skeleton rows, merging API data where available
    result[day] = TIMETABLE_SKELETON.map((skeletonSlot) => {
      if (skeletonSlot.slot === "break") {
        return { ...skeletonSlot };
      }

      const apiData = periodMap[skeletonSlot.period];
      if (apiData && apiData.subject) {
        return {
          ...skeletonSlot,
          subject: apiData.subject,
          teacher: apiData.teacher,
        };
      }

      return { ...skeletonSlot }; // Free period — no subject/teacher
    });
  });

  return result;
}

/**
 * WeeklyGrid Component
 * Renders a complete academic weekly timetable that ALWAYS shows all 11 rows
 * (8 periods + 3 breaks) for all 6 school days.
 *
 * Empty/missing data gracefully renders as "Free Period" / "—" using existing styles.
 * Grid structure is driven by TIMETABLE_SKELETON, never collapses.
 */
export default function WeeklyGrid({ scheduleData }) {
  const normalizedData = normalizeWeeklySchedule(scheduleData);

  return (
    <div className="sch-ds-weekly-grid-container" data-testid="school-container-weekly-grid">
      {/* Header Row */}
      <div className="sch-ds-weekly-grid-header-row">
        <div className="sch-ds-weekly-grid-header-cell">Time</div>
        {DAYS.map((day) => (
          <div key={day} className="sch-ds-weekly-grid-header-cell">
            {day.substring(0, 3)}
          </div>
        ))}
      </div>

      {/* Data Rows — always 11, driven by TIMETABLE_SKELETON */}
      {TIMETABLE_SKELETON.map((skeletonSlot, slotIndex) => {
        const isBreak = skeletonSlot.slot === "break";

        return (
          <div key={slotIndex} className="sch-ds-weekly-grid-row">
            {/* Time Cell */}
            <div
              className={`sch-ds-weekly-grid-time-cell ${isBreak ? "sch-ds-break-time" : ""}`}
              data-testid={
                isBreak
                  ? `school-cell-time-${skeletonSlot.type}`
                  : `school-cell-time-period-${skeletonSlot.period}`
              }
            >
              <span className="sch-ds-time-range">{skeletonSlot.from}-{skeletonSlot.to}</span>
              <span className="sch-ds-period-number">{isBreak ? "🍪" : skeletonSlot.period}</span>
            </div>

            {/* Day Cells */}
            {DAYS.map((day) => {
              const slot = normalizedData[day][slotIndex];
              const isFree = !slot.subject;

              /* Break cell */
              if (isBreak) {
                return (
                  <div
                    key={day}
                    className="sch-ds-weekly-grid-cell sch-ds-weekly-grid-break-cell"
                    data-testid={`school-cell-${day.toLowerCase()}-${slot.type}`}
                  >
                    <div className="sch-ds-weekly-cell-content">
                      <span className="sch-ds-weekly-break-label">{slot.label}</span>
                    </div>
                  </div>
                );
              }

              /* Free period cell */
              if (isFree) {
                return (
                  <div
                    key={day}
                    className="sch-ds-weekly-grid-cell sch-ds-weekly-grid-period-cell"
                    data-testid={`school-cell-${day.toLowerCase()}-period-${slot.period}-free`}
                  >
                    <div className="sch-ds-weekly-cell-content">
                      <div className="sch-ds-weekly-subject">
                        <span className="sch-ds-subject-name">—</span>
                      </div>
                    </div>
                  </div>
                );
              }

              /* Subject cell */
              const subjectIcon = SUBJECT_ICONS[slot.subject] || "📚";
              return (
                <div
                  key={day}
                  className="sch-ds-weekly-grid-cell sch-ds-weekly-grid-period-cell"
                  data-testid={`school-cell-${day.toLowerCase()}-period-${slot.period}`}
                >
                  <div className="sch-ds-weekly-cell-content">
                    <div className="sch-ds-weekly-subject">
                      <span className="sch-ds-subject-icon">{subjectIcon}</span>
                      <span className="sch-ds-subject-name">{slot.subject}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

WeeklyGrid.propTypes = {
  scheduleData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
