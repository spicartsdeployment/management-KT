import React, { useState, useMemo } from 'react';
import '../../assets/scss/CommunityForum.scss';
import { PaperClipIcon, FaceSmileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useCommunityForumQuery } from '../../services/communityForum.queries';
import PageLoader from '../../components/PageLoader';

/** Category definitions � always shown regardless of available posts. */
const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case 'All':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'Academic Support':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'Events & Activities':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m6.08 0l4.24 4.24" />
        </svg>
      );
    case 'Health & Nutrition':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      );
    case 'School Updates':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l-9 5v10a7 7 0 0 0 9 7 7 7 0 0 0 9-7v-10z" />
        </svg>
      );
    case 'Volunteer Opportunities':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
};

const BASE_CATEGORIES = [
  { name: 'All' },
  { name: 'Academic Support' },
  { name: 'Events & Activities' },
  { name: 'Health & Nutrition' },
  { name: 'School Updates' },
  { name: 'Volunteer Opportunities' },
];


const CommunityForum = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useCommunityForumQuery();

  const posts = data?.posts ?? [];
  const dashboardStats = data?.stats ?? { totalPosts: 0, activeMembers: 0, trendingTopics: 0, responseRate: 0 };
  const summaryData = data?.summary ?? { members: 0 };

  // Categories � static list, counts derived from loaded posts
  const categories = useMemo(() => BASE_CATEGORIES.map((cat) => ({
    ...cat,
    count: cat.name === 'All' ? posts.length : posts.filter((p) => p.category === cat.name).length,
    members: summaryData.members,
  })), [posts, summaryData.members]);

  // Summary stats
  const stats = [
    { 
      label: 'Total Posts', 
      value: dashboardStats.totalPosts,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'steelblue' 
    },
    { 
      label: 'Active Members', 
      value: dashboardStats.activeMembers,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'forestgreen' 
    },
    { 
      label: 'Trending Topics', 
      value: dashboardStats.trendingTopics,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'rebeccapurple' 
    },
    { 
      label: 'Response Rate', 
      value: `${dashboardStats.responseRate}%`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'red' 
    }
  ];

  // Filter posts by category
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Local save-toggle state (post.saved from API is the initial value)
  const [savedPostIds, setSavedPostIds] = useState(() => new Set(
    posts.filter((p) => p.saved).map((p) => p.id)
  ));

  const handleToggleSave = (postId) => {
    setSavedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  // Toggle saved status
  const [activeView, setActiveView] = useState('posts'); // 'posts' or 'chat'
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Sarah M.',
      initials: 'SM',
      role: 'Parent',
      message: 'Anyone have recommendations for algebra tutors?',
      time: '10:23 AM',
      isMine: false,
      delivered: true,
      seen: true
    },
    {
      id: 2,
      sender: 'Michael R.',
      initials: 'MR',
      role: 'Parent',
      message: 'I can recommend Mr. Peterson. He\'s excellent!',
      time: '10:25 AM',
      isMine: false,
      delivered: true,
      seen: true
    },
    {
      id: 3,
      sender: 'You',
      initials: 'ME',
      role: 'Parent',
      message: 'Thanks! I\'ll reach out to him.',
      time: '10:27 AM',
      isMine: true,
      delivered: true,
      seen: false
    }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const now = new Date();
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'You',
      initials: 'ME',
      role: 'Parent',
      message: chatMessage,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      delivered: true,
      seen: false
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get committee badge color
  const getCommitteeColor = (committee) => {
    const colors = {
      'Parent': 'parent',
      'Teacher': 'teacher',
      'Student': 'student',
      'Staff': 'staff'
    };
    return colors[committee] || 'default';
  };

  // Loading UI
  if (isLoading) {
    return <PageLoader title="Loading Community Forum" subtitle="Fetching discussions..." icon="🗣️" />;
  }

  return (
    <div className="sch-com-forum" data-testid="school-container-community-forum">
      {/* Header */}
      <div className="sch-com-forum-header">
        <div className="sch-com-forum-header-content">
          <h1 className="sch-com-forum-title">Community Forum</h1>
          <p className="sch-com-forum-subtitle">Connect, share ideas, and stay updated with posts and live chat</p>
        </div>
        <button className="sch-cf-new-post-btn" data-testid="school-button-new-post">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          + New Post
        </button>
      </div>

      {/* ROW 1 - Summary Cards */}
      <div className="sch-cf-summary-cards" data-testid="school-container-summary-cards">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`sch-cf-summary-card ${stat.color}`}
            data-testid={`school-card-stat-${index}`}
          >

            <div className="sch-cf-card-content">
              <span className="sch-cf-card-label">{stat.label}</span>
              <div className="sch-cf-card-value">{stat.value}</div>
            </div>
            <div className="sch-cf-card-icon-wrapper">
              <span className="sch-cf-card-icon">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2 - Search & Heading */}
      <div className="sch-cf-search-heading-row" data-testid="school-container-search-row">
        <div className="sch-cf-search-container">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="sch-cf-search-input"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="school-field-search"
              style={{ paddingLeft: '2.5rem' }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="7" stroke="#6b7280" strokeWidth="2" />
                <line x1="15.5" y1="15.5" x2="12.5" y2="12.5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
        <div className="sch-cf-posts-heading" data-testid="school-heading-posts">
          <div className="sch-cf-view-tabs" data-testid="school-tabs-view">
            <button
              className={`sch-cf-view-tab ${activeView === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveView('posts')}
              data-testid="school-tab-posts"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sch-cf-tab-icon">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Posts & Alerts
            </button>
            {/* <button
              className={`sch-cf-view-tab ${activeView === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveView('chat')}
              data-testid="school-tab-chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sch-cf-tab-icon">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Live Chat
            </button> */}
          </div>
        </div>
      </div>

      {/* ROW 3 - Categories + Posts OR Live Chat */}
      <div className="sch-cf-main-content-row" data-testid="school-container-main-content">
        {/* Left Side - Categories and About (Fixed) */}
        <div className="sch-cf-left-sidebar">
          {/* Categories Panel */}
          <div className="sch-cf-categories-panel" data-testid="school-panel-categories">
            <h3 className="sch-cf-categories-title">Categories</h3>
            <div className="sch-cf-categories-list">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`sch-cf-category-btn ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                  data-testid={`school-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="sch-cf-category-info">
                    <span className="sch-cf-category-icon">{getCategoryIcon(category.name)}</span>
                    <div className="sch-cf-category-text">
                      <span className="sch-cf-category-name">{category.name}</span>
                      <span className="sch-cf-category-members">{category.members} members</span>
                    </div>
                  </div>
                  <span className="sch-cf-category-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* About All Section */}
          <div className="sch-cf-about-panel" data-testid="school-panel-about">
            <h4 className="sch-cf-about-title">About All</h4>
            <p className="sch-cf-about-description"> View all posts and discussions

            </p>
            <div className="sch-cf-about-stats">
              <div className="sch-cf-stat-content">
                <span className="sch-cf-about-stat-label">Total Posts</span>
                <span className="sch-cf-about-stat-value">{summaryData.totalPosts}</span>
              </div>
              <div className="sch-cf-stat-content">
                <span className="sch-cf-about-stat-label">Members</span>
                <span className="sch-cf-about-stat-value">{summaryData.members}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 75% - Content (Switches between Posts and Live Chat) */}
        {activeView === 'posts' ? (
          <div className="sch-cf-posts-panel" data-testid="school-panel-posts">
            <div className="sch-cf-posts-container">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="sch-com-post-card"
                    data-testid={`school-post-${post.id}`}
                  >
                    <div className="sch-com-post-header">
                      <div className="sch-com-post-author-section">
                        <div className="author-avatar">
                          {post.authorInitials}
                        </div>
                        <div className="sch-com-post-meta">
                          <div className="sch-com-post-title-row">
                            {post.pinned && (
                              <span className="pin-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2L8 6H4v4l4 4v6a1 1 0 001 1h6a1 1 0 001-1v-6l4-4V6h-4l-4-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 11v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                              </span>
                            )}
                            {post.audience === 'Alert' && (
                              <span className="alert-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Alert
                              </span>
                            )}
                            <h3 className="sch-com-post-title">{post.title}</h3>
                          </div>
                          <div className="sch-com-post-info">
                            <span className="sch-com-post-author">{post.author}</span>
                            <span className="separator">�</span>
                            <span className={`committee-badge ${getCommitteeColor(post.committee)}`}>
                              {post.committee}
                            </span>
                          
                            <span className="separator">�</span>
                            <span className="sch-com-post-time">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              {post.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sch-com-post-content">
                      <p className="sch-com-post-description">{post.description}</p>
                    </div>

                    <div className="sch-com-post-actions">
                      <div className="action-stats">
                        <button className="action-btn" data-testid={`school-button-like-${post.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="action-icon">
                            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="action-count">{post.likes}</span>
                        </button>
                        <button className="action-btn" data-testid={`school-button-comment-${post.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="action-icon">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="action-count">{post.comments}</span>
                        </button>
                        <button className="action-btn" data-testid={`school-button-view-${post.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="action-icon">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="action-count">{post.views}</span>
                        </button>
                      </div>
                      <div className="action-buttons">
                        <button
                          className={`save-btn ${savedPostIds.has(post.id) ? 'saved' : ''}`}
                          data-testid={`school-button-save-${post.id}`}
                          onClick={() => handleToggleSave(post.id)}
                        >
                          {savedPostIds.has(post.id) ? '??' : '??'}
                        </button>
                        <button className="upload-btn" data-testid={`school-button-upload-${post.id}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="upload-icon">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button className="reply-btn" data-testid={`school-button-reply-${post.id}`}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-posts" data-testid="school-message-no-posts">
                  <p>No posts found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Live Chat View */
          <div className="live-chat-container" data-testid="school-container-live-chat">
            {/* Chat Header */}
            <div className="chat-header" data-testid="school-header-chat">
              <div className="chat-header-left">
                <div className="chat-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="chat-info">
                  <h3 className="chat-title">All Chat</h3>
                  <p className="chat-members">4 members online</p>
                </div>
              </div>
              <div className="chat-status">
                <span className="status-badge live">Live</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages-container" data-testid="school-container-messages">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${msg.isMine ? 'mine' : 'theirs'}`}
                  data-testid={`school-message-${msg.id}`}
                >
                  {!msg.isMine && (
                    <div className="message-avatar">
                      <span className="avatar-initials">{msg.initials}</span>
                    </div>
                  )}
                  <div className="message-content">
                    {!msg.isMine && (
                      <div className="message-sender">
                        <span className="sender-name">{msg.sender}</span>
                        <span className="sender-role">{msg.role}</span>
                      </div>
                    )}
                    <div className="message-bubble">
                      <p className="message-text">{msg.message}</p>
                    </div>
                    <div className="message-footer">
                      <span className="message-time">{msg.time}</span>
                      {msg.isMine && (
                        <span className="message-status">
                          {msg.seen ? (
                            <span className="status-icon seen">??</span>
                          ) : msg.delivered ? (
                            <span className="status-icon delivered">??</span>
                          ) : (
                            <span className="status-icon sent">?</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Footer */}
            <div className="chat-input-container" data-testid="school-container-input">
              <button className="input-action-btn" data-testid="school-button-attach">
                <PaperClipIcon className="action-icon" />
              </button>
              <button className="input-action-btn" data-testid="school-button-emoji">
                <FaceSmileIcon className="action-icon" />
              </button>
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="school-field-chat-message"
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                data-testid="school-button-send"
              >
                <PaperAirplaneIcon className="send-icon" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;
