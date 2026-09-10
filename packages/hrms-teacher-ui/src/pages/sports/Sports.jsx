import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Sports.scss';

// ============================================
// MOCK DATA - Classes
// ============================================
const classesData = [
  {
    className: 'Class 9',
    section: 'A',
    house: 'Blue House',
    houseColor: 'blue',
    students: 32,
    coachName: 'Coach Anderson',
    coachRole: 'Physical Education & Sports Teacher',
    periodSchedule: [
      { day: 'Monday', time: '2:00 PM - 3:00 PM' },
      { day: 'Wednesday', time: '2:00 PM - 3:00 PM' },
      { day: 'Friday', time: '2:00 PM - 3:00 PM' }
    ]
  },
  {
    className: 'Class 9',
    section: 'B',
    house: 'Red House',
    houseColor: 'red',
    students: 30,
    coachName: 'Coach Martinez',
    coachRole: 'Physical Training Instructor',
    periodSchedule: [
      { day: 'Tuesday', time: '3:00 PM - 4:00 PM' },
      { day: 'Thursday', time: '3:00 PM - 4:00 PM' },
      { day: 'Saturday', time: '9:00 AM - 10:00 AM' }
    ]
  },
  {
    className: 'Class 10',
    section: 'A',
    house: 'Green House',
    houseColor: 'emerald',
    students: 28,
    coachName: 'Coach Thompson',
    coachRole: 'Sports Coordinator',
    periodSchedule: [
      { day: 'Monday', time: '3:00 PM - 4:00 PM' },
      { day: 'Thursday', time: '2:00 PM - 3:00 PM' },
      { day: 'Friday', time: '3:00 PM - 4:00 PM' }
    ]
  }
];

// ============================================
// MOCK DATA - Students
// ============================================
const studentsData = {
  'Class 9A': [
    {
      id: 1,
      rollNo: '9A-01',
      name: 'Arjun Sharma',
      className: 'Class 9',
      section: 'A',
      sportsGroup: 'Group A - Athletics',
      interestedSports: ['Basketball', 'Cricket', 'Athletics'],
      primarySport: 'Basketball',
      skillAssessment: {
        technique: 88,
        teamwork: 92,
        endurance: 85,
        discipline: 90,
        leadership: 87
      },
      coachReview: {
        latestEvent: '24th Annual Sports Day - Basketball Tournament',
        eventDate: 'Sep 22, 2024',
        rating: 4.5,
        comment: 'Outstanding performance as team captain. Led the team to victory with exceptional scoring (28 points) and strategic plays. Shows great leadership qualities and sportsmanship.',
        reviewedBy: 'Coach Anderson'
      },
      performanceHistory: [
        { date: 'Sep 22, 2024', activity: 'Basketball Tournament', performance: 'Champion', notes: 'MVP of the tournament' },
        { date: 'Aug 15, 2024', activity: 'Inter-School Match', performance: 'Runner-up', notes: 'Excellent teamwork' }
      ],
      attendance: 95,
      phone: '+91 98765 43210',
      parentPhone: '+91 98765 00001',
      email: 'arjun@example.com',
      medicalNotes: 'None'
    },
    {
      id: 2,
      rollNo: '9A-02',
      name: 'Priya Patel',
      className: 'Class 9',
      section: 'A',
      sportsGroup: 'Group B - Ball Games',
      interestedSports: ['Volleyball', 'Badminton', 'Table Tennis'],
      primarySport: 'Volleyball',
      skillAssessment: {
        technique: 82,
        teamwork: 95,
        endurance: 78,
        discipline: 88,
        leadership: 85
      },
      coachReview: {
        latestEvent: 'Volleyball Championship 2024',
        eventDate: 'Oct 10, 2024',
        rating: 4.0,
        comment: 'Excellent setter with great court awareness. Strong communication skills and team coordination. Needs to work on endurance for longer matches.',
        reviewedBy: 'Coach Anderson'
      },
      performanceHistory: [
        { date: 'Oct 10, 2024', activity: 'Volleyball Championship', performance: '2nd Place', notes: 'Best setter award' },
        { date: 'Sep 05, 2024', activity: 'Practice Match', performance: 'Good', notes: 'Improved serving' }
      ],
      attendance: 92,
      phone: '+91 98765 43211',
      parentPhone: '+91 98765 00002',
      email: 'priya@example.com'
    },
    {
      id: 3,
      rollNo: '9A-03',
      name: 'Rahul Kumar',
      className: 'Class 9',
      section: 'A',
      sportsGroup: 'Group A - Athletics',
      interestedSports: ['Football', 'Cricket', 'Running'],
      primarySport: 'Football',
      skillAssessment: {
        technique: 75,
        teamwork: 88,
        endurance: 92,
        discipline: 82,
        leadership: 78
      },
      coachReview: {
        latestEvent: 'Football Practice Session',
        eventDate: 'Nov 15, 2024',
        rating: 3.5,
        comment: 'Good stamina and speed. Excellent endurance for a midfielder. Technique needs improvement in ball control and passing accuracy. Shows dedication in practice.',
        reviewedBy: 'Coach Anderson'
      },
      performanceHistory: [
        { date: 'Nov 15, 2024', activity: 'Football Practice', performance: 'Good', notes: 'Improved stamina' },
        { date: 'Oct 20, 2024', activity: 'Friendly Match', performance: 'Average', notes: 'Needs technical work' }
      ],
      attendance: 88,
      phone: '+91 98765 43212',
      parentPhone: '+91 98765 00003',
      email: 'rahul@example.com'
    },
    {
      id: 4,
      rollNo: '9A-04',
      name: 'Sneha Reddy',
      className: 'Class 9',
      section: 'A',
      sportsGroup: 'Group C - Individual Sports',
      interestedSports: ['Badminton', 'Tennis', 'Swimming'],
      primarySport: 'Badminton',
      skillAssessment: {
        technique: 90,
        teamwork: 85,
        endurance: 87,
        discipline: 93,
        leadership: 80
      },
      coachReview: {
        latestEvent: 'State Badminton Championship',
        eventDate: 'Oct 28, 2024',
        rating: 5.0,
        comment: 'Exceptional talent with perfect technique. Won state championship singles. Great focus and discipline. Recommended for district level competition.',
        reviewedBy: 'Coach Anderson'
      },
      performanceHistory: [
        { date: 'Oct 28, 2024', activity: 'State Championship', performance: 'Champion', notes: 'Perfect performance' },
        { date: 'Sep 12, 2024', activity: 'School Tournament', performance: 'Winner', notes: 'Undefeated' }
      ],
      attendance: 97,
      phone: '+91 98765 43213',
      parentPhone: '+91 98765 00004',
      email: 'sneha@example.com'
    },
    {
      id: 5,
      rollNo: '9A-05',
      name: 'Ankit Singh',
      className: 'Class 9',
      section: 'A',
      sportsGroup: 'Group A - Athletics',
      interestedSports: ['Cricket', 'Basketball'],
      primarySport: 'Cricket',
      skillAssessment: {
        technique: 70,
        teamwork: 75,
        endurance: 68,
        discipline: 72,
        leadership: 65
      },
      coachReview: {
        latestEvent: 'Cricket Practice Session',
        eventDate: 'Nov 20, 2024',
        rating: 3.0,
        comment: 'Shows potential but needs consistent practice. Batting technique needs work. Attendance has been irregular. Encourage more participation.',
        reviewedBy: 'Coach Anderson'
      },
      performanceHistory: [
        { date: 'Nov 20, 2024', activity: 'Cricket Practice', performance: 'Average', notes: 'Needs more practice' }
      ],
      attendance: 72,
      phone: '+91 98765 43214',
      parentPhone: '+91 98765 00005',
      email: 'ankit@example.com',
      medicalNotes: 'Mild asthma - carry inhaler'
    }
  ],
  'Class 9B': [
    {
      id: 11,
      rollNo: '9B-01',
      name: 'Vikram Joshi',
      className: 'Class 9',
      section: 'B',
      sportsGroup: 'Group A - Athletics',
      interestedSports: ['Football', 'Running', 'Long Jump'],
      primarySport: 'Football',
      skillAssessment: {
        technique: 85,
        teamwork: 90,
        endurance: 88,
        discipline: 86,
        leadership: 92
      },
      coachReview: {
        latestEvent: 'Inter-House Football Championship',
        eventDate: 'Nov 05, 2024',
        rating: 4.5,
        comment: 'Natural leader and team captain. Excellent tactical understanding. Led Red House to championship victory. Great sportsmanship and motivates teammates effectively.',
        reviewedBy: 'Coach Martinez'
      },
      performanceHistory: [
        { date: 'Nov 05, 2024', activity: 'Football Championship', performance: 'Champion', notes: 'Team Captain' },
        { date: 'Oct 15, 2024', activity: 'Practice Match', performance: 'Excellent', notes: 'Hat-trick scorer' }
      ],
      attendance: 94,
      phone: '+91 98765 43220',
      parentPhone: '+91 98765 00011',
      email: 'vikram@example.com'
    }
  ],
  'Class 10A': [
    {
      id: 21,
      rollNo: '10A-01',
      name: 'Kavya Nair',
      className: 'Class 10',
      section: 'A',
      sportsGroup: 'Group B - Ball Games',
      interestedSports: ['Basketball', 'Volleyball', 'Handball'],
      primarySport: 'Basketball',
      skillAssessment: {
        technique: 92,
        teamwork: 88,
        endurance: 85,
        discipline: 90,
        leadership: 87
      },
      coachReview: {
        latestEvent: 'Regional Basketball Tournament',
        eventDate: 'Oct 30, 2024',
        rating: 4.8,
        comment: 'Outstanding shooter with 78% accuracy. Excellent defensive skills. Represented school at regional level. Recommended for state team trials.',
        reviewedBy: 'Coach Thompson'
      },
      performanceHistory: [
        { date: 'Oct 30, 2024', activity: 'Regional Tournament', performance: 'Quarter-Finalist', notes: 'Top scorer' },
        { date: 'Sep 18, 2024', activity: 'School Championship', performance: 'Winner', notes: 'MVP' }
      ],
      attendance: 96,
      phone: '+91 98765 43230',
      parentPhone: '+91 98765 00021',
      email: 'kavya@example.com'
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getHouseColorClass = (color) => {
  const colorMap = {
    blue: 'spt-sports__badge--blue',
    red: 'spt-sports__badge--red',
    emerald: 'spt-sports__badge--emerald',
    yellow: 'spt-sports__badge--yellow'
  };
  return colorMap[color] || colorMap.blue;
};

const getPerformanceColor = (value) => {
  if (value >= 85) return 'spt-sports__score--excellent';
  if (value >= 70) return 'spt-sports__score--good';
  if (value >= 60) return 'spt-sports__score--average';
  return 'spt-sports__score--poor';
};

const getPerformanceBadge = (value) => {
  if (value >= 85) return { text: 'Excellent', class: 'spt-sports__badge--excellent' };
  if (value >= 70) return { text: 'Good', class: 'spt-sports__badge--good' };
  if (value >= 60) return { text: 'Average', class: 'spt-sports__badge--average' };
  return { text: 'Needs Improvement', class: 'spt-sports__badge--poor' };
};

const renderStarRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= rating;
    stars.push(
      <span key={i} className={`spt-sports__star ${isFilled ? 'spt-sports__star--filled' : ''}`}>★</span>
    );
  }
  return stars;
};

const Sports = () => {
  // State management
  const [selectedClass, setSelectedClass] = useState('Class 9A');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [reviewStudent, setReviewStudent] = useState(null);
  const [assessmentStudent, setAssessmentStudent] = useState(null);

  // Form states
  const [reviewForm, setReviewForm] = useState({
    event: '',
    rating: 0,
    comment: ''
  });

  const [assessmentForm, setAssessmentForm] = useState({
    technique: 0,
    teamwork: 0,
    endurance: 0,
    discipline: 0,
    leadership: 0
  });

  // Get current class data
  const currentClassData = classesData.find(c => `${c.className}${c.section}` === selectedClass.replace(' ', '')) || classesData[0];
  const currentStudents = studentsData[selectedClass] || [];
  const filteredStudents = currentStudents.filter(student =>
    searchQuery === '' ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleOpenReview = (student) => {
    setReviewStudent(student);
    setReviewForm({
      event: student.coachReview.latestEvent,
      rating: student.coachReview.rating,
      comment: student.coachReview.comment
    });
    setShowReviewDialog(true);
  };

  const handleSaveReview = () => {
    setShowReviewDialog(false);
    setReviewStudent(null);
  };

  const handleOpenAssessment = (student) => {
    setAssessmentStudent(student);
    setAssessmentForm(student.skillAssessment);
    setShowAssessmentDialog(true);
  };

  const handleSaveAssessment = () => {
    setShowAssessmentDialog(false);
    setAssessmentStudent(null);
  };

  // Handle form input changes
  const handleReviewChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssessmentChange = (field, value) => {
    setAssessmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Sports data exported successfully!');
  };

  return (
    <div className="spt-sports" data-testid="teacher-page-sports">
      {/* Header */}
      <div className="spt-sports__header">
        <div className="spt-sports__header-content">
          <h1 className="spt-sports__title">Sports Management</h1>
          <p className="spt-sports__subtitle">Student-wise sports tracking & performance</p>
        </div>
        <button
          onClick={handleExport}
          className="spt-sports__btn-export"
          data-testid="school-button-export-sports"
        >
          📥 Export
        </button>
      </div>

      {/* Class Selection & Search */}
      <div className="spt-sports__filters">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="spt-sports__class-select"
          data-testid="school-dropdown-class-select"
        >
          {classesData.map((cls) => (
            <option key={`${cls.className}${cls.section}`} value={`${cls.className}${cls.section}`}>
              {cls.className} - Section {cls.section} ({cls.house})
            </option>
          ))}
        </select>

        <div className="spt-sports__search-box">
          <input
            type="text"
            placeholder="Search students by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="spt-sports__search-input"
            data-testid="school-field-search-students"
          />
        </div>
      </div>

      {/* Class Info */}
      <div className="spt-sports__class-info">
        <div className="spt-sports__info-item">
          <span className="spt-sports__info-label">Coach</span>
          <p className="spt-sports__info-value">{currentClassData.coachName}</p>
        </div>
        <div className="spt-sports__info-item">
          <span className="spt-sports__info-label">Role</span>
          <p className="spt-sports__info-value">{currentClassData.coachRole}</p>
        </div>
        <div className="spt-sports__info-item">
          <span className="spt-sports__info-label">House</span>
          <span className={`spt-sports__badge ${getHouseColorClass(currentClassData.houseColor)}`}>
            {currentClassData.house}
          </span>
        </div>
        <div className="spt-sports__info-item">
          <span className="spt-sports__info-label">Total Students</span>
          <p className="spt-sports__info-value">{currentStudents.length} Students</p>
        </div>
      </div>

      {/* Students Table */}
      <div className="spt-sports__table-container">
        <h2 className="spt-sports__section-title">Student Sports Details</h2>
        <table className="spt-sports__table">
          <thead>
            <tr className="spt-sports__table-header">
              <th>Student Info</th>
              <th>Sports Group</th>
              <th>Primary Sport</th>
              <th>Overall Score</th>
              <th>Latest Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const avgScore = Math.round(
                (student.skillAssessment.technique +
                  student.skillAssessment.teamwork +
                  student.skillAssessment.endurance +
                  student.skillAssessment.discipline +
                  student.skillAssessment.leadership) / 5
              );
              const performanceBadge = getPerformanceBadge(avgScore);

              return (
                <tr key={student.id} className="spt-sports__table-row">
                  <td>
                    <div className="spt-sports__student-info">
                      <div className="spt-sports__avatar">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="spt-sports__student-name">{student.name}</p>
                        <p className="spt-sports__student-meta">{student.rollNo} • {student.section}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="spt-sports__sports-group">{student.sportsGroup}</div>
                  </td>
                  <td>
                    <span className="spt-sports__badge spt-sports__badge--outline">
                      {student.primarySport}
                    </span>
                  </td>
                  <td>
                    <div className="spt-sports__score-display">
                      <span className={`spt-sports__score-value ${getPerformanceColor(avgScore)}`}>
                        {avgScore}%
                      </span>
                      {/* <span className={`spt-sports__badge ${performanceBadge.class}`}>
                        {performanceBadge.text}
                      </span> */}
                    </div>
                  </td>
                  <td>
                    <div className="spt-sports__rating">
                      <div className="spt-sports__stars">
                        {renderStarRating(student.coachReview.rating)}
                        <span className="spt-sports__rating-text">{student.coachReview.rating}</span>
                      </div>

                      <p className="spt-sports__rating-date">{student.coachReview.eventDate}</p>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="spt-sports__btn-view-details"
                      data-testid="school-button-view-details"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="spt-sports__modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="spt-sports__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="spt-sports__modal-header">
              <h2 className="spt-sports__modal-title">
                {selectedStudent.name} - Sports Profile
              </h2>
              <button
                className="spt-sports__btn-close"
                onClick={() => setSelectedStudent(null)}
                data-testid="school-button-close-modal"
              >
                ×
              </button>
            </div>

            <div className="spt-sports__modal-body">
              {/* Student Basic Info */}
              <section className="spt-sports__modal-section">
                <h3 className="spt-sports__section-subtitle">Student Information</h3>
                <div className="spt-sports__info-grid">
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Roll Number</span>
                    <p className="spt-sports__info-value">{selectedStudent.rollNo}</p>
                  </div>
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Class & Section</span>
                    <p className="spt-sports__info-value">{selectedStudent.className} - {selectedStudent.section}</p>
                  </div>
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Sports Group</span>
                    <p className="spt-sports__info-value">{selectedStudent.sportsGroup}</p>
                  </div>
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Primary Sport</span>
                    <span className="spt-sports__badge spt-sports__badge--primary">{selectedStudent.primarySport}</span>
                  </div>
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Attendance</span>
                    <p className="spt-sports__info-value">{selectedStudent.attendance}%</p>
                  </div>
                  <div className="spt-sports__info-item">
                    <span className="spt-sports__info-label">Contact</span>
                    <p className="spt-sports__info-value spt-sports__info-value--small">{selectedStudent.phone}</p>
                  </div>
                </div>

                <div className="spt-sports__interested-sports">
                  <span className="spt-sports__info-label">Interested Sports</span>
                  <div className="spt-sports__sports-list">
                    {selectedStudent.interestedSports.map((sport, idx) => (
                      <span key={idx} className="spt-sports__badge spt-sports__badge--secondary">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedStudent.medicalNotes && (
                  <div className="spt-sports__medical-notes">
                    <p className="spt-sports__medical-label">Medical Notes</p>
                    <p className="spt-sports__medical-text">{selectedStudent.medicalNotes}</p>
                  </div>
                )}
              </section>

              {/* Skills Assessment */}
              <section className="spt-sports__modal-section">
                <div className="spt-sports__section-header-inline">
                  <h3 className="spt-sports__section-subtitle">Sports Skills Assessment</h3>
                  <button
                    onClick={() => handleOpenAssessment(selectedStudent)}
                    className="spt-sports__btn-update"
                    data-testid="school-button-update-assessment"
                  >
                    ✏️ Update
                  </button>
                </div>
                <div className="spt-sports__skills-grid">
                  {Object.entries(selectedStudent.skillAssessment).map(([skill, value]) => (
                    <div key={skill} className="spt-sports__skill-item">
                      <div className="spt-sports__skill-header">
                        <span className="spt-sports__skill-name">{skill}</span>
                        <span className={`spt-sports__skill-value ${getPerformanceColor(value)}`}>
                          {value}%
                        </span>
                      </div>
                      <div className="spt-sports__skill-bar">
                        <div
                          className="spt-sports__skill-bar-fill"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Coach Review */}
              <section className="spt-sports__modal-section">
                <div className="spt-sports__section-header-inline">
                  <h3 className="spt-sports__section-subtitle">Latest Coach Review</h3>
                  <button
                    onClick={() => handleOpenReview(selectedStudent)}
                    className="spt-sports__btn-update"
                    data-testid="school-button-update-review"
                  >
                    ✏️ Update
                  </button>
                </div>
                <div className="spt-sports__review-content">
                  <div className="spt-sports__review-item">
                    <p className="spt-sports__info-label">Event</p>
                    <p className="spt-sports__info-value">{selectedStudent.coachReview.latestEvent}</p>
                  </div>
                  <div className="spt-sports__review-meta">
                    <div>
                      <p className="spt-sports__info-label">Date</p>
                      <p className="spt-sports__info-value">{selectedStudent.coachReview.eventDate}</p>
                    </div>
                    <div className="spt-sports__rating">
                      <div className="spt-sports__stars">
                        {renderStarRating(selectedStudent.coachReview.rating)}
                      </div>
                      <span className="spt-sports__rating-value">{selectedStudent.coachReview.rating}</span>
                    </div>
                  </div>
                  <div className="spt-sports__review-comment">
                    <p className="spt-sports__comment-label">Coach's Comment</p>
                    <p className="spt-sports__comment-text">"{selectedStudent.coachReview.comment}"</p>
                    <p className="spt-sports__comment-reviewer">- {selectedStudent.coachReview.reviewedBy}</p>
                  </div>
                </div>
              </section>

              {/* Performance History */}
              <section className="spt-sports__modal-section">
                <h3 className="spt-sports__section-subtitle">Performance History</h3>
                <div className="spt-sports__history-list">
                  {selectedStudent.performanceHistory.map((record, idx) => (
                    <div key={idx} className="spt-sports__history-item">
                      <div className="spt-sports__history-header">
                        <p className="spt-sports__history-activity">{record.activity}</p>
                        <span className="spt-sports__badge spt-sports__badge--secondary">
                          {record.performance}
                        </span>
                      </div>
                      <p className="spt-sports__history-date">{record.date}</p>
                      <p className="spt-sports__history-notes">{record.notes}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="spt-sports__modal-footer">
              <button
                onClick={() => setSelectedStudent(null)}
                className="spt-sports__btn-close-modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Review Dialog */}
      {showReviewDialog && reviewStudent && (
        <div className="spt-sports__dialog-overlay" onClick={() => setShowReviewDialog(false)}>
          <div className="spt-sports__dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="spt-sports__dialog-header">
              <h3 className="spt-sports__dialog-title">Update Coach Review</h3>
              <button
                className="spt-sports__btn-close"
                onClick={() => setShowReviewDialog(false)}
              >
                ×
              </button>
            </div>

            <div className="spt-sports__dialog-body">
              <div className="spt-sports__form-group">
                <label className="spt-sports__label">Event/Activity</label>
                <input
                  type="text"
                  value={reviewForm.event}
                  onChange={(e) => handleReviewChange('event', e.target.value)}
                  placeholder="e.g., Basketball Tournament 2024"
                  className="spt-sports__input"
                  data-testid="school-field-review-event"
                />
              </div>

              <div className="spt-sports__form-group">
                <label className="spt-sports__label">Rating</label>
                <div className="spt-sports__rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleReviewChange('rating', star)}
                      className={`spt-sports__star-btn ${star <= reviewForm.rating ? 'spt-sports__star-btn--active' : ''}`}
                      data-testid={`school-button-rating-${star}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="spt-sports__rating-display">{reviewForm.rating}/5</span>
                </div>
              </div>

              <div className="spt-sports__form-group">
                <label className="spt-sports__label">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => handleReviewChange('comment', e.target.value)}
                  placeholder="Provide detailed feedback on performance..."
                  className="spt-sports__textarea"
                  rows="4"
                  data-testid="school-field-review-comment"
                ></textarea>
              </div>
            </div>

            <div className="spt-sports__dialog-footer">
              <button
                onClick={() => setShowReviewDialog(false)}
                className="spt-sports__btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReview}
                className="spt-sports__btn-save"
                data-testid="school-button-save-review"
              >
                💾 Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Assessment Dialog */}
      {showAssessmentDialog && assessmentStudent && (
        <div className="spt-sports__dialog-overlay" onClick={() => setShowAssessmentDialog(false)}>
          <div className="spt-sports__dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="spt-sports__dialog-header">
              <h3 className="spt-sports__dialog-title">Update Skills Assessment</h3>
              <button
                className="spt-sports__btn-close"
                onClick={() => setShowAssessmentDialog(false)}
              >
                ×
              </button>
            </div>

            <div className="spt-sports__dialog-body">
              {Object.entries(assessmentForm).map(([skill, value]) => (
                <div key={skill} className="spt-sports__form-group">
                  <div className="spt-sports__form-header">
                    <label className="spt-sports__label">{skill}</label>
                    <span className={`spt-sports__value-display ${getPerformanceColor(value)}`}>
                      {value}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleAssessmentChange(skill, parseInt(e.target.value))}
                    className="spt-sports__range-slider"
                    data-testid={`school-slider-${skill}`}
                  />
                </div>
              ))}
            </div>

            <div className="spt-sports__dialog-footer">
              <button
                onClick={() => setShowAssessmentDialog(false)}
                className="spt-sports__btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssessment}
                className="spt-sports__btn-save"
                data-testid="school-button-save-assessment"
              >
                💾 Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
};

export default Sports;
