import React from 'react';
import StudentRow from './StudentRow';

/**
 * @param {object} props
 * @param {Array}  props.students
 * @param {function} props.onToggleAttendance
 * @param {function} props.onToggleHomework
 * @param {function} props.onNoteChange
 */
const StudentTable = ({ students, onToggleAttendance, onToggleHomework, onToggleSubmissionStatus, onNoteChange }) => (
  <div className="lc-student-table-wrapper" data-testid="teacher-live-student-table">
    <table className="lc-student-table">
      <thead>
        <tr>
          <th>ROLL NO.</th>
          <th>STUDENT</th>
          <th>ATTENDANCE</th>
          <th>HOMEWORK</th>
          <th> PENDING DUES</th>
          <th>SUBMISSION STATUS</th>
          <th>NOTES &amp; COMMENTS</th>

        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <StudentRow
            key={s.id}
            student={s}
            onToggleAttendance={onToggleAttendance}
            onToggleHomework={onToggleHomework}
            onToggleSubmissionStatus={onToggleSubmissionStatus}
            onNoteChange={onNoteChange}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentTable;
