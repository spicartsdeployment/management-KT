import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/StaffRequests.scss';

const StaffRequests = () => {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // New request form state
  const [newRequestForm, setNewRequestForm] = useState({
    category: '',
    title: '',
    description: ''
  });

  // Mock data for requests
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Feature':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Bug':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7v8a4 4 0 008 0V7M3 17h2m14 0h2M3 11h2m14 0h2M8 3l4 4 4-4M7 10h.01M17 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Support':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v.5M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const [requests, setRequests] = useState([
    {
      id: 1,
      category: 'Feature',
      title: 'Add bulk grade upload feature',
      description: 'Would like ability to upload grades for multiple students at once via CSV',
      date: 'Nov 3, 2025',
      status: 'In Progress',
      replies: 1,
      responses: [
        {
          from: 'Tech Team',
          date: 'Nov 4, 2025',
          message: "Great suggestion! We're working on this feature. Expected release: Dec 2025"
        }
      ]
    },
    {
      id: 2,
      category: 'Bug',
      title: 'Attendance report export not working',
      description: 'When trying to export monthly attendance report, getting an error',
      date: 'Oct 28, 2025',
      status: 'Resolved',
      replies: 1,
      responses: [
        {
          from: 'Support Team',
          date: 'Oct 29, 2025',
          message: 'This issue has been fixed. Please try again and let us know if it persists.'
        }
      ]
    },
    {
      id: 3,
      category: 'Support',
      title: 'How to create custom assignment templates?',
      description: 'Need help understanding the template creation process',
      date: 'Oct 25, 2025',
      status: 'Resolved',
      replies: 1,
      responses: [
        {
          from: 'Support Team',
          date: 'Oct 25, 2025',
          message: 'Check out our help guide: [Link]. Feel free to reach out if you need more assistance.'
        }
      ]
    },
    {
      id: 4,
      category: 'Feature',
      title: 'Mobile app for teachers',
      description: 'Request for a dedicated mobile application for teachers to access features on-the-go',
      date: 'Oct 20, 2025',
      status: 'Under Review',
      replies: 0,
      responses: []
    }
  ]);

  const handleSubmitRequest = () => {
    if (!newRequestForm.category || !newRequestForm.title || !newRequestForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get today's date in the same format
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Create new request object
    const newRequest = {
      id: requests.length + 1,
      category: newRequestForm.category,
      title: newRequestForm.title,
      description: newRequestForm.description,
      date: formattedDate,
      status: 'In Progress',
      replies: 0,
      responses: []
    };
    
    // Add to requests list
    setRequests([newRequest, ...requests]);
    
    // Reset form and close modal
    setNewRequestForm({
      category: '',
      title: '',
      description: ''
    });
    setShowNewRequestModal(false);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  // Calculate stats
  const totalRequests = requests.length;
  const inProgressRequests = requests.filter(r => r.status === 'In Progress').length;
  const underReviewRequests = requests.filter(r => r.status === 'Under Review').length;
  const resolvedRequests = requests.filter(r => r.status === 'Resolved').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'progress';
      case 'Under Review':
        return 'review';
      case 'Resolved':
        return 'resolved';
      default:
        return '';
    }
  };

  return (
    <div className="sr-hsu-teach-staffrequests" data-testid="teacher-page-staff-requests">
      {/* Header */}
      <div className="sr-hsu-teach-staffrequests__header">
        <div>
          <h1 className="sr-hsu-teach-staffrequests__title" data-testid="teacher-heading-staff-requests">
            Requests for Us
          </h1>
          <p className="sr-hsu-teach-staffrequests__subtitle">Submit feature requests, bug reports, or get support</p>
        </div>
        <button
          className="sr-hsu-teach-staffrequests__new-btn"
          onClick={() => setShowNewRequestModal(true)}
          data-testid="teacher-button-new-request"
        >
          <span className="sr-hsu-teach-staffrequests__new-btn-icon">+</span>
          New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="sr-hsu-teach-staffrequests__stats">
        <div className="sr-hsu-teach-staffrequests__stat-card sr-hsu-teach-staffrequests__stat-card--blue">
          <div className="sr-hsu-teach-staffrequests__stat-content">
            <p className="sr-hsu-teach-staffrequests__stat-label">Total Requests</p>
            <h2 className="sr-hsu-teach-staffrequests__stat-number">{totalRequests}</h2>
          </div>
          <div className="sr-hsu-teach-staffrequests__stat-icon sr-hsu-teach-staffrequests__stat-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="sr-hsu-teach-staffrequests__stat-card sr-hsu-teach-staffrequests__stat-card--light-blue">
          <div className="sr-hsu-teach-staffrequests__stat-content">
            <p className="sr-hsu-teach-staffrequests__stat-label">In Progress</p>
            <h2 className="sr-hsu-teach-staffrequests__stat-number">{inProgressRequests}</h2>
          </div>
          <div className="sr-hsu-teach-staffrequests__stat-icon sr-hsu-teach-staffrequests__stat-icon--light-blue">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="sr-hsu-teach-staffrequests__stat-card sr-hsu-teach-staffrequests__stat-card--orange">
          <div className="sr-hsu-teach-staffrequests__stat-content">
            <p className="sr-hsu-teach-staffrequests__stat-label">Under Review</p>
            <h2 className="sr-hsu-teach-staffrequests__stat-number">{underReviewRequests}</h2>
          </div>
          <div className="sr-hsu-teach-staffrequests__stat-icon sr-hsu-teach-staffrequests__stat-icon--orange">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <path d="M12 16v.5M12 8v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="sr-hsu-teach-staffrequests__stat-card sr-hsu-teach-staffrequests__stat-card--green">
          <div className="sr-hsu-teach-staffrequests__stat-content">
            <p className="sr-hsu-teach-staffrequests__stat-label">Resolved</p>
            <h2 className="sr-hsu-teach-staffrequests__stat-number">{resolvedRequests}</h2>
          </div>
          <div className="sr-hsu-teach-staffrequests__stat-icon sr-hsu-teach-staffrequests__stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="sr-hsu-teach-staffrequests__content">
        {selectedRequest ? (
          /* Detail View */
          <div className="sr-hsu-teach-staffrequests__detail-view" data-testid="teacher-view-request-detail">
            <button
              className="sr-hsu-teach-staffrequests__back-btn"
              onClick={handleBackToList}
              data-testid="teacher-button-back-to-list"
            >
              ← Back to list
            </button>

            <div className="sr-hsu-teach-staffrequests__detail-container">
              {/* Request Details */}
              <div className="sr-hsu-teach-staffrequests__request-detail">
                <h2 className="sr-hsu-teach-staffrequests__detail-title">{selectedRequest.title}</h2>
                <p className="sr-hsu-teach-staffrequests__detail-description">{selectedRequest.description}</p>
              </div>

              {/* Responses */}
              <div className="sr-hsu-teach-staffrequests__responses">
                {selectedRequest.responses.map((response, index) => (
                  <div key={index} className="sr-hsu-teach-staffrequests__response-card">
                    <div className="sr-hsu-teach-staffrequests__response-header">
                      <span className="sr-hsu-teach-staffrequests__response-from">{response.from}</span>
                      <span className="sr-hsu-teach-staffrequests__response-date">{response.date}</span>
                    </div>
                    <p className="sr-hsu-teach-staffrequests__response-message">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <>
            <h2 className="sr-hsu-teach-staffrequests__section-title">Your Requests</h2>

            {/* Requests Table */}
            <div className="sr-hsu-teach-staffrequests__table-container">
              <table className="sr-hsu-teach-staffrequests__table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Replies</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} onClick={() => handleViewRequest(request)} data-testid={`teacher-row-request-${request.id}`}>
                      <td>
                        <div className="sr-hsu-teach-staffrequests__category-cell">
                          <span className="sr-hsu-teach-staffrequests__category-icon">{getCategoryIcon(request.category)}</span>
                          <span className="sr-hsu-teach-staffrequests__category-text">{request.category}</span>
                        </div>
                      </td>
                      <td>
                        <span className="sr-hsu-teach-staffrequests__title-cell">{request.title}</span>
                      </td>
                      <td>
                        <span className="sr-hsu-teach-staffrequests__date-cell">{request.date}</span>
                      </td>
                      <td>
                        <span className={`sr-hsu-teach-staffrequests__status-badge sr-hsu-teach-staffrequests__status-badge--${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td>
                        <span className="sr-hsu-teach-staffrequests__replies-cell">{request.replies}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* All Responses Section */}
            <div className="sr-hsu-teach-staffrequests__all-responses">
              {requests.filter(r => r.responses.length > 0).map((request) => (
                <div key={request.id} className="sr-hsu-teach-staffrequests__response-section">
                  <div className="sr-hsu-teach-staffrequests__response-section-header">
                    <h3 className="sr-hsu-teach-staffrequests__response-section-title">{request.title}</h3>
                    <p className="sr-hsu-teach-staffrequests__response-section-description">{request.description}</p>
                  </div>

                  {request.responses.map((response, index) => (
                    <div key={index} className="sr-hsu-teach-staffrequests__response-card">
                      <div className="sr-hsu-teach-staffrequests__response-header">
                        <span className="sr-hsu-teach-staffrequests__response-from">{response.from}</span>
                        <span className="sr-hsu-teach-staffrequests__response-date">{response.date}</span>
                      </div>
                      <p className="sr-hsu-teach-staffrequests__response-message">{response.message}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="sr-hsu-teach-staffrequests__modal-overlay" onClick={() => setShowNewRequestModal(false)}>
          <div className="sr-hsu-teach-staffrequests__modal" onClick={(e) => e.stopPropagation()} data-testid="teacher-modal-new-request">
            <div className="sr-hsu-teach-staffrequests__modal-header">
              <div>
                <h3 className="sr-hsu-teach-staffrequests__modal-title">Submit New Request</h3>
                <p className="sr-hsu-teach-staffrequests__modal-subtitle">Fill out the form below to submit your request.</p>
              </div>
              <button className="sr-hsu-teach-staffrequests__modal-close" onClick={() => setShowNewRequestModal(false)}>
                ✕
              </button>
            </div>

            <div className="sr-hsu-teach-staffrequests__modal-body">
              <div className="sr-hsu-teach-staffrequests__form-group">
                <label className="sr-hsu-teach-staffrequests__form-label">Category</label>
                <select
                  className="sr-hsu-teach-staffrequests__form-select"
                  value={newRequestForm.category}
                  onChange={(e) => setNewRequestForm({ ...newRequestForm, category: e.target.value })}
                  data-testid="teacher-dropdown-category"
                >
                  <option value="">Select category</option>
                  <option value="Feature">Feature</option>
                  <option value="Bug">Bug</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div className="sr-hsu-teach-staffrequests__form-group">
                <label className="sr-hsu-teach-staffrequests__form-label">Title</label>
                <input
                  type="text"
                  className="sr-hsu-teach-staffrequests__form-input"
                  placeholder="Brief title for your request"
                  value={newRequestForm.title}
                  onChange={(e) => setNewRequestForm({ ...newRequestForm, title: e.target.value })}
                  data-testid="teacher-field-title"
                />
              </div>

              <div className="sr-hsu-teach-staffrequests__form-group">
                <label className="sr-hsu-teach-staffrequests__form-label">Description</label>
                <textarea
                  className="sr-hsu-teach-staffrequests__form-textarea"
                  placeholder="Describe your request in detail"
                  rows="5"
                  value={newRequestForm.description}
                  onChange={(e) => setNewRequestForm({ ...newRequestForm, description: e.target.value })}
                  data-testid="teacher-field-description"
                />
              </div>
            </div>

            <div className="sr-hsu-teach-staffrequests__modal-footer">
              <button
                className="sr-hsu-teach-staffrequests__modal-submit"
                onClick={handleSubmitRequest}
                disabled={!newRequestForm.category || !newRequestForm.title || !newRequestForm.description}
                data-testid="teacher-button-submit-request"
              >
                Submit Request
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

export default StaffRequests;
