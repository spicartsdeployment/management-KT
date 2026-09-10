import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/LeaveManagement.scss';

const LeaveManagement = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Leave balances
  const [leaveBalances] = useState({
    casual: { total: 12, used: 4, available: 8 },
    sick: { total: 12, used: 2, available: 10 },
    earned: { total: 20, used: 5, available: 15 }
  });

  // Apply form state
  const [applyForm, setApplyForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    certificate: null
  });

  // Leave history
  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 1,
      type: 'Sick Leave',
      reason: 'lm-Fever',
      duration: 'Nov 1, 2025 to Nov 2, 2025',
      approvedBy: 'lm-Principal',
      status: 'Approved'
    },
    {
      id: 2,
      type: 'Casual Leave',
      reason: 'Personal work',
      duration: 'Oct 20, 2025 to Oct 20, 2025',
      approvedBy: 'Vice Principal',
      status: 'Approved'
    },
    {
      id: 3,
      type: 'Casual Leave',
      reason: 'Family function',
      duration: 'Nov 10, 2025 to Nov 11, 2025',
      approvedBy: '-',
      status: 'Pending'
    },
    {
      id: 4,
      type: 'Sick Leave',
      reason: 'Medical checkup',
      duration: 'Sep 15, 2025 to Sep 16, 2025',
      approvedBy: 'lm-Principal',
      status: 'Rejected'
    },
    {
      id: 5,
      type: 'Earned Leave',
      reason: 'Personal trip',
      duration: 'Oct 5, 2025 to Oct 7, 2025',
      approvedBy: 'lm-Principal',
      status: 'Approved'
    },
    {
      id: 6,
      type: 'Casual Leave',
      reason: 'Medical appointment',
      duration: 'Dec 18, 2025 to Dec 18, 2025',
      approvedBy: '-',
      status: 'Pending'
    },
    {
      id: 7,
      type: 'Sick Leave',
      reason: 'lm-Flu',
      duration: 'Aug 12, 2025 to Aug 14, 2025',
      approvedBy: 'lm-Principal',
      status: 'Approved'
    },
    {
      id: 8,
      type: 'Earned Leave',
      reason: 'lm-Vacation',
      duration: 'Jul 20, 2025 to Jul 25, 2025',
      approvedBy: 'Vice Principal',
      status: 'Approved'
    }
  ]);

  const handleApplyLeave = () => {
    if (!applyForm.leaveType || !applyForm.fromDate || !applyForm.toDate || !applyForm.reason) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format dates
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    // Create new leave entry
    const newLeave = {
      id: leaveHistory.length + 1,
      type: applyForm.leaveType,
      reason: applyForm.reason,
      duration: `${formatDate(applyForm.fromDate)} to ${formatDate(applyForm.toDate)}`,
      approvedBy: '-',
      status: 'Pending'
    };
    
    // Add to leave history at the beginning
    setLeaveHistory([newLeave, ...leaveHistory]);
    
    setShowApplyModal(false);
    setApplyForm({ leaveType: '', fromDate: '', toDate: '', reason: '', certificate: null });
  };

  const handleWithdrawLeave = () => {
    if (selectedLeave) {
      setLeaveHistory(leaveHistory.map(leave => 
        leave.id === selectedLeave.id 
          ? { ...leave, status: 'Withdrawn' }
          : leave
      ));
    }
    setShowWithdrawModal(false);
    setSelectedLeave(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setApplyForm({ ...applyForm, certificate: file });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Pending':
        return 'pending';
      case 'Withdrawn':
        return 'withdrawn';
      default:
        return '';
    }
  };

  const calculatePercentage = (used, total) => {
    return (used / total) * 100;
  };

  return (
    <div className="lm-hsu-teach-leavemanagement" data-testid="teacher-page-leave-management">
      {/* Header - No Container */}
      <div className="lm-hsu-teach-leavemanagement__header">
        <div className="lm-hsu-teach-leavemanagement__header-content">
          <h1 className="lm-hsu-teach-leavemanagement__title" data-testid="teacher-heading-leave-management">
            Leave Management
          </h1>
          <p className="lm-hsu-teach-leavemanagement__subtitle">Manage your leave applications</p>
        </div>
        <button
          className="lm-hsu-teach-leavemanagement__apply-btn"
          onClick={() => setShowApplyModal(true)}
          data-testid="teacher-button-apply-leave"
        >
          <span className="lm-hsu-teach-leavemanagement__apply-btn-icon">+</span>
          Apply for Leave
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="lm-hsu-teach-leavemanagement__cards-row">
        {/* Casual Leave */}
        <div className="lm-hsu-teach-leavemanagement__leave-card" data-testid="teacher-card-casual-leave">
          <h3 className="lm-hsu-teach-leavemanagement__card-title">Casual Leave</h3>
          <div className="lm-hsu-teach-leavemanagement__card-stats">
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Total</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value">{leaveBalances.casual.total} days</span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Used</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--used">
                {leaveBalances.casual.used} days
              </span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Available</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--available">
                {leaveBalances.casual.available} days
              </span>
            </div>
          </div>
          <div className="lm-hsu-teach-leavemanagement__progress-bar">
            <div
              className="lm-hsu-teach-leavemanagement__progress-fill lm-hsu-teach-leavemanagement__progress-fill--casual"
              style={{ width: `${calculatePercentage(leaveBalances.casual.available, leaveBalances.casual.total)}%` }}
            />
          </div>
        </div>

        {/* Sick Leave */}
        <div className="lm-hsu-teach-leavemanagement__leave-card" data-testid="teacher-card-sick-leave">
          <h3 className="lm-hsu-teach-leavemanagement__card-title">Sick Leave</h3>
          <div className="lm-hsu-teach-leavemanagement__card-stats">
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Total</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value">{leaveBalances.sick.total} days</span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Used</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--used">
                {leaveBalances.sick.used} days
              </span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Available</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--available">
                {leaveBalances.sick.available} days
              </span>
            </div>
          </div>
          <div className="lm-hsu-teach-leavemanagement__progress-bar">
            <div
              className="lm-hsu-teach-leavemanagement__progress-fill lm-hsu-teach-leavemanagement__progress-fill--sick"
              style={{ width: `${calculatePercentage(leaveBalances.sick.available, leaveBalances.sick.total)}%` }}
            />
          </div>
        </div>

        {/* Earned Leave */}
        <div className="lm-hsu-teach-leavemanagement__leave-card" data-testid="teacher-card-earned-leave">
          <h3 className="lm-hsu-teach-leavemanagement__card-title">Earned Leave</h3>
          <div className="lm-hsu-teach-leavemanagement__card-stats">
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Total</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value">{leaveBalances.earned.total} days</span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Used</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--used">
                {leaveBalances.earned.used} days
              </span>
            </div>
            <div className="lm-hsu-teach-leavemanagement__stat">
              <span className="lm-hsu-teach-leavemanagement__stat-label">Available</span>
              <span className="lm-hsu-teach-leavemanagement__stat-value lm-hsu-teach-leavemanagement__stat-value--available">
                {leaveBalances.earned.available} days
              </span>
            </div>
          </div>
          <div className="lm-hsu-teach-leavemanagement__progress-bar">
            <div
              className="lm-hsu-teach-leavemanagement__progress-fill lm-hsu-teach-leavemanagement__progress-fill--earned"
              style={{ width: `${calculatePercentage(leaveBalances.earned.available, leaveBalances.earned.total)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Leave History */}
      <div className="lm-hsu-teach-leavemanagement__history-section">
        <h3 className="lm-hsu-teach-leavemanagement__section-title">
          <span className="lm-hsu-teach-leavemanagement__section-icon">📅</span>
          Leave History
        </h3>

        <div className="lm-hsu-teach-leavemanagement__history-list">
          {leaveHistory.map((leave) => (
            <div
              key={leave.id}
              className="lm-hsu-teach-leavemanagement__history-item"
              data-testid={`teacher-leave-item-${leave.id}`}
            >
              <div className="lm-hsu-teach-leavemanagement__history-main">
                <div className="lm-hsu-teach-leavemanagement__history-left">
                  <h4 className="lm-hsu-teach-leavemanagement__history-type">{leave.type}</h4>
                  <p className="lm-hsu-teach-leavemanagement__history-reason">{leave.reason}</p>
                  <div className="lm-hsu-teach-leavemanagement__history-meta">
                    <div className="lm-hsu-teach-leavemanagement__history-duration">
                      <span className="lm-hsu-teach-leavemanagement__history-label">Duration</span>
                      <span className="lm-hsu-teach-leavemanagement__history-value">{leave.duration}</span>
                    </div>
                    <div className="lm-hsu-teach-leavemanagement__history-approver">
                      <span className="lm-hsu-teach-leavemanagement__history-label">Approved By</span>
                      <span className="lm-hsu-teach-leavemanagement__history-value">{leave.approvedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="lm-hsu-teach-leavemanagement__history-right">
                  <span
                    className={`lm-hsu-teach-leavemanagement__status-badge lm-hsu-teach-leavemanagement__status-badge--${getStatusColor(leave.status)}`}
                    data-testid={`teacher-badge-status-${leave.status.toLowerCase()}`}
                  >
                    {leave.status === 'Approved' && '✓ '}
                    {leave.status === 'Rejected' && '✕ '}
                    {leave.status === 'Pending' && '⏱ '}
                    {leave.status === 'Withdrawn' && '↶ '}
                    {leave.status}
                  </span>
                  {leave.status === 'Pending' && (
                    <button
                      className="lm-hsu-teach-leavemanagement__withdraw-btn"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setShowWithdrawModal(true);
                      }}
                      data-testid={`teacher-button-withdraw-${leave.id}`}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply for Leave Modal */}
      {showApplyModal && (
        <div
          className="lm-hsu-teach-leavemanagement__modal-overlay"
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="lm-hsu-teach-leavemanagement__modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-apply-leave"
          >
            <div className="lm-hsu-teach-leavemanagement__modal-header">
              <h3 className="lm-hsu-teach-leavemanagement__modal-title">Apply for Leave</h3>
              <button
                className="lm-hsu-teach-leavemanagement__modal-close"
                onClick={() => setShowApplyModal(false)}
                data-testid="teacher-button-close-apply-modal"
              >
                ✕
              </button>
            </div>

            <div className="lm-hsu-teach-leavemanagement__modal-body">
              <p className="lm-hsu-teach-leavemanagement__modal-subtitle">
                Fill in the details below to submit your leave application.
              </p>

              <div className="lm-hsu-teach-leavemanagement__form-group">
                <label className="lm-hsu-teach-leavemanagement__form-label">Leave Type</label>
                <select
                  className="lm-hsu-teach-leavemanagement__form-select"
                  value={applyForm.leaveType}
                  onChange={(e) => setApplyForm({ ...applyForm, leaveType: e.target.value })}
                  data-testid="teacher-dropdown-leave-type"
                >
                  <option value="">Select leave type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>

              <div className="lm-hsu-teach-leavemanagement__form-row">
                <div className="lm-hsu-teach-leavemanagement__form-group">
                  <label className="lm-hsu-teach-leavemanagement__form-label">From Date</label>
                  <input
                    type="date"
                    className="lm-hsu-teach-leavemanagement__form-input"
                    value={applyForm.fromDate}
                    onChange={(e) => setApplyForm({ ...applyForm, fromDate: e.target.value })}
                    placeholder="dd-mm-yyyy"
                    data-testid="teacher-field-from-date"
                  />
                </div>

                <div className="lm-hsu-teach-leavemanagement__form-group">
                  <label className="lm-hsu-teach-leavemanagement__form-label">To Date</label>
                  <input
                    type="date"
                    className="lm-hsu-teach-leavemanagement__form-input"
                    value={applyForm.toDate}
                    onChange={(e) => setApplyForm({ ...applyForm, toDate: e.target.value })}
                    placeholder="dd-mm-yyyy"
                    data-testid="teacher-field-to-date"
                  />
                </div>
              </div>

              <div className="lm-hsu-teach-leavemanagement__form-group">
                <label className="lm-hsu-teach-leavemanagement__form-label">Reason</label>
                <textarea
                  className="lm-hsu-teach-leavemanagement__form-textarea"
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                  placeholder="Enter reason for leave"
                  rows="4"
                  data-testid="teacher-field-reason"
                />
              </div>

              <div className="lm-hsu-teach-leavemanagement__form-group" style={{ marginTop: '0.5rem' }}>
                <label className="lm-hsu-teach-leavemanagement__form-label">
                  Medical Certificate (if applicable)
                </label>
                <button
                  className="lm-hsu-teach-leavemanagement__upload-btn"
                  onClick={() => document.getElementById('certificate-input').click()}
                  data-testid="teacher-button-choose-file"
                >
                  Choose File {applyForm.certificate ? '' : 'No file chosen'}
                </button>
                <input
                  id="certificate-input"
                  type="file"
                  style={{ display: 'none'}}
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {applyForm.certificate && (
                  <div className="lm-hsu-teach-leavemanagement__file-info">
                    <span className="lm-hsu-teach-leavemanagement__file-icon">📄</span>
                    <span className="lm-hsu-teach-leavemanagement__file-name">{applyForm.certificate.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lm-hsu-teach-leavemanagement__modal-footer">
              <button
                className="lm-hsu-teach-leavemanagement__modal-btn hsu-teach-leavemanagement__modal-btn--cancel"
                onClick={() => setShowApplyModal(false)}
                data-testid="teacher-button-cancel-apply"
              >
                Cancel
              </button>
              <button
                className="lm-hsu-teach-leavemanagement__modal-btn lm-hsu-teach-leavemanagement__modal-btn--submit"
                onClick={handleApplyLeave}
                data-testid="teacher-button-submit-leave"
              >
                Submit Leave Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Leave Modal */}
      {showWithdrawModal && (
        <div
          className="lm-hsu-teach-leavemanagement__modal-overlay"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="lm-hsu-teach-leavemanagement__modal lm-hsu-teach-leavemanagement__modal--withdraw"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-withdraw-leave"
          >
            <div className="lm-hsu-teach-leavemanagement__modal-header">
              <h3 className="lm-hsu-teach-leavemanagement__modal-title">Withdraw Leave Request</h3>
              <button
                className="lm-hsu-teach-leavemanagement__modal-close"
                onClick={() => setShowWithdrawModal(false)}
                data-testid="teacher-button-close-withdraw-modal"
              >
                ✕
              </button>
            </div>

            <div className="lm-hsu-teach-leavemanagement__modal-body">
              <p className="lm-hsu-teach-leavemanagement__modal-text">
                Are you sure you want to withdraw this leave request? This action cannot be undone.
              </p>
            </div>

            <div className="lm-hsu-teach-leavemanagement__modal-footer">
              <button
                className="lm-hsu-teach-leavemanagement__modal-btn lm-hsu-teach-leavemanagement__modal-btn--cancel"
                onClick={() => setShowWithdrawModal(false)}
                data-testid="teacher-button-cancel-withdraw"
              >
                Cancel
              </button>
              <button
                className="lm-hsu-teach-leavemanagement__modal-btn lm-hsu-teach-leavemanagement__modal-btn--withdraw"
                onClick={handleWithdrawLeave}
                data-testid="teacher-button-confirm-withdraw"
              >
                Yes, Withdraw
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

export default LeaveManagement;
