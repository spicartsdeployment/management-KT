import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/ResourcesUploading.scss';

const ResourcesUploading = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      fileName: 'Quadratic Equations - Complete Guide.pdf',
      fileSize: '2.4 MB',
      type: 'PDF',
      chapter: 'Chapter 4: Quadratic Equations',
      uploadedOn: 'Nov 3, 2025',
      visibility: 'Public',
      views: 145
    },
    {
      id: 2,
      fileName: 'Algebraic Expressions Tutorial.mp4',
      fileSize: '45.6 MB',
      type: 'Video',
      chapter: 'Chapter 2: Algebra',
      uploadedOn: 'Oct 28, 2025',
      visibility: 'Private',
      views: 89
    },
    {
      id: 3,
      fileName: 'Trigonometry Practice Questions.pdf',
      fileSize: '1.8 MB',
      type: 'PDF',
      chapter: 'Chapter 8: Trigonometry',
      uploadedOn: 'Oct 25, 2025',
      visibility: 'Public',
      views: 203
    },
    {
      id: 4,
      fileName: 'Geometry Formulas Cheat Sheet.png',
      fileSize: '856 KB',
      type: 'Image',
      chapter: 'Chapter 6: Geometry',
      uploadedOn: 'Oct 20, 2025',
      visibility: 'Public',
      views: 312
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    resourceType: '',
    visibility: 'Public',
    file: null
  });
  const [error, setError] = useState('');

  // Calculate metrics
  const totalResources = resources.length;
  const totalViews = resources.reduce((sum, r) => sum + r.views, 0);
  const pdfCount = resources.filter(r => r.type === 'PDF').length;
  const videoCount = resources.filter(r => r.type === 'Video').length;

  const openModal = () => {
    setIsModalOpen(true);
    setFormData({
      subject: '',
      chapter: '',
      resourceType: '',
      visibility: 'Public',
      file: null
    });
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setError('');
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('File size exceeds 5 MB. Please upload a smaller file.');
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'video/mp4', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, MP4, PNG, or JPG files only.');
      return;
    }

    setFormData(prev => ({ ...prev, file }));
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getFileType = (file) => {
    if (file.type.includes('pdf')) return 'PDF';
    if (file.type.includes('video')) return 'Video';
    if (file.type.includes('image')) return 'Image';
    return 'File';
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.chapter || !formData.resourceType || !formData.file) {
      setError('Please fill all required fields');
      return;
    }

    const newResource = {
      id: Date.now(),
      fileName: formData.file.name,
      fileSize: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: getFileType(formData.file),
      chapter: formData.chapter,
      uploadedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      visibility: formData.visibility,
      views: 0
    };

    setResources(prev => [newResource, ...prev]);
    closeModal();
  };

  const openDeleteModal = (resource) => {
    setResourceToDelete(resource);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setResourceToDelete(null);
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      setResources(prev => prev.filter(r => r.id !== resourceToDelete.id));
      closeDeleteModal();
    }
  };

  const shareResource = (resource) => {
    const shareUrl = `${window.location.origin}/resources/${resource.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Link copied to clipboard: ${shareUrl}`);
    }).catch(() => {
      alert('Failed to copy link to clipboard');
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
      case 'Video':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        );
      case 'Image':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        );
    }
  };

  return (
    <div className="ru-resource-uploading" data-testid="school-page-resource-uploading">
      {/* Header */}
      <div className="ru-resource-header">
        <div className="ru-header-text">
          <h1 data-testid="school-field-resources-title">Resource Uploading</h1>
          <p>Upload and manage teaching resources</p>
        </div>
        <button className="ru-btn-upload-resource" onClick={openModal} data-testid="school-button-upload-resource">
          <span>+</span> Upload Resource
        </button>
      </div>

      {/* Metric Cards */}
      <div className="ru-metrics-row">
        <div className="ru-metric-card" data-testid="school-card-total-resources">
          <div className="ru-metric-content">
            <div className="ru-metric-label">Total Resources</div>
            <div className="ru-metric-value">{totalResources}</div>
          </div>
          <div className="ru-metric-icon ru-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>

        <div className="ru-metric-card" data-testid="school-card-total-views">
          <div className="ru-metric-content">
            <div className="ru-metric-label">Total Views</div>
            <div className="ru-metric-value">{totalViews}</div>
          </div>
          <div className="ru-metric-icon ru-blue-light">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>

        <div className="ru-metric-card" data-testid="school-card-pdf-documents">
          <div className="ru-metric-content">
            <div className="ru-metric-label">PDF Documents</div>
            <div className="ru-metric-value">{pdfCount}</div>
          </div>
          <div className="ru-metric-icon ru-red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>

        <div className="ru-metric-card" data-testid="school-card-videos">
          <div className="ru-metric-content">
            <div className="ru-metric-label">Videos</div>
            <div className="ru-metric-value">{videoCount}</div>
          </div>
          <div className="ru-metric-icon ru-blue-bright">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="ru-resources-section">
        <h2 className="ru-section-title">Your Resources</h2>
        
        <div className="ru-table-container">
          <table className="ru-resources-table" data-testid="school-table-resources">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Chapter</th>
                <th>Uploaded On</th>
                <th>Visibility</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan="7" className="ru-no-resources">No resources uploaded yet</td>
                </tr>
              ) : (
                resources.map(resource => (
                  <tr key={resource.id} data-testid={`school-row-resource-${resource.id}`}>
                    <td className="ru-file-name-cell">
                      <span className={`ru-file-icon ru-${resource.type.toLowerCase()}`}>{getFileIcon(resource.type)}</span>
                      <div className="ru-file-info">
                        <div className="ru-file-name">{resource.fileName}</div>
                        <div className="ru-file-size">{resource.fileSize}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`ru-badge ru-type-${resource.type.toLowerCase()}`}>
                        {resource.type}
                      </span>
                    </td>
                    <td>{resource.chapter}</td>
                    <td>{resource.uploadedOn}</td>
                    <td>
                      <span className={`ru-badge ru-visibility-${resource.visibility.toLowerCase()}`}>
                        {resource.visibility}
                      </span>
                    </td>
                    <td className="ru-views-cell">{resource.views}</td>
                    <td className="ru-actions-cell">
                      <button 
                        className="ru-btn-action ru-share" 
                        title="Share"
                        onClick={() => shareResource(resource)}
                        data-testid={`school-button-share-${resource.id}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                      <button 
                        className="ru-btn-action ru-delete" 
                        onClick={() => openDeleteModal(resource)}
                        title="Delete"
                        data-testid={`school-button-delete-${resource.id}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="ru-modal-overlay" onClick={closeModal}>
          <div className="ru-modal-content" onClick={e => e.stopPropagation()} data-testid="school-modal-upload-resource">
            <div className="ru-modal-header">
              <h2>Upload New Resource</h2>
              <button className="ru-btn-close" onClick={closeModal}>×</button>
            </div>

            <p className="ru-modal-subtitle">Upload a new teaching resource here.</p>

            <div className="ru-modal-body">
              {/* Subject */}
              <div className="ru-form-group">
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  data-testid="school-dropdown-subject"
                >
                  <option value="">Select subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>

              {/* Chapter */}
              <div className="ru-form-group">
                <label>Chapter</label>
                <input
                  type="text"
                  placeholder="Enter chapter name"
                  value={formData.chapter}
                  onChange={e => handleInputChange('chapter', e.target.value)}
                  data-testid="school-field-chapter"
                />
              </div>

              {/* Resource Type */}
              <div className="ru-form-group">
                <label>Resource Type</label>
                <select
                  value={formData.resourceType}
                  onChange={e => handleInputChange('resourceType', e.target.value)}
                  data-testid="school-dropdown-resource-type"
                >
                  <option value="">Select type</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Image">Image</option>
                </select>
              </div>

              {/* Visibility */}
              <div className="ru-form-group">
                <label>Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={e => handleInputChange('visibility', e.target.value)}
                  data-testid="school-dropdown-visibility"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Upload File */}
              <div className="ru-form-group">
                <label>Upload File</label>
                <p className="ru-file-limit">Maximum file size: 5MB</p>
                
                <div
                  className={`ru-upload-area ${dragActive ? 'ru-drag-active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  data-testid="school-dropzone-file"
                >
                  <input
                    type="file"
                    className="ru-file-input"
                    onChange={handleFileInputChange}
                    accept=".pdf,.mp4,.png,.jpg,.jpeg"
                  />
                  <div className="ru-upload-icon">⬆️</div>
                  <p className="ru-upload-text">Click to upload or drag and drop</p>
                  <p className="ru-upload-hint">PDF, Video, Image (Max 5MB)</p>
                </div>

                {formData.file && (
                  <div className="ru-file-preview">
                    <span className="ru-preview-icon">{getFileIcon(getFileType(formData.file))}</span>
                    <span className="ru-preview-name">{formData.file.name}</span>
                    <span className="ru-preview-size">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                )}

                {error && (
                  <div className="ru-error-message" data-testid="school-error-upload">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="ru-modal-footer">
              {/* <button className="ru-btn-cancel" onClick={closeModal} data-testid="school-button-cancel-upload">
                Cancel
              </button> */}
              <button 
                className="ru-btn-submit" 
                onClick={handleSubmit} 
                disabled={!formData.subject || !formData.chapter || !formData.resourceType || !formData.file}
                data-testid="school-button-submit-upload"
              >
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && resourceToDelete && (
        <div className="ru-modal-overlay" onClick={closeDeleteModal} data-testid="school-modal-delete-confirm">
          <div className="ru-delete-modal-content" onClick={e => e.stopPropagation()}>
            <div className="ru-delete-modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="ru-delete-modal-title">Delete Resource?</h3>
            <p className="ru-delete-modal-text">
              Are you sure you want to delete <strong>{resourceToDelete.fileName}</strong>? This action cannot be undone.
            </p>
            <div className="ru-delete-modal-actions">
              <button className="ru-btn-delete-cancel" onClick={closeDeleteModal} data-testid="school-button-cancel-delete">
                Cancel
              </button>
              <button className="ru-btn-delete-confirm" onClick={confirmDelete} data-testid="school-button-confirm-delete">
                Delete
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

export default ResourcesUploading;
