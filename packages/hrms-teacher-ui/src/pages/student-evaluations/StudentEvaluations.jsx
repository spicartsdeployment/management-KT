import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/StudentEvaluations.scss';

// Dummy student data
const studentsData = [
  {
    id: 1,
    name: 'Aarav Sharma',
    rollNo: '001',
    academicYear: '2025-2026',
    avatar: '👨‍🎓'
  },
  {
    id: 2,
    name: 'Priya Patel',
    rollNo: '002',
    academicYear: '2025-2026',
    avatar: '👩‍🎓'
  },
  {
    id: 3,
    name: 'Rohan Gupta',
    rollNo: '003',
    academicYear: '2025-2026',
    avatar: '👨‍🎓'
  },
  {
    id: 4,
    name: 'Ananya Singh',
    rollNo: '004',
    academicYear: '2025-2026',
    avatar: '👩‍🎓'
  },
  {
    id: 5,
    name: 'Arjun Reddy',
    rollNo: '005',
    academicYear: '2025-2026',
    avatar: '👨‍🎓'
  }
];

const StudentEvaluations = () => {
  // State for filters
  const [selectedClass, setSelectedClass] = useState('Class 7 A');
  const [selectedTerm, setSelectedTerm] = useState('Quarterly');
  
  // State for current student navigation
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  
  // State for academic performance
  const [academicPerformance, setAcademicPerformance] = useState({
    attendance: 85,
    assignments: 80,
    exams: 75,
    projects: 90
  });
  
  // State for behavioral assessment
  const [behavioralAssessment, setBehavioralAssessment] = useState({
    punctuality: 90,
    participation: 85,
    teamSkills: 80,
    leadership: 75,
    discipline: 95,
    obedience: 88
  });
  
  // State for teacher feedback
  const [overallRating, setOverallRating] = useState(0);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  
  const currentStudent = studentsData[currentStudentIndex];
  
  // Helper function to get performance tag
  const getPerformanceTag = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'se-excellent' };
    if (score >= 75) return { label: 'Good', color: 'se-good' };
    if (score >= 60) return { label: 'Average', color: 'se-average' };
    return { label: 'Needs Improvement', color: 'se-needs-improvement' };
  };
  
  // Navigation handlers
  const handlePrevious = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
      resetEvaluationForm();
    }
  };
  
  const handleSaveAndNext = () => {
    // Save current evaluation (console log for demo)
    console.log('Saving evaluation for:', currentStudent.name, {
      academicPerformance,
      behavioralAssessment,
      overallRating,
      detailedFeedback
    });
    
    // Move to next student
    if (currentStudentIndex < studentsData.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
      resetEvaluationForm();
    }
  };
  
  const resetEvaluationForm = () => {
    setAcademicPerformance({
      attendance: 85,
      assignments: 80,
      exams: 75,
      projects: 90
    });
    setBehavioralAssessment({
      punctuality: 90,
      participation: 85,
      teamSkills: 80,
      leadership: 75,
      discipline: 95,
      obedience: 88
    });
    setOverallRating(0);
    setDetailedFeedback('');
  };
  
  // Handler for academic performance slider
  const handleAcademicChange = (field, value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setAcademicPerformance(prev => ({
        ...prev,
        [field]: Math.max(0, Math.min(100, numValue))
      }));
    }
  };
  
  // Handler for behavioral assessment slider
  const handleBehavioralChange = (field, value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setBehavioralAssessment(prev => ({
        ...prev,
        [field]: Math.max(0, Math.min(100, numValue))
      }));
    }
  };
  
  // Star rating component
  const StarRating = ({ rating, onChange }) => {
    return (
      <div className="se-star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`se-star ${star <= rating ? 'se-filled' : ''}`}
            onClick={() => onChange(star)}
          >
            ☆
          </span>
        ))}
        <span className="se-rating-text">{rating}/5</span>
      </div>
    );
  };
  
  // Progress bar component
  const ProgressBar = ({ label, value, onChange, tagColor }) => {
    const tag = getPerformanceTag(value);
    const percentage = value;
    
    return (
      <div className="se-progress-bar-group">
        <div className="se-progress-header">
          <label>{label}</label>
          <span className={`se-performance-tag ${tag.color}`}>{tag.label}</span>
        </div>
        <div className="se-progress-controls">
          <input
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="se-progress-input"
          />
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="se-progress-slider"
            style={{
              background: `linear-gradient(to right, #3730a3 0%, #4f46e5 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
            }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="se-student-evaluation-form" data-testid="teacher-page-student-evaluations">
      {/* Page Header */}
      <div className="se-page-header">
        <div className="se-header-text">
          <h1>Student Evaluation Form</h1>
          <p>Rate and review student academic and behavioral performance</p>
        </div>
      </div>
      
      {/* Header Container */}
      <div className="se-header-container">
        {/* Filters Section */}
        <div className="se-filters-section">
          <div className="se-filter-group">
            <label>Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              data-testid="school-dropdown-select-class"
            >
              <option value="Class 7 A">Class 7 A</option>
              <option value="Class 7 B">Class 7 B</option>
              <option value="Class 8 A">Class 8 A</option>
              <option value="Class 8 B">Class 8 B</option>
              <option value="Class 9 A">Class 9 A</option>
              <option value="Class 9 B">Class 9 B</option>
              <option value="Class 10 A">Class 10 A</option>
              <option value="Class 10 B">Class 10 B</option>
            </select>
          </div>
          
          <div className="se-filter-group">
            <label>Term Evaluation</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              data-testid="school-dropdown-term-evaluation"
            >
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Annual">Annual</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Final Term">Final Term</option>
            </select>
          </div>
          
          <div className="se-teacher-info">
            <div className="se-teacher-avatar">
              <span>👨‍🏫</span>
            </div>
            <div className="se-teacher-details">
              <div className="se-teacher-name">Prof. Ramesh Kumar</div>
              <div className="se-teacher-subject">Math & Science</div>
            </div>
          </div>
        </div>
        
        {/* Student Information Card */}
        <div className="se-student-info-card">
        <div className="se-student-details">
          <div className="se-student-avatar">
            <span>{currentStudent.avatar}</span>
          </div>
          <div className="se-student-meta">
            <div className="se-meta-item">
              <span className="se-meta-label">Student {currentStudentIndex + 1} of {studentsData.length}: Name</span>
              <span className="se-meta-value">{currentStudent.name}</span>
            </div>
            <div className="se-meta-item">
              <span className="se-meta-label">Roll No</span>
              <span className="se-meta-value">{currentStudent.rollNo}</span>
            </div>
            <div className="se-meta-item">
              <span className="se-meta-label">Academic Year</span>
              <span className="se-meta-value">{currentStudent.academicYear}</span>
            </div>
          </div>
        </div>
        
        <div className="se-navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentStudentIndex === 0}
            className="se-btn-previous"
            data-testid="school-button-previous"
          >
            ← Previous
          </button>
          <button
            onClick={handleSaveAndNext}
            disabled={currentStudentIndex === studentsData.length - 1}
            className="se-btn-save-next"
            data-testid="school-button-save-next"
          >
            Save & Next →
          </button>
        </div>
      </div>
      </div>
      
      {/* Academic Performance Section */}
      <div className="se-evaluation-section">
        <div className="se-section-header">
          <h2>1. Academic Performance (Out of 100)</h2>
        </div>
        
        <div className="se-performance-grid se-academic-grid">
          <ProgressBar
            label="Attendance"
            value={academicPerformance.attendance}
            onChange={(val) => handleAcademicChange('attendance', val)}
          />
          <ProgressBar
            label="Assignments"
            value={academicPerformance.assignments}
            onChange={(val) => handleAcademicChange('assignments', val)}
          />
          <ProgressBar
            label="Exams"
            value={academicPerformance.exams}
            onChange={(val) => handleAcademicChange('exams', val)}
          />
          <ProgressBar
            label="Projects"
            value={academicPerformance.projects}
            onChange={(val) => handleAcademicChange('projects', val)}
          />
        </div>
        
        <div className="se-rating-info">
          <span className="se-info-icon">ℹ️</span>
          <span>Rating Scale: ≥90% = Excellent | ≥75% = Good | ≥60% = Average | &lt;60% = Needs Improvement</span>
        </div>
      </div>
      
      {/* Behavioral Assessment Section */}
      <div className="se-evaluation-section">
        <div className="se-section-header">
          <h2>2. Behavior Assessment (Out of 100)</h2>
        </div>
        
        <div className="se-performance-grid se-behavioral-grid">
          <ProgressBar
            label="Punctuality"
            value={behavioralAssessment.punctuality}
            onChange={(val) => handleBehavioralChange('punctuality', val)}
          />
          <ProgressBar
            label="Participation"
            value={behavioralAssessment.participation}
            onChange={(val) => handleBehavioralChange('participation', val)}
          />
          <ProgressBar
            label="Team Skills"
            value={behavioralAssessment.teamSkills}
            onChange={(val) => handleBehavioralChange('teamSkills', val)}
          />
          <ProgressBar
            label="Leadership"
            value={behavioralAssessment.leadership}
            onChange={(val) => handleBehavioralChange('leadership', val)}
          />
          <ProgressBar
            label="Discipline"
            value={behavioralAssessment.discipline}
            onChange={(val) => handleBehavioralChange('discipline', val)}
          />
          <ProgressBar
            label="Obedience"
            value={behavioralAssessment.obedience}
            onChange={(val) => handleBehavioralChange('obedience', val)}
          />
        </div>
        
        <div className="se-rating-info">
          <span className="se-info-icon">ℹ️</span>
          <span>Rating Scale: ≥90% = Excellent | ≥75% = Good | ≥60% = Average | &lt;60% = Needs Improvement</span>
        </div>
      </div>
      
      {/* Teacher Feedback Section */}
      <div className="se-evaluation-section">
        <div className="se-section-header">
          <h2>3. Teacher Feedback</h2>
        </div>
        
        <div className="se-feedback-content">
          <div className="se-feedback-group">
            <label>Overall Rating (Out of 5)</label>
            <StarRating rating={overallRating} onChange={setOverallRating} />
          </div>
          
          <div className="se-feedback-group">
            <label>Detailed Feedback</label>
            <textarea
              value={detailedFeedback}
              onChange={(e) => setDetailedFeedback(e.target.value)}
              placeholder="Enter your detailed feedback here..."
              rows={6}
              data-testid="school-field-detailed-feedback"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEvaluations;
