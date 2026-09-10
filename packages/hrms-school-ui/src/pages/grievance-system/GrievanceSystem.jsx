import React, { useState } from 'react';
import '../../assets/scss/GrievanceSystem.scss';
import CustomDropdown from './components/CustomDropdown';
import DatePicker from './components/DatePicker';
import { useGrievanceStatsQuery, useGrievanceHistoryQuery, useGrievanceGuidelinesQuery } from '../../services/grievance.queries';
import { useSubmitGrievanceMutation } from '../../services/grievance.queries';
import { GRIEVANCE_CATEGORIES, GRIEVANCE_PRIORITIES, GUIDELINE_ICONS } from './constants';
import PageLoader from '../../components/PageLoader';

/**
 * GrievanceSystem page component
 * Complete grievance submission and tracking system
 * @returns {JSX.Element} Grievance system UI
 */
const GrievanceSystem = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedCaseTitle, setSubmittedCaseTitle] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: '',
    date: '',
    description: '',
    incidentLocation: '',
    incidentTime: '',
    witnessName: '',
    witnessContact: '',
    evidenceFiles: []
  });

  const { data: statsData, isLoading: loadingStats } = useGrievanceStatsQuery();
  const { data: historyData, isLoading: loadingHistory } = useGrievanceHistoryQuery();
  const { data: guidelinesData, isLoading: loadingGuidelines } = useGrievanceGuidelinesQuery();
  const submitMutation = useSubmitGrievanceMutation();

  const isLoading = loadingStats || loadingHistory || loadingGuidelines;
  const activeCases = statsData?.activeCases ?? [];
  const stats = statsData?.stats ?? { totalGrievances: 0, activeCases: 0, resolvedThisMonth: 0, monthLabel: '-' };
  const historyItems = historyData?.historyItems ?? [];
  const historyResolvedCount = historyData?.resolvedCount ?? 0;
  const guidelines = guidelinesData ?? [];

  const categories = GRIEVANCE_CATEGORIES;
  const priorities = GRIEVANCE_PRIORITIES;

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      category: '',
      priority: '',
      date: '',
      description: '',
      incidentLocation: '',
      incidentTime: '',
      witnessName: '',
      witnessContact: '',
      evidenceFiles: []
    });
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    submitMutation.mutate(formData, {
      onSuccess: () => {
        setSubmittedCaseTitle(formData.title);
        setShowSuccessModal(true);
        handleCancel();
        setActiveTab('active');
      },
      onError: (err) => {
        console.error('? Submit grievance error:', err);
      },
    });
  };

  const isStep1Valid = formData.title && formData.category && formData.priority && formData.date && formData.description;
  const isStep2Valid = formData.incidentLocation && formData.incidentTime;

  // Loading UI
  if (isLoading) {
    return <PageLoader title="Loading Grievance System" subtitle="Fetching grievance data..." icon="⚠️" />;
  }

  return (
    <div className="sch-gr-system" data-testid="school-container-grievance-system">
      <div className="sch-gr-header">
        <h1 className="sch-gr-title">Grievance System</h1>
        <p className="sch-gr-subtitle">Submit and track formal complaints and concerns</p>
      </div>

      {/* Summary Cards */}
      <div className="sch-gr-summary-cards">
        <div className="sch-gr-summary-card sch-gr-total-card" data-testid="school-card-total-grievances">
          <div className="sch-gr-card-content">
            <span className="sch-gr-card-label">Total Grievances</span>
            <div className="sch-gr-card-value">{stats.totalGrievances}</div>
            <span className="sch-gr-card-sublabel">All time</span>
          </div>
          <div className="sch-gr-card-icon">
            <svg className="sch-gr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        <div className="sch-gr-summary-card sch-gr-active-card" data-testid="school-card-active-cases">
          <div className="sch-gr-card-content">
            <span className="sch-gr-card-label">Active Cases</span>
            <div className="sch-gr-card-value">{stats.activeCases}</div>
            <span className="sch-gr-card-sublabel">Currently open</span>
          </div>
          <div className="sch-gr-card-icon">
            <svg className="sch-gr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="sch-gr-summary-card sch-gr-resolved-card" data-testid="school-card-resolved-month">
          <div className="sch-gr-card-content">
            <span className="sch-gr-card-label">Resolved This Month</span>
            <div className="sch-gr-card-value">{stats.resolvedThisMonth}</div>
            <span className="sch-gr-card-sublabel">{stats.monthLabel}</span>
          </div>
          <div className="sch-gr-card-icon">
            <svg className="sch-gr-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sch-gr-tab-navigation">
        <button
          className={`sch-gr-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
          data-testid="school-tab-active-cases"
        >
          Active Cases
        </button>
        <button
          className={`sch-gr-tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit')}
          data-testid="school-tab-submit-new"
        >
          Submit New
        </button>
        <button
          className={`sch-gr-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          data-testid="school-tab-history"
        >
          History
        </button>
        <button
          className={`sch-gr-tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
          data-testid="school-tab-guidelines"
        >
          Guidelines
        </button>
      </div>

      {/* Tab Content */}
      <div className="sch-gr-tab-content">
        {/* ACTIVE CASES TAB */}
        {activeTab === 'active' && (
          <div className="sch-gr-active-cases-content" data-testid="school-content-active-cases">
            <div className="sch-gr-cases-table">
              <div className="sch-gr-table-header">
                <div className="sch-gr-header-cell sch-gr-details">GRIEVANCE DETAILS</div>
                <div className="sch-gr-header-cell sch-gr-category">CATEGORY</div>
                <div className="sch-gr-header-cell sch-gr-assigned-to">ASSIGNED TO</div>
                <div className="sch-gr-header-cell sch-gr-priority">PRIORITY</div>
                <div className="sch-gr-header-cell sch-gr-status">STATUS</div>
              </div>
              {activeCases.map((caseItem) => (
                <div key={caseItem.id} className="sch-gr-table-row" data-testid={`school-row-case-${caseItem.id}`}>
                  <div className="sch-gr-cell sch-gr-details">
                    <svg className={`sch-gr-priority-flag sch-gr-priority-flag-${caseItem.priority.toLowerCase()}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9"/>
                    </svg>
                    <div className="sch-gr-details-content">
                      <div className="sch-gr-grievance-title">{caseItem.title}</div>
                      <div className="sch-gr-meta">
                        {caseItem.grievanceId} � {caseItem.date}
                      </div>
                    </div>
                  </div>
                  <div className="sch-gr-cell sch-gr-category">
                    <span className="sch-gr-pill sch-gr-category-pill" data-testid={`school-pill-category-${caseItem.id}`}>
                      {caseItem.category}
                    </span>
                  </div>
                  <div className="sch-gr-cell sch-gr-assigned-to">
                    <div className="sch-gr-assignee">
                      <div className="sch-gr-assignee-avatar">
                        <svg className="sch-gr-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px' }}>{caseItem.assignedTo}</span>
                    </div>
                  </div>
                  <div className="sch-gr-cell sch-gr-priority">
                    <span className={`sch-gr-pill sch-gr-priority-pill sch-gr-priority-${caseItem.priority.toLowerCase()}`} data-testid={`school-pill-priority-${caseItem.id}`}>
                      {caseItem.priority}
                    </span>
                  </div>
                  <div className="sch-gr-cell sch-gr-status">
                    <span className={`sch-gr-pill sch-gr-status-pill sch-gr-status-${caseItem.status.toLowerCase().replace(' ', '-')}`} data-testid={`school-pill-status-${caseItem.id}`}>
                      {caseItem.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT NEW TAB */}
        {activeTab === 'submit' && (
          <div className="sch-gr-submit-new-content" data-testid="school-content-submit-new">
            <div className="sch-gr-submission-layout">
              {/* Left Side - Stepper */}
              <div className="sch-gr-submission-steps">
                <h3 className="sch-gr-steps-title">Submission Steps</h3>
                <div className="sch-gr-stepper">
                  <div className={`sch-gr-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="sch-gr-step-number">1</div>
                    <div className="sch-gr-step-label">Basic Information</div>
                  </div>
                  <div className={`sch-gr-step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="sch-gr-step-number">2</div>
                    <div className="sch-gr-step-label">Incident Details</div>
                  </div>
                  <div className={`sch-gr-step ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                    <div className="sch-gr-step-number">3</div>
                    <div className="sch-gr-step-label">Evidence Upload</div>
                  </div>
                  <div className={`sch-gr-step ${currentStep === 4 ? 'active' : ''}`}>
                    <div className="sch-gr-step-number">4</div>
                    <div className="sch-gr-step-label">Review & Submit</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="sch-gr-submission-form">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="sch-gr-form-step" data-testid="school-step-basic-info">
                    <h2 className="sch-gr-form-title">Basic Information</h2>
                    <div className="sch-gr-form-grid">
                      {/* Row 1: Title and Category */}
                      <div className="sch-gr-form-row sch-gr-form-row-1">
                        <div className="sch-gr-form-group">
                          <label htmlFor="grievance-title">Grievance Title</label>
                          <input
                            id="grievance-title"
                            type="text"
                            placeholder="Enter a clear title..."
                            value={formData.title}
                            onChange={(e) => handleFormChange('title', e.target.value)}
                            data-testid="school-field-title"
                          />
                        </div>
                        <div className="sch-gr-form-group">
                          <label htmlFor="category">Category</label>
                          <CustomDropdown
                            id="category"
                            value={formData.category}
                            onChange={(value) => handleFormChange('category', value)}
                            options={categories}
                            placeholder="Select category..."
                            testId="school-dropdown-category"
                          />
                        </div>
                      </div>
                      
                      {/* Row 2: Priority and Date */}
                      <div className="sch-gr-form-row sch-gr-form-row-2">
                        <div className="sch-gr-form-group">
                          <label htmlFor="priority">Priority Level</label>
                          <CustomDropdown
                            id="priority"
                            value={formData.priority}
                            onChange={(value) => handleFormChange('priority', value)}
                            options={priorities}
                            placeholder="Select priority..."
                            testId="school-dropdown-priority"
                          />
                        </div>
                        <div className="sch-gr-form-group">
                          <label htmlFor="incident-date">Incident Date</label>
                          <DatePicker
                            id="incident-date"
                            value={formData.date}
                            onChange={(value) => handleFormChange('date', value)}
                            testId="school-field-date"
                          />
                        </div>
                      </div>
                      <div className="sch-gr-form-group sch-gr-full-width">
                        <label htmlFor="description">Detailed Description</label>
                        <textarea
                          id="description"
                          rows="5"
                          placeholder="Provide a detailed description of your grievance..."
                          value={formData.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          data-testid="school-field-description"
                        ></textarea>
                      </div>
                    </div>
                    <div className="sch-gr-form-actions">
                      <button
                        className="sch-gr-btn-secondary"
                        onClick={handleCancel}
                        data-testid="school-button-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        className="sch-gr-btn-primary"
                        onClick={handleContinue}
                        disabled={!isStep1Valid}
                        data-testid="school-button-continue"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Incident Details */}
                {currentStep === 2 && (
                  <div className="sch-gr-form-step" data-testid="school-step-incident-details">
                    <h2 className="sch-gr-form-title">Incident Details</h2>
                    <div className="sch-gr-form-grid">
                      <div className="sch-gr-form-group">
                        <label htmlFor="location">Incident Location</label>
                        <input
                          id="location"
                          type="text"
                          placeholder="Where did it occur?"
                          value={formData.incidentLocation}
                          onChange={(e) => handleFormChange('incidentLocation', e.target.value)}
                          data-testid="school-field-location"
                        />
                      </div>
                      <div className="sch-gr-form-group">
                        <label htmlFor="time">Incident Time</label>
                        <input
                          id="time"
                          type="text"
                          placeholder="e.g., 2:30 PM"
                          value={formData.incidentTime}
                          onChange={(e) => handleFormChange('incidentTime', e.target.value)}
                          data-testid="school-field-time"
                        />
                      </div>
                      <div className="sch-gr-form-group">
                        <label htmlFor="witness-name">Witness Name (Optional)</label>
                        <input
                          id="witness-name"
                          type="text"
                          placeholder="Name of witness"
                          value={formData.witnessName}
                          onChange={(e) => handleFormChange('witnessName', e.target.value)}
                          data-testid="school-field-witness-name"
                        />
                      </div>
                      <div className="sch-gr-form-group">
                        <label htmlFor="witness-contact">Witness Contact (Optional)</label>
                        <input
                          id="witness-contact"
                          type="text"
                          placeholder="Contact information"
                          value={formData.witnessContact}
                          onChange={(e) => handleFormChange('witnessContact', e.target.value)}
                          data-testid="school-field-witness-contact"
                        />
                      </div>
                    </div>
                    <div className="sch-gr-form-actions">
                      <button
                        className="sch-gr-btn-secondary"
                        onClick={handleBack}
                        data-testid="school-button-back"
                      >
                        Back
                      </button>
                      <button
                        className="sch-gr-btn-primary"
                        onClick={handleContinue}
                        disabled={!isStep2Valid}
                        data-testid="school-button-continue"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Evidence Upload */}
                {currentStep === 3 && (
                  <div className="sch-gr-form-step" data-testid="school-step-evidence">
                    <h2 className="sch-gr-form-title">Evidence Upload</h2>
                    <div className="sch-gr-upload-area">
                      <svg className="sch-gr-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="sch-gr-upload-text">Drag and drop files here or click to browse</p>
                      <p className="sch-gr-upload-subtext">Supported formats: PDF, JPG, PNG, DOC (Max 10MB)</p>
                      <input
                        type="file"
                        className="sch-gr-upload-input"
                        multiple
                        data-testid="school-input-files"
                      />
                    </div>
                    <div className="sch-gr-form-actions">
                      <button
                        className="sch-gr-btn-secondary"
                        onClick={handleBack}
                        data-testid="school-button-back"
                      >
                        Back
                      </button>
                      <button
                        className="sch-gr-btn-primary"
                        onClick={handleContinue}
                        data-testid="school-button-continue"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="sch-gr-form-step" data-testid="school-step-review">
                    <h2 className="sch-gr-form-title">Review & Submit</h2>
                    <div className="sch-gr-review-section">
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Title:</span>
                        <span className="sch-gr-review-value">{formData.title}</span>
                      </div>
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Category:</span>
                        <span className="sch-gr-review-value">{formData.category}</span>
                      </div>
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Priority:</span>
                        <span className="sch-gr-review-value">{formData.priority}</span>
                      </div>
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Date:</span>
                        <span className="sch-gr-review-value">{formData.date}</span>
                      </div>
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Location:</span>
                        <span className="sch-gr-review-value">{formData.incidentLocation}</span>
                      </div>
                      <div className="sch-gr-review-item">
                        <span className="sch-gr-review-label">Time:</span>
                        <span className="sch-gr-review-value">{formData.incidentTime}</span>
                      </div>
                      <div className="sch-gr-review-item sch-gr-full-width">
                        <span className="sch-gr-review-label">Description:</span>
                        <span className="sch-gr-review-value">{formData.description}</span>
                      </div>
                    </div>
                    <div className="sch-gr-form-actions">
                      <button
                        className="sch-gr-btn-secondary"
                        onClick={handleBack}
                        data-testid="school-button-back"
                      >
                        Back
                      </button>
                      <button
                        className="sch-gr-btn-primary"
                        onClick={handleSubmit}
                        data-testid="school-button-submit"
                      >
                        Submit Grievance
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="sch-gr-history-content" data-testid="school-content-history">
            <div className="sch-gr-history-header">
              <h2 className="sch-gr-section-title">Grievance History</h2>
              <span className="sch-gr-history-count">{historyResolvedCount} Resolved</span>
            </div>
            {historyItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'stretch' }}>
                <div className="sch-gr-history-icon">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="13" stroke="#22c55e" strokeWidth="2" fill="none"/>
                    <path d="M11.5 16.5L15 20L21 13.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sch-gr-history-item" data-testid={`school-item-history-${item.id}`}>
                  <div className="sch-gr-history-details">
                    <div className="sch-gr-history-title-row">
                      <h3 className="sch-gr-history-title">{item.title}</h3>
                      <span className="sch-gr-history-badge">{item.grievanceId}</span>
                    </div>
                    <p className="sch-gr-history-meta">Resolved on {item.date} � {item.category}</p>
                    <div className="sch-gr-history-resolution">{item.resolution ?? '-'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GUIDELINES TAB */}
        {activeTab === 'guidelines' && (
          <div className="sch-gr-guidelines-content" data-testid="school-content-guidelines">
            <h2 className="sch-gr-section-title">Grievance Submission Guidelines</h2>
            <div className="sch-gr-guidelines-grid">
              {guidelines.map((item) => (
                <div key={item.id} className="sch-gr-guideline-card" data-testid={`school-card-guideline-${item.id}`}>
                  <div className="sch-gr-guideline-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={GUIDELINE_ICONS[(item.id - 1) % GUIDELINE_ICONS.length]} />
                    </svg>
                  </div>
                  <div className="sch-gr-guideline-content">
                    <h3 className="sch-gr-guideline-title">{item.title}</h3>
                    <p className="sch-gr-guideline-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="sch-gr-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="sch-gr-success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sch-gr-modal-icon">
              <svg className="sch-gr-checkmark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="sch-gr-modal-title">Success!</h3>
            <p className="sch-gr-modal-message">
              Your grievance <strong>&quot;{submittedCaseTitle}&quot;</strong> has been submitted and added to Active Cases.
            </p>
            <button 
              className="sch-gr-modal-btn" 
              onClick={() => setShowSuccessModal(false)}
              data-testid="school-button-modal-close"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceSystem;

