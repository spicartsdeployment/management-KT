import React from 'react';
import PropTypes from 'prop-types';
import CustomDropdown from './CustomDropdown';
import { reportData } from '../constants/performanceData';

/**
 * AcademicMetricCard Component - Single metric display
 */
const AcademicMetricCard = ({ metric, index }) => (
  <div 
    key={index} 
    className="academic-metric-card" 
    data-testid={`school-metric-${metric.className}`}
  >
    <div className={`academic-circle ${metric.className}`}>
      <div className="academic-inner">{metric.value}</div>
    </div>
    <div className="academic-label">{metric.label}</div>
    <div className="academic-sublabel">{metric.sublabel}</div>
  </div>
);

AcademicMetricCard.propTypes = {
  metric: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sublabel: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

/**
 * PerformanceIcon Component - SVG icon for performance section
 */
const PerformanceIcon = ({ isDarkMode }) => (
  <div className="row-3-icon" style={{
    background: isDarkMode ? 'transparent' : 'rgba(219, 234, 254, 0.5)',
    border: '1px solid #6495ed22',
    boxShadow: '0 2px 8px #6495ed15'
  }}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="5" stroke="#6495ed" strokeWidth="2" />
      <path d="M9 15L9 19L12 17L15 19L15 15" stroke="#6495ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

PerformanceIcon.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

/**
 * QuickStatsIcon Component - Renders star SVG
 */
const QuickStatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.01-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45.28-.213.46-.536.82-1.182l.328-.588z"
      stroke="#6495ed"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * GPAStatItem Component - Displays GPA stat
 */
const GPAStatItem = () => (
  <div className="stat-item" data-testid="school-stat-gpa">
    <div className="stat-item-header">
      <p className="stat-label">Current GPA</p>
      <span className="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 8L12 3L17 8L15 13H9L7 8Z" stroke="#6495ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 13H19C19.5523 13 20 13.4477 20 14V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V14C4 13.4477 4.44772 13 5 13Z" stroke="#6495ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 13V16" stroke="#6495ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="18" r="1" fill="#6495ed" />
        </svg>
      </span>
    </div>
    <h3 className="stat-value">3.8</h3>
    <p className="stat-description">+0.2 from last term</p>
  </div>
);

/**
 * TopSubjectStatItem Component - Displays top subject
 */
const TopSubjectStatItem = () => (
  <div className="stat-item top-subject" data-testid="school-stat-top-subject">
    <div className="stat-item-header">
      <p className="stat-label">Top Subject</p>
      <span className="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#5edf77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
    <h3 className="stat-value">English</h3>
    <p className="stat-description">90% - Outstanding</p>
  </div>
);

/**
 * ClassRankStatItem Component - Displays class rank
 */
const ClassRankStatItem = () => (
  <div className="stat-item class-rank" data-testid="school-stat-rank">
    <div className="stat-item-header">
      <p className="stat-label">Class Rank</p>
      <span className="stat-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="5" stroke="#a29bfe" strokeWidth="1.5" />
          <path d="M8 13L9 22L12 20L15 22L16 13" stroke="#a29bfe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
    <h3 className="stat-value">7th</h3>
    <p className="stat-description">out of 45 students</p>
  </div>
);

/**
 * QuickStatsCard Component - Container for all stats
 */
const QuickStatsCard = () => (
  <div className="quick-stats-card" data-testid="school-card-quick-stats">
    <div className="quick-stats-header">
      <span className="quick-stats-icon">
        <QuickStatsIcon />
      </span>
      <h3 className="quick-stats-title">Quick Stats</h3>
    </div>
    <div className="stats-list">
      <GPAStatItem />
      <TopSubjectStatItem />
      <ClassRankStatItem />
    </div>
  </div>
);

/**
 * ReportTableRow Component - Single table row
 */
const ReportTableRow = ({ row, index }) => (
  <tr key={index}>
    <td>{row.subject}</td>
    <td>{row.marks}</td>
    <td>{row.percentage}</td>
    <td>
      <span className={`grade-badge grade-${row.grade.charAt(0).toLowerCase()}`}>
        {row.grade}
      </span>
    </td>
  </tr>
);

ReportTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

/**
 * ReportCard Component - Full report card display
 */
const ReportCard = ({ selectedTerm, onTermChange }) => (
  <div className="report-card" data-testid="school-card-report">
    <div className="report-card-header">
      <h3 className="report-card-title">Report Card</h3>
      <CustomDropdown
        id="performance-term-select"
        value={selectedTerm}
        onChange={onTermChange}
        options={['Mid-Term Examination 2024', 'Quarter Term 2024', 'Annual Examination 2024']}
        testId="school-dropdown-performance-term"
        className="term-dropdown"
      />
    </div>
    <div className="report-summary">
      <div className="summary-item">
        <p className="summary-label">Total Marks</p>
        <h3 className="summary-value">512/600</h3>
      </div>
      <div className="summary-item">
        <p className="summary-label">Percentage</p>
        <h3 className="summary-value">85.3%</h3>
      </div>
      <div className="summary-item">
        <p className="summary-label">Grade</p>
        <h3 className="summary-value grade">A</h3>
      </div>
    </div>
    <table className="report-table">
      <thead>
        <tr>
          <th>SUBJECT</th>
          <th>MARKS</th>
          <th>PERCENTAGE</th>
          <th>GRADE</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((row, index) => (
          <ReportTableRow key={index} row={row} index={index} />
        ))}
        <tr>
          <td>OVERALL</td>
          <td>512 / 600</td>
          <td>85.3%</td>
          <td>
            <span className="grade-badge grade-a">A</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

ReportCard.propTypes = {
  selectedTerm: PropTypes.string.isRequired,
  onTermChange: PropTypes.func.isRequired
};

/**
 * SubjectScoreCard Component - Single subject score display
 */
const SubjectScoreCard = ({ selectedSubject, currentSubjectData }) => (
  <div className="subject-score-card" data-testid="school-card-subject-score">
    <div style={{
      width: 56,
      height: 56,
      background: `${currentSubjectData.subjectColor}15`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.75rem',
      flexShrink: 0
    }}>
      {currentSubjectData.icon}
    </div>
    <div className="sch-per-academic-subject-info-wrapper">
      <h3 className="sch-per-academic-subject-name-text">
        {selectedSubject}
      </h3>
      <div className="sch-per-academic-subject-score-group">
        <h2 className="sch-per-academic-subject-percentage-text" style={{ color: currentSubjectData.subjectColor }}>
          {currentSubjectData.percentage}%
        </h2>
        <span className="sch-per-academic-subject-grade-badge">
          {currentSubjectData.tag}
        </span>
      </div>
    </div>
  </div>
);

SubjectScoreCard.propTypes = {
  selectedSubject: PropTypes.string.isRequired,
  currentSubjectData: PropTypes.object.isRequired
};

/**
 * TeacherFeedbackCard Component - Teacher feedback display
 */
const TeacherFeedbackCard = ({ currentSubjectData }) => (
  <div className="teacher-feedback-card" data-testid="school-card-teacher-feedback">
    <div className="feedback-header">
      <div>
        <h4 className="feedback-title" style={{ color: currentSubjectData.subjectColor }}>TEACHER FEEDBACK</h4>
        <div className="teacher-info">
          <div className="sch-per-academic-teacher-avatar-wrapper" style={{
            background: `${currentSubjectData.subjectColor}15`,
            color: currentSubjectData.subjectColor
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h4 className="teacher-name">{currentSubjectData.teacher}</h4>
            <p className="teacher-role">{currentSubjectData.role}</p>
          </div>
        </div>
      </div>
      <div className="star-rating">
        {[...Array(currentSubjectData.rating)].map((_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
    </div>
    <p className="feedback-text">&quot;{currentSubjectData.feedback}&quot;</p>
    <p className="feedback-date">{currentSubjectData.date}</p>
  </div>
);

TeacherFeedbackCard.propTypes = {
  currentSubjectData: PropTypes.object.isRequired
};

/**
 * TopicPerformanceCard Component - Single topic card
 */
const TopicPerformanceCard = ({ topic, index, currentSubjectData }) => (
  <div key={index} className="topic-card" data-testid={`school-topic-${index}`}>
    <div className="topic-circle" style={{
      background: `conic-gradient(${currentSubjectData.subjectColor} 0% ${topic.percentage}%, #e5e7eb ${topic.percentage}% 100%)`,
      filter: `drop-shadow(0 4px 12px ${currentSubjectData.subjectColor}33)`
    }}>
      <div className="topic-inner">{topic.percentage}%</div>
    </div>
    <div className="topic-name">{topic.name}</div>
  </div>
);

TopicPerformanceCard.propTypes = {
  topic: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  currentSubjectData: PropTypes.object.isRequired
};

/**
 * TopicsPerformanceSection Component - All topics display
 */
const TopicsPerformanceSection = ({ currentSubjectData }) => (
  <div className="topics-performance-section" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
    <h3 className="topics-header" style={{ color: currentSubjectData.subjectColor }}>TOPICS PERFORMANCE</h3>
    <div className="topics-grid">
      {currentSubjectData.topics.map((topic, index) => (
        <TopicPerformanceCard 
          key={index} 
          topic={topic} 
          index={index} 
          currentSubjectData={currentSubjectData} 
        />
      ))}
    </div>
  </div>
);

TopicsPerformanceSection.propTypes = {
  currentSubjectData: PropTypes.object.isRequired
};

/**
 * AcademicTab Component - Displays academic performance details
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const AcademicTab = ({ 
  selectedSubject, 
  selectedTerm,
  currentSubjectData,
  isDarkMode,
  onSubjectChange,
  onTermChange 
}) => {
  const metrics = [
    { value: '95%', label: 'Attendance', sublabel: 'Regular presence', className: 'attendance' },
    { value: '88%', label: 'Assignments', sublabel: 'Completed on time', className: 'assignments' },
    { value: '92%', label: 'Exams', sublabel: 'Exam performance', className: 'exams' },
    { value: '78%', label: 'Projects', sublabel: 'Project submissions', className: 'projects' }
  ];

  return (
    <>
      {/* ROW 3: Academic Performance */}
      <div className="row-3" data-testid="school-section-academic-performance">
        <div className="row-3-header">
          <PerformanceIcon isDarkMode={isDarkMode} />
          <div>
            <h2 className="row-3-title">Academic Performance</h2>
            <p className="row-3-subtitle">Detailed breakdown and insights</p>
          </div>
          <div className="row-3-badge">95%</div>
        </div>

        {/* Student Overall Performance Section */}
        <div className="sch-per-academic-section-wrapper">
          <h2 className="sch-per-academic-main-title">
            Student Overall Performance
          </h2>
          <p className="sch-per-academic-main-subtitle">
            Track your progress across different metrics
          </p>
        </div>

        {/* Academic Metrics Container */}
        <div className="academic-metrics-container sch-per-academic-metrics-wrapper">
          <h3 className="sch-per-academic-metrics-title">
            Academic Metrics
          </h3>
          <div className="academic-metrics">
            {metrics.map((metric, index) => (
              <AcademicMetricCard key={index} metric={metric} index={index} />
            ))}
          </div>
        </div>

        {/* Quick Stats & Report Card */}
        <div className="stats-report-section">
          <QuickStatsCard />
          <ReportCard selectedTerm={selectedTerm} onTermChange={onTermChange} />
        </div>
      </div>

      {/* ROW 4: Performance Analytics */}
      <div className="row-4" data-testid="school-section-performance-analytics">
        <div className="row-4-header">
          <h2 className="row-4-title">Performance Analytics</h2>
          <p className="row-4-subtitle">Comprehensive overview of your academic progress</p>
        </div>

        {/* Analysis & Feedback + Topics Performance */}
        <div className="sch-per-academic-subject-analysis-wrapper">
          <div className="analysis-header">
            <div className="analysis-title-section">
              <svg className="analysis-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: currentSubjectData.subjectColor }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <h3 className="analysis-title">Analysis & Feedback</h3>
            </div>
            <CustomDropdown
              id="performance-subject-select"
              value={selectedSubject}
              onChange={onSubjectChange}
              options={['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology']}
              testId="school-dropdown-performance-subject"
              className="subject-dropdown"
              customStyles={{
                borderColor: currentSubjectData.subjectColor,
                color: currentSubjectData.subjectColor
              }}
            />
          </div>

          <div className="analysis-content">
            <SubjectScoreCard 
              selectedSubject={selectedSubject} 
              currentSubjectData={currentSubjectData} 
            />
            <TeacherFeedbackCard currentSubjectData={currentSubjectData} />
          </div>

          <TopicsPerformanceSection currentSubjectData={currentSubjectData} />
        </div>
      </div>
    </>
  );
};

AcademicTab.propTypes = {
  selectedSubject: PropTypes.string.isRequired,
  selectedTerm: PropTypes.string.isRequired,
  currentSubjectData: PropTypes.object.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onSubjectChange: PropTypes.func.isRequired,
  onTermChange: PropTypes.func.isRequired
};

export default AcademicTab;
