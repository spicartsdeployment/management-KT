import React, { useState, useCallback, useMemo } from 'react';
import '../../Assets/styles/Announcements.scss';
import ManagementPageHeader from '../../app/components/common/ManagementPageHeader';
import {
  ANNOUNCEMENT_TYPES,
  PRIORITY_LEVELS,
  DELIVERY_CHANNELS,
  AUDIENCE_SEGMENTS,
  ANNOUNCEMENT_TEMPLATES,
  TEST_RECIPIENTS,
} from './announcementsMockData';

// Helper Functions
const formatDateForInput = (date) => date.toISOString().slice(0, 16);
const calcRecipientCount = (selections) => selections.reduce((acc, sel) => acc + (sel.count || 0), 0);
const getTypeConfig = (typeId) => ANNOUNCEMENT_TYPES.find((t) => t.id === typeId) || {};
const getPriorityConfig = (priorityId) => PRIORITY_LEVELS.find((p) => p.id === priorityId) || {};

// UI Components
const Toast = ({ message, type = 'success' }) => (
  <div className={`an-toast an-toast--${type}`} data-testid="school-toast-announcement">
    {type === 'success' && '✓ '}
    {type === 'error' && '✕ '}
    {type === 'warning' && '⚠ '}
    {message}
  </div>
);

const PreviewModal = ({ type, data, onClose }) => (
  <div className="an-modal-backdrop" data-testid="school-modal-an-preview">
    <div className="an-modal an-modal--lg">
      <div className="an-modal__header">
        <h2 className="an-modal__title">Preview - {type === 'desktop' ? 'Desktop' : type === 'mobile' ? 'Mobile' : 'Parent App'}</h2>
        <button className="an-modal__close" onClick={onClose} data-testid="school-button-modal-close">×</button>
      </div>
      <div className="an-modal__body">
        <div className="an-preview-card">
          <div className="an-preview-card__content">
            <div className="an-preview-card__subject">{data.title}</div>
            <div className="an-preview-card__body">{data.description || data.summary}</div>
            <div className="an-text--muted">
              {data.channels?.join(', ')} • {new Date(data.scheduledDate).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <div className="an-modal__footer">
        <button className="an-btn an-btn--ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

const SchedulingModal = ({ announcement, onClose, onSchedule }) => {
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState(formatDateForInput(new Date()));
  const [expiryDate, setExpiryDate] = useState(formatDateForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));

  return (
    <div className="an-modal-backdrop" data-testid="school-modal-an-schedule">
      <div className="an-modal">
        <div className="an-modal__header">
          <h2 className="an-modal__title">Schedule Announcement</h2>
          <button className="an-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="an-modal__body">
          <div className="an-form-grid an-form-grid__full">
            <div className="an-field">
              <label className="an-field__label">Schedule Type</label>
              <select className="an-field__select" value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} data-testid="school-dropdown-an-schedule-type">
                <option value="immediate">Publish Immediately</option>
                <option value="scheduled">Schedule for Later</option>
                <option value="recurring">Recurring Announcement</option>
              </select>
            </div>
            {scheduleType !== 'immediate' && (
              <>
                <div className="an-field">
                  <label className="an-field__label">Publish Date & Time</label>
                  <input type="datetime-local" className="an-field__input" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} data-testid="school-input-an-scheduled-date" />
                </div>
                <div className="an-field">
                  <label className="an-field__label">Expiry Date & Time</label>
                  <input type="datetime-local" className="an-field__input" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} data-testid="school-input-an-expiry-date" />
                </div>
              </>
            )}
          </div>
          <div className="an-info-box">
            <h3 className="an-section-title--lg">Schedule Timeline</h3>
            <div className="an-schedule-timeline">
              <div className="an-schedule-item">
                <div><div className="an-schedule-item__label">Status</div><div className="an-schedule-item__value">Draft</div></div>
              </div>
              <div className="an-schedule-item">
                <div><div className="an-schedule-item__label">Schedule</div><div className="an-schedule-item__value">{scheduleType === 'immediate' ? 'Immediate' : new Date(scheduledDate).toLocaleString()}</div></div>
              </div>
              <div className="an-schedule-item">
                <div><div className="an-schedule-item__label">Expires</div><div className="an-schedule-item__value">{new Date(expiryDate).toLocaleString()}</div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="an-modal__footer">
          <button className="an-btn an-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="an-btn an-btn--primary" onClick={() => onSchedule({ scheduleType, scheduledDate, expiryDate })} data-testid="school-button-schedule-announcement">Schedule</button>
        </div>
      </div>
    </div>
  );
};

