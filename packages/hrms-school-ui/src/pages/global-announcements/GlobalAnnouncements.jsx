import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAnnouncementUnreadCount,
  markAnnouncementsSeen,
  selectSeenAnnouncementIds,
} from '../../schoolSlice';
import CustomDropdown from './components/CustomDropdown';
import '../../assets/scss/Announcements.scss';
import { useAnnouncementsQuery } from '../../services/announcements.queries';

/** Categories always shown in the sidebar regardless of data. */
const CATEGORY_LIST = [
  'All', 'Academic', 'Administrative', 'Events',
  'Emergency', 'Class Specific', 'Achievements', 'Safety & Security',
];

/**
 * GlobalAnnouncements page component
 * Fetches announcements on mount and passes data to the UI.
 * @returns {JSX.Element} Global announcements UI
 */
const GlobalAnnouncements = () => {
  const dispatch = useDispatch();
  const seenAnnouncementIds = useSelector(selectSeenAnnouncementIds);

  // Track visible new IDs after data loads
  const visibleNewIdsRef = useRef([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [starredOnly, setStarredOnly] = useState(false);
  const [localStarred, setLocalStarred] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const { data: announcementsData = [], isLoading, isError } = useAnnouncementsQuery();

  // Compute visible new IDs when data arrives
  useEffect(() => {
    if (announcementsData.length > 0) {
      visibleNewIdsRef.current = announcementsData
        .filter((a) => a.isNew && !seenAnnouncementIds.includes(a.id))
        .map((a) => a.id);
    }
  }, [announcementsData, seenAnnouncementIds]);

  useEffect(() => {
    dispatch(setAnnouncementUnreadCount(0));
    return () => {
      dispatch(markAnnouncementsSeen(visibleNewIdsRef.current));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(CATEGORY_LIST.map((c) => [c, 0]));
    counts.All = announcementsData.length;
    announcementsData.forEach(({ category }) => {
      if (Object.prototype.hasOwnProperty.call(counts, category)) counts[category] += 1;
    });
    return counts;
  }, [announcementsData]);

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcementsData.filter(announcement => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          announcement.title.toLowerCase().includes(query) ||
          announcement.body.toLowerCase().includes(query) ||
          announcement.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Priority filter
      if (selectedPriority !== 'All Priorities') {
        if (announcement.priority !== selectedPriority.toLowerCase()) return false;
      }
      
      // Category filter
      if (selectedCategory !== 'All') {
        if (announcement.category !== selectedCategory) return false;
      }
      
      // Starred filter � merge server flag with local overrides
      const isStarred = announcement.id in localStarred ? localStarred[announcement.id] : announcement.isStarred;
      if (starredOnly && !isStarred) return false;
      
      return true;
    }).sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [searchQuery, selectedPriority, selectedCategory, starredOnly, announcementsData, localStarred]);

  // Toggle star � stored locally since we don't have a star endpoint
  const toggleStar = (id) => {
    setLocalStarred((prev) => ({ ...prev, [id]: !prev[id] }));
  };
 // Megaphone icon for all priorities (SVG)
  // const MegaphoneIcon = () => (
  //   <svg 
  //     xmlns="http://www.w3.org/2000/svg" 
  //     viewBox="0 0 24 24" 
  //     fill="white" 
  //     width="24" 
  //     height="24"
  //   >
  //     <path d="M16 4l-4 4H8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h4l4 4V4zm4 8c0 2.21-1.79 4-4 4v-2c1.1 0 2-.9 2-2s-.9-2-2-2V8c2.21 0 4 1.79 4 4z"/>
  //   </svg>
  // );
  // Megaphone icon for all priorities (white bullhorn SVG)
  const MegaphoneIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512"
      fill="white" 
      width="20" 
      height="20"
    >
      <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z"/>
    </svg>
  );

  // UI Icons (inline SVG)
  const TimeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const StarIcon = ({ filled }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );

  const UploadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 5 17 10" />
      <line x1="12" y1="5" x2="12" y2="21" />
    </svg>
  );

  // Category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'All': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
      case 'Academic': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
      case 'Administrative': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
      case 'Events': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
      case 'Emergency': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
      case 'Class Specific': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
      case 'Achievements': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
      case 'Safety & Security': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
      default: return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    }
  };

  return (
    <div className="sch-ann-page" data-testid="school-container-global-announcements">
      {/* Fixed Header Row */}
      <div className="sch-ann-header">
        <div className="sch-ann-header-text">
          <h2>Global Announcements</h2>
          <p className="sch-ann-header-subtitle">Stay updated with important school news, events, and information</p>
        </div>
        <div className="sch-ann-search-bar">
          <span className="sch-ann-search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="sch-ann-search-input"
            placeholder="Search announcements..."
            aria-label="Search announcements"
            data-testid="school-field-announcements-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Body - Contains Filters + Announcements */}
      <div className="sch-ann-body">
        {/* LEFT FILTERS - 30% */}
        <div className="sch-ann-left-filters">

          {/* Quick Filters + Priority in one container */}
          <div className="sch-ann-quick-priority-container" data-testid="school-container-quick-priority">
            <h3 className="sch-ann-filters-title">
              <span className="sch-ann-filters-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </span>
              Quick Filters
            </h3>
            <button
              className={`sch-ann-starred-toggle ${starredOnly ? 'sch-ann-active' : ''}`}
              onClick={() => setStarredOnly(!starredOnly)}
              data-testid="school-button-starred-only"
            >
              <span className="sch-ann-star-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              Starred Only
            </button>
            <label className="sch-ann-section-label">Priority</label>
            <CustomDropdown
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={["All Priorities", "Critical", "High", "Medium", "Low"]}
              id="priority-dropdown"
              testId="school-dropdown-priority"
              className="sch-ann-priority-dropdown"
            />
          </div>

          {/* Mobile Category Selector - visible only at 480px and below */}
          <button
            className="sch-ann-mobile-category-selector"
            onClick={() => setIsCategoryModalOpen(true)}
            data-testid="school-button-mobile-category-selector"
          >
            <span className="sch-ann-mobile-category-label">
              <span className="sch-ann-mobile-category-icon">{getCategoryIcon(selectedCategory)}</span>
              Category: <strong>{selectedCategory}</strong>
            </span>
            <svg className="sch-ann-mobile-category-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Categories in separate container */}
          <div className="sch-ann-categories-section" data-testid="school-container-categories">
            <h3 className="sch-ann-categories-title">Categories</h3>
            <div className="sch-ann-categories-list">
              {CATEGORY_LIST.map((category) => (
                <button
                  key={category}
                  className={`sch-ann-category-item ${selectedCategory === category ? 'sch-ann-active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`school-button-category-${category}`}
                >
                  <span className="sch-ann-category-icon">{getCategoryIcon(category)}</span>
                  <span className="sch-ann-category-label">{category}</span>
                  <span className="sch-ann-category-count">{categoryCounts[category]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ANNOUNCEMENTS - 70% */}
        <div className="sch-ann-right-announcements">
          <h2 className="sch-ann-section-title">Recent Announcements</h2>
          
          <div className="sch-ann-scroll-container">
            {filteredAnnouncements.length === 0 ? (
              <div className="sch-ann-no-announcements">
                <div className="sch-ann-no-announcements-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3>No announcements found</h3>
                <p>Try adjusting your search criteria or filters to find what you&apos;re looking for.</p>
              </div>
            ) : (
              <div className="sch-ann-list">
              {filteredAnnouncements.map((announcement) => (
                <article key={announcement.id} className="sch-ann-card">
                  {announcement.attachments?.image && (
                    <img src={announcement.attachments.image} alt="" className="sch-ann-card-image" />
                  )}
                  
                  <div className="sch-ann-card-content">
                    <div className="sch-ann-card-header">
                      <div className={`sch-ann-card-icon-badge sch-ann-icon-${announcement.priority}`}>
                        <MegaphoneIcon />
                      </div>
                      
                      <div className="sch-ann-card-header-content">
                        <div className="sch-ann-card-title-row">
                          <h3 className="sch-ann-card-title">{announcement.title}</h3>
                          <div className="sch-ann-card-actions">
                            {(() => {
                              const starred = announcement.id in localStarred ? localStarred[announcement.id] : announcement.isStarred;
                              return (
                                <button
                                  className={`sch-ann-action-btn ${starred ? 'sch-ann-starred' : ''}`}
                                  onClick={() => toggleStar(announcement.id)}
                                  aria-label="Star announcement"
                                  aria-pressed={starred}
                                  title={starred ? 'Unstar' : 'Star'}
                                  data-testid={`school-button-star-${announcement.id}`}
                                >
                                  <StarIcon filled={starred} />
                                </button>
                              );
                            })()}
                            <button className="sch-ann-action-btn" aria-label="Upload" title="Upload" data-testid={`school-button-upload-${announcement.id}`}>
                              <UploadIcon />
                            </button>
                          </div>
                        </div>
                        
                        <div className="sch-ann-card-badges">
                          <span className={`sch-ann-priority-badge sch-ann-badge-${announcement.priority}`}>
                            {announcement.priority}
                          </span>
                          <span className="sch-ann-category-badge">{announcement.category}</span>
                          <span className="sch-ann-audience-badge">{announcement.audience}</span>
                        </div>
                      </div>
                    </div>

                    <div className="sch-ann-card-body">
                      <p className="sch-ann-card-description">{announcement.body}</p>
                    </div>

                    <div className="sch-ann-card-footer">
                      <div className="sch-ann-card-meta">
                        <span className="sch-ann-meta-item">
                          <span className="sch-ann-meta-icon"><TimeIcon /></span>
                          {announcement.createdAt}
                        </span>
                        <span className="sch-ann-meta-item">
                          {`By ${announcement.postedBy}`}
                        </span>
                        <span className="sch-ann-meta-item">
                          <span className="sch-ann-meta-icon"><EyeIcon /></span>
                          {announcement.views} views
                        </span>
                      </div>
                      
                      {announcement.attachments?.pdf && (
                        <a href={announcement.attachments?.url || '#'} className="sch-ann-attachment-link" download data-testid={`school-link-attachment-${announcement.id}`}>
                          <span className="sch-ann-attachment-icon"><DownloadIcon /></span>
                          {announcement.attachments.pdf}
                        </a>
                      )}
                    </div>

                    {/* Hashtags at the bottom */}
                    <div className="sch-ann-card-tags">
                      {announcement.tags.map((tag, index) => (
                        <span key={index} className="sch-ann-tag">{tag}</span>
                      ))}
                    </div>
                    {announcement.isNew && visibleNewIdsRef.current.includes(announcement.id) && (
                      <span className="sch-ann-new-badge" data-testid={`school-badge-new-${announcement.id}`}>New</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Mobile Category Bottom Sheet Modal */}
      {isCategoryModalOpen && (
        <div
          className="sch-ann-category-modal-overlay"
          onClick={() => setIsCategoryModalOpen(false)}
          data-testid="school-overlay-category-modal"
        >
          <div
            className="sch-ann-category-modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="school-modal-category"
          >
            <div className="sch-ann-category-modal-header">
              <h3>Select Category</h3>
              <button
                className="sch-ann-category-modal-close"
                onClick={() => setIsCategoryModalOpen(false)}
                data-testid="school-button-close-category-modal"
                aria-label="Close category modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="sch-ann-category-modal-list">
              {CATEGORY_LIST.map((category) => (
                <button
                  key={category}
                  className={`sch-ann-category-modal-item ${selectedCategory === category ? 'sch-ann-active' : ''}`}
                  onClick={() => { setSelectedCategory(category); setIsCategoryModalOpen(false); }}
                  data-testid={`school-button-modal-category-${category}`}
                >
                  <span className="sch-ann-category-icon">{getCategoryIcon(category)}</span>
                  <span className="sch-ann-category-label">{category}</span>
                  <span className="sch-ann-category-count">{categoryCounts[category]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalAnnouncements;