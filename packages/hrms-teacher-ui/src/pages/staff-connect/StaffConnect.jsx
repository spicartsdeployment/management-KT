import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/StaffConnect.scss';

const StaffConnect = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'request-new' | 'my-requests'

  // Modal states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showHRModal, setShowHRModal] = useState(false);
  const [showCircularsModal, setShowCircularsModal] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedAssignedRequest, setSelectedAssignedRequest] = useState(null);
  const [showAcceptConfirmModal, setShowAcceptConfirmModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);

  // Request New form state
  const [requestForm, setRequestForm] = useState({
    date: '',
    period: '',
    subject: 'Chemistry',
    topic: '',
    replacementTeacher: null,
    additionalNotes: ''
  });

  // Search state for replacement teachers
  const [teacherSearch, setTeacherSearch] = useState('');

  // Meeting modal form
  const [meetingForm, setMeetingForm] = useState({
    name: 'John Doe',
    date: '',
    time: '',
    reason: '',
    notes: '',
    urgent: false
  });

  // Suggestion modal form
  const [suggestionForm, setSuggestionForm] = useState({
    name: 'John Doe',
    title: '',
    category: '',
    details: ''
  });

  // HR Contact modal form
  const [hrForm, setHRForm] = useState({
    name: 'John Doe',
    subject: '',
    category: '',
    message: '',
    attachment: null
  });

  // Mock data for assigned requests
  const [assignedRequests, setAssignedRequests] = useState([
    {
      id: 1,
      subject: 'Physics',
      topic: "Newton's Laws of Motion - Practical Applications",
      date: 'Nov 27, 2025',
      dayname: 'Thursday',
      dayName: 'Thursday',
      period: 'Period 4',
      class: 'Class 11A',
      room: 'Lab A-1',
      requestedBy: 'Mrs. Priya Sharma',
      requestedByAvatar: 'PS',
      requestedByColor: '#10b981',
      expertise: 'Physics, Mechanics, Optics',
      status: 'pending'
    },
    {
      id: 2,
      subject: 'Chemistry',
      topic: 'Chemical Bonding - Ionic and Covalent Bonds',
      date: 'Dec 1, 2025',
      dayname: 'Monday',
      dayName: 'Monday',
      period: 'Period 6',
      class: 'Class 10B',
      room: 'Lab B-2',
      requestedBy: 'Mr. Anil Verma',
      requestedByAvatar: 'AV',
      requestedByColor: '#f59e0b',
      expertise: 'Chemistry, Organic Chemistry',
      status: 'pending'
    }
  ]);

  // Mock data for my requests
  const [myRequests, setMyRequests] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Quadratic Equations - Solving by Factorization',
      date: 'Nov 28, 2025',
      dayname: 'Thursday',
      period: 'Period 3',
      replacementTeacher: 'Dr. Rajesh Kumar',

      status: 'pending'
    },
    {
      id: 2,
      subject: 'Advanced Algebra',
      topic: 'Polynomial Functions and Graphs',
      date: 'Nov 30, 2025',
      dayname: 'Saturday',
      period: 'Period 5',
      replacementTeacher: 'Ms. Sneha Patel',

      status: 'accepted'
    },
    {
      id: 3,
      subject: 'Trigonometry',
      topic: 'Inverse Trigonometric Functions',
      date: 'Nov 25, 2025',
      dayname: 'Monday',
      period: 'Period 2',
      replacementTeacher: 'Dr. Rajesh Kumar',

      status: 'rejected'
    }
  ]);

  // Mock data for management contacts
  const [managementContacts] = useState([
    {
      id: 1,
      name: 'Dr. Anjali Mehta',
      role: 'Principal',
      avatar: 'AM',
      color: '#4f46e5',
      online: true
    },
    {
      id: 2,
      name: 'Mr. Vikram Singh',
      role: 'Vice Principal',
      avatar: 'VS',
      color: '#f59e0b',
      online: false
    },
    {
      id: 3,
      name: 'Ms. Priya Sharma',
      role: 'HR Manager',
      avatar: 'PS',
      color: '#10b981',
      online: true
    },
    {
      id: 4,
      name: 'Mr. Rajesh Kumar',
      role: 'Academic Director',
      avatar: 'RK',
      color: '#8b5cf6',
      online: false
    }
  ]);

  // Selected contact state for chat
  const [selectedContact, setSelectedContact] = useState(managementContacts[0]);

  // Chat message input state
  const [chatMessage, setChatMessage] = useState('');

  // Mock data for recent circulars
  const [recentCirculars] = useState([
    {
      id: 1,
      type: 'Notice',
      priority: 'high',
      title: 'Updated Leave Policy 2025',
      description: 'Important changes to the leave application and approval process for all teaching staff.',
      date: 'Nov 5, 2025',
      department: 'HR Department'
    },
    {
      id: 2,
      type: 'Meeting',
      priority: 'medium',
      title: 'Annual Day Preparation Timeline',
      description: 'Coordination meeting scheduled for Annual Day event preparation and responsibility allocation.',
      date: 'Nov 4, 2025',
      department: "Principal's Office",
      attachment: 'Annual_Day_Timeline.pdf',
      issuedBy: 'Dr. Anjali Mehta - Principal',
      fullDescription: 'The Annual Day celebration is scheduled for December 20, 2025. A preparatory meeting will be held on November 10, 2025, at 3:00 PM in the main auditorium. All faculty members are requested to attend. Agenda includes: event schedule finalization, student performance coordination, venue decoration planning, and parent invitation management. Department heads should prepare progress reports on student rehearsals.'
    },
    {
      id: 3,
      type: 'Update',
      priority: 'high',
      title: 'New Attendance Software Training',
      description: 'Mandatory training session for the new biometric attendance and student tracking system.',
      date: 'Nov 2, 2025',
      department: 'IT Department'
    }
  ]);

  // Replacement teachers list
  const [replacementTeachers] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      avatar: 'RK',
      color: '#4f46e5',
      subject: 'Mathematics',

    },
    {
      id: 2,
      name: 'Mrs. Priya Sharma',
      avatar: 'PS',
      color: '#10b981',
      subject: 'Physics',

    },
    {
      id: 3,
      name: 'Mr. Anil Verma',
      avatar: 'AV',
      color: '#f59e0b',
      subject: 'Chemistry',

    }
  ]);

  // Handle ESC key for closing modals
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowRequestDetailsModal(false);
        setShowAcceptConfirmModal(false);
        setShowRejectConfirmModal(false);
        setShowMeetingModal(false);
        setShowSuggestionModal(false);
        setShowHRModal(false);
        setShowCircularsModal(false);
        setShowCancelConfirmModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const periods = [
    { value: 'Period 1', label: 'Period 1 (8:00 - 8:45)' },
    { value: 'Period 2', label: 'Period 2 (8:50 - 9:35)' },
    { value: 'Period 3', label: 'Period 3 (9:40 - 10:25)' },
    { value: 'Period 4', label: 'Period 4 (11:20 - 12:05)' },
    { value: 'Period 5', label: 'Period 5 (12:10 - 12:55)' },
    { value: 'Period 6', label: 'Period 6 (13:50 - 14:35)' },
    { value: 'Period 7', label: 'Period 7 (14:40 - 15:25)' },
    { value: 'Period 8', label: 'Period 8 (15:30 - 16:15)' }
  ];

  const handleSubmitReplacement = () => {
    if (!requestForm.date || !requestForm.period || !requestForm.subject || !requestForm.topic || !requestForm.replacementTeacher) {
      alert('Please fill in all required fields');
      return;
    }

    // Format the date
    const dateObj = new Date(requestForm.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    // Create new request object
    const newRequest = {
      id: myRequests.length > 0 ? Math.max(...myRequests.map(r => r.id)) + 1 : 1,
      subject: requestForm.subject,
      topic: requestForm.topic,
      date: formattedDate,
      dayname: dayName,
      period: requestForm.period,
      replacementTeacher: requestForm.replacementTeacher.name,
      expertise: requestForm.replacementTeacher.expertise,
      status: 'pending'
    };

    // Add to myRequests
    setMyRequests([newRequest, ...myRequests]);

    // Reset form and search
    setRequestForm({
      date: '',
      period: '',
      subject: 'Chemistry',
      topic: '',
      replacementTeacher: null,
      additionalNotes: ''
    });
    setTeacherSearch('');
    setActiveTab('my-requests');
  };

  const handleCancelRequest = (requestId) => {
    setRequestToCancel(requestId);
    setShowCancelConfirmModal(true);
  };

  const confirmCancelRequest = () => {
    setMyRequests(myRequests.map(req =>
      req.id === requestToCancel ? { ...req, status: 'cancelled' } : req
    ));
    setShowCancelConfirmModal(false);
    setRequestToCancel(null);
  };

  // Handler for viewing assigned request details
  const handleViewAssignedRequest = (request) => {
    setSelectedAssignedRequest(request);
    setShowRequestDetailsModal(true);
  };

  // Handler for accepting request
  const handleAcceptRequest = () => {
    setShowAcceptConfirmModal(true);
  };

  // Handler for rejecting request
  const handleRejectRequest = () => {
    setShowRejectConfirmModal(true);
  };

  // Confirm accept request
  const confirmAcceptRequest = () => {
    setAssignedRequests(assignedRequests.map(req =>
      req.id === selectedAssignedRequest.id ? { ...req, status: 'accepted' } : req
    ));
    setShowAcceptConfirmModal(false);
    setShowRequestDetailsModal(false);
    setSelectedAssignedRequest(null);
    // Show success toast - for now just log
    console.log('Request accepted successfully');
  };

  // Confirm reject request
  const confirmRejectRequest = () => {
    setAssignedRequests(assignedRequests.map(req =>
      req.id === selectedAssignedRequest.id ? { ...req, status: 'rejected' } : req
    ));
    setShowRejectConfirmModal(false);
    setShowRequestDetailsModal(false);
    setSelectedAssignedRequest(null);
    // Show success toast - for now just log
    console.log('Request rejected successfully');
  };

  const handleSubmitMeeting = () => {
    if (!meetingForm.date || !meetingForm.time || !meetingForm.reason) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Submit meeting request:', meetingForm);
    setMeetingForm({
      name: 'John Doe',
      date: '',
      time: '',
      reason: '',
      notes: '',
      urgent: false
    });
    setShowMeetingModal(false);
  };

  const handleSubmitSuggestion = () => {
    if (!suggestionForm.title || !suggestionForm.category || !suggestionForm.details) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Submit suggestion:', suggestionForm);
    setSuggestionForm({
      name: 'John Doe',
      title: '',
      category: '',
      details: ''
    });
    setShowSuggestionModal(false);
  };

  const handleSubmitHR = () => {
    if (!hrForm.subject || !hrForm.category || !hrForm.message) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Submit HR request:', hrForm);
    setHRForm({
      name: 'John Doe',
      subject: '',
      category: '',
      message: '',
      attachment: null
    });
    setShowHRModal(false);
  };

  const handleViewCircular = (circular) => {
    setSelectedCircular(circular);
    setShowCircularsModal(true);
  };

  return (
    <div className="sc-hsu-teach-staffconnect" data-testid="teacher-page-staff-connect">
      {/* Header */}
      <div className="sc-hsu-teach-staffconnect__header">
        <h1 className="sc-hsu-teach-staffconnect__title" data-testid="teacher-heading-staff-connect">
          Staff Connect
        </h1>
        <p className="sc-hsu-teach-staffconnect__subtitle">Communicate directly with management</p>
      </div>

      {/* Action Cards Row */}
      <div className="sc-hsu-teach-staffconnect__action-cards">
        <div
          className="sc-hsu-teach-staffconnect__action-card sc-hsu-teach-staffconnect__action-card--blue"
          onClick={() => setShowMeetingModal(true)}
          data-testid="teacher-card-request-meeting"
        >
          <div className="sc-hsu-teach-staffconnect__action-icon sc-hsu-teach-staffconnect__action-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="sc-hsu-teach-staffconnect__action-title">Request Meeting with Principal</span>
        </div>

        <div
          className="sc-hsu-teach-staffconnect__action-card sc-hsu-teach-staffconnect__action-card--cyan"
          onClick={() => setShowSuggestionModal(true)}
          data-testid="teacher-card-submit-suggestion"
        >
          <div className="sc-hsu-teach-staffconnect__action-icon sc-hsu-teach-staffconnect__action-icon--cyan">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="sc-hsu-teach-staffconnect__action-title">Submit Suggestion</span>
        </div>

        <div
          className="sc-hsu-teach-staffconnect__action-card sc-hsu-teach-staffconnect__action-card--purple"
          onClick={() => setShowHRModal(true)}
          data-testid="teacher-card-contact-hr"
        >
          <div className="sc-hsu-teach-staffconnect__action-icon sc-hsu-teach-staffconnect__action-icon--purple">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="sc-hsu-teach-staffconnect__action-title">Contact HR</span>
        </div>

        <div
          className="sc-hsu-teach-staffconnect__action-card sc-hsu-teach-staffconnect__action-card--green"
          onClick={() => setShowCircularsModal(true)}
          data-testid="teacher-card-view-circulars"
        >
          <div className="sc-hsu-teach-staffconnect__action-icon sc-hsu-teach-staffconnect__action-icon--green">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="sc-hsu-teach-staffconnect__action-title">View Circulars</span>
        </div>
      </div>

      {/* Teacher Replacement Requests Section */}
      <div className="sc-hsu-teach-staffconnect__replacement-section">
        <div className="sc-hsu-teach-staffconnect__section-header">
          <div className="sc-hsu-teach-staffconnect__section-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="sc-hsu-teach-staffconnect__section-title">Teacher Replacement Requests</h2>
            <p className="sc-hsu-teach-staffconnect__section-subtitle">Request or manage class replacements when you're unavailable</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="sc-hsu-teach-staffconnect__tabs">
          <button
            className={`sc-hsu-teach-staffconnect__tab ${activeTab === 'overview' ? 'sc-hsu-teach-staffconnect__tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
            data-testid="teacher-tab-overview"
          >
            Overview
          </button>
          <button
            className={`sc-hsu-teach-staffconnect__tab ${activeTab === 'request-new' ? 'sc-hsu-teach-staffconnect__tab--active' : ''}`}
            onClick={() => setActiveTab('request-new')}
            data-testid="teacher-tab-request-new"
          >
            Request New
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className={`sc-hsu-teach-staffconnect__tab ${activeTab === 'my-requests' ? 'sc-hsu-teach-staffconnect__tab--active' : ''}`}
            onClick={() => setActiveTab('my-requests')}
            data-testid="teacher-tab-my-requests"
          >
            My Requests
            <span className="sc-hsu-teach-staffconnect__tab-badge">3</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="sc-hsu-teach-staffconnect__tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="sc-hsu-teach-staffconnect__overview" data-testid="teacher-view-overview">
              {/* Stats Cards */}
              <div className="sc-hsu-teach-staffconnect__stats">
                <div className="sc-hsu-teach-staffconnect__stat-card sc-hsu-teach-staffconnect__stat-card--blue">
                  <div className="sc-hsu-teach-staffconnect__stat-content">
                    <p className="sc-hsu-teach-staffconnect__stat-label">Sent Requests</p>
                    <h3 className="sc-hsu-teach-staffconnect__stat-number">3</h3>
                  </div>
                  <div className="sc-hsu-teach-staffconnect__stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="sc-hsu-teach-staffconnect__stat-card sc-hsu-teach-staffconnect__stat-card--yellow">
                  <div className="sc-hsu-teach-staffconnect__stat-content">
                    <p className="sc-hsu-teach-staffconnect__stat-label">Assigned to Me</p>
                    <h3 className="sc-hsu-teach-staffconnect__stat-number">2</h3>
                  </div>
                  <div className="sc-hsu-teach-staffconnect__stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="sc-hsu-teach-staffconnect__stat-card sc-hsu-teach-staffconnect__stat-card--green">
                  <div className="sc-hsu-teach-staffconnect__stat-content">
                    <p className="sc-hsu-teach-staffconnect__stat-label">Completed</p>
                    <h3 className="sc-hsu-teach-staffconnect__stat-number">12</h3>
                  </div>
                  <div className="sc-hsu-teach-staffconnect__stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Requests Assigned to Me + Recent Circulars (side by side) */}
              <div className="sc-hsu-teach-staffconnect__overview-bottom-row">
                {/* Requests Assigned to Me */}
                <div className="sc-hsu-teach-staffconnect__assigned-section">
                  <div className="sc-hsu-teach-staffconnect__assigned-header">
                    <h3 className="sc-hsu-teach-staffconnect__assigned-title">Requests Assigned to Me</h3>
                    <span className="sc-hsu-teach-staffconnect__assigned-badge">
                      {assignedRequests.filter(req => req.status === 'pending').length} Pending
                    </span>
                  </div>

                  <div className="sc-hsu-teach-staffconnect__assigned-list">
                    {assignedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="sc-hsu-teach-staffconnect__assigned-card"
                        onClick={() => handleViewAssignedRequest(request)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="sc-hsu-teach-staffconnect__assigned-icon">⚠️</div>
                        <div className="sc-hsu-teach-staffconnect__assigned-content">
                          <h4 className="sc-hsu-teach-staffconnect__assigned-subject">{request.subject}</h4>
                          <p className="sc-hsu-teach-staffconnect__assigned-topic">{request.topic}</p>
                          <div className="sc-hsu-teach-staffconnect__assigned-details">
                            <div className="sc-hsu-teach-staffconnect__assigned-detail">
                              <span className="sc-hsu-teach-staffconnect__assigned-label">Date</span>
                              <span className="sc-hsu-teach-staffconnect__assigned-value">{request.date}<br />{request.dayName}</span>
                            </div>
                            <div className="sc-hsu-teach-staffconnect__assigned-detail">
                              <span className="sc-hsu-teach-staffconnect__assigned-label">Period</span>
                              <span className="sc-hsu-teach-staffconnect__assigned-value">{request.period}</span>
                            </div>
                            <div className="sc-hsu-teach-staffconnect__assigned-detail">
                              <span className="sc-hsu-teach-staffconnect__assigned-label">Class</span>
                              <span className="sc-hsu-teach-staffconnect__assigned-value">{request.class}</span>
                            </div>
                            <div className="sc-hsu-teach-staffconnect__assigned-detail">
                              <span className="sc-hsu-teach-staffconnect__assigned-label">Requested By</span>
                              <span className="sc-hsu-teach-staffconnect__assigned-value">{request.requestedBy}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="sc-hsu-teach-staffconnect__assigned-arrow"
                          data-testid={`teacher-button-view-assigned-${request.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAssignedRequest(request);
                          }}
                        >
                          →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Circulars (moved here from bottom section) */}
                {/* <div className="sc-hsu-teach-staffconnect__recent-circulars sc-hsu-teach-staffconnect__recent-circulars--overview">
                  <div className="sc-hsu-teach-staffconnect__circulars-header">
                    <div className="sc-hsu-teach-staffconnect__circulars-icon">🔔</div>
                    <h3 className="sc-hsu-teach-staffconnect__circulars-title">Recent Circulars</h3>
                  </div>
                  <div className="sc-hsu-teach-staffconnect__circulars-list">
                    {recentCirculars.map((circular) => (
                      <div
                        key={circular.id}
                        className="sc-hsu-teach-staffconnect__circular-item"
                        onClick={() => handleViewCircular(circular)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="sc-hsu-teach-staffconnect__circular-main">
                          <div className="sc-hsu-teach-staffconnect__circular-left">
                            <h4 className="sc-hsu-teach-staffconnect__circular-title-text">{circular.title}</h4>
                            <span className="sc-hsu-teach-staffconnect__circular-department">{circular.department}</span>
                          </div>
                          <div className="sc-hsu-teach-staffconnect__circular-right">
                            <div className="sc-hsu-teach-staffconnect__circular-badges">
                              <span className={`sc-hsu-teach-staffconnect__circular-type sc-hsu-teach-staffconnect__circular-type--${circular.type.toLowerCase()}`}>
                                {circular.type}
                              </span>
                              <span className={`sc-hsu-teach-staffconnect__circular-priority sc-hsu-teach-staffconnect__circular-priority--${circular.priority}`}>
                                {circular.priority}
                              </span>
                            </div>
                            <span className="sc-hsu-teach-staffconnect__circular-date">{circular.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {/* Request New Tab */}
          {activeTab === 'request-new' && (
            <div className="sc-hsu-teach-staffconnect__request-new" data-testid="teacher-view-request-new">
              <div className="sc-hsu-teach-staffconnect__request-header">
                <div className="sc-hsu-teach-staffconnect__request-header-left">
                  <h3 className="sc-hsu-teach-staffconnect__request-title">Request Replacement</h3>
                  <p className="sc-hsu-teach-staffconnect__request-subtitle">Fill in the details to request another teacher to cover your class</p>
                </div>
                <div className="sc-hsu-teach-staffconnect__user-info">
                  <div className="sc-hsu-teach-staffconnect__user-avatar">JD</div>
                  <div className="sc-hsu-teach-staffconnect__user-details">
                    <span className="sc-hsu-teach-staffconnect__user-name">John Doe</span>
                    <span className="sc-hsu-teach-staffconnect__user-subject">Mathematics</span>
                  </div>
                </div>
              </div>

              <div className="sc-hsu-teach-staffconnect__request-form">
                <div className="sc-hsu-teach-staffconnect__form-row sc-hsu-teach-staffconnect__form-row--split">
                  <div className="sc-hsu-teach-staffconnect__form-left">
                    <div className="sc-hsu-teach-staffconnect__form-group">
                      <div className="sc-hsu-teach-staffconnect__calendar">
                        <div className="sc-hsu-teach-staffconnect__calendar-header">
                          <button className="sc-hsu-teach-staffconnect__calendar-nav" onClick={() => {
                            const current = new Date(requestForm.date || new Date());
                            current.setMonth(current.getMonth() - 1);
                            setRequestForm({ ...requestForm, date: current.toISOString().split('T')[0] });
                          }}>←</button>
                          <span className="sc-hsu-teach-staffconnect__calendar-title">
                            {new Date(requestForm.date || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button className="sc-hsu-teach-staffconnect__calendar-nav" onClick={() => {
                            const current = new Date(requestForm.date || new Date());
                            current.setMonth(current.getMonth() + 1);
                            setRequestForm({ ...requestForm, date: current.toISOString().split('T')[0] });
                          }}>→</button>
                        </div>
                        <div className="sc-hsu-teach-staffconnect__calendar-weekdays">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="sc-hsu-teach-staffconnect__calendar-weekday">{day}</div>
                          ))}
                        </div>
                        <div className="sc-hsu-teach-staffconnect__calendar-days">
                          {(() => {
                            const current = new Date(requestForm.date || new Date());
                            const year = current.getFullYear();
                            const month = current.getMonth();
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const selectedDate = requestForm.date ? new Date(requestForm.date) : null;

                            const days = [];
                            for (let i = 0; i < firstDay; i++) {
                              days.push(<div key={`empty-${i}`} className="sc-hsu-teach-staffconnect__calendar-day sc-hsu-teach-staffconnect__calendar-day--empty"></div>);
                            }
                            for (let day = 1; day <= daysInMonth; day++) {
                              const date = new Date(year, month, day);
                              const dateString = date.toISOString().split('T')[0];
                              const isToday = date.getTime() === today.getTime();
                              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                              const isPast = date < today;

                              days.push(
                                <button
                                  key={day}
                                  className={`sc-hsu-teach-staffconnect__calendar-day ${isToday ? 'sc-hsu-teach-staffconnect__calendar-day--today' : ''} ${isSelected ? 'sc-hsu-teach-staffconnect__calendar-day--selected' : ''} ${isPast ? 'sc-hsu-teach-staffconnect__calendar-day--disabled' : ''}`}
                                  onClick={() => !isPast && setRequestForm({ ...requestForm, date: dateString })}
                                  disabled={isPast}
                                  data-testid={`teacher-calendar-day-${day}`}
                                >
                                  {day}
                                </button>
                              );
                            }
                            return days;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sc-hsu-teach-staffconnect__form-right">
                    <div className="sc-hsu-teach-staffconnect__form-group">
                      <label className="sc-hsu-teach-staffconnect__form-label">Select Period *</label>
                      <select
                        className="sc-hsu-teach-staffconnect__form-select"
                        value={requestForm.period}
                        onChange={(e) => setRequestForm({ ...requestForm, period: e.target.value })}
                        data-testid="teacher-dropdown-period"
                      >
                        <option value="">Choose a period</option>
                        {periods.map((period) => (
                          <option key={period.value} value={period.value}>
                            {period.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sc-hsu-teach-staffconnect__form-group">
                      <label className="sc-hsu-teach-staffconnect__form-label">Subject *</label>
                      <select
                        className="sc-hsu-teach-staffconnect__form-select"
                        value={requestForm.subject}
                        onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                        data-testid="teacher-dropdown-subject"
                      >
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>

                    <div className="sc-hsu-teach-staffconnect__form-group">
                      <label className="sc-hsu-teach-staffconnect__form-label">Topic to be Taught *</label>
                      <input
                        type="text"
                        className="sc-hsu-teach-staffconnect__form-input"
                        placeholder="Enter the topic or lesson plan details..."
                        value={requestForm.topic}
                        onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })}
                        data-testid="teacher-field-topic"
                      />
                    </div>
                  </div>
                </div>

                <div className="sc-hsu-teach-staffconnect__form-group">
                  <label className="sc-hsu-teach-staffconnect__form-label">Search Replacement Teacher *</label>
                  <input
                    type="text"
                    className="sc-hsu-teach-staffconnect__form-input hsu-teach-staffconnect__form-search"
                    placeholder="Search by name, subject, or expertise..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    data-testid="teacher-field-search-replacement"
                  />
                  <div className="sc-hsu-teach-staffconnect__teacher-list">
                    {replacementTeachers.filter(teacher => {
                      const searchLower = teacherSearch.toLowerCase();
                      return teacher.name.toLowerCase().includes(searchLower) ||
                        teacher.subject.toLowerCase().includes(searchLower) ||
                        teacher.expertise.toLowerCase().includes(searchLower);
                    }).length === 0 ? (
                      <div className="sc-hsu-teach-staffconnect__no-results">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                        <p>No teachers found</p>
                        <span>Search for another teacher</span>
                      </div>
                    ) : (
                      replacementTeachers.filter(teacher => {
                        const searchLower = teacherSearch.toLowerCase();
                        return teacher.name.toLowerCase().includes(searchLower) ||
                          teacher.subject.toLowerCase().includes(searchLower) ||
                          teacher.expertise.toLowerCase().includes(searchLower);
                      }).map((teacher) => (
                        <div
                          key={teacher.id}
                          className={`sc-hsu-teach-staffconnect__teacher-item ${requestForm.replacementTeacher?.id === teacher.id ? 'sc-hsu-teach-staffconnect__teacher-item--selected' : ''}`}
                          onClick={() => setRequestForm({ ...requestForm, replacementTeacher: teacher })}
                          data-testid={`teacher-item-${teacher.id}`}
                        >
                          <div className="sc-hsu-teach-staffconnect__teacher-avatar">
                            {teacher.avatar}
                          </div>
                          <div className="sc-hsu-teach-staffconnect__teacher-info">
                            <span className="sc-hsu-teach-staffconnect__teacher-name">{teacher.name}</span>
                            <div className="sc-hsu-teach-staffconnect__teacher-tags">
                              <span className="sc-hsu-teach-staffconnect__teacher-tag">{teacher.subject}</span>
                              <span className="sc-hsu-teach-staffconnect__teacher-expertise">{teacher.expertise}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="sc-hsu-teach-staffconnect__form-group">
                  <label className="sc-hsu-teach-staffconnect__form-label">Additional Notes (Optional)</label>
                  <textarea
                    className="sc-hsu-teach-staffconnect__form-textarea"
                    placeholder="Any additional information or instructions..."
                    rows="3"
                    value={requestForm.additionalNotes}
                    onChange={(e) => setRequestForm({ ...requestForm, additionalNotes: e.target.value })}
                    data-testid="teacher-field-notes"
                  />
                </div>

                <button
                  className="sc-hsu-teach-staffconnect__submit-btn"
                  onClick={handleSubmitReplacement}
                  data-testid="teacher-button-submit-replacement"
                >
                  ✈️ Submit Replacement Request
                </button>
              </div>
            </div>
          )}

          {/* My Requests Tab */}
          {activeTab === 'my-requests' && (
            <div className="sc-hsu-teach-staffconnect__my-requests" data-testid="teacher-view-my-requests">
              <div className="sc-hsu-teach-staffconnect__requests-header">
                <h3 className="sc-hsu-teach-staffconnect__requests-title">Replacement Requests Sent</h3>
                <div className="sc-hsu-teach-staffconnect__requests-badges">
                  <span className="sc-hsu-teach-staffconnect__requests-badge sc-hsu-teach-staffconnect__requests-badge--pending">1 Pending</span>
                  <span className="sc-hsu-teach-staffconnect__requests-badge sc-hsu-teach-staffconnect__requests-badge--accepted">1 Accepted</span>
                </div>
              </div>

              <div className="sc-hsu-teach-staffconnect__requests-list">
                {myRequests.map((request) => (
                  <div key={request.id} className={`sc-hsu-teach-staffconnect__request-card sc-hsu-teach-staffconnect__request-card--${request.status}`}>
                    <div className="sc-hsu-teach-staffconnect__request-header-row">
                      <div className="sc-hsu-teach-staffconnect__request-icon">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="sc-hsu-teach-staffconnect__request-left">
                        <h4 className="sc-hsu-teach-staffconnect__request-subject">{request.subject}</h4>
                        <p className="sc-hsu-teach-staffconnect__request-topic">{request.topic}</p>
                      </div>
                      <span className={`sc-hsu-teach-staffconnect__request-status sc-hsu-teach-staffconnect__request-status--${request.status}`}>
                        {request.status === 'pending' && 'Pending'}
                        {request.status === 'accepted' && 'Accepted'}
                        {request.status === 'rejected' && 'Rejected'}
                        {request.status === 'cancelled' && 'Cancelled'}
                      </span>
                    </div>
                    <div className="sc-hsu-teach-staffconnect__request-details">
                      <div className="sc-hsu-teach-staffconnect__request-detail">
                        <span className="sc-hsu-teach-staffconnect__request-label">Date</span>
                        <span className="sc-hsu-teach-staffconnect__request-value">{request.date}<br />{request.dayName}</span>
                      </div>
                      <div className="sc-hsu-teach-staffconnect__request-detail">
                        <span className="sc-hsu-teach-staffconnect__request-label">Period</span>
                        <span className="sc-hsu-teach-staffconnect__request-value">{request.period}</span>
                      </div>
                      <div className="sc-hsu-teach-staffconnect__request-detail">
                        <span className="sc-hsu-teach-staffconnect__request-label">Replacement Teacher</span>
                        <span className="sc-hsu-teach-staffconnect__request-value">{request.replacementTeacher}<br />{request.expertise}</span>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <button
                        className="sc-hsu-teach-staffconnect__cancel-request-btn"
                        onClick={() => handleCancelRequest(request.id)}
                        data-testid={`teacher-button-cancel-${request.id}`}
                      >
                        ✖ Cancel Request
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Chat Layout */}
      <div className="sc-hsu-teach-staffconnect__chat-layout">
        {/* LEFT: Management Contacts Sidebar */}
        <div className="sc-hsu-teach-staffconnect__chat-sidebar">
          <div className="sc-hsu-teach-staffconnect__contacts-header">
            <div className="sc-hsu-teach-staffconnect__contacts-icon">👥</div>
            <h3 className="sc-hsu-teach-staffconnect__contacts-title">Management Contacts</h3>
          </div>
          <div className="sc-hsu-teach-staffconnect__contacts-list">
            {managementContacts.map((contact) => (
              <div
                key={contact.id}
                className={`sc-hsu-teach-staffconnect__contact-item ${selectedContact?.id === contact.id ? 'sc-hsu-teach-staffconnect__contact-item--active' : ''}`}
                onClick={() => setSelectedContact(contact)}
                data-testid={`teacher-button-message-${contact.id}`}
              >
                <div className="sc-hsu-teach-staffconnect__contact-avatar">
                  {contact.avatar}
                  {contact.online && <span className="sc-hsu-teach-staffconnect__contact-online"></span>}
                </div>
                <div className="sc-hsu-teach-staffconnect__contact-info">
                  <span className="sc-hsu-teach-staffconnect__contact-name">{contact.name}</span>
                  <span className="sc-hsu-teach-staffconnect__contact-role">{contact.role}</span>
                </div>
                <span className={`sc-hsu-teach-staffconnect__contact-status-dot ${contact.online ? 'sc-hsu-teach-staffconnect__contact-status-dot--online' : 'sc-hsu-teach-staffconnect__contact-status-dot--offline'}`}></span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Chat Container */}
        <div className="sc-hsu-teach-staffconnect__chat-container">
          {selectedContact && (
            <>
              {/* Chat Header */}
              <div className="sc-hsu-teach-staffconnect__chat-header">
                <div className="sc-hsu-teach-staffconnect__chat-header-info">
                  <div className="sc-hsu-teach-staffconnect__chat-header-avatar">
                    {selectedContact.avatar}
                    {selectedContact.online && <span className="sc-hsu-teach-staffconnect__contact-online"></span>}
                  </div>
                  <div className="sc-hsu-teach-staffconnect__chat-header-details">
                    <span className="sc-hsu-teach-staffconnect__chat-header-name">{selectedContact.name}</span>
                    <span className="sc-hsu-teach-staffconnect__chat-header-role">{selectedContact.role}</span>
                  </div>
                  <span className={`sc-hsu-teach-staffconnect__chat-header-status ${selectedContact.online ? 'sc-hsu-teach-staffconnect__chat-header-status--online' : 'sc-hsu-teach-staffconnect__chat-header-status--offline'}`}>
                    {selectedContact.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                {/* <button className="sc-hsu-teach-staffconnect__chat-close" onClick={() => setSelectedContact(managementContacts[0])}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button> */}
              </div>

              {/* Chat Body / Messages Area */}
              <div className="sc-hsu-teach-staffconnect__chat-body">
                <div className="sc-hsu-teach-staffconnect__chat-empty">
                  <div className="sc-hsu-teach-staffconnect__chat-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="sc-hsu-teach-staffconnect__chat-empty-title">No messages yet</p>
                  <p className="sc-hsu-teach-staffconnect__chat-empty-subtitle">Send a message to start the conversation</p>
                </div>
              </div>

              {/* Chat Footer / Input Area */}
              <div className="sc-hsu-teach-staffconnect__chat-footer">
                {!selectedContact.online && (
                  <p className="sc-hsu-teach-staffconnect__chat-offline-hint">
                    Message will be delivered when the user becomes available.
                  </p>
                )}
                <div className="sc-hsu-teach-staffconnect__chat-input-row">
                  <input
                    type="text"
                    className="sc-hsu-teach-staffconnect__chat-input"
                    placeholder={`Message ${selectedContact.name}...`}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    data-testid="teacher-field-message"
                  />
                  <button
                    className="sc-hsu-teach-staffconnect__chat-send"
                    data-testid="teacher-button-send-message"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Request Meeting Modal */}
      {showMeetingModal && (
        <div className="sc-hsu-teach-staffconnect__modal-overlay" onClick={() => setShowMeetingModal(false)}>
          <div className="sc-hsu-teach-staffconnect__modal" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-request-meeting">
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div className="sc-hsu-teach-staffconnect__modal-icon hsu-teach-staffconnect__modal-icon--blue">📅</div>
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title">Request Meeting with Principal</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Fill in the details to schedule a meeting</p>
              </div>
              <button className="sc-hsu-teach-staffconnect__modal-close" onClick={() => setShowMeetingModal(false)}>✕</button>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Your Name</label>
                <input
                  type="text"
                  className="sc-hsu-teach-staffconnect__form-input"
                  value={meetingForm.name}
                  disabled
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-row">
                <div className="sc-hsu-teach-staffconnect__form-group">
                  <label className="sc-hsu-teach-staffconnect__form-label">Meeting Date *</label>
                  <input
                    type="date"
                    className="sc-hsu-teach-staffconnect__form-input"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    data-testid="teacher-field-meeting-date"
                  />
                </div>

                <div className="sc-hsu-teach-staffconnect__form-group">
                  <label className="sc-hsu-teach-staffconnect__form-label">Meeting Time *</label>
                  <input
                    type="time"
                    className="sc-hsu-teach-staffconnect__form-input"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    data-testid="teacher-field-meeting-time"
                  />
                </div>
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Reason *</label>
                <textarea
                  className="sc-hsu-teach-staffconnect__form-textarea"
                  placeholder="Explain the purpose of the meeting..."
                  rows="3"
                  value={meetingForm.reason}
                  onChange={(e) => setMeetingForm({ ...meetingForm, reason: e.target.value })}
                  data-testid="teacher-field-meeting-reason"
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Additional Notes</label>
                <textarea
                  className="sc-hsu-teach-staffconnect__form-textarea"
                  placeholder="Add any important details..."
                  rows="2"
                  value={meetingForm.notes}
                  onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })}
                  data-testid="teacher-field-meeting-notes"
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-toggle">
                <label className="sc-hsu-teach-staffconnect__form-label">Mark as Urgent</label>
                <input
                  type="checkbox"
                  className="sc-hsu-teach-staffconnect__form-checkbox"
                  checked={meetingForm.urgent}
                  onChange={(e) => setMeetingForm({ ...meetingForm, urgent: e.target.checked })}
                  data-testid="teacher-checkbox-urgent"
                />
              </div>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-footer">
              <button className="sc-hsu-teach-staffconnect__modal-cancel" onClick={() => setShowMeetingModal(false)}>
                Cancel
              </button>
              <button className="sc-hsu-teach-staffconnect__modal-submit" onClick={handleSubmitMeeting} data-testid="teacher-button-submit-meeting">
                ✈️ Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Suggestion Modal */}
      {showSuggestionModal && (
        <div className="sc-hsu-teach-staffconnect__modal-overlay" onClick={() => setShowSuggestionModal(false)}>
          <div className="sc-hsu-teach-staffconnect__modal" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-submit-suggestion">
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div className="sc-hsu-teach-staffconnect__modal-icon hsu-teach-staffconnect__modal-icon--cyan">💡</div>
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title">Submit Suggestion</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Share your ideas with management</p>
              </div>
              <button className="sc-hsu-teach-staffconnect__modal-close" onClick={() => setShowSuggestionModal(false)}>✕</button>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Your Name</label>
                <input
                  type="text"
                  className="sc-hsu-teach-staffconnect__form-input"
                  value={suggestionForm.name}
                  disabled
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Suggestion Title *</label>
                <input
                  type="text"
                  className="sc-hsu-teach-staffconnect__form-input"
                  placeholder="Enter a title for your suggestion..."
                  value={suggestionForm.title}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, title: e.target.value })}
                  data-testid="teacher-field-suggestion-title"
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Category *</label>
                <select
                  className="sc-hsu-teach-staffconnect__form-select"
                  value={suggestionForm.category}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, category: e.target.value })}
                  data-testid="teacher-dropdown-suggestion-category"
                >
                  <option value="">Select category</option>
                  <option value="Academic">Academic</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Technology">Technology</option>
                  <option value="Events">Events</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Suggestion Details *</label>
                <textarea
                  className="sc-hsu-teach-staffconnect__form-textarea"
                  placeholder="Describe your suggestion in detail..."
                  rows="4"
                  value={suggestionForm.details}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, details: e.target.value })}
                  data-testid="teacher-field-suggestion-details"
                />
              </div>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-footer">
              <button className="sc-hsu-teach-staffconnect__modal-cancel" onClick={() => setShowSuggestionModal(false)}>
                Cancel
              </button>
              <button className="sc-hsu-teach-staffconnect__modal-submit" onClick={handleSubmitSuggestion} data-testid="teacher-button-submit-suggestion">
                ✈️ Submit Suggestion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact HR Modal */}
      {showHRModal && (
        <div className="sc-hsu-teach-staffconnect__modal-overlay" onClick={() => setShowHRModal(false)}>
          <div className="sc-hsu-teach-staffconnect__modal" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-contact-hr">
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div className="sc-hsu-teach-staffconnect__modal-icon hsu-teach-staffconnect__modal-icon--purple">💬</div>
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title">Contact HR Department</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Reach out to the HR department with your concerns or requests</p>
              </div>
              {/* <button className="sc-hsu-teach-staffconnect__modal-close" onClick={() => setShowHRModal(false)}>✕</button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Your Name</label>
                <input
                  type="text"
                  className="sc-hsu-teach-staffconnect__form-input"
                  value={hrForm.name}
                  disabled
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Subject *</label>
                <input
                  type="text"
                  className="sc-hsu-teach-staffconnect__form-input"
                  placeholder="Enter the subject of your message..."
                  value={hrForm.subject}
                  onChange={(e) => setHRForm({ ...hrForm, subject: e.target.value })}
                  data-testid="teacher-field-hr-subject"
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Category *</label>
                <select
                  className="sc-hsu-teach-staffconnect__form-select"
                  value={hrForm.category}
                  onChange={(e) => setHRForm({ ...hrForm, category: e.target.value })}
                  data-testid="teacher-dropdown-hr-category"
                >
                  <option value="">Select category</option>
                  <option value="Leave">Leave</option>
                  <option value="Payroll">Payroll</option>
                  <option value="Benefits">Benefits</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Message *</label>
                <textarea
                  className="sc-hsu-teach-staffconnect__form-textarea"
                  placeholder="Enter your message here..."
                  rows="4"
                  value={hrForm.message}
                  onChange={(e) => setHRForm({ ...hrForm, message: e.target.value })}
                  data-testid="teacher-field-hr-message"
                />
              </div>

              <div className="sc-hsu-teach-staffconnect__form-group">
                <label className="sc-hsu-teach-staffconnect__form-label">Attachment (Optional)</label>
                <input
                  type="file"
                  className="sc-hsu-teach-staffconnect__form-file"
                  onChange={(e) => setHRForm({ ...hrForm, attachment: e.target.files[0] })}
                  data-testid="teacher-field-hr-attachment"
                />
              </div>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-footer">
              <button className="sc-hsu-teach-staffconnect__modal-cancel" onClick={() => setShowHRModal(false)}>
                Cancel
              </button>
              <button className="sc-hsu-teach-staffconnect__modal-submit" onClick={handleSubmitHR} data-testid="teacher-button-submit-hr">
                ✈️ Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Circulars Modal */}
      {showCircularsModal && (
        <div className="sc-hsu-teach-staffconnect__modal-overlay" onClick={() => setShowCircularsModal(false)}>
          <div className="sc-hsu-teach-staffconnect__modal hsu-teach-staffconnect__modal--large" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-view-circulars">
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div className="sc-hsu-teach-staffconnect__modal-icon hsu-teach-staffconnect__modal-icon--green">📋</div>
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title">Management Circulars</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">View all recent management updates and announcements</p>
              </div>
              {/* <button className="sc-hsu-teach-staffconnect__modal-close" onClick={() => setShowCircularsModal(false)}>✕</button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              {selectedCircular ? (
                <div className="sc-hsu-teach-staffconnect__circular-detail">
                  <div className="sc-hsu-teach-staffconnect__circular-detail-header">
                    <button
                      className="sc-hsu-teach-staffconnect__back-btn"
                      onClick={() => setSelectedCircular(null)}
                      data-testid="teacher-button-back-to-list"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to list
                    </button>
                  </div>

                  <div className="sc-hsu-teach-staffconnect__circular-detail-badges">
                    <span className={`sc-hsu-teach-staffconnect__circular-type sc-hsu-teach-staffconnect__circular-type--${selectedCircular.type.toLowerCase()}`}>
                      {selectedCircular.type}
                    </span>
                    <span className={`sc-hsu-teach-staffconnect__circular-priority sc-hsu-teach-staffconnect__circular-priority--${selectedCircular.priority}`}>
                      {selectedCircular.priority}
                    </span>
                  </div>

                  <h2 className="sc-hsu-teach-staffconnect__circular-detail-title">{selectedCircular.title}</h2>

                  <div className="sc-hsu-teach-staffconnect__circular-detail-grid">
                    <div className="sc-hsu-teach-staffconnect__circular-detail-item">
                      <span className="sc-hsu-teach-staffconnect__circular-detail-label">Issued By</span>
                      <span className="sc-hsu-teach-staffconnect__circular-detail-value">{selectedCircular.issuedBy || 'Dr. Anjali Mehta - Principal'}</span>
                    </div>
                    <div className="sc-hsu-teach-staffconnect__circular-detail-item">
                      <span className="sc-hsu-teach-staffconnect__circular-detail-label">Department</span>
                      <span className="sc-hsu-teach-staffconnect__circular-detail-value">{selectedCircular.department}</span>
                    </div>
                    <div className="sc-hsu-teach-staffconnect__circular-detail-item">
                      <span className="sc-hsu-teach-staffconnect__circular-detail-label">Date & Time</span>
                      <span className="sc-hsu-teach-staffconnect__circular-detail-value">{selectedCircular.date}</span>
                    </div>
                    {selectedCircular.attachment && (
                      <div className="sc-hsu-teach-staffconnect__circular-detail-item">
                        <span className="sc-hsu-teach-staffconnect__circular-detail-label">Attachment</span>
                        <a href="#" className="sc-hsu-teach-staffconnect__circular-detail-attachment">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          {selectedCircular.attachment}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="sc-hsu-teach-staffconnect__circular-detail-description">
                    <span className="sc-hsu-teach-staffconnect__circular-detail-label">Description</span>
                    <p className="sc-hsu-teach-staffconnect__circular-detail-text">{selectedCircular.fullDescription || selectedCircular.description}</p>
                  </div>
                </div>
              ) : (
                <div className="sc-hsu-teach-staffconnect__circulars-list-modal">
                  {recentCirculars.map((circular) => (
                    <div key={circular.id} className="sc-hsu-teach-staffconnect__circular-item">
                      <div className="sc-hsu-teach-staffconnect__circular-header-row">
                        <div className="sc-hsu-teach-staffconnect__circular-badges">
                          <span className={`sc-hsu-teach-staffconnect__circular-type hsu-teach-staffconnect__circular-type--${circular.type.toLowerCase()}`}>
                            {circular.type}
                          </span>
                          <span className={`sc-hsu-teach-staffconnect__circular-priority hsu-teach-staffconnect__circular-priority--${circular.priority}`}>
                            {circular.priority}
                          </span>
                        </div>
                        <button
                          className="sc-hsu-teach-staffconnect__circular-arrow"
                          onClick={() => handleViewCircular(circular)}
                          data-testid={`teacher-button-circular-detail-${circular.id}`}
                        >
                          →
                        </button>
                      </div>
                      <h4 className="sc-hsu-teach-staffconnect__circular-title-text">{circular.title}</h4>
                      <p className="sc-hsu-teach-staffconnect__circular-description">{circular.description}</p>
                      <div className="sc-hsu-teach-staffconnect__circular-footer">
                        <span className="sc-hsu-teach-staffconnect__circular-date">🕐 {circular.date}</span>
                        <span className="sc-hsu-teach-staffconnect__circular-department">{circular.department}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
        <div className="sc-hsu-teach-staffconnect__modal-overlay" onClick={() => setShowCancelConfirmModal(false)}>
          <div className="sc-hsu-teach-staffconnect__modal sc-hsu-teach-staffconnect__modal--small" onClick={(e) => e.stopPropagation()}>
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title">Cancel Request?</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Are you sure you want to cancel this request?</p>
              </div>
              {/* <button className="sc-hsu-teach-staffconnect__modal-close" onClick={() => setShowCancelConfirmModal(false)}>✕</button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__modal-actions">
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--secondary"
                  onClick={() => setShowCancelConfirmModal(false)}
                  data-testid="teacher-button-cancel-modal-close"
                >
                  No, Keep it
                </button>
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--danger"
                  onClick={confirmCancelRequest}
                  data-testid="teacher-button-cancel-confirm"
                >
                  Yes, Cancel Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestDetailsModal && selectedAssignedRequest && (
        <div
          className="sc-hsu-teach-staffconnect__modal-overlay"
          onClick={() => setShowRequestDetailsModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-details-modal-title"
        >
          <div
            className="sc-hsu-teach-staffconnect__modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-request-details"
          >
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div className="sc-hsu-teach-staffconnect__modal-icon hsu-teach-staffconnect__modal-icon--blue">📚</div>
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title" id="request-details-modal-title">Replacement Request Details</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Review the class details and decide whether to accept or reject</p>
              </div>
              {/* <button
                className="sc-hsu-teach-staffconnect__modal-close"
                onClick={() => setShowRequestDetailsModal(false)}
                aria-label="Close request details modal"
              >
                ✕
              </button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__request-details-grid">
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Date</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.date}</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Day</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.dayName}</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Period</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.period}</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Class</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.class}</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Room</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.room}</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__request-details-item">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Subject</span>
                  <span className="sc-hsu-teach-staffconnect__request-details-value">{selectedAssignedRequest.subject}</span>
                </div>
              </div>

              <div className="sc-hsu-teach-staffconnect__request-details-section">
                <span className="sc-hsu-teach-staffconnect__request-details-label">Topic to be Taught</span>
                <p className="sc-hsu-teach-staffconnect__request-details-description">{selectedAssignedRequest.topic}</p>
              </div>

              <div className="sc-hsu-teach-staffconnect__request-details-teacher">
                <div className="sc-hsu-teach-staffconnect__teacher-info-header">
                  <span className="sc-hsu-teach-staffconnect__request-details-label">Requested By</span>
                </div>
                <div className="sc-hsu-teach-staffconnect__teacher-card">
                  <div
                    className="sc-hsu-teach-staffconnect__teacher-card-avatar"
                    style={{ backgroundColor: selectedAssignedRequest.requestedByColor }}
                  >
                    {selectedAssignedRequest.requestedByAvatar}
                  </div>
                  <div className="sc-hsu-teach-staffconnect__teacher-card-info">
                    <h4 className="sc-hsu-teach-staffconnect__teacher-card-name">{selectedAssignedRequest.requestedBy}</h4>
                    <p className="sc-hsu-teach-staffconnect__teacher-card-expertise">{selectedAssignedRequest.expertise}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-footer">
              <button
                className="sc-hsu-teach-staffconnect__request-reject-btn"
                onClick={handleRejectRequest}
                data-testid="teacher-button-reject-modal"
                aria-label="Reject the replacement request"
              >
                Reject
              </button>
              <button
                className="sc-hsu-teach-staffconnect__request-accept-btn"
                onClick={handleAcceptRequest}
                data-testid="teacher-button-accept-modal"
                aria-label="Accept the replacement request"
              >
                ✔️ Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {showAcceptConfirmModal && selectedAssignedRequest && (
        <div
          className="sc-hsu-teach-staffconnect__modal-overlay"
          onClick={() => setShowAcceptConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accept-confirm-modal-title"
        >
          <div
            className="sc-hsu-teach-staffconnect__modal sc-hsu-teach-staffconnect__modal--small"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-accept-confirm"
          >
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title" id="accept-confirm-modal-title">Accept Request?</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">You are about to accept this replacement class request.</p>
              </div>
              {/* <button
                className="sc-hsu-teach-staffconnect__modal-close"
                onClick={() => setShowAcceptConfirmModal(false)}
                aria-label="Close accept confirmation modal"
              >
                ✕
              </button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__modal-actions">
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--secondary"
                  onClick={() => setShowAcceptConfirmModal(false)}
                  data-testid="teacher-button-accept-cancel"
                  aria-label="Cancel accepting the request"
                >
                  Cancel
                </button>
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--success"
                  onClick={confirmAcceptRequest}
                  data-testid="teacher-button-accept-confirm"
                  aria-label="Confirm accepting the replacement request"
                >
                  Confirm Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectConfirmModal && selectedAssignedRequest && (
        <div
          className="sc-hsu-teach-staffconnect__modal-overlay"
          onClick={() => setShowRejectConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-confirm-modal-title"
        >
          <div
            className="sc-hsu-teach-staffconnect__modal sc-hsu-teach-staffconnect__modal--small"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-reject-confirm"
          >
            <div className="sc-hsu-teach-staffconnect__modal-header">
              <div>
                <h3 className="sc-hsu-teach-staffconnect__modal-title" id="reject-confirm-modal-title">Reject Request?</h3>
                <p className="sc-hsu-teach-staffconnect__modal-subtitle">Are you sure you want to decline this replacement request?</p>
              </div>
              {/* <button
                className="sc-hsu-teach-staffconnect__modal-close"
                onClick={() => setShowRejectConfirmModal(false)}
                aria-label="Close reject confirmation modal"
              >
                ✕
              </button> */}
            </div>

            <div className="sc-hsu-teach-staffconnect__modal-body">
              <div className="sc-hsu-teach-staffconnect__modal-actions">
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--secondary"
                  onClick={() => setShowRejectConfirmModal(false)}
                  data-testid="teacher-button-reject-cancel"
                  aria-label="Cancel rejecting the request"
                >
                  Cancel
                </button>
                <button
                  className="sc-hsu-teach-staffconnect__btn sc-hsu-teach-staffconnect__btn--danger"
                  onClick={confirmRejectRequest}
                  data-testid="teacher-button-reject-confirm"
                  aria-label="Confirm rejecting the replacement request"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  );
};

export default StaffConnect;