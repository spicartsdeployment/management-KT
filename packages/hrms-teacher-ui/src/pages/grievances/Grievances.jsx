import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Grievances.scss';

const Grievances = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'submit' | 'history' | 'guidelines'
  const [selectedCase, setSelectedCase] = useState(null); // For modal
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Submit form state
  const [submitForm, setSubmitForm] = useState({
    title: '',
    category: '',
    priority: '',
    assignedTo: '',
    description: '',
    attachments: []
  });

  // History filters
  const [historyFilters, setHistoryFilters] = useState({
    dateRange: 'All time',
    category: 'All categories',
    priority: 'All priorities',
    status: 'All statuses'
  });

  // Mock data for active cases
  const [activeCases, setActiveCases] = useState([
    {
      id: 1,
      title: 'Unfair Grading in Mathematics',
      code: 'GRV-001',
      date: '2024-03-15',
      category: 'Academic',
      assignedTo: { name: 'Dr. Sarah Williams', initials: 'SW', color: '#4f46e5' },
      priority: 'High',
      status: 'In Review',
      description: 'I believe my recent mathematics exam was graded unfairly. The marking scheme was not followed correctly and some answers were not evaluated.',
      attachments: ['exam_paper.pdf', 'marking_scheme.pdf'],
      comments: [
        { author: 'Dr. Sarah Williams', date: '2024-03-16', text: "I'm reviewing your case. Will get back within 2 days." }
      ]
    },
    {
      id: 2,
      title: 'Classroom AC not working',
      code: 'GRV-002',
      date: '2024-03-18',
      category: 'Infrastructure',
      assignedTo: { name: 'Mr. John Davis', initials: 'JD', color: '#06b6d4' },
      priority: 'Medium',
      status: 'Escalated',
      description: 'The air conditioning in Room 204 has not been working for the past week. It is affecting the teaching environment.',
      attachments: ['room_photo.jpg'],
      comments: [
        { author: 'Mr. John Davis', date: '2024-03-19', text: 'Escalated to facilities team. Should be fixed by tomorrow.' }
      ]
    },
    {
      id: 3,
      title: 'Bullying Incident Reported',
      code: 'GRV-003',
      date: '2024-03-20',
      category: 'Behaviour',
      assignedTo: { name: 'Ms. Emily Brown', initials: 'EB', color: '#8b5cf6' },
      priority: 'High',
      status: 'In Review',
      description: 'Witnessed bullying incident between students in the cafeteria. Immediate action required.',
      attachments: ['incident_report.pdf'],
      comments: [
        { author: 'Ms. Emily Brown', date: '2024-03-20', text: 'Taking this very seriously. Meeting scheduled with parents.' }
      ]
    }
  ]);

  // Mock data for history
  const [historyData, setHistoryData] = useState([
    {
      id: 4,
      title: 'Parking space allocation',
      code: 'GRV-004',
      submittedOn: '2024-10-25',
      resolvedOn: '2024-10-27',
      category: 'Facilities',
      resolvedBy: { name: 'Admin Office', initials: 'AO', color: '#f59e0b' },
      finalstatus: 'Resolved'
    },
    {
      id: 5,
      title: 'Delay in salary disbursement',
      code: 'GRV-005',
      submittedOn: '2024-11-02',
      resolvedOn: '2024-11-10',
      category: 'Finance',
      resolvedBy: { name: 'HR Manager', initials: 'HM', color: '#10b981' },
      finalstatus: 'Resolved'
    },
    {
      id: 6,
      title: 'Library resource request',
      code: 'GRV-006',
      submittedOn: '2024-09-15',
      resolvedOn: '2024-09-20',
      category: 'Academic',
      resolvedBy: { name: 'Librarian', initials: 'LB', color: '#3b82f6' },
      finalstatus: 'Resolved'
    },
    {
      id: 7,
      title: 'Transport schedule change',
      code: 'GRV-007',
      submittedOn: '2024-08-10',
      resolvedOn: '',
      category: 'Transport',
      resolvedBy: { name: 'Transport Head', initials: 'TH', color: '#6366f1' },
      finalstatus: 'Withdrawn'
    },
    {
      id: 8,
      title: 'Safety concern at playground',
      code: 'GRV-008',
      submittedOn: '2024-10-05',
      resolvedOn: '2024-10-08',
      category: 'Safety',
      resolvedBy: { name: 'Facilities Manager', initials: 'FM', color: '#14b8a6' },
      finalstatus: 'Resolved'
    }
  ]);

  // Mock staff for reassignment
  const [staffList] = useState([
    { name: 'Dr. Sarah Williams', role: 'Academic Head', initials: 'SW', color: '#4f46e5' },
    { name: 'Mr. John Davis', role: 'Facilities Manager', initials: 'JD', color: '#06b6d4' },
    { name: 'Ms. Emily Brown', role: 'Discipline Officer', initials: 'EB', color: '#8b5cf6' },
    { name: 'Mr. Robert Smith', role: 'HR Manager', initials: 'RS', color: '#10b981' },
    { name: 'Ms. Lisa Anderson', role: 'Admin Head', initials: 'LA', color: '#f59e0b' }
  ]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSubmitForm({ ...submitForm, attachments: [...submitForm.attachments, ...files] });
  };

  const handleSubmitGrievance = () => {
    if (!submitForm.title || !submitForm.category || !submitForm.priority || !submitForm.assignedTo || !submitForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    // Generate new case ID and code
    const newId = Math.max(...activeCases.map(c => c.id), ...historyData.map(h => h.id)) + 1;
    const newCode = `GRV-${String(newId).padStart(3, '0')}`;

    // Find assigned staff details
    const assignedStaff = staffList.find(s => s.name === submitForm.assignedTo) ||
      { name: submitForm.assignedTo, initials: submitForm.assignedTo.split(' ').map(n => n[0]).join(''), color: '#4f46e5' };

    // Create new active case
    const newCase = {
      id: newId,
      title: submitForm.title,
      code: newCode,
      date: dateString,
      category: submitForm.category,
      assignedTo: assignedStaff,
      priority: submitForm.priority,
      status: 'In Review',
      description: submitForm.description,
      attachments: submitForm.attachments.map(f => f.name || f),
      comments: []
    };

    // Create history entry
    const historyEntry = {
      id: newId,
      title: submitForm.title,
      code: newCode,
      submittedOn: dateString,
      resolvedOn: '',
      category: submitForm.category,
      resolvedBy: assignedStaff,
      finalstatus: 'In Review'
    };

    // Update both active cases and history
    setActiveCases([newCase, ...activeCases]);
    setHistoryData([historyEntry, ...historyData]);

    // Reset form
    setSubmitForm({
      title: '',
      category: '',
      priority: '',
      assignedTo: '',
      description: '',
      attachments: []
    });

    // Switch to active tab
    setActiveTab('active');
    alert('Grievance submitted successfully!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Review':
        return 'review';
      case 'Escalated':
        return 'escalated';
      case 'Resolved':
        return 'resolved';
      case 'Withdrawn':
        return 'withdrawn';
      default:
        return 'review';
    }
  };

  const handleStatusUpdate = (caseId, newStatus) => {
    const today = new Date().toISOString().split('T')[0];

    setActiveCases(prevCases =>
      prevCases.map(caseItem =>
        caseItem.id === caseId ? { ...caseItem, status: newStatus } : caseItem
      )
    );

    // Update history data as well
    setHistoryData(prevHistory =>
      prevHistory.map(historyItem =>
        historyItem.id === caseId
          ? {
            ...historyItem,
            finalstatus: newStatus,
            resolvedOn: newStatus === 'Resolved' ? today : historyItem.resolvedOn
          }
          : historyItem
      )
    );

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, status: newStatus });
    }
  };

  const handleReassign = (staff) => {
    if (selectedCase) {
      setActiveCases(prevCases =>
        prevCases.map(caseItem =>
          caseItem.id === selectedCase.id
            ? {
              ...caseItem,
              assignedTo: { name: staff.name, initials: staff.initials, color: staff.color },
              status: 'In Review'
            }
            : caseItem
        )
      );

      // Update history data as well
      setHistoryData(prevHistory =>
        prevHistory.map(historyItem =>
          historyItem.id === selectedCase.id
            ? {
              ...historyItem,
              resolvedBy: { name: staff.name, initials: staff.initials, color: staff.color },
              finalstatus: 'In Review'
            }
            : historyItem
        )
      );

      setSelectedCase({
        ...selectedCase,
        assignedTo: { name: staff.name, initials: staff.initials, color: staff.color },
        status: 'In Review'
      });
    }
    setShowReassignModal(false);
  };

  return (
    <div className="grv-hsu-teach-grievances" data-testid="teacher-page-grievances">
      {/* Header */}
      <div className="grv-hsu-teach-grievances__header">
        <div>
          <h1 className="grv-hsu-teach-grievances__title" data-testid="teacher-heading-grievances">
            Grievances
          </h1>
          <p className="grv-hsu-teach-grievances__subtitle">Raise and track grievances.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grv-hsu-teach-grievances__stats">
        <div className="grv-hsu-teach-grievances__stat-card grv-hsu-teach-grievances__stat-card--blue">
          <div className="grv-hsu-teach-grievances__stat-content">
            <h2 className="grv-hsu-teach-grievances__stat-number">12</h2>
            <div className="grv-hsu-teach-grievances__stat-label">
              <span className="grv-hsu-teach-grievances__stat-title">Total Cases</span>
              <span className="grv-hsu-teach-grievances__stat-desc">All time</span>
            </div>
          </div>
          <div className="grv-hsu-teach-grievances__stat-icon grv-hsu-teach-grievances__stat-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="grv-hsu-teach-grievances__stat-card grv-hsu-teach-grievances__stat-card--red">
          <div className="grv-hsu-teach-grievances__stat-content">
            <h2 className="grv-hsu-teach-grievances__stat-number">3</h2>
            <div className="grv-hsu-teach-grievances__stat-label">
              <span className="grv-hsu-teach-grievances__stat-title">Active Cases</span>
              <span className="grv-hsu-teach-grievances__stat-desc">Currently open</span>
            </div>
          </div>
          <div className="grv-hsu-teach-grievances__stat-icon grv-hsu-teach-grievances__stat-icon--red">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="grv-hsu-teach-grievances__stat-card grv-hsu-teach-grievances__stat-card--green">
          <div className="grv-hsu-teach-grievances__stat-content">
            <h2 className="grv-hsu-teach-grievances__stat-number">5</h2>
            <div className="grv-hsu-teach-grievances__stat-label">
              <span className="grv-hsu-teach-grievances__stat-title">Resolved This Month</span>
              <span className="grv-hsu-teach-grievances__stat-desc">November 2025</span>
            </div>
          </div>
          <div className="grv-hsu-teach-grievances__stat-icon grv-hsu-teach-grievances__stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grv-hsu-teach-grievances__tabs">
        <button
          className={`grv-hsu-teach-grievances__tab ${activeTab === 'active' ? 'grv-hsu-teach-grievances__tab--active' : ''}`}
          onClick={() => setActiveTab('active')}
          data-testid="teacher-tab-active-cases"
        >
          Active Cases
        </button>
        <button
          className={`grv-hsu-teach-grievances__tab ${activeTab === 'submit' ? 'grv-hsu-teach-grievances__tab--active' : ''}`}
          onClick={() => setActiveTab('submit')}
          data-testid="teacher-tab-submit-new"
        >
          Submit New
        </button>
        <button
          className={`grv-hsu-teach-grievances__tab ${activeTab === 'history' ? 'grv-hsu-teach-grievances__tab--active' : ''}`}
          onClick={() => setActiveTab('history')}
          data-testid="teacher-tab-history"
        >
          History
        </button>
        <button
          className={`grv-hsu-teach-grievances__tab ${activeTab === 'guidelines' ? 'grv-hsu-teach-grievances__tab--active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
          data-testid="teacher-tab-guidelines"
        >
          Guidelines
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div className="grv-hsu-teach-grievances__table-container" data-testid="teacher-view-active-cases">
          <table className="grv-hsu-teach-grievances__table">
            <thead>
              <tr>
                <th>Grievance Title</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeCases.map((grievance) => (
                <tr key={grievance.id}>
                  <td>
                    <div className="grv-hsu-teach-grievances__title-cell">
                      <strong>{grievance.title}</strong>
                      <span className="grv-hsu-teach-grievances__code">{grievance.code} — {grievance.date}</span>
                    </div>
                  </td>
                  <td>
                    <span className="grv-hsu-teach-grievances__category-badge">{grievance.category}</span>
                  </td>
                  <td>
                    <div className="grv-hsu-teach-grievances__assigned-cell">
                      <div className="grv-hsu-teach-grievances__avatar" style={{ background: grievance.assignedTo.color }}>
                        {grievance.assignedTo.initials}
                      </div>
                      <span>{grievance.assignedTo.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`grv-hsu-teach-grievances__priority-badge grv-hsu-teach-grievances__priority-badge--${getPriorityColor(grievance.priority)}`}>
                      {grievance.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`grv-hsu-teach-grievances__status-badge grv-hsu-teach-grievances__status-badge--${getStatusColor(grievance.status)}`}>
                      {grievance.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="grv-hsu-teach-grievances__view-btn"
                      onClick={() => setSelectedCase(grievance)}
                      data-testid={`teacher-button-view-${grievance.id}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit New Tab */}
      {activeTab === 'submit' && (
        <div className="grv-hsu-teach-grievances__submit-form" data-testid="teacher-view-submit-new">
          <div className="grv-hsu-teach-grievances__form-wrapper">
            <div className="grv-hsu-teach-grievances__form-container">
              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Grievance Title</label>
                <input
                  type="text"
                  className="grv-hsu-teach-grievances__form-input"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  placeholder="Brief title of the issue"
                  data-testid="teacher-field-grievance-title"
                />
              </div>

              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Category</label>
                <select
                  className="grv-hsu-teach-grievances__form-select"
                  value={submitForm.category}
                  onChange={(e) => setSubmitForm({ ...submitForm, category: e.target.value })}
                  data-testid="teacher-dropdown-category"
                >
                  <option value="">Select category</option>
                  <option value="Academic">Academic</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Behaviour">Behaviour</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Finance">Finance</option>
                  <option value="Transport">Transport</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Priority</label>
                <select
                  className="grv-hsu-teach-grievances__form-select"
                  value={submitForm.priority}
                  onChange={(e) => setSubmitForm({ ...submitForm, priority: e.target.value })}
                  data-testid="teacher-dropdown-priority"
                >
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Assigned To</label>
                <select
                  className="grv-hsu-teach-grievances__form-select"
                  value={submitForm.assignedTo}
                  onChange={(e) => setSubmitForm({ ...submitForm, assignedTo: e.target.value })}
                  data-testid="teacher-dropdown-assigned-to"
                >
                  <option value="">Select teacher/staff</option>
                  <option value="Dr. Sarah Williams">Dr. Sarah Williams</option>
                  <option value="Mr. John Davis">Mr. John Davis</option>
                  <option value="Ms. Emily Brown">Ms. Emily Brown</option>
                  <option value="Admin Office">Admin Office</option>
                  <option value="HR Manager">HR Manager</option>
                </select>
              </div>

              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Description</label>
                <textarea
                  className="grv-hsu-teach-grievances__form-textarea"
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  placeholder="Describe the issue in detail"
                  rows="5"
                  data-testid="teacher-field-description"
                />
              </div>

              <div className="grv-hsu-teach-grievances__form-group">
                <label className="grv-hsu-teach-grievances__form-label">Upload Attachments</label>
                <div
                  className="grv-hsu-teach-grievances__upload-area"
                  onClick={() => document.getElementById('grievance-attachments').click()}
                >
                  <span className="grv-hsu-teach-grievances__upload-icon">⬆️</span>
                  <p className="grv-hsu-teach-grievances__upload-text">Drag and drop files here</p>
                  <p className="grv-hsu-teach-grievances__upload-subtext">or click to browse</p>
                </div>
                {/* <input
                  id="grievance-attachments"
                  type="file"
                  multiple
                  style={{ display: 'grv-none' }}
                  onChange={handleFileUpload}
                /> */}
                {submitForm.attachments.length > 0 && (
                  <div className="grv-hsu-teach-grievances__file-list">
                    {submitForm.attachments.map((file, index) => (
                      <div key={index} className="grv-hsu-teach-grievances__file-item">
                        <span className="grv-hsu-teach-grievances__file-icon">📄</span>
                        <span className="grv-hsu-teach-grievances__file-name">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grv-hsu-teach-grievances__form-actions">
                <button
                  className="grv-hsu-teach-grievances__submit-btn"
                  onClick={handleSubmitGrievance}
                  data-testid="teacher-button-submit-grievance"
                >
                  Submit
                </button>
                <button
                  className="grv-hsu-teach-grievances__cancel-btn"
                  onClick={() => setActiveTab('active')}
                  data-testid="teacher-button-cancel-grievance"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="grv-hsu-teach-grievances__history" data-testid="teacher-view-history">
          {/* Filters */}
          <div className="grv-hsu-teach-grievances__history-filters">
            <div className="grv-hsu-teach-grievances__filter-item">
              <div className="grv-hsu-teach-grievances__filter-label-wrapper">
                <span className="grv-hsu-teach-grievances__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <label className="grv-hsu-teach-grievances__filter-label">Date Range</label>
              </div>
              <select
                className="grv-hsu-teach-grievances__filter-select"
                value={historyFilters.dateRange}
                onChange={(e) => setHistoryFilters({ ...historyFilters, dateRange: e.target.value })}
              >
                <option value="All time">All time</option>
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="Last 90 days">Last 90 days</option>
              </select>
            </div>

            <div className="grv-hsu-teach-grievances__filter-item">
              <div className="grv-hsu-teach-grievances__filter-label-wrapper">
                <span className="grv-hsu-teach-grievances__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L6 5L9 8M6 5V19M21 16L18 19L15 16M18 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <label className="grv-hsu-teach-grievances__filter-label">Category</label>
              </div>
              <select
                className="grv-hsu-teach-grievances__filter-select"
                value={historyFilters.category}
                onChange={(e) => setHistoryFilters({ ...historyFilters, category: e.target.value })}
              >
                <option value="All categories">All categories</option>
                <option value="Academic">Academic</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>

            <div className="grv-hsu-teach-grievances__filter-item">
              <div className="grv-hsu-teach-grievances__filter-label-wrapper">
                <span className="grv-hsu-teach-grievances__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="currentColor" />
                  </svg>
                </span>
                <label className="grv-hsu-teach-grievances__filter-label">Priority</label>
              </div>
              <select
                className="grv-hsu-teach-grievances__filter-select"
                value={historyFilters.priority}
                onChange={(e) => setHistoryFilters({ ...historyFilters, priority: e.target.value })}
              >
                <option value="All priorities">All priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="grv-hsu-teach-grievances__filter-item">
              <div className="grv-hsu-teach-grievances__filter-label-wrapper">
                <span className="grv-hsu-teach-grievances__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <label className="grv-hsu-teach-grievances__filter-label">Status</label>
              </div>
              <select
                className="grv-hsu-teach-grievances__filter-select"
                value={historyFilters.status}
                onChange={(e) => setHistoryFilters({ ...historyFilters, status: e.target.value })}
              >
                <option value="All statuses">All statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* History Table */}
          <div className="grv-hsu-teach-grievances__table-container">
            <table className="grv-hsu-teach-grievances__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Submitted On</th>
                  <th>Resolved On</th>
                  <th>Resolved By</th>
                  <th>Final Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {historyData
                  .filter(item => {
                    // Filter by date range
                    if (historyFilters.dateRange !== 'All time') {
                      const submittedDate = new Date(item.submittedOn);
                      const now = new Date();
                      const daysDiff = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));

                      if (historyFilters.dateRange === 'Last 7 days' && daysDiff > 7) return false;
                      if (historyFilters.dateRange === 'Last 30 days' && daysDiff > 30) return false;
                      if (historyFilters.dateRange === 'Last 90 days' && daysDiff > 90) return false;
                    }

                    // Filter by category
                    if (historyFilters.category !== 'All categories' && item.category !== historyFilters.category) {
                      return false;
                    }

                    // Filter by priority (if priority field exists)
                    if (historyFilters.priority !== 'All priorities' && item.priority && item.priority !== historyFilters.priority) {
                      return false;
                    }

                    // Filter by status
                    if (historyFilters.status !== 'All statuses' && item.finalstatus !== historyFilters.status) {
                      return false;
                    }

                    return true;
                  })
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="grv-hsu-teach-grievances__title-cell">
                          <strong>{item.title}</strong>
                          <span className="grv-hsu-teach-grievances__code">{item.code}</span>
                        </div>
                      </td>
                      <td>
                        <span className="grv-hsu-teach-grievances__category-badge">{item.category}</span>
                      </td>
                      <td>{item.submittedOn}</td>
                      <td>{item.resolvedOn || '—'}</td>
                      <td>
                        <div className="grv-hsu-teach-grievances__assigned-cell">
                          <div className="grv-hsu-teach-grievances__avatar" style={{ background: item.resolvedBy.color }}>
                            {item.resolvedBy.initials}
                          </div>
                          <span>{item.resolvedBy.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`grv-hsu-teach-grievances__status-badge grv-hsu-teach-grievances__status-badge--${getStatusColor(item.finalstatus)}`}>
                          {item.finalstatus === 'Resolved' && '✓ '}
                          {item.finalstatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="grv-hsu-teach-grievances__view-btn"
                          onClick={() => setSelectedCase({
                            ...item,
                            code: item.code,
                            date: item.submittedOn,
                            category: item.category,
                            priority: 'Low',
                            status: item.finalstatus,
                            description: 'Resolved grievance from history.',
                            assignedTo: item.resolvedBy,
                            attachments: [],
                            comments: []
                          })}
                          data-testid={`teacher-button-view-history-${item.id}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {historyData.filter(item => {
              if (historyFilters.dateRange !== 'All time') {
                const submittedDate = new Date(item.submittedOn);
                const now = new Date();
                const daysDiff = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));

                if (historyFilters.dateRange === 'Last 7 days' && daysDiff > 7) return false;
                if (historyFilters.dateRange === 'Last 30 days' && daysDiff > 30) return false;
                if (historyFilters.dateRange === 'Last 90 days' && daysDiff > 90) return false;
              }

              if (historyFilters.category !== 'All categories' && item.category !== historyFilters.category) {
                return false;
              }

              if (historyFilters.priority !== 'All priorities' && item.priority && item.priority !== historyFilters.priority) {
                return false;
              }

              if (historyFilters.status !== 'All statuses' && item.finalstatus !== historyFilters.status) {
                return false;
              }

              return true;
            }).length === 0 && (
                <div className="grv-hsu-teach-grievances__no-matches">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.172 16.172a4 4 0 015.656 0M12 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>No matches found</p>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="grv-hsu-teach-grievances__guidelines" data-testid="teacher-view-guidelines">
          {/* Grievance Policy */}
          <div className="grv-hsu-teach-grievances__guideline-section">
            <h3 className="grv-hsu-teach-grievances__guideline-title">
              <span className="grv-hsu-teach-grievances__guideline-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Grievance Policy
            </h3>
            <p className="grv-hsu-teach-grievances__guideline-text">
              Our grievance system is designed to ensure fair and transparent resolution of concerns raised by students, teachers, and staff members.
            </p>
            <div className="grv-hsu-teach-grievances__guideline-list">
              <div className="grv-hsu-teach-grievances__guideline-item">
                <span className="grv-hsu-teach-grievances__check-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <strong>When to raise a grievance:</strong> Any concern related to academics, behavior, safety, infrastructure, or workplace issues.
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__guideline-item">
                <span className="grv-hsu-teach-grievances__check-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <strong>Confidentiality:</strong> All grievances are handled with strict confidentiality and privacy.
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__guideline-item">
                <span className="grv-hsu-teach-grievances__check-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <strong>Eligibility:</strong> Available to all teachers, students, and staff members of the institution.
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="grv-hsu-teach-grievances__guideline-section">
            <h3 className="grv-hsu-teach-grievances__guideline-title">
              <span className="grv-hsu-teach-grievances__guideline-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Your Rights
            </h3>
            <div className="grv-hsu-teach-grievances__rights-grid">
              <div className="grv-hsu-teach-grievances__right-card grv-hsu-teach-grievances__right-card--blue">
                <div className="grv-hsu-teach-grievances__right-header">
                  <div className="grv-hsu-teach-grievances__right-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="grv-hsu-teach-grievances__right-title">Right to a fair review</h4>
                </div>
                <p className="grv-hsu-teach-grievances__right-desc">Every grievance will be reviewed impartially</p>
              </div>
              <div className="grv-hsu-teach-grievances__right-card grv-hsu-teach-grievances__right-card--purple">
                <div className="grv-hsu-teach-grievances__right-header">
                  <div className="grv-hsu-teach-grievances__right-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="grv-hsu-teach-grievances__right-title">Right to confidentiality</h4>
                </div>
                <p className="grv-hsu-teach-grievances__right-desc">Your identity and details are protected</p>
              </div>
              <div className="grv-hsu-teach-grievances__right-card grv-hsu-teach-grievances__right-card--green">
                <div className="grv-hsu-teach-grievances__right-header">
                  <div className="grv-hsu-teach-grievances__right-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="grv-hsu-teach-grievances__right-title">Right to appeal</h4>
                </div>
                <p className="grv-hsu-teach-grievances__right-desc">You can escalate if unsatisfied with the outcome</p>
              </div>
              <div className="grv-hsu-teach-grievances__right-card grv-hsu-teach-grievances__right-card--orange">
                <div className="grv-hsu-teach-grievances__right-header">
                  <div className="grv-hsu-teach-grievances__right-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="grv-hsu-teach-grievances__right-title">Right to timely updates</h4>
                </div>
                <p className="grv-hsu-teach-grievances__right-desc">Regular communication on case progress</p>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="grv-hsu-teach-grievances__guideline-section">
            <h3 className="grv-hsu-teach-grievances__guideline-title">
              <span className="grv-hsu-teach-grievances__guideline-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Support Contact
            </h3>
            <div className="grv-hsu-teach-grievances__contact-list">
              <div className="grv-hsu-teach-grievances__contact-item">
                <div className="grv-hsu-teach-grievances__contact-icon grv-hsu-teach-grievances__contact-icon--phone">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__contact-info">
                  <span className="grv-hsu-teach-grievances__contact-label">Support Number</span>
                  <span className="grv-hsu-teach-grievances__contact-value">+91 98765 43210</span>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__contact-item">
                <div className="grv-hsu-teach-grievances__contact-icon grv-hsu-teach-grievances__contact-icon--email">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__contact-info">
                  <span className="grv-hsu-teach-grievances__contact-label">Email</span>
                  <span className="grv-hsu-teach-grievances__contact-value">support@eduspace.com</span>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__contact-item">
                <div className="grv-hsu-teach-grievances__contact-icon grv-hsu-teach-grievances__contact-icon--person">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__contact-info">
                  <span className="grv-hsu-teach-grievances__contact-label">Contact Person</span>
                  <span className="grv-hsu-teach-grievances__contact-value">Mr. Jonathan Reed (Grievance Officer)</span>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__contact-item">
                <div className="grv-hsu-teach-grievances__contact-icon grv-hsu-teach-grievances__contact-icon--clock">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__contact-info">
                  <span className="grv-hsu-teach-grievances__contact-label">Office Hours</span>
                  <span className="grv-hsu-teach-grievances__contact-value">9 AM – 5 PM (Mon–Fri)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Timeline */}
          <div className="grv-hsu-teach-grievances__guideline-section">
            <h3 className="grv-hsu-teach-grievances__guideline-title">
              <span className="grv-hsu-teach-grievances__guideline-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Resolution Timeline
            </h3>
            <div className="grv-hsu-teach-grievances__timeline">
              <div className="grv-hsu-teach-grievances__timeline-item">
                <div className="grv-hsu-teach-grievances__timeline-icon grv-hsu-teach-grievances__timeline-icon--submission">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__timeline-content">
                  <h4 className="grv-hsu-teach-grievances__timeline-title">Submission</h4>
                  <p className="grv-hsu-teach-grievances__timeline-desc">Day 0</p>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__timeline-item">
                <div className="grv-hsu-teach-grievances__timeline-icon grv-hsu-teach-grievances__timeline-icon--review">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__timeline-content">
                  <h4 className="grv-hsu-teach-grievances__timeline-title">Review</h4>
                  <p className="grv-hsu-teach-grievances__timeline-desc">Day 1-2</p>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__timeline-item">
                <div className="grv-hsu-teach-grievances__timeline-icon grv-hsu-teach-grievances__timeline-icon--investigation">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__timeline-content">
                  <h4 className="grv-hsu-teach-grievances__timeline-title">Investigation</h4>
                  <p className="grv-hsu-teach-grievances__timeline-desc">Day 3-5</p>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__timeline-item">
                <div className="grv-hsu-teach-grievances__timeline-icon grv-hsu-teach-grievances__timeline-icon--action">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__timeline-content">
                  <h4 className="grv-hsu-teach-grievances__timeline-title">Action</h4>
                  <p className="grv-hsu-teach-grievances__timeline-desc">Day 6-7</p>
                </div>
              </div>
              <div className="grv-hsu-teach-grievances__timeline-item">
                <div className="grv-hsu-teach-grievances__timeline-icon grv-hsu-teach-grievances__timeline-icon--closure">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="grv-hsu-teach-grievances__timeline-content">
                  <h4 className="grv-hsu-teach-grievances__timeline-title">Closure</h4>
                  <p className="grv-hsu-teach-grievances__timeline-desc">Day 7-10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Details Modal */}
      {selectedCase && (
        <div className="grv-hsu-teach-grievances__modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="grv-hsu-teach-grievances__modal" onClick={(e) => e.stopPropagation()}>
            <div className="grv-hsu-teach-grievances__modal-header">
              <div>
                <h2 className="grv-hsu-teach-grievances__modal-title">Grievance Details</h2>
                <p className="grv-hsu-teach-grievances__modal-subtitle">
                  Case {selectedCase.code} — Submitted on {selectedCase.date}
                </p>
              </div>
              <button className="grv-hsu-teach-grievances__modal-close" onClick={() => setSelectedCase(null)}>
                ✕
              </button>
            </div>

            <div className="grv-hsu-teach-grievances__modal-body">
              <div className="grv-hsu-teach-grievances__modal-section">
                <h3 className="grv-hsu-teach-grievances__modal-section-title">Title</h3>
                <p className="grv-hsu-teach-grievances__modal-text">{selectedCase.title}</p>
              </div>

              <div className="grv-hsu-teach-grievances__modal-row">
                <div className="grv-hsu-teach-grievances__modal-section">
                  <h3 className="grv-hsu-teach-grievances__modal-section-title">Category</h3>
                  <span className="grv-hsu-teach-grievances__category-badge">{selectedCase.category}</span>
                </div>
                <div className="grv-hsu-teach-grievances__modal-section">
                  <h3 className="grv-hsu-teach-grievances__modal-section-title">Priority</h3>
                  <span className={`grv-hsu-teach-grievances__priority-badge grv-hsu-teach-grievances__priority-badge--${getPriorityColor(selectedCase.priority)}`}>
                    {selectedCase.priority}
                  </span>
                </div>
              </div>

              <div className="grv-hsu-teach-grievances__modal-section">
                <h3 className="grv-hsu-teach-grievances__modal-section-title">Description</h3>
                <p className="grv-hsu-teach-grievances__modal-text">{selectedCase.description}</p>
              </div>

              <div className="grv-hsu-teach-grievances__modal-section">
                <h3 className="grv-hsu-teach-grievances__modal-section-title">Assigned To</h3>
                <div className="grv-hsu-teach-grievances__assigned-cell">
                  <div className="grv-hsu-teach-grievances__avatar" style={{ background: selectedCase.assignedTo.color }}>
                    {selectedCase.assignedTo.initials}
                  </div>
                  <span>{selectedCase.assignedTo.name}</span>
                </div>
              </div>

              <div className="grv-hsu-teach-grievances__modal-section">
                <h3 className="grv-hsu-teach-grievances__modal-section-title">Current Status</h3>
                <span className={`grv-hsu-teach-grievances__status-badge grv-hsu-teach-grievances__status-badge--${getStatusColor(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>

              {selectedCase.attachments && selectedCase.attachments.length > 0 && (
                <div className="grv-hsu-teach-grievances__modal-section">
                  <h3 className="grv-hsu-teach-grievances__modal-section-title">Attachments</h3>
                  <div className="grv-hsu-teach-grievances__attachments-list">
                    {selectedCase.attachments.map((file, index) => (
                      <div key={index} className="grv-hsu-teach-grievances__attachment-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.196 21.021 4 20.55 4 20V4C4 3.45 4.196 2.979 4.588 2.587C4.97933 2.19567 5.45 2 6 2H14L20 8V20C20 20.55 19.8043 21.021 19.413 21.413C19.021 21.8043 18.55 22 18 22H6ZM13 9V4H6V20H18V9H13Z" fill="#64748b" />
                        </svg>
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCase.comments && selectedCase.comments.length > 0 && (
                <div className="grv-hsu-teach-grievances__modal-section">
                  <h3 className="grv-hsu-teach-grievances__modal-section-title">Comments Thread</h3>
                  <div className="grv-hsu-teach-grievances__comments-list">
                    {selectedCase.comments.map((comment, index) => (
                      <div key={index} className="grv-hsu-teach-grievances__comment-item">
                        <p className="grv-hsu-teach-grievances__comment-text">{comment.text}</p>
                        <p className="grv-hsu-teach-grievances__comment-meta">— {comment.author} on {comment.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedCase.status !== 'Resolved' && selectedCase.status !== 'Withdrawn' && (
              <div className="grv-hsu-teach-grievances__modal-footer">
                <button
                  className="grv-hsu-teach-grievances__modal-btn grv-hsu-teach-grievances__modal-btn--resolved"
                  onClick={() => {
                    handleStatusUpdate(selectedCase.id, 'Resolved');
                  }}
                  data-testid="teacher-button-mark-resolved"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white" />
                  </svg>
                  Mark as Resolved
                </button>
                {/* <button 
                  className="grv-hsu-teach-grievances__modal-btn grv-hsu-teach-grievances__modal-btn--reassign"
                  onClick={() => setShowReassignModal(true)}
                  data-testid="teacher-button-reassign"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Reassign
                </button>
                <button 
                  className="grv-hsu-teach-grievances__modal-btn grv-hsu-teach-grievances__modal-btn--escalate"
                  onClick={() => {
                    handleStatusUpdate(selectedCase.id, 'Escalated');
                  }}
                  data-testid="teacher-button-escalate"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V15M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="18" r="0.5" fill="white" stroke="white"/>
                  </svg>
                  Escalate
                </button> */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="grv-hsu-teach-grievances__modal-overlay" onClick={() => setShowReassignModal(false)}>
          <div className="grv-hsu-teach-grievances__reassign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="grv-hsu-teach-grievances__modal-header">
              <h2 className="grv-hsu-teach-grievances__modal-title">Reassign Grievance</h2>
              <button className="grv-hsu-teach-grievances__modal-close" onClick={() => setShowReassignModal(false)}>
                ✕
              </button>
            </div>
            <div className="grv-hsu-teach-grievances__modal-body">
              <p className="grv-hsu-teach-grievances__reassign-text">Select a staff member to reassign this case:</p>
              <div className="grv-hsu-teach-grievances__staff-list">
                {staffList.map((staff, index) => (
                  <div
                    key={index}
                    className="grv-hsu-teach-grievances__staff-item"
                    onClick={() => handleReassign(staff)}
                  >
                    <div className="grv-hsu-teach-grievances__avatar" style={{ background: staff.color }}>
                      {staff.initials}
                    </div>
                    <div className="grv-hsu-teach-grievances__staff-info">
                      <p className="grv-hsu-teach-grievances__staff-name">{staff.name}</p>
                      <p className="grv-hsu-teach-grievances__staff-role">{staff.role}</p>
                    </div>
                  </div>
                ))}
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

export default Grievances;
