import React, { useState } from 'react';
import FloatingAIAssistant from '../../components/FloatingAIAssistant';
import '../../assets/scss/Announcements.scss';

const Announcements = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [starredIds, setStarredIds] = useState([1, 3]);

  // Create announcement form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    audience: [],
    bannerImage: null,
    attachments: []
  });

  // Mock announcements data
  const [announcements] = useState([
    {
      id: 1,
      title: 'Annual Sports Day - December 15th',
      description: 'We are excited to announce our Annual Sports Day scheduled for December 15th. All students and teachers are requested to participate actively. Registration forms are available at the sports office.',
      priority: 'HIGH',
      category: 'Events',
      date: 'Nov 25, 2025 • 10:30 AM',
      postedBy: 'Sports Coordinator - Mr. John Smith',
      views: 523,
      bannerImage: true,
      attachments: [
        { name: 'Sports_Day_Schedule.pdf', size: '2.4 MB' },
        { name: 'Registration_Form.pdf', size: '1.2 MB' }
      ]
    },
    {
      id: 2,
      title: 'Mid-Term Examination Schedule Released',
      description: 'The mid-term examination schedule for all classes (9-12) has been finalized and uploaded. Please check the attached PDF for detailed timings and exam guidelines.',
      priority: 'CRITICAL',
      category: 'Academic',
      date: 'Nov 24, 2025 • 2:15 PM',
      postedBy: 'Academic Coordinator - Mrs. Priya Singh',
      views: 456,
      bannerImage: false,
      attachments: [
        { name: 'Exam_Schedule_2025.pdf', size: '3.1 MB' }
      ]
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting - This Saturday',
      description: 'PTM scheduled for Classes 9-12 on November 30th. Parents are requested to meet their ward\'s class teacher between 9:00 AM - 2:00 PM. Please carry your ID card.',
      priority: 'HIGH',
      category: 'Administrative',
      date: 'Nov 23, 2025 • 11:45 AM',
      postedBy: 'Principal - Dr. Sarah Williams',
      views: 687,
      bannerImage: true,
      attachments: []
    },
    {
      id: 4,
      title: 'Library New Books Collection',
      description: 'The library has received a new collection of 200+ books covering various subjects. Students can issue books starting from December 1st.',
      priority: 'MEDIUM',
      category: 'Academic',
      date: 'Nov 22, 2025 • 4:00 PM',
      postedBy: 'Librarian - Ms. Emily Brown',
      views: 234,
      bannerImage: false,
      attachments: [
        { name: 'New_Books_List.pdf', size: '1.8 MB' }
      ]
    },
    {
      id: 5,
      title: 'Science Fair Registration Open',
      description: 'Registration for the Annual Science Fair is now open for all classes. Submit your project proposals by December 10th.',
      priority: 'MEDIUM',
      category: 'Events',
      date: 'Nov 20, 2025 • 9:30 AM',
      postedBy: 'Science Department - Dr. Michael Chen',
      views: 389,
      bannerImage: false,
      attachments: [
        { name: 'Science_Fair_Guidelines.pdf', size: '2.2 MB' }
      ]
    },
    {
      id: 6,
      title: 'Winter Break Schedule',
      description: 'School will be closed for winter break from December 20th to January 5th. Classes will resume on January 6th, 2026.',
      priority: 'HIGH',
      category: 'Administrative',
      date: 'Nov 18, 2025 • 1:00 PM',
      postedBy: 'Administration Office',
      views: 892,
      bannerImage: false,
      attachments: []
    },
    {
      id: 7,
      title: 'Annual Day Celebrations - Save the Date',
      description: 'Mark your calendars for our Annual Day on December 28th. Cultural performances, awards ceremony, and much more. All students must attend.',
      priority: 'HIGH',
      category: 'Events',
      date: 'Nov 17, 2025 • 3:45 PM',
      postedBy: 'Cultural Committee - Ms. Anita Sharma',
      views: 1024,
      bannerImage: true,
      attachments: [
        { name: 'Annual_Day_Program.pdf', size: '3.5 MB' }
      ]
    },
    {
      id: 8,
      title: 'Fire Drill Scheduled - November 28th',
      description: 'A mandatory fire drill will be conducted on November 28th at 11:00 AM. All students and staff must evacuate and assemble at designated points.',
      priority: 'CRITICAL',
      category: 'Safety',
      date: 'Nov 16, 2025 • 9:00 AM',
      postedBy: 'Safety Officer - Mr. Ramesh Kumar',
      views: 756,
      bannerImage: false,
      attachments: [
        { name: 'Fire_Drill_Protocol.pdf', size: '1.1 MB' }
      ]
    },
    {
      id: 9,
      title: 'Class 10 Project Submission Deadline Extended',
      description: 'Due to technical issues, the project submission deadline for Class 10 students has been extended to December 5th. Please submit through the online portal.',
      priority: 'HIGH',
      category: 'Class Specific',
      date: 'Nov 15, 2025 • 2:30 PM',
      postedBy: 'Class Coordinator - Mrs. Deepa Nair',
      views: 432,
      bannerImage: false,
      attachments: []
    },
    {
      id: 10,
      title: 'Swimming Pool Maintenance Notice',
      description: 'The school swimming pool will be closed for maintenance from November 20-25. Regular classes will resume from November 26th.',
      priority: 'MEDIUM',
      category: 'Administrative',
      date: 'Nov 14, 2025 • 10:15 AM',
      postedBy: 'Sports Facility Manager - Mr. Vijay Singh',
      views: 298,
      bannerImage: false,
      attachments: []
    },
    {
      id: 11,
      title: 'National Mathematics Olympiad Results',
      description: 'Congratulations to our students who qualified for the next round of National Mathematics Olympiad. The list is attached below.',
      priority: 'LOW',
      category: 'Achievements',
      date: 'Nov 13, 2025 • 5:00 PM',
      postedBy: 'Math Department - Dr. Suresh Menon',
      views: 612,
      bannerImage: true,
      attachments: [
        { name: 'Olympiad_Qualifiers.pdf', size: '890 KB' }
      ]
    },
    {
      id: 12,
      title: 'Computer Lab Upgrade Complete',
      description: 'The computer lab has been upgraded with 50 new systems and latest software. Students can now access advanced programming tools.',
      priority: 'LOW',
      category: 'Academic',
      date: 'Nov 12, 2025 • 8:30 AM',
      postedBy: 'IT Department - Mr. Arun Patel',
      views: 445,
      bannerImage: false,
      attachments: []
    },
    {
      id: 13,
      title: 'Inter-School Basketball Championship',
      description: 'Our school team has won the Inter-School Basketball Championship 2025! Congratulations to all team members and coaches.',
      priority: 'LOW',
      category: 'Achievements',
      date: 'Nov 11, 2025 • 6:20 PM',
      postedBy: 'Sports Department - Coach Rajiv Sharma',
      views: 887,
      bannerImage: true,
      attachments: []
    },
    {
      id: 14,
      title: 'School Canteen Menu Update',
      description: 'New healthy meal options have been added to the canteen menu. Check the updated menu card for nutritious breakfast and lunch options.',
      priority: 'LOW',
      category: 'Administrative',
      date: 'Nov 10, 2025 • 11:00 AM',
      postedBy: 'Canteen Manager - Mrs. Lakshmi Iyer',
      views: 523,
      bannerImage: false,
      attachments: [
        { name: 'Canteen_Menu_Updated.pdf', size: '1.5 MB' }
      ]
    },
    {
      id: 15,
      title: 'Emergency School Closure - Weather Alert',
      description: 'Due to heavy rainfall warning issued by Met Department, school will remain closed on November 19th. Online classes will be conducted.',
      priority: 'CRITICAL',
      category: 'Emergency',
      date: 'Nov 18, 2025 • 6:45 AM',
      postedBy: 'Principal - Dr. Sarah Williams',
      views: 1234,
      bannerImage: false,
      attachments: []
    },
    {
      id: 16,
      title: 'Career Counseling Session for Class 12',
      description: 'A career counseling session will be held on December 2nd for Class 12 students. Experts from various fields will guide students on career options.',
      priority: 'HIGH',
      category: 'Class Specific',
      date: 'Nov 9, 2025 • 3:15 PM',
      postedBy: 'Career Counselor - Dr. Meena Gupta',
      views: 567,
      bannerImage: false,
      attachments: [
        { name: 'Career_Options_Guide.pdf', size: '4.2 MB' }
      ]
    },
    {
      id: 17,
      title: 'Art Exhibition - Student Works on Display',
      description: 'Annual art exhibition showcasing creative works by students from all grades. Open for parents and visitors from December 10-15.',
      priority: 'MEDIUM',
      category: 'Events',
      date: 'Nov 8, 2025 • 1:45 PM',
      postedBy: 'Art Department - Ms. Priya Reddy',
      views: 401,
      bannerImage: true,
      attachments: []
    },
    {
      id: 18,
      title: 'School Bus Route Modification',
      description: 'Due to road construction work, Bus Route 5 will be temporarily modified from November 22nd. Please check the updated route map.',
      priority: 'HIGH',
      category: 'Administrative',
      date: 'Nov 7, 2025 • 7:30 AM',
      postedBy: 'Transport Manager - Mr. Sanjay Desai',
      views: 678,
      bannerImage: false,
      attachments: [
        { name: 'Modified_Route_Map.pdf', size: '2.1 MB' }
      ]
    },
    {
      id: 19,
      title: 'Physics Lab Equipment Upgrade',
      description: 'New advanced physics lab equipment has been installed. Students will benefit from hands-on experiments with modern apparatus.',
      priority: 'LOW',
      category: 'Academic',
      date: 'Nov 6, 2025 • 10:45 AM',
      postedBy: 'Physics Department - Dr. Arvind Kumar',
      views: 356,
      bannerImage: false,
      attachments: []
    },
    {
      id: 20,
      title: 'Debate Competition Winners Announced',
      description: 'Congratulations to the winners of the Inter-House Debate Competition. Results and prize distribution details are attached.',
      priority: 'LOW',
      category: 'Achievements',
      date: 'Nov 5, 2025 • 4:30 PM',
      postedBy: 'English Department - Mrs. Kavita Joshi',
      views: 489,
      bannerImage: false,
      attachments: [
        { name: 'Debate_Results.pdf', size: '750 KB' }
      ]
    },
    {
      id: 21,
      title: 'Class 11 Field Trip to Science Museum',
      description: 'Class 11 students will visit the National Science Museum on December 8th. Permission slips and payment details have been sent to parents.',
      priority: 'MEDIUM',
      category: 'Class Specific',
      date: 'Nov 4, 2025 • 2:00 PM',
      postedBy: 'Class Teacher - Mr. Rohit Sharma',
      views: 412,
      bannerImage: true,
      attachments: [
        { name: 'Field_Trip_Details.pdf', size: '1.3 MB' }
      ]
    },
    {
      id: 22,
      title: 'Music Competition Registration Open',
      description: 'Register for the annual music competition. Solo and group categories available. Last date to register is December 1st.',
      priority: 'MEDIUM',
      category: 'Events',
      date: 'Nov 3, 2025 • 9:15 AM',
      postedBy: 'Music Department - Ms. Sunita Verma',
      views: 534,
      bannerImage: false,
      attachments: [
        { name: 'Music_Competition_Rules.pdf', size: '980 KB' }
      ]
    },
    {
      id: 23,
      title: 'Health Checkup Camp - All Students',
      description: 'Annual health checkup camp will be organized from December 12-14. All students must participate. Medical reports will be shared with parents.',
      priority: 'HIGH',
      category: 'Administrative',
      date: 'Nov 2, 2025 • 11:30 AM',
      postedBy: 'School Nurse - Dr. Rekha Singh',
      views: 723,
      bannerImage: false,
      attachments: []
    },
    {
      id: 24,
      title: 'English Essay Competition Results',
      description: 'Winners of the English Essay Competition have been announced. Congratulations to all participants. Prizes will be distributed on November 30th.',
      priority: 'LOW',
      category: 'Achievements',
      date: 'Nov 1, 2025 • 5:45 PM',
      postedBy: 'English Department - Mrs. Kavita Joshi',
      views: 398,
      bannerImage: false,
      attachments: [
        { name: 'Essay_Winners.pdf', size: '650 KB' }
      ]
    },
    {
      id: 25,
      title: 'Chemistry Lab Safety Guidelines',
      description: 'Updated safety guidelines for chemistry lab. All students must read and follow these guidelines during practical sessions.',
      priority: 'HIGH',
      category: 'Safety',
      date: 'Oct 31, 2025 • 8:00 AM',
      postedBy: 'Chemistry Department - Dr. Neha Saxena',
      views: 445,
      bannerImage: false,
      attachments: [
        { name: 'Lab_Safety_Guidelines.pdf', size: '1.7 MB' }
      ]
    },
    {
      id: 26,
      title: 'Yoga and Meditation Workshop',
      description: 'A special yoga and meditation workshop will be conducted for stress management. Open for all students from December 6-7.',
      priority: 'MEDIUM',
      category: 'Events',
      date: 'Oct 30, 2025 • 3:00 PM',
      postedBy: 'Wellness Coordinator - Ms. Anjali Mehta',
      views: 478,
      bannerImage: true,
      attachments: []
    },
    {
      id: 27,
      title: 'Biology Lab Virtual Tour Available',
      description: 'A virtual tour of our upgraded biology lab is now available online. Students can explore the facilities and equipment virtually.',
      priority: 'LOW',
      category: 'Academic',
      date: 'Oct 29, 2025 • 12:15 PM',
      postedBy: 'Biology Department - Dr. Vivek Nair',
      views: 289,
      bannerImage: false,
      attachments: []
    },
    {
      id: 28,
      title: 'Student Council Election Nominations',
      description: 'Nominations are open for Student Council elections. Interested students should submit their applications by December 3rd.',
      priority: 'MEDIUM',
      category: 'Administrative',
      date: 'Oct 28, 2025 • 10:00 AM',
      postedBy: 'Student Affairs - Mr. Kiran Kumar',
      views: 612,
      bannerImage: false,
      attachments: [
        { name: 'Nomination_Form.pdf', size: '780 KB' }
      ]
    },
    {
      id: 29,
      title: 'Drama Club Annual Play Auditions',
      description: 'Auditions for the annual play will be held on December 4th. All students interested in drama and theatre are encouraged to participate.',
      priority: 'LOW',
      category: 'Events',
      date: 'Oct 27, 2025 • 4:15 PM',
      postedBy: 'Drama Club - Ms. Pooja Agarwal',
      views: 356,
      bannerImage: false,
      attachments: []
    },
    {
      id: 30,
      title: 'Environmental Science Project Exhibition',
      description: 'Class 9 students will present their environmental science projects on December 9th. Parents are invited to attend the exhibition.',
      priority: 'MEDIUM',
      category: 'Academic',
      date: 'Oct 26, 2025 • 1:30 PM',
      postedBy: 'Science Department - Mrs. Sunita Kapoor',
      views: 423,
      bannerImage: true,
      attachments: [
        { name: 'Project_Guidelines.pdf', size: '1.4 MB' }
      ]
    },
    {
      id: 31,
      title: 'School Magazine 2025 Released',
      description: 'The annual school magazine featuring student articles, poems, and artwork is now available. Collect your copy from the school office.',
      priority: 'LOW',
      category: 'Achievements',
      date: 'Oct 25, 2025 • 9:45 AM',
      postedBy: 'Editorial Team - Ms. Reshma Nair',
      views: 567,
      bannerImage: true,
      attachments: []
    },
    {
      id: 32,
      title: 'Playground Maintenance Schedule',
      description: 'The school playground will undergo maintenance from November 27-29. Sports activities will be conducted in the indoor sports complex during this period.',
      priority: 'MEDIUM',
      category: 'Administrative',
      date: 'Oct 24, 2025 • 7:00 AM',
      postedBy: 'Facilities Manager - Mr. Prakash Reddy',
      views: 334,
      bannerImage: false,
      attachments: []
    }
  ]);

  const categories = [
    { name: 'All', count: 32 },
    { name: 'Academic', count: 6 },
    { name: 'Administrative', count: 7 },
    { name: 'Events', count: 6 },
    { name: 'Emergency', count: 1 },
    { name: 'Class Specific', count: 3 },
    { name: 'Achievements', count: 5 },
    { name: 'Safety', count: 2 }
  ];

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    // Search filter
    if (searchQuery && !announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !announcement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Starred filter
    if (starredOnly && !starredIds.includes(announcement.id)) {
      return false;
    }

    // Priority filter
    if (selectedPriority !== 'All Priorities' && announcement.priority !== selectedPriority.toUpperCase()) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && announcement.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleStarToggle = (id) => {
    if (starredIds.includes(id)) {
      setStarredIds(starredIds.filter(starId => starId !== id));
    } else {
      setStarredIds([...starredIds, id]);
    }
  };

  const handleCreateAnnouncement = () => {
    if (!createForm.title || !createForm.description || !createForm.category || createForm.audience.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Create announcement:', createForm);
    setShowCreateModal(false);
    setCreateForm({
      title: '',
      description: '',
      priority: 'Medium',
      category: '',
      audience: [],
      bannerImage: null,
      attachments: []
    });
  };

  const handleAudienceToggle = (audienceType) => {
    if (createForm.audience.includes(audienceType)) {
      setCreateForm({
        ...createForm,
        audience: createForm.audience.filter(a => a !== audienceType)
      });
    } else {
      setCreateForm({
        ...createForm,
        audience: [...createForm.audience, audienceType]
      });
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (type === 'banner') {
        setCreateForm({ ...createForm, bannerImage: file });
      } else {
        setCreateForm({ ...createForm, attachments: [...createForm.attachments, file] });
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'critical';
      case 'HIGH':
        return 'high';
      case 'MEDIUM':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Events': 'events',
      'Academic': 'academic',
      'Administrative': 'administrative',
      'Emergency': 'emergency',
      'Class Specific': 'class-specific',
      'Achievements': 'achievements',
      'Safety': 'safety'
    };
    return colors[category] || 'default';
  };

  return (
    <div className="ann-hsu-teach-announcements" data-testid="teacher-page-announcements">
      {/* Header */}
      <div className="ann-hsu-teach-announcements__header">
        <div>
          <h1 className="ann-hsu-teach-announcements__title" data-testid="teacher-heading-announcements">
            Announcements
          </h1>
          <p className="ann-hsu-teach-announcements__subtitle">Stay updated with school announcements and notices</p>
        </div>
        <button
          className="ann-hsu-teach-announcements__create-btn"
          onClick={() => setShowCreateModal(true)}
          data-testid="teacher-button-create-announcement"
        >
          <span className="ann-hsu-teach-announcements__create-btn-icon">+</span>
          Create Announcement
        </button>
      </div>

      <div className="ann-hsu-teach-announcements__container">
        {/* Left Sidebar - Filters */}
        <div className="ann-hsu-teach-announcements__sidebar">
          <div className="ann-hsu-teach-announcements__filters">
            <h3 className="ann-hsu-teach-announcements__filters-title">
              <svg className="ann-hsu-teach-announcements__filters-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filters
            </h3>

            {/* Starred Only Toggle */}
            <div className="ann-hsu-teach-announcements__filter-group">
              <div className="ann-hsu-teach-announcements__starred-toggle">
                <span className="ann-hsu-teach-announcements__starred-label">
                  <span className="ann-hsu-teach-announcements__starred-icon">★</span>
                  Starred Only
                </span>
                <label className="ann-hsu-teach-announcements__toggle-switch">
                  <input
                    type="checkbox"
                    checked={starredOnly}
                    onChange={(e) => setStarredOnly(e.target.checked)}
                    data-testid="teacher-toggle-starred-only"
                  />
                  <span className="ann-hsu-teach-announcements__toggle-slider"></span>
                </label>
              </div>
            </div>

            {/* Priority Filter */}
            <div className="ann-hsu-teach-announcements__filter-group">
              <label className="ann-hsu-teach-announcements__filter-label">Priority</label>
              <select
                className="ann-hsu-teach-announcements__filter-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                data-testid="teacher-dropdown-priority"
              >
                <option value="All Priorities">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Categories */}
            <div className="ann-hsu-teach-announcements__filter-group">
              <label className="ann-hsu-teach-announcements__filter-label">Categories</label>
              <div className="ann-hsu-teach-announcements__categories-list">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={`ann-hsu-teach-announcements__category-item ${
                      selectedCategory === category.name ? 'ann-hsu-teach-announcements__category-item--active' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                    data-testid={`teacher-category-${category.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className="ann-hsu-teach-announcements__category-name">{category.name}</span>
                    <span className="ann-hsu-teach-announcements__category-count">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Announcements List */}
        <div className="ann-hsu-teach-announcements__content">
          {/* Search Bar */}
          <div className="ann-hsu-teach-announcements__search-section">
            <div className="ann-hsu-teach-announcements__search-bar">
              <svg className="ann-hsu-teach-announcements__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="ann-hsu-teach-announcements__search-input"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="teacher-input-search-announcements"
              />
            </div>
          </div>

          {/* Announcements List */}
          <div className="ann-hsu-teach-announcements__list">
            {filteredAnnouncements.length === 0 ? (
              <div className="ann-hsu-teach-announcements__no-results">
                <svg className="ann-hsu-teach-announcements__no-results-icon" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
                  <path d="M100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60Z" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="88" cy="92" r="5" fill="#6366F1"/>
                  <circle cx="112" cy="92" r="5" fill="#6366F1"/>
                  <path d="M85 115C85 115 90 108 100 108C110 108 115 115 115 115" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M145 145L165 165" stroke="#6366F1" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M55 55L45 45" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M145 55L155 45" stroke="#C7D2FE" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="165" cy="35" r="4" fill="#C7D2FE"/>
                  <circle cx="35" cy="165" r="4" fill="#C7D2FE"/>
                </svg>
                <h3 className="ann-hsu-teach-announcements__no-results-title">No Announcements Found</h3>
                <p className="ann-hsu-teach-announcements__no-results-text">
                  {searchQuery 
                    ? `No results match "${searchQuery}". Try different keywords or filters.`
                    : starredOnly 
                      ? "You haven't starred any announcements yet."
                      : "No announcements match your current filters."}
                </p>
                <button 
                  className="ann-hsu-teach-announcements__reset-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setStarredOnly(false);
                    setSelectedPriority('All Priorities');
                    setSelectedCategory('All');
                  }}
                  data-testid="teacher-button-reset-filters"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="ann-hsu-teach-announcements__card"
                data-testid={`teacher-announcement-card-${announcement.id}`}
              >
                {announcement.bannerImage && (
                  <div className="ann-hsu-teach-announcements__card-banner">
                    <img 
                      src={`https://picsum.photos/seed/${announcement.id}/800/200`}
                      alt={announcement.title}
                      className="ann-hsu-teach-announcements__banner-image"
                    />
                  </div>
                )}

                <div className="ann-hsu-teach-announcements__card-content">
                  <div className="ann-hsu-teach-announcements__card-header">
                    <div className="ann-hsu-teach-announcements__card-title-row">
                      <h3 className="ann-hsu-teach-announcements__card-title">{announcement.title}</h3>
                      <button
                        className={`ann-hsu-teach-announcements__star-btn ${
                          starredIds.includes(announcement.id) ? 'ann-hsu-teach-announcements__star-btn--active' : ''
                        }`}
                        onClick={() => handleStarToggle(announcement.id)}
                        data-testid={`teacher-button-star-${announcement.id}`}
                      >
                        ★
                      </button>
                    </div>
                    <span className="ann-hsu-teach-announcements__card-date">{announcement.date}</span>
                  </div>

                  <div className="ann-hsu-teach-announcements__card-badges">
                    <span
                      className={`ann-hsu-teach-announcements__priority-badge ann-hsu-teach-announcements__priority-badge--${getPriorityColor(announcement.priority)}`}
                    >
                      {announcement.priority}
                    </span>
                    <span
                      className={`ann-hsu-teach-announcements__category-badge ann-hsu-teach-announcements__category-badge--${getCategoryColor(announcement.category)}`}
                    >
                      {announcement.category}
                    </span>
                  </div>

                  <p className="ann-hsu-teach-announcements__card-description">{announcement.description}</p>

                  {announcement.attachments.length > 0 && (
                    <div className="ann-hsu-teach-announcements__card-attachments">
                      {announcement.attachments.map((attachment, index) => (
                        <div key={index} className="ann-hsu-teach-announcements__attachment">
                          <svg className="ann-hsu-teach-announcements__attachment-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FEE2E2"/>
                            <polyline points="13 2 13 9 20 9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <div className="ann-hsu-teach-announcements__attachment-info">
                            <span className="ann-hsu-teach-announcements__attachment-name">{attachment.name}</span>
                            <span className="ann-hsu-teach-announcements__attachment-size">{attachment.size}</span>
                          </div>
                          <button className="ann-hsu-teach-announcements__download-btn" data-testid={`teacher-button-download-${index}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="7 10 12 15 17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="12" y1="15" x2="12" y2="3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ann-hsu-teach-announcements__card-footer">
                    <span className="ann-hsu-teach-announcements__card-author">
                      Posted by {announcement.postedBy || 'Principal - Dr. Rajesh Kumar'}
                    </span>
                    <div className="ann-hsu-teach-announcements__card-views">
                      <svg className="ann-hsu-teach-announcements__views-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {announcement.views}
                    </div>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div
          className="ann-hsu-teach-announcements__modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="ann-hsu-teach-announcements__modal"
            onClick={(e) => e.stopPropagation()}
            data-testid="teacher-modal-create-announcement"
          >
            <div className="ann-hsu-teach-announcements__modal-header">
              <h3 className="ann-hsu-teach-announcements__modal-title">
                <svg className="ann-hsu-teach-announcements__modal-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Create New Announcement
              </h3>
              <button
                className="ann-hsu-teach-announcements__modal-close"
                onClick={() => setShowCreateModal(false)}
                data-testid="teacher-button-close-modal"
              >
                ×
              </button>
            </div>

            <div className="ann-hsu-teach-announcements__modal-body">
              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Announcement Title *</label>
                <input
                  type="text"
                  className="ann-hsu-teach-announcements__form-input"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Enter announcement title"
                  data-testid="teacher-field-title"
                />
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Description *</label>
                <textarea
                  className="ann-hsu-teach-announcements__form-textarea"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Enter detailed description"
                  rows="5"
                  data-testid="teacher-field-description"
                />
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Priority *</label>
                <select
                  className="ann-hsu-teach-announcements__form-select"
                  value={createForm.priority}
                  onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                  data-testid="teacher-dropdown-form-priority"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Category *</label>
                <select
                  className="ann-hsu-teach-announcements__form-select"
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  data-testid="teacher-dropdown-form-category"
                >
                  <option value="">Select category</option>
                  <option value="Academic">Academic</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Events">Events</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Class Specific">Class Specific</option>
                  <option value="Achievements">Achievements</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Audience *</label>
                <div className="ann-hsu-teach-announcements__audience-grid">
                  {['Students', 'Teachers', 'Management', 'All'].map((audience) => (
                    <button
                      key={audience}
                      className={`ann-hsu-teach-announcements__audience-btn ${
                        createForm.audience.includes(audience) ? 'ann-hsu-teach-announcements__audience-btn--active' : ''
                      }`}
                      onClick={() => handleAudienceToggle(audience)}
                      data-testid={`teacher-button-audience-${audience.toLowerCase()}`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Banner Image (Optional)</label>
                <div
                  className="ann-hsu-teach-announcements__upload-area"
                  onClick={() => document.getElementById('banner-input').click()}
                >
                  <svg className="ann-hsu-teach-announcements__upload-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="ann-hsu-teach-announcements__upload-text">
                    {createForm.bannerImage ? createForm.bannerImage.name : 'Click to upload banner image'}
                  </p>
                  <span className="ann-hsu-teach-announcements__upload-size">Max 5MB</span>
                </div>
                <input
                  id="banner-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'banner')}
                  accept="image/*"
                />
              </div>

              <div className="ann-hsu-teach-announcements__form-group">
                <label className="ann-hsu-teach-announcements__form-label">Attachments (Optional)</label>
                <div
                  className="ann-hsu-teach-announcements__upload-area"
                  onClick={() => document.getElementById('attachment-input').click()}
                >
                  <svg className="ann-hsu-teach-announcements__upload-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="ann-hsu-teach-announcements__upload-text">
                    {createForm.attachments.length > 0 
                      ? `${createForm.attachments.length} file(s) selected` 
                      : 'Click to upload PDF'}
                  </p>
                  <span className="ann-hsu-teach-announcements__upload-size">Max 5MB</span>
                </div>
                <input
                  id="attachment-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'attachment')}
                  accept=".pdf"
                />
              </div>
            </div>

            <div className="ann-hsu-teach-announcements__modal-footer">
              <button
                className="ann-hsu-teach-announcements__modal-btn ann-hsu-teach-announcements__modal-btn--cancel"
                onClick={() => setShowCreateModal(false)}
                data-testid="teacher-button-cancel-announcement"
              >
                Cancel
              </button>
              <button
                className="ann-hsu-teach-announcements__modal-btn ann-hsu-teach-announcements__modal-btn--submit"
                onClick={handleCreateAnnouncement}
                data-testid="teacher-button-submit-announcement"
              >
                Submit Announcement
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

export default Announcements;
