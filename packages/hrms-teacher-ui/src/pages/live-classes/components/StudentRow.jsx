import React from 'react';

/**
 * @param {object} props
 * @param {object} props.student
 * @param {function} props.onToggleAttendance
 * @param {function} props.onToggleHomework
 * @param {function} props.onToggleSubmissionStatus
 * @param {function} props.onNoteChange
 */
const StudentRow = ({ student, onToggleAttendance, onToggleHomework, onToggleSubmissionStatus, onNoteChange }) => {
  const initials = student.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  const isOnLeave = student.onLeave;

  return (
    <tr
      className={`lc-student-row ${isOnLeave ? 'lc-student-row--on-leave' : ''}`}
      data-testid={`teacher-live-student-row-${student.rollNumber}`}
    >
      <td className="lc-student-row__roll">{student.rollNumber}</td>
      <td className="lc-student-row__student">
        <div className="lc-student-row__avatar" aria-hidden="true">{initials}</div>
        <div>
          <div className="lc-student-row__name">{student.name}</div>
          {/* <div className="lc-student-row__roll-sub">Roll #{student.roll}</div> */}
        </div>
      </td>
      <td className="lc-student-row__check">
        {isOnLeave ? (
          <span className="lc-student-row__leave-icon" aria-label="On leave">—</span>
        ) : (
          <button
            className={`lc-check-btn ${student.isPresent ? 'lc-check-btn--present' : ''}`}
            onClick={() => onToggleAttendance(student.id)}
            aria-label={student.isPresent ? 'Mark absent' : 'Mark present'}
            data-testid={`teacher-live-attendance-${student.roll}`}
          >
            {student.isPresent && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
      </td>
      <td className="lc-student-row__check">
        {isOnLeave ? (
          <span className="lc-student-row__leave-icon" aria-label="On leave">—</span>
        ) : (
          <button
            className={`lc-check-btn ${student.homeworkSubmitted ? 'lc-check-btn--hw' : ''}`}
            onClick={() => onToggleHomework(student.id)}
            aria-label={student.homeworkSubmitted ? 'Mark homework pending' : 'Mark homework submitted'}
            data-testid={`teacher-live-homework-${student.roll}`}
          >
            {student.homeworkSubmitted && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
      </td>

      <td className="lc-student-row__dues">
        {student.pendingHomeworkCount > 0 ? (
          <span className="lc-badge lc-badge--pending">
            {student.pendingHomeworkCount} Pending
          </span>
        ) : (
          <span className="lc-badge lc-badge--clear">
            Clear
          </span>
        )}
      </td>

      <td className="lc-student-row__check">
        {isOnLeave ? (
          <span className="lc-student-row__leave-icon">—</span>
        ) : (
          <button
            className={`lc-check-btn ${student.submissionStatus ? 'lc-check-btn--hw' : ''
              }`}
            onClick={() => onToggleSubmissionStatus(student.id)}
            data-testid={`teacher-live-submission-${student.rollNumber}`}
          >
            {student.submissionStatus && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="14"
                height="14"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
      </td>
      <td className="lc-student-row__notes">
        {isOnLeave ? (
          <span className="lc-badge lc-badge--leave">On Leave</span>
        ) : (
          <input
            type="text"
            className="lc-student-row__notes-input"
            placeholder="Add performance notes..."
            value={student.notes}
            onChange={(e) => onNoteChange(student.id, e.target.value)}
            data-testid={`teacher-live-notes-${student.roll}`}
          />
        )}
      </td>

    </tr>
  );
};

export default StudentRow;
