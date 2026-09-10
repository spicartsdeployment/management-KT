import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/AssignmentsExams.scss';

const AssignmentsExams = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
  const [isDeleteExamModalOpen, setIsDeleteExamModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examToDelete, setExamToDelete] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Algebra Problem Set',
      class: 'Class 9A',
      deadline: 'Nov 19, 2025',
      submissions: { submitted: 28, total: 35 },
      status: 'Upcoming',
      description: 'Solve problems 1-20 from Chapter 4: Quadratic Equations',
      tags: ['High Priority', 'Written'],
      attachment: null
    },
    {
      id: 2,
      title: 'Trigonometry Quiz',
      class: 'Class 11A',
      deadline: 'Nov 8, 2025',
      submissions: { submitted: 29, total: 30 },
      status: 'Grading',
      description: 'MCQ-based quiz on trigonometric identities and ratios',
      tags: ['Medium', 'Online'],
      attachment: null
    },
    {
      id: 3,
      title: 'Calculus Assignment',
      class: 'Class 12A',
      deadline: 'Nov 12, 2025',
      submissions: { submitted: 18, total: 28 },
      status: 'Active',
      description: 'Integration and differentiation problems',
      tags: ['High Priority', 'Written'],
      attachment: null
    }
  ]);

  const [exams, setExams] = useState([
    {
      id: 1,
      title: 'Mid-Term Mathematics',
      class: 'Class 9A',
      date: 'Nov 20, 2025',
      duration: '3 hours',
      totalMarks: 100
    },
    {
      id: 2,
      title: 'Unit Test - Trigonometry',
      class: 'Class 11A',
      date: 'Nov 15, 2025',
      duration: '1 hour',
      totalMarks: 50
    },
    {
      id: 3,
      title: 'Final Exam - Calculus',
      class: 'Class 12A',
      date: 'Dec 5, 2025',
      duration: '3 hours',
      totalMarks: 100
    }
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([
    { id: 1, student: 'Aarav Sharma', submittedOn: 'Nov 5, 2025', status: 'Graded', marks: '18/20', marksObtained: 18, totalMarks: 20, feedback: 'View', writtenFeedback: 'Good work! Your understanding of quadratic equations is solid. Keep practicing similar problems.' },
    { id: 2, student: 'Ananya Patel', submittedOn: 'Nov 5, 2025', status: 'Graded', marks: '20/20', marksObtained: 20, totalMarks: 20, feedback: 'View', writtenFeedback: 'Excellent work! Perfect score. Your solutions are well-structured and clear.' },
    { id: 3, student: 'Arjun Kumar', submittedOn: 'Nov 6, 2025', status: 'Pending', marks: '-', marksObtained: '', totalMarks: '', feedback: 'Grade', writtenFeedback: '' },
    { id: 4, student: 'Diya Singh', submittedOn: 'Nov 4, 2025', status: 'Graded', marks: '17/20', marksObtained: 17, totalMarks: 20, feedback: 'View', writtenFeedback: 'Good attempt. Review problem #5 - there was a calculation error in the final step.' },
    { id: 5, student: 'Ishaan Verma', submittedOn: 'Nov 6, 2025', status: 'Pending', marks: '-', marksObtained: '', totalMarks: '', feedback: 'Grade', writtenFeedback: '' }
  ]);

  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    class: '',
    deadline: '',
    totalMarks: '',
    description: '',
    file: null
  });

  const [examFormData, setExamFormData] = useState({
    title: '',
    class: '',
    date: '',
    duration: '',
    totalMarks: '',
    description: ''
  });

  const [gradingFormData, setGradingFormData] = useState({
    marksObtained: '',
    totalMarks: '',
    writtenFeedback: ''
  });

  const openAssignmentModal = () => {
    setIsAssignmentModalOpen(true);
    setAssignmentFormData({ title: '', class: '', deadline: '', totalMarks: '', description: '', file: null });
  };

  const openExamModal = () => {
    setIsExamModalOpen(true);
    setExamFormData({ title: '', class: '', date: '', duration: '', totalMarks: '', description: '' });
  };

  const handleAssignmentInputChange = (field, value) => {
    setAssignmentFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExamInputChange = (field, value) => {
    setExamFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAssignmentFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleCreateAssignment = () => {
    if (!assignmentFormData.title || !assignmentFormData.class || !assignmentFormData.deadline) {
      alert('Please fill all required fields');
      return;
    }
    const newAssignment = {
      id: Date.now(),
      title: assignmentFormData.title,
      class: assignmentFormData.class,
      deadline: assignmentFormData.deadline,
      submissions: { submitted: 0, total: 35 },
      status: 'Upcoming',
      description: assignmentFormData.description,
      tags: ['New', 'Written'],
      attachment: assignmentFormData.file ? assignmentFormData.file.name : null
    };
    setAssignments(prev => [newAssignment, ...prev]);
    setIsAssignmentModalOpen(false);
  };

  const handleCreateExam = () => {
    if (!examFormData.title || !examFormData.class || !examFormData.date) {
      alert('Please fill all required fields');
      return;
    }
    const newExam = {
      id: Date.now(),
      title: examFormData.title,
      class: examFormData.class,
      date: examFormData.date,
      duration: examFormData.duration,
      totalMarks: examFormData.totalMarks
    };
    setExams(prev => [newExam, ...prev]);
    setIsExamModalOpen(false);
  };

  const openDeleteModal = (assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAssignmentToDelete(null);
  };

  const confirmDeleteAssignment = () => {
    if (assignmentToDelete) {
      setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
      setExpandedAssignment(null);
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const openEditExamModal = (exam) => {
    setSelectedExam(exam);
    setExamFormData({
      title: exam.title,
      class: exam.class,
      date: exam.date,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      description: exam.description || ''
    });
    setIsEditExamModalOpen(true);
  };

  const closeEditExamModal = () => {
    setIsEditExamModalOpen(false);
    setSelectedExam(null);
  };

  const handleUpdateExam = () => {
    if (!examFormData.title || !examFormData.class || !examFormData.date) {
      alert('Please fill all required fields');
      return;
    }
    setExams(prev => prev.map(e =>
      e.id === selectedExam.id
        ? { ...e, title: examFormData.title, class: examFormData.class, date: examFormData.date, duration: examFormData.duration, totalMarks: examFormData.totalMarks, description: examFormData.description }
        : e
    ));
    closeEditExamModal();
  };

  const openDeleteExamModal = (exam) => {
    setExamToDelete(exam);
    setIsDeleteExamModalOpen(true);
  };

  const closeDeleteExamModal = () => {
    setIsDeleteExamModalOpen(false);
    setExamToDelete(null);
  };

  const confirmDeleteExam = () => {
    if (examToDelete) {
      setExams(prev => prev.filter(e => e.id !== examToDelete.id));
      setIsDeleteExamModalOpen(false);
      setExamToDelete(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  const openDetailsModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAssignment(null);
  };

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentFormData({
      title: assignment.title,
      class: assignment.class,
      deadline: assignment.deadline,
      totalMarks: '',
      description: assignment.description,
      file: null,
      existingAttachment: assignment.attachment
    });
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAssignment(null);
  };

  const handleUpdateAssignment = () => {
    if (!assignmentFormData.title || !assignmentFormData.class || !assignmentFormData.deadline) {
      alert('Please fill all required fields');
      return;
    }
    setAssignments(prev => prev.map(a =>
      a.id === selectedAssignment.id
        ? {
          ...a,
          title: assignmentFormData.title,
          class: assignmentFormData.class,
          deadline: assignmentFormData.deadline,
          description: assignmentFormData.description,
          attachment: assignmentFormData.file ? assignmentFormData.file.name : (assignmentFormData.existingAttachment || a.attachment)
        }
        : a
    ));
    setIsEditModalOpen(false);
    setSelectedAssignment(null);
  };

  const openFeedbackModal = (submission) => {
    setSelectedSubmission(submission);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedSubmission(null);
  };

  const openGradingModal = (submission) => {
    setSelectedSubmission(submission);
    setGradingFormData({
      marksObtained: submission.marksObtained || '',
      totalMarks: submission.totalMarks || '20',
      writtenFeedback: submission.writtenFeedback || ''
    });
    setIsGradingModalOpen(true);
  };

  const closeGradingModal = () => {
    setIsGradingModalOpen(false);
    setSelectedSubmission(null);
    setGradingFormData({ marksObtained: '', totalMarks: '', writtenFeedback: '' });
  };

  const handleGradingInputChange = (field, value) => {
    setGradingFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitGrade = () => {
    if (!gradingFormData.marksObtained || !gradingFormData.totalMarks || !gradingFormData.writtenFeedback) {
      alert('Please fill all required fields');
      return;
    }
    setRecentSubmissions(prev => prev.map(sub =>
      sub.id === selectedSubmission.id
        ? {
          ...sub,
          status: 'Graded',
          marks: `${gradingFormData.marksObtained}/${gradingFormData.totalMarks}`,
          marksObtained: gradingFormData.marksObtained,
          totalMarks: gradingFormData.totalMarks,
          feedback: 'View',
          writtenFeedback: gradingFormData.writtenFeedback
        }
        : sub
    ));
    closeGradingModal();
  };

  // Pagination
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const paginatedAssignments = assignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="ae-assignments-exams" data-testid="school-page-assignments-exams">

      {/* Header */}
      <div className="ae-page-header">
        <div className="ae-header-text">
          <h1 data-testid="school-field-assignments-title">Assignments & Exams</h1>
          <p>Create and evaluate tasks and exams</p>
        </div>
      </div>

      {/* AI Insight Alert */}
      <div className="ae-ai-insight-alert" data-testid="school-alert-ai-insight">
        <div className="ae-alert-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13H7L9 21L15 3L17 13H21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="ae-alert-content">
          <p>AI Insight: Needs Attention</p>
          <p>Students struggling with Chapter 5 - Quadratic Equations</p>
          <p className="ae-alert-suggestion">Consider scheduling a revision class or sharing additional resources</p>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div className="ae-toggle-tabs">
        <button
          className={`ae-tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
          data-testid="school-button-tab-assignments"
        >
          Assignments
        </button>
        <button
          className={`ae-tab-button ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
          data-testid="school-button-tab-exams"
        >
          Exams
        </button>
      </div>

      {/* ── ASSIGNMENTS TAB ── */}
      {activeTab === 'assignments' && (
        <div className="ae-assignments-section">
          <div className="ae-section-header">
            <h2>Active Assignments</h2>
            <button className="ae-btn-create" onClick={openAssignmentModal} data-testid="school-button-create-assignment">
              <span>+</span> Create Assignment
            </button>
          </div>

          {/* Assignment Cards */}
          {paginatedAssignments.length === 0 ? (
            <div className="ae-empty-state">
              <p>There are no active assignments</p>
            </div>
          ) : (
            <div className="ae-assignments-grid">
              {paginatedAssignments.map(assignment => (
                <div
                  key={assignment.id}
                  className={`ae-assignment-card ${expandedAssignment === assignment.id ? 'ae-expanded' : ''}`}
                  data-testid={`school-card-assignment-${assignment.id}`}
                >
                  <div className="ae-card-header">
                    <h3>{assignment.title}</h3>
                  </div>

                  <div className="ae-card-body">
                    <div className="ae-card-info">
                      <span className="ae-info-value">{assignment.class}</span>
                    </div>
                    <div className="ae-card-info">
                      <span className="ae-info-label">Deadline:</span>
                      <span className="ae-info-value">{assignment.deadline}</span>
                    </div>
                    <div className="ae-card-info">
                      <span className="ae-info-label">Submissions:</span>
                      <span className="ae-submissions-badge">
                        {assignment.submissions.submitted}/{assignment.submissions.total}
                      </span>
                    </div>
                  </div>

                  <div className="ae-card-footer">
                    <button
                      className="ae-btn-view-details"
                      onClick={() => openDetailsModal(assignment)}
                      data-testid={`school-button-view-details-${assignment.id}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="ae-pagination">
              <button
                className="ae-page-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                data-testid="school-button-prev-page"
              >
                &lt;
              </button>
              <div className="ae-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`ae-page-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                    data-testid={`school-button-page-${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="ae-page-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                data-testid="school-button-next-page"
              >
                &gt;
              </button>
            </div>
          )}

          {/* Recent Submissions */}
          <div className="ae-recent-submissions">
            <div className="ae-submissions-header">
              <h2>Recent Submissions</h2>
              <button
                className="ae-btn-upload-grades"
                onClick={() => setIsGradeModalOpen(true)}
                data-testid="school-button-upload-grades"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload Grades
              </button>
            </div>

            {/* Table wrapped for horizontal scroll on mobile */}
            <div className="ae-table-container">
              <table className="ae-submissions-table" data-testid="school-table-submissions">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th>Marks</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map(submission => (
                    <tr key={submission.id} data-testid={`school-row-submission-${submission.id}`}>
                      <td title={submission.student}>{submission.student}</td>
                      <td>{submission.submittedOn}</td>
                      <td>
                        <span className={`ae-status-badge ${submission.status.toLowerCase()}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="ae-marks-cell">{submission.marks}</td>
                      <td>
                        <button
                          className={`ae-btn-feedback ${submission.feedback.toLowerCase()}`}
                          onClick={() =>
                            submission.feedback === 'View'
                              ? openFeedbackModal(submission)
                              : openGradingModal(submission)
                          }
                          data-testid={`school-button-feedback-${submission.id}`}
                        >
                          {submission.feedback}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── EXAMS TAB ── */}
      {activeTab === 'exams' && (
        <div className="ae-exams-section">
          <div className="ae-section-header">
            <h2>Scheduled Exams</h2>
            <button className="ae-btn-create" onClick={openExamModal} data-testid="school-button-schedule-exam">
              <span>+</span> Schedule Exam
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="ae-empty-state">
              <p>There are no scheduled exams</p>
            </div>
          ) : (
            <div className="ae-exams-list">
              {exams.map(exam => (
                <div key={exam.id} className="ae-exam-card" data-testid={`school-card-exam-${exam.id}`}>
                  <div className="ae-exam-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="ae-exam-content">
                    <div className="ae-exam-details">
                      {/* Title + class as first cell */}
                      <div className="ae-detail-item">
                        <h3>{exam.title}</h3>
                        <span className="ae-value">{exam.class}</span>
                      </div>
                      <div className="ae-detail-item">
                        <span className="ae-label">Date</span>
                        <span className="ae-value">{exam.date}</span>
                      </div>
                      <div className="ae-detail-item">
                        <span className="ae-label">Duration</span>
                        <span className="ae-value">{exam.duration}</span>
                      </div>
                      <div className="ae-detail-item">
                        <span className="ae-label">Total Marks</span>
                        <span className="ae-value">{exam.totalMarks}</span>
                      </div>
                      {/* Actions span full width on smaller screens */}
                      <div className="ae-exam-actions">
                        <button
                          className="ae-btn-edit-exam"
                          onClick={() => openEditExamModal(exam)}
                          data-testid={`school-button-edit-exam-${exam.id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="ae-btn-delete-exam"
                          onClick={() => openDeleteExamModal(exam)}
                          data-testid={`school-button-delete-exam-${exam.id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE ASSIGNMENT MODAL ── */}
      {isAssignmentModalOpen && (
        <div className="ae-modal-overlay" onClick={() => setIsAssignmentModalOpen(false)}>
          <div className="ae-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-create-assignment">
            <div className="ae-modal-header">
              <h2>Create New Assignment</h2>
              <button className="ae-btn-close" onClick={() => setIsAssignmentModalOpen(false)}>×</button>
            </div>
            <p className="ae-modal-subtitle">Enter the details for the new assignment.</p>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Title</label>
                <input type="text" placeholder="Enter assignment title" value={assignmentFormData.title} onChange={e => handleAssignmentInputChange('title', e.target.value)} data-testid="school-field-assignment-title" />
              </div>
              <div className="ae-form-group">
                <label>Class</label>
                <input type="text" placeholder="e.g., Class 9A" value={assignmentFormData.class} onChange={e => handleAssignmentInputChange('class', e.target.value)} data-testid="school-field-assignment-class" />
              </div>
              <div className="ae-form-group">
                <label>Deadline</label>
                <input type="date" value={assignmentFormData.deadline} onChange={e => handleAssignmentInputChange('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} data-testid="school-field-assignment-deadline" />
              </div>
              <div className="ae-form-group">
                <label>Description</label>
                <textarea placeholder="Assignment details" value={assignmentFormData.description} onChange={e => handleAssignmentInputChange('description', e.target.value)} rows={3} data-testid="school-field-assignment-description" />
              </div>
              <div className="ae-form-group">
                <label>Attach File (Optional)</label>
                <input type="file" onChange={handleFileChange} data-testid="school-field-assignment-file" />
                {assignmentFormData.file && <p className="ae-file-name">Selected: {assignmentFormData.file.name}</p>}
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={() => setIsAssignmentModalOpen(false)} data-testid="school-button-cancel-assignment">Cancel</button>
              <button className="ae-btn-submit" onClick={handleCreateAssignment} data-testid="school-button-submit-assignment">Create Assignment</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE EXAM MODAL ── */}
      {isExamModalOpen && (
        <div className="ae-modal-overlay" onClick={() => setIsExamModalOpen(false)}>
          <div className="ae-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-schedule-exam">
            <div className="ae-modal-header">
              <h2>Schedule New Exam</h2>
              <button className="ae-btn-close" onClick={() => setIsExamModalOpen(false)}>×</button>
            </div>
            <p className="ae-modal-subtitle">Enter the details for the exam.</p>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Exam Title</label>
                <input type="text" placeholder="Enter exam title" value={examFormData.title} onChange={e => handleExamInputChange('title', e.target.value)} data-testid="school-field-exam-title" />
              </div>
              <div className="ae-form-group">
                <label>Class</label>
                <input type="text" placeholder="e.g., Class 9A" value={examFormData.class} onChange={e => handleExamInputChange('class', e.target.value)} data-testid="school-field-exam-class" />
              </div>
              <div className="ae-form-row">
                <div className="ae-form-group">
                  <label>Date</label>
                  <input type="date" value={examFormData.date} onChange={e => handleExamInputChange('date', e.target.value)} min={new Date().toISOString().split('T')[0]} data-testid="school-field-exam-date" />
                </div>
                <div className="ae-form-group">
                  <label>Duration</label>
                  <input type="text" placeholder="e.g., 3 hours" value={examFormData.duration} onChange={e => handleExamInputChange('duration', e.target.value)} data-testid="school-field-exam-duration" />
                </div>
              </div>
              <div className="ae-form-group">
                <label>Total Marks</label>
                <input type="number" placeholder="Enter total marks" value={examFormData.totalMarks} onChange={e => handleExamInputChange('totalMarks', e.target.value)} data-testid="school-field-exam-marks" />
              </div>
              <div className="ae-form-group">
                <label>Description</label>
                <textarea placeholder="Exam details" value={examFormData.description} onChange={e => handleExamInputChange('description', e.target.value)} rows={3} data-testid="school-field-exam-description" />
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={() => setIsExamModalOpen(false)} data-testid="school-button-cancel-exam">Cancel</button>
              <button className="ae-btn-submit" onClick={handleCreateExam} data-testid="school-button-submit-exam">Schedule Exam</button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD GRADES MODAL ── */}
      {isGradeModalOpen && (
        <div className="ae-modal-overlay" onClick={() => setIsGradeModalOpen(false)}>
          <div className="ae-modal-content ae-small" onClick={e => e.stopPropagation()} data-testid="school-modal-upload-grades">
            <div className="ae-modal-header">
              <h2>Upload Grades</h2>
              <button className="ae-btn-close" onClick={() => setIsGradeModalOpen(false)}>×</button>
            </div>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Upload CSV File</label>
                <input type="file" accept=".csv" data-testid="school-field-grades-file" />
                <p className="ae-hint">Upload a CSV file with student grades</p>
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={() => setIsGradeModalOpen(false)} data-testid="school-button-cancel-grades">Cancel</button>
              <button className="ae-btn-submit" onClick={() => setIsGradeModalOpen(false)} data-testid="school-button-submit-grades">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT ASSIGNMENT MODAL ── */}
      {isEditModalOpen && selectedAssignment && (
        <div className="ae-modal-overlay" onClick={closeEditModal}>
          <div className="ae-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-edit-assignment">
            <div className="ae-modal-header">
              <h2>Edit Assignment</h2>
              <button className="ae-btn-close" onClick={closeEditModal}>×</button>
            </div>
            <p className="ae-modal-subtitle">Update the assignment details.</p>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Title</label>
                <input type="text" placeholder="Enter assignment title" value={assignmentFormData.title} onChange={e => handleAssignmentInputChange('title', e.target.value)} data-testid="school-field-edit-assignment-title" />
              </div>
              <div className="ae-form-group">
                <label>Class</label>
                <input type="text" placeholder="e.g., Class 9A" value={assignmentFormData.class} onChange={e => handleAssignmentInputChange('class', e.target.value)} data-testid="school-field-edit-assignment-class" />
              </div>
              <div className="ae-form-group">
                <label>Deadline</label>
                <input type="date" value={assignmentFormData.deadline} onChange={e => handleAssignmentInputChange('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} data-testid="school-field-edit-assignment-deadline" />
              </div>
              <div className="ae-form-group">
                <label>Description</label>
                <textarea placeholder="Assignment details" value={assignmentFormData.description} onChange={e => handleAssignmentInputChange('description', e.target.value)} rows={3} data-testid="school-field-edit-assignment-description" />
              </div>
              <div className="ae-form-group">
                <label>Attach File (Optional)</label>
                {assignmentFormData.existingAttachment && !assignmentFormData.file && (
                  <div className="ae-existing-attachment">
                    <span className="ae-attachment-icon">📎</span>
                    <span className="ae-attachment-name">{assignmentFormData.existingAttachment}</span>
                    <span className="ae-attachment-hint"> (Current attachment)</span>
                  </div>
                )}
                <input type="file" onChange={handleFileChange} data-testid="school-field-edit-assignment-file" />
                {assignmentFormData.file && <p className="ae-file-name">New file selected: {assignmentFormData.file.name}</p>}
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeEditModal} data-testid="school-button-cancel-edit-assignment">Cancel</button>
              <button className="ae-btn-submit" onClick={handleUpdateAssignment} data-testid="school-button-save-edit-assignment">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ASSIGNMENT DETAILS MODAL ── */}
      {isDetailsModalOpen && selectedAssignment && (
        <div className="ae-modal-overlay" onClick={closeDetailsModal}>
          <div className="ae-modal-content ae-small" onClick={e => e.stopPropagation()} data-testid="school-modal-assignment-details">
            <div className="ae-modal-header">
              <h2>{selectedAssignment.title}</h2>
              <button className="ae-btn-close" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="ae-modal-body">
              <div className="ae-details-section">
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Class:</span>
                  <span className="ae-detail-value">{selectedAssignment.class}</span>
                </div>
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Deadline:</span>
                  <span className="ae-detail-value">{selectedAssignment.deadline}</span>
                </div>
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Submissions:</span>
                  <span className="ae-detail-value">
                    {selectedAssignment.submissions.submitted}/{selectedAssignment.submissions.total}
                  </span>
                </div>
              </div>
              <div className="ae-details-section">
                <h4>Description</h4>
                <p>{selectedAssignment.description}</p>
              </div>
              {selectedAssignment.attachment && (
                <div className="ae-details-section">
                  <h4>Attachment</h4>
                  <div className="ae-attachment-display">
                    <span className="ae-attachment-icon">📎</span>
                    <span className="ae-attachment-name">{selectedAssignment.attachment}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-edit" onClick={() => openEditModal(selectedAssignment)} data-testid={`school-button-edit-modal-${selectedAssignment.id}`}>✏️ Edit</button>
              <button className="ae-btn-delete" onClick={() => openDeleteModal(selectedAssignment)} data-testid={`school-button-delete-modal-${selectedAssignment.id}`}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW FEEDBACK MODAL ── */}
      {isFeedbackModalOpen && selectedSubmission && (
        <div className="ae-modal-overlay" onClick={closeFeedbackModal}>
          <div className="ae-modal-content ae-small" onClick={e => e.stopPropagation()} data-testid="school-modal-view-feedback">
            <div className="ae-modal-header">
              <h2>Submission Feedback</h2>
              <button className="ae-btn-close" onClick={closeFeedbackModal}>×</button>
            </div>
            <div className="ae-modal-body">
              <div className="ae-details-section">
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Student:</span>
                  <span className="ae-detail-value">{selectedSubmission.student}</span>
                </div>
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Submitted On:</span>
                  <span className="ae-detail-value">{selectedSubmission.submittedOn}</span>
                </div>
                <div className="ae-detail-row">
                  <span className="ae-detail-label">Marks:</span>
                  <span className="ae-detail-value">{selectedSubmission.marks}</span>
                </div>
              </div>
              <div className="ae-details-section">
                <h4>Feedback</h4>
                <p>{selectedSubmission.writtenFeedback}</p>
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeFeedbackModal} data-testid="school-button-close-feedback">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── GRADING MODAL ── */}
      {isGradingModalOpen && selectedSubmission && (
        <div className="ae-modal-overlay" onClick={closeGradingModal}>
          <div className="ae-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-grading">
            <div className="ae-modal-header">
              <h2>Grade Submission</h2>
              <button className="ae-btn-close" onClick={closeGradingModal}>×</button>
            </div>
            <p className="ae-modal-subtitle">Provide marks and feedback for the student's submission.</p>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Student Name</label>
                <input type="text" value={selectedSubmission.student} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} data-testid="school-field-grading-student" />
              </div>
              <div className="ae-form-group">
                <label>Submitted On</label>
                <input type="text" value={selectedSubmission.submittedOn} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} data-testid="school-field-grading-date" />
              </div>
              <div className="ae-form-row">
                <div className="ae-form-group">
                  <label>Marks Obtained</label>
                  <input type="number" placeholder="Enter marks" value={gradingFormData.marksObtained} onChange={e => handleGradingInputChange('marksObtained', e.target.value)} data-testid="school-field-marks-obtained" />
                </div>
                <div className="ae-form-group">
                  <label>Out of</label>
                  <input type="number" placeholder="Total marks" value={gradingFormData.totalMarks} onChange={e => handleGradingInputChange('totalMarks', e.target.value)} data-testid="school-field-total-marks" />
                </div>
              </div>
              <div className="ae-form-group">
                <label>Written Feedback</label>
                <textarea placeholder="Provide detailed feedback for the student..." value={gradingFormData.writtenFeedback} onChange={e => handleGradingInputChange('writtenFeedback', e.target.value)} rows={4} data-testid="school-field-written-feedback" />
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeGradingModal} data-testid="school-button-cancel-grading">Cancel</button>
              <button className="ae-btn-submit" onClick={handleSubmitGrade} data-testid="school-button-submit-grade">Submit Grade</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT EXAM MODAL ── */}
      {isEditExamModalOpen && selectedExam && (
        <div className="ae-modal-overlay" onClick={closeEditExamModal}>
          <div className="ae-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-edit-exam">
            <div className="ae-modal-header">
              <h2>Edit Exam</h2>
              <button className="ae-btn-close" onClick={closeEditExamModal}>×</button>
            </div>
            <p className="ae-modal-subtitle">Update the exam details.</p>
            <div className="ae-modal-body">
              <div className="ae-form-group">
                <label>Exam Title</label>
                <input type="text" placeholder="Enter exam title" value={examFormData.title} onChange={e => handleExamInputChange('title', e.target.value)} data-testid="school-field-edit-exam-title" />
              </div>
              <div className="ae-form-group">
                <label>Class</label>
                <input type="text" placeholder="e.g., Class 9A" value={examFormData.class} onChange={e => handleExamInputChange('class', e.target.value)} data-testid="school-field-edit-exam-class" />
              </div>
              <div className="ae-form-row">
                <div className="ae-form-group">
                  <label>Date</label>
                  <input type="date" value={examFormData.date} onChange={e => handleExamInputChange('date', e.target.value)} data-testid="school-field-edit-exam-date" />
                </div>
                <div className="ae-form-group">
                  <label>Duration</label>
                  <input type="text" placeholder="e.g., 3 hours" value={examFormData.duration} onChange={e => handleExamInputChange('duration', e.target.value)} data-testid="school-field-edit-exam-duration" />
                </div>
              </div>
              <div className="ae-form-group">
                <label>Total Marks</label>
                <input type="number" placeholder="Enter total marks" value={examFormData.totalMarks} onChange={e => handleExamInputChange('totalMarks', e.target.value)} data-testid="school-field-edit-exam-marks" />
              </div>
              <div className="ae-form-group">
                <label>Description</label>
                <textarea placeholder="Exam details" value={examFormData.description} onChange={e => handleExamInputChange('description', e.target.value)} rows={3} data-testid="school-field-edit-exam-description" />
              </div>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeEditExamModal} data-testid="school-button-cancel-edit-exam">Cancel</button>
              <button className="ae-btn-submit" onClick={handleUpdateExam} data-testid="school-button-save-edit-exam">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE EXAM CONFIRMATION ── */}
      {isDeleteExamModalOpen && examToDelete && (
        <div className="ae-modal-overlay" onClick={closeDeleteExamModal}>
          <div className="ae-modal-content ae-small" onClick={e => e.stopPropagation()} data-testid="school-modal-delete-exam-confirmation">
            <div className="ae-modal-header">
              <h2>Delete Exam</h2>
              <button className="ae-btn-close" onClick={closeDeleteExamModal}>×</button>
            </div>
            <div className="ae-modal-body">
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: '1.6', margin: '0' }}>
                Are you sure you want to delete <strong>"{examToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeDeleteExamModal} data-testid="school-button-cancel-delete-exam">Cancel</button>
              <button className="ae-btn-delete" onClick={confirmDeleteExam} data-testid="school-button-confirm-delete-exam">🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE ASSIGNMENT CONFIRMATION ── */}
      {isDeleteModalOpen && assignmentToDelete && (
        <div className="ae-modal-overlay" onClick={closeDeleteModal}>
          <div className="ae-modal-content ae-small" onClick={e => e.stopPropagation()} data-testid="school-modal-delete-confirmation">
            <div className="ae-modal-header">
              <h2>Delete Assignment</h2>
              <button className="ae-btn-close" onClick={closeDeleteModal}>×</button>
            </div>
            <div className="ae-modal-body">
              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: '1.6', margin: '0' }}>
                Are you sure you want to delete <strong>"{assignmentToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="ae-modal-footer">
              <button className="ae-btn-cancel" onClick={closeDeleteModal} data-testid="school-button-cancel-delete">Cancel</button>
              <button className="ae-btn-delete" onClick={confirmDeleteAssignment} data-testid="school-button-confirm-delete">🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      <FloatingAIAssistant />
    </div>
  );
};

export default AssignmentsExams;