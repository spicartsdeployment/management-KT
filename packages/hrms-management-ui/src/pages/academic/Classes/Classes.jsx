import React from 'react';
import '../../Assets/styles/Classes.scss';
import { MOCK_CLASSES, computeClassMetrics } from './ClassesMockData';

/**
 * ClassesMetrics - Display key metrics cards
 */
const ClassesMetrics = ({ metrics }) => {
  const cards = [
    { id: 'total', icon: '📚', label: 'Total Classes', value: metrics?.total || 0, color: 'primary' },
    { id: 'sections', icon: '📊', label: 'Total Sections', value: metrics?.sections || 0, color: 'secondary' },
    { id: 'teachers', icon: '👨‍🏫', label: 'Class Teachers', value: metrics?.teachers || 0, color: 'success' },
    { id: 'students', icon: '👥', label: 'Total Students', value: metrics?.students || 0, color: 'warning' },
    { id: 'occupancy', icon: '🏫', label: 'Avg Occupancy', value: `${metrics?.occupancy || 0}%`, color: 'info' },
  ];

  return (
    <div className="sch-classes-metrics">
      {cards.map((card) => (
        <div key={card.id} className={`sch-classes-metric-card sch-classes-metric-card--${card.color}`} data-testid={`school-metric-class-${card.id}`}>
          <div className="sch-classes-metric-icon">{card.icon}</div>
          <div className="sch-classes-metric-content">
            <div className="sch-classes-metric-value">{card.value}</div>
            <div className="sch-classes-metric-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * ClassesToolbar - Search, filters, and actions
 */
const ClassesToolbar = ({ search, onSearchChange, academicYear, onYearChange, shift, onShiftChange, onClearFilters }) => (
  <div className="sch-classes-toolbar">
    <div className="sch-classes-toolbar-search">
      <input
        type="text"
        placeholder="Search classes or sections..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sch-classes-input"
        data-testid="school-field-class-search"
      />
    </div>
    <div className="sch-classes-toolbar-filters">
      <select value={academicYear} onChange={(e) => onYearChange(e.target.value)} className="sch-classes-select" data-testid="school-dropdown-class-year">
        <option value="">All Years</option>
        <option value="2025-26">2025-26</option>
        <option value="2026-27">2026-27</option>
        <option value="2027-28">2027-28</option>
      </select>
      <select value={shift} onChange={(e) => onShiftChange(e.target.value)} className="sch-classes-select" data-testid="school-dropdown-class-shift">
        <option value="">All Shifts</option>
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
      </select>
      <button onClick={onClearFilters} className="sch-classes-btn sch-classes-btn--secondary sch-classes-btn--sm" data-testid="school-button-class-clear-filters">
        Clear Filters
      </button>
    </div>
  </div>
);

/**
 * ClassCard - Enterprise class overview card
 */
const ClassCard = ({ classData, onViewDetails }) => (
  <div className="sch-classes-card" onClick={() => onViewDetails(classData.id)} data-testid={`school-card-class-${classData.id}`}>
    <div className="sch-classes-card-header">
      <h3 className="sch-classes-card-title">Class {classData.classNumber}</h3>
      <span className={`sch-classes-badge sch-classes-badge--${classData.status}`}>{classData.status}</span>
    </div>

    <div className="sch-classes-card-grid">
      <div className="sch-classes-card-stat">
        <div className="sch-classes-card-stat-icon">📊</div>
        <div className="sch-classes-card-stat-content">
          <div className="sch-classes-card-stat-label">Sections</div>
          <div className="sch-classes-card-stat-value">{classData.totalSections}</div>
        </div>
      </div>

      <div className="sch-classes-card-stat">
        <div className="sch-classes-card-stat-icon">👥</div>
        <div className="sch-classes-card-stat-content">
          <div className="sch-classes-card-stat-label">Students</div>
          <div className="sch-classes-card-stat-value">{classData.totalStudents}</div>
        </div>
      </div>

      <div className="sch-classes-card-stat">
        <div className="sch-classes-card-stat-icon">👨‍🏫</div>
        <div className="sch-classes-card-stat-content">
          <div className="sch-classes-card-stat-label">Teachers</div>
          <div className="sch-classes-card-stat-value">{classData.totalTeachers}</div>
        </div>
      </div>

      <div className="sch-classes-card-stat">
        <div className="sch-classes-card-stat-icon">🏫</div>
        <div className="sch-classes-card-stat-content">
          <div className="sch-classes-card-stat-label">Occupancy</div>
          <div className="sch-classes-card-stat-value">{classData.avgOccupancy}%</div>
        </div>
      </div>
    </div>

    <div className="sch-classes-card-footer">
      <span className="sch-classes-card-shift">
        {classData.shift === 'morning' ? '🌅 Morning' : '🌙 Afternoon'}
      </span>
      <button className="sch-classes-card-btn" data-testid={`school-button-class-view-${classData.id}`}>
        View Details →
      </button>
    </div>
  </div>
);

/**
 * ClassDetailView - Progressive drill-down to class details
 */
const ClassDetailView = ({ classData, onBack }) => (
  <div className="sch-classes-detail">
    <div className="sch-classes-detail-header">
      <button onClick={onBack} className="sch-classes-btn sch-classes-btn--ghost" data-testid="school-button-class-back">
        ← Back to Classes
      </button>
      <h2 className="sch-classes-detail-title">Class {classData.classNumber} - Sections & Details</h2>
    </div>

    <div className="sch-classes-sections-grid">
      {classData.sections.map((section) => (
        <div key={section.id} className="sch-classes-section-card" data-testid={`school-card-section-${section.id}`}>
          <div className="sch-classes-section-header">
            <h4 className="sch-classes-section-title">Section {section.sectionLabel}</h4>
            <span className={`sch-classes-badge sch-classes-badge--${section.status}`}>{section.status}</span>
          </div>

          <div className="sch-classes-section-stats">
            <div className="sch-classes-stat-item">
              <span className="sch-classes-stat-label">Students:</span>
              <span className="sch-classes-stat-value">{section.studentCount}</span>
            </div>
            <div className="sch-classes-stat-item">
              <span className="sch-classes-stat-label">Occupancy:</span>
              <span className="sch-classes-stat-value">{section.occupancy}%</span>
            </div>
            <div className="sch-classes-stat-item">
              <span className="sch-classes-stat-label">Attendance:</span>
              <span className="sch-classes-stat-value">{section.attendance}%</span>
            </div>
          </div>

          <div className="sch-classes-section-subjects">
            <label className="sch-classes-section-label">Assigned Subjects ({section.subjects.length})</label>
            <div className="sch-classes-subjects-list">
              {section.subjects.slice(0, 5).map((subj, idx) => (
                <span key={idx} className="sch-classes-subject-chip">{subj.name}</span>
              ))}
              {section.subjects.length > 5 && <span className="sch-classes-subject-chip">+{section.subjects.length - 5}</span>}
            </div>
          </div>

          <button className="sch-classes-section-btn" data-testid={`school-button-section-details-${section.id}`}>
            Manage Section →
          </button>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Classes - Main component
 */
export default function Classes() {
  const [view, setView] = React.useState('overview'); // 'overview' | 'detail'
  const [selectedClass, setSelectedClass] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [academicYear, setAcademicYear] = React.useState('2026-27');
  const [shift, setShift] = React.useState('');

  // Computed metrics
  const metrics = React.useMemo(() => computeClassMetrics(MOCK_CLASSES), []);

  // Filtered classes
  const filteredClasses = React.useMemo(() => {
    let filtered = MOCK_CLASSES;

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.sections.some((sec) => sec.name.toLowerCase().includes(s))
      );
    }

    if (shift) {
      filtered = filtered.filter((c) => c.shift === shift);
    }

    return filtered;
  }, [search, shift]);

  const handleViewClass = (classId) => {
    const classData = MOCK_CLASSES.find((c) => c.id === classId);
    setSelectedClass(classData);
    setView('detail');
  };

  const handleClearFilters = () => {
    setSearch('');
    setAcademicYear('2026-27');
    setShift('');
  };

  return (
    <div className="sch-classes-container" data-testid="school-page-classes">
      {/* Page Header */}
      <div className="sch-classes-header">
        <div>
          <h1 className="sch-classes-header-title">Classes & Sections</h1>
          <p className="sch-classes-header-subtitle">
            Manage class configurations, sections, and academic assignments
          </p>
        </div>
        <button className="sch-classes-btn sch-classes-btn--primary" data-testid="school-button-classes-add">
          + Add Class
        </button>
      </div>

      {/* Metrics */}
      <div className="sch-classes-section">
        <ClassesMetrics metrics={metrics} />
      </div>

      {/* Toolbar */}
      <div className="sch-classes-section">
        <ClassesToolbar
          search={search}
          onSearchChange={setSearch}
          academicYear={academicYear}
          onYearChange={setAcademicYear}
          shift={shift}
          onShiftChange={setShift}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Content Area */}
      <div className="sch-classes-section">
        {view === 'overview' ? (
          <div>
            {filteredClasses.length > 0 ? (
              <div className="sch-classes-grid">
                {filteredClasses.map((classData) => (
                  <ClassCard key={classData.id} classData={classData} onViewDetails={handleViewClass} />
                ))}
              </div>
            ) : (
              <div className="sch-classes-no-results" data-testid="school-container-classes-empty">
                <div className="sch-classes-no-results-icon">📚</div>
                <h3>No Classes Found</h3>
                <p>Adjust your filters or create a new class to get started.</p>
              </div>
            )}
          </div>
        ) : (
          <ClassDetailView classData={selectedClass} onBack={() => setView('overview')} />
        )}
      </div>
    </div>
  );
}
