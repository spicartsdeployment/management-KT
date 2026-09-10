import React, { useState } from "react";
import PropTypes from 'prop-types';
import "../../assets/scss/DailySchedule.scss";
import NoClassCard from "./components/NoClassCard";
import ScheduleFilters from "./components/ScheduleFilters";
import PeriodCard from "./components/PeriodCard";
import LunchBreakCard from "./components/LunchBreakCard";
import WeeklyGrid from "./components/WeeklyGrid";
import HomeworkCards from "./components/HomeworkCards";
import SundayScheduleView from "./components/SundayScheduleView";
import PageLoader from "../../components/PageLoader";
import { useDailyScheduleQuery, useWeeklyScheduleQuery } from '../../services/schedule.queries';
import { getSubjectVisuals, getFallbackVisual } from './subjectVisuals';

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Fixed timetable skeleton — always 8 class periods, 2 short breaks, 1 lunch.
 * API data is merged into this structure so the layout is always complete.
 */
const TIMETABLE_SKELETON = [
  { slot: 'period', period: 1, startTime: '08:00', endTime: '08:45' },
  { slot: 'period', period: 2, startTime: '08:50', endTime: '09:35' },
  { slot: 'break',  type: 'morning', startTime: '09:35', endTime: '09:40', label: 'Morning Break', breakDurationMinutes: 5 },
  { slot: 'period', period: 3, startTime: '09:40', endTime: '10:25' },
  { slot: 'period', period: 4, startTime: '10:30', endTime: '11:15' },
  { slot: 'lunch',  type: 'lunch',   startTime: '11:15', endTime: '12:00', label: 'Lunch Break', breakDurationMinutes: 45 },
  { slot: 'period', period: 5, startTime: '12:00', endTime: '12:45' },
  { slot: 'period', period: 6, startTime: '12:50', endTime: '13:35' },
  { slot: 'break',  type: 'evening', startTime: '13:35', endTime: '13:40', label: 'Evening Break', breakDurationMinutes: 5 },
  { slot: 'period', period: 7, startTime: '13:40', endTime: '14:25' },
  { slot: 'period', period: 8, startTime: '14:30', endTime: '15:15' },
];

/**
 * Merges raw API schedule data into the fixed timetable skeleton.
 * Subject periods resolve visuals via getSubjectVisuals (with alias support).
 * Free/empty periods receive a deterministic fallback from getFallbackVisual.
 * @param {Array} apiData - Raw items from the API
 * @returns {Array} Normalised timetable entries — every period slot always has image + color
 */
function normalizeTimetable(apiData = []) {
  const periodMap = {};
  apiData.forEach(item => {
    if (item.scheduleType !== 'Break' && item.periodNumber) {
      periodMap[item.periodNumber] = item;
    }
  });

  return TIMETABLE_SKELETON.map(slot => {
    if (slot.slot === 'period') {
      const api = periodMap[slot.period];
      if (api) {
        const assets = getSubjectVisuals(api.subjectName) || {};
        return {
          ...slot,
          subjectName: api.subjectName,
          topic: api.topic,
          teacherName: api.teacherName,
          startTime: api.startTime || slot.startTime,
          endTime: api.endTime || slot.endTime,
          status: api.status,
          image: api.image || assets.image || null,
          color: api.color || assets.color || null,
        };
      }
      // Free period — inject a deterministic visual from the subject pool
      const fallback = getFallbackVisual(slot.period);
      return { ...slot, image: fallback.image, color: fallback.color };
    }
    return { ...slot };
  });
}

function getCurrentSchoolDay() {
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return DAY_ORDER.includes(todayName) ? todayName : DAY_ORDER[0];
}

/**
 * DailySchedule Component
 * Always renders the full timetable structure regardless of API completeness.
 * @returns {JSX.Element} Daily schedule UI
 */