const AudienceModal = ({ onClose, onApply }) => {
  const [selectedAudience, setSelectedAudience] = useState({
    students: [],
    parents: [],
    staff: [],
  });

  return (
    <div className="an-modal-backdrop" data-testid="school-modal-an-audience">
      <div className="an-modal an-modal--lg">
        <div className="an-modal__header">
          <h2 className="an-modal__title">Select Audience</h2>
          <button className="an-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="an-modal__body">
          <div className="an-tabs">
            {['Students', 'Parents', 'Staff'].map((tab) => (
              <button key={tab} className="an-tab an-tab--active" data-testid={`school-tab-audience-${tab.toLowerCase()}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="an-form-grid an-form-grid__full">
            {AUDIENCE_SEGMENTS.students.map((seg) => (
              <label key={seg.id} className="an-flex-row-gap-sm" style={{ alignItems: 'center', fontSize: '0.875rem' }} data-testid={`school-checkbox-audience-${seg.id}`}>
                <input type="checkbox" />
                {seg.label} {seg.group && <span className="an-text--muted" style={{ fontSize: '0.7rem' }}>({seg.group})</span>}
              </label>
            ))}
          </div>
        </div>
        <div className="an-modal__footer">
          <button className="an-btn an-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="an-btn an-btn--primary" onClick={() => onApply(selectedAudience)} data-testid="school-button-apply-audience">Apply Selection</button>
        </div>
      </div>
    </div>
  );
};

/**
 * CreateAnnouncement - compose and publish a new announcement
 */
export default function CreateAnnouncement() {
  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  // Audience State
  const [selectedAudience, setSelectedAudience] = useState({
    students: [],
    parents: [],
    staff: [],
  });

  // Delivery State
  const [channels, setChannels] = useState(DELIVERY_CHANNELS.map((c) => ({ ...c })));

  // Scheduling State
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState(formatDateForInput(new Date()));

  // Attachments State
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // UI State
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('composer');

  // Event Handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    files.forEach((file) => {
      setAttachments((prev) => [...prev, { id: Math.random(), name: file.name, size: file.size, file }]);
    });
    showToast('Files added successfully', 'success');
  }, []);

  const handleAddTag = useCallback(() => {
    if (currentTag.trim()) {
      setTags((prev) => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  }, [currentTag]);

  const handleRemoveTag = useCallback((index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleChannelToggle = useCallback((channelId) => {
    setChannels((prev) => prev.map((ch) => (ch.id === channelId ? { ...ch, selected: !ch.selected } : ch)));
  }, []);

  const handlePublish = useCallback(() => {
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    showToast('Announcement published successfully!', 'success');
  }, [title, description]);

  const handleSaveDraft = useCallback(() => {
    showToast('Announcement saved as draft', 'success');
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const typeConfig = getTypeConfig(category);
  const priorityConfig = getPriorityConfig(priority);
  const totalRecipients = selectedAudience.students.length + selectedAudience.parents.length + selectedAudience.staff.length;
  const selectedChannels = channels.filter((c) => c.selected);

  return (
    <div className="an-root" data-testid="school-page-announcements">
      <ManagementPageHeader
        breadcrumbs={[
          { label: 'Management' },
          { label: 'Announcements' },
          { label: 'Create' },
        ]}
        title="Create Announcement"
        subtitle="Compose, target, and publish communications to your school community"
      />

      {/* Tabs */}
      <div className="an-tabs" data-testid="school-tabs-announcement">
        {['Composer', 'Audience', 'Delivery', 'Scheduling', 'Attachments', 'Preview'].map((tab) => (
          <button
            key={tab}
            className={`an-tab ${activeTab === tab.toLowerCase() ? 'an-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
            data-testid={`school-tab-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* COMPOSER TAB */}
      {activeTab === 'composer' && (
        <>
          {/* Announcement Composer Section */}
          <div className="an-section" data-testid="school-section-composer">
            <div className="an-section-header">
              <span className="an-section__title">📝 Announcement Composer</span>
            </div>
            <p className="an-section__subtitle" style={{ margin: '0 0 1rem 0' }}>
              Create and format your announcement message
            </p>

            <div className="an-form-grid">
              {/* Title */}
              <div className="an-form-grid__full">
                <div className="an-field">
                  <label className="an-field__label">Announcement Title *</label>
                  <input
                    type="text"
                    className="an-field__input"
                    placeholder="e.g., Annual Day 2026 Announcement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="school-input-an-title"
                  />
                </div>
              </div>

              {/* Category & Priority */}
              <div className="an-field">
                <label className="an-field__label">Category</label>
                <select className="an-field__select" value={category} onChange={(e) => setCategory(e.target.value)} data-testid="school-dropdown-an-category">
                  {ANNOUNCEMENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="an-field">
                <label className="an-field__label">Priority Level</label>
                <select className="an-field__select" value={priority} onChange={(e) => setPriority(e.target.value)} data-testid="school-dropdown-an-priority">
                  {PRIORITY_LEVELS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              <div className="an-form-grid__full">
                <div className="an-field">
                  <label className="an-field__label">Short Summary</label>
                  <input
                    type="text"
                    className="an-field__input"
                    placeholder="Brief summary (shown in notifications)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    data-testid="school-input-an-summary"
                  />
                  <span className="an-field__helper">{summary.length}/150 characters</span>
                </div>
              </div>

              {/* Description */}
              <div className="an-form-grid__full">
                <div className="an-field">
                  <label className="an-field__label">Full Description *</label>
                  <textarea
                    className="an-field__textarea"
                    placeholder="Enter announcement details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="school-input-an-description"
                    style={{ minHeight: '150px' }}
                  />
                  <span className="an-field__helper">{description.length} characters</span>
                </div>
              </div>

              {/* Tags */}
              <div className="an-form-grid__full">
                <div className="an-field">
                  <label className="an-field__label">Tags / Labels</label>
                  <div className="an-flex-row-gap-sm">
                    <input
                      type="text"
                      className="an-field__input"
                      placeholder="Add tag and press Enter"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      data-testid="school-input-an-tag"
                    />
                    <button className="an-btn an-btn--sm an-btn--primary" onClick={handleAddTag} data-testid="school-button-add-tag">
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="an-chip-group">
                      {tags.map((tag, idx) => (
                        <div key={idx} className="an-chip">
                          {tag}
                          <span className="an-chip__remove" onClick={() => handleRemoveTag(idx)}>
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AUDIENCE TAB */}
      {activeTab === 'audience' && (
        <div className="an-section" data-testid="school-section-audience">
          <div className="an-section-header" style={{ justifyContent: 'space-between' }}>
            <span className="an-section__title">👥 Audience Targeting</span>
            <button className="an-btn an-btn--sm an-btn--primary" onClick={() => setModal('audience')} data-testid="school-button-select-audience">
              Select Audience
            </button>
          </div>
          {totalRecipients === 0 ? (
            <div className="an-empty">
              <div className="an-empty__icon">👥</div>
              <h3 className="an-empty__title">No audience selected</h3>
              <p className="an-empty__desc">Click above to select recipients for this announcement</p>
            </div>
          ) : (
            <div className="an-audience-summary">
              <div className="an-audience-summary__item">
                <span className="an-audience-summary__label">Students</span>
                <span className="an-audience-summary__count">{selectedAudience.students.length}</span>
              </div>
              <div className="an-audience-summary__item">
                <span className="an-audience-summary__label">Parents</span>
                <span className="an-audience-summary__count">{selectedAudience.parents.length}</span>
              </div>
              <div className="an-audience-summary__item">
                <span className="an-audience-summary__label">Staff</span>
                <span className="an-audience-summary__count">{selectedAudience.staff.length}</span>
              </div>
              <div className="an-audience-summary__divider" data-testid="school-item-audience-summary-total">
                <span className="an-audience-summary__label">Total Recipients</span>
                <span className="an-audience-summary__count">{totalRecipients}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DELIVERY TAB */}
      {activeTab === 'delivery' && (
        <div className="an-section" data-testid="school-section-delivery">
          <span className="an-section__title">📨 Delivery Channels</span>
          <p className="an-section__subtitle" style={{ margin: '0 0 1rem 0' }}>
            Select channels through which this announcement will be delivered
          </p>

          <div className="an-form-grid an-form-grid__full" data-testid="school-list-delivery-channels">
            {channels.map((ch) => (
              <label
                key={ch.id}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'var(--an-input)',
                  borderRadius: 'var(--an-radius-sm)',
                  cursor: 'pointer',
                }}
                data-testid={`school-checkbox-channel-${ch.id}`}
              >
                <input type="checkbox" checked={ch.selected} onChange={() => handleChannelToggle(ch.id)} />
                <span className="an-icon--md">{ch.icon}</span>
                <span className="an-text--muted" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{ch.label}</span>
              </label>
            ))}
          </div>

          <div className="an-info-box">
            <p className="an-info-box__text">
              <strong>Selected Channels:</strong> {selectedChannels.length > 0 ? selectedChannels.map((c) => c.label).join(', ') : 'None'}
            </p>
          </div>
        </div>
      )}

      {/* SCHEDULING TAB */}
      {activeTab === 'scheduling' && (
        <div className="an-section" data-testid="school-section-scheduling">
          <span className="an-section__title">📅 Scheduling</span>
          <div className="an-form-grid an-form-grid__full">
            <div className="an-field">
              <label className="an-field__label">Schedule Type</label>
              <select className="an-field__select" value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} data-testid="school-dropdown-schedule-type">
                <option value="immediate">Publish Immediately</option>
                <option value="scheduled">Schedule for Later</option>
                <option value="recurring">Recurring Announcement</option>
              </select>
            </div>
            {scheduleType !== 'immediate' && (
              <div className="an-field">
                <label className="an-field__label">Publish Date & Time</label>
                <input type="datetime-local" className="an-field__input" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} data-testid="school-input-scheduled-date" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ATTACHMENTS TAB */}
      {activeTab === 'attachments' && (
        <div className="an-section" data-testid="school-section-attachments">
          <span className="an-section__title">📎 Attachments</span>
          <p className="an-section__subtitle" style={{ margin: '0 0 1rem 0' }}>
            Drag and drop files or click to upload (PDF, Images, Videos up to 50MB)
          </p>

          <div
            className={`an-upload-area${dragActive ? ' an-upload-area--active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            data-testid="school-dropzone-attachments"
          >
            <div className="an-upload-area__icon">📁</div>
            <p className="an-upload-area__text">Drag files here or click to browse</p>
            <p className="an-upload-area__subtext">Supported: PDF, JPG, PNG, MP4, DOC, XLS</p>
          </div>

          {attachments.length > 0 && (
            <>
              <h3 className="an-section-title--lg">Uploaded Files ({attachments.length})</h3>
              <div className="an-attachment-list" data-testid="school-list-attachments">
                {attachments.map((att) => (
                  <div key={att.id} className="an-attachment-card">
                    <span className="an-attachment-card__icon">📄</span>
                    <div className="an-attachment-card__info">
                      <div className="an-attachment-card__name">{att.name}</div>
                      <div className="an-attachment-card__size">{(att.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button
                      className="an-attachment-card__remove"
                      onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                      data-testid={`school-button-remove-attachment-${att.id}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="an-preview-container" data-testid="school-section-preview">
          <div className="an-preview-card">
            <div className="an-preview-card__title">Desktop Preview</div>
            <div className="an-preview-card__content">
              <div className="an-preview-card__subject">{title || 'Announcement Title'}</div>
              <div className="an-preview-card__body">{description || 'Your announcement content will appear here...'}</div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedChannels.map((c) => (
                  <span key={c.id} style={{ fontSize: '0.7rem', background: 'rgba(201, 169, 98, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '999px', color: 'var(--an-text)' }}>
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="an-preview-card">
            <div className="an-preview-card__title">Mobile Preview</div>
            <div className="an-preview-card__content">
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--an-text)' }}>{title || 'Title'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--an-muted)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                {summary || 'Summary will appear here...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '1.5rem', background: 'var(--an-surface)', borderTop: '1px solid var(--an-line)', marginLeft: '-1.75rem', marginRight: '-1.75rem', marginBottom: '-1.75rem', borderBottomLeftRadius: 'var(--an-radius)', borderBottomRightRadius: 'var(--an-radius)' }} data-testid="school-footer-actions">
        <button className="an-btn an-btn--ghost" onClick={() => console.log('cancel')} data-testid="school-button-cancel">
          Cancel
        </button>
        <button className="an-btn an-btn--ghost" onClick={handleSaveDraft} data-testid="school-button-save-draft">
          💾 Save Draft
        </button>
        <button className="an-btn an-btn--primary" onClick={() => setModal('preview')} data-testid="school-button-preview">
          👁 Preview
        </button>
        <button className="an-btn an-btn--primary" onClick={() => setModal('schedule')} data-testid="school-button-schedule">
          📅 Schedule
        </button>
        <button className="an-btn an-btn--success" onClick={handlePublish} data-testid="school-button-publish" style={{ marginLeft: 'auto' }}>
          🚀 Publish Now
        </button>
      </div>

      {/* Modals */}
      {modal === 'schedule' && <SchedulingModal announcement={{ title, description, channels: selectedChannels.map((c) => c.label) }} onClose={() => setModal(null)} onSchedule={(data) => { showToast('Announcement scheduled successfully!', 'success'); setModal(null); }} />}
      {modal === 'preview' && <PreviewModal type="desktop" data={{ title, description, summary, channels: selectedChannels.map((c) => c.label), scheduledDate }} onClose={() => setModal(null)} />}
      {modal === 'audience' && <AudienceModal onClose={() => setModal(null)} onApply={(aud) => { setSelectedAudience(aud); setModal(null); showToast('Audience selected', 'success'); }} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="create-announcement__main">
        <div className="create-announcement__form">
          <div className="create-announcement__card" style={{ padding: '1.5rem' }}>
            <h3 className="create-announcement__card-title">📄 Announcement Details</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'white' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#374151' }}>Title *</label>
                <input placeholder="Enter announcement title" style={{ width: '100%', background: 'none', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxSizing: 'border-box' }} data-testid="school-field-announcement-title" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#374151' }}>Message *</label>
                <textarea rows={5} placeholder="Write your announcement..." style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'none', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical', boxSizing: 'border-box' }} data-testid="school-field-announcement-message" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#374151' }}>Category</label>
                <select style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} data-testid="school-dropdown-announcement-category">
                  <option value="">Select category</option>
                  <option>Academic</option><option>Holiday</option><option>Exam</option><option>Event</option>
                </select>
              </div>
            </div>
          </div>

          <div className="create-announcement__card" style={{ padding: '1.5rem' }}>
            <h3 className="create-announcement__card-title">📎 Attachments</h3>
            <div className="create-announcement__upload" style={{ marginTop: '1rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>📁 Click to upload or drag and drop files here</p>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>PDF, DOC, PNG up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="create-announcement__sidebar">
          <div className="create-announcement__sidebar-card" style={{ padding: '1.5rem' }}>
            <h3 className="create-announcement__sidebar-title">🎯 Audience</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['All Students', 'All Teachers', 'All Parents', 'Specific Class'].map(aud => (
                <div key={aud} className="create-announcement__sidebar-section">
                  <label style={{ fontSize: '0.875rem' }}>{aud}</label>
                  <input type="checkbox" data-testid={`school-field-audience-${aud.toLowerCase().replace(/\s/g, '-')}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="create-announcement__sidebar-card" style={{ padding: '1.5rem' }}>
            <h3 className="create-announcement__sidebar-title">🗓 Schedule</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', color: '#374151' }}>Publish Date</label>
              <input type="date" style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', background: 'none', borderRadius: '0.5rem' }} data-testid="school-field-announcement-date" />
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="create-announcement__publish-btn" style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }} data-testid="school-button-announcement-publish">Publish</button>
              <button className="create-announcement__draft-btn" style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', cursor: 'pointer' }} data-testid="school-button-announcement-draft">Save as Draft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
