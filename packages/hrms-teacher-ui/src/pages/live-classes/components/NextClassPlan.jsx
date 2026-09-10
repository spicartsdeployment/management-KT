import React from 'react';

/**
 * @param {object} props
 * @param {string}   props.nextTopic
 * @param {function} props.onTopicChange
 * @param {string}   props.homework
 * @param {function} props.onHomeworkChange
 * @param {boolean}  props.noHomework
 * @param {function} props.onNoHomeworkToggle
 */
const NextClassPlan = ({ nextTopic, onTopicChange, homework, onHomeworkChange, noHomework, onNoHomeworkToggle }) => (
  <div className="lc-next-plan" data-testid="teacher-live-next-class-plan">
    <div className="lc-next-plan__header">
      <span className="lc-next-plan__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </span>
      <div>
        <div className="lc-next-plan__title">Plan for Next Class</div>
        <div className="lc-next-plan__sub">Set tomorrow&apos;s topic and homework assignment</div>
      </div>
    </div>

    <div className="lc-next-plan__body">
      <div className="lc-next-plan__row">
        <div className="lc-next-plan__field">
          <label className="lc-next-plan__field-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Next Class Topic
          </label>
          <span className="lc-next-plan__field-hint">What&apos;s plan for upcoming Class/Exam/Topic?</span>
          <input
            type="text"
            className="lc-next-plan__input"
            placeholder="e.g., Quadratic Equations - Advanced Problem Solving"
            value={nextTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            data-testid="teacher-live-next-topic"
          />
        </div>

        <div className="lc-next-plan__field">
          <div className="lc-next-plan__hw-header">
            <div>
              <label className="lc-next-plan__field-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Homework Assignment
              </label>
              <span className="lc-next-plan__field-hint">Task for students</span>
            </div>
            <label className="lc-next-plan__no-hw-label" data-testid="teacher-live-no-homework-toggle">
              <input
                type="checkbox"
                className="lc-next-plan__no-hw-check"
                checked={noHomework}
                onChange={onNoHomeworkToggle}
              />
              <span>No Homework</span>
            </label>
          </div>
          {noHomework ? (
            <span className="lc-badge lc-badge--neutral">No Homework</span>
          ) : (
            <input
              type="text"
              className="lc-next-plan__input"
              placeholder="e.g., Complete exercises 1-10 from page 45, practice solving quadratic equations"
              value={homework}
              onChange={(e) => onHomeworkChange(e.target.value)}
              data-testid="teacher-live-homework-input"
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

export default NextClassPlan;