export default function DailySchedule({ defaultDay }) {
  const [day, setDay] = useState(defaultDay || getCurrentSchoolDay);
  const [view, setView] = useState("Daily View");

  const { data: scheduleQueryData = {}, isLoading } = useDailyScheduleQuery();
  const { data: weeklyScheduleData = {} } = useWeeklyScheduleQuery();

  const rawSchedule       = scheduleQueryData.dailySchedule    || [];
  const yesterdayHomework = scheduleQueryData.previousHomework || [];
  const todayHomework     = scheduleQueryData.todayHomework    || [];
  const upcomingHomework  = scheduleQueryData.upcomingHomework || [];
  const weeklyData        = (weeklyScheduleData && Object.keys(weeklyScheduleData).length > 0) ? weeklyScheduleData : {};

  /**
   * Detect whether the selected day is a school-closed holiday.
   * Priority: explicit API field > day === 'Sunday'.
   * Maps API holidayType strings to our internal type keys.
   */
  const resolveHolidayType = () => {
    if (day === 'Sunday') return 'sunday';
    const apiType = scheduleQueryData.holidayType || scheduleQueryData.dayType || null;
    if (!apiType) return null;
    const t = apiType.toLowerCase();
    if (t.includes('exam') || t.includes('study')) return 'exam';
    if (t.includes('vacat') || t.includes('break') || t.includes('festival')) return 'vacation';
    if (t.includes('holiday') || t.includes('public') || t === 'closed') return 'holiday';
    return null;
  };

  const holidayType = resolveHolidayType();
  const isHolidayDay = holidayType !== null;

  const timetable      = normalizeTimetable(rawSchedule);

  const lunchIdx       = timetable.findIndex(s => s.slot === 'lunch');
  const lunch          = lunchIdx >= 0 ? timetable[lunchIdx] : null;
  const preLunchGroup  = lunchIdx >= 0 ? timetable.slice(0, lunchIdx) : timetable;
  const postLunchGroup = lunchIdx >= 0 ? timetable.slice(lunchIdx + 1) : [];

  /** Renders a single period or break slot */
  const renderSlot = (slot) => {
    if (slot.slot === 'break') {
      return (
        <LunchBreakCard
          key={`break-${slot.type}`}
          from={slot.startTime}
          to={slot.endTime}
          type={slot.type}
          label={slot.label}
          duration={`${slot.breakDurationMinutes} min`}
        />
      );
    }
    return slot.subjectName ? (
      <PeriodCard
        key={`period-${slot.period}`}
        period={slot.period}
        subject={slot.subjectName}
        topic={slot.topic}
        teacher={slot.teacherName}
        from={slot.startTime}
        to={slot.endTime}
        status={slot.status && slot.status.toLowerCase()}
        image={slot.image}
        color={slot.color}
      />
    ) : (
      <NoClassCard
        key={`free-${slot.period}`}
        period={slot.period}
        from={slot.startTime}
        to={slot.endTime}
        image={slot.image}
        color={slot.color}
      />
    );
  };

  return (
    <div className="sch-ds-container" data-testid="school-container-daily-schedule">
      {isLoading ? (
        <PageLoader title="Loading Schedule" subtitle="Fetching your timetable..." icon="📚" />
      ) : (
        <>
          <div className="sch-ds-header">
            <div>
              <div className="sch-ds-title">
                {view === "Daily View" ? "Daily Schedule" : "Weekly Schedule"}
              </div>
              <div className="sch-ds-subtitle">View your classes and timetable</div>
            </div>
            <ScheduleFilters day={day} setDay={setDay} view={view} setView={setView} />
          </div>

          {/* Holiday / Sunday state — shown for Sundays and any API-declared holiday day */}
          {view === "Daily View" && isHolidayDay && (
            <>
              <SundayScheduleView
                holidayType={holidayType}
                customMessage={scheduleQueryData.holidayMessage || undefined}
              />
              {/* Homework Cards still visible on holidays */}
              <HomeworkCards
                yesterdayHomework={yesterdayHomework}
                todayHomework={todayHomework.map(hw => ({
                  subject: hw.subjectName,
                  topic: hw.assignmentTitle,
                  submitted: hw.submissionStatus === "Submitted",
                  dueTime: hw.dueDisplay || hw.statusMessage,
                }))}
                upcomingHomework={upcomingHomework.map(hw => ({
                  subject: hw.subjectName,
                  topic: hw.assignmentTitle,
                  dueDate: hw.dueDisplay || hw.dueTime,
                  description: hw.assignmentTitle,
                }))}
              />
            </>
          )}

          {/* Regular weekday schedule */}
          {view === "Daily View" && !isHolidayDay && (
            <>
              {/* Pre-lunch row: periods 1–2, morning break, periods 3–4 */}
              <div className="sch-ds-row">
                {preLunchGroup.map(renderSlot)}
              </div>

              {/* Lunch break — full width */}
              {lunch && (
                <LunchBreakCard
                  from={lunch.startTime}
                  to={lunch.endTime}
                  type="lunch"
                  label={lunch.label}
                  duration={`${lunch.breakDurationMinutes} min`}
                />
              )}

              {/* Post-lunch row: periods 5–6, evening break, periods 7–8 */}
              <div className="sch-ds-row">
                {postLunchGroup.map(renderSlot)}
              </div>

              {/* Homework Cards */}
              <HomeworkCards
                yesterdayHomework={yesterdayHomework}
                todayHomework={todayHomework.map(hw => ({
                  subject: hw.subjectName,
                  topic: hw.assignmentTitle,
                  submitted: hw.submissionStatus === "Submitted",
                  dueTime: hw.dueDisplay || hw.statusMessage,
                }))}
                upcomingHomework={upcomingHomework.map(hw => ({
                  subject: hw.subjectName,
                  topic: hw.assignmentTitle,
                  dueDate: hw.dueDisplay || hw.dueTime,
                  description: hw.assignmentTitle,
                }))}
              />
            </>
          )}

          {view === "Weekly View" && (
            <WeeklyGrid scheduleData={weeklyData} />
          )}
        </>
      )}
    </div>
  );
}

DailySchedule.propTypes = {
  defaultDay: PropTypes.string,
};
