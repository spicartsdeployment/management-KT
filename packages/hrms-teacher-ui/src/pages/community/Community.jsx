import React, { useState } from 'react';
// import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Community.scss';

const Community = () => {
  const [activeTab, setActiveTab] = useState('all-posts'); // 'all-posts' | 'my-groups' | 'announcements' | 'resources' | 'invites'
  const [activeFilter, setActiveFilter] = useState('Category'); // For All Posts tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null); // For group detail view
  const [setSelectedAnnouncement] = useState(null); // For announcement modal

  // Invites tab state
  const [inviteView, setInviteView] = useState('received'); // 'received' | 'sent'

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([]); // Track invited users (stores user IDs)

  // File type fiter states for Resources tab
  const [selectedFileType, setSelectedFileType] = useState('All Types');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');

  // Mock data for members (for invite modal)
  const [mockAllMembers] = useState([
    { id: 1, name: 'David Chen', role: 'Math Teacher', avatar: 'DC' },
    { id: 2, name: 'Ms. Priya Sharma', role: 'English Teacher', avatar: 'PS' },
    { id: 3, name: 'Mr. John Mitchell', role: 'PE Teacher', avatar: 'JM' },
    { id: 4, name: 'Dr. Meera Patel', role: 'Biology Teacher', avatar: 'MP' },
    { id: 5, name: 'Mr. Ahmed Khan', role: 'Computer Science Teacher', avatar: 'AK' },
    { id: 6, name: 'Ms. Anjali Gupta', role: 'History Teacher', avatar: 'AG' },
    { id: 7, name: 'Mr. Rahul Kumar', role: 'Cultural Coordinator', avatar: 'RK' },
    { id: 8, name: 'Dr. Sarah Williams', role: 'Science Teacher', avatar: 'SW' },
    { id: 9, name: 'Ms. Lisa Rodriguez', role: 'Language Arts Teacher', avatar: 'LR' },
    { id: 10, name: 'Mr. James Patterson', role: 'Chemistry Lab Head', avatar: 'JP' },
    { id: 11, name: 'Ms. Emma Watson', role: 'Counselor', avatar: 'EW' },
    { id: 12, name: 'Mr. Chris Evans', role: 'Physics Teacher', avatar: 'CE' }
  ]);
  // Mock data for posts
  const [posts] = useState([
    {
      id: 1,
      author: 'Dr. Sarah Williams',
      authorInitials: 'SW',
      role: 'Science Teacher',
      timeAgo: '2 hours ago',
      title: 'Ideas for Science Week Exhibitions',
      content: 'Looking for creative ideas to make our Science Week more engaging for students. Has anyone tried interactive demonstrations or virtual labs? Would love to hear your experiences and suggestions!',
      likes: 24,
      comments: 12
    },
    {
      id: 2,
      author: 'Mr. Rahul Kumar',
      authorInitials: 'RK',
      role: 'Cultural Coordinator',
      timeAgo: '5 hours ago',
      title: 'Looking for Volunteers for Annual Day Events',
      content: 'We need enthusiastic volunteers for organizing our Annual Day celebration. Areas include stage setup, student coordination, and technical support. Please reply if interested!',
      likes: 18,
      comments: 8
    },
    {
      id: 3,
      author: 'Ms. Priya Sharma',
      authorInitials: 'PS',
      role: 'English Teacher',
      timeAgo: '1 day ago',
      title: 'New Grammar Resources Available',
      content: 'Just uploaded comprehensive grammar worksheets for grades 9-12. These include practice exercises, answer keys, and teaching notes. Perfect for exam preparation!',
      likes: 31,
      comments: 15
    },
    {
      id: 4,
      author: 'Mr. David Chen',
      authorInitials: 'DC',
      role: 'Math Teacher',
      timeAgo: '1 day ago',
      title: 'Interactive Math Tools Discussion',
      content: 'Has anyone used GeoGebra for teaching geometry? Looking for tips on integrating digital tools into traditional classroom settings.',
      likes: 12,
      comments: 6
    },
    {
      id: 5,
      author: 'Ms. Anjali Gupta',
      authorInitials: 'AG',
      role: 'History Teacher',
      timeAgo: '2 days ago',
      title: 'Field Trip to National Museum - Join Us!',
      content: 'Planning a field trip to the National Museum next month for classes 8-10. If you\'re interested in joining with your class, please let me know by next week.',
      likes: 28,
      comments: 11
    },
    {
      id: 6,
      author: 'Mr. John Mitchell',
      authorInitials: 'JM',
      role: 'PE Teacher',
      timeAgo: '2 days ago',
      title: 'Annual Sports Day Preparations',
      content: 'Sports Day is scheduled for next month! We need volunteers for organizing events, managing teams, and coordinating with vendors. Your support would be greatly appreciated.',
      likes: 22,
      comments: 9
    },
    {
      id: 7,
      author: 'Dr. Meera Patel',
      authorInitials: 'MP',
      role: 'Biology Teacher',
      timeAgo: '3 days ago',
      title: 'Science Lab Safety Training',
      content: 'Reminder: Mandatory lab safety training session this Friday at 3 PM. All science teachers must attend. We\'ll cover new safety protocols and equipment handling.',
      likes: 19,
      comments: 7
    },
    {
      id: 8,
      author: 'Mr. Ahmed Khan',
      authorInitials: 'AK',
      role: 'Computer Science Teacher',
      timeAgo: '3 days ago',
      title: 'Coding Club Meeting Tomorrow',
      content: 'Coding Club meets tomorrow after school in the computer lab. We\'ll be working on our app development project. New members welcome!',
      likes: 16,
      comments: 5
    }
  ]);

  // Mock data for groups
  const [groups] = useState([
    {
      id: 1,
      name: 'Academic Club',
      icon: '📚',
      description: 'Discussions on academic excellence and curriculum development',
      members: 45
    },
    {
      id: 2,
      name: 'Math Department Forum',
      icon: '🔢',
      description: 'Math teachers sharing resources and teaching strategies',
      members: 28
    },
    {
      id: 3,
      name: 'Cultural Committee',
      icon: '🎭',
      description: 'Planning cultural events and celebrations',
      members: 32
    },
    {
      id: 4,
      name: 'Staff Welfare',
      icon: '💼',
      description: 'Staff wellbeing initiatives and support',
      members: 67
    },
    {
      id: 5,
      name: 'Sports Coordination Group',
      icon: '⚽',
      description: 'Organizing sports events and activities',
      members: 24
    },
    {
      id: 6,
      name: 'Library Updates',
      icon: '📖',
      description: 'New arrivals, book recommendations, and library news',
      members: 38
    }
  ]);

  // Mock data for announcements
  const [announcements] = useState([
    {
      id: 1,
      title: 'Staff Meeting on Friday, 3 PM',
      badge: 'cmty-Admin',
      badgeColor: '#e9d5ff',
      date: 'Nov 27, 2025',
      description: 'Mandatory staff meeting to discuss upcoming exam schedules and winter break planning.',
      attachments: 2
    },
    {
      id: 2,
      title: 'Safety Drill Scheduled Next Week',
      badge: 'cmty-Urgent',
      badgeColor: '#fee2e2',
      date: 'Nov 25, 2025',
      description: 'Fire safety drill will be conducted on Monday at 10 AM. Please ensure all students are aware of emergency procedures.',
      attachments: 1
    },
    {
      id: 3,
      title: 'New Exam Guidelines Released',
      badge: 'cmty-Exam',
      badgeColor: '#dbeafe',
      date: 'Nov 24, 2025',
      description: 'Updated examination guidelines for the December assessment period. All teachers must review before exam preparations.',
      attachments: 3
    },
    {
      id: 4,
      title: 'Transport Route Changes - Route 5 & 7',
      badge: 'cmty-Transport',
      badgeColor: '#fed7aa',
      date: 'Nov 22, 2025',
      description: 'Bus routes 5 and 7 will have modified schedules starting December 1st due to road construction.',
      attachments: 1
    }
  ]);

  // Mock data for resources
  const [resources] = useState([
    {
      id: 1,
      type: 'PDF',
      typeColor: '#ef4444',
      icon: '📄',
      title: 'English Grammar Comprehensive Guide',
      description: 'Complete grammar guide for Classes 9-12 with exercises and solutions',
      uploadedBy: 'Ms. Priya Sharma',
      category: 'Lesson Materials',
      categoryColor: '#dbeafe',
      subject: 'English'
    },
    {
      id: 2,
      type: 'Doc',
      typeColor: '#3b82f6',
      icon: '📝',
      title: 'Annual Leave Application Template',
      description: 'Standard template for staff leave applications',
      uploadedBy: 'HR Department',
      category: 'Templates',
      categoryColor: '#fce7f3',
      subject: 'General'
    },
    {
      id: 3,
      type: 'PDF',
      typeColor: '#ef4444',
      icon: '📄',
      title: 'School Safety and Security Policy 2025',
      description: 'Updated safety protocols and emergency procedures',
      uploadedBy: 'Admin Office',
      category: 'Policy Documents',
      categoryColor: '#e9d5ff',
      subject: 'General'
    },
    {
      id: 4,
      type: 'Link',
      typeColor: '#10b981',
      icon: '🔗',
      title: 'Online Learning Platform Tutorial',
      description: 'Step-by-step guide for using the new digital learning platform',
      uploadedBy: 'IT Department',
      category: 'Student Support Content',
      categoryColor: '#d1fae5',
      subject: 'General'
    },
    {
      id: 5,
      type: 'PDF',
      typeColor: '#ef4444',
      icon: '📄',
      title: 'Exam Conduct Guidelines - December 2025',
      description: 'Official guidelines for conducting end-term examinations',
      uploadedBy: 'Exam Controller',
      category: 'Policy Documents',
      categoryColor: '#e9d5ff',
      subject: 'General'
    },
    {
      id: 6,
      type: 'Image',
      typeColor: '#8b5cf6',
      icon: '🖼️',
      title: 'Campus Map - Updated',
      description: 'Latest campus layout with new building additions',
      uploadedBy: 'Facilities Team',
      category: 'General Resources',
      categoryColor: '#fef3c7'
    }
  ]);

  // Mock data for group invites
  const [groupInvites] = useState([
    {
      id: 1,
      groupName: 'Science Innovation Hub',
      icon: '🔬',
      invitedBy: 'Dr. Sarah Williams',
      timeAgo: '2 hours ago',
      description: 'We would love to have you join our Science Innovation Hub group to share teaching ideas and resources.',
      // inviteType: 'Group Invite'
    },
    {
      id: 2,
      groupName: 'Annual Day Committee',
      icon: '🎭',
      invitedBy: 'Mr. Rahul Kumar',
      timeAgo: '5 hours ago',
      description: 'Join our Annual Day planning committee. Your expertise would be valuable for organizing events.',
      // inviteType: 'Collaboration'
    }
  ]);

  // Mock data for sent invites
  const [sentInvites] = useState([
    {
      id: 1,
      groupName: 'Literature Circle',
      icon: '📘',
      recipient: 'Ms. Divya Iyer',
      status: 'pending',
      // type: 'Group',
      timeAgo: '3 hours ago',
      message: 'Would you like to join our Literature Circle group? We discuss classic and contemporary literature.',
      email: 'divya.iyer@school.edu'
    },
    {
      id: 2,
      groupName: 'Sports Week Planning',
      icon: '🏆',
      recipient: 'Mr. Rajesh Kumar',
      status: 'accepted',
      type: 'Event',
      timeAgo: '1 day ago',
      message: 'Join us for the upcoming Sports Week planning committee. Your expertise in event management would be invaluable.',
      email: 'rajesh.kumar@school.edu'
    },
    {
      id: 3,
      groupName: 'Science Innovation Hub',
      icon: '🔬',
      recipient: 'Dr. Meera Patel',
      status: 'declined',
      type: 'Forum',
      timeAgo: '2 days ago',
      message: 'We would love to have you collaborate with us on innovative science teaching methods.',
      email: 'meera.patel@school.edu'
    }
  ]);

  // Handlers for modals
  const handleCloseModals = () => {
    setShowInviteModal(false);
    setShowMembersModal(false);
    setInviteSearch('');
    setMemberSearch('');
  };

  const handleInviteUser = (userId) => {
    setInvitedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSendInvites = () => {
    if (invitedUsers.length > 0) {
      // Show success toast (in a real app, this would be a toast notification)
      alert(`Invitation requests sent successfully to ${invitedUsers.length} member(s)`);
      setInvitedUsers([]);
      setShowInviteModal(false);
      setInviteSearch('');
    }
  };

  const handleAcceptInvite = (inviteId) => {
    console.log('Accepted', inviteId);
  };

  const handleDeclineInvite = (inviteId) => {
    console.log('Declined', inviteId);
  };

  // Handlers for sent invites
  const handleCancelInvite = (inviteId) => {
    console.log('Cancelled invite', inviteId);
  };

  const handleViewMember = (inviteId) => {
    console.log('View member for invite', inviteId);
  };

  const handleResendInvite = (inviteId) => {
    console.log('Resend invite', inviteId);
  };

  const handleSendAgain = (inviteId) => {
    console.log('Send invite again', inviteId);
  };

  const handleSendNewInvite = () => {
    console.log('Opening send invite modal');
    setShowInviteModal(true);
  };

  // Filter members for invite modal based on search
  const filteredInviteMembers = mockAllMembers.filter(member =>
    member.name.toLowerCase().includes(inviteSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(inviteSearch.toLowerCase()) ||
    member.role.toLowerCase().includes(inviteSearch.toLowerCase())
  );

  // Filter members for view modal based on search
  const filteredViewMembers = mockAllMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Close modal on ESC key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCloseModals();
      }
    };
    if (showInviteModal || showMembersModal) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [showInviteModal, showMembersModal]);

  // Invite Members Modal Component
  const InviteMembersModal = () => (
    <>
      <div
        className="cmty-hsu-teach-community__modal-overlay"
        onClick={handleCloseModals}
        data-testid="teacher-overlay-invite-modal"
      />
      <div
        className="cmty-hsu-teach-community__invite-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        data-testid="teacher-modal-invite-members"
      >
        {/* Modal Header */}
        <div className="cmty-hsu-teach-community__modal-header">
          <h2 className="cmty-hsu-teach-community__modal-subtitle">
            {selectedGroup?.name}
          </h2>
          {/* <button
            className="cmty-hsu-teach-community__modal-close"
            onClick={handleCloseModals}
            aria-label="Close modal"
            data-testid="teacher-button-close-invite-modal"
          >
            ✕
          </button> */}
        </div>

        {/* Search Input */}
        {/* <div className="cmty-hsu-teach-community__modal-search">
      
          <input
            type="text"
            className="cmty-hsu-teach-community__modal-search-input"
            placeholder="Search people by name"
            value={inviteSearch}
            onChange={(e) => setInviteSearch(e.target.value)}
            data-testid="teacher-search-invite-members"
          />
        </div> */}

        {/* Member List */}
        <div className="cmty-hsu-teach-community__modal-content">
          {filteredInviteMembers.length > 0 ? (
            filteredInviteMembers.map(member => (
              <div key={member.id} className="cmty-hsu-teach-community__member-card">
                <div className="cmty-hsu-teach-community__member-card-info">
                  <div className="cmty-hsu-teach-community__member-avatar">{member.avatar}</div>
                  <div className="cmty-hsu-teach-community__member-details">
                    <div className="cmty-hsu-teach-community__member-name">{member.name}</div>
                    <div className="cmty-hsu-teach-community__member-role">{member.role}</div>
                    <div className="cmty-hsu-teach-community__member-email">{member.email}</div>
                  </div>
                </div>
                <button
                  className={`cmty-hsu-teach-community__invite-button ${invitedUsers.includes(member.id) ? 'cmty-hsu-teach-community__invite-button--sent' : ''
                    }`}
                  onClick={() => handleInviteUser(member.id)}
                  disabled={invitedUsers.includes(member.id)}
                  data-testid={`teacher-button-invite-${member.id}`}
                >
                  {invitedUsers.includes(member.id) ? 'Request Sent' : 'Invite'}
                </button>
              </div>
            ))
          ) : (
            <div className="cmty-hsu-teach-community__modal-empty">
              No members found
            </div>
          )}
        </div>

        {/* Selected Count */}
        {/* {invitedUsers.length > 0 && (
          <div className="cmty-hsu-teach-community__modal-selected-count">
            {invitedUsers.length} invitation request{invitedUsers.length > 1 ? 's' : ''} selected
          </div>
        )} */}

        {/* Modal Footer */}
        {/* <div className="cmty-hsu-teach-community__modal-footer">
          <button
            className="cmty-hsu-teach-community__modal-btn-secondary"
            onClick={handleCloseModals}
            data-testid="teacher-button-cancel-invite"
          >
            Cancel
          </button>
          <button
            className="cmty-hsu-teach-community__modal-btn-primary"
            onClick={handleSendInvites}
            disabled={invitedUsers.length === 0}
            data-testid="teacher-button-send-invite"
          >
            Send Invitations
          </button>
        </div> */}
      </div>
    </>
  );

  // View All Members Modal Component
  const ViewMembersModal = () => (
    <>
      <div
        className="cmty-hsu-teach-community__modal-overlay"
        onClick={handleCloseModals}
        data-testid="teacher-overlay-members-modal"
      />
      <div
        className="cmty-hsu-teach-community__members-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="members-modal-title"
        data-testid="teacher-modal-view-members"
      >
        {/* Modal Header */}
        <div className="cmty-hsu-teach-community__modal-header">
          <div className="cmty-hsu-teach-community__modal-header-info">
            <h2
              id="members-modal-title"
              className="cmty-hsu-teach-community__modal-title"
            >
              {selectedGroup?.name}
            </h2>
            <h2 className="cmty-hsu-teach-community__modal-subtitle">{mockAllMembers.length} members</h2>
          </div>
          {/* <button
            className="cmty-hsu-teach-community__modal-close"
            onClick={handleCloseModals}
            aria-label="Close modal"
            data-testid="teacher-button-close-members-modal"
          >
            ✕
          </button> */}
        </div>

        {/* Search Input */}
        {/* <div className="cmty-hsu-teach-community__modal-search">
          <span className="cmty-hsu-teach-community__search-icon">🔍</span>
          <input
            type="text"
            className="cmty-hsu-teach-community__modal-search-input"
            placeholder="Search members by name."
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            data-testid="teacher-search-group-members"
          />
        </div> */}

        {/* Members List */}
        <div className="cmty-hsu-teach-community__modal-members-list">
          {filteredViewMembers.length > 0 ? (
            filteredViewMembers.map(member => (
              <div key={member.id} className="cmty-hsu-teach-community__member-row">
                <div className="cmty-hsu-teach-community__member-row-avatar">{member.avatar}</div>
                <div className="cmty-hsu-teach-community__member-row-info">
                  <div className="cmty-hsu-teach-community__member-row-name">{member.name}</div>
                  <div className="cmty-hsu-teach-community__member-row-meta">
                    <span className="cmty-hsu-teach-community__member-row-role">{member.role}</span>
                    <span className="cmty-hsu-teach-community__member-row-sep">•</span>
                    <span className="cmty-hsu-teach-community__member-row-email">{member.email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="cmty-hsu-teach-community__modal-empty">
              No members found
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {/* <div className="cmty-hsu-teach-community__modal-footer">
          <button
            className="cmty-hsu-teach-community__modal-btn-primary"
            onClick={handleCloseModals}
            data-testid="teacher-button-close-members-footer"
          >
            Close
          </button>
        </div> */}
      </div>
    </>
  );




  return (
    <div className="cmty-hsu-teach-community" data-testid="teacher-page-community">
      {/* Header */}
      <div className="cmty-hsu-teach-community__header">
        <h1 className="cmty-hsu-teach-community__title" data-testid="teacher-heading-community">
          Community
        </h1>
        <p className="cmty-hsu-teach-community__subtitle">Connect, collaborate, and stay updated with school-wide discussions.</p>
      </div>

      {/* Stats Cards */}
      <div className="cmty-hsu-teach-community__stats">
        <div className="cmty-hsu-teach-community__stat-card cmty-hsu-teach-community__stat-card--blue">
          <div className="cmty-hsu-teach-community__stat-content">
            <h2 className="cmty-hsu-teach-community__stat-number">12</h2>
            <div className="cmty-hsu-teach-community__stat-label">
              <span className="cmty-hsu-teach-community__stat-title">Forums Joined</span>
              <span className="cmty-hsu-teach-community__stat-desc">Academic, Clubs, Committees</span>
            </div>
          </div>
          <div className="cmty-hsu-teach-community__stat-icon cmty-hsu-teach-community__stat-icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white" />
            </svg>
          </div>
        </div>

        <div className="cmty-hsu-teach-community__stat-card cmty-hsu-teach-community__stat-card--orange">
          <div className="cmty-hsu-teach-community__stat-content">
            <h2 className="cmty-hsu-teach-community__stat-number">8</h2>
            <div className="cmty-hsu-teach-community__stat-label">
              <span className="cmty-hsu-teach-community__stat-title">Active Discussions</span>
              <span className="cmty-hsu-teach-community__stat-desc">Ongoing right now</span>
            </div>
          </div>
          <div className="cmty-hsu-teach-community__stat-icon cmty-hsu-teach-community__stat-icon--orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="white" />
            </svg>
          </div>
        </div>

        <div className="cmty-hsu-teach-community__stat-card cmty-hsu-teach-community__stat-card--green">
          <div className="cmty-hsu-teach-community__stat-content">
            <h2 className="cmty-hsu-teach-community__stat-number">5</h2>
            <div className="cmty-hsu-teach-community__stat-label">
              <span className="cmty-hsu-teach-community__stat-title">New Posts Today</span>
              <span className="cmty-hsu-teach-community__stat-desc">Across all groups</span>
            </div>
          </div>
          <div className="cmty-hsu-teach-community__stat-icon cmty-hsu-teach-community__stat-icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cmty-hsu-teach-community__tabs">
        <button
          className={`cmty-hsu-teach-community__tab ${activeTab === 'all-posts' ? 'cmty-hsu-teach-community__tab--active' : ''}`}
          onClick={() => setActiveTab('all-posts')}
          data-testid="teacher-tab-all-posts"
        >
          All Posts
        </button>
        <button
          className={`cmty-hsu-teach-community__tab ${activeTab === 'my-groups' ? 'cmty-hsu-teach-community__tab--active' : ''}`}
          onClick={() => setActiveTab('my-groups')}
          data-testid="teacher-tab-my-groups"
        >
          My Groups
        </button>
        <button
          className={`cmty-hsu-teach-community__tab ${activeTab === 'announcements' ? 'cmty-hsu-teach-community__tab--active' : ''}`}
          onClick={() => setActiveTab('announcements')}
          data-testid="teacher-tab-announcements"
        >
          Announcements
        </button>
        <button
          className={`cmty-hsu-teach-community__tab ${activeTab === 'resources' ? 'cmty-hsu-teach-community__tab--active' : ''}`}
          onClick={() => setActiveTab('resources')}
          data-testid="teacher-tab-resources"
        >
          Resources
        </button>
        <button
          className={`cmty-hsu-teach-community__tab ${activeTab === 'invites' ? 'cmty-hsu-teach-community__tab--active' : ''}`}
          onClick={() => setActiveTab('invites')}
          data-testid="teacher-tab-invites"
        >
          Invites
        </button>
      </div>

      {/* All Posts Tab - Search Bar, Filter Tabs, and Posts without outer container */}
      {activeTab === 'all-posts' && (
        <>
          {/* Search Bar */}
          <div className="cmty-hsu-teach-community__search-bar">
            <span className="cmty-hsu-teach-community__search-icon">🔍</span>
            <input
              type="text"
              className="cmty-hsu-teach-community__search-input"
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="teacher-field-search-posts"
            />
          </div>

          {/* Filter Tabs */}
          <div className="cmty-hsu-teach-community__filter-tabs">
            {['Category', 'Popular', 'Recent', 'Staff Only', 'Events', 'Clubs'].map((filter) => (
              <button
                key={filter}
                className={`cmty-hsu-teach-community__filter-tab ${activeFilter === filter ? 'cmty-hsu-teach-community__filter-tab--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
                data-testid={`teacher-filter-${filter.toLowerCase().replace(' ', '-')}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="cmty-hsu-teach-community__posts-list">
            {posts.map((post) => (
              <div key={post.id} className="cmty-hsu-teach-community__post-card">
                <div className="cmty-hsu-teach-community__post-header">
                  <div className="cmty-hsu-teach-community__post-author-info">
                    <div className="cmty-hsu-teach-community__post-avatar">
                      {post.authorInitials.replace('cmty-', '')}
                    </div>
                    <div className="cmty-hsu-teach-community__post-author-details">
                      <div className="cmty-hsu-teach-community__post-author-row">
                        <span className="cmty-hsu-teach-community__post-author-name">{post.author}</span>
                        <span className="cmty-hsu-teach-community__post-separator">•</span>
                        <span className="cmty-hsu-teach-community__post-author-role">{post.role}</span>
                        <span className="cmty-hsu-teach-community__post-separator">•</span>
                        <span className="cmty-hsu-teach-community__post-time">{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <button className="cmty-hsu-teach-community__post-bookmark" data-testid={`teacher-button-bookmark-${post.id}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                <h3 className="cmty-hsu-teach-community__post-title">{post.title}</h3>
                <p className="cmty-hsu-teach-community__post-content">{post.content}</p>

                <div className="cmty-hsu-teach-community__post-actions">
                  <button className="cmty-hsu-teach-community__post-action" data-testid={`teacher-button-like-${post.id}`}>
                    <svg className="cmty-hsu-teach-community__post-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor" />
                    </svg>
                    <span className="cmty-hsu-teach-community__post-action-text">{post.likes}</span>
                  </button>
                  <button className="cmty-hsu-teach-community__post-action" data-testid={`teacher-button-comment-${post.id}`}>
                    <svg className="cmty-hsu-teach-community__post-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                    </svg>
                    <span className="cmty-hsu-teach-community__post-action-text">{post.comments}</span>
                  </button>
                  <button className="cmty-hsu-teach-community__post-action" data-testid={`teacher-button-share-${post.id}`}>
                    <svg className="cmty-hsu-teach-community__post-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor" />
                    </svg>
                    <span className="cmty-hsu-teach-community__post-action-text">Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Groups Tab - Shows either Groups List or Group Detail View */}
      {activeTab === 'my-groups' && (
        <>
          {!selectedGroup ? (
            // Groups List View
            <div className="cmty-hsu-teach-community__groups-grid">
              {groups.map((group) => (
                <div key={group.id} className="cmty-hsu-teach-community__group-card">
                  <div className="cmty-hsu-teach-community__group-card-content">
                    <div className="cmty-hsu-teach-community__group-icon-wrapper">
                      <span className="cmty-hsu-teach-community__group-icon">{group.icon}</span>
                    </div>
                    <h3 className="cmty-hsu-teach-community__group-name">{group.name}</h3>
                    <p className="cmty-hsu-teach-community__group-description">{group.description}</p>
                    <div className="cmty-hsu-teach-community__group-members">
                      <span className="cmty-hsu-teach-community__group-members-icon">👥</span>
                      <span className="cmty-hsu-teach-community__group-members-text">{group.members} members</span>
                    </div>
                  </div>
                  <button
                    className="cmty-hsu-teach-community__group-btn"
                    onClick={() => setSelectedGroup(group)}
                    data-testid={`teacher-button-view-group-${group.id}`}
                  >
                    View Group
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Group Detail View (Subview within My Groups tab)
            <>
              {/* Back Button */}
              <button
                className="cmty-hsu-teach-community__back-btn"
                onClick={() => setSelectedGroup(null)}
                data-testid="teacher-button-back-to-groups"
              >
                ← Back to Groups
              </button>

              {/* Group Detail Layout */}
              <div className="cmty-hsu-teach-community__group-detail">
                {/* Left Container - Group Info */}
                <div className="cmty-hsu-teach-community__group-info-container">
                  <div className="cmty-hsu-teach-community__group-detail-header">
                    <div className="cmty-hsu-teach-community__group-icon-large">
                      {selectedGroup.icon}
                    </div>
                    <h2 className="cmty-hsu-teach-community__group-detail-title">{selectedGroup.name}</h2>
                    <p className="cmty-hsu-teach-community__group-detail-description">
                      {selectedGroup.description}
                    </p>
                    <div className="cmty-hsu-teach-community__group-detail-members">
                      <span className="cmty-hsu-teach-community__group-members-icon">👥</span>
                      <span className="cmty-hsu-teach-community__group-members-text">{selectedGroup.members} members</span>
                    </div>
                  </div>

                  <button
                    className="cmty-hsu-teach-community__invite-btn"
                    onClick={() => setShowInviteModal(true)}
                    data-testid="teacher-button-invite-members"
                  >
                    + Invite Members
                  </button>

                  <button
                    className="cmty-hsu-teach-community__view-members-btn"
                    onClick={() => setShowMembersModal(true)}
                    data-testid="teacher-button-view-all-members"
                  >
                    View All Members
                  </button>
                </div>

                {/* Right Container - Group Posts */}
                <div className="cmty-hsu-teach-community__group-posts-container">
                  {/* Post Input */}
                  <div className="cmty-hsu-teach-community__post-input-wrapper">
                    <input
                      type="text"
                      className="cmty-hsu-teach-community__post-input"
                      placeholder="Share something with the group..."
                      data-testid="teacher-field-group-post-input"
                    />
                    <button
                      className="cmty-hsu-teach-community__post-submit-btn"
                      data-testid="teacher-button-submit-post"
                    >
                      Post
                    </button>
                  </div>

                  {/* Group Posts List */}
                  <div className="cmty-hsu-teach-community__group-posts-list">
                    {posts.slice(0, 2).map((post) => (
                      <div key={post.id} className="cmty-hsu-teach-community__post-card">
                        <div className="cmty-hsu-teach-community__post-header">
                          <div className="cmty-hsu-teach-community__post-author-info">
                            <div className="cmty-hsu-teach-community__post-avatar">
                              {post.authorInitials}
                            </div>
                            <div className="cmty-hsu-teach-community__post-author-details">
                              <div className="cmty-hsu-teach-community__post-author-row">
                                <span className="cmty-hsu-teach-community__post-author-name">{post.author}</span>
                                <span className="cmty-hsu-teach-community__post-separator">•</span>
                                <span className="cmty-hsu-teach-community__post-time">{post.timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="cmty-hsu-teach-community__post-content">{post.content}</p>

                        <div className="cmty-hsu-teach-community__post-actions">
                          <button className="cmty-hsu-teach-community__post-action" data-testid={`teacher-button-like-${post.id}`}>
                            <svg className="cmty-hsu-teach-community__post-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor" />
                            </svg>
                            <span className="cmty-hsu-teach-community__post-action-text">{post.likes}</span>
                          </button>
                          <button className="cmty-hsu-teach-community__post-action" data-testid={`teacher-button-comment-${post.id}`}>
                            <svg className="cmty-hsu-teach-community__post-action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                            </svg>
                            <span className="cmty-hsu-teach-community__post-action-text">{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <>
          <div className="cmty-hsu-teach-community__announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="cmty-hsu-teach-community__announcement-card">
                <div className="cmty-hsu-teach-community__announcement-header">
                  <h3 className="cmty-hsu-teach-community__announcement-title">{announcement.title}</h3>
                  <span
                    className="cmty-hsu-teach-community__announcement-badge"
                    style={{ background: announcement.badgeColor }}
                  >
                    {announcement.badge.replace('cmty-', '')}
                  </span>
                </div>

                <div className="cmty-hsu-teach-community__announcement-date">
                  <span className="cmty-hsu-teach-community__announcement-date-icon">📅</span>
                  <span>{announcement.date}</span>
                </div>

                <p className="cmty-hsu-teach-community__announcement-description">
                  {announcement.description}
                </p>

                <div className="cmty-hsu-teach-community__announcement-attachments">
                  <span className="cmty-hsu-teach-community__announcement-attachments-icon">📎</span>
                  {announcement.attachments} attachment{announcement.attachments > 1 ? 's' : ''}
                </div>

                <button
                  className="cmty-hsu-teach-community__announcement-read-more"
                  onClick={() => setSelectedAnnouncement(announcement)}
                  data-testid={`teacher-button-read-more-${announcement.id}`}
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <>
          {/* Filters Row */}
          <div className="cmty-hsu-teach-community__resources-filters">
            <div className="cmty-hsu-teach-community__filter-group">
              <div className="cmty-hsu-teach-community__filter-label-wrapper">
                <div className="cmty-hsu-teach-community__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L6 5L9 8M6 5V19M21 16L18 19L15 16M18 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label className="cmty-hsu-teach-community__filter-label">File Type</label>
              </div>
              <select
                className="cmty-hsu-teach-community__filter-select"
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                data-testid="teacher-dropdown-file-type"
              >
                <option>All Types</option>
                <option>PDF</option>
                <option>Doc</option>
                <option>Link</option>
                <option>Image</option>
              </select>
            </div>

            <div className="cmty-hsu-teach-community__filter-group">
              <div className="cmty-hsu-teach-community__filter-label-wrapper">
                <div className="cmty-hsu-teach-community__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label className="cmty-hsu-teach-community__filter-label">Category</label>
              </div>
              <select
                className="cmty-hsu-teach-community__filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                data-testid="teacher-dropdown-category"
              >
                <option>All Categories</option>
                <option>Lesson Materials</option>
                <option>Templates</option>
                <option>Policy Documents</option>
                <option>Student Support Content</option>
                <option>General Resources</option>
              </select>
            </div>

            <div className="cmty-hsu-teach-community__filter-group">
              <div className="cmty-hsu-teach-community__filter-label-wrapper">
                <div className="cmty-hsu-teach-community__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label className="cmty-hsu-teach-community__filter-label">Subject</label>
              </div>
              <select
                className="cmty-hsu-teach-community__filter-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                data-testid="teacher-dropdown-subject"
              >
                <option>All Subjects</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
                <option>General</option>
              </select>
            </div>

            <div className="cmty-hsu-teach-community__filter-group">
              <div className="cmty-hsu-teach-community__filter-label-wrapper">
                <div className="cmty-hsu-teach-community__filter-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <label className="cmty-hsu-teach-community__filter-label">Recently Added</label>
              </div>
              <select
                className="cmty-hsu-teach-community__filter-select"
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                data-testid="teacher-dropdown-time"
              >
                <option>All Time</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="cmty-hsu-teach-community__resources-grid">
            {resources
              .filter(resource => {
                // Filter by file type
                if (selectedFileType !== 'All Types' && resource.type !== selectedFileType) return false;
                // Filter by category
                if (selectedCategory !== 'All Categories' && resource.category !== selectedCategory) return false;
                // Filter by subject
                if (selectedSubject !== 'All Subjects' && resource.subject !== selectedSubject) return false;
                // Time filter would need actual dates, skipping for mock data
                return true;
              })
              .map((resource) => (
                <div key={resource.id} className="cmty-hsu-teach-community__resource-card">
                  <div className="cmty-hsu-teach-community__resource-header">
                    <div className="cmty-hsu-teach-community__resource-icon-wrapper">
                      {resource.type === 'PDF' && (
                        <svg className="cmty-hsu-teach-community__resource-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 18H17V16H7V18Z" fill="#ef4444" />
                          <path d="M17 14H7V12H17V14Z" fill="#ef4444" />
                          <path d="M7 10H11V8H7V10Z" fill="#ef4444" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="#ef4444" />
                        </svg>
                      )}
                      {resource.type === 'Doc' && (
                        <svg className="cmty-hsu-teach-community__resource-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3b82f6" />
                          <path d="M14 2V8H20" fill="#bfdbfe" />
                          <path d="M16 13H8V15H16V13Z" fill="white" />
                          <path d="M16 17H8V19H16V17Z" fill="white" />
                          <path d="M10 9H8V11H10V9Z" fill="white" />
                        </svg>
                      )}
                      {resource.type === 'Link' && (
                        <svg className="cmty-hsu-teach-community__resource-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7642 9.26331 11.0685 9.05889 10.3533 9.00768C9.63816 8.95646 8.92037 9.05967 8.24861 9.31023C7.57685 9.56079 6.96684 9.95302 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {resource.type === 'Image' && (
                        <svg className="cmty-hsu-teach-community__resource-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <span
                        className="cmty-hsu-teach-community__resource-type-badge"
                        style={{ background: resource.typeColor }}
                      >
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  <div className="cmty-hsu-teach-community__resource-content">
                    <h3 className="cmty-hsu-teach-community__resource-title">{resource.title}</h3>
                    <p className="cmty-hsu-teach-community__resource-description">{resource.description}</p>

                    <div className="cmty-hsu-teach-community__resource-meta">
                      <span className="cmty-hsu-teach-community__resource-uploader">
                        <svg className="cmty-hsu-teach-community__resource-uploader-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        {resource.uploadedBy}
                      </span>
                      <span
                        className="cmty-hsu-teach-community__resource-category"
                      // style={{ background: resource.categoryColor }}
                      >
                        {resource.category}
                      </span>
                    </div>
                  </div>

                  <button className="cmty-hsu-teach-community__resource-download" data-testid={`teacher-button-download-${resource.id}`}>
                    <svg className="cmty-hsu-teach-community__resource-download-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download
                  </button>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Invites Tab */}
      {activeTab === 'invites' && (
        <>
          {/* Invites Header */}
          <div className="cmty-hsu-teach-community__invites-header">
            <div className="cmty-hsu-teach-community__invites-header-content">
              <h2 className="cmty-hsu-teach-community__invites-title" data-testid="teacher-heading-invitations">
                Invitations
              </h2>
              <p className="cmty-hsu-teach-community__invites-subtitle">
                Manage invitations received from colleagues and invitations you have sent.
              </p>
            </div>
            {/* <button
              className="cmty-hsu-teach-community__send-invite-btn"
              onClick={handleSendNewInvite}
              data-testid="teacher-button-send-invite"
            >
              <span className="cmty-hsu-teach-community__send-invite-icon">✈️</span>
              Send Invite
            </button> */}
          </div>

          {/* Sub-Tab Switcher */}
          <div className="cmty-hsu-teach-community__invite-subtabs">
            <button
              className={`cmty-hsu-teach-community__invite-subtab ${inviteView === 'received' ? 'cmty-hsu-teach-community__invite-subtab--active' : ''
                }`}
              onClick={() => setInviteView('received')}
              data-testid="teacher-subtab-received-invites"
            >
              Received Invites
            </button>
            <button
              className={`cmty-hsu-teach-community__invite-subtab ${inviteView === 'sent' ? 'cmty-hsu-teach-community__invite-subtab--active' : ''
                }`}
              onClick={() => setInviteView('sent')}
              data-testid="teacher-subtab-sent-invites"
            >
              Sent Invites
            </button>
          </div>

          {/* Received Invites Section */}
          {inviteView === 'received' && (
            <div className="cmty-hsu-teach-community__invites-list">
              {groupInvites.length > 0 ? (
                groupInvites.map((invite) => (
                  <div key={invite.id} className="cmty-hsu-teach-community__invite-card">
                    <div className="cmty-hsu-teach-community__invite-header">
                      <div className="cmty-hsu-teach-community__invite-icon">
                        {invite.icon}
                      </div>
                      <div className="cmty-hsu-teach-community__invite-content">
                        <h3 className="cmty-hsu-teach-community__invite-title">{invite.groupName}</h3>
                        <div className="cmty-hsu-teach-community__invite-meta">
                          <span>Invited by {invite.invitedBy}</span>
                          <span className="cmty-hsu-teach-community__invite-meta-sep">•</span>
                          <span>{invite.timeAgo}</span>
                        </div>
                        <p className="cmty-hsu-teach-community__invite-description">{invite.description}</p>
                      </div>
                      {/* <span
                        className="cmty-hsu-teach-community__invite-badge"
                        style={{
                          background: invite.inviteType === 'Group Invite' ? '#dbeafe' : '#e9d5ff',
                          color: invite.inviteType === 'Group Invite' ? '#0c4a6e' : '#5b21b6'
                        }}
                        data-testid={`teacher-badge-invite-${invite.id}`}
                      >
                        {invite.inviteType}
                      </span> */}
                    </div>
                    <div className="cmty-hsu-teach-community__invite-actions">
                      <button
                        className="cmty-hsu-teach-community__invite-btn cmty-hsu-teach-community__invite-btn--accept"
                        onClick={() => handleAcceptInvite(invite.id)}
                        data-testid={`teacher-button-accept-invite-${invite.id}`}
                      >
                        Accept
                      </button>
                      <button
                        className="cmty-hsu-teach-community__invite-btn cmty-hsu-teach-community__invite-btn--decline"
                        onClick={() => handleDeclineInvite(invite.id)}
                        data-testid={`teacher-button-decline-invite-${invite.id}`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="cmty-hsu-teach-community__empty-invites-state">
                  <div className="cmty-hsu-teach-community__empty-invites-icon">📬</div>
                  <h3 className="cmty-hsu-teach-community__empty-invites-title">No invitations received</h3>
                  <p className="cmty-hsu-teach-community__empty-invites-text">You don't have any pending invitations at the moment.</p>
                </div>
              )}
            </div>
          )}

          {/* Sent Invites Section */}
          {inviteView === 'sent' && (
            <div className="cmty-hsu-teach-community__sent-invites-wrapper">
              {/* <div className="cmty-hsu-teach-community__sent-invites-header">
                <h3 className="cmty-hsu-teach-community__sent-invites-title">Invites Sent</h3>
                <p className="cmty-hsu-teach-community__sent-invites-subtitle">
                  Manage invitations you have sent to colleagues.
                </p>
              </div> */}

              {sentInvites.length > 0 ? (
                <div className="cmty-hsu-teach-community__sent-invites-list">
                  {sentInvites.map((invite) => (
                    <div key={invite.id} className="cmty-hsu-teach-community__sent-invite-card">
                      <div className="cmty-hsu-teach-community__sent-invite-header">
                        <div className="cmty-hsu-teach-community__sent-invite-icon">
                          {invite.icon}
                        </div>
                        <div className="cmty-hsu-teach-community__sent-invite-content">
                          <h3 className="cmty-hsu-teach-community__sent-invite-group-name">
                            {invite.groupName}
                          </h3>
                          <div className="cmty-hsu-teach-community__sent-invite-recipient">
                            <span className="cmty-hsu-teach-community__sent-invite-recipient-label">To: </span>
                            <span className="cmty-hsu-teach-community__sent-invite-recipient-name">
                              {invite.recipient}
                            </span>
                          </div>
                          <div className="cmty-hsu-teach-community__sent-invite-time">
                            {invite.timeAgo}
                          </div>
                          <p className="cmty-hsu-teach-community__sent-invite-message">
                            {invite.message}
                          </p>
                        </div>
                      </div>

                      <div className="cmty-hsu-teach-community__sent-invite-footer">
                        <div className="cmty-hsu-teach-community__sent-invite-badges">
                          <span
                            className={`cmty-hsu-teach-community__sent-invite-status-badge cmty-hsu-teach-community__sent-invite-status-badge--${invite.status}`}
                            data-testid={`teacher-badge-status-${invite.id}`}
                          >
                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                          </span>
                          {/* <span
                            className="cmty-hsu-teach-community__sent-invite-type-badge"
                            data-testid={`teacher-badge-type-${invite.id}`}
                          >
                            {invite.type}
                          </span> */}
                        </div>

                        <div className="cmty-hsu-teach-community__sent-invite-actions">
                          {invite.status === 'pending' && (
                            <button
                              className="cmty-hsu-teach-community__sent-invite-action-btn cmty-hsu-teach-community__sent-invite-action-btn--cancel"
                              onClick={() => handleCancelInvite(invite.id)}
                              data-testid={`teacher-button-cancel-invite-${invite.id}`}
                            >
                              Cancel Invite
                            </button>
                          )}
                          {/* {invite.status === 'accepted' && (
                            <button
                              className="cmty-hsu-teach-community__sent-invite-action-btn cmty-hsu-teach-community__sent-invite-action-btn--view"
                              onClick={() => handleViewMember(invite.id)}
                              data-testid={`teacher-button-view-member-${invite.id}`}
                            >
                              View Member
                            </button>
                          )} */}
                          {/* {invite.status === 'declined' && (
                            <button
                              className="cmty-hsu-teach-community__sent-invite-action-btn cmty-hsu-teach-community__sent-invite-action-btn--resend"
                              onClick={() => handleResendInvite(invite.id)}
                              data-testid={`teacher-button-resend-invite-${invite.id}`}
                            >
                              Resend Invite
                            </button>
                          )}
                          {invite.status === 'expired' && (
                            <button
                              className="cmty-hsu-teach-community__sent-invite-action-btn cmty-hsu-teach-community__sent-invite-action-btn--send-again"
                              onClick={() => handleSendAgain(invite.id)}
                              data-testid={`teacher-button-send-again-${invite.id}`}
                            >
                              Send Again
                            </button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cmty-hsu-teach-community__empty-invites-state">
                  <div className="cmty-hsu-teach-community__empty-invites-icon">✈️</div>
                  <h3 className="cmty-hsu-teach-community__empty-invites-title">
                    You haven't sent any invitations yet
                  </h3>
                  <p className="cmty-hsu-teach-community__empty-invites-text">
                    Start inviting colleagues to join your groups and collaborate.
                  </p>
                  <button
                    className="cmty-hsu-teach-community__empty-invites-btn"
                    onClick={handleSendNewInvite}
                    data-testid="teacher-button-empty-send-invite"
                  >
                    <span>✈️</span>
                    Send Invite
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {/* Render Modals */}
      {showInviteModal && <InviteMembersModal />}
      {showMembersModal && <ViewMembersModal />}


    </div>
  );
};

export default Community;
